'use client'

import { useCallback, useState } from 'react'
import { Minus, Plus } from '@phosphor-icons/react'
import { track, identify } from '@/lib/analytics'

/* ── The Aura Festival form ──────────────────────────────────────
   The site’s one ask, and it lives on its own page rather than in a
   pop-up: the nav CTA and the clay banner at the foot of every page
   both link straight here.

   Three fields and a choice — name, email, the window (September ·
   November · December), party size and a note. POSTs to
   /api/contact like every other form on the site.
*/

/* Availability is real state, not decoration. Set `seats` to what is
   actually left; set it to 0 and the chip closes itself. */
const WINDOWS = [
  { label: 'September', seats: 0 },
  { label: 'November', seats: 20 },
  { label: 'December', seats: 20 },
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

export function ExperienceForm() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', window: '', party: 2, note: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [apiError, setApiError] = useState('')
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
          topic: `Coffee — Aura Festival (${fields.window})`,
          message: [
            `Window: ${fields.window}`,
            `Party size: ${fields.party}`,
            '',
            'What they want out of it:',
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
        latest_contact_topic: `Coffee — Aura Festival (${fields.window})`,
      })
      track('experience_request_submit', { window: fields.window, source: 'coffee-microsite' })
    } catch (err) {
      setStatus('error')
      setApiError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const btnLabel = {
    idle: 'Attend the Festival',
    sending: 'Sending…',
    sent: 'Asked ✓',
    error: 'Try again',
  }[status]

  return (
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
            {WINDOWS.map(w => {
              const full = w.seats === 0
              const note = full ? 'Fully booked' : `${w.seats} seats available`
              return (
                <button
                  key={w.label}
                  type="button"
                  role="radio"
                  aria-checked={fields.window === w.label}
                  aria-label={`${w.label} — ${note}`}
                  className={`vm-w ${fields.window === w.label ? 'is-on' : ''} ${full ? 'is-full' : ''}`}
                  onClick={() => !full && set('window', w.label)}
                  disabled={status === 'sent' || full}
                >
                  <span className="vm-w-n">{w.label}</span>
                  <span className="vm-w-f">{note}</span>
                </button>
              )
            })}
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
            placeholder="Who is coming, and what you want to see — the wet mill at dawn, the cupping table, the herd, the canopy survey."
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
            Got it — {fields.window}, {fields.party}{' '}
            {fields.party === 1 ? 'place' : 'places'}. We&rsquo;ll write back
            to {fields.email.trim()} within a few days.
          </p>
        )}
      </div>

      <style jsx>{`
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
          padding: 10px 6px; cursor: pointer;
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
          font-size: 9px; letter-spacing: 0.6px; line-height: 1.3;
          color: rgba(255, 255, 255, 0.42);
        }
        .vm-w.is-on .vm-w-f { color: rgba(255, 255, 255, 0.78); }

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

/** The form as a full section of the Festival page. */
export function ExperienceBlock() {
  return (
    <section className="xb">
      <div className="section-w xb-in">
        <div className="xb-col">
          <p className="xb-s">
            We build the three days around the answers, so say the thing
            you actually want to see.
          </p>
          <ExperienceForm />
        </div>
      </div>

      <style jsx>{`
        /* No heading and no rule of its own — the handwritten line above
           is the heading, and this reads straight on from it. */
        .xb {
          background: #000; color: #fff;
          padding: 0 0 clamp(96px, 15vh, 176px);
        }
        /* The column is centred on the page; the fields inside it stay
           left-aligned, because a centred form is a form nobody can scan. */
        .xb-col { max-width: 560px; margin-inline: auto; }
        .xb-s {
          font-size: clamp(17px, 1.55vw, 21px); line-height: 1.6;
          color: rgba(255, 255, 255, 0.72); text-align: center;
          margin: 0 auto clamp(40px, 6vh, 72px); max-width: 40ch;
        }
      `}</style>
    </section>
  )
}
