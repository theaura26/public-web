'use client'

import Reveal from '@/components/RevealOnScroll'

export default function Home() {
  return (
    <div>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 80 }}>
        <div className="section-w">
          <Reveal>
            <h1 style={{ maxWidth: 700 }}>Think in<br />Generations.</h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="p2" style={{ maxWidth: 440, marginTop: 32 }}>
              Outcomes are immediate. Impact is inherited. One is measured in quarters. The other, in generations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Reason */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)' }}>
            <Reveal>
              <h2>The Reason is to Restore What Sustains Us</h2>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-col gap-5" style={{ paddingTop: 4 }}>
                <p className="p2">In a world optimised for speed and short-term gain, Aura offers a different model — one rooted in patience, regeneration, and rhythm.</p>
                <p className="p2">Set across a working plantation and creative sanctuary, Aura brings together ancient knowledge and modern tools to build systems that endure.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Operating System */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <Reveal>
            <h2 style={{ marginBottom: 'clamp(48px, 6vh, 80px)' }}>The Aura Operating System</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 stagger" style={{ gap: 'var(--grid-gap)' }}>
            {[
              { title: 'Sanctuary', desc: 'A living estate in rhythm with the land. Silence, stillness, and a 30-year Japanese garden.' },
              { title: 'Agroculture', desc: 'Ancient practice guided by natural intelligence. 100 acres of coffee, indigenous cattle, and native canopy.' },
              { title: 'Artistry', desc: 'Where creators come to build what endures. Studios, workshops, festivals, and residencies.' },
            ].map((card) => (
              <Reveal key={card.title}>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <p className="p1" style={{ marginBottom: 10 }}>{card.title}</p>
                  <p className="p2">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)' }}>
            <Reveal>
              <h2>Location by Design</h2>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-col">
                {[
                  { name: 'Aura Mudigere', detail: 'Western Ghats, India · 3,600 ft', active: true },
                  { name: 'Aura Ohara', detail: 'Kyoto, Japan · 1,099 ft', active: true },
                  { name: 'Aura Munduk', detail: 'Bali · Coming soon', active: false },
                  { name: 'Aura Daylesford', detail: 'Australia · Coming soon', active: false },
                ].map((loc) => (
                  <div key={loc.name} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
                    <p className="p1" style={{ color: loc.active ? 'var(--text)' : 'var(--text-muted)' }}>{loc.name}</p>
                    <p className="label" style={{ marginTop: 2 }}>{loc.detail}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  )
}
