'use client'

import { useEffect, useRef, useState } from 'react'
import ArrowCta from '@/components/ArrowCta'

/* ── The banner each RIPE page closes on ─────────────────────────────
   One slot, two directions: RIPE ends by pointing at A Season of RIPE,
   and the season ends by pointing back. The mark, the line, the accent
   and the picture come from whichever page is being pointed at, so the
   banner carries that page's colour rather than the one it sits on.
─────────────────────────────────────────────────────────────────────── */

export type PageBanner = {
  href: string
  /** The page being pointed at, for the screen reader and the alt. */
  name: string
  mark: string
  line: string
  action: string
  accent: string
  image: string
}

export function RipePageBanner({ banner }: { banner: PageBanner }) {
  /* The picture is the last thing on the page, and a background-image
     set from the first render downloads with the opener. It is attached
     once the banner is a screen and a half away instead. */
  const root = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setNear(true); io.disconnect() }
    }, { rootMargin: '150% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={root}
      className="rpb"
      style={{
        ['--rpb-image' as string]: near ? `url(${banner.image})` : 'none',
        ['--rpb-accent' as string]: banner.accent,
      }}
    >
      <div className="section-w rpb-in">
        <h2 className="rpb-h">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rpb-mark" src={banner.mark} alt="" aria-hidden
               width={390} height={214} loading="lazy" decoding="async" />
          <span className="rpb-name">{banner.name}</span>
        </h2>
        <p className="rpb-t">{banner.line}</p>
        <div className="rpb-act">
          <ArrowCta href={banner.href}>{banner.action}</ArrowCta>
        </div>
      </div>

      <style jsx>{`
        /* The picture is the ground, dimmed from the middle out so the
           mark and the line hold wherever the photograph is bright. */
        .rpb {
          position: relative; z-index: 1; overflow: hidden;
          display: flex; align-items: center;
          padding: clamp(128px, 20vh, 240px) 0;
          text-align: center; color: #fff;
          background: #000 var(--rpb-image) center / cover no-repeat;
        }
        .rpb::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(70% 80%, rgba(0,0,0,0.62), rgba(0,0,0,0.88)), rgba(0,0,0,0.2);
        }
        .rpb-in { position: relative; width: 100%; }
        .rpb-h { margin: 0; line-height: 0; }
        .rpb-mark {
          display: block; margin: 0 auto;
          width: clamp(221px, 26vw, 390px); height: auto;
        }
        /* The name is for anything that cannot see the lettering. */
        .rpb-name {
          position: absolute; width: 1px; height: 1px;
          clip: rect(0 0 0 0); white-space: nowrap; overflow: hidden;
        }
        .rpb-t {
          margin: var(--space-5) auto 0;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 700; font-size: clamp(16px, 1.6vw, 22px);
          line-height: 1.1; letter-spacing: -0.02em;
          text-transform: uppercase; color: var(--rpb-accent);
        }
        .rpb-act { margin: var(--space-7) auto 0; display: flex; justify-content: center; }
        /* The global .label colour is the page's body ink, which on this
           dark picture reads as nothing. The ring takes its colour from
           the text, so setting one sets both. */
        .rpb-act :global(.arrow-cta) { color: #fff; }
        .rpb-act :global(.arrow-cta:hover),
        .rpb-act :global(.arrow-cta:focus-visible) { color: var(--rpb-accent); }
      `}</style>
    </section>
  )
}
