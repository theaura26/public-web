'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Reveal from '@/components/RevealOnScroll'
import { ScrollHighlight } from '@/components/article/Article'
import { ExpandingBanner } from '@/components/ExpandingBanner'
import { LogoEmblem } from '@/components/Logo'
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudSun, CloudMoon } from '@phosphor-icons/react'
import 'plyr/dist/plyr.css'

/* ═══════════════════════════════════════════
   LIVE WEATHER — Open-Meteo (free, no key)
═══════════════════════════════════════════ */
interface WeatherData {
  temp: number
  humidity: number
  wind: number
  code: number
  isDay: boolean
}

const weatherLabels: Record<number, string> = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
  80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
  95: 'Thunderstorm', 96: 'Hail Storm', 99: 'Heavy Hail',
}

function useWeather(lat: number, lon: number): WeatherData | null {
  const [data, setData] = useState<WeatherData | null>(null)
  const key = `${lat},${lon}`

  useEffect(() => {
    let cancelled = false
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day`
    )
      .then(r => r.json())
      .then(json => {
        if (cancelled || !json.current) return
        setData({
          temp: Math.round(json.current.temperature_2m),
          humidity: json.current.relative_humidity_2m,
          wind: Math.round(json.current.wind_speed_10m),
          code: json.current.weather_code,
          isDay: json.current.is_day === 1,
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [key])

  return data
}

/* ═══════════════════════════════════════════
   HERO VIDEO — Scroll-driven blur reveal
   300vh wrapper → sticky 100vh stage → scroll controls blur + copy
═══════════════════════════════════════════ */

function HeroVideo({ onWatch }: { onWatch: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Autoplay when visible, pause when not.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.1 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  /* Sticky stack-style reveal (matches sanctuary panels):
       · Wrapper is 200vh tall, inner sticky stage 100vh pinned at top:0
       · Slide-up phase (parentScroll 0 → 100vh): heavy 32px blur
       · Stuck + lift phase (100 → 130vh): blur clears to 0
       · Clarity hold (130 → 200vh): clear, sticky panel stays at top
     Uses `filter: blur()` directly on the <video> for compositing reliability. */
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Mobile + reduced-motion: skip the scroll-driven filter blur entirely.
    // CSS filter on a playing video is the heaviest GPU op on the page and
    // is the primary source of scroll jank on small devices.
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (videoRef.current) videoRef.current.style.filter = 'blur(0)'
      return
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const wrap = wrapRef.current
        const video = videoRef.current
        if (!wrap || !video) return
        const rect = wrap.getBoundingClientRect()
        const vh = window.innerHeight
        // How far the user has scrolled into the wrapper.
        const scrollIntoWrap = -rect.top
        // The sticky stage sticks at scrollIntoWrap >= 0. Before that, it's
        // sliding up from below. We hold the blur heavy through the slide-up
        // then lift it over the next 30vh once stuck.
        const scrollPastStick = scrollIntoWrap
        // Negative before sticky activates → blur stays at full strength.
        const blurLift = Math.max(0, Math.min(1, scrollPastStick / (vh * 0.3)))
        const blurVal = (1 - blurLift) * 32
        video.style.filter = `blur(${blurVal}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  /* 200vh wrapper + 100vh sticky inner stage. 100vh of stuck time gives the
     reveal room: 30vh for blur to lift, 70vh of clarity hold before the page
     scrolls past. */
  return (
    <section ref={wrapRef} className="hero-video-wrap" style={{ position: 'relative', zIndex: 0 }}>
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster="/aura-hero.jpg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            /* Initial heavy blur from first paint; scroll listener lifts it. */
            filter: 'blur(32px)',
            transform: 'scale(1.1)',
            willChange: 'filter',
          }}
        >
          <source src="/aura-hero.mp4" type="video/mp4" />
        </video>

        {/* Centered rotating logo — mix-blend-mode: difference for contrast. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 var(--gutter)',
            mixBlendMode: 'difference',
            pointerEvents: 'none',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/aura-animated.svg"
            alt="Aura"
            style={{
              width: 'clamp(180px, 28vw, 360px)',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/* Bottom CTA row — sits inside the sticky stage so it remains pinned
            for the full hero hold. Left: mono caption "Land. Time. Practice."
            (the three pillars of the practice, set as a quiet signature).
            Right: "Enter the ecosystem" film trigger. Same mono-uppercase
            language so the two ends of the banner read as one row. */}
        <div
          className="hero-cta-row"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 'clamp(24px, 5vh, 56px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            /* gap kept as a minimum so the two ends never touch if the
               viewport ever gets narrower than the sum of both labels. */
            gap: 'var(--space-4)',
            padding: '0 var(--gutter)',
            pointerEvents: 'none',
          }}
        >
          <p
            className="hero-caption"
            style={{
              margin: 0,
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textShadow: '0 1px 6px rgba(0, 0, 0, 0.45)',
            }}
          >
            Land. Time. Practice.
          </p>
        </div>
      </div>
      <style jsx>{`
        .hero-watch:hover :global(.hero-watch__dot) {
          border-color: #fff;
          background: rgba(255, 255, 255, 0.12);
        }
        /* Desktop: 200vh wrapper gives the sticky stage a 100vh scroll-zone
           for the blur to lift over once the stage is pinned. */
        .hero-video-wrap { height: 200vh; }
        /* Mobile: collapse the wrapper to a single viewport. The scroll-driven
           blur listener early-exits on mobile, so the extra 100vh of empty
           scroll past the sticky stage served no purpose and read as a big
           dead band of whitespace between the hero and the next section. */
        @media (max-width: 768px) {
          .hero-video-wrap { height: 100vh; }
        }
      `}</style>
    </section>
  )
}


/* ═══════════════════════════════════════════
   PILLAR VIDEO — Portrait autoplay video
   3:4 on desktop, 3:4 on mobile
═══════════════════════════════════════════ */

function PillarVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.15 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="pillar-media" style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '3 / 4',
      overflow: 'hidden',
      borderRadius: 'var(--radius-1)',
      background: 'var(--bg)',
    }}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MUDIGERE MODAL — Full-screen location detail
   Layout matches design: text left, images right (top)
   Data + map + landscape left, story right (bottom)
   Map SVG inverts for dark mode.
   z-index: 9990 to stay below custom cursor (9999)
═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   LOCATION MODAL — Shared shell with slide transitions
   Slide up on open, slide down on close, scroll-to-dismiss with elasticity
═══════════════════════════════════════════ */
function LocationModal({ open, onClose, label, bleed, children }: { open: boolean; onClose: () => void; label: string; bleed?: boolean; children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dismissing = useRef(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      document.body.style.overflow = 'hidden'
      dismissing.current = false
      // Reset any leftover direct DOM styles from scroll-dismiss
      if (overlayRef.current) {
        overlayRef.current.style.transition = ''
        overlayRef.current.style.transform = ''
      }
    } else {
      setVisible(false)
      // Drive the slide-down via DOM directly so it can't be blocked
      // by stale transforms from wheel/touch dismiss handlers
      if (overlayRef.current) {
        overlayRef.current.style.transition = 'transform 0.5s var(--ease-out)'
        overlayRef.current.style.transform = 'translateY(100%)'
      }
      const timer = setTimeout(() => {
        setMounted(false)
        document.body.style.overflow = ''
      }, 500)
      return () => clearTimeout(timer)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Animate in after mount paints the off-screen state
  useEffect(() => {
    if (mounted && open) {
      const t = setTimeout(() => setVisible(true), 30)
      return () => clearTimeout(t)
    }
  }, [mounted, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /* ── Scroll-to-dismiss with elasticity + friction ── */
  useEffect(() => {
    if (!open) return
    const el = scrollRef.current
    const overlay = overlayRef.current
    if (!el || !overlay) return

    let startY = 0
    let pulling = false
    let touchedDown = false

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop > 10) touchedDown = true
      if (el.scrollTop <= 0 && touchedDown) {
        startY = e.touches[0].clientY
        pulling = true
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling) return
      const dy = e.touches[0].clientY - startY
      if (dy > 0 && el.scrollTop <= 0) {
        e.preventDefault()
        // Rubber-band elasticity: diminishing returns past 80px
        const elastic = dy < 80 ? dy : 80 + (dy - 80) * 0.3
        overlay.style.transform = `translateY(${elastic}px)`
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!pulling) return
      pulling = false
      const dy = e.changedTouches[0].clientY - startY
      if (dy > 180 && el.scrollTop <= 0 && !dismissing.current) {
        dismissing.current = true
        overlay.style.transition = 'transform var(--dur-slow) var(--ease-out)'
        overlay.style.transform = 'translateY(100%)'
        setTimeout(onClose, 450)
      } else {
        // Snap back with elastic overshoot
        overlay.style.transition = 'transform 0.5s var(--ease-out)'
        overlay.style.transform = 'translateY(0)'
        setTimeout(() => { overlay.style.transition = '' }, 500)
      }
    }

    /* ── Desktop: scroll wheel dismiss (high friction) ── */
    let overscroll = 0
    let wheelTimer: ReturnType<typeof setTimeout> | null = null
    let hasScrolledDown = false
    const openedAt = Date.now()
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) hasScrolledDown = true
      if (el.scrollTop <= 0 && e.deltaY < 0 && hasScrolledDown && Date.now() - openedAt > 800) {
        overscroll += Math.abs(e.deltaY) * 0.15 // heavy friction
        const elastic = overscroll < 60 ? overscroll : 60 + (overscroll - 60) * 0.2
        overlay.style.transform = `translateY(${elastic}px)`
        if (overscroll > 300 && !dismissing.current) {
          dismissing.current = true
          overlay.style.transition = 'transform var(--dur-slow) var(--ease-out)'
          overlay.style.transform = 'translateY(100%)'
          setTimeout(onClose, 450)
        }
        if (wheelTimer) clearTimeout(wheelTimer)
        wheelTimer = setTimeout(() => {
          if (!dismissing.current) {
            overscroll = 0
            overlay.style.transition = 'transform 0.5s var(--ease-out)'
            overlay.style.transform = 'translateY(0)'
            setTimeout(() => { overlay.style.transition = '' }, 500)
          }
        }, 250)
      } else {
        if (overscroll > 0 && !dismissing.current) {
          overscroll = 0
          overlay.style.transition = 'transform var(--dur-base) var(--ease)'
          overlay.style.transform = 'translateY(0)'
          setTimeout(() => { overlay.style.transition = '' }, 300)
        }
      }
    }

    const resetWheel = () => {
      if (el.scrollTop > 0 && overscroll > 0) {
        overscroll = 0
        overlay.style.transform = ''
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('scroll', resetWheel, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', resetWheel)
    }
  }, [open, onClose])

  if (!mounted) return null

  return (
    <div
      ref={overlayRef}
      className="loc-modal"
      data-bleed={bleed ? 'true' : 'false'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.5s var(--ease-out)',
      }}
    >
      <div ref={scrollRef} style={{ width: '100%', height: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {/* ── Header ── full viewport width. Desktop uses 10vw rails to
            mirror the navbar's logo + hamburger axis. Mobile collapses to
            auto-sized end columns with var(--gutter) padding so the X sits
            at the same inset as the hamburger. */}
        <div className="loc-header" data-bleed={bleed ? 'true' : 'false'} style={{ position: bleed ? 'absolute' : 'sticky', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <p className="label loc-label loc-header__label" style={{ margin: 0, opacity: bleed ? 0 : 1 }}>{label}</p>
          <span />
          <button onClick={onClose} aria-label="Close" className="loc-close loc-header__close" style={{ background: 'none', border: 'none', padding: '10px 4px', display: 'flex', flexDirection: 'column', gap: 6, opacity: visible ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease) 0.2s' }}>
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transform: 'translateY(3.75px) rotate(45deg)' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transform: 'translateY(-3.75px) rotate(-45deg)' }} />
          </button>
        </div>
        {bleed ? (
          <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease 0.15s', height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {children}
          </div>
        ) : (
          <div className="section-w" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease 0.15s', paddingTop: 'clamp(24px, 4vh, 56px)', paddingBottom: 'clamp(60px, 8vh, 100px)' }}>
            {children}
          </div>
        )}
      </div>
      <style jsx global>{`
        /* Modal palette is always INVERTED from the page. Day page → dark
           modal + light text. Night page → light modal + dark text. The map
           asset is authored dark-on-light, so it needs an invert whenever
           the modal surface is dark — i.e. when the page theme is day. */
        .loc-modal { background: var(--contrast-bg); }
        .loc-modal .loc-h2 { color: var(--contrast-text); }
        .loc-modal .loc-body {
          font-family: var(--font-sans);
          font-size: 16px;
          line-height: 1.65;
          color: var(--contrast-text-body);
        }
        .loc-modal .loc-label { color: var(--contrast-text-muted) !important; }
        .loc-modal .loc-close { color: var(--contrast-text); }
        .loc-modal .loc-map { filter: none; }
        /* Map asset is dark-on-light. It needs inverting when it sits on a
           dark modal surface — which is now whenever the page theme is day. */
        html [data-theme="day"] .loc-modal:not([data-bleed="true"]) .loc-map {
          filter: invert(1);
        }
        /* Bleed mode — full-bleed black for video regardless of theme. */
        .loc-modal[data-bleed="true"] { background: #000; }
        .loc-modal[data-bleed="true"] .loc-close { color: #fff; }

        /* Modal header — desktop: 10vw rails matching navbar; mobile: auto
           end columns with var(--gutter) padding matching the hamburger. */
        .loc-header {
          display: grid;
          grid-template-columns: 10vw 1fr 10vw;
          align-items: center;
          height: 56px;
          width: 100%;
        }
        .loc-header .loc-header__label { justify-self: center; }
        .loc-header .loc-header__close { justify-self: center; }
        @media (max-width: 768px) {
          .loc-header {
            grid-template-columns: auto 1fr auto;
            padding-left: var(--gutter);
            padding-right: var(--gutter);
          }
          .loc-header .loc-header__label { justify-self: start; }
          .loc-header .loc-header__close { justify-self: end; padding-right: 0 !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Location content layout helpers (styled-jsx) ── */
function LocationContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <style jsx>{`
        :global(.loc-top) { display: grid; grid-template-columns: 2fr 3fr; gap: var(--grid-gap); margin-bottom: var(--section-gap); }
        :global(.loc-pencil-mobile) { display: none; }
        :global(.loc-images-desktop) { display: block; }
        :global(.loc-bottom) { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); }
        @media (max-width: 768px) {
          :global(.loc-top) { grid-template-columns: 1fr; }
          :global(.loc-pencil-mobile) { display: block; }
          :global(.loc-images-desktop) { display: none !important; }
          :global(.loc-bottom) { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}

function WeatherIcon({ code, isDay, size = 32, ...props }: { code: number; isDay: boolean; size?: number; [k: string]: any }) {
  const weight = 'light' as const
  if (code === 0) return isDay ? <Sun size={size} weight={weight} {...props} /> : <Moon size={size} weight={weight} {...props} />
  if (code <= 2) return isDay ? <CloudSun size={size} weight={weight} {...props} /> : <CloudMoon size={size} weight={weight} {...props} />
  if (code === 3) return <Cloud size={size} weight={weight} {...props} />
  if (code <= 48) return <CloudFog size={size} weight={weight} {...props} />
  if (code <= 67) return <CloudRain size={size} weight={weight} {...props} />
  if (code <= 77) return <CloudSnow size={size} weight={weight} {...props} />
  if (code <= 82) return <CloudRain size={size} weight={weight} {...props} />
  if (code <= 99) return <CloudLightning size={size} weight={weight} {...props} />
  return <Cloud size={size} weight={weight} {...props} />
}

/* ── Shared data grid (left-aligned, simple) ── */
function LocationDataGrid({ location, coords, altitude, tempRange, avgHumidity, avgWind, weather, children }: {
  location: string; coords: string; altitude: string; tempRange: string;
  avgHumidity: string; avgWind: string; weather: WeatherData | null; children?: React.ReactNode
}) {
  const condition = weather ? (weatherLabels[weather.code] ?? 'Unknown') : null
  return (
    <div>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <p className="label loc-label" style={{ marginBottom: 6 }}>LOCATION</p>
        <p className="loc-body">{location}</p>
      </div>

      {weather && (
        <div style={{ marginBottom: 28 }}>
          <p className="label loc-label" style={{ marginBottom: 'var(--space-2)' }}>WEATHER NOW</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <WeatherIcon code={weather.code} isDay={weather.isDay} size={20} className="loc-body" />
            <span className="loc-body">{weather.temp}&deg;C &middot; {condition}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginBottom: children ? 'var(--space-6)' : 0 }}>
        <div><p className="label loc-label">COORDINATES</p><p className="loc-body" style={{ marginTop: 2 }}>{coords}</p></div>
        <div><p className="label loc-label">ALTITUDE</p><p className="loc-body" style={{ marginTop: 2 }}>{altitude}</p></div>
        <div><p className="label loc-label">TEMP.</p><p className="loc-body" style={{ marginTop: 2 }}>{weather ? `${weather.temp}°C now · ${tempRange}` : tempRange}</p></div>
        <div><p className="label loc-label">HUMIDITY</p><p className="loc-body" style={{ marginTop: 2 }}>{weather ? `${weather.humidity}%` : avgHumidity}</p></div>
        <div><p className="label loc-label">WIND</p><p className="loc-body" style={{ marginTop: 2 }}>{weather ? `${weather.wind} KM/H` : avgWind}</p></div>
        <div><p className="label loc-label">AVG. WIND</p><p className="loc-body" style={{ marginTop: 2 }}>{avgWind}</p></div>
      </div>
      {children}
    </div>
  )
}

/* ═══ AURA FILM ═══
   Full-bleed video modal. Plyr provides a minimalist control bar that
   auto-hides on idle. Theming overrides Plyr's default blue accent so it
   reads in the Aura monochrome language. */
function AuraVideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const playerRef = useRef<any>(null)

  // Ref callback fires the moment the <video> element mounts inside the
  // modal — guaranteed to run after the inner LocationModal has rendered.
  // A plain useEffect on the parent fires before that child render commits,
  // so the video ref would still be null.
  const videoCallback = useCallback((node: HTMLVideoElement | null) => {
    if (!node) {
      // Element unmounting — tear down the player.
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
        playerRef.current = null
      }
      return
    }
    /* Don't try to autoplay with sound — modern browsers block it even
       after a user gesture once an async boundary (Plyr's dynamic import)
       separates the click from the play(). Instead the big-play overlay
       sits centred on the first frame; one tap starts playback with
       sound, no surprise muting. */
    let cancelled = false
    ;(async () => {
      const PlyrMod = await import('plyr')
      if (cancelled) return
      const p = new PlyrMod.default(node, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'fullscreen'],
        hideControls: true,
        autoplay: false,
        clickToPlay: true,
        keyboard: { focused: true, global: true },
        ratio: '16:9',
        tooltips: { controls: false, seek: true },
      })
      playerRef.current = p
    })()
  }, [])

  return (
    <LocationModal open={open} onClose={onClose} label="WATCH" bleed>
      <div className="aura-film">
        <video
          ref={videoCallback}
          playsInline
          preload="auto"
        >
          {/* The "Enter the ecosystem" film. Browsers pick the first source
              they can decode — webm preferred on Chrome / Firefox (smaller),
              mp4 fallback for Safari which doesn't support webm. */}
          <source src="/aura-25.webm" type="video/webm" />
          <source src="/aura-25.mp4" type="video/mp4" />
        </video>
      </div>
      <style jsx global>{`
        /* Container fills the bleed area; Plyr handles the 16:9 ratio. */
        .aura-film { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 0; }
        .aura-film .plyr { width: 100%; max-width: min(100vw, calc(100vh * 16 / 9)); }
        .aura-film .plyr--video { background: #000; }

        /* Minimalist theme — white accent, no blue, subtle gradient. */
        .aura-film .plyr {
          --plyr-color-main: #ffffff;
          --plyr-video-control-color: #ffffff;
          --plyr-video-control-color-hover: #ffffff;
          --plyr-video-control-background-hover: rgba(255, 255, 255, 0.12);
          --plyr-video-background: #000;
          --plyr-control-icon-size: 16px;
          --plyr-control-spacing: 14px;
          --plyr-font-family: var(--font-mono);
          --plyr-font-size-time: 12px;
          --plyr-range-track-height: 2px;
          --plyr-range-thumb-height: 10px;
          --plyr-range-thumb-background: #ffffff;
          --plyr-range-fill-background: #ffffff;
          --plyr-range-thumb-shadow: none;
          --plyr-tooltip-background: rgba(0, 0, 0, 0.7);
          --plyr-tooltip-color: #ffffff;
          --plyr-video-controls-background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%);
        }
        /* Hide chrome we don't want for a brand film. */
        .aura-film .plyr__menu,
        .aura-film .plyr__captions,
        .aura-film .plyr__poster { display: none; }
        /* Cursor follows the site convention — hide the system cursor inside the player. */
        .aura-film .plyr,
        /* Plyr controls — let the native arrow / pointer show through. */
        /* Refine the big centered play button. */
        .aura-film .plyr__control--overlaid {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.7);
          padding: 22px;
          backdrop-filter: blur(4px);
          transition: background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
        }
        .aura-film .plyr__control--overlaid:hover {
          background: rgba(0, 0, 0, 0.55);
          border-color: #fff;
        }
        .aura-film .plyr__control--overlaid svg { width: 22px; height: 22px; }
        /* Time text in DM Mono. */
        .aura-film .plyr__time { font-family: var(--font-mono); letter-spacing: 0.04em; }
      `}</style>
    </LocationModal>
  )
}

/* ═══ MUDIGERE ═══ */
function MudigereModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const weather = useWeather(13.1365, 75.6403)
  return (
    <LocationModal open={open} onClose={onClose} label="MUDIGERE">
      <LocationContent>
        <div className="loc-top">
          <div className="loc-pencil-mobile">
            <img src="/aura-mudigere-pencil.jpg" alt="Pencil illustration of the Mudigere estate" style={{ width: '100%', borderRadius: 'var(--radius-1)', display: 'block', objectFit: 'cover', aspectRatio: '4 / 5' }} />
          </div>
          <div>
            <h2 className="loc-h2" style={{ marginBottom: 'var(--space-5)' }}>The Land Remembers.</h2>
            <div className="loc-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p>Nestled in the mist of the Western Ghats, this estate operates on a timeline dictated by nature rather than urgency, honoring a legacy where the land continues its own story. Through a philosophy of patient stewardship, coffee and pepper are cultivated with deep restraint, allowing the rhythms of wind, soil, and sun to guide every harvest and fermentation.</p>
              <p>This slow, intentional process ensures that every cup serves as a sensory memory of its origin, reflecting a profound respect for the quiet continuity of the ancient landscape.</p>
            </div>
          </div>
          <div className="loc-images-desktop">
            <img src="/aura-mudigere-pencil.jpg" alt="Pencil illustration of the Mudigere estate" style={{ width: '100%', borderRadius: 'var(--radius-1)', display: 'block', objectFit: 'cover', aspectRatio: '3 / 4' }} />
          </div>
        </div>
        <div className="loc-bottom">
          <LocationDataGrid
            location="Mudigere, Chikmagalur District, Karnataka, India."
            coords="13.1365° N, 75.6403° E"
            altitude="3,600 FT."
            tempRange="14–30°C"
            avgHumidity="58%"
            avgWind="5 KM/H"
            weather={weather}
          >
            <img src="/aura-mudigere-map.svg" alt="Map of the Aura Mudigere estate" className="loc-map" style={{ width: '100%', display: 'block' }} />
          </LocationDataGrid>
          <div>
            <h2 className="loc-h2" style={{ marginBottom: 'var(--space-5)' }}>World&rsquo;s Oldest Arabica Region, Rediscovered.</h2>
            <div className="loc-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p>The Western Ghats are a UNESCO World Heritage biodiversity hotspot — one of the eight most biodiverse regions on earth. Chikmagalur sits within this range at 900&ndash;1100 metres, where altitude, monsoon rainfall, and ancient volcanic soil create conditions for coffee of exceptional complexity.</p>
              <p>Aura&rsquo;s 150&ndash;170 acres are farmed as a four-layer agroforestry system: native shade trees above, pepper vines in the mid-canopy, coffee and tea in the understory, cover crops and soil regeneration plants at ground level.</p>
            </div>
            <img src="/aura-mudigere-landscape.jpg" alt="Aura Mudigere estate in the Western Ghats" style={{ width: '100%', borderRadius: 'var(--radius-1)', display: 'block', objectFit: 'cover', aspectRatio: '16 / 10', marginTop: 'var(--space-6)' }} />
          </div>
        </div>
      </LocationContent>
    </LocationModal>
  )
}

/* ═══ OHARA ═══ */
function OharaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const weather = useWeather(35.1200, 135.8300)
  return (
    <LocationModal open={open} onClose={onClose} label="OHARA">
      <LocationContent>
        <div className="loc-top">
          <div className="loc-pencil-mobile">
            <img src="/aura-ohara-pencil.jpg" alt="Pencil illustration of Aura Ohara" style={{ width: '100%', borderRadius: 'var(--radius-1)', display: 'block', objectFit: 'cover', aspectRatio: '4 / 5' }} />
          </div>
          <div>
            <h2 className="loc-h2" style={{ marginBottom: 'var(--space-5)' }}>The Valley Listens.</h2>
            <div className="loc-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p>Nestled in the quiet valley of Ohara, north of Kyoto, this place moves to the rhythm of light, water, and care rather than speed. Surrounded by cedar forests, rivers, and temples, it is shaped by a way of life that honours stillness, craft, and the quiet intelligence of the land.</p>
              <p>Through a philosophy of restoration over construction, Aura in Ohara grows by listening before leading. The home, garden, and teahouse are not remade in haste, but gently renewed through patience, restraint, and deep respect for what already exists.</p>
              <p>This slow, mindful approach allows each space to hold the memory of its setting — reflecting a way of living rooted in calm, renewal, and the richness of everyday ritual.</p>
            </div>
          </div>
          <div className="loc-images-desktop">
            <img src="/aura-ohara-pencil.jpg" alt="Pencil illustration of Aura Ohara" style={{ width: '100%', borderRadius: 'var(--radius-1)', display: 'block', objectFit: 'cover', aspectRatio: '3 / 4' }} />
          </div>
        </div>
        <div className="loc-bottom">
          <LocationDataGrid
            location="Ohara, Kyoto, Japan."
            coords="35.1200° N, 135.8300° E"
            altitude="1,099 FT."
            tempRange="7–28°C"
            avgHumidity="64%"
            avgWind="14 KM/H"
            weather={weather}
          />
          <div>
            <h2 className="loc-h2" style={{ marginBottom: 'var(--space-5)' }}>Kyoto&rsquo;s Quiet Valley, Rediscovered.</h2>
            <div className="loc-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p>Ohara is a place of cedar forests, rivers, temples, and hand-tended fields — where farmers still work by hand and artisans move by rhythm, not by clock. It is here that Aura belongs: not to transform the valley, but to listen to it.</p>
              <p>The site is envisioned through the restoration of a 70-year-old home and a 30-year garden, with a teahouse renewed by a Kyoto craftsman and cared for across generations. Rooted in wabi-sabi, Aura Ohara embraces imperfection, continuity, and a rich, mindful life shaped by light, calm, and reflection.</p>
            </div>
            <img src="/aura-ohara-landscape.jpg" alt="Aura Ohara in the valley of Kyoto" style={{ width: '100%', borderRadius: 'var(--radius-1)', display: 'block', objectFit: 'cover', aspectRatio: '16 / 10', marginTop: 'var(--space-6)' }} />
          </div>
        </div>
      </LocationContent>
    </LocationModal>
  )
}

/* ═══════════════════════════════════════════
   AGENT HOME — plain-text view for crawlers / LLMs / screen readers.
   Activated by viewMode === 'agent' (toggle in the menu). Renders the
   entire site's homepage information as a structured DM Mono document
   with proper semantic HTML — headings, lists, definition lists, links.
   No images, no animations, no overlays. CSS in globals.css does the
   typography (forces mono everywhere, normalises heading sizes, etc.).
═══════════════════════════════════════════ */
function AgentHome() {
  return (
    <article className="section-w" style={{ paddingTop: 'var(--space-9)', paddingBottom: 'var(--space-9)' }}>
      {/* Site nav — plain link list so crawlers can reach every route. */}
      <nav className="agent-nav" aria-label="Aura site navigation">
        <p className="label">AURA · theaura.life · agent view</p>
        <ul className="agent-nav__list">
          <li><a href="/">Home</a></li>
          <li><a href="/reason">Reason</a></li>
          <li><a href="/brand">Brand</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/idea">1000 Year Idea</a></li>
          <li><a href="/sanctuary">Sanctuary</a></li>
          <li><a href="/artistry">Artistry</a></li>
          <li><a href="/residency">Residency</a></li>
          <li><a href="/provenance">Provenance</a></li>
          <li><a href="/coffee">Coffee</a></li>
          <li><a href="/pepper">Pepper</a></li>
          <li><a href="/areca">Areca</a></li>
          <li><a href="/biodynamic">Biodynamic</a></li>
          <li><a href="/vedic">Vedic</a></li>
          <li><a href="/fermentation">Fermentation</a></li>
          <li><a href="/living-systems">Living Systems</a></li>
          <li><a href="/land">Land</a></li>
          <li><a href="/wisdom">Moral Spine</a></li>
          <li><a href="/rta">Rta</a></li>
        </ul>
      </nav>

      <header>
        <h1>Aura — a regenerative ecosystem for generational impact.</h1>
        <p>Aura is a platform that joins ancient land intelligence with modern tools to build systems that endure across generations. Not a company. Not an NGO. Not a farm. Not a hotel. An open-source framework for how to live with land.</p>
        <p>The reason is to restore what sustains us. Everything here is built to endure. Land, hospitality, craft, and technology — one regenerative ecosystem.</p>
        <p><strong>Tagline:</strong> Land. Time. Practice.</p>
      </header>

      <hr />

      <section>
        <h2>Entity</h2>
        <dl>
          <dt>Type</dt><dd>Regenerative ecosystem</dd>
          <dt>Founded</dt><dd>2024</dd>
          <dt>Founder</dt><dd>Arvind Singh</dd>
          <dt>Headquarters</dt><dd>Singapore</dd>
          <dt>Domain</dt><dd><a href="https://theaura.life">theaura.life</a></dd>
          <dt>Contact</dt><dd><a href="mailto:hello@theaura.life">hello@theaura.life</a></dd>
          <dt>Instagram</dt><dd><a href="https://www.instagram.com/theaura.life/" rel="noopener noreferrer">@theaura.life</a></dd>
        </dl>
      </section>

      <hr />

      <section>
        <h2>Operating system — three pillars</h2>
        <ol>
          <li><strong>Sanctuary</strong> — a living estate in rhythm with the land. Silence, stillness, a 30-year Japanese garden, forest walks, the river from every room.</li>
          <li><strong>Agroculture</strong> — 100 acres of specialty coffee. 52 indigenous Gidda cattle. Biodynamic (BD 500–508, CPP, lunar cycles) plus Vedic (Jeevamrit, Panchgavya, Beejamrit) farming systems. UNESCO biodiversity zone.</li>
          <li><strong>Artistry</strong> — studios, workshops, gallery, gurukul, labs, festivals. Residencies for founders, designers, artists, and monastic polymaths.</li>
        </ol>
      </section>

      <hr />

      <section>
        <h2>Locations</h2>

        <h3>Aura Mudigere — active</h3>
        <p><a href="/sanctuary">Read more</a></p>
        <dl>
          <dt>Coordinates</dt><dd>13.1365°N, 75.6403°E</dd>
          <dt>Altitude</dt><dd>3,600 ft (900–1,100 m)</dd>
          <dt>Area</dt><dd>150 acres (100 coffee)</dd>
          <dt>Soil</dt><dd>Laterite, pH 6.0–6.5</dd>
          <dt>Zone</dt><dd>UNESCO Western Ghats biodiversity hotspot</dd>
          <dt>Climate</dt><dd>14–30°C, humidity 58%, wind 5 km/h</dd>
          <dt>Herd</dt><dd>52 Gidda cattle (indigenous breed)</dd>
        </dl>

        <h3>Aura Ohara — active</h3>
        <p><a href="/sanctuary">Read more</a></p>
        <dl>
          <dt>Coordinates</dt><dd>35.1200°N, 135.8300°E</dd>
          <dt>Altitude</dt><dd>1,099 ft</dd>
          <dt>Climate</dt><dd>7–28°C, humidity 64%, wind 14 km/h</dd>
          <dt>Features</dt><dd>Japanese garden, teahouse, café, studios</dd>
        </dl>

        <h3>Aura Munduk — planned</h3>
        <dl><dt>Location</dt><dd>Bali, Indonesia</dd></dl>

        <h3>Aura Daylesford — planned</h3>
        <dl><dt>Location</dt><dd>Victoria, Australia</dd></dl>
      </section>

      <hr />

      <section>
        <h2>Coffee programme</h2>
        <p><a href="/coffee">Read more</a></p>
        <dl>
          <dt>Varieties</dt><dd>Arabica S795, Selection 9, Chandragiri</dd>
          <dt>Processing</dt><dd>6 micro lots, 6 methods</dd>
          <dt>Stage</dt><dd>Optimize → Specialize (Stage 3 → 4)</dd>
        </dl>
        <h3>Lots</h3>
        <ul>
          <li><strong>LOT_001 · Anaerobic Natural</strong> — 450 kg, Brix 24–26, 72 h sealed + 20 d dry. Notes: berries, wine, stone fruit.</li>
          <li><strong>LOT_002 · Dry Osmosis</strong> — 380 kg, Brix 28–30, sun + time. Notes: chocolate, dried fruit, caramel.</li>
          <li><strong>LOT_003 · Red Honey</strong> — 520 kg, Brix 22–24, 48 h wet + 20 d dry. Notes: florals, honey, citrus.</li>
          <li><strong>LOT_004 · Banana Wash</strong> — 410 kg, Brix 20–22, 36 h + 18 d dry. Notes: tropical, fruit punch, bright.</li>
          <li><strong>LOT_005 · Solera Maceration</strong> — 480 kg, Brix 25–27, 96 h sealed + 22 d dry. Notes: plum, jasmine, dark chocolate.</li>
          <li><strong>LOT_006 · Solera Wash</strong> — 390 kg, Brix 21–23, 60 h wet + 21 d dry. Notes: clean, almond, white tea.</li>
        </ul>
      </section>

      <hr />

      <section>
        <h2>Crops</h2>
        <dl>
          <dt>Coffee</dt><dd>100 acres, Arabica S795 / Selection 9 / Chandragiri, specialty-grade.</dd>
          <dt>Pepper</dt><dd>Malabar, shade-grown under native canopy, biodynamic. <a href="/pepper">More</a></dd>
          <dt>Areca</dt><dd>Traditional intercrop, economic anchor, forest structure. <a href="/areca">More</a></dd>
          <dt>Tea</dt><dd>Experimental plots at 3,600 ft, testing cultivar adaptation.</dd>
        </dl>
      </section>

      <hr />

      <section>
        <h2>Farming method</h2>
        <p><a href="/biodynamic">Biodynamic</a> · <a href="/vedic">Vedic</a> · <a href="/living-systems">Living systems</a> · <a href="/fermentation">Fermentation</a></p>
        <dl>
          <dt>System 1</dt><dd>Biodynamic — BD 500–508, CPP, lunar cycles.</dd>
          <dt>System 2</dt><dd>Vedic — Jeevamrit, Panchgavya, Beejamrit.</dd>
          <dt>Approach</dt><dd>Not competing — complementary intelligence.</dd>
          <dt>Certification</dt><dd>Regenerative (not organic-as-marketing).</dd>
          <dt>Stages</dt><dd>Stabilize → Rebuild → Optimize → Specialize → Higher-value.</dd>
          <dt>Current stage</dt><dd>3 → 4</dd>
        </dl>
      </section>

      <hr />

      <section>
        <h2>Six rules</h2>
        <p><a href="/wisdom">Moral spine</a> · <a href="/rta">Rta</a></p>
        <ol>
          <li><strong>Soil comes first</strong> — all decisions flow from soil health.</li>
          <li><strong>Do small work properly</strong> — mastery before scaling.</li>
          <li><strong>No shortcuts</strong> — right timing over quick gains.</li>
          <li><strong>Quality before quantity</strong> — one excellent lot over five average ones.</li>
          <li><strong>Think 10 years ahead</strong> — every action serves the long game.</li>
          <li><strong>Leaders on the field</strong> — authority comes from presence and practice.</li>
        </ol>
      </section>

      <hr />

      <section>
        <h2>Residency</h2>
        <p><a href="/residency">Read more</a> · <a href="/artistry">Artistry</a></p>
        <p>Monastic polymaths. Crazy misfits. An embedded residency across two countries (soon three). Two weeks minimum. Pre-selected.</p>
        <ul>
          <li>Design residencies — 2–4 weeks. Working briefs from the farm, sanctuary, product OS.</li>
          <li>Craft workshops — 5–10 days. Shigaraki ceramics, Washi Kobo paper, Uji tea, Malnad weaving, natural dye.</li>
          <li>Gurukul — 1 teacher, 1 student. Long apprenticeships in a single discipline.</li>
          <li>Labs — project-scoped. Sensor, world-model, or workflow problems.</li>
          <li>Gallery — rolling. An exhibition arm for work made on the estate.</li>
          <li>Festivals — annual. The Gathering / Bhoomi Festival.</li>
        </ul>
        <p>Apply: write to <a href="mailto:residency@theaura.life">residency@theaura.life</a>.</p>
      </section>

      <hr />

      <section>
        <h2>Provenance</h2>
        <p><a href="/provenance">Read more</a></p>
        <p>Cherry to cup, on chain. Three layers — blockchain provenance, live sensors, and a persistent machine memory grown from the farm&rsquo;s own readings. Together they replace the forty-thousand-dollar certification stack with something the land itself can verify.</p>
      </section>

      <hr />

      <section>
        <h2>The 1,000-year idea</h2>
        <p><a href="/idea">Read more</a></p>
        <p>The frame by which every choice is measured. We think in generations.</p>
      </section>

      <hr />

      <section>
        <h2>Contact</h2>
        <dl>
          <dt>Email</dt><dd><a href="mailto:hello@theaura.life">hello@theaura.life</a></dd>
          <dt>Residency</dt><dd><a href="mailto:residency@theaura.life">residency@theaura.life</a></dd>
          <dt>Instagram</dt><dd><a href="https://www.instagram.com/theaura.life/" rel="noopener noreferrer">@theaura.life</a></dd>
          <dt>Presence</dt><dd>Singapore · India · Japan · Indonesia · Australia</dd>
        </dl>
        <p>Arvind Singh, Founder · Mudigere &amp; Ohara · 2026</p>
      </section>
    </article>
  )
}

/* ═══════════════════════════════════════════
   SANCTUARY BANNER — full-screen, scroll-driven blur reveal
   Same pattern as HeroVideo: 300vh wrapper, sticky 100vh stage,
   blur lifts as you scroll, content fades in then out.
═══════════════════════════════════════════ */

type Sanctuary = {
  name: string
  tagline: string
  region: string
  coords: string
  /** Static image background (also doubles as poster for video). */
  bgSrc?: string
  /** Optional MP4 background. Plays muted+looped+autoplay+inline. Falls back
   *  to bgSrc when video can't load or while it buffers. */
  bgVideo?: string
  bgColor?: string
  comingSoon?: boolean
}

const MUDIGERE: Sanctuary = {
  name: 'Mudigere',
  tagline: 'Regenerative plantation sanctuary',
  region: 'KARNATAKA, INDIA',
  coords: '13.13°N · 75.63°E',
  bgVideo: '/aura-mudigere.mp4',
  bgSrc: '/aura-mudigere.jpg',
}
const OHARA_S: Sanctuary = {
  name: 'Ohara',
  tagline: 'Retreats and slow living in nature',
  region: 'KYOTO PREFECTURE, JAPAN',
  coords: '35.13°N · 135.83°E',
  bgVideo: '/aura-ohara.mp4',
  bgSrc: '/aura-ohara.jpg',
}
const DAYLESFORD: Sanctuary = {
  name: 'Daylesford',
  tagline: 'A space for craft and wellbeing',
  region: 'VICTORIA, AUSTRALIA',
  coords: '37.34°S · 144.14°E',
  /* Daylesford ships as a still image only — no MP4 available. */
  bgSrc: '/aura-daylesford.jpg',
  comingSoon: true,
}
const MUNDUK: Sanctuary = {
  name: 'Munduk',
  tagline: 'Mountain sanctuary for restoration',
  region: 'BALI, INDONESIA',
  coords: '8.27°S · 115.06°E',
  bgVideo: '/aura-munduk.mp4',
  bgSrc: '/aura-munduk.jpg',
  comingSoon: true,
}

function useBlurReveal() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const blurRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const wrap = wrapRef.current
        const blur = blurRef.current
        const content = contentRef.current
        if (!wrap || !blur) return
        const rect = wrap.getBoundingClientRect()
        const range = wrap.offsetHeight - window.innerHeight
        if (range <= 0) return
        const p = Math.max(0, Math.min(1, -rect.top / range))
        const fadeIn = Math.min(1, p / 0.15)
        const blurLift = Math.max(0, Math.min(1, (p - 0.7) / 0.3))
        if (content) content.style.opacity = `${fadeIn}`
        const blurVal = (1 - blurLift) * 16
        blur.style.backdropFilter = `blur(${blurVal}px)`
        ;(blur.style as { WebkitBackdropFilter?: string }).WebkitBackdropFilter = `blur(${blurVal}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { wrapRef, blurRef, contentRef }
}

function SanctuaryBg({ s }: { s: Sanctuary }) {
  /* Sanctuary background tint — flat 12% black, no radial darkening.
     The heading + tagline rely on their text-shadow for contrast against
     bright photo regions; the dark circle vignette is gone. */
  const TINT = (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.12)',
        pointerEvents: 'none',
      }}
    />
  )

  if (s.bgVideo) {
    return (
      <>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={s.bgSrc}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={s.bgVideo} type="video/mp4" />
        </video>
        {TINT}
      </>
    )
  }
  if (s.bgSrc) {
    return (
      <>
        {/* Background plate for the sanctuary panel — the heading above
            already names the place; this image is purely decorative. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.bgSrc} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        {TINT}
      </>
    )
  }
  return <div style={{ position: 'absolute', inset: 0, background: s.bgColor || '#7e807c' }} />
}

function SanctuaryContent({ s, large = false, onExplore }: { s: Sanctuary; large?: boolean; onExplore?: () => void }) {
  const Heading = large ? 'h1' : 'h2'
  return (
    <div
      className="sanctuary-content"
      data-large={large ? 'true' : 'false'}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        /* Single-banner (large=true): top-anchored heading via 32vh padding.
           2-col panel (large=false): heading vertically centred, meta absolutely
           anchored to the bottom (see meta block below). Padding is symmetric
           on the 2-col so `justify-content: center` lands the heading on the
           true vertical centre of the picture. Mobile override below centres
           the large heading too. */
        justifyContent: large ? 'space-between' : 'center',
        alignItems: 'center',
        height: '100%',
        padding: large ? '32vh var(--gutter) 48px' : '48px var(--gutter)',
        textAlign: 'center',
        color: '#ffffff',
      }}
    >
      {/* Name + tagline — subtle text-shadow plus the radial darken on the
          photo guarantees legibility against any image highlight. */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Heading style={{
          fontFamily: 'var(--font-grotesque)',
          fontSize: large ? 'clamp(64px, 16vw, 280px)' : 'clamp(32px, 5.5vw, 60px)',
          lineHeight: large ? 1 : 1.06,
          letterSpacing: large ? '-0.06em' : '-0.05em',
          margin: 0,
          marginBottom: 20,
          color: '#ffffff',
          fontWeight: 400,
          textShadow: '0 2px 24px rgba(0, 0, 0, 0.35)',
        }}>
          {s.name}
        </Heading>
        <p className="p2" style={{ color: '#ffffff', margin: 0, maxWidth: 'min(260px, 80vw)', textShadow: '0 1px 12px rgba(0, 0, 0, 0.4)' }}>{s.tagline}</p>
      </div>

      {/* Bottom-anchored meta. For large (Mudigere/Ohara): region/coords pinned
          bottom-left, "Explore Sanctuary" pinned bottom-right — mirrors the
          aura-hero banner CTA pattern. For 2-col (Munduk/Daylesford): keep the
          centered stack — those panels aren't clickable, just announce
          "coming soon". */}
      {large ? (
        <div className="sanctuary-meta" style={{
          position: 'absolute',
          left: 0,
          right: 0,
          padding: '0 var(--gutter)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 'var(--space-5)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <p className="label" style={{ color: '#ffffff', margin: 0 }}>{s.region}</p>
            <p className="label" style={{ color: '#ffffff', margin: 0 }}>{s.coords}</p>
          </div>
          {/* The Explore CTA is the only hit area for the whole panel. */}
          <button
            type="button"
            onClick={onExplore}
            aria-label={`Open ${s.name} details`}
            className="label"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              color: '#ffffff',
              margin: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              pointerEvents: 'auto',
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                lineHeight: 1,
                letterSpacing: 0,
                fontWeight: 400,
                color: '#fff',
              }}
            >
              +
            </span>
            Explore {s.name}
          </button>
        </div>
      ) : (
        /* Bottom labels — same rhythm as the large-banner Ohara/Mudigere
           meta: bottom inset matches `.sanctuary-meta` (clamp 24-56), and
           the two labels sit 6px apart in a column. Centred (not left-
           anchored) because the 2-col panels don't carry an Explore CTA on
           the opposite side. */
        <div style={{ position: 'absolute', bottom: 'clamp(24px, 5vh, 56px)', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <p className="label" style={{ color: '#ffffff', margin: 0 }}>{s.region}</p>
          {s.comingSoon ? (
            <p className="label" style={{ color: '#ffffff', letterSpacing: 2, margin: 0 }}>COMING SOON</p>
          ) : (
            <p className="label" style={{ color: '#ffffff', margin: 0 }}>{s.coords}</p>
          )}
        </div>
      )}
      <style jsx>{`
        :global(.sanctuary-meta) {
          bottom: clamp(24px, 5vh, 56px);
        }
        @media (max-width: 768px) {
          :global(.sanctuary-meta) {
            bottom: var(--gutter);
          }
        }
      `}</style>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Stacking sanctuary panels with per-panel blur reveal.

   Layout: each panel is `position: sticky; top: 0; height: 100vh`
   inside a shared 300vh parent. Stacking happens via document flow
   (panel N at parent y = (N-1) × 100vh) and z-index ascending.

   Scroll narrative (per banner):
     1. Panel slides up from below — heavy 16 px blur
     2. Panel sticks at top:0 — blur lifts smoothly to 0 over ~40vh
     3. Panel is clear and admired
     4. Next panel slides up over it (this panel stays clear underneath)

   Each panel computes its own blur from the PARENT container's scroll
   position. Panel z's "stick start" is at scrollIntoParent = (z-1)*vh.
   Blur lifts during the next 0.4 × vh of scroll past that point.
   ────────────────────────────────────────────────────────────── */

/* Per-panel scroll rhythm (with spacers between panels):
     Panel z natural position in parent  = (z-1) × 200vh
     Panel z stick start (top:0)         = (z-1) × 200vh
     Panel z slide-up phase              = (z-1) × 200vh - 100vh  →  (z-1) × 200vh
     Panel z clarity hold                = (z-1) × 200vh + 30vh   →  z × 200vh - 100vh
     Panel z gets covered by next        = z × 200vh - 100vh      →  z × 200vh

   PANEL_STRIDE = 200vh (one panel + one spacer). Bumped from a 100vh stride
   to give each panel a real 70vh clarity hold before the next slides over.

   Hook: drives 1..N blur refs. Blur is heavy (BLUR_MAX) while the panel is
   sliding up from below + at the moment it sticks, then lifts smoothly over
   the next BLUR_LIFT_RANGE of scroll. Stays at 0 for the rest of the panel's
   topmost window (the clarity hold) until the next panel covers it. */
const PANEL_STRIDE_VH = 2 // 200vh per panel slot (100vh panel + 100vh spacer)
const BLUR_MAX = 24       // heavier initial blur than before (was 16)
const BLUR_LIFT_RANGE = 0.3 // lift over 30% of a viewport once stuck

function useStackBlur(z: number, blurRefs: React.RefObject<HTMLDivElement | null>[]) {
  const wrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      for (const r of blurRefs) {
        if (r.current) {
          r.current.style.backdropFilter = 'blur(0)'
          ;(r.current.style as { WebkitBackdropFilter?: string }).WebkitBackdropFilter = 'blur(0)'
        }
      }
      return
    }
    const matchMobile = window.matchMedia('(max-width: 768px)')

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const wrap = wrapRef.current
        if (!wrap) return
        const vh = window.innerHeight
        const isMobile = matchMobile.matches

        let blurLift: number
        if (isMobile) {
          // Mobile: each panel is in normal flow (no sticky-stack rhythm).
          // Compute entry progress per-panel from its own bounding rect —
          // heavy blur when the panel is below the viewport, lifts to 0
          // as the panel reaches the upper third of the viewport.
          //   rect.top = vh   → blurLift 0 (full blur, just entering)
          //   rect.top = vh*0.2 → blurLift 1 (cleared)
          const rect = wrap.getBoundingClientRect()
          const startY = vh
          const endY = vh * 0.2
          blurLift = Math.max(0, Math.min(1, (startY - rect.top) / (startY - endY)))
        } else {
          // Desktop: sticky-stack rhythm. Panel z's natural stick-start lives
          // at (z-1) × PANEL_STRIDE_VH × vh into the parent. Blur is heavy
          // until that point, then lifts over BLUR_LIFT_RANGE × vh.
          const parent = wrap.parentElement
          if (!parent) return
          const parentRect = parent.getBoundingClientRect()
          const scrollIntoParent = -parentRect.top
          const stickStart = (z - 1) * PANEL_STRIDE_VH * vh
          const scrollPastStickStart = scrollIntoParent - stickStart
          blurLift = Math.max(0, Math.min(1, scrollPastStickStart / (vh * BLUR_LIFT_RANGE)))
        }

        const blurVal = (1 - blurLift) * BLUR_MAX
        for (const r of blurRefs) {
          if (!r.current) continue
          r.current.style.backdropFilter = `blur(${blurVal}px)`
          ;(r.current.style as { WebkitBackdropFilter?: string }).WebkitBackdropFilter = `blur(${blurVal}px)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
    // blurRefs is intentionally read fresh each call — its array identity may
    // change per render but the ref objects inside are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [z])
  return wrapRef
}

function SanctuaryStackPanel({ s, z, onClick }: { s: Sanctuary; z: number; onClick?: () => void }) {
  const blurRef = useRef<HTMLDivElement>(null)
  const wrapRef = useStackBlur(z, [blurRef])
  const clickable = !!onClick
  return (
    <div ref={wrapRef} className="sanctuary-panel" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', zIndex: z }}>
      <SanctuaryBg s={s} />
      <div ref={blurRef} style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />
      <div
        className="sanctuary-clickable"
        style={{ position: 'absolute', inset: 0 }}
      >
        <SanctuaryContent s={s} large onExplore={clickable ? onClick : undefined} />
      </div>
    </div>
  )
}

function SanctuaryStackPanel2Col({ left, right, z }: { left: Sanctuary; right: Sanctuary; z: number }) {
  const blurLeftRef = useRef<HTMLDivElement>(null)
  const blurRightRef = useRef<HTMLDivElement>(null)
  const wrapRef = useStackBlur(z, [blurLeftRef, blurRightRef])
  return (
    <div ref={wrapRef} className="sanctuary-2col-panel" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', zIndex: z }}>
      <div className="sanctuary-2col-bg" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <div style={{ position: 'relative', overflow: 'hidden', marginRight: -1 }}>
          <SanctuaryBg s={left} />
          <div ref={blurLeftRef} style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <SanctuaryBg s={right} />
          <div ref={blurRightRef} style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />
        </div>
      </div>
      <div className="sanctuary-2col-content" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <SanctuaryContent s={left} />
        <SanctuaryContent s={right} />
      </div>
      {/* Mobile-specific overrides for this 2-col now live in globals.css —
          on mobile the grid collapses to 1fr + 2 stacked rows so each
          sanctuary gets a full-width readable cell. */}
    </div>
  )
}

export default function Home() {
  const [mudigereOpen, setMudigereOpen] = useState(false)
  const [oharaOpen, setOharaOpen] = useState(false)
  const [filmOpen, setFilmOpen] = useState(false)
  const closeFilm = useCallback(() => setFilmOpen(false), [])
  const openFilm = useCallback(() => setFilmOpen(true), [])

  /* Sanctuary modals get a vanity URL: /mudigere or /ohara. We use
     history.pushState (not Next.js routing) so no real route is fetched —
     the modal stays mounted on the homepage. On close, push back to /;
     on the browser back button, popstate closes whichever is open. */
  const openMudigere = useCallback(() => {
    setMudigereOpen(true)
    if (typeof window !== 'undefined' && window.location.pathname !== '/mudigere') {
      window.history.pushState({ modal: 'mudigere' }, '', '/mudigere')
    }
  }, [])
  const closeMudigere = useCallback(() => {
    setMudigereOpen(false)
    if (typeof window !== 'undefined' && window.location.pathname === '/mudigere') {
      window.history.pushState({}, '', '/')
    }
  }, [])
  const openOhara = useCallback(() => {
    setOharaOpen(true)
    if (typeof window !== 'undefined' && window.location.pathname !== '/ohara') {
      window.history.pushState({ modal: 'ohara' }, '', '/ohara')
    }
  }, [])
  const closeOhara = useCallback(() => {
    setOharaOpen(false)
    if (typeof window !== 'undefined' && window.location.pathname === '/ohara') {
      window.history.pushState({}, '', '/')
    }
  }, [])

  // Back-button closes whichever sanctuary modal is open.
  useEffect(() => {
    const onPop = () => {
      setMudigereOpen(false)
      setOharaOpen(false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* Gate hero entrance animations until after React has mounted client-side.
     Server-rendered HTML has the .hero-anim-- modifier classes but no
     animation-name (CSS gates that on [data-hero-ready="true"]). Once this
     effect fires, animations begin — guaranteeing no SSR/CSR race that
     could flash an element at the wrong opacity/transform. */
  const [heroReady, setHeroReady] = useState(false)
  useEffect(() => {
    // rAF ensures we don't dispatch on the same paint frame as hydration
    const id = requestAnimationFrame(() => setHeroReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div>
      <MudigereModal open={mudigereOpen} onClose={closeMudigere} />
      <OharaModal open={oharaOpen} onClose={closeOhara} />
      <AuraVideoModal open={filmOpen} onClose={closeFilm} />

      {/* ═══ AGENT MODE — markdown-style plain text ═══ */}
      <AgentHomeView />

      {/* ═══ HUMAN MODE — full visual landing page ═══ */}
      <div className="human-only">

      {/* Hero — display row / metadata row / display row / 3 CTA tiles.
          data-hero-ready flips to "true" after first paint; CSS uses this to
          gate animation-name on .hero-anim children so they can't run until
          React is fully mounted. */}
      <section className="hero-section" data-hero-ready={heroReady ? 'true' : 'false'}>
        <div className="hero-section-w">
          {/*
            Above-the-fold entrance — flows like water.
            Each step starts before the previous finishes; tails blend so there
            are no pauses. ~160ms cadence between starts, ~600–700ms tails.

              1. A REGENERATIVE COMPANY      — fall  (0    → 700ms)
              2. FOR GENERATIONAL IMPACT     — rise  (140  → 840ms)
              3. Aura logo                   — fade  (320  → 820ms)
              4. Nestled in nature… (think)  — fade  (480  → 980ms)
              5. We combine… (copy)          — fade  (640  → 1140ms)
              6. Tile 1: Aura is not built   — rise  (800  → 1400ms)
              7. Tile 2: Rhythm over speed   — rise  (920  → 1520ms)
              8. Tile 3: Get in touch        — rise  (1040 → 1640ms)
            Total ~1.65s.
          */}

          {/* 1. Top display: A REGENERATIVE COMPANY (justified edge-to-edge).
              Inline `opacity: 0` guards against the global CSS rule not having
              applied yet on first paint — the keyframe animation still drives
              the reveal and `animation-fill-mode: both` holds the final state. */}
          <h1 className="hero-display hero-anim hero-anim--fall" style={{ opacity: 0, animationDuration: '700ms', animationDelay: '0ms' }}>
            <span>A</span>{' '}
            <span>REGENERATIVE</span>{' '}
            <span>COMPANY</span>
          </h1>

          {/* Mid row: aura wordmark · think in generations · we combine. */}
          <div className="hero-mid">
            {/* 3. Aura logo */}
            <div className="hero-mid__logo hero-anim hero-anim--fade" style={{ opacity: 0, animationDuration: '500ms', animationDelay: '320ms' }}>
              <LogoEmblem size={132} />
            </div>
            {/* 4. Think label */}
            <p className="label hero-mid__think hero-anim hero-anim--fade" style={{ opacity: 0, animationDuration: '500ms', animationDelay: '480ms' }}>
              Nestled in nature, our sanctuary invites leaders, creators, and organisations into inspiration and flow
            </p>
            {/* 5. Copy label */}
            <p className="label hero-mid__copy hero-anim hero-anim--fade" style={{ opacity: 0, animationDuration: '500ms', animationDelay: '640ms' }}>
              We combine ancestral wisdom with creative capital to make what the future cannot automate
            </p>
          </div>

          {/* 2. Bottom display: FOR GENERATIONAL IMPACT (justified edge-to-edge) */}
          <h1 className="hero-display hero-anim hero-anim--rise" style={{ opacity: 0, animationDuration: '700ms', animationDelay: '140ms' }}>
            <span>FOR</span>{' '}
            <span>GENERATIONAL</span>{' '}
            <span>IMPACT</span>
          </h1>

          {/* 6 / 7 / 8. Three CTA tiles — staggered after the mid-row text settles.
              Media slots map to dedicated /public assets:
                · aura-grown.jpg   — Reason  (left)
                · aura-depth.jpg   — Brand   (middle)
                · aura-contact.jpg — Contact (right) */}
          <div className="hero-tiles">
            {[
              { href: '/reason',  l1: 'Aura is not built,',     l2: 'it is grown',     pill: 'The Reason', img: '/aura-grown.jpg',   video: '/aura-grown.mp4', symbol: '/aura-symbol-1.png', alt: 'Aura — patient, grown systems'              },
              { href: '/brand',   l1: 'Rhythm over speed,',     l2: 'depth and width', pill: 'Our Brand',  img: '/aura-depth.jpg',   video: '/aura-depth.mp4', symbol: '/aura-symbol-2.png', alt: 'Aura — rhythm, depth and breadth of practice' },
              { href: '/contact', l1: 'Get in touch',           l2: 'with Aura',       pill: 'Contact Us', img: '/aura-contact.jpg', video: undefined,         symbol: '/aura-symbol-3.png', alt: 'Aura — people behind the sanctuary'         },
            ].map((tile, i) => (
              <Link
                key={tile.href}
                href={tile.href}
                className="hero-tile hero-anim hero-anim--rise"
                style={{ opacity: 0, animationDuration: '600ms', animationDelay: `${800 + i * 120}ms` }}
              >
                <div className="hero-tile__media" aria-hidden>
                  {tile.video ? (
                    /* Tile with motion: autoplay + loop, jpg poster as
                       fallback while it buffers (or for browsers that
                       can't decode). */
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={tile.img}
                      aria-label={tile.alt}
                    >
                      <source src={tile.video} type="video/mp4" />
                    </video>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tile.img} alt={tile.alt} />
                  )}
                  {/* Symbol fades in centred over the blurred image on hover.
                      Order matches position: 1 = left, 2 = mid, 3 = right. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="hero-tile__symbol" src={tile.symbol} alt="" aria-hidden />
                </div>
                <p className="label hero-tile__caption">{tile.l1}<br />{tile.l2}</p>
              </Link>
            ))}
          </div>
        </div>

        <style jsx>{`
          .hero-section {
            min-height: 100vh;
            /* Pulled up 40px from the original baseline (was -20px, now -40px). */
            padding: calc(var(--section-gap) + 56px - 40px) 0 var(--section-gap);
            display: flex;
            align-items: center;
          }
          .hero-section-w {
            /* Match the navbar's 10vw rails — content sits inside the same
               span as the logo and hamburger. 5vw side margin gets us there. */
            width: calc(100% - 10vw);
            margin: 0 5vw;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: clamp(32px, 6vh, 72px);
          }

          /* Hero rows on the homepage are justified edge-to-edge (each word
             in its own span). The base type comes from the global .hero-display. */
          .hero-display {
            display: flex;
            justify-content: space-between;
            white-space: nowrap;
          }

          /* Same column structure as the tile grid below, so the mid-row text
             aligns with the tile captions vertically. */
          .hero-mid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            align-items: center;
            /* Match the hero-tiles gap so the 3 columns of mid metadata
               line up exactly with the 3 tile columns below. */
            gap: clamp(48px, 6vw, 120px);
          }
          .hero-mid__logo {
            color: var(--text);
            display: inline-flex;
            align-items: center;
            /* Minimal indent — just enough to nudge the wordmark off the
               column's left edge without losing alignment with the heading. */
            padding-left: 8px;
          }
          .hero-mid__logo :global(svg) { width: clamp(96px, 11vw, 132px); height: auto; }
          .hero-mid__think,
          .hero-mid__copy {
            color: var(--text);
            margin: 0;
            line-height: 1.6;
            font-size: 10px;
            letter-spacing: 1.4px;
            max-width: 290px;
          }
          .hero-mid__think {
            justify-self: start;
            text-align: left;
          }
          .hero-mid__copy {
            text-align: right;
            justify-self: end;
          }

          .hero-tiles {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            /* Larger gap between thumbnails — more breathing room. */
            gap: clamp(48px, 6vw, 120px);
            margin-top: clamp(-12px, 2vh, 60px);
          }
          .hero-tile {
            display: flex;
            flex-direction: column;
            text-decoration: none;
            color: var(--text);
          }
          .hero-tile :global(.hero-tile__caption) {
            text-decoration: none !important;
          }
          /* Justify the three 80% media blocks to mirror the edge-to-edge
             FOR / GENERATIONAL / IMPACT row above: left / centre / right.
             Both align-items AND an explicit margin force the layout for
             each child so it's bullet-proof against flex quirks. */
          .hero-tiles > .hero-tile:nth-child(1) { align-items: flex-start; }
          .hero-tiles > .hero-tile:nth-child(1) :global(.hero-tile__media),
          .hero-tiles > .hero-tile:nth-child(1) :global(.hero-tile__caption) {
            margin-right: auto;
          }
          .hero-tiles > .hero-tile:nth-child(2) { align-items: center; }
          .hero-tiles > .hero-tile:nth-child(2) :global(.hero-tile__media),
          .hero-tiles > .hero-tile:nth-child(2) :global(.hero-tile__caption) {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-tiles > .hero-tile:nth-child(3) { align-items: flex-end; }
          .hero-tiles > .hero-tile:nth-child(3) :global(.hero-tile__media),
          .hero-tiles > .hero-tile:nth-child(3) :global(.hero-tile__caption) {
            margin-left: auto;
          }
          .hero-tile__media {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            background: #d6d6d6;
            border-radius: var(--radius-1);
            overflow: hidden;
            transition: opacity var(--dur-base) var(--ease);
          }
          .hero-tile__media :global(img:not(.hero-tile__symbol)),
          .hero-tile__media :global(video) {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            /* will-change forces a compositor layer so the filter actually
               applies smoothly (some browsers ignore filter without GPU
               promotion). Slight scale to hide blur-edge soft pixels. */
            will-change: filter;
            transform: scale(1.05);
            transition: filter var(--dur-fast) var(--ease);
          }
          /* Symbol overlay — sits above the blurred image and blends in
             difference mode so it reads on any underlying tone. Tile 1
             (left) → aura-symbol-1, Tile 2 (mid) → symbol-2, Tile 3
             (right) → symbol-3. z-index lifts it above the blur layer. */
          .hero-tile__media :global(.hero-tile__symbol) {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 2;
            width: clamp(64px, 22%, 120px);
            height: auto;
            transform: translate(-50%, -50%) scale(0.85);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.32s var(--ease-out), transform 0.4s var(--ease-spring);
            mix-blend-mode: difference;
          }
          :global(.hero-tile:hover) .hero-tile__media :global(.hero-tile__symbol) {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          /* Hover: only the photo / video blurs out — the symbol stays
             sharp so it sits above the blur clearly. The Link wrapper
             (<a class="hero-tile">) never receives the styled-jsx scope
             class, so the hover selector must be marked :global() to match. */
          :global(.hero-tile:hover) .hero-tile__media :global(img:not(.hero-tile__symbol)),
          :global(.hero-tile:hover) .hero-tile__media :global(video) {
            filter: blur(16px) !important;
          }
          :global(.hero-tile:hover) .hero-tile__media { opacity: 0.85; }
          .hero-tile__caption {
            margin: 16px 0 0;
            color: var(--text);
            line-height: 1.6;
            font-size: 10px;
            letter-spacing: 1.4px;
            /* Desktop: captions stay hidden until the tile is hovered.
               Fades in on hover, fades out when the pointer leaves. */
            opacity: 0;
            transform: translateY(4px);
            transition: opacity 0.28s var(--ease-out), transform 0.28s var(--ease-out);
          }
          :global(.hero-tile:hover) .hero-tile__caption {
            opacity: 1;
            transform: translateY(0);
          }
          /* Caption alignment matches the media justification:
             first = left (default), middle = center, last = right. */
          .hero-tiles > .hero-tile:nth-child(2) .hero-tile__caption {
            text-align: center;
          }
          .hero-tiles > .hero-tile:last-child .hero-tile__caption {
            text-align: right;
          }

          /* Mobile + tablet — top-fold matches paper.design/Aura-Mobile artboard:
             centered display headlines, vertical mid-stack, full-width
             horizontal tile rows with dividers between. Breakpoint pushed up
             to 1023px so tablets get the row layout too (3-col only above
             desktop width). */
          @media (max-width: 1023px) {
            .hero-section {
              /* Tighten the top pad so the headline sits ~64px below the nav,
                 as in the Aura-Mobile artboard. */
              padding: calc(var(--nav-h, 56px) + 24px) 0 var(--section-gap);
            }
            .hero-section-w {
              width: 100%;
              max-width: none;
              margin: 0;
              padding: 0 var(--gutter);
              gap: 53px;
              box-sizing: border-box;
            }

            /* Headlines — Bricolage 44/46 semibold, watermark grey (the same
               #F2F2F2 the desktop hero uses). Block layout + text-align
               justify so each line spreads edge-to-edge inside a column
               that matches the paragraph's larger side margin below. The
               orphan last line stays centred. */
            /* Headlines fill the gutter-bounded content area (full width
               minus var(--gutter) on each side), so left/right text-align
               anchors each line to the same x as the nav logo / hamburger.
               Font sized so both manifesto rows break cleanly into two
               lines:
                 A REGENERATIVE / COMPANY
                 FOR GENERATIONAL / IMPACT
               This requires the long second word (REGENERATIVE / GENERATIONAL)
               plus its preceding short word to fit on one line. */
            .hero-display {
              display: block;
              width: 100%;
              max-width: 100%;
              margin: 0;
              align-self: stretch;
              /* Mobile clamp — tuned so each manifesto h1 wraps to exactly
                 two lines ("A REGENERATIVE / COMPANY", "FOR GENERATIONAL /
                 IMPACT"). 9vw keeps the type display-weight without forcing
                 single-word line breaks. */
              font-size: clamp(36px, 9vw, 52px);
              line-height: 1.04;
              letter-spacing: -0.04em;
              white-space: normal;
              hyphens: none;
              word-break: normal;
              overflow-wrap: normal;
            }
            .hero-display :global(span) { display: inline; }
            /* Mobile: both manifesto headlines centre-aligned across the
               two-line wrap. */
            .hero-display.hero-anim--fall,
            .hero-display.hero-anim--rise {
              text-align: center;
              text-align-last: center;
            }

            /* Mid stack — single column, centered, narrower than the page. */
            .hero-mid {
              grid-template-columns: 1fr;
              gap: 20px;
              align-items: center;
              text-align: center;
              max-width: 240px;
              margin: 0 auto;
            }
            .hero-mid__logo {
              justify-self: center;
              padding-left: 0;
            }
            .hero-mid__logo :global(svg) {
              width: 96px;
              height: auto;
            }
            .hero-mid__think,
            .hero-mid__copy {
              justify-self: center;
              /* Match the .hero-tile__caption type treatment exactly:
                 DM Mono 11px / 1.5, weight 400, 1px tracking, uppercase.
                 Kept full-justified on the long block so it reads as a tidy
                 mono rectangle; the orphan last line centres. */
              text-align: justify;
              text-align-last: center;
              max-width: none;
              font-family: var(--font-mono);
              font-size: 11px;
              line-height: 1.5;
              letter-spacing: 1px;
              font-weight: 400;
              text-transform: uppercase;
              hyphens: none;
            }

            /* Tiles — full-width horizontal rows with dividers between.
               Bigger image (160px → ~45% of viewport), captions in the same
               DM Mono label style used by the rest of the site. Link element
               (<a class="hero-tile">) lives outside the styled-jsx scope, so
               all .hero-tile selectors here use :global. */
            .hero-tiles {
              grid-template-columns: 1fr;
              gap: 0;
              margin-top: 8px;
              border-top: 1px solid var(--border);
            }
            :global(.hero-tiles) > :global(.hero-tile) {
              display: grid !important;
              grid-template-columns: 160px 1fr !important;
              gap: 32px !important;
              align-items: center !important;
              padding: 24px 0 !important;
              border-bottom: 1px solid var(--border) !important;
              flex-direction: row !important;
            }
            :global(.hero-tiles) > :global(.hero-tile):nth-child(1),
            :global(.hero-tiles) > :global(.hero-tile):nth-child(2),
            :global(.hero-tiles) > :global(.hero-tile):nth-child(3) {
              align-items: center !important;
            }
            :global(.hero-tiles) > :global(.hero-tile) :global(.hero-tile__media),
            :global(.hero-tiles) > :global(.hero-tile) :global(.hero-tile__caption) {
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            :global(.hero-tile__media) {
              width: 160px !important;
            }
            :global(.hero-tile__caption) {
              margin: 0 !important;
              text-align: left !important;
              font-family: var(--font-mono) !important;
              font-size: 11px !important;
              line-height: 1.5 !important;
              font-weight: 400 !important;
              letter-spacing: 1px !important;
              text-transform: uppercase !important;
              /* Mobile: always visible — hover-reveal is desktop-only. */
              opacity: 1 !important;
              transform: none !important;
              color: var(--text) !important;
            }
            /* Hover-only symbols don't apply on touch — hide on mobile. */
            :global(.hero-tile__symbol) {
              display: none !important;
            }
          }
        `}</style>
      </section>

      {/* Hero Video — scroll-driven blur reveal */}
      <HeroVideo onWatch={openFilm} />

      {/* Reason — one flowing h2 with Apple-style scroll-to-highlight.
          The three former pieces (manifesto · lead · ecosystem line) read as
          a single statement; each word brightens from muted to full as it
          crosses the upper third of the viewport. */}
      <section className="reason-section" style={{ borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1, background: 'var(--bg)' }}>
        <div className="section-w">
          <ScrollHighlight>{`Generational Impact.
The idea suggests that the choices made by one generation can have long-lasting effects on future generations — either escalating or lessening difficulties.
These impacts can be deep and complex, shaping different facets of life such as culture, economy, technology, and values.`}</ScrollHighlight>
        </div>
        <style jsx>{`
          /* Reason copy sits directly above the expanding video — the
             card is meant to read as a continuation of the manifesto, so
             the bottom padding is intentionally light. Full section-gap
             on top still gives the heading proper breathing room. */
          .reason-section {
            padding: var(--section-gap) 0 clamp(40px, 6vh, 80px);
          }
          @media (max-width: 768px) {
            .reason-section {
              padding: var(--section-gap) 0 clamp(28px, 4vh, 48px) !important;
            }
          }
        `}</style>
      </section>

      {/* Reason Video — expanding 16:9 → fullscreen */}
      <ExpandingBanner
        src="/aura-people.mp4"
        mediaType="video"
        poster="/aura-people.jpg"
        alt="Aura — the people behind the practice"
        caption="We cultivate environments designed to sharpen thought and restore balance."
      />

      {/* Operating System — full section-gap on both ends, matching the
          rhythm of every other top-level section on the page. */}
      <section style={{ padding: 'var(--section-gap) 0', position: 'relative', zIndex: 1, background: 'var(--bg)' }}>
        <div className="section-w">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 7vh, 80px)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aura-os.svg"
                alt="Aura OS"
                className="invert-on-light"
                style={{
                  display: 'block',
                  margin: '0 auto',
                  width: 'clamp(144px, 19.2vw, 256px)',
                  height: 'auto',
                }}
              />
              <p className="p1" style={{ marginTop: 'var(--space-5)' }}>Natural Intelligence</p>
              <p className="p2" style={{ marginTop: 'var(--space-3)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
                The Aura Operating System brings together land intelligence, human craft, and modern technology into one integrated practice.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 stagger pillar-grid" style={{ gap: 'var(--grid-gap)' }}>
            {[
              {
                title: 'Agroculture',
                lead: 'We cultivate regenerative land systems',
                desc: 'Coffee, pepper, areca, tea, soil, biodiversity, and long-term stewardship — managed through biodynamic and Vedic agricultural practices.',
                video: '/aura-agroculture.mp4',
                poster: '/aura-agroculture.jpg',
                alt: 'Aura plantation — coffee, pepper, areca, tea, soil biodiversity',
              },
              {
                title: 'Hospitality',
                lead: 'Sanctuaries designed for clarity',
                desc: 'Architect-led sanctuaries, slow living experiences, workshops, residencies, and time designed around nature and clarity.',
                video: '/aura-hospitality.mp4',
                poster: '/aura-hospitality.jpg',
                alt: 'Aura hospitality — sanctuary, retreats, slow living',
              },
              {
                title: 'Labs',
                lead: 'Studios for regenerative thinking',
                desc: 'Small-group residencies, experiments, and learning experiences spanning AI, systems thinking, creativity, wellbeing, and craft.',
                video: '/aura-labs.mp4',
                poster: '/aura-labs.jpg',
                alt: 'Aura labs — residencies, experiments, learning',
              },
            ].map((card) => (
              <Reveal key={card.title}>
                {/* Pillar cards are descriptive only — the underlying pages
                    (/land, /sanctuary, /artistry) are reachable via the
                    journal index in the main nav, not from here. No Link,
                    no hover affordance, no cursor pill. */}
                <div className="pillar-card">
                  <PillarVideo src={card.video} poster={card.poster} alt={card.alt} />
                  <h3 style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>{card.title}</h3>
                  {/* Lead reads as a meta caption underneath the title —
                      mono uppercase via the global .label spec, matching
                      every other meta caption on the page. */}
                  <p className="label" style={{ marginBottom: 'var(--space-4)' }}>{card.lead}</p>
                  <p className="p2">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sanctuary lede — same scroll-to-highlight component as the Reason
          section above. Three-line manifesto that introduces the sanctuary
          stack which follows. */}
      <section className="sanctuary-lede" style={{ borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1, background: 'var(--bg)' }}>
        <div className="section-w">
          <ScrollHighlight>{`Aura unfolds through sanctuary, land, and practice.
Each sanctuary belongs to a larger living ecosystem — where land, craft, hospitality, and culture exist in rhythm.
Places shaped for slower living and deeper restoration.`}</ScrollHighlight>
        </div>
        <style jsx>{`
          /* Generous padding on both ends — the lede needs proper
             breathing room between the pillars above and the sanctuary
             stack below. Top and bottom both use the full section-gap
             plus an extra clamp so the manifesto reads as a deliberate
             pause, not a sandwiched caption. */
          .sanctuary-lede {
            padding: calc(var(--section-gap) + clamp(40px, 6vh, 80px)) 0;
          }
          @media (max-width: 768px) {
            .sanctuary-lede {
              padding: calc(var(--section-gap) + clamp(24px, 4vh, 56px)) 0 !important;
            }
          }
        `}</style>
      </section>

      {/* Our Sanctuaries — sticky-stack scroll with clarity holds.
          Parent is 600vh: 3 panels (100vh each) + 2 inter-panel spacers
          (100vh each) + 1 trailing buffer (100vh). The trailing buffer is
          critical — without it the last panel has ZERO stuck time (its
          sticky range collapses to a single point because the parent's
          bottom releases it the instant it hits top:0). Adding 100vh of
          buffer gives panel 3 a full 100vh of stuck time: ~30vh for the
          blur to lift, ~70vh of held clarity, then it scrolls out as a
          group with the rest. */}
      <div className="sanctuary-stack" style={{ background: '#0a0a0a', position: 'relative', height: '600vh' }}>
        <SanctuaryStackPanel s={MUDIGERE} z={1} onClick={openMudigere} />
        <div className="sanctuary-stack__spacer" style={{ height: '100vh' }} aria-hidden />
        <SanctuaryStackPanel s={OHARA_S} z={2} onClick={openOhara} />
        <div className="sanctuary-stack__spacer sanctuary-stack__post-ohara" style={{ height: '100vh' }} aria-hidden />
        <SanctuaryStackPanel2Col left={MUNDUK} right={DAYLESFORD} z={3} />
        <div className="sanctuary-stack__trailing" style={{ height: '100vh' }} aria-hidden />
      </div>

      {/* Closing line above the footer. Headline reveals word-by-word
          via ScrollHighlight as the section enters the viewport. */}
      <section className="closing-line" style={{ padding: 'var(--section-gap) 0', position: 'relative', zIndex: 1, background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <ScrollHighlight>Live, make, and restore in rhythm with the land.</ScrollHighlight>
        </div>
      </section>

      </div> {/* /.human-only */}
    </div>
  )
}

/* Markdown-style plain text view of the home page for agent mode.
   Drawn from the visual page + the source decks/manifesto in /Info
   (Aura_Website_v3.html, Reason.pdf, AURA-Story-2026, brand book).
   Gives an LLM agent the full picture: what Aura is, why, how it's
   organised, what the practice rests on. Agent CSS prefixes headings
   with #/##/###, bullets with `- `, and renders <hr> as `---`. */
function AgentHomeView() {
  return (
    <section className="agent-only">
      <h1>Aura — The 1000-Year Idea</h1>
      <p>A regenerative ecosystem for monastic polymaths where Ancestral Intelligence and Creative Capital are deployed across 100 years.</p>
      <p>Two ancient farming intelligences. Six coffee micro lots. One regenerative conviction.</p>
      <p>Nestled in nature, our sanctuary invites leaders, creators, and organisations into inspiration and flow.</p>
      <p>We combine ancestral wisdom with creative capital to make what the future cannot automate.</p>
      <p>For generational impact.</p>
      <p>Land. Time. Practice.</p>

      <hr />

      <h2>The Reason</h2>
      <p>The reason is to restore what sustains us.</p>
      <p>Everything here is built to endure.</p>
      <p>Land, hospitality, craft, and technology — one regenerative ecosystem.</p>
      <p>We cultivate environments designed to sharpen thought and restore balance.</p>
      <p>The world is entering an age of artificial intelligence. What will become rare is not intelligence. What will become rare is wisdom. Presence. Judgement. Moral clarity. The ability to be still.</p>
      <p>The farmer of three thousand years ago had the knowledge. The founder of 2026 has the tools. Aura joins them.</p>

      <hr />

      <h2>Ṛta — Right Time, Right Action</h2>
      <p>Ṛta is the invisible architecture of natural order. Cosmic rhythm. Right relationship.</p>
      <p>Everything has a timing. Honour it, and the work becomes effortless.</p>
      <p>Horn manure spray applied as the earth inhales — evening rhythm. Coffee fermented for 36, 48, 72-hour cycles — each lot finds its own time. Drying for 25 days minimum — temperature and humidity guide, not accelerate. Planting, harvesting, and fermentation guided by moon phases.</p>

      <hr />

      <h2>The Three Intelligences</h2>
      <p>The Aura Operating System brings together land intelligence, human craft, and modern technology into one integrated practice. Ancestral. Natural. Human. Machine Intelligence.</p>
      <ul>
        <li>Natural Intelligence — Ecological order, adaptation, rhythm, pattern. 3.8 billion years of R&amp;D. Soil microbiomes processing more data per gram than any server. Mycorrhizal networks signalling across forests.</li>
        <li>Ancestral Intelligence — 3,000 years of documented observation and practice. Care, presence, moral clarity, long-term thinking.</li>
        <li>Human Intelligence — Reasoning and creativity. Hands, attention, judgement.</li>
        <li>Machine Intelligence — Tools to measure, validate, and optimise at the service of wisdom. Sensors, satellites, molecular analysis, AI.</li>
      </ul>

      <hr />

      <h2>Three Pillars</h2>
      <h3>Agroculture — We cultivate regenerative land systems</h3>
      <p>Coffee, pepper, areca, tea, soil, biodiversity, and long-term stewardship — managed through Biodynamic (BD 500-508, CPP, lunar cycles) and Vedic (Jeevamrit, Panchgavya, Beejamrit) agricultural practices. Not competing approaches — complementary intelligence.</p>

      <h3>Hospitality — Sanctuaries designed for clarity</h3>
      <p>Architect-led sanctuaries, slow living experiences, workshops, residencies, and time designed around nature and clarity.</p>

      <h3>Labs — Studios for regenerative thinking</h3>
      <p>Small-group residencies, experiments, and learning experiences spanning AI, systems thinking, creativity, wellbeing, and craft. Studios, workshops, gallery, gurukul, festivals — the connective tissue.</p>

      <hr />

      <h2>Our Sanctuaries</h2>
      <p>Aura unfolds through sanctuary, land, and practice. Each sanctuary belongs to a larger living ecosystem — where land, craft, hospitality, and culture exist in rhythm. Places shaped for slower living and deeper restoration.</p>

      <h3>Mudigere — Regenerative plantation sanctuary</h3>
      <p>Karnataka, India · 13.13°N · 75.63°E. 150 acres at 3,600 feet in the Western Ghats. UNESCO biodiversity zone. Coffee, tea, pepper, areca. 43 indigenous cattle. Bees. Native canopy nursery. Forest-to-table kitchen. Coffee festivals.</p>

      <h3>Ohara — Retreats and slow living in nature</h3>
      <p>Kyoto Prefecture, Japan · 35.13°N · 135.83°E. A quiet valley north of Kyoto. Cedar forests, rivers, temples. A 30-year Japanese garden. Teahouse. Café on the river. Studios. Ki no Ie. Workshops. Gallery. Weekend restaurant. Wellbeing retreat.</p>

      <h3>Munduk — Mountain sanctuary for restoration</h3>
      <p>Bali, Indonesia · 8.27°S · 115.06°E · Coming soon. The ecosystem grows when the land says it&rsquo;s ready.</p>

      <h3>Daylesford — A space for craft and wellbeing</h3>
      <p>Victoria, Australia · 37.34°S · 144.14°E · Coming soon.</p>

      <hr />

      <h2>The Method — Six Field Rules</h2>
      <p>Six rules. English and Kannada. Carved on every work shed.</p>
      <ul>
        <li>Soil Comes First — all decisions flow from soil health.</li>
        <li>Do Small Work Properly — mastery before scaling.</li>
        <li>No Shortcuts — right timing over quick gains.</li>
        <li>Quality Before Quantity — one excellent lot over five average ones.</li>
        <li>Think 10 Years Ahead — every action serves the long game.</li>
        <li>Leaders Must Be on the Field — authority comes from presence and practice.</li>
      </ul>
      <p>Be on the land. Be fair. Do the work properly. These are field rules. But they point at something deeper.</p>

      <hr />

      <h2>Coffee — The Flagship Crop</h2>
      <p>Arabica S795, Selection 9, Chandragiri. Six micro lots, six processing methods. Cupped fresh at source. Specialty-grade fermentation.</p>
      <p>Three fermentation disciplines: Red Honey, Solera Maceration (flagship), and 25-day natural processing. Three to seven day micro-fermentation windows. 25 days minimum drying. Each lot finds its own clock.</p>
      <p>For specialty roasters, importers, and select retail partners.</p>

      <hr />

      <h2>The Monastic Polymath</h2>
      <p>A designer who farms. An engineer who meditates. A farmer who reads philosophy. A chef who understands soil.</p>
      <p>Founders between chapters. Artists in mid-project. Thinkers who need a room of their own.</p>
      <p>The sanctuary gives them stillness. The plantation gives them ground. The studios give them room. The festivals give them community. The table gives them nourishment.</p>
      <p>Not to visit. To return to.</p>

      <hr />

      <h2>The Aura Standard</h2>
      <p>Depth over speed. Care over convenience. Wisdom over noise. Regeneration over extraction. Stillness over performance. Stewardship over ego.</p>
      <p>In an era that worships speed — a bet on patience. In an economy that rewards extraction — a commitment to regeneration. In a culture that measures in quarters — Aura measures in generations.</p>

      <hr />

      <h2>Site Index</h2>
      <ul>
        <li><a href="/reason">/reason</a> — the founder&rsquo;s story, in 14 chapters.</li>
        <li><a href="/brand">/brand</a> — brand identity, principles, colours, type.</li>
        <li><a href="/sanctuary">/sanctuary</a> — sanctuary essays and place.</li>
        <li><a href="/idea">/idea</a> — The 1000 Year Idea.</li>
        <li><a href="/wisdom">/wisdom</a> — Moral Spine.</li>
        <li><a href="/rta">/rta</a> — Ṛta. Right time. Right action.</li>
        <li><a href="/artistry">/artistry</a> — Code meets clay.</li>
        <li><a href="/residency">/residency</a> — Monastic polymaths.</li>
        <li><a href="/provenance">/provenance</a> — Cherry to cup, on chain.</li>
        <li><a href="/fermentation">/fermentation</a> — Three disciplines, one precision.</li>
        <li><a href="/coffee">/coffee</a> — Six lots, one appellation.</li>
        <li><a href="/pepper">/pepper</a> — Malabar black gold.</li>
        <li><a href="/areca">/areca</a> — The sentinel palm.</li>
        <li><a href="/biodynamic">/biodynamic</a> — The farm as organism.</li>
        <li><a href="/vedic">/vedic</a> — Older than its study.</li>
        <li><a href="/living-systems">/living-systems</a> — Herd, hive, canopy.</li>
        <li><a href="/land">/land</a> — The land is the lab.</li>
        <li><a href="/contact">/contact</a> — Get in touch.</li>
      </ul>

      <hr />

      <p>Aura is not built, it is grown.</p>
      <p>I am the first gardener. I will not be the last.</p>
      <p>Live, make, and restore in rhythm with the land.</p>
    </section>
  )
}
