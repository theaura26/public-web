'use client'

import Link from 'next/link'
import { useLivingIndex } from './LivingIndexProvider'
import { formatDate } from '@/lib/living-index/cows'

/* The Living Index hub. An index page in the Field Notes manner: the
   title on its own, one line of mono beneath it, then the indexes as
   picture cards. There is one so far; the grid is ready for the next. */

export default function LivingIndexHub() {
  const { HERD_SIZE, HERD_UPDATED } = useLivingIndex()
  const entries = [
    {
      href: '/living-index/cows',
      title: 'Cows of Aura',
      meta: `${HERD_SIZE} published animals · checked ${formatDate(HERD_UPDATED, true)}`,
      img: '/living-index/video/cows-of-aura-poster.jpg',
    },
  ]
  return (
    <div className="lx">
      <div className="section-w lx-head">
        <h1 className="lx-h">Living Index</h1>
        <p className="lx-lede">The estate’s living things, by name and by number. The herd comes first.</p>
      </div>
      <div className="section-w">
        <ul className="lx-grid">
          {entries.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="lx-card">
                <span className="lx-plate" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.img} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="lx-t">{e.title}</span>
                <span className="lx-m">{e.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style jsx global>{`
        .lx { padding: calc(var(--nav-h) + var(--head-top)) 0 var(--section-gap); }
        .lx-head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-5); padding-bottom: var(--head-bottom); }
        /* The banner title spec, as on Field Notes. */
        .lx-h {
          margin: 0; font-family: var(--font-grotesque); font-weight: 600;
          font-size: clamp(48px, 7.2vw, 106px); line-height: 1; letter-spacing: -0.03em; text-transform: uppercase;
        }
        .lx-lede {
          margin: 0; max-width: 46ch; color: var(--text);
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
        }
        .lx-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(28px, 4vw, 56px); }
        .lx-grid > li { margin: 0; }
        .lx-card { display: flex; flex-direction: column; gap: var(--space-3); color: inherit; text-decoration: none; }
        .lx-card:hover, .lx-card:focus-visible { text-decoration: none; }
        .lx-plate { display: block; aspect-ratio: 16 / 9; overflow: hidden; border-radius: var(--radius-1); background: var(--bg-card); }
        .lx-plate img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .lx-t { font-family: var(--font-sans); font-size: 16px; line-height: 1.55; color: var(--text); }
        .lx-card:hover .lx-t, .lx-card:focus-visible .lx-t {
          text-decoration: underline; text-decoration-color: var(--brand-accent);
          text-underline-offset: var(--rule-offset); text-decoration-thickness: var(--rule-weight);
        }
        .lx-m { font-family: var(--font-mono); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); }
        @media (max-width: 700px) { .lx-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
