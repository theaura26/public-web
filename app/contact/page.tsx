'use client'

import { useRef } from 'react'
import Reveal from '@/components/RevealOnScroll'

const TOPICS: Record<string, string> = {
  coffee: 'Coffee & Sourcing',
  residency: 'Residency & Studios',
  partnerships: 'Partnerships',
  events: 'Festivals & Events',
  press: 'Press & Media',
  general: 'General Inquiry',
}

export default function ContactPage() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const topicRef = useRef<HTMLSelectElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const name = nameRef.current?.value.trim() || ''
    const email = emailRef.current?.value.trim() || ''
    const topic = topicRef.current?.value || ''
    const message = messageRef.current?.value.trim() || ''

    const subject = topic ? `${TOPICS[topic] || topic}` : 'Hello from the website'
    const bodyParts: string[] = []
    if (message) bodyParts.push(message)
    bodyParts.push('')
    if (name) bodyParts.push(name)
    if (email) bodyParts.push(email)

    const body = bodyParts.join('\n')
    const mailto = `mailto:hello@theaura.life?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

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
            option {
              background: var(--bg-card);
              color: var(--text);
            }
          `}</style>

          <div style={{ maxWidth: 560 }}>
            <Reveal>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="label">Your name</label>
                  <input ref={nameRef} id="name" type="text" className="field-input" placeholder="Full name" />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="label">Email</label>
                  <input ref={emailRef} id="email" type="email" className="field-input" placeholder="you@example.com" />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="topic" className="label">What brings you here?</label>
                  <div style={{ position: 'relative' }}>
                    <select ref={topicRef} id="topic" className="field-input" defaultValue="" style={{ WebkitAppearance: 'none', cursor: 'none', paddingRight: 28 }}>
                      <option value="" disabled>Choose a topic</option>
                      {Object.entries(TOPICS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--text)', fontSize: 18, pointerEvents: 'none' }}>+</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="label">Message</label>
                  <textarea ref={messageRef} id="message" className="field-input" rows={4} placeholder="Tell us what you're thinking..." />
                </div>

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
          </div>
        </div>
      </section>
    </div>
  )
}
