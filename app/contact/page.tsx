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
  const [sent, setSent] = useState(false)

  const set = useCallback((key: keyof Fields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
    // Clear error on change if field was touched
    setErrors(prev => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const blur = useCallback((key: keyof Fields) => {
    setTouched(prev => ({ ...prev, [key]: true }))
    const errs = validate(fields)
    if (errs[key]) setErrors(prev => ({ ...prev, [key]: errs[key] }))
  }, [fields])

  const handleSend = () => {
    const errs = validate(fields)
    setTouched({ name: true, email: true, topic: true, message: true })
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const subject = TOPICS[fields.topic] || 'Hello from the website'
    const body = [fields.message, '', fields.name, fields.email].join('\n')
    const mailto = `mailto:hello@theaura.life,poon.wen.ang@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setSent(true)
  }

  const reset = () => {
    setFields({ name: '', email: '', topic: '', message: '' })
    setErrors({})
    setTouched({})
    setSent(false)
  }

  const fieldStyle = (key: keyof Fields): React.CSSProperties => ({
    borderBottomColor: touched[key] && errors[key] ? '#E8421A' : undefined,
  })

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
            option {
              background: var(--bg-card);
              color: var(--text);
            }
          `}</style>

          <div style={{ maxWidth: 560 }}>
            {sent ? (
              <Reveal>
                <div style={{ paddingTop: 20 }}>
                  <h2 style={{ marginBottom: 16 }}>Thank you</h2>
                  <p className="p2" style={{ marginBottom: 8 }}>
                    Your email client should have opened with a pre-filled message to <span style={{ color: 'var(--text)' }}>hello@theaura.life</span>.
                  </p>
                  <p className="p2" style={{ marginBottom: 32 }}>
                    If it didn&apos;t, you can reach us directly at{' '}
                    <a href="mailto:hello@theaura.life" className="p1" style={{ color: 'var(--text)' }}>hello@theaura.life</a>.
                  </p>
                  <button
                    onClick={reset}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 14,
                      fontWeight: 400,
                      letterSpacing: 0.2,
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-strong)',
                      padding: '10px 20px',
                      borderRadius: 3,
                      cursor: 'none',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}
                  >
                    Send another message
                  </button>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <div className="flex flex-col gap-8">
                  <Field
                    id="name"
                    label="Your name"
                    error={touched.name ? errors.name : undefined}
                  >
                    <input
                      id="name"
                      type="text"
                      className={`field-input${touched.name && errors.name ? ' has-error' : ''}`}
                      placeholder="Full name"
                      value={fields.name}
                      onChange={e => set('name', e.target.value)}
                      onBlur={() => blur('name')}
                      style={fieldStyle('name')}
                    />
                  </Field>

                  <Field
                    id="email"
                    label="Email"
                    error={touched.email ? errors.email : undefined}
                  >
                    <input
                      id="email"
                      type="email"
                      className={`field-input${touched.email && errors.email ? ' has-error' : ''}`}
                      placeholder="you@example.com"
                      value={fields.email}
                      onChange={e => set('email', e.target.value)}
                      onBlur={() => blur('email')}
                      style={fieldStyle('email')}
                    />
                  </Field>

                  <Field
                    id="topic"
                    label="What brings you here?"
                    error={touched.topic ? errors.topic : undefined}
                  >
                    <div style={{ position: 'relative' }}>
                      <select
                        id="topic"
                        className={`field-input${touched.topic && errors.topic ? ' has-error' : ''}`}
                        value={fields.topic}
                        onChange={e => set('topic', e.target.value)}
                        onBlur={() => blur('topic')}
                        style={{ ...fieldStyle('topic'), WebkitAppearance: 'none', cursor: 'none', paddingRight: 28 }}
                      >
                        <option value="" disabled>Choose a topic</option>
                        {Object.entries(TOPICS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--text)', fontSize: 18, pointerEvents: 'none' }}>+</span>
                    </div>
                  </Field>

                  <Field
                    id="message"
                    label="Message"
                    error={touched.message ? errors.message : undefined}
                  >
                    <textarea
                      id="message"
                      className={`field-input${touched.message && errors.message ? ' has-error' : ''}`}
                      rows={4}
                      placeholder="Tell us what you're thinking..."
                      value={fields.message}
                      onChange={e => set('message', e.target.value)}
                      onBlur={() => blur('message')}
                      style={fieldStyle('message')}
                    />
                  </Field>

                  <button
                    onClick={handleSend}
                    style={{
                      marginTop: 8,
                      fontFamily: 'var(--font-sans)',
                      fontSize: 15,
                      fontWeight: 400,
                      letterSpacing: 0.2,
                      background: 'var(--text)',
                      color: 'var(--bg)',
                      border: 'none',
                      padding: '14px',
                      borderRadius: 4,
                      cursor: 'none',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    Send message
                  </button>
                </div>
              </Reveal>
            )}
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
      <div style={{
        height: 20,
        overflow: 'hidden',
      }}>
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
