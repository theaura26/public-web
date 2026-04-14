'use client'

import Reveal from '@/components/RevealOnScroll'

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 80 }}>
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
              color: rgba(255,255,255,0.6);
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
                  <label className="label">Your name</label>
                  <input type="text" className="field-input" placeholder="Full name" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label">Email</label>
                  <input type="email" className="field-input" placeholder="you@example.com" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label">What brings you here?</label>
                  <div style={{ position: 'relative' }}>
                    <select className="field-input" defaultValue="" style={{ WebkitAppearance: 'none', cursor: 'none', paddingRight: 28 }}>
                      <option value="" disabled>Choose a topic</option>
                      <option value="coffee">Coffee &amp; Sourcing</option>
                      <option value="residency">Residency &amp; Studios</option>
                      <option value="partnerships">Partnerships</option>
                      <option value="events">Festivals &amp; Events</option>
                      <option value="press">Press &amp; Media</option>
                      <option value="general">General Inquiry</option>
                    </select>
                    <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: 'var(--text)', fontSize: 18, pointerEvents: 'none' }}>+</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label">Message</label>
                  <textarea className="field-input" rows={4} placeholder="Tell us what you're thinking..." />
                </div>

                <button
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
