'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* The motion scale, mirrored from globals.css so the JS that unmounts a
   thing waits exactly as long as the CSS that animates it out. Reading
   them here rather than guessing is what stops an exit being cut off
   halfway when someone retunes a token. */
const DUR = { fast: 150, base: 250, slow: 450 } as const
import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics'
import { remember, preferred } from '@/lib/ask-aura/affinity'
import OPENERS from '@/data/ask-aura/openers.json'

/* Site-wide PostHog runs with `person_profiles: 'always'` and a stable
   cookie, and the contact form later calls identify() with an email —
   which would merge every question anyone asked into a named profile.
   That is the opposite of what the dock tells people, so Ask Aura opts
   its own events out of person processing. They still count, segment and
   fill dashboards; they do not accumulate against an individual. */
const ANONYMOUS = { $process_person_profile: false } as const

/* ── Ask Aura ─────────────────────────────────────────────────────
   A pill at the foot of every page that opens into a conversation.

   On glass: the bar is solid black and the panel is a dark translucent
   pane over a blurred page. There was a WebGL refraction on the bar
   until the bar went opaque — a shader that refracts what is behind an
   element has nothing to do when nothing is behind it — so it went, and
   with it a WebGL context, a dynamic import and a per-frame DOM
   rasterisation. The dependency has gone too; see the commit that
   removed it for why that mattered more than the bytes.

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
type Citation = {
  sourceId: string; title: string; url: string; sourceType: string
  image?: string; page?: string
}
type Suggestion = { label: string; intent: string }

const STORE_KEY = 'aura:ask:v1'
/* Conversations are a convenience, not a record. Long enough to survive
   reading three pages, short enough that a shared machine does not
   hand the next person your questions. */
const STORE_TTL_MS = 2 * 60 * 60 * 1000

/** Openers per section of the site, so the first view knows where it is. */
/* Openers are generated at ingest time from what each page actually
   contains — see scripts/ask-aura/ingest.mjs — so every page in the
   corpus gets its own, not just the handful anyone remembered to write.
   Imported rather than fetched: it is a few kilobytes, and the dock
   should cost nothing at the moment it opens. */
function opening(pathname: string): { line: string; prompts: string[] } {
  const route = (pathname || '/').replace(/\/+$/, '') || '/'
  const generated = (OPENERS as Record<string, { line: string; prompts: string[] }>)[route]
  if (generated?.prompts?.length) return generated

  /* A route the corpus has not seen — a new page, or one behind a
     redirect. Fall back to its section, then to the general opening. */
  const section = route.split('/')[1] ?? ''
  const sibling = Object.entries(OPENERS as Record<string, { line: string; prompts: string[] }>)
    .find(([r]) => section && r.startsWith(`/${section}`))
  if (sibling) return sibling[1]

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
  /* What a screen reader is told, separately from what the page shows.
     The transcript itself must not be a live region: a streaming answer
     mutates its text node many times a second, and announcing each
     mutation produces a stutter of half-sentences that outlasts the
     answer. Status goes here instead, once per state change. */
  const [announcement, setAnnouncement] = useState('')
  /* Which of the page's questions the closed bar is showing. It cycles,
     so the bar advertises what this page can actually answer instead of
     asking to be clicked. */
  const [tick, setTick] = useState(0)
  /* Opening animates and closing did not, so the panel arrived and then
     vanished. It stays mounted for the length of its exit. */
  const [closing, setClosing] = useState(false)
  /* The bar stays out of the first screen. A hero is the one part of a
     page that is composed, and a chat bar parked across it is the thing
     that spoils the composition — so it waits until the reader has gone
     past and then slides up. */
  const [past, setPast] = useState(false)
  const intro = opening(pathname ?? '/')
  const teaser = intro.prompts[tick % Math.max(intro.prompts.length, 1)] ?? 'Ask about the estates'
  /* The question on its way out. Without it only the arriving line
     moved and the old one simply blinked off, which reads as a swap
     rather than a roll. */
  const [leaving, setLeaving] = useState<string | null>(null)
  const shownRef = useRef(teaser)
  useEffect(() => {
    if (shownRef.current === teaser) return
    setLeaving(shownRef.current)
    shownRef.current = teaser
    const t = setTimeout(() => setLeaving(null), DUR.slow)
    return () => clearTimeout(t)
  }, [teaser])

  const panelRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const sessionRef = useRef<string>('')


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

  useEffect(() => {
    if (typeof window === 'undefined') return
    let frame = 0
    const read = () => {
      frame = 0
      setPast(window.scrollY > window.innerHeight * 0.75)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  /* The bar ticks only while it is the thing on screen, and not at all
     for a visitor who asked for less motion — for them it settles on the
     first question, which is the one most people want anyway. */
  useEffect(() => {
    if (open) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((n) => n + 1), 4200)
    return () => clearInterval(id)
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const close = useCallback(() => {
    wantsLauncherFocus.current = true
    setAnnouncement('')
    const reduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setOpen(false); return }
    setClosing(true)
    closeTimer.current = setTimeout(() => {
      setClosing(false)
      setOpen(false)
    }, DUR.base)
  }, [])
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

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
          className={`aa-launch ${past ? 'is-in' : ''}`}
          tabIndex={past ? 0 : -1}
          aria-hidden={!past}
          onClick={() => { setOpen(true); track('ask_aura_opened', { page: pathname, ...ANONYMOUS }) }}
          aria-haspopup="dialog"
          /* A stable name. The visible text moves, and a label that
             changes under a screen reader every few seconds is a moving
             target rather than a control. */
          aria-label="Ask Aura"
        >
          <span className="aa-launch-tick" aria-hidden>
            {leaving && <span key={`out-${leaving}`} className="aa-launch-q is-out">{leaving}</span>}
            <span key={teaser} className="aa-launch-q">{teaser}</span>
          </span>
        </button>
      )}

      {open && (
        <>
        <div
          className={`aa-scrim ${closing ? 'is-closing' : ''}`}
          aria-hidden
          /* Inline for the same reason as the panel: styled-jsx drops
             backdrop-filter from the emitted rules on this build. */
          style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
        />
        <div
          /* `ph-no-capture` on the panel, not just the composer: session
             replay records rendered DOM, so masking the input while leaving
             the transcript visible would capture every question and answer
             as pixels — a fuller record than the analytics property this
             file works so hard not to send. */
          className={`aa-panel ph-no-capture ${closing ? 'is-closing' : ''}`}
          /* backdrop-filter is set inline: styled-jsx drops it from the
             emitted rules on this build, the same way it does for the
             article slider's fade and the menu vignette. Below 768px the
             site kills backdrop-filter globally for scroll cost, and an
             !important stylesheet rule beats an inline one — so mobile
             loses the blur automatically and takes the heavier scrim
             defined alongside the media query. */
          style={{ backdropFilter: 'blur(52px) saturate(1.8)', WebkitBackdropFilter: 'blur(52px) saturate(1.8)' }}
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Ask Aura"
        >
          <header className="aa-head">
            {/* The mark as drawn: a white outline on the panel's own
                dark ground. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="aa-mark" src="/ask-aura.svg" alt="" aria-hidden />
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
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </header>

          <p className="aa-status" role="status" aria-live="polite">{announcement}</p>

          <div className="aa-log" ref={logRef}>
            {msgs.length === 0 && (
              <div className="aa-intro">
                <p className="aa-intro-line">{intro.line}</p>
                {/* Said once, with the sentence it qualifies, before
                    anyone has typed. Pinned under every answer it was
                    furniture; here it is read and then forgotten. */}
<p className="aa-terms">
                  Based on Aura Natural Intelligence. Can be wrong. We keep no
                  records of the conversation.
                </p>
                <ul className="aa-chips">
                  {preferred(intro.prompts.map((label) => ({ label }))).map(({ label: p }, i) => (
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
                {m.text && (m.role === 'assistant'
                  ? (() => {
                      /* The prompt asks for a headline, a blank line, then
                         the explanation. Split on the first line break so
                         the headline sets as soon as it has arrived rather
                         than waiting for the whole answer. A reply with no
                         break — a refusal, a clarifying question — is all
                         body, which is what it should be. */
                      const [first, ...rest] = m.text.split('\n')
                      const body = rest.join('\n').trim()
                      const isHeadline = body.length > 0 && first.trim().length <= 90
                      return isHeadline ? (
                        <>
                          <p className="aa-head-line">{first.trim()}</p>
                          <p className="aa-text">{body}</p>
                        </>
                      ) : (
                        <p className="aa-text">{m.text}</p>
                      )
                    })()
                  : <p className="aa-text">{m.text}</p>)}

                {m.failed && (m.question ?? lastUser?.text) && (
                  <button type="button" className="aa-mini" onClick={() => send(m.question ?? lastUser?.text ?? '')}>
                    Try again
                  </button>
                )}

                {m.role === 'assistant' && !!m.citations?.length && (
                  <>
                  {/* Named, so the rows read as where the answer came
                      from rather than as a list of things to click. */}
                  <p className="aa-cites-label">Sources</p>
                  <ul className="aa-cites">
                    {m.citations.map((c) => {
                      const name = c.page || c.title.split(' › ')[0].replace(/\s*—\s*Aura$/, '')
                      return (
                        <li key={c.sourceId}>
                          <a
                            className="aa-card"
                            href={c.url}
                            /* A new tab, so following a source does not
                               cost the reader the conversation they were
                               having. `noopener` because the opened page
                               has no business reaching back into this
                               one. */
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${name} — opens in a new tab`}
                            onClick={() => track('ask_aura_citation', { page: pathname, url: c.url, ...ANONYMOUS })}
                          >
                            <span
                              className="aa-card-thumb"
                              aria-hidden
                              style={c.image ? { backgroundImage: `url(${c.image})` } : undefined}
                            />
                            <span className="aa-card-title">{name}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                  </>
                )}
              </div>
            ))}

            {followUps.length > 0 && (
              <div className="aa-follow">
                <p className="aa-list-label">Ask next</p>
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
              </div>
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
                {/* Phosphor — stop */}
                <svg viewBox="0 0 256 256" width="18" height="18" aria-hidden focusable="false">
                  <path fill="currentColor" d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Z" />
                </svg>
              </button>
            ) : (
              <button type="submit" className="aa-send" disabled={!input.trim()} aria-label="Send question">
                {/* Phosphor — paper-plane-tilt, fill */}
                <svg viewBox="0 0 256 256" width="20" height="20" aria-hidden focusable="false">
                  <path
                    fill="currentColor"
                    d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2h.15A16,16,0,0,1,231.4,44.34Z"
                  />
                </svg>
              </button>
            )}
          </form>

        </div>
        </>
      )}

      <style jsx global>{`
        /* Registered so the conic gradient's angle animates smoothly
           instead of snapping between keyframes. Browsers without
           @property simply hold the ring still, which still reads as an
           outline. */
        @property --aa-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        /* ── launcher ── */
        /* Closed, this is a chat bar rather than a button: the width of
           a place to type, showing one of the questions this page can
           actually answer and changing it every few seconds. A pill that
           says "Ask Aura" asks to be clicked; a bar that says "How do you
           compost the herd's dung?" tells the reader what they would get.

           It floats over whatever the page happens to be — a dark hero
           video, a white editorial spread — so it cannot borrow theme
           tokens and stay legible. It carries its own ground and holds
           WCAG AA against both. */
        .aa-launch {
          position: fixed;
          left: 50%;
          bottom: max(20px, env(safe-area-inset-bottom, 0px));
          transform: translateX(-50%);
          /* Over everything: the menu overlay sits at 102 and the term
             tooltip at 1000, and the dock has to clear both. The
             fullscreen film player at 9999 is deliberately left above —
             a chat panel over a film playing full screen is not
             something anyone asked for. */
          z-index: 1200;
          /* Small until wanted. It sits over the page for the whole
             visit, so at rest it takes only the room a hint needs, and
             opens to the width of a place to type when the pointer or
             the keyboard arrives. */
          width: min(360px, calc(100vw - 32px));
          display: flex; align-items: center; gap: 8px;
          min-height: 40px; padding: 0 18px;
          border-radius: 999px;
          border: 0;
          /* Solid black. Over a hero video, a white spread or an
             editorial page it is the same object every time, which a
             translucent ground could never be. */
          background: #000;
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          color: #fff;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 10px 34px rgba(0, 0, 0, 0.22);
          /* Out of the way, and out of the tab order, until it is due. */
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(18px);
          transition: transform var(--dur-slow) var(--ease-out),
                      opacity var(--dur-slow) var(--ease-out),
                      background var(--dur-base) var(--ease);
        }
        .aa-launch.is-in {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        /* The outline is a light travelling round the pill rather than a
           border sitting on it. A conic gradient is painted into a ring
           — two masks, one clipped to the padding box, composited to
           leave only the 1px edge — and the gradient's own angle is
           animated, which needs @property to interpolate rather than
           jump. Colours are the estate's: the brand orange, a leaf
           green, a mist teal and a dusk violet, back to orange. */
        .aa-launch::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(
            from var(--aa-angle),
            rgba(227, 113, 40, 0.95),
            rgba(214, 196, 108, 0.9),
            rgba(122, 176, 130, 0.85),
            rgba(120, 178, 190, 0.9),
            rgba(160, 140, 200, 0.85),
            rgba(227, 113, 40, 0.95)
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          opacity: 0.55;
          transition: opacity var(--dur-base) var(--ease);
          animation: aa-orbit 7s linear infinite;
          pointer-events: none;
        }
        .aa-launch.is-in:hover::before,
        .aa-launch.is-in:focus-visible::before { opacity: 1; }
        @keyframes aa-orbit { to { --aa-angle: 360deg; } }

        /* The text sits above the ring. */
        .aa-launch-tick { position: relative; z-index: 1; }
        /* Hover is the same bar, lit: the ground lifts, the border
           brightens and the question comes up to full white. The width
           does not move — a control that resizes under the cursor makes
           the reader chase it, and the question it is showing was
           already readable. */
        .aa-launch.is-in:hover,
        .aa-launch.is-in:focus-visible {
          background: #111;
          box-shadow: 0 14px 44px rgba(0, 0, 0, 0.34);
        }
        .aa-launch.is-in:hover .aa-launch-q,
        .aa-launch.is-in:focus-visible .aa-launch-q { color: #fff; }
        .aa-launch.is-in:hover { transform: translateX(-50%) translateY(-2px); }

        /* One line high and clipped, so a question leaving and the next
           arriving never change the height of the bar. */
        /* Both questions occupy the same cell, so one can leave while
           the other arrives without the bar changing height. */
        .aa-launch-tick {
          flex: 1 1 auto; min-width: 0;
          display: grid;
          align-items: center;
          height: 20px;
          overflow: hidden;
        }
        .aa-launch-tick > * { grid-area: 1 / 1; }
        .aa-launch-q {
          display: block; width: 100%;
          position: relative; top: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 13px; line-height: 1.4; font-weight: 400;
          color: rgba(255, 255, 255, 0.82);
          text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          animation: aa-tick-in var(--dur-slow) var(--ease-out) both;
        }
        /* Up and out, then up and in — both travel the same direction,
           which is what makes it read as one line replacing another
           rather than two unrelated fades. */
        .aa-launch-q.is-out { animation: aa-tick-out var(--dur-slow) var(--ease-out) both; }
        @keyframes aa-tick-in {
          from { opacity: 0; transform: translateY(0.75em); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes aa-tick-out {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-0.75em); }
        }
        /* The artwork as it was drawn — a white stroke over a fill that
           reads as the panel behind it. Left at its own proportions and
           given enough size for a 2px stroke to survive: at 26px that
           line falls below a pixel and the mark dissolves. */
        .aa-mark {
          flex: none;
          width: 34px;
          height: auto;
          margin-left: 12px;
          display: block;
        }

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
        /* ── panel ── */
        /* The page, set back. Blurring what is behind the dock is what
           lets the panel itself stay translucent: the hero type and body
           copy that used to read straight through the answer soften into
           a field of colour, which is the thing glass is supposed to
           refract. Enough that the panel is plainly the foreground and
           the page has stepped back to make room for it, without erasing
           the page and losing the reader their place.
           Click-through too: this is a dock, not a modal, and the page
           underneath stays usable. */
        .aa-scrim {
          position: fixed; inset: 0;
          z-index: 1201;
          pointer-events: none;
          background: rgba(16, 14, 13, 0.34);
          animation: aa-scrim-in var(--dur-base) var(--ease-out);
        }
        @keyframes aa-scrim-in { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .aa-scrim { animation: none; } }
        /* No blur available below 768px, so the tint carries it alone. */
        @media (max-width: 768px) { .aa-scrim { background: rgba(16, 14, 13, 0.55); } }

        /* globals.css gives every button:hover a brand-accent underline.
           That is the right affordance for a link in prose and the wrong
           one for a chip, a close cross or a send icon, so the dock opts
           its own controls out. */
        .aa-launch,
        .aa-launch:hover,
        .aa-panel button,
        .aa-panel button:hover,
        .aa-panel a,
        .aa-panel a:hover { text-decoration: none; }

        .aa-panel {
          /* Glass, and dark on purpose. This panel floats over hero
             video as often as over white, so it cannot borrow the page's
             ground and stay readable. A dark scrim with heavy blur and
             lifted saturation takes its colour from whatever is behind
             it — warm over the estate photography, cool over the forest
             footage — while the text on top stays white against a
             constant, known ground. Contrast is a property of the panel,
             not of the page it happens to be sitting on. */
          /* One step for every staggered sequence in the panel. Small
             enough that a list still reads as one gesture, large enough
             that the order is legible. */
          --aa-step: 45ms;

          --aa-ink: rgba(255, 255, 255, 0.96);
          /* The explanation sits back from the headline. Still 9.7:1 on
             the panel's ground, so quieter without being harder to read. */
          --aa-body: rgba(255, 255, 255, 0.72);
          --aa-meta: rgba(255, 255, 255, 0.62);
          --aa-line: rgba(255, 255, 255, 0.08);
          --aa-fill: rgba(255, 255, 255, 0.10);

          /* Centred horizontally, anchored by its bottom edge. Centring
             vertically meant the panel grew in both directions, so its
             foot moved every time an answer arrived and the composer
             crept up the screen under the reader's hand. Fixed at the
             bottom it grows upward only, and the thing you type into
             stays where you left it.
             6dvh is where the centred panel already sat at full height,
             so nothing jumps; the clamp keeps it sane on a short
             viewport and a tall one. */
          position: fixed;
          left: 50%;
          bottom: clamp(24px, 6dvh, 56px);
          transform: translateX(-50%);
          z-index: 1202;
          /* Room to read in. The dock is where a whole conversation
             happens, not a notification, and at 440 the answers were
             scrolling almost as fast as they arrived. */
          width: min(620px, calc(100vw - 40px));
          /* Never taller than the room left above its anchored foot. */
          max-height: min(820px, calc(100dvh - clamp(24px, 6dvh, 56px) - 54px));
          display: flex; flex-direction: column;
          border-radius: 28px;
          /* Paired with the inline blur above, which does the tinting:
             the panel still takes its colour from the page, warm over the
             estate photographs and green over the forest.
             The alpha is higher than the reference's because this site
             is not the reference's. Aura's pages open with display type
             at a hundred points, and a panel blur does almost nothing to
             a letterform that size — at 0.72 alone the word CIRCULAR read
             straight through the answer. The scrim behind the dock is
             what fixes that: with the page already blurred and set back,
             the panel can be properly translucent again. */
          background: rgba(22, 20, 19, 0.74);
          /* Two edges, not a border: a light top edge where a real pane
             would catch the sky, and a darker outer ring to seat it. */
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 0 0 1px rgba(255, 255, 255, 0.09),
            0 24px 70px rgba(0, 0, 0, 0.42);
          color: var(--aa-ink);
          overflow: hidden;
          animation: aa-in var(--dur-slow) var(--ease-out);
        }

        /* Where backdrop-filter is unavailable the scrim has to carry the
           legibility on its own. */
        /* No blur — either the browser cannot, the visitor asked for less
           transparency, or the site switched it off for scroll cost below
           768px. In every case the scrim is the only thing keeping the
           page out of the answer, so it stops pretending to be glass. */
        @supports not (backdrop-filter: blur(1px)) {
          .aa-panel { background: rgba(22, 20, 19, 0.95); }
        }
        @media (prefers-reduced-transparency: reduce) {
          .aa-panel { background: rgba(22, 20, 19, 0.97); }
        }
        @media (max-width: 768px) {
          .aa-panel { background: rgba(22, 20, 19, 0.93); }
        }
        /* The bar opening up. It rises from where the bar sat and grows
           into the middle, so the panel reads as the same object
           enlarging rather than a new one appearing over the top of it.
           Composed with the centring transform, not replacing it — a
           bare translateY here would drop the panel back to the corner
           for the length of the animation. */
        @keyframes aa-in {
          from { opacity: 0; transform: translateX(-50%) translateY(56px) scale(0.92); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        /* Back the way it came, and quicker: leaving should not take as
           long as arriving. */
        /* Leaving is base where arriving is slow: a thing should not
           take as long to go as it took to appear. */
        .aa-panel.is-closing {
          animation: aa-out var(--dur-base) var(--ease) forwards;
          pointer-events: none;
        }
        @keyframes aa-out {
          from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          to   { opacity: 0; transform: translateX(-50%) translateY(40px) scale(0.96); }
        }
        .aa-scrim.is-closing { animation: aa-scrim-out var(--dur-base) var(--ease) forwards; }
        @keyframes aa-scrim-out { from { opacity: 1; } to { opacity: 0; } }

        /* Each turn arrives rather than appearing. The delay is on the
           assistant's block only — the reader's own words should be
           there the instant they press send. */
        .aa-msg { animation: aa-rise var(--dur-base) var(--ease-out) both; }
        @keyframes aa-rise {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        /* Sources and follow-ups settle in after the answer they belong
           to, in that order, so the block resolves instead of landing
           all at once. */
        .aa-head-line { animation: aa-rise var(--dur-base) var(--ease-out) both; }
        .aa-cites-label { animation: aa-rise var(--dur-base) var(--ease-out) both; }
        .aa-cites { animation: aa-rise var(--dur-base) var(--ease-out) calc(var(--aa-step) * 1) both; }
        /* Source rows fall in one at a time — three records landing, not
           a block appearing. */
        .aa-cites > li { animation: aa-rise var(--dur-fast) var(--ease-out) both; }
        .aa-cites > li:nth-child(1) { animation-delay: calc(var(--aa-step) * 2); }
        .aa-cites > li:nth-child(2) { animation-delay: calc(var(--aa-step) * 3); }
        .aa-cites > li:nth-child(3) { animation-delay: calc(var(--aa-step) * 4); }
        .aa-follow { animation: aa-rise var(--dur-base) var(--ease-out) calc(var(--aa-step) * 5) both; }
        .aa-follow .aa-chips > li { animation: aa-rise var(--dur-fast) var(--ease-out) both; }
        .aa-follow .aa-chips > li:nth-child(1) { animation-delay: calc(var(--aa-step) * 6); }
        .aa-follow .aa-chips > li:nth-child(2) { animation-delay: calc(var(--aa-step) * 7); }
        .aa-follow .aa-chips > li:nth-child(3) { animation-delay: calc(var(--aa-step) * 8); }

        .aa-head {
          display: flex; align-items: center; justify-content: space-between;
          /* Tight: the close button's 44px target already supplies the
             breathing room, so the header adds almost nothing of its
             own and the opening line sits near the top of the panel. */
          padding: 4px 6px 0;
          flex: none;
        }
        .aa-head-acts { display: flex; align-items: center; gap: 4px; }
        .aa-mini {
          background: none; border: 0; cursor: pointer;
          font-family: var(--font-mono), monospace;
          font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--aa-meta); padding: 8px 10px;
          transition: color var(--dur-base) var(--ease);
        }
        .aa-mini:hover { color: var(--aa-ink); }
        /* The navbar's own weight: a bare 1.5px glyph on a 44px target,
           no chip behind it. */
        .aa-close {
          display: grid; place-items: center;
          width: 44px; height: 44px;
          border: 0; background: none; cursor: pointer;
          color: var(--aa-meta);
          transition: color var(--dur-base) var(--ease);
        }
        .aa-close:hover { color: var(--aa-ink); }
        .aa-mini:focus-visible, .aa-close:focus-visible {
          outline: 2px solid var(--brand-accent); outline-offset: 2px;
        }

        .aa-log {
          flex: 1 1 auto; overflow-y: auto;
          /* Less at the top because the header already holds that space,
             more at the bottom so the last line clears the rule. */
          padding: 0 22px 20px;
          display: flex; flex-direction: column; gap: 26px;
          /* A hairline, not a chrome scrollbar: the default one is a
             light-themed widget on a dark panel and the loudest thing on
             it. Firefox takes the two-value form; WebKit needs the
             pseudo-elements below. */
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
          overscroll-behavior: contain;
        }
        .aa-log::-webkit-scrollbar { width: 6px; }
        .aa-log::-webkit-scrollbar-track { background: transparent; }
        .aa-log::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.18);
          border-radius: 999px;
        }
        .aa-log:hover::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); }
        .aa-log::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.45); }

        /* The sentence and its footnote are one unit; the questions are
           a separate move, so they get their own air above them. */
        /* The opening resolves in the order it is read: the sentence,
           the note that qualifies it, then the questions. Each waits one
           step on the one before. */
        .aa-intro { display: flex; flex-direction: column; gap: 8px; }
        .aa-intro > * { animation: aa-rise var(--dur-base) var(--ease-out) both; }
        .aa-intro > .aa-intro-line { animation-delay: calc(var(--aa-step) * 1); }
        .aa-intro > .aa-terms { animation-delay: calc(var(--aa-step) * 2); }
        .aa-intro > .aa-chips { animation-delay: calc(var(--aa-step) * 3); }
        /* And the questions themselves arrive one after another. */
        .aa-intro .aa-chips > li { animation: aa-rise var(--dur-base) var(--ease-out) both; }
        .aa-intro .aa-chips > li:nth-child(1) { animation-delay: calc(var(--aa-step) * 4); }
        .aa-intro .aa-chips > li:nth-child(2) { animation-delay: calc(var(--aa-step) * 5); }
        .aa-intro .aa-chips > li:nth-child(3) { animation-delay: calc(var(--aa-step) * 6); }
        .aa-intro .aa-chips { margin-top: 28px; }
        .aa-intro-line {
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 21px; line-height: 1.32; letter-spacing: -0.01em;
          font-weight: 500;
          color: var(--aa-ink);
          text-wrap: balance;
        }

        .aa-chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 7px; }
        /* Where the conversation goes next, offered after the sources
           rather than between the answer and its provenance — and set
           well clear of them, because it is a different question from
           "where did this come from". */
        .aa-follow { margin-top: 16px; }
        .aa-follow .aa-list-label { margin: 0 0 12px; }
        .aa-chips-follow { margin: 0; }
        .aa-chips-follow { margin-top: -4px; }
        .aa-chip {
          /* Bricolage: these are questions a person would say out loud,
             not interface labels, so they take the reading face. Solid
             near-white on the dark glass — a filled pill reads as
             something to press, where a translucent one reads as
             another piece of the panel. */
          font-family: var(--font-sans), system-ui, sans-serif;
          /* .p2 from the design system — 14px/1.6, regular. The chips are
             body copy that happens to be pressable, so they take the body
             role rather than a control size of their own. */
          font-size: 14px; line-height: 1.6;
          font-weight: 400; text-decoration: none;
          padding: 9px 16px; min-height: 38px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          background: transparent;
          /* Grey, and it stays grey on hover: the border does the
             responding, so the type never jumps brightness under the
             cursor. */
          color: var(--aa-body);
          cursor: pointer;
          text-align: left;
          transition: border-color var(--dur-base) var(--ease),
                      background var(--dur-base) var(--ease),
                      transform var(--dur-fast) var(--ease);
        }
        .aa-chip:hover {
          border-color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.06);
        }
        /* A press worth feeling. */
        .aa-chip:active { transform: scale(0.985); }
        .aa-card { transition: opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease); }
        .aa-card:active { transform: scale(0.995); }
        .aa-chip:focus-visible { outline: 2px solid rgba(255, 255, 255, 0.8); outline-offset: 2px; }

        .aa-msg { display: flex; flex-direction: column; gap: 10px; }
        .aa-msg.is-user { align-items: flex-end; }
        .aa-msg.is-user .aa-text {
          background: color-mix(in oklab, var(--brand-accent) 34%, transparent);
          border: 0;
          border-radius: 16px;
          padding: 10px 14px;
          max-width: 88%;
          color: var(--aa-ink);
        }
        /* The answer's first line: the answer itself, set as a headline
           so it can be read without reading the paragraph under it. */
        .aa-head-line {
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 17px; line-height: 1.3; letter-spacing: -0.01em;
          font-weight: 500;
          color: var(--aa-ink);
          text-wrap: balance;
        }
        .aa-text {
          margin: 0; font-size: 14.5px; line-height: 1.62;
          color: var(--aa-body); white-space: pre-wrap; text-wrap: pretty;
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

        /* The site's own editorial list: no card fill, no rounded
           corners, a hairline doing the segmenting, and the name set in
           mono uppercase as a label rather than a headline. The rule sits
           on top of each row and on the list itself, so the group reads
           as a set of records rather than a stack of buttons. */
        .aa-cites-label,
        .aa-list-label {
          margin: 20px 0 8px;
          font-family: var(--font-mono), monospace;
          font-size: 11px; font-weight: 400;
          letter-spacing: 1px; text-transform: uppercase;
          color: var(--aa-meta);
        }
        .aa-cites {
          list-style: none;
          margin: 0; padding: 0;
          /* Ruled top and bottom, so the last row closes the set rather
             than trailing off. */
          border-top: 1px solid var(--aa-line);
          border-bottom: 1px solid var(--aa-line);
        }
        .aa-cites > li + li { border-top: 1px solid var(--aa-line); }
        .aa-card {
          display: grid;
          grid-template-columns: 64px 1fr;
          align-items: center;
          gap: 12px;
          padding: 11px 0;
          text-decoration: none;
          transition: opacity var(--dur-base) var(--ease);
        }
        .aa-card:hover { opacity: 0.62; }
        .aa-card:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: -2px;
        }
        .aa-card-thumb {
          width: 64px; aspect-ratio: 16 / 9;
          /* Square, like the list this is quoting. */
          border-radius: 0;
          background-color: rgba(255, 255, 255, 0.10);
          background-size: cover;
          background-position: center;
          flex: none;
        }
        /* Label style, like the list this is quoting: the page name set
           in mono caps rather than as a headline. */
        .aa-card-title {
          font-family: var(--font-mono), monospace;
          font-size: 10px; line-height: 1.3;
          letter-spacing: 1.1px; text-transform: uppercase;
          color: var(--aa-ink);
          min-width: 0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }


        .aa-msg { display: flex; flex-direction: column; gap: 10px; }
        .aa-msg.is-user { align-items: flex-end; }
        .aa-msg.is-user .aa-text {
          background: color-mix(in oklab, var(--brand-accent) 34%, transparent);
          border: 0;
          border-radius: 16px;
          padding: 10px 14px;
          max-width: 88%;
          color: var(--aa-ink);
        }
        /* The answer's first line: the answer itself, set as a headline
           so it can be read without reading the paragraph under it. */
        .aa-head-line {
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 17px; line-height: 1.3; letter-spacing: -0.01em;
          font-weight: 500;
          color: var(--aa-ink);
          text-wrap: balance;
        }
        .aa-text {
          margin: 0; font-size: 14.5px; line-height: 1.62;
          color: var(--aa-body); white-space: pre-wrap; text-wrap: pretty;
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

        .aa-form {
          flex: none;
          display: flex; align-items: center; gap: 10px;
          /* The rule runs the full width of the panel rather than sitting
             inside the text margin — it separates two regions, so it
             should read as the edge of one. The padding, not a margin,
             holds the controls off the sides. */
          margin: 0;
          /* Even above and below: the rule and the panel edge are the two
             boundaries, and the input should sit centred between them
             rather than crowding one. */
          padding: 14px 16px 14px 22px;
          border-top: 1px solid var(--aa-line);
        }
        .aa-input {
          flex: 1 1 auto; min-width: 0;
          background: none; border: 0; resize: none;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 15px; line-height: 1.4;
          /* Full white, and the prompt nearly so: the composer is the
             one thing on the panel asking to be used, and at the meta
             weight it read as disabled next to the chips above it. */
          color: #fff;
          max-height: 96px;
          padding: 0;
          /* The row is as tall as the send button, and the text lands
             half a pixel under its centre. One pixel up reads level. */
          position: relative;
          top: -1px;
        }
        .aa-input::placeholder { color: rgba(255, 255, 255, 0.85); }
        .aa-input:focus { outline: none; }
        .aa-form:focus-within { border-top-color: rgba(255, 255, 255, 0.18); }
        /* Just the icon. A filled circle here competed with the white
           pills above it for the eye, and this is the quieter control. */
        .aa-send {
          flex: none;
          display: grid; place-items: center;
          width: 40px; height: 40px; padding: 0;
          border: 0; background: none;
          color: var(--aa-ink);
          cursor: pointer;
          transition: opacity var(--dur-base) var(--ease), color var(--dur-base) var(--ease);
        }
        .aa-send:hover:not(:disabled) { color: #fff; }
        .aa-send:disabled { opacity: 0.3; cursor: default; }
        .aa-send:focus-visible { outline: 2px solid rgba(255, 255, 255, 0.8); outline-offset: 2px; }

        .aa-terms {
          margin: 4px 0 0;
          padding: 0;
          text-align: left;
          font-family: var(--font-mono), monospace;
          max-width: 46ch;
          /* .label from the design system — mono 11px, 1px tracking,
             uppercase — at the panel's own quiet weight. */
          font-size: 11px; line-height: 1.6;
          font-weight: 400;
          letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          text-wrap: pretty;
        }

        @media (max-width: 620px) {
          /* A sheet, not a centred card: on a phone the keyboard takes
             the bottom half, and a middle-anchored panel ends up sitting
             behind it. */
          .aa-panel {
            left: 0; right: 0; top: auto; bottom: 0;
            transform: none;
            width: 100%;
            max-height: 86dvh;
            border-radius: var(--radius-2) var(--radius-2) 0 0;
            padding-bottom: env(safe-area-inset-bottom, 0px);
            animation-name: aa-in-sheet;
          }
          .aa-input { font-size: 16px; }
        }
        @keyframes aa-in-sheet {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .aa-panel,
          .aa-panel.is-closing,
          .aa-scrim,
          .aa-scrim.is-closing,
          .aa-msg,
          .aa-head-line,
          .aa-cites-label,
          .aa-cites,
          .aa-cites > li,
          .aa-follow,
          .aa-intro > *,
          .aa-chips > li { animation: none; }
          .aa-chip:active, .aa-card:active { transform: none; }
          .aa-thinking i { animation: none; opacity: 0.6; }
          .aa-launch { transition: none; }
          .aa-launch:hover { transform: translateX(-50%); }
          .aa-launch-q { animation: none; }
          /* The ring holds still and stays lit, rather than travelling. */
          .aa-launch::before { animation: none; opacity: 0.8; }
        }

        /* The menu takes the whole screen. Two things asking to be used
           at once is one too many, so the bar stands down while it is
           open — and goes out of reach, not just out of sight. */
        :global(body.menu-open) .aa-launch {
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(18px);
        }

        /* Agent view renders the page as plain text; a floating chat
           widget is chrome, and chrome is not content. */
        [data-view='agent'] .aa-launch,
        [data-view='agent'] .aa-panel { display: none !important; }
      `}</style>
    </>
  )
}
