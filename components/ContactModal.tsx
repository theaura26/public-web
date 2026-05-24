'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* ── ContactModal ────────────────────────────────────────────────
   Small popup that replicates the /contact page's form — same four
   fields (name · email · topic · message), same validation rules,
   same POST to /api/contact. Used by the Navbar's "Contact us" link
   on /mudigere-estate so the architect doesn't have to navigate away
   from the briefing to send a note.

   - Backdrop click closes
   - ESC closes
   - Body scroll locked while open
   - Focus trap is intentionally light — the first field auto-focuses
     and the close button is reachable via Tab/Shift+Tab — but we
     don't bind a full trap (the form is short enough that the
     browser's natural cycle is fine).
*/

const TOPICS: Record<string, string> = {
  coffee: 'Coffee & Sourcing',
  residency: 'Residency & Studios',
  partnerships: 'Partnerships',
  events: 'Festivals & Events',
  press: 'Press & Media',
  general: 'General Inquiry',
}

type Fields = { name: string; email: string; topic: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'sending' | 'sent' | 'error'

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Please enter your name.'
  if (!f.email.trim()) e.email = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please enter a valid email.'
  if (!f.topic) e.topic = 'Please choose a topic.'
  if (!f.message.trim()) e.message = 'Please enter a message.'
  return e
}

export default function ContactModal({
  open,
  onClose,
  defaultTopic,
}: {
  open: boolean
  onClose: () => void
  /** Optional pre-selected topic key (e.g. "general" for the
   *  Mudigere estate briefing where the architect is most likely
   *  asking about a partnership/visit). */
  defaultTopic?: keyof typeof TOPICS | string
}) {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', topic: defaultTopic || '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [apiError, setApiError] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  const set = useCallback((key: keyof Fields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
    setErrors(prev => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (status === 'sent' || status === 'error') setStatus('idle')
  }, [status])

  const blur = useCallback((key: keyof Fields) => {
    setTouched(prev => ({ ...prev, [key]: true }))
    const errs = validate(fields)
    if (errs[key]) setErrors(prev => ({ ...prev, [key]: errs[key] }))
  }, [fields])

  /* ESC closes + body scroll lock + autofocus the name field
     when the modal first opens. */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    // Autofocus next paint so the field is rendered before we focus.
    const id = requestAnimationFrame(() => nameRef.current?.focus())
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(id)
    }
  }, [open, onClose])

  const handleSend = async () => {
    const errs = validate(fields)
    setTouched({ name: true, email: true, topic: true, message: true })
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setStatus('sending')
    setApiError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          topic: TOPICS[fields.topic] || fields.topic,
          message: fields.message.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send.')
      }
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setApiError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const btnLabel = {
    idle: 'Send message',
    sending: 'Sending…',
    sent: 'Sent ✓',
    error: 'Try again',
  }[status]

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 48px)',
        animation: 'contact-modal-fade-in 0.2s var(--ease)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          maxHeight: 'calc(100svh - clamp(32px, 8vw, 96px))',
          background: 'var(--bg)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-1)',
          padding: 'clamp(28px, 4vw, 40px)',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.18)',
          animation: 'contact-modal-rise 0.3s var(--ease)',
        }}
      >
        {/* Close — two-line X, same recipe the navbar / menu-close
            button uses (22 × 1.5 px lines rotated to form the
            cross). Matches the kit's existing close gesture. */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 44,
            height: 44,
            padding: 0,
            background: 'transparent',
            border: 'none',
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transform: 'translateY(3.75px) rotate(45deg)' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transform: 'translateY(-3.75px) rotate(-45deg)' }} />
        </button>

        <h2 id="contact-modal-title" style={{ marginTop: 0, marginBottom: 'var(--space-3)' }}>
          Write to us.
        </h2>
        <p className="p2" style={{ marginBottom: 'var(--space-6)' }}>
          A note about the estate, a partnership, or a visit. We&rsquo;ll
          come back to you.
        </p>

        <div
          className="flex flex-col gap-6"
          style={{
            opacity: status === 'sent' ? 0.5 : 1,
            transition: 'opacity 0.4s ease',
            pointerEvents: status === 'sending' ? 'none' : 'auto',
          }}
        >
          <ModalField id="cm-name" label="Your name" error={touched.name ? errors.name : undefined}>
            <input
              ref={nameRef}
              id="cm-name"
              type="text"
              className={`cm-input${touched.name && errors.name ? ' has-error' : ''}`}
              placeholder="Full name"
              value={fields.name}
              onChange={e => set('name', e.target.value)}
              onBlur={() => blur('name')}
              disabled={status === 'sent'}
            />
          </ModalField>

          <ModalField id="cm-email" label="Email" error={touched.email ? errors.email : undefined}>
            <input
              id="cm-email"
              type="email"
              className={`cm-input${touched.email && errors.email ? ' has-error' : ''}`}
              placeholder="you@example.com"
              value={fields.email}
              onChange={e => set('email', e.target.value)}
              onBlur={() => blur('email')}
              disabled={status === 'sent'}
            />
          </ModalField>

          <ModalField id="cm-topic" label="What brings you here?" error={touched.topic ? errors.topic : undefined}>
            <select
              id="cm-topic"
              className={`cm-input${touched.topic && errors.topic ? ' has-error' : ''}${!fields.topic ? ' is-empty' : ''}`}
              value={fields.topic}
              onChange={e => set('topic', e.target.value)}
              onBlur={() => blur('topic')}
              disabled={status === 'sent'}
            >
              <option value="" disabled>Choose a topic</option>
              {Object.entries(TOPICS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </ModalField>

          <ModalField id="cm-message" label="Message" error={touched.message ? errors.message : undefined}>
            <textarea
              id="cm-message"
              className={`cm-input${touched.message && errors.message ? ' has-error' : ''}`}
              rows={4}
              placeholder="Tell us what you're thinking…"
              value={fields.message}
              onChange={e => set('message', e.target.value)}
              onBlur={() => blur('message')}
              disabled={status === 'sent'}
            />
          </ModalField>

          {apiError && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--error)' }}>{apiError}</p>
          )}

          <button
            type="button"
            onClick={handleSend}
            disabled={status === 'sending' || status === 'sent'}
            style={{
              marginTop: 4,
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              fontWeight: 400,
              letterSpacing: 0.2,
              background: status === 'sent' ? 'transparent' : 'var(--text)',
              color: status === 'sent' ? 'var(--text-muted)' : 'var(--bg)',
              border: status === 'sent' ? '1px solid var(--border)' : 'none',
              padding: '14px',
              borderRadius: 4,
              transition: 'all 0.3s ease',
              opacity: status === 'sending' ? 0.6 : 1,
              cursor: status === 'sending' || status === 'sent' ? 'default' : 'pointer',
            }}
          >
            {btnLabel}
          </button>
        </div>
      </div>

      {/* Field input styling — mirrors the /contact page so the
          modal feels of a piece with the existing form. Defined
          global so the className can be applied without styled-jsx
          scope hops. */}
      <style jsx global>{`
        @keyframes contact-modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes contact-modal-rise {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cm-input {
          font-family: var(--font-sans);
          font-size: 16px;
          color: var(--text);
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid var(--text-body);
          background: transparent;
          outline: none;
          width: 100%;
          resize: vertical;
          transition: border-color 0.3s ease;
        }
        .cm-input::placeholder { color: var(--text-body); }
        .cm-input:hover { border-bottom-color: var(--text); }
        .cm-input:focus { border-bottom-color: var(--text); }
        .cm-input.has-error,
        .cm-input.has-error:focus { border-bottom-color: var(--error); }
        select.cm-input {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          padding-right: 28px;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%231a1a1a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0 center;
          background-size: 12px;
        }
        select.cm-input.is-empty { color: var(--text-body); }
        [data-theme="night"] select.cm-input {
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23ededed' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }
        .cm-input option {
          background: var(--bg);
          color: var(--text);
        }
      `}</style>
    </div>
  )
}

function ModalField({ id, label, error, children }: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label">{label}</label>
      {children}
      <div style={{ height: 18, overflow: 'hidden' }}>
        {error && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--error)',
            marginTop: 2,
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
