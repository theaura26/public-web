'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Minus, Plus } from '@phosphor-icons/react'
import { track, identify } from '@/lib/analytics'

/* ── VisitModal ──────────────────────────────────────────────────
   The coffee microsite's "The Experience" pop-up — a sharpened
   cut of ContactModal. Three fields and a choice: name, email, the
   visit window (September · November · December), and an optional
   note. Same POST to /api/contact, same validation manners, dressed
   dark to sit on the microsite's black ground.

   Any component can open it by dispatching OPEN_VISIT_EVENT on
   window — the modal itself is mounted once, inside MicroNav, so it
   exists on every microsite page.
*/

export const OPEN_VISIT_EVENT = 'aura:experience'

/** The query the modal answers to. `?experience` on any microsite
 *  page opens the form directly — the link marketing can send. */
export const VISIT_PARAM = 'experience'

export function openVisitModal() {
  window.dispatchEvent(new Event(OPEN_VISIT_EVENT))
}

/** ArrowLink-shaped button that opens the visit modal. Rides on the
 *  global .al styles from ArrowLinkStyles. */
export function ReserveVisitCta({ children = 'The Experience' }: { children?: React.ReactNode }) {
  return (
    <button type="button" className="label al" onClick={openVisitModal} style={{ cursor: 'pointer' }}>
      <span className="al-i" aria-hidden>
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
          <path d="M5 12h13M12.5 6l6.5 6-6.5 6" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </button>
  )
}

/* Availability is real state, not decoration — when a window fills,
   flip `full` here and the chip closes itself. */
const WINDOWS = [
  { label: 'September', full: true },
  { label: 'November', full: false },
  { label: 'December', full: false },
] as const
type Window = (typeof WINDOWS)[number]['label']

type Fields = { name: string; email: string; window: Window | ''; party: number; note: string }
type Errors = Partial<Record<'name' | 'email' | 'window' | 'party' | 'note', string>>
type Status = 'idle' | 'sending' | 'sent' | 'error'

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Please enter your name.'
  if (!f.email.trim()) e.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please enter a valid email.'
  if (!f.window) e.window = 'Please choose a window.'
  if (!f.note.trim()) e.note = 'A sentence is enough.'
  return e
}

export default function VisitModal() {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState<Fields>({ name: '', email: '', window: '', party: 2, note: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [apiError, setApiError] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  const onClose = useCallback(() => setOpen(false), [])

  /* Open on the shared event, from anywhere on the microsite. */
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_VISIT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_VISIT_EVENT, onOpen)
  }, [])

  /* Deep link: /regenerative-coffee?experience opens the form, so
     a campaign can point straight at it. Browser back closes it. */
  useEffect(() => {
    const sync = () => {
      setOpen(new URLSearchParams(window.location.search).has(VISIT_PARAM))
    }
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  /* Reflect the modal in the address bar without a navigation, so the
     open form is copyable and shareable. */
  useEffect(() => {
    const url = new URL(window.location.href)
    const inUrl = url.searchParams.has(VISIT_PARAM)
    if (open === inUrl) return
    if (open) url.searchParams.set(VISIT_PARAM, '')
    else url.searchParams.delete(VISIT_PARAM)
    const qs = url.searchParams.toString().replace(/=(?=&|$)/g, '')
    window.history[open ? 'pushState' : 'replaceState'](
      {}, '', url.pathname + (qs ? `?${qs}` : '') + url.hash,
    )
  }, [open])

  /* ESC closes + scroll lock + autofocus, as ContactModal does. */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const id = requestAnimationFrame(() => nameRef.current?.focus())
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(id)
    }
  }, [open, onClose])

  const set = useCallback(<K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields(prev => ({ ...prev, [key]: value }))
    setErrors(prev => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key as keyof Errors]
      return next
    })
    if (status === 'sent' || status === 'error') setStatus('idle')
  }, [status])

  const handleSend = async () => {
    const errs = validate(fields)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('sending')
    setApiError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          topic: `Coffee — The Experience (${fields.window})`,
          message: [
            `Window: ${fields.window}`,
            `Party size: ${fields.party}`,
            '',
            'What they want from the visit:',
            fields.note.trim(),
          ].join('\n'),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send.')
      }
      setStatus('sent')
      identify(fields.email.trim(), {
        name: fields.name.trim(),
        email: fields.email.trim(),
        latest_contact_topic: `Coffee — The Experience (${fields.window})`,
      })
      track('experience_request_submit', { window: fields.window, source: 'coffee-microsite' })
    } catch (err) {
      setStatus('error')
      setApiError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const btnLabel = {
    idle: 'Request the visit',
    sending: 'Sending…',
    sent: 'Requested ✓',
    error: 'Try again',
  }[status]

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="visit-modal-title" className="vm">
      <button type="button" aria-label="Close" className="vm-x" onClick={onClose}>
        <span className="vm-x1" />
        <span className="vm-x2" />
      </button>

      <div className="vm-scroll">
        <div className="vm-col">
          <header className="vm-head">
            <h2 id="visit-modal-title" className="vm-h">The Experience.</h2>
            <p className="vm-sub">
              Three windows a year. Small groups, by arrangement, not by
              booking form. Tell us what you want from it and we&rsquo;ll
              shape the days around it.
            </p>
          </header>

          <div
            className="vm-form"
            style={{
              opacity: status === 'sent' ? 0.55 : 1,
              pointerEvents: status === 'sending' ? 'none' : 'auto',
            }}
          >
            {/* ── when, and how many ── */}
            <div className="vm-group">
              <div className="vm-f">
                <span className="vm-l" id="vm-window-l">When</span>
                <div className="vm-seg" role="radiogroup" aria-labelledby="vm-window-l">
                  {WINDOWS.map(w => (
                    <button
                      key={w.label}
                      type="button"
                      role="radio"
                      aria-checked={fields.window === w.label}
                      aria-label={w.full ? `${w.label} — fully booked` : w.label}
                      className={`vm-w ${fields.window === w.label ? 'is-on' : ''} ${w.full ? 'is-full' : ''}`}
                      onClick={() => !w.full && set('window', w.label)}
                      disabled={status === 'sent' || w.full}
                    >
                      <span className="vm-w-n">{w.label}</span>
                      {w.full && <span className="vm-w-f">Fully booked</span>}
                    </button>
                  ))}
                </div>
                <span className="vm-err">{errors.window || ''}</span>
              </div>

              <div className="vm-f">
                <span className="vm-l" id="vm-guests-l">How many</span>
                <div className="vm-step">
                  <span className="vm-step-s">Guests, including you</span>
                  <span className="vm-step-c" role="group" aria-labelledby="vm-guests-l">
                    <button
                      type="button"
                      className="vm-step-b"
                      aria-label="One fewer guest"
                      onClick={() => set('party', Math.max(1, fields.party - 1))}
                      disabled={status === 'sent' || fields.party <= 1}
                    >
                      <Minus size={14} weight="bold" aria-hidden />
                    </button>
                    <output className="vm-step-n" aria-live="polite">{fields.party}</output>
                    <button
                      type="button"
                      className="vm-step-b"
                      aria-label="One more guest"
                      onClick={() => set('party', Math.min(40, fields.party + 1))}
                      disabled={status === 'sent' || fields.party >= 40}
                    >
                      <Plus size={14} weight="bold" aria-hidden />
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* ── who you are ── */}
            <div className="vm-group">
              <div className="vm-f">
                <label htmlFor="vm-name" className="vm-l">Your name</label>
                <input
                  ref={nameRef}
                  id="vm-name"
                  type="text"
                  className={`ph-no-capture vm-input${errors.name ? ' has-error' : ''}`}
                  placeholder="Full name"
                  value={fields.name}
                  onChange={e => set('name', e.target.value)}
                  disabled={status === 'sent'}
                />
                <span className="vm-err">{errors.name || ''}</span>
              </div>

              <div className="vm-f">
                <label htmlFor="vm-email" className="vm-l">Email</label>
                <input
                  id="vm-email"
                  type="email"
                  className={`ph-no-capture vm-input${errors.email ? ' has-error' : ''}`}
                  placeholder="you@example.com"
                  value={fields.email}
                  onChange={e => set('email', e.target.value)}
                  disabled={status === 'sent'}
                />
                <span className="vm-err">{errors.email || ''}</span>
              </div>
            </div>

            {/* ── what you want from it ── */}
            <div className="vm-group">
              <div className="vm-f">
                <label htmlFor="vm-note" className="vm-l">
                  What do you want to get out of it
                </label>
                <textarea
                  id="vm-note"
                  className={`ph-no-capture vm-input${errors.note ? ' has-error' : ''}`}
                  rows={4}
                  placeholder="Tell us who is coming and what you would want to see — the wet mill at dawn, the cupping table, the herd, the canopy survey. We plan the days around your answer, so the more specific you are the better."
                  value={fields.note}
                  onChange={e => set('note', e.target.value)}
                  disabled={status === 'sent'}
                />
                <span className="vm-err">{errors.note || ''}</span>
              </div>
            </div>

            <div className="vm-foot">
              {apiError && <p className="vm-apierr">{apiError}</p>}
              <button
                type="button"
                className="vm-send"
                onClick={handleSend}
                disabled={status === 'sending' || status === 'sent'}
              >
                {btnLabel}
              </button>
              {status === 'sent' && (
                <p className="vm-done">
                  Noted — the {fields.window} window, {fields.party}{' '}
                  {fields.party === 1 ? 'guest' : 'guests'}. We&rsquo;ll come
                  back to you at {fields.email.trim()}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Full screen — the form is the page while it is open. */
        .vm {
          position: fixed; inset: 0; z-index: 100;
          background: #0b0b0b; color: #fff;
          animation: vm-fade 0.22s var(--ease);
        }
        .vm-scroll {
          position: absolute; inset: 0;
          overflow-y: auto; -webkit-overflow-scrolling: touch;
          padding: clamp(64px, 8vh, 96px) var(--gutter) clamp(48px, 9vh, 96px);
        }
        /* Top-left, on the page's own left rail — not a centred card. */
        .vm-col {
          width: 100%; max-width: 560px; margin: 0;
          animation: vm-rise 0.34s var(--ease);
        }

        .vm-x {
          position: fixed; top: clamp(16px, 3vw, 28px); right: clamp(16px, 3vw, 28px);
          z-index: 1;
          width: 44px; height: 44px; padding: 0;
          background: transparent; border: none; color: #fff; cursor: pointer;
          display: inline-flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 6px;
        }
        .vm-x1, .vm-x2 { display: block; width: 22px; height: 1.5px; background: currentColor; }
        .vm-x1 { transform: translateY(3.75px) rotate(45deg); }
        .vm-x2 { transform: translateY(-3.75px) rotate(-45deg); }

        /* ── head ── */
        .vm-head { margin-bottom: clamp(40px, 6vh, 64px); }
        .vm-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(30px, 4vw, 46px); line-height: 1.06;
          letter-spacing: -0.035em; color: #fff; margin: 0 0 var(--space-4);
        }
        .vm-sub {
          font-family: var(--font-sans);
          font-size: 15px; line-height: 1.6;
          color: rgba(255, 255, 255, 0.65);
          margin: 0; max-width: 46ch;
        }

        /* ── clusters ── */
        .vm-form { display: flex; flex-direction: column; }
        .vm-group {
          margin: 0 0 clamp(30px, 4.5vh, 46px);
          display: flex; flex-direction: column; gap: var(--space-6);
        }
        .vm-group:last-of-type { margin-bottom: clamp(30px, 4.5vh, 46px); }
        /* every field wears the same label role and the same rhythm */
        .vm-f { display: flex; flex-direction: column; gap: 10px; }
        .vm-l {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.62);
        }

        .vm-seg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .vm-w {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          font-family: var(--font-mono), monospace;
          font-size: 12px; letter-spacing: 0.8px; text-transform: uppercase;
          padding: 11px 0; cursor: pointer;
          background: transparent; color: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          transition: background var(--dur-base) var(--ease),
                      color var(--dur-base) var(--ease),
                      border-color var(--dur-base) var(--ease);
        }
        .vm-w:hover:not(:disabled) { border-color: rgba(255, 255, 255, 0.6); color: #fff; }
        .vm-w.is-on {
          background: var(--brand-accent); color: #fff;
          border-color: var(--brand-accent);
        }
        /* Closed window — legible, but plainly not on offer. */
        .vm-w.is-full {
          cursor: not-allowed;
          color: rgba(255, 255, 255, 0.34);
          border-color: rgba(255, 255, 255, 0.14);
          border-style: dashed;
        }
        .vm-w.is-full .vm-w-n { text-decoration: line-through; }
        .vm-w-f {
          font-size: 9px; letter-spacing: 0.6px;
          color: rgba(255, 255, 255, 0.42);
        }

        /* Sits on the same underline as the inputs, so the column of
           fields reads as one rhythm. */
        .vm-step {
          display: flex; align-items: center; justify-content: space-between;
          gap: var(--space-5);
          padding: 8px 0 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.35);
        }
        .vm-step-s {
          font-family: var(--font-sans); font-size: 16px;
          color: rgba(255, 255, 255, 0.5);
        }
        .vm-step-c { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
        .vm-step-b {
          width: 34px; height: 34px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; color: #fff; cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 50%;
          transition: border-color var(--dur-base) var(--ease),
                      background var(--dur-base) var(--ease),
                      opacity var(--dur-base) var(--ease);
        }
        .vm-step-b:hover:not(:disabled) {
          border-color: #fff; background: rgba(255, 255, 255, 0.08);
        }
        .vm-step-b:disabled { opacity: 0.3; cursor: default; }
        .vm-step-n {
          min-width: 22px; text-align: center;
          font-family: var(--font-sans); font-size: 16px; color: #fff;
          font-variant-numeric: tabular-nums;
        }

        .vm-err {
          font-family: var(--font-mono), monospace;
          font-size: 11px; color: var(--error, #e5484d);
          min-height: 14px; line-height: 14px;
        }
        .vm-apierr {
          font-family: var(--font-mono), monospace; font-size: 11px;
          color: var(--error, #e5484d); margin: 0 0 var(--space-4);
        }

        .vm-foot { display: flex; flex-direction: column; gap: var(--space-5); }
        .vm-send {
          padding: 16px;
          font-family: var(--font-sans); font-size: 15px;
          font-weight: 400; letter-spacing: 0.2px;
          background: #fff; color: #111;
          border: none; border-radius: var(--radius-2);
          cursor: pointer; transition: opacity 0.3s ease;
        }
        .vm-send:disabled { opacity: 0.55; cursor: default; }
        .vm-done {
          font-family: var(--font-mono), monospace;
          font-size: 12px; line-height: 1.7;
          color: rgba(255, 255, 255, 0.75); margin: 0;
        }

        @keyframes vm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes vm-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

        @media (max-width: 560px) {
          .vm-seg { grid-template-columns: 1fr; }
          .vm-step { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
        }
      `}</style>

      <style jsx global>{`
        .vm-input {
          font-family: var(--font-sans);
          font-size: 16px; color: #fff;
          padding: 12px 0; width: 100%;
          border: none; border-bottom: 1px solid rgba(255, 255, 255, 0.35);
          background: transparent; outline: none; resize: vertical;
          transition: border-color 0.3s ease;
        }
        .vm-input::placeholder { color: rgba(255, 255, 255, 0.35); }
        .vm-input:hover, .vm-input:focus { border-bottom-color: #fff; }
        .vm-input.has-error, .vm-input.has-error:focus { border-bottom-color: var(--error, #e5484d); }
      `}</style>
    </div>
  )
}
