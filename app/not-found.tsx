'use client'

import Link from 'next/link'
import Reveal from '@/components/RevealOnScroll'

const ROUTES: { href: string; label: string; description: string }[] = [
  { href: '/', label: 'Return home', description: 'The orchard, the workshop, the kitchen — all still here.' },
  { href: '/idea', label: 'The 1000 Year Idea', description: 'The frame by which every choice is measured.' },
  { href: '/contact', label: 'Get in touch', description: 'A page can be missing. A conversation cannot.' },
]

export default function NotFound() {
  return (
    <div>
      {/* Hero */}
      <section style={{ paddingTop: 250, paddingBottom: 80 }}>
        <div className="section-w">
          <Reveal>
            <p className="label" style={{ marginBottom: 24, color: 'var(--text-body)' }}>404 · Off the path</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 style={{ maxWidth: 760 }}>Nothing planted here yet.</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="p2" style={{ maxWidth: 480, marginTop: 32 }}>
              What you were looking for is not at this address. The land is still in the same place — walk back into it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Routes back */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <Reveal>
            <p className="label" style={{ marginBottom: 'clamp(32px, 5vh, 56px)', color: 'var(--text-body)' }}>WHERE TO GO</p>
          </Reveal>
          <div className="nf-routes">
            {ROUTES.map((r, i) => (
              <Reveal key={r.href} delay={80 + i * 60}>
                <Link href={r.href} className="nf-route no-underline">
                  <div className="nf-route__row">
                    <p className="p1 nf-route__label">{r.label}</p>
                    <span aria-hidden className="nf-route__arrow">→</span>
                  </div>
                  <p className="p2 nf-route__desc">{r.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .nf-routes {
          display: grid;
          grid-template-columns: 1fr;
        }
        .nf-route {
          display: block;
          padding: clamp(20px, 3vh, 28px) 0;
          border-top: 1px solid var(--border);
          color: var(--text);

          transition: opacity 0.3s ease;
        }
        .nf-route:last-child {
          border-bottom: 1px solid var(--border);
        }
        .nf-route__row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 24px;
        }
        .nf-route__label {
          margin: 0;
          transition: transform 0.4s var(--ease-out);
        }
        .nf-route__arrow {
          font-family: var(--font-mono);
          font-size: 16px;
          color: var(--text-body);
          transition: transform 0.4s var(--ease-out), color 0.3s ease;
          display: inline-block;
        }
        .nf-route__desc {
          margin: 8px 0 0;
          max-width: 520px;
          color: var(--text-body);
        }
        .nf-route:hover .nf-route__label {
          transform: translateX(8px);
        }
        .nf-route:hover .nf-route__arrow {
          transform: translateX(8px);
          color: var(--text);
        }
      `}</style>
    </div>
  )
}
