'use client'

import { useEffect, useRef } from 'react'
import { FadeUp, ScaleIn, useStatic } from '@/components/the-reason/Motion'
import { ReasonWordmark } from '@/components/the-reason/Wordmark'

/* ═══════════════════════════════════════════════════════════════════════
   THE REASON — mobile (single-column flow).
   Shown <=900px; the desktop absolute comp is hidden there. Proportions
   follow Figma 4149:3557 (393-wide sample): stacked sections, full-bleed
   dark beats, tall portrait photo banners, fluid (capped) vw type. Reuses
   the same /public/the-reason assets and copy, and the same transitions as
   desktop — handwriting + Bricolage headlines reveal line-by-line; serif
   blocks fade; flowers sway; the globe rotates.
═══════════════════════════════════════════════════════════════════════ */

const A = '/the-reason'

/* Line-by-line reveal — mirrors the desktop RevealLines (page.tsx); kept
   local so the mobile flow stays isolated from the desktop comp. Splits the
   text into wrapped lines on scroll-in, then slides each line up in turn. */
function RevealLines({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isStatic = useStatic()
  useEffect(() => {
    const el = ref.current
    if (!el || isStatic) return
    el.style.opacity = '0'
    let split = false
    const run = () => {
      if (split) return
      split = true
      const words = (text || '').split(' ')
      el.innerHTML = words.map((w) => `<span class="rl-w">${w}</span>`).join(' ')
      const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('.rl-w'))
      const lines: string[][] = []
      let top: number | null = null
      spans.forEach((s) => {
        const t = s.offsetTop
        if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t }
        lines[lines.length - 1].push(s.textContent || '')
      })
      // avoid a single-word last line (orphan): pull the previous line's last
      // word down so the final line never dangles one short word on its own.
      if (lines.length >= 2 && lines[lines.length - 1].length === 1 && lines[lines.length - 2].length > 1) {
        lines[lines.length - 1].unshift(lines[lines.length - 2].pop() as string)
      }
      el.innerHTML = ''
      lines.forEach((wl, i) => {
        const line = document.createElement('span'); line.className = 'rl-line'
        const inner = document.createElement('span'); inner.className = 'rl-inner'
        inner.style.transitionDelay = `${delay + i * 0.08}s`
        inner.textContent = wl.join(' ')
        line.appendChild(inner); el.appendChild(line)
      })
      el.style.opacity = '1'
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')))
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect() } },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [isStatic, text, delay])
  return <span ref={ref} className="rl">{text}</span>
}

/* Reveal-text block (handwriting + Bricolage headlines). The wrapper div is
   the section flex-item (so the `.rm-sec > *` column cap applies to it, not to
   the <p>, keeping the <p>'s own max-width / centring identical to FadeUp). */
function RT({ className, delay = 0, children }: { className: string; delay?: number; children: string }) {
  return <div style={{ width: '100%' }}><p className={className}><RevealLines text={children} delay={delay} /></p></div>
}

/* Pillar media: muted/looping video using the same source the homepage uses,
   with a poster jpg shown until the video enters the viewport and starts
   playing. Mirrors the desktop pillar-card pattern from app/page.tsx. */
function PillarVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.15 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video ref={videoRef} className="rm-photo" muted loop playsInline preload="none" poster={poster} aria-label={alt}>
      <source src={src} type="video/mp4" />
    </video>
  )
}

/* Opacity-only scroll reveal for elements that already carry a transform
   (centring, scale, sway, rotate) — wrapping them in FadeUp/ScaleIn would
   fight that transform, so instead we toggle the `.is-in` class (see
   .rm-fadein in globals.css). Force-shown immediately when motion is off. */
function useFadeIn<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const isStatic = useStatic()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reveal = () => el.classList.add('is-in')
    if (isStatic) { reveal(); return }
    // Already at or above the fold on mount (initial load, or a restored /
    // jumped scroll position) → reveal now so nothing can get stranded hidden.
    if (el.getBoundingClientRect().top < window.innerHeight) { reveal(); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { reveal(); io.disconnect() } },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isStatic])
  return ref
}

export default function MobileReason() {
  const iamRef = useFadeIn<HTMLImageElement>()
  const unwindFlowersRef = useFadeIn<HTMLImageElement>()
  const moonRef = useFadeIn<HTMLImageElement>()
  const discRef = useFadeIn<HTMLDivElement>()
  return (
    <div className="rm">

      {/* ── Hero ── wordmark, then flowers (full-bleed, swaying) with the refusal overlaid */}
      <section className="rm-hero">
        <ReasonWordmark src={`${A}/aura-thereason.svg`} className="rm-art rm-wordmark" />
        <div className="rm-hero-stack">
          <FadeUp delay={0.15}><img className="rm-art rm-hero-flowers r-sway" src={`${A}/aura-flowers-1.webp`} alt="" /></FadeUp>
          <img ref={iamRef} className="rm-iam rm-fadein" src={`${A}/aura-iam.svg`} alt="I am not a planter. I am not a biologist. I am not a scientist." />
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="rm-sec">
        <FadeUp><img className="rm-art r-breathe" src={`${A}/aura-entrepreneur.webp`} alt="I am an entrepreneur. Born in India. Moved to Singapore years ago. Built a career in the world of speed and cities and deals." loading="lazy" decoding="async" style={{ maxWidth: '92%' }} /></FadeUp>
      </section>

      {/* ── Unwinding ── statement, the beats, then the stemmed flowers ── */}
      <section className="rm-sec rm-unwind">
        <RT className="rm-hand rm-unwind-statement">But my way of unwinding was always the same.</RT>
        <div className="rm-unwind-beats">
          <RT className="rm-hand">Creating spaces where people could sit together.</RT>
          <RT className="rm-hand" delay={0.05}>Building gardens. Setting flower arrangements.</RT>
          <RT className="rm-hand" delay={0.1}>Connecting friends over food and conversation that lasted until nobody noticed the time.</RT>
        </div>
        <img ref={unwindFlowersRef} className="rm-unwind-flowers r-sway rm-fadein" src={`${A}/aura-flowers-2.svg`} alt="" aria-hidden />
      </section>

      {/* ── What kind of world (dark, curved top) ── */}
      <section className="rm-sec rm-dark rm-dark-curve">
        <RT className="rm-hand">I have two boys. Very different from each other. Watching them grow, I stopped thinking in quarters and started thinking in generations.</RT>
        <ScaleIn className="rm-whatkind" delay={0.1}><img className="rm-art" src={`${A}/aura-whatkind.svg`} alt="What kind of world are they inheriting?" loading="lazy" decoding="async" /></ScaleIn>
        <div className="rm-globe">
          <img ref={moonRef} className="rm-moon r-rotate rm-fadein" src={`${A}/aura-globe.png`} alt="" aria-hidden loading="lazy" decoding="async" />
          <FadeUp delay={0.2} className="rm-globe-text"><p className="rm-serifLight">That question changed everything.</p></FadeUp>
        </div>
      </section>

      {/* ── Western Ghats + Ohara ── */}
      <section className="rm-sec rm-warm">
        <FadeUp><img className="rm-photo" src="/aura-mudigere-03.jpg" alt="The plantation in the Western Ghats" loading="lazy" decoding="async" /></FadeUp>
        <RT className="rm-hand rm-hand-sm">I came to 150 acres in the Western Ghats knowing nothing about farming. That turned out to be the advantage.</RT>
        <FadeUp><img className="rm-photo" src="/aura-ohara-barn.jpg" alt="A quiet valley in Ohara, north of Kyoto" loading="lazy" decoding="async" /></FadeUp>
        <RT className="rm-hand rm-hand-sm">Then I found Ohara — a quiet valley north of Kyoto. Cedar, rivers and silence.</RT>
        <RT className="rm-hand">India gave me the ground. Japan gave me the stillness.</RT>
      </section>

      {/* ── No orthodoxy ── */}
      <section className="rm-sec rm-warm">
        <ScaleIn><img className="rm-art r-breathe" src={`${A}/aura-whenyoucarry.webp`} alt="When you carry no orthodoxy, the land will answer your questions honestly." loading="lazy" decoding="async" /></ScaleIn>
        <ScaleIn delay={0.1}><img className="rm-symbol rm-symbol-sm r-float" src={`${A}/aura-symbol-main.svg`} alt="" aria-hidden loading="lazy" decoding="async" /></ScaleIn>
        <RT className="rm-hand">It answered mine.</RT>
        <RT className="rm-hand" delay={0.05}>What is Aura?</RT>
      </section>

      {/* ── Where land / disciplines map ── */}
      <section className="rm-sec rm-warm">
        <div ref={discRef} className="rm-disc rm-fadein">
          <img className="rm-art" src={`${A}/aura-aboutus.png`} alt="A constellation of Aura's disciplines radiating from one centre." loading="lazy" decoding="async" />
          <img className="rm-whereland" src={`${A}/aura-whereland.svg`} alt="Where land becomes a framework for how to live generationally." loading="lazy" decoding="async" />
        </div>
      </section>

      {/* ── What we forgot ── (beige, continuing the warm ground from the map) */}
      <section className="rm-sec rm-warm">
        <FadeUp><p className="rm-hand rm-handlabel">What we forgot</p></FadeUp>
        <RT className="rm-bric" delay={0.08}>Attention was the original technology. We just stopped using it.</RT>
      </section>

      {/* ── Why now (dark) ── */}
      <section className="rm-sec rm-dark rm-whynow">
        <ScaleIn><img className="rm-art r-float" src={`${A}/aura-whynow.svg`} alt="Why now? AI will make intelligence abundant. Wisdom is what runs out." loading="lazy" decoding="async" /></ScaleIn>
      </section>

      {/* ── RTA ── */}
      <section className="rm-sec">
        <FadeUp><img className="rm-art r-float" src={`${A}/aura-rta.svg`} alt="Ṛta — the rhythm we lost. We were once aligned with the rhythm of things. Aura is an attempt to return." loading="lazy" decoding="async" style={{ maxWidth: '74%' }} /></FadeUp>
      </section>

      {/* ── Three intelligences ── */}
      <section className="rm-sec">
        <RT className="rm-hand">Not faster, but right.</RT>
        <RT className="rm-hand" delay={0.05}>There are three intelligences. Machine. Human. And the oldest one — Natural Intelligence.</RT>
      </section>

      {/* ── Natural Intelligence ── */}
      <section className="rm-sec">
        <ScaleIn><img className="rm-art r-breathe" src={`${A}/aura-frame68.png`} alt="Natural Intelligence" loading="lazy" decoding="async" /></ScaleIn>
        <RT className="rm-bric" delay={0.08}>The land has been computing longer than any machine. We just stopped reading the output.</RT>
      </section>

      {/* ── The Three Pillars ── */}
      <section className="rm-sec">
        <ScaleIn><img className="rm-symbol r-float" src={`${A}/aura-three.png`} alt="" aria-hidden loading="lazy" decoding="async" /></ScaleIn>
        <RT className="rm-hand">The Three Pillars</RT>
        {[
          { video: '/aura-hospitality.mp4', poster: '/aura-hospitality.jpg', t: 'The Sanctuary', b: 'Where silence is the presence of everything you had stopped noticing.' },
          { video: '/aura-agroculture.mp4', poster: '/aura-agroculture.jpg', t: 'The Agroculture', b: '150 acres that get better every season, tended by people who think in decades not quarters.' },
          { video: '/aura-labs.mp4', poster: '/aura-labs.jpg', t: 'The Artistry', b: 'The connective tissue — studios, workshops, festivals. Where what the land grows becomes what the hands make.' },
        ].map((p, i) => (
          <FadeUp key={i} delay={i * 0.05} className="rm-pillar">
            <PillarVideo src={p.video} poster={p.poster} alt={p.t} />
            <p className="rm-pillar-title">{p.t}</p>
            <p className="rm-pillar-body">{p.b}</p>
          </FadeUp>
        ))}
      </section>

      {/* ── What it feels like ── */}
      <section className="rm-sec">
        <RT className="rm-hand">What does it feel like?</RT>
        <RT className="rm-hand" delay={0.08}>Morning mist. Nothing on the calendar. A cup of coffee that grew within sight of where you slept. Not a destination.</RT>
        <RT className="rm-hand" delay={0.16}>A rhythm you enter — and leave differently than you arrived.</RT>
      </section>

      {/* ── Six rules ── */}
      <section className="rm-sec">
        <ScaleIn><img className="rm-art r-breathe" src={`${A}/aura-sixrules.webp`} alt="Six rules: soil comes first; do small work properly; no shortcuts; quality before quantity; think ten years ahead; leaders must be on the field." loading="lazy" decoding="async" /></ScaleIn>
      </section>

      {/* ── Monastic Polymath (dark) ── small fingerprint as crown, then the note/wordmark/note triad */}
      <section className="rm-sec rm-dark rm-monastic">
        <ScaleIn><img className="rm-fingerprint r-breathe" src={`${A}/aura-fingerprint.svg`} alt="" aria-hidden loading="lazy" decoding="async" /></ScaleIn>
        <FadeUp delay={0.05}><p className="rm-serif rm-serif-sm">The designer who farms. The engineer who meditates. The farmer who reads philosophy.</p></FadeUp>
        <ScaleIn delay={0.12}><img className="rm-art rm-monastic-mark" src={`${A}/aura-monasticpolymaths.svg`} alt="Monastic Polymath" loading="lazy" decoding="async" /></ScaleIn>
        <FadeUp delay={0.18}><p className="rm-serif rm-serif-sm">Aura was built for people who never fit one description.</p></FadeUp>
      </section>

      {/* ── The Balance ── */}
      <section className="rm-sec rm-balance">
        <ReasonWordmark src={`${A}/aura-balance.svg`} className="rm-art rm-balance-mark r-float" ariaLabel="The Balance" />
        <RT className="rm-bric" delay={0.08}>We build spaces that reward patience. Some things just need to be the way they are. Not optimised. Not scaled. Not disrupted. Just tended — until they become what they were always meant to become.</RT>
      </section>

      {/* ── Closing ── */}
      <section className="rm-sec">
        <RT className="rm-hand">Aura is not built, it is grown. I am the first gardener. I will not be the last.</RT>
        <FadeUp><img className="rm-photo rm-portrait" src="/aura-ohara-01.jpg" alt="Arvind Singh on the plantation" loading="lazy" decoding="async" /></FadeUp>
        <RT className="rm-hand" delay={0.05}>Love + Respect, Arvind Singh</RT>
      </section>

    </div>
  )
}
