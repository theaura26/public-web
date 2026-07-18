'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import Lenis from 'lenis'
import { motion } from 'framer-motion'
import { FadeUp, ScaleIn, useStatic } from '@/components/the-reason/Motion'
import { ReasonWordmark } from '@/components/the-reason/Wordmark'
import MobileReason from '@/components/the-reason/MobileReason'
import AgentReason from '@/components/the-reason/AgentReason'
import { useMode } from '@/components/ModeProvider'
import { Continue } from '@/components/article/Article'

/* ═══════════════════════════════════════════════════════════════════════
   THE REASON — desktop, coordinate-faithful to Figma node 4111:3402.
   The board is 1728px wide; every element is placed at its frame-relative
   coordinate and scaled with the viewport via --u (1 design px) on
   .reason-stage. Display type comes from the SVG/PNG assets in
   /public/the-reason; only Mynerve / Bricolage / DM Serif text is live.

   Sizing rule: wordmark assets whose export aspect ≠ their Figma text box
   are fitted INTO the box (object-fit: contain) so they never overgrow and
   collide with neighbours. Line-heights are normalised to a small, shared
   scale instead of the Figma's literal px values, so the type reads as one
   system. Mobile is a separate pass.
═══════════════════════════════════════════════════════════════════════ */

const A = '/the-reason'
const u = (px: number) => `calc(${px} * var(--u))`

type Anim = 'fade' | 'scale' | 'wipe' | 'none'
type Dir = 'up' | 'down' | 'left' | 'right' | 'none'

function Abs({
  x, y, w, h, anim = 'fade', dir = 'up', delay = 0, className, style, children,
}: {
  x: number; y: number; w?: number; h?: number
  anim?: Anim; dir?: Dir; delay?: number
  className?: string; style?: CSSProperties; children: ReactNode
}) {
  const base: CSSProperties = {
    position: 'absolute', left: u(x), top: u(y),
    ...(w != null ? { width: u(w) } : {}),
    ...(h != null ? { height: u(h) } : {}),
    ...style,
  }
  if (anim === 'scale') return <ScaleIn delay={delay} className={className} style={base}>{children}</ScaleIn>
  if (anim === 'wipe') return <WipeIn className={className} style={base}>{children}</WipeIn>
  if (anim === 'none') return <div className={className} style={base}>{children}</div>
  return <FadeUp dir={dir} delay={delay} className={className} style={base}>{children}</FadeUp>
}

/* Handwriting is one uniform size everywhere, per brief. */
const HAND_FS = 26 // handwriting LARGE (small = 20 via handFs); 2-size scale

/* Noomo-style line reveal: the text is split into its wrapped lines, each
   clip-masked, and rises in with a stagger when the block enters view.
   Splitting happens on intersection (so content-visibility has laid the
   element out) and reveals once. Degrades to plain text when static. */
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

/* Live text. lh is a unitless multiplier (shared scale).
   Handwriting (Mynerve) is forced to one size and black (white on dark
   blocks) and reveals line-by-line; serif/bric blocks fade as a unit. */
function T({
  x, y, w, fs, lh = 1.4, align = 'center', color = '#0e0e0c', font = 'hand',
  dir = 'up', delay = 0, handFs, children,
}: {
  x: number; y: number; w: number; fs: number; lh?: number
  align?: CSSProperties['textAlign']; color?: string
  font?: 'hand' | 'serif' | 'serifLight' | 'bric'; dir?: Dir; delay?: number; handFs?: number; children: ReactNode
}) {
  const isHand = font === 'hand'
  const useLines = isHand || font === 'bric' // handwriting + bricolage headlines reveal line-by-line
  const size = isHand ? (handFs ?? HAND_FS) : fs
  const col = isHand ? (color === '#ffffff' ? '#ffffff' : '#0e0e0c') : color
  if (useLines) {
    return (
      <Abs x={x} y={y} w={w} anim="none" className={`r-${font}`}
        style={{ fontSize: u(size), lineHeight: lh, textAlign: align, color: col }}>
        <RevealLines text={typeof children === 'string' ? children : String(children)} delay={delay} />
      </Abs>
    )
  }
  return (
    <Abs x={x} y={y} w={w} anim="fade" dir={dir} delay={delay} className={`r-${font}`}
      style={{ fontSize: u(size), lineHeight: lh, textAlign: align, color: col }}>
      {children}
    </Abs>
  )
}

/* "Focus-in" reveal, triggered on scroll-into-view (for the big wordmarks):
   the element rises a touch and sharpens from a soft blur — see .r-wipe-in in
   globals.css (class name kept; the motion is now a rise+blur, not a wipe). */
function WipeIn({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const isStatic = useStatic()
  useEffect(() => {
    if (isStatic) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect() } }, { threshold: 0, rootMargin: '0px 0px -12% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [isStatic])
  return <div ref={ref} className={`r-wipe-in ${className || ''}`} style={style}>{children}</div>
}

/* Burst-in reveal for the disciplines constellation: scales open from its centre
   while the opacity fades GRADUALLY. The two are decoupled on purpose — the
   scale uses easeOutExpo (a quick burst that settles) but the opacity uses an
   even ease-in-out over a longer beat, so it reads as a true fade rather than
   the front-loaded "pop" easeOutExpo gives opacity. */
function BurstIn({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const isStatic = useStatic()
  if (isStatic) return <div style={style}>{children}</div>
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, scale: 0.32 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        opacity: { duration: 1.7, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 1.4, ease: [0.19, 1, 0.22, 1], delay: 0.05 },
      }}
    >
      {children}
    </motion.div>
  )
}

/* Display-type / illustration asset. Pass h + fit="contain" to fit within
   the Figma box (prevents oversized wordmarks colliding with neighbours). */
function Art({
  x, y, w, h, fit, pos = 'center', src, alt, anim = 'scale', dir = 'up', delay = 0,
  priority = false, cls, imgStyle, life,
}: {
  x: number; y: number; w: number; h?: number; fit?: 'contain'; pos?: string
  src: string; alt: string; anim?: Anim; dir?: Dir; delay?: number
  priority?: boolean; cls?: string; imgStyle?: CSSProperties
  /* life = continuous ambient motion — a transform-only wrapper layer that
     nests under the reveal without fighting it (reveal → life → img). */
  life?: 'float' | 'breathe' | 'drift' | 'tilt'
}) {
  const img: CSSProperties = fit
    ? { width: '100%', height: '100%', objectFit: 'contain', objectPosition: pos, display: 'block', ...imgStyle }
    : { width: '100%', height: 'auto', display: 'block', ...imgStyle }
  let node: ReactNode = <img src={src} alt={alt} style={img}
    loading={priority ? 'eager' : 'lazy'} decoding="async" />
  if (life) node = <div className={`r-${life}`}>{node}</div>
  return (
    <Abs x={x} y={y} w={w} h={fit ? h : undefined} anim={anim} dir={dir} delay={delay} className={cls}>
      {node}
    </Abs>
  )
}

function Photo({
  x, y, w, h, src, alt, dir = 'up', delay = 0,
}: {
  x: number; y: number; w: number; h: number; src: string; alt: string; dir?: Dir; delay?: number
}) {
  return (
    <Abs x={x} y={y} w={w} h={h} anim="fade" dir={dir} delay={delay} style={{ overflow: 'hidden' }}>
      <img className="r-photo" src={src} alt={alt} loading="lazy" decoding="async" />
    </Abs>
  )
}

/* Inner video element used by PhotoVideo — muted/looping with poster, plays
   while in viewport (matches the homepage PillarVideo behaviour). */
function PillarVideoEl({ src, poster, alt }: { src: string; poster: string; alt: string }) {
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
    <video ref={videoRef} className="r-photo" muted loop playsInline preload="none" poster={poster} aria-label={alt}>
      <source src={src} type="video/mp4" />
    </video>
  )
}

/* Pillar video — same coordinate signature as Photo, but renders a muted/looping
   video with a poster fallback. Autoplays when scrolled into view. Mirrors the
   homepage PillarVideo (app/page.tsx). */
function PhotoVideo({
  x, y, w, h, src, poster, alt, dir = 'up', delay = 0,
}: {
  x: number; y: number; w: number; h: number; src: string; poster: string; alt: string; dir?: Dir; delay?: number
}) {
  return (
    <Abs x={x} y={y} w={w} h={h} anim="fade" dir={dir} delay={delay} style={{ overflow: 'hidden' }}>
      <PillarVideoEl src={src} poster={poster} alt={alt} />
    </Abs>
  )
}

/* Pillar caption — handwriting title over a Bricolage (normal-case) body. */
function Caption({
  x, y, w, title, body, delay = 0,
}: {
  x: number; y: number; w: number; title: string; body: string; delay?: number
}) {
  return (
    <Abs x={x} y={y} w={w} anim="fade" delay={delay} style={{ textAlign: 'left', color: '#0e0e0c' }}>
      <div className="r-hand" style={{ fontSize: u(HAND_FS), lineHeight: 1.1, marginBottom: u(10) }}>{title}</div>
      <div style={{ fontFamily: 'var(--font-grotesque), system-ui, sans-serif', fontWeight: 400, fontSize: u(22), lineHeight: 1.5 }}>{body}</div>
    </Abs>
  )
}

export default function TheReasonPage() {
  const { viewMode } = useMode()

  /* Lenis smooth/inertia scroll — mounted only while this page is active,
     so the rest of the site keeps native scrolling. Drives the scroll-
     timeline reveals more smoothly. Disabled for reduced-motion. */
  /* Lenis smooth scroll (this page only) + scroll-driven whole-page
     background colour. As the viewport centre enters a beat's band, the
     ENTIRE background eases to that colour (white ⇄ warm ⇄ black), so the
     dark/warm moments read as the background changing rather than as
     rectangular blocks. The bg hook rides Lenis's own scroll event because
     Lenis doesn't emit native window 'scroll' events. */
  useEffect(() => {
    const root = document.querySelector('.reason') as HTMLElement | null
    const stage = document.querySelector('.reason-stage') as HTMLElement | null
    if (!root || !stage) return
    if (window.matchMedia('(max-width: 900px)').matches) return // phones + portrait tablets use the flow layout — no Lenis/bg/parallax
    const PAPER = '#ffffff', BLACK = '#000000', WARM = '#f0ede8'
    // [startY, endY, colour] in design units (1728-wide board).
    // Every BLACK band is the same height (DARK_H ≈ one screen) so the dark
    // beats read as identical full-screen moments.
    const DARK_H = 1250
    // What-kind keeps its own curved black block (below); only these two beats
    // recolour the whole page background.
    const blackCentres = [12050, 19860] // why-now, monastic
    const bands: [number, number, string][] = [
      ...blackCentres.map((c) => [c - DARK_H / 2, c + DARK_H / 2, BLACK] as [number, number, string]),
      [9010, 10580, WARM], // disciplines / where land (taller — holds the map)
    ]
    const heroParallax = Array.from(stage.querySelectorAll('[data-parallax]')) as HTMLElement[]
    let raf = 0
    const apply = () => {
      raf = 0
      const unit = stage.getBoundingClientRect().width / 1728
      const y = window.scrollY
      const centre = (y + window.innerHeight / 2) / unit
      let colour = PAPER
      for (const [s, e, c] of bands) { if (centre >= s && centre <= e) { colour = c; break } }
      root.style.backgroundColor = colour

      // Hero type parallaxes up over the flowers on scroll.
      for (const el of heroParallax) {
        const k = Number(el.dataset.parallax) || 0
        el.style.transform = `translate3d(0, ${(-y * k).toFixed(1)}px, 0)`
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | null = null
    let id = 0
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
      lenis.on('scroll', schedule)
      id = requestAnimationFrame(function loop(t: number) { lenis!.raf(t); id = requestAnimationFrame(loop) })
    } else {
      window.addEventListener('scroll', schedule, { passive: true })
    }
    window.addEventListener('resize', schedule)

    return () => {
      if (id) cancelAnimationFrame(id)
      if (raf) cancelAnimationFrame(raf)
      if (lenis) lenis.destroy()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  /* Agent (machine-readable) view: the coordinate comp + stripped images would
     read as a broken jumble, so render the canonical prose version instead —
     identical to /reason's agent view. */
  if (viewMode === 'agent') return <AgentReason />

  return (
    <div className="reason">
      <div className="reason-stage">

        {/* ── Flower stems grow up out of the dark block (rendered before it, so
               the black ground clips the stem feet); gentle life-like sway ── */}
        <Abs x={-207} y={3800} w={2143} anim="fade" delay={0.1}>
          <div className="r-sway">
            <img className="r-svg" src={`${A}/aura-flowers-2.svg`} alt="" style={{ opacity: 0.97 }} loading="lazy" decoding="async" />
          </div>
        </Abs>

        {/* ── What-kind dark block ── shaped block with a curved top (ellipse)
               so the flower stems grow into a real black ground; ~one screen
               tall, centred on its content. (Why-now / Monastic instead
               recolour the whole page background — see the bg effect.) */}
        <div className="r-ellipse" style={{ left: u(-257), top: u(4921), width: u(2163), height: u(391) }} aria-hidden />
        <div className="r-bgblack" style={{ left: u(-26), top: u(5110), width: u(1757), height: u(1061) }} aria-hidden />

        {/* ── 01 · Hero ── flowers present from the start with a gentle sway;
               the type parallaxes up over them on scroll (data-parallax) */}
        {/* flowers drift up slowly (parallax 0.05) — the backdrop layer, slower than
            the refusal (0.09) and wordmark (0.16) above it, for depth. r-sway lives on
            the inner div so its rotate doesn't fight the parallax transform. */}
        <div data-parallax="0.05" style={{ position: 'absolute', left: u(84), top: u(740), width: u(1560), height: u(1880) }}>
          <div className="r-sway r-heroflowers" style={{ height: '100%' }}>
            <img className="r-svg r-herofade" src={`${A}/aura-flowers-1.webp`} alt="" style={{ height: '100%', objectFit: 'contain', objectPosition: 'center top' }} loading="eager" decoding="async" />
          </div>
        </div>
        {/* THE REASON — letters reveal one by one, left to right (see ReasonWordmark) */}
        <div data-parallax="0.16" style={{ position: 'absolute', left: u(205), top: u(241), width: u(1319) }}>
          <ReasonWordmark src={`${A}/aura-thereason.svg`} className="r-svg" />
        </div>

        {/* ── 02 · Opening — I am not (over flowers, slower parallax) ── */}
        <div data-parallax="0.09" style={{ position: 'absolute', left: u(587), top: u(1178), width: u(554) }}>
          <ScaleIn><img className="r-svg r-iam" src={`${A}/aura-iam.svg`} alt="I am not a planter. I am not a biologist. I am not a scientist." loading="eager" decoding="async" /></ScaleIn>
        </div>

        {/* ── 03 · Intro — Entrepreneur ── (sits clear below the flowers, centred in the gap above "But my way") */}
        <Art x={557} y={2674} w={634} src={`${A}/aura-entrepreneur.webp`} alt="I am an entrepreneur. Born in India. Moved to Singapore years ago. Built a career in the world of speed and cities and deals." anim="wipe" life="breathe" />

        {/* ── 04 · Unwinding ── (beats woven into the gaps between the flowers) */}
        <T x={305} y={3542} w={1117} fs={30}>But my way of unwinding was always the same.</T>
        <T x={670} y={4345} w={300} fs={30} handFs={26} delay={0.05}>Creating spaces where people could sit together.</T>
        <T x={176} y={4752} w={300} fs={30} handFs={26} delay={0.1}>Building gardens. Setting flower arrangements.</T>
        <T x={1117} y={4587} w={320} fs={30} handFs={26} delay={0.15}>Connecting friends over food and conversation that lasted until nobody noticed the time.</T>

        {/* ── 05 · What kind of world (dark) ── */}
        <T x={522} y={5150} w={685} fs={30} color="#ffffff">I have two boys. Very different from each other. Watching them grow, I stopped thinking in quarters and started thinking in generations.</T>
        <Art x={332} y={5450} w={1065} src={`${A}/aura-whatkind.svg`} alt="What kind of world are they inheriting?" anim="wipe" />
        <Abs x={789} y={5804} w={150} h={150} anim="fade" delay={0.05}>
          <img className="r-rotate" src={`${A}/aura-globe.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} loading="lazy" decoding="async" />
        </Abs>
        {/* sits across the rotating globe, light non-bold serif */}
        <T x={522} y={5858} w={685} fs={32} font="serifLight" color="#ffffff" delay={0.1}>That question changed everything.</T>

        {/* ── 06 · Western Ghats + Ohara (warm) ── */}
        <Photo x={109} y={6403} w={537} h={690} src="/aura-mudigere-03.jpg" alt="The plantation in the Western Ghats" dir="right" />
        <T x={686} y={6460} w={152} fs={24} handFs={20} align="left" lh={1.5}>I came to 150 acres in the Western Ghats knowing nothing about farming. That turned out to be the advantage.</T>
        <Photo x={1083} y={6403} w={537} h={690} src="/aura-ohara-barn.jpg" alt="A quiet valley in Ohara, north of Kyoto" dir="left" />
        <T x={859} y={6860} w={184} fs={24} handFs={20} align="right" lh={1.5} delay={0.1}>Then I found Ohara — a quiet valley north of Kyoto. Cedar, rivers and silence.</T>
        <T x={240} y={7178} w={164} fs={30} align="left">India gave me the ground.</T>
        <T x={1310} y={7178} w={183} fs={30} align="right">Japan gave me the stillness.</T>

        {/* ── 07 · No orthodoxy (warm) ── (more breathing room above) */}
        <Art x={340} y={7810} w={1047} src={`${A}/aura-whenyoucarry.webp`} alt="When you carry no orthodoxy, the land will answer your questions honestly." anim="wipe" />
        <Art x={745} y={8510} w={238} src={`${A}/aura-symbol-main.svg`} alt="" anim="scale" delay={0.1} life="breathe" />
        <T x={698} y={8830} w={333} fs={30}>It answered mine.</T>
        <T x={698} y={9010} w={333} fs={30}>What is Aura?</T>

        {/* ── 08 · Where land / disciplines map (warm) ── (sits right under the question) */}
        {/* whereland type reads first; the starburst map unveils behind it on scroll */}
        {/* full-viewport visual — no circle mask, no rotation; fades in just after the text.
            starburst (background) parallaxes slower than the text (foreground) → depth.
            The art is zoomed 1.2× about the content centre (~56% down) so the
            constellation reads ~20% bigger; the discipline labels sit inset so they
            all stay on-screen — only the decorative spoke tips run past the viewport
            edge, and the transparent top/bottom margin keeps clear of the lines above
            and below. No clip, so nothing of the content is hidden. */}
        <Abs x={0} y={9260} w={1728} anim="none">
          <div className="r-para" style={{ ['--para' as string]: '35px' } as CSSProperties}>
            {/* the constellation bursts open from its centre (the spokes' convergence
                ~56% down) — a scale-from-middle reveal that reads as the disciplines
                radiating outward, with a gradual opacity fade layered on. */}
            <BurstIn style={{ transformOrigin: 'center 56%' }}>
              <div className="r-tilt" style={{ transformOrigin: 'center 56%' }}>
                <img className="r-svg r-starburst" src={`${A}/aura-aboutus.png`} alt="A constellation of Aura's disciplines — plantation, biodynamic, coffee, sanctuary, agroculture, artistry, hospitality, design — radiating from one centre." style={{ transform: 'scale(1.3)', transformOrigin: 'center 56%' }} loading="lazy" decoding="async" />
              </div>
            </BurstIn>
          </div>
        </Abs>
        <Abs x={359} y={9500} w={1009} anim="none">
          <div className="r-para" style={{ ['--para' as string]: '72px' } as CSSProperties}>
            <FadeUp>
              <img className="r-svg r-whereland" src={`${A}/aura-whereland.svg`} alt="Where land becomes a framework for how to live generationally." style={{ filter: 'drop-shadow(0 2px 16px rgba(240,237,232,0.9))' }} loading="lazy" decoding="async" />
            </FadeUp>
          </div>
        </Abs>

        {/* ── 09 · What we forgot ── (label above, statement below — no overlap) */}
        <T x={414} y={10980} w={900} fs={22} font="bric" lh={1}>WHAT WE FORGOT</T>
        <T x={414} y={11100} w={900} fs={50} font="bric" lh={1.15} delay={0.1}>Attention was the original technology. We just stopped using it.</T>

        {/* ── 10 · Why now (dark) ── (centred in the uniform black band) */}
        <Art x={322} y={11760} w={1083} src={`${A}/aura-whynow.svg`} alt="Why now? AI will make intelligence abundant. Wisdom is what runs out." anim="wipe" />

        {/* ── 11 · RTA — the rhythm we lost ── */}
        <Art x={471} y={12977} w={786} src={`${A}/aura-rta.svg`} alt="Ṛta — the rhythm we lost. We were once aligned with the rhythm of things. Aura is an attempt to return." anim="wipe" life="float" />

        {/* ── 12 · Three intelligences ── */}
        <T x={698} y={14130} w={333} fs={30} color="#f3a300">Not faster, but right.</T>
        <T x={559} y={14240} w={610} fs={30} lh={1.45} delay={0.05}>There are three intelligences. Machine. Human. And the oldest one — Natural Intelligence.</T>

        {/* ── 13 · Natural Intelligence ── (bigger; consistent gaps above/below) */}
        <Art x={24} y={14450} w={1680} src={`${A}/aura-frame68.png`} alt="Natural Intelligence" anim="wipe" />
        <T x={404} y={15260} w={920} fs={50} font="bric" lh={1.2} delay={0.1}>The land has been computing longer than any machine. We just stopped reading the output.</T>

        {/* ── 14 · The Three Pillars ── */}
        <Art x={789} y={15748} w={150} h={150} fit="contain" src={`${A}/aura-three.png`} alt="" anim="scale" life="float" />
        <T x={559} y={15935} w={610} fs={30}>The Three Pillars</T>
        <PhotoVideo x={19} y={16028} w={553} h={745} src="/aura-hospitality.mp4" poster="/aura-hospitality.jpg" alt="The Sanctuary" />
        <PhotoVideo x={582} y={16028} w={553} h={745} src="/aura-agroculture.mp4" poster="/aura-agroculture.jpg" alt="The Agroculture" delay={0.08} />
        <PhotoVideo x={1145} y={16028} w={553} h={745} src="/aura-labs.mp4" poster="/aura-labs.jpg" alt="The Artistry" delay={0.16} />
        <Caption x={19} y={16820} w={400} title="The Sanctuary" body="Where silence is not the absence of sound — it is the presence of everything you stopped noticing." />
        <Caption x={582} y={16820} w={420} title="The Agroculture" body="150 acres that get better every season, tended by people who think in decades not quarters." delay={0.06} />
        <Caption x={1145} y={16820} w={470} title="The Artistry" body="The connective tissue — studios, workshops, festivals. Where what the land grows becomes what the hands make." delay={0.12} />

        {/* ── 15 · What it feels like ── */}
        <T x={698} y={17350} w={333} fs={30}>What does it feel like?</T>
        <T x={454} y={17470} w={820} fs={26} lh={1.3} delay={0.08}>Morning mist. Nothing on the calendar. A cup of coffee that grew within sight of where you slept. Not a destination.</T>
        <T x={484} y={17683} w={760} fs={30} font="hand" delay={0.1}>A rhythm you enter — and leave differently than you arrived.</T>

        {/* ── 16 · Six rules ── */}
        <Art x={341} y={18280} w={1046} src={`${A}/aura-sixrules.webp`} alt="Six rules: 1 Soil comes first. 2 Do small work properly. 3 No shortcuts. 4 Quality before quantity. 5 Think ten years ahead. 6 Leaders must be on the field." anim="wipe" />

        {/* ── 17 · Monastic Polymath (dark) ── notes left-aligned to the wordmark;
               top note's bottom sits just above the wordmark top */}
        <T x={314} y={19510} w={320} fs={24} lh={1.45} align="left" font="serif" color="#ffffff" dir="right">The designer who farms. The engineer who meditates. The farmer who reads philosophy.</T>
        <Art x={1255} y={19420} w={160} src={`${A}/aura-fingerprint.svg`} alt="" anim="scale" delay={0.05} life="breathe" />
        <Art x={314} y={19690} w={1100} src={`${A}/aura-monasticpolymaths.svg`} alt="Monastic Polymath" anim="wipe" />
        <T x={314} y={20047} w={320} fs={24} lh={1.45} align="left" font="serif" color="#ffffff">Aura was built for people who never fit one description.</T>

        {/* ── 18 · The Balance ── */}
        <Abs x={245} y={20715} w={1217} anim="none">
          <div className="r-float"><ReasonWordmark src={`${A}/aura-balance.svg`} className="r-svg" ariaLabel="The Balance" /></div>
        </Abs>
        <T x={319} y={21280} w={1090} fs={50} font="bric" lh={1.2} delay={0.1}>We build spaces that reward patience. Some things just need to be the way they are. Not optimised. Not scaled. Not disrupted. Just tended — until they become what they were always meant to become.</T>

        {/* ── 19 · Closing / signature ── */}
        <T x={559} y={22030} w={610} fs={30} lh={1.45}>Aura is not built, it is grown. I am the first gardener. I will not be the last.</T>
        <Photo x={649} y={22210} w={430} h={506} src="/aura-ohara-01.jpg" alt="Arvind Singh on the plantation" />
        <T x={559} y={22780} w={610} fs={30} lh={1.45} delay={0.05}>Love + Respect, Arvind Singh</T>

      </div>

      {/* Mobile single-column layout (shown <=760px; desktop stage hidden there) */}
      <MobileReason />

      {/* Cross-links — where the belief goes next. Sits below both the desktop
          stage and the mobile layout; the scroll-driven page bg settles to
          paper here, so the cards read on white. */}
      <div style={{ background: 'var(--r-paper)', position: 'relative', zIndex: 1 }}>
        <Continue
          heading="Explore"
          items={[
            { href: '/brand', label: 'Our Brand', description: 'How the belief shows up — the identity, the voice, the way Aura carries itself.', img: '/aura-hero.jpg' },
            { href: '/studios', label: 'Studios', description: 'Where the thinking is made — Origin, Engine and Hospitality, three studios applying Natural Intelligence to story, systems and place.', img: '/aura-studios/aura-studios.jpg' },
            { href: '/mudigere', label: 'Mudigere', description: 'Where it is grown — 150 acres in the Western Ghats, tended in decades.', img: '/aura-mudigere.jpg' },
          ]}
        />
      </div>
    </div>
  )
}
