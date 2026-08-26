'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics'
import { remember, preferred } from '@/lib/ask-aura/affinity'

/* Site-wide PostHog runs with `person_profiles: 'always'` and a stable
   cookie, and the contact form later calls identify() with an email —
   which would merge every question anyone asked into a named profile.
   That is the opposite of what the dock tells people, so Ask Aura opts
   its own events out of person processing. They still count, segment and
   fill dashboards; they do not accumulate against an individual. */
const ANONYMOUS = { $process_person_profile: false } as const

/* ── Ask Aura ─────────────────────────────────────────────────────
   A pill at the foot of every page that opens into a conversation.

   On glass: the launcher gets real WebGL refraction from
   @ybouane/liquidglass; the panel does not. The library works by
   rasterising the DOM behind the glass into a texture, and a panel
   holding a streaming transcript would re-capture on every token —
   which is the one thing the brief rules out, and rightly. The panel
   uses backdrop-filter instead, which composites without ever reading
   the page back. One WebGL context for this feature, torn down when
   the launcher unmounts.

   Everything a visitor types is screened server-side before it reaches
   a model. This component holds no keys and makes no third-party
   calls; it talks to /api/ask-aura on the same origin.
*/

type Role = 'user' | 'assistant'
type Msg = {
  id: string
  role: Role
  text: string
  citations?: Citation[]
  suggestions?: Suggestion[]
  pending?: boolean
  failed?: boolean
  /** On an assistant turn: the question it was answering, so its own
      Try again resends that, not whatever was asked most recently. */
  question?: string
}
type Citation = { sourceId: string; title: string; url: string; sourceType: string }
type Suggestion = { label: string; intent: string }

const STORE_KEY = 'aura:ask:v1'
/* Conversations are a convenience, not a record. Long enough to survive
   reading three pages, short enough that a shared machine does not
   hand the next person your questions. */
const STORE_TTL_MS = 2 * 60 * 60 * 1000

/** Openers per section of the site, so the first view knows where it is. */
function opening(pathname: string): { line: string; prompts: string[] } {
  const p = pathname
  if (p.startsWith('/mudigere')) return {
    line: 'You are looking at Mudigere, the estate in the Western Ghats.',
    prompts: ['Why Mudigere?', 'How does the land shape the coffee?', 'Can I visit?'],
  }
  if (p.startsWith('/ohara')) return {
    line: 'This is Ohara, the second place — a garden outside Kyoto.',
    prompts: ['Why Kyoto?', 'What happens at Ohara?', 'How do the two estates relate?'],
  }
  if (p.startsWith('/regenerative-coffee') || p.startsWith('/coffee')) return {
    line: 'You are in the coffee. Ask about a lot, the ferment, or the ground it came from.',
    prompts: ['What makes each lot different?', 'How is the soil cared for?', 'Where can I taste it?'],
  }
  if (p.startsWith('/field-notes')) return {
    line: 'Field Notes — what the estate has learned, written down.',
    prompts: ['What is biodynamic practice?', 'How is biodiversity measured?', 'What happens in the labs?'],
  }
  if (p.startsWith('/reason') || p.startsWith('/brand') || p.startsWith('/idea')) return {
    line: 'This is the argument behind the whole thing.',
    prompts: ['Why does Aura exist?', 'What is natural intelligence?', 'What does generational impact mean?'],
  }
  if (p.startsWith('/atelier') || p.startsWith('/artistry') || p.startsWith('/residency')) return {
    line: 'The atelier — where the making happens.',
    prompts: ['What is the atelier?', 'Who comes to the residency?', 'How do I apply?'],
  }
  return {
    line: 'Ask me anything about Aura — the estates, the coffee, the practice.',
    prompts: ['What is Aura?', 'Where are the estates?', 'What do you grow?'],
  }
}

export default function AskAura() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [glassOn, setGlassOn] = useState(false)
  /* What a screen reader is told, separately from what the page shows.
     The transcript itself must not be a live region: a streaming answer
     mutates its text node many times a second, and announcing each
     mutation produces a stutter of half-sentences that outlasts the
     answer. Status goes here instead, once per state change. */
  const [announcement, setAnnouncement] = useState('')

  const panelRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const sessionRef = useRef<string>('')
  const titleId = useId()

  const intro = opening(pathname ?? '/')

  /* ── session id: per browser session, not per person ── */
  useEffect(() => {
    try {
      let s = sessionStorage.getItem('aura:ask:sid')
      if (!s) {
        s = crypto.randomUUID()
        sessionStorage.setItem('aura:ask:sid', s)
      }
      sessionRef.current = s
    } catch { sessionRef.current = 'anon' }
  }, [])

  /* ── restore, with an expiry ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as { v: number; at: number; msgs: Msg[] }
      if (saved.v !== 1 || Date.now() - saved.at > STORE_TTL_MS) {
        localStorage.removeItem(STORE_KEY)
        return
      }
      setMsgs(saved.msgs.filter((m) => !m.pending))
    } catch { /* corrupt or unavailable — start fresh */ }
  }, [])

  /* Written after the conversation settles, not mid-answer: serialising
     the whole transcript on every frame of every stream is main-thread
     work the visitor pays for and nobody needs. A half-written answer is
     not worth restoring anyway. */
  useEffect(() => {
    if (!msgs.length) return
    const t = setTimeout(() => {
      try {
        const settled = msgs.filter((m) => !m.pending)
        if (settled.length) {
          localStorage.setItem(STORE_KEY, JSON.stringify({ v: 1, at: Date.now(), msgs: settled }))
        }
      } catch { /* private mode, quota — the conversation still works */ }
    }, 400)
    return () => clearTimeout(t)
  }, [msgs])

  /* ── real glass on the launcher only ── */
  useEffect(() => {
    if (open) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let instance: { destroy: () => void } | null = null
    let cancelled = false

    /* After idle, never on the critical path: this pulls a WebGL
       library for an effect nobody is waiting on. */
    const idle = (window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1200)))(async () => {
      try {
        const el = launcherRef.current
        if (!el || cancelled) return
        const gl = document.createElement('canvas').getContext('webgl2')
        if (!gl) return
        const { LiquidGlass } = await import('@ybouane/liquidglass')
        if (cancelled) return
        instance = await LiquidGlass.init({
          root: document.body,
          glassElements: [el],
        })
        if (cancelled) { instance?.destroy(); instance = null; return }
        setGlassOn(true)
      } catch {
        /* No WebGL, blocked context, or the library changed shape —
           the CSS underneath is a complete look on its own. */
      }
    })

    return () => {
      cancelled = true
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle as number)
      instance?.destroy()
      setGlassOn(false)
    }
  }, [open])

  /* Nothing should outlive the component: an unmount mid-answer used to
     leave the fetch and its reader running to completion. */
  useEffect(() => () => abortRef.current?.abort(), [])

  /* ── focus + escape ── */
  /* Closing unmounts the panel and remounts the launcher, so the
     launcher cannot be focused in the same tick that asks for the
     close — the element does not exist yet. The intent is recorded and
     acted on after the next commit. */
  const wantsLauncherFocus = useRef(false)
  const close = useCallback(() => {
    wantsLauncherFocus.current = true
    setOpen(false)
    setAnnouncement('')
  }, [])

  useEffect(() => {
    if (open || !wantsLauncherFocus.current) return
    wantsLauncherFocus.current = false
    launcherRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey) }
  }, [open, close])

  /* Follow the answer down only if the reader was already at the
     bottom. Yanking them back while they are reading an earlier answer
     is the rudest thing a transcript can do. */
  useEffect(() => {
    const el = logRef.current
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distance < 120) el.scrollTop = el.scrollHeight
  }, [msgs])

  /* History for the next request, read at send time. Depending on `msgs`
     directly would rebuild `send` on every token of every answer. */
  const msgsRef = useRef<Msg[]>([])
  useEffect(() => { msgsRef.current = msgs }, [msgs])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setBusy(false)
    setMsgs((m) => m.map((x) => (x.pending ? { ...x, pending: false } : x)))
  }, [])

  const send = useCallback(async (text: string) => {
    const question = text.trim()
    if (!question || busy) return

    const started = performance.now()
    const turn = msgsRef.current.filter((m) => m.role === 'user').length + 1
    /* Nothing is captured here, on purpose. Firing at send time would
       record that a question was asked before knowing what kind it was —
       and someone who typed the worst sentence of their life would leave
       a timestamped trace of having done so. The single event fires
       once the outcome is known, below, and not at all for distress. */

    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', text: question }
    const replyId = crypto.randomUUID()
    setMsgs((m) => [...m, userMsg, { id: replyId, role: 'assistant', text: '', pending: true, question }])
    setInput('')
    setBusy(true)
    setAnnouncement('Aura is answering.')

    const ctl = new AbortController()
    abortRef.current = ctl

    try {
      const res = await fetch('/api/ask-aura', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: ctl.signal,
        body: JSON.stringify({
          message: question,
          sessionId: sessionRef.current,
          history: msgsRef.current.slice(-8).map((m) => ({ role: m.role, content: m.text })),
          pageContext: {
            url: typeof location !== 'undefined' ? location.href : '',
            route: pathname,
            title: typeof document !== 'undefined' ? document.title : '',
            selection: (typeof window !== 'undefined' ? String(window.getSelection() ?? '') : '').slice(0, 600),
          },
        }),
      })
      if (!res.ok || !res.body) throw new Error(`http ${res.status}`)

      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''

      /* Tokens arrive faster than a screen can show them. Each one used
         to be its own render, its own write to localStorage and its own
         forced layout for the autoscroll — work a mid-range phone feels.
         They are buffered and committed a frame at a time instead. */
      let pendingText = ''
      let frame = 0
      const flush = () => {
        frame = 0
        if (!pendingText) return
        const chunk = pendingText
        pendingText = ''
        setMsgs((m) => m.map((x) => (x.id === replyId ? { ...x, text: x.text + chunk } : x)))
      }
      const scheduleFlush = () => {
        if (frame) return
        frame = requestAnimationFrame(flush)
      }

      /* A stream that stops early is a failure, however much text it
         managed first. Only `meta` or `done` says the answer finished. */
      let completed = false
      let streamError = false
      let insight: Record<string, unknown> | null = null

      try {
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buf += dec.decode(value, { stream: true })
          const frames = buf.split('\n\n')
          buf = frames.pop() ?? ''
          for (const chunk of frames) {
            const evt = /^event: (.+)$/m.exec(chunk)?.[1]
            const dataLine = /^data: (.+)$/m.exec(chunk)?.[1]
            if (!dataLine) continue
            let data: Record<string, unknown>
            try { data = JSON.parse(dataLine) } catch { continue }

            if (evt === 'token' && typeof data.t === 'string') {
              pendingText += data.t
              scheduleFlush()
            } else if (evt === 'meta') {
              completed = true
              insight = (data.insight as Record<string, unknown>) ?? null
              flush()
              if (frame) { cancelAnimationFrame(frame); frame = 0 }
              setMsgs((m) => m.map((x) => (x.id === replyId ? {
                ...x,
                pending: false,
                citations: (data.citations as Citation[]) ?? [],
                suggestions: (data.suggestions as Suggestion[]) ?? [],
              } : x)))
            } else if (evt === 'done') {
              completed = true
            } else if (evt === 'error') {
              streamError = true
            }
          }
        }
      } finally {
        if (frame) cancelAnimationFrame(frame)
        flush()
      }

      if (streamError || !completed) throw new Error(streamError ? 'stream error' : 'stream ended early')

      setMsgs((m) => m.map((x) => (x.id === replyId ? { ...x, pending: false } : x)))
      setAnnouncement('Answer complete.')
      /* The insight is a fixed set of labels — intent, topics, coverage,
         whether the corpus could answer at all — plus the question only
         when it needed no redaction and reads as an ordinary question.
         See lib/ask-aura/privacy.ts for what may and may not travel. */
      /* Distress leaves no record whatsoever — not the labels, not the
         timing, not the page. A refusal class attached to a timestamp is
         still a description of what happened to someone, and there is no
         product question worth answering that needs it. The other
         refusal kinds are counted, because knowing the volume of abuse
         and injection attempts is how the boundary gets maintained. */
      const refusal = insight?.refusal as string | undefined
      if (refusal !== 'self_harm') {
        track('ask_aura_answered', {
          page: pathname,
          ms: Math.round(performance.now() - started),
          turn,
          ...(insight ?? {}),
          ...ANONYMOUS,
        })
      }
      /* The same labels, kept on this device only, so the dock can put
         what this visitor keeps returning to at the top of the next set
         of suggestions. Nothing here is sent anywhere. */
      if (!refusal) {
        remember({
          topics: (insight?.topics as string[]) ?? [],
          intent: insight?.intent as string | undefined,
        })
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setMsgs((m) => m.map((x) => (x.id === replyId
        ? { ...x, pending: false, failed: true, text: x.text || 'I could not reach my sources just then.' }
        : x)))
      setAnnouncement('That answer did not arrive.')
      track('ask_aura_error', { page: pathname, kind: 'network', ...ANONYMOUS })
    } finally {
      /* Only the request that still owns the controller may clear the
         busy flag. Stopping one answer and immediately asking another
         used to let the first one's teardown switch off the second's
         Stop button, leaving a live stream nobody could abort. */
      if (abortRef.current === ctl) {
        abortRef.current = null
        setBusy(false)
      }
    }
  }, [busy, pathname])

  const clear = () => {
    stop()
    setMsgs([])
    try { localStorage.removeItem(STORE_KEY) } catch { /* fine */ }
    inputRef.current?.focus()
  }

  const lastUser = [...msgs].reverse().find((m) => m.role === 'user')
  const tail = msgs[msgs.length - 1]
  /* Nudged, not reordered: `preferred` is a stable sort, so anything the
     model ranked equally keeps the order it gave. */
  const followUps = tail?.role === 'assistant' && !tail.pending
    ? preferred(tail.suggestions ?? [])
    : []

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          className={`aa-launch ${glassOn ? 'is-glass' : ''}`}
          onClick={() => { setOpen(true); track('ask_aura_opened', { page: pathname, ...ANONYMOUS }) }}
          aria-haspopup="dialog"
        >
          <span className="aa-dot" aria-hidden />
          Ask Aura
        </button>
      )}

      {open && (
        <div
          /* `ph-no-capture` on the panel, not just the composer: session
             replay records rendered DOM, so masking the input while leaving
             the transcript visible would capture every question and answer
             as pixels — a fuller record than the analytics property this
             file works so hard not to send. */
          className="aa-panel ph-no-capture"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <header className="aa-head">
            <h2 className="aa-title" id={titleId}>Ask Aura</h2>
            <div className="aa-head-acts">
              {msgs.length > 0 && (
                <button type="button" className="aa-mini" onClick={clear}>Clear</button>
              )}
              <button
                type="button"
                className="aa-close"
                onClick={close}
                aria-label="Close Ask Aura"
              >
                <span aria-hidden>×</span>
              </button>
            </div>
          </header>

          <p className="aa-status" role="status" aria-live="polite">{announcement}</p>

          <div className="aa-log" ref={logRef}>
            {msgs.length === 0 && (
              <div className="aa-intro">
                <p className="aa-intro-line">{intro.line}</p>
                <ul className="aa-chips">
                  {intro.prompts.map((p, i) => (
                    <li key={p}>
                      <button
                        type="button"
                        className="aa-chip"
                        onClick={() => { track('ask_aura_suggestion', { page: pathname, kind: 'opener', position: i, ...ANONYMOUS }); send(p) }}
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {msgs.map((m) => (
              <div key={m.id} className={`aa-msg is-${m.role} ${m.failed ? 'is-failed' : ''}`}>
                {m.role === 'assistant' && m.pending && !m.text && (
                  <span className="aa-thinking" aria-label="Thinking">
                    <i /><i /><i />
                  </span>
                )}
                {m.text && <p className="aa-text">{m.text}</p>}

                {m.failed && (m.question ?? lastUser?.text) && (
                  <button type="button" className="aa-mini" onClick={() => send(m.question ?? lastUser?.text ?? '')}>
                    Try again
                  </button>
                )}

                {m.role === 'assistant' && !!m.citations?.length && (
                  <ul className="aa-cites">
                    {m.citations.map((c) => (
                      <li key={c.sourceId}>
                        <a
                          href={c.url}
                          onClick={() => track('ask_aura_citation', { page: pathname, url: c.url, ...ANONYMOUS })}
                        >
                          {c.title.split(' › ')[0].replace(/\s*—\s*Aura$/, '')}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {followUps.length > 0 && (
              <ul className="aa-chips aa-chips-follow">
                {followUps.map((s, i) => (
                  <li key={s.label}>
                    <button
                      type="button"
                      className="aa-chip"
                      onClick={() => { track('ask_aura_suggestion', { page: pathname, kind: 'follow_up', position: i, intent: s.intent, ...ANONYMOUS }); send(s.label) }}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            className="aa-form"
            onSubmit={(e) => { e.preventDefault(); send(input) }}
          >
            <textarea
              ref={inputRef}
              className="aa-input ph-no-capture"
              rows={1}
              value={input}
              placeholder="Ask about the estates, the coffee…"
              maxLength={1200}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
              }}
              aria-label="Your question"
            />
            {busy ? (
              <button type="button" className="aa-send" onClick={stop} aria-label="Stop generating">
                Stop
              </button>
            ) : (
              <button type="submit" className="aa-send" disabled={!input.trim()}>
                Ask
              </button>
            )}
          </form>

          <p className="aa-terms">
            Answers come from Aura&rsquo;s own pages and can be wrong. Your
            question is not recorded — we keep only the subject it was about,
            and nothing that identifies you.
          </p>
        </div>
      )}

      <style jsx global>{`
        /* ── launcher ── */
        .aa-launch {
          position: fixed;
          left: 50%;
          bottom: max(20px, env(safe-area-inset-bottom, 0px));
          transform: translateX(-50%);
          z-index: 45;
          display: inline-flex; align-items: center; gap: 9px;
          min-height: 44px; padding: 11px 20px;
          border-radius: 999px;
          /* This floats over whatever the page happens to be — a dark
             hero video, a white editorial spread. It cannot borrow theme
             tokens and stay legible, so it carries its own ground and
             holds WCAG AA against both. */
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(19, 23, 25, 0.72);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          color: #fff;
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.14);
          transition: transform var(--dur-base) var(--ease-out),
                      border-color var(--dur-base) var(--ease);
        }
        .aa-launch:hover { transform: translateX(-50%) translateY(-2px); border-color: var(--brand-accent); }
        /* Heard, not seen. Kept in the layout rather than display:none,
           which some screen readers skip entirely. */
        .aa-status {
          position: absolute;
          width: 1px; height: 1px;
          margin: -1px; padding: 0; border: 0;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        .aa-launch:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 3px; }
        /* With the shader on, the blur is redundant — it refracts the
           page itself. The tint stays: refraction of a dark hero is
           still dark, and the label has to survive both. */
        .aa-launch.is-glass {
          backdrop-filter: none; -webkit-backdrop-filter: none;
          background: rgba(19, 23, 25, 0.55);
        }
        .aa-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--brand-accent); flex: none;
        }

        /* ── panel ── */
        .aa-panel {
          /* The site's --text-muted and --text-dim are decorative weights
             tuned for large display type over imagery. Here they land on
             9–11px functional labels — Clear, Close, citations, the terms
             line — where they measure 2.6:1 in day theme and fail AA
             outright. The dock uses its own weight instead: 8.5:1 on the
             night ground, 5.9:1 on the day one, in both cases against the
             panel's own near-opaque background rather than whatever
             happens to be behind it. */
          --aa-meta: color-mix(in srgb, var(--text) 68%, transparent);
          position: fixed;
          right: max(20px, env(safe-area-inset-right, 0px));
          bottom: max(20px, env(safe-area-inset-bottom, 0px));
          z-index: 46;
          width: min(420px, calc(100vw - 40px));
          max-height: min(620px, calc(100dvh - 120px));
          display: flex; flex-direction: column;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-2);
          /* Readability beats translucency here. The brief is explicit
             that the transcript stays crisp, and this panel floats over
             hero video as often as over white — 97% keeps AA contrast
             on both while the edge still reads as glass. */
          background: color-mix(in oklab, var(--bg) 97%, transparent);
          backdrop-filter: blur(28px) saturate(1.4);
          -webkit-backdrop-filter: blur(28px) saturate(1.4);
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
          color: var(--text);
          overflow: hidden;
          animation: aa-in var(--dur-slow) var(--ease-out);
        }
        @keyframes aa-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        .aa-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 14px 12px 18px;
          border-bottom: 1px solid var(--border);
          flex: none;
        }
        .aa-title {
          margin: 0;
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase;
          font-weight: 400; color: var(--aa-meta);
        }
        .aa-head-acts { display: flex; align-items: center; gap: 4px; }
        .aa-mini {
          background: none; border: 0; cursor: pointer;
          font-family: var(--font-mono), monospace;
          font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--aa-meta); padding: 8px;
          transition: color var(--dur-base) var(--ease);
        }
        .aa-mini:hover { color: var(--brand-accent); }
        .aa-close {
          background: none; border: 0; cursor: pointer;
          width: 32px; height: 32px; font-size: 20px; line-height: 1;
          color: var(--aa-meta);
        }
        .aa-close:hover { color: var(--text); }
        .aa-mini:focus-visible, .aa-close:focus-visible {
          outline: 2px solid var(--brand-accent); outline-offset: 2px;
        }

        .aa-log {
          flex: 1 1 auto; overflow-y: auto;
          padding: 18px;
          display: flex; flex-direction: column; gap: 18px;
          scrollbar-width: thin;
        }

        .aa-intro { display: flex; flex-direction: column; gap: 14px; }
        .aa-intro-line {
          margin: 0; font-size: 15px; line-height: 1.55; color: var(--text-body);
        }

        .aa-chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
        .aa-chips-follow { margin-top: -4px; }
        .aa-chip {
          font-family: var(--font-mono), monospace;
          font-size: 10.5px; letter-spacing: 0.6px;
          padding: 8px 12px; min-height: 32px;
          border: 1px solid var(--border-strong); border-radius: 999px;
          background: transparent; color: var(--text-body); cursor: pointer;
          text-align: left;
          transition: color var(--dur-base) var(--ease), border-color var(--dur-base) var(--ease);
        }
        .aa-chip:hover { color: var(--brand-accent); border-color: var(--brand-accent); }
        .aa-chip:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 2px; }

        .aa-msg { display: flex; flex-direction: column; gap: 8px; }
        .aa-msg.is-user { align-items: flex-end; }
        .aa-msg.is-user .aa-text {
          background: color-mix(in oklab, var(--brand-accent) 14%, transparent);
          border: 1px solid color-mix(in oklab, var(--brand-accent) 30%, transparent);
          border-radius: var(--radius-2);
          padding: 9px 12px;
          max-width: 88%;
        }
        .aa-text {
          margin: 0; font-size: 14.5px; line-height: 1.62;
          color: var(--text); white-space: pre-wrap; text-wrap: pretty;
        }
        .aa-msg.is-failed .aa-text { color: var(--aa-meta); }

        .aa-thinking { display: inline-flex; gap: 4px; align-items: center; height: 18px; }
        .aa-thinking i {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--aa-meta);
          animation: aa-pulse 1.2s var(--ease) infinite;
        }
        .aa-thinking i:nth-child(2) { animation-delay: 0.15s; }
        .aa-thinking i:nth-child(3) { animation-delay: 0.3s; }
        @keyframes aa-pulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }

        .aa-cites { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 12px; }
        .aa-cites a {
          font-family: var(--font-mono), monospace;
          font-size: 9.5px; letter-spacing: 0.8px; text-transform: uppercase;
          color: var(--aa-meta); text-decoration: none;
          border-bottom: 1px solid var(--border-strong);
          padding-bottom: 1px;
        }
        .aa-cites a:hover { color: var(--brand-accent); border-color: var(--brand-accent); }

        .aa-form {
          flex: none; display: flex; gap: 8px; align-items: flex-end;
          padding: 12px 14px; border-top: 1px solid var(--border);
        }
        .aa-input {
          flex: 1 1 auto; resize: none;
          font-family: var(--font-sans); font-size: 15px; line-height: 1.45;
          /* 16px on iOS avoids the zoom-on-focus jump; 15 is fine elsewhere. */
          /* Two lines of placeholder without clipping. */
          min-height: 48px; max-height: 120px;
          padding: 10px 10px;
          border: 1px solid var(--border-strong); border-radius: var(--radius-2);
          background: color-mix(in oklab, var(--bg) 60%, transparent);
          color: var(--text);
        }
        .aa-input::placeholder { color: var(--aa-meta); }
        .aa-input:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 1px; }
        .aa-send {
          flex: none; min-height: 40px; padding: 0 16px;
          border: 0; border-radius: var(--radius-2);
          /* White on this orange measures 3.15:1. The brand's own ink on
             the same orange measures 5.7:1 and looks more deliberate. */
          background: var(--brand-accent); color: #131719; cursor: pointer;
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          transition: filter var(--dur-base) var(--ease);
        }
        .aa-send:hover:not(:disabled) { filter: brightness(1.08); }
        .aa-send:disabled { opacity: 0.55; cursor: default; }
        .aa-send:focus-visible { outline: 2px solid var(--text); outline-offset: 2px; }

        .aa-terms {
          flex: none; margin: 0;
          padding: 0 14px 12px;
          font-family: var(--font-mono), monospace;
          font-size: 10px; line-height: 1.5; letter-spacing: 0.3px;
          color: var(--aa-meta);
        }

        /* ── phone: a sheet, not a floating card ── */
        @media (max-width: 620px) {
          .aa-panel {
            right: 0; left: 0; bottom: 0;
            width: 100%;
            max-height: 86dvh;
            border-radius: var(--radius-2) var(--radius-2) 0 0;
            border-left: 0; border-right: 0; border-bottom: 0;
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }
          .aa-input { font-size: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .aa-panel { animation: none; }
          .aa-thinking i { animation: none; opacity: 0.6; }
          .aa-launch { transition: none; }
          .aa-launch:hover { transform: translateX(-50%); }
        }

        /* Agent view renders the page as plain text; a floating chat
           widget is chrome, and chrome is not content. */
        [data-view='agent'] .aa-launch,
        [data-view='agent'] .aa-panel { display: none !important; }
      `}</style>
    </>
  )
}
