'use client'

import { useState, useCallback } from 'react'
import Reveal from '@/components/RevealOnScroll'

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

export default function ContactPage() {
  const [fields, setFields] = useState<Fields>({ name: '', email: '', topic: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [apiError, setApiError] = useState('')

  const set = useCallback((key: keyof Fields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
    setErrors(prev => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
    // Reset sent state if user starts editing again
    if (status === 'sent' || status === 'error') setStatus('idle')
  }, [status])

  const blur = useCallback((key: keyof Fields) => {
    setTouched(prev => ({ ...prev, [key]: true }))
    const errs = validate(fields)
    if (errs[key]) setErrors(prev => ({ ...prev, [key]: errs[key] }))
  }, [fields])

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
    sending: 'Sending...',
    sent: 'Sent',
    error: 'Try again',
  }[status]

  return (
    <div>
      {/* Hero */}
      <section style={{ paddingTop: 250, paddingBottom: 80 }}>
        <div className="section-w">
          <Reveal>
            <h1 style={{ maxWidth: 700 }}>Let&apos;s talk</h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="p2" style={{ maxWidth: 440, marginTop: 32 }}>
              Whether it&apos;s coffee, collaboration, or just a conversation — we&apos;d love to hear from you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <style jsx>{`
            .field-input {
              font-family: var(--font-sans);
              font-size: 17px;
              color: var(--text);
              padding: 14px 0;
              border: none;
              border-bottom: 1px solid var(--border-strong);
              background: transparent;
              outline: none;
              width: 100%;
              resize: vertical;
              transition: border-color 0.3s ease;
            }
            .field-input::placeholder {
              color: var(--text-muted);
            }
            .field-input:hover {
              border-bottom-color: var(--text-muted);
            }
            .field-input:focus {
              border-bottom-color: var(--text);
            }
            .field-input.has-error {
              border-bottom-color: #E8421A;
            }
            .field-input.has-error:focus {
              border-bottom-color: #E8421A;
            }
            select.field-input {
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              cursor: none;
              padding-right: 28px;
              background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23808080' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
              background-repeat: no-repeat;
              background-position: right 0 center;
              background-size: 12px;
            }
            option {
              background: var(--bg-card);
              color: var(--text);
            }
          `}</style>

          <div style={{ maxWidth: 560 }}>
            <Reveal>
              <div className="flex flex-col gap-8" style={{ opacity: status === 'sent' ? 0.5 : 1, transition: 'opacity 0.4s ease', pointerEvents: status === 'sending' ? 'none' : 'auto' }}>
                <Field id="name" label="Your name" error={touched.name ? errors.name : undefined}>
                  <input
                    id="name"
                    type="text"
                    className={`field-input${touched.name && errors.name ? ' has-error' : ''}`}
                    placeholder="Full name"
                    value={fields.name}
                    onChange={e => set('name', e.target.value)}
                    onBlur={() => blur('name')}
                    disabled={status === 'sent'}
                  />
                </Field>

                <Field id="email" label="Email" error={touched.email ? errors.email : undefined}>
                  <input
                    id="email"
                    type="email"
                    className={`field-input${touched.email && errors.email ? ' has-error' : ''}`}
                    placeholder="you@example.com"
                    value={fields.email}
                    onChange={e => set('email', e.target.value)}
                    onBlur={() => blur('email')}
                    disabled={status === 'sent'}
                  />
                </Field>

                <Field id="topic" label="What brings you here?" error={touched.topic ? errors.topic : undefined}>
                  <select
                    id="topic"
                    className={`field-input${touched.topic && errors.topic ? ' has-error' : ''}`}
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
                </Field>

                <Field id="message" label="Message" error={touched.message ? errors.message : undefined}>
                  <textarea
                    id="message"
                    className={`field-input${touched.message && errors.message ? ' has-error' : ''}`}
                    rows={4}
                    placeholder="Tell us what you're thinking..."
                    value={fields.message}
                    onChange={e => set('message', e.target.value)}
                    onBlur={() => blur('message')}
                    disabled={status === 'sent'}
                  />
                </Field>

                {apiError && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#E8421A' }}>{apiError}</p>
                )}

                <button
                  onClick={handleSend}
                  disabled={status === 'sending' || status === 'sent'}
                  style={{
                    marginTop: 8,
                    fontFamily: 'var(--font-sans)',
                    fontSize: 15,
                    fontWeight: 400,
                    letterSpacing: 0.2,
                    background: status === 'sent' ? 'transparent' : 'var(--text)',
                    color: status === 'sent' ? 'var(--text-muted)' : 'var(--bg)',
                    border: status === 'sent' ? '1px solid var(--border-strong)' : 'none',
                    padding: '14px',
                    borderRadius: 4,
                    cursor: 'none',
                    transition: 'all 0.3s ease',
                    opacity: status === 'sending' ? 0.6 : 1,
                  }}
                >
                  {btnLabel}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({ id, label, error, children }: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label">{label}</label>
      {children}
      <div style={{ height: 20, overflow: 'hidden' }}>
        {error && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#E8421A',
            marginTop: 2,
            animation: 'field-error-in 0.2s ease-out',
          }}>
            {error}
          </p>
        )}
      </div>
      <style jsx>{`
        @keyframes field-error-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
