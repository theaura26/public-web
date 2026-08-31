'use client'

import { useState } from 'react'

/* Get in touch, without leaving the product.
 *
 * The button used to be a link to /contact, which threw away the one
 * thing the page knew: which product the reader was looking at. This
 * opens in place and sends the product name as the topic, so an enquiry
 * arrives already saying what it is about.
 *
 * It posts to the same /api/contact endpoint the contact page uses —
 * same contract, same mailbox, one place to change.
 */
export default function EnquiryForm({ product }: { product: string }) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const set =
    (k: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          topic: product,
          message: fields.message.trim(),
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'That did not send. Try again, or email hello@theaura.life.')
      }
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'That did not send.')
    }
  }

  if (status === 'sent') {
    return (
      <p className="eq-done p1">
        Thank you — that has reached us, and we will reply about {product}.
        <style jsx>{`
          .eq-done { margin: 0; max-width: 46ch; color: var(--text-body); }
        `}</style>
      </p>
    )
  }

  return (
    <div className="eq">
      <button
        type="button"
        className="eq-open"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close' : 'Get in touch'}
      </button>

      {open && (
        <form className="eq-form" onSubmit={submit}>
          <p className="eq-note label">Enquiry about {product}</p>

          <label className="eq-field">
            <span className="label">Name</span>
            <input value={fields.name} onChange={set('name')} required autoComplete="name" />
          </label>

          <label className="eq-field">
            <span className="label">Email</span>
            <input
              type="email"
              value={fields.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </label>

          <label className="eq-field">
            <span className="label">Message</span>
            <textarea rows={4} value={fields.message} onChange={set('message')} required />
          </label>

          {error && (
            <p className="eq-err p1" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="eq-send" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}

      <style jsx>{`
        .eq {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          align-items: flex-start;
        }

        .eq-open,
        .eq-send {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 13px 26px;
          border-radius: 999px;
          cursor: pointer;
          background: var(--contrast-bg);
          color: var(--contrast-text);
          border: 1px solid var(--contrast-bg);
          transition: opacity var(--dur-base) var(--ease);
        }
        .eq-open:hover,
        .eq-send:hover {
          opacity: 0.82;
        }
        .eq-send[disabled] {
          opacity: 0.5;
          cursor: default;
        }
        .eq-open:focus-visible,
        .eq-send:focus-visible {
          outline: 2px solid var(--brand-accent);
          outline-offset: 3px;
        }

        .eq-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          width: min(100%, 420px);
          padding-top: var(--space-2);
        }
        .eq-note {
          margin: 0;
          color: var(--text-muted);
        }

        .eq-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .eq-field span {
          color: var(--text-muted);
        }
        .eq-field input,
        .eq-field textarea {
          font-family: var(--font-sans), sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: var(--text);
          background: transparent;
          border: 0;
          border-bottom: 1px solid var(--border-strong);
          padding: 8px 0;
          border-radius: 0;
          resize: vertical;
        }
        .eq-field input:focus,
        .eq-field textarea:focus {
          outline: none;
          border-bottom-color: var(--brand-accent);
        }
        .eq-err {
          margin: 0;
          color: var(--error);
        }
      `}</style>
    </div>
  )
}
