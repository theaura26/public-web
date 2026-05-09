'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Reveal from '@/components/RevealOnScroll'
import { LogoEmblem } from '@/components/Logo'
import VideoReactiveArt from '@/components/VideoReactiveArt'
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudSun, CloudMoon } from '@phosphor-icons/react'

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

function HeroVideo() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const blurRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const wrap = wrapRef.current
        const blur = blurRef.current
        const copy = copyRef.current
        if (!wrap || !blur || !copy) return

        const rect = wrap.getBoundingClientRect()
        const scrollRange = wrap.offsetHeight - window.innerHeight
        if (scrollRange <= 0) return
        const p = Math.max(0, Math.min(1, -rect.top / scrollRange))

        // Phase 1 (0–0.15): logo fades in
        const fadeIn = Math.min(1, p / 0.15)
        // Phase 2 (0.85–1.0): logo fades out at the very end (long hold through blur lift)
        const fadeOut = Math.max(0, Math.min(1, (p - 0.85) / 0.15))
        // Phase 3 (0.5–0.85): blur lifts
        const blurLift = Math.max(0, Math.min(1, (p - 0.5) / 0.35))

        const copyOpacity = fadeIn * (1 - fadeOut)
        const copyY = (1 - fadeIn) * 24 + fadeOut * -16
        copy.style.opacity = `${copyOpacity}`
        copy.style.transform = `translateY(${copyY}px)`

        const blurVal = (1 - blurLift) * 16
        const overlayAlpha = (1 - blurLift) * 0.5
        blur.style.backdropFilter = `blur(${blurVal}px)`
        ;(blur.style as any).WebkitBackdropFilter = `blur(${blurVal}px)`
        blur.style.background = `rgba(0,0,0,${overlayAlpha})`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Autoplay when visible, pause when not
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

  return (
    <section ref={wrapRef} style={{ height: '300vh', position: 'relative', zIndex: 0 }}>
      {/* Sticky stage — pinned for the full scroll */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Video background */}
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
          }}
        >
          <source src="/aura-hero.mp4" type="video/mp4" />
        </video>

        {/* Blur + dark overlay */}
        <div
          ref={blurRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        />

        {/* Centered rotating logo — difference blend pops against the video */}
        <div
          ref={copyRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 var(--gutter)',
            opacity: 0,
            mixBlendMode: 'difference',
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
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   EXPANDING VIDEO — 16:9 frame → fullscreen on scroll
   Matches Brand page HeroBanner interaction.
   Desktop: 16:9, Mobile: 3:4
═══════════════════════════════════════════ */

function ExpandingVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Scroll-driven expansion
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const wrap = wrapRef.current
        const inner = innerRef.current
        const card = cardRef.current
        if (!wrap || !inner || !card) return

        const rect = wrap.getBoundingClientRect()
        const zone = wrap.offsetHeight - window.innerHeight
        if (zone <= 0) return
        const raw = Math.max(0, Math.min(1, -rect.top / zone))
        const p = prefersReduced ? (raw > 0.5 ? 1 : 0) : raw * raw * (3 - 2 * raw)

        const navPad = 56 * (1 - p)
        const sidePad = 48 * (1 - p)

        inner.style.padding = `${navPad}px ${sidePad}px 0`
        card.style.maxWidth = p < 1 ? `calc((100vh - 56px - 96px + ${p * 96}px) * 16 / 9)` : 'none'
        card.style.aspectRatio = p > 0.9 ? 'auto' : ''
        card.style.height = p > 0.9 ? '100%' : 'auto'
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Autoplay when visible
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

  return (
    <div ref={wrapRef} style={{ height: '160vh', position: 'relative', zIndex: 0 }}>
      <div
        ref={innerRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '56px 48px 0',
          boxSizing: 'border-box',
        }}
      >
        <div
          ref={cardRef}
          className="expanding-video-card"
          style={{
            width: '100%',
            maxWidth: 'calc((100vh - 56px - 96px) * 16 / 9)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            background: 'var(--bg)',
          }}
        >
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
      </div>

      <style jsx>{`
        .expanding-video-card {
          aspect-ratio: 16 / 9;
        }
        @media (max-width: 767px) {
          .expanding-video-card {
            aspect-ratio: 3 / 4;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
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
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '3 / 4',
      overflow: 'hidden',
      borderRadius: 3,
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
function LocationModal({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode }) {
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
        overlayRef.current.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
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
        overlay.style.transition = 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)'
        overlay.style.transform = 'translateY(100%)'
        setTimeout(onClose, 450)
      } else {
        // Snap back with elastic overshoot
        overlay.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
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
          overlay.style.transition = 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)'
          overlay.style.transform = 'translateY(100%)'
          setTimeout(onClose, 450)
        }
        if (wheelTimer) clearTimeout(wheelTimer)
        wheelTimer = setTimeout(() => {
          if (!dismissing.current) {
            overscroll = 0
            overlay.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            overlay.style.transform = 'translateY(0)'
            setTimeout(() => { overlay.style.transition = '' }, 500)
          }
        }, 250)
      } else {
        if (overscroll > 0 && !dismissing.current) {
          overscroll = 0
          overlay.style.transition = 'transform 0.3s ease'
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div ref={scrollRef} style={{ width: '100%', height: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {/* ── Header ── */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, padding: '0 var(--gutter)', maxWidth: 'var(--max-w)', margin: '0 auto', width: '100%' }}>
          <p className="label loc-label" style={{ margin: 0 }}>{label}</p>
          <button onClick={onClose} aria-label="Close" className="loc-close" style={{ background: 'none', border: 'none', padding: '10px 4px', display: 'flex', flexDirection: 'column', gap: 6, opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease 0.2s', cursor: 'none' }}>
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transform: 'translateY(3.75px) rotate(45deg)' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transform: 'translateY(-3.75px) rotate(-45deg)' }} />
          </button>
        </div>
        <div className="section-w" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease 0.15s', paddingTop: 'clamp(24px, 4vh, 56px)', paddingBottom: 'clamp(60px, 8vh, 100px)' }}>
          {children}
        </div>
      </div>
      <style jsx global>{`
        .loc-modal { background: #f5f5f0; }
        .loc-modal .loc-h2 { color: #1a1a1a; }
        .loc-modal .loc-body { font-family: var(--font-sans); font-size: 16px; line-height: 1.65; color: rgba(26, 26, 26, 0.65); }
        .loc-modal .loc-label { color: rgba(26, 26, 26, 0.4) !important; }
        .loc-modal .loc-close { color: #1a1a1a; }
        .loc-modal .loc-map { filter: none; }
        [data-theme="day"] .loc-modal { background: #131719; }
        [data-theme="day"] .loc-modal .loc-h2 { color: #ededed; }
        [data-theme="day"] .loc-modal .loc-body { color: rgba(237, 237, 237, 0.65); }
        [data-theme="day"] .loc-modal .loc-label { color: rgba(237, 237, 237, 0.4) !important; }
        [data-theme="day"] .loc-modal .loc-close { color: #ededed; }
        [data-theme="day"] .loc-modal .loc-map { filter: invert(1); }
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
        @media (max-width: 767px) {
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
      <div style={{ marginBottom: 24 }}>
        <p className="label loc-label" style={{ marginBottom: 6 }}>LOCATION</p>
        <p className="loc-body">{location}</p>
      </div>

      {weather && (
        <div style={{ marginBottom: 28 }}>
          <p className="label loc-label" style={{ marginBottom: 8 }}>WEATHER NOW</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <WeatherIcon code={weather.code} isDay={weather.isDay} size={20} className="loc-body" />
            <span className="loc-body">{weather.temp}&deg;C &middot; {condition}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginBottom: children ? 32 : 0 }}>
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

/* ═══ MUDIGERE ═══ */
function MudigereModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const weather = useWeather(13.1365, 75.6403)
  return (
    <LocationModal open={open} onClose={onClose} label="MUDIGERE">
      <LocationContent>
        <div className="loc-top">
          <div className="loc-pencil-mobile">
            <img src="/aura-mudigere-pencil.jpg" alt="Pencil illustration of the Mudigere estate" style={{ width: '100%', borderRadius: 3, display: 'block', objectFit: 'cover', aspectRatio: '4 / 5' }} />
          </div>
          <div>
            <h2 className="loc-h2" style={{ marginBottom: 24 }}>The Land Remembers.</h2>
            <div className="loc-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p>Nestled in the mist of the Western Ghats, this estate operates on a timeline dictated by nature rather than urgency, honoring a legacy where the land continues its own story. Through a philosophy of patient stewardship, coffee and pepper are cultivated with deep restraint, allowing the rhythms of wind, soil, and sun to guide every harvest and fermentation.</p>
              <p>This slow, intentional process ensures that every cup serves as a sensory memory of its origin, reflecting a profound respect for the quiet continuity of the ancient landscape.</p>
            </div>
          </div>
          <div className="loc-images-desktop">
            <img src="/aura-mudigere-pencil.jpg" alt="Pencil illustration of the Mudigere estate" style={{ width: '100%', borderRadius: 3, display: 'block', objectFit: 'cover', aspectRatio: '3 / 4' }} />
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
            <h2 className="loc-h2" style={{ marginBottom: 24 }}>World&rsquo;s Oldest Arabica Region, Rediscovered.</h2>
            <div className="loc-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p>The Western Ghats are a UNESCO World Heritage biodiversity hotspot — one of the eight most biodiverse regions on earth. Chikmagalur sits within this range at 900&ndash;1100 metres, where altitude, monsoon rainfall, and ancient volcanic soil create conditions for coffee of exceptional complexity.</p>
              <p>Aura&rsquo;s 150&ndash;170 acres are farmed as a four-layer agroforestry system: native shade trees above, pepper vines in the mid-canopy, coffee and tea in the understory, cover crops and soil regeneration plants at ground level.</p>
            </div>
            <img src="/aura-mudigere-landscape.jpg" alt="Aura Mudigere estate in the Western Ghats" style={{ width: '100%', borderRadius: 3, display: 'block', objectFit: 'cover', aspectRatio: '16 / 10', marginTop: 32 }} />
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
            <img src="/aura-ohara-pencil.jpg" alt="Pencil illustration of Aura Ohara" style={{ width: '100%', borderRadius: 3, display: 'block', objectFit: 'cover', aspectRatio: '4 / 5' }} />
          </div>
          <div>
            <h2 className="loc-h2" style={{ marginBottom: 24 }}>The Valley Listens.</h2>
            <div className="loc-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p>Nestled in the quiet valley of Ohara, north of Kyoto, this place moves to the rhythm of light, water, and care rather than speed. Surrounded by cedar forests, rivers, and temples, it is shaped by a way of life that honours stillness, craft, and the quiet intelligence of the land.</p>
              <p>Through a philosophy of restoration over construction, Aura in Ohara grows by listening before leading. The home, garden, and teahouse are not remade in haste, but gently renewed through patience, restraint, and deep respect for what already exists.</p>
              <p>This slow, mindful approach allows each space to hold the memory of its setting — reflecting a way of living rooted in calm, renewal, and the richness of everyday ritual.</p>
            </div>
          </div>
          <div className="loc-images-desktop">
            <img src="/aura-ohara-pencil.jpg" alt="Pencil illustration of Aura Ohara" style={{ width: '100%', borderRadius: 3, display: 'block', objectFit: 'cover', aspectRatio: '3 / 4' }} />
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
            <h2 className="loc-h2" style={{ marginBottom: 24 }}>Kyoto&rsquo;s Quiet Valley, Rediscovered.</h2>
            <div className="loc-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p>Ohara is a place of cedar forests, rivers, temples, and hand-tended fields — where farmers still work by hand and artisans move by rhythm, not by clock. It is here that Aura belongs: not to transform the valley, but to listen to it.</p>
              <p>The site is envisioned through the restoration of a 70-year-old home and a 30-year garden, with a teahouse renewed by a Kyoto craftsman and cared for across generations. Rooted in wabi-sabi, Aura Ohara embraces imperfection, continuity, and a rich, mindful life shaped by light, calm, and reflection.</p>
            </div>
            <img src="/aura-ohara-landscape.jpg" alt="Aura Ohara in the valley of Kyoto" style={{ width: '100%', borderRadius: 3, display: 'block', objectFit: 'cover', aspectRatio: '16 / 10', marginTop: 32 }} />
          </div>
        </div>
      </LocationContent>
    </LocationModal>
  )
}

function AgentHome() {
  return (
    <div className="section-w" style={{ paddingTop: 300, paddingBottom: 80 }}>
      <p># Aura</p>
      <p>## A regenerative ecosystem for generational impact.</p>
      <br />
      <p>Aura is a platform that joins ancient land intelligence with modern tools to build systems that endure across generations. Not a company. Not an NGO. Not a farm. Not a hotel. An open-source framework for how to live with land.</p>
      <br />
      <p>---</p>
      <br />
      <p>## Entity</p>
      <br />
      <p>type: regenerative_ecosystem</p>
      <p>founded: 2024</p>
      <p>founder: Arvind Singh</p>
      <p>hq: Singapore</p>
      <p>domain: theaura.life</p>
      <p>contact: hello@theaura.life</p>
      <br />
      <p>---</p>
      <br />
      <p>## Reason</p>
      <br />
      <p>The reason is to restore what sustains us.</p>
      <br />
      <p>In a world optimised for speed and short-term gain, Aura offers a different model — one rooted in patience, regeneration, and rhythm.</p>
      <br />
      <p>Set across a working plantation and creative sanctuary, Aura brings together ancient knowledge and modern tools to build systems that endure. From soil to studio, every element is designed to support a new kind of creator — one who thinks beyond outcomes, and builds for generations to come.</p>
      <br />
      <p>---</p>
      <br />
      <p>## Operating System</p>
      <br />
      <p>Aura operates through three integrated pillars:</p>
      <br />
      <p>1. Sanctuary — A living estate in rhythm with the land. Silence, stillness, a 30-year Japanese garden. Forest walks. The river from every room.</p>
      <br />
      <p>2. Agroculture — 100 acres of specialty coffee. 52 indigenous Gidda cattle. Biodynamic (BD 500-508, CPP, lunar cycles) + Vedic (Jeevamrit, Panchgavya, Beejamrit) farming systems. UNESCO biodiversity zone.</p>
      <br />
      <p>3. Artistry — Studios, workshops, gallery, gurukul, labs, festivals. Residencies for founders, designers, artists, and monastic polymaths.</p>
      <br />
      <p>---</p>
      <br />
      <p>## Locations</p>
      <br />
      <p>### Aura Mudigere [ACTIVE]</p>
      <p>coordinates: 13.1365°N, 75.6403°E</p>
      <p>altitude: 3,600 ft</p>
      <p>area: 150 acres (100 coffee)</p>
      <p>soil: Laterite, pH 6.0-6.5</p>
      <p>zone: UNESCO Western Ghats</p>
      <p>climate: 14°C-30°C, humidity 58%, wind 5 km/h</p>
      <p>herd: 52 Gidda cattle</p>
      <br />
      <p>### Aura Ohara [ACTIVE]</p>
      <p>coordinates: 35.2375°N, 140.3947°E</p>
      <p>altitude: 1,099 ft</p>
      <p>climate: 7°C-28°C, humidity 64%, wind 14 km/h</p>
      <p>features: Japanese garden, teahouse, cafe, studios</p>
      <br />
      <p>### Aura Munduk [PLANNED]</p>
      <p>location: Bali, Indonesia</p>
      <br />
      <p>### Aura Daylesford [PLANNED]</p>
      <p>location: Victoria, Australia</p>
      <br />
      <p>---</p>
      <br />
      <p>## Coffee Program</p>
      <br />
      <p>varieties: Arabica S795, Selection 9, Chandragiri</p>
      <p>processing: 6 micro lots, 6 methods</p>
      <p>stage: Optimize → Specialize (Stage 3→4)</p>
      <br />
      <p>LOT_001: Anaerobic Natural — 450kg, Brix 24-26, 72h sealed + 20d dry [Berries, Wine, Stone Fruit]</p>
      <p>LOT_002: Dry Osmosis — 380kg, Brix 28-30, Sun + time [Chocolate, Dried Fruit, Caramel]</p>
      <p>LOT_003: Red Honey — 520kg, Brix 22-24, 48h wet + 20d dry [Florals, Honey, Citrus]</p>
      <p>LOT_004: Banana Wash — 410kg, Brix 20-22, 36h + 18d dry [Tropical, Fruit Punch, Bright]</p>
      <p>LOT_005: Solera Maceration — 480kg, Brix 25-27, 96h sealed + 22d dry [Plum, Jasmine, Dark Chocolate]</p>
      <p>LOT_006: Solera Wash — 390kg, Brix 21-23, 60h wet + 21d dry [Clean, Almond, White Tea]</p>
      <br />
      <p>---</p>
      <br />
      <p>## Crops</p>
      <br />
      <p>coffee: 100 acres, Arabica S795/Selection 9/Chandragiri, specialty-grade</p>
      <p>pepper: Malabar, shade-grown under native canopy, biodynamic</p>
      <p>areca: Traditional intercrop, economic anchor, forest structure</p>
      <p>tea: Experimental plots at 3,600 ft, testing cultivar adaptation</p>
      <br />
      <p>---</p>
      <br />
      <p>## Farming Method</p>
      <br />
      <p>system_1: Biodynamic (BD 500-508, CPP, lunar cycles)</p>
      <p>system_2: Vedic (Jeevamrit, Panchgavya, Beejamrit)</p>
      <p>approach: Not competing — complementary intelligence</p>
      <p>certification: Regenerative (not organic as marketing)</p>
      <p>stages: Stabilize → Rebuild → Optimize → Specialize → Higher-value</p>
      <p>current_stage: 3 → 4</p>
      <br />
      <p>## Six Rules</p>
      <br />
      <p>1. Soil Comes First — All decisions flow from soil health.</p>
      <p>2. Do Small Work Properly — Mastery before scaling.</p>
      <p>3. No Shortcuts — Right timing over quick gains.</p>
      <p>4. Quality Before Quantity — One excellent lot over five average ones.</p>
      <p>5. Think 10 Years Ahead — Every action serves the long game.</p>
      <p>6. Leaders on the Field — Authority comes from presence and practice.</p>
      <br />
      <p>---</p>
      <br />
      <p>## Experience Offerings</p>
      <br />
      <p>- Forest-to-table dining (every ingredient grown within sight)</p>
      <p>- Coffee festivals (6 micro lots cupped side-by-side)</p>
      <p>- Pottery with Shigaraki clay, indigo dyeing, kintsugi</p>
      <p>- Fermentation circles</p>
      <p>- Creative residencies for founders and artists</p>
      <p>- Silence retreats (tea at four is the only appointment)</p>
      <p>- Studios with garden views</p>
      <br />
      <p>---</p>
      <br />
      <p>## Contact</p>
      <br />
      <p>email: hello@theaura.life</p>
      <p>instagram: @theaura.life</p>
      <p>presence: Singapore, India, Japan, Indonesia, Australia</p>
      <br />
      <p>Arvind Singh, Founder</p>
      <p>Mudigere &amp; Ohara · 2026</p>
    </div>
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
  facts: string[]
  coords: string
  bgSrc?: string
  bgColor?: string
  comingSoon?: boolean
}

const MUDIGERE: Sanctuary = {
  name: 'Mudigere',
  tagline: 'Regenerative plantation sanctuary',
  region: 'KARNATAKA, INDIA',
  facts: ['150 ACRES', 'WESTERN GHATS BIOSPHERE', '900–1100M ALTITUDE', 'TROPICAL MONSOON'],
  coords: '13.13°N · 75.63°E',
  bgSrc: '/aura-mudigere-landscape.jpg',
}
const OHARA_S: Sanctuary = {
  name: 'Ohara',
  tagline: 'Retreats and slow living in nature',
  region: 'KYOTO PREFECTURE, JAPAN',
  facts: ['GARDEN, TEAHOUSE, CAFÉ AND STUDIOS', '270M ALTITUDE', 'FOUR-SEASON TEMPERATE'],
  coords: '35.13°N · 135.83°E',
  bgSrc: '/aura-ohara-landscape.jpg',
}
const DAYLESFORD: Sanctuary = {
  name: 'Daylesford',
  tagline: 'A space for craft and wellbeing',
  region: 'VICTORIA, AUSTRALIA',
  facts: ['MINERAL SPRING COUNTRY', '450M ALTITUDE', 'COOL-TEMPERATE', 'FOUR SEASONS'],
  coords: '37.34°S · 144.14°E',
  bgSrc: '/aura-ohara-landscape.jpg',
  comingSoon: true,
}
const MUNDUK: Sanctuary = {
  name: 'Munduk',
  tagline: 'Mountain sanctuary for restoration',
  region: 'BALI, INDONESIA',
  facts: ['HIGHLAND CLOUD FOREST', 'VOLCANIC GROUND', '800–1200M ALTITUDE', 'EQUATORIAL HUMID'],
  coords: '8.27°S · 115.06°E',
  bgSrc: '/aura-mudigere-landscape.jpg',
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
        const blurLift = Math.max(0, Math.min(1, (p - 0.5) / 0.35))
        if (content) content.style.opacity = `${fadeIn}`
        const blurVal = (1 - blurLift) * 16
        const overlayAlpha = (1 - blurLift) * 0.5
        blur.style.backdropFilter = `blur(${blurVal}px)`
        ;(blur.style as { WebkitBackdropFilter?: string }).WebkitBackdropFilter = `blur(${blurVal}px)`
        blur.style.background = `rgba(0,0,0,${overlayAlpha})`
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

/* 2-col variant: independent blur layer per image (driven by a single scroll) */
function useBlurReveal2() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const blurLeftRef = useRef<HTMLDivElement>(null)
  const blurRightRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const wrap = wrapRef.current
        const bL = blurLeftRef.current
        const bR = blurRightRef.current
        const content = contentRef.current
        if (!wrap || !bL || !bR) return
        const rect = wrap.getBoundingClientRect()
        const range = wrap.offsetHeight - window.innerHeight
        if (range <= 0) return
        const p = Math.max(0, Math.min(1, -rect.top / range))
        const fadeIn = Math.min(1, p / 0.15)
        const blurLift = Math.max(0, Math.min(1, (p - 0.5) / 0.35))
        if (content) content.style.opacity = `${fadeIn}`
        const blurVal = (1 - blurLift) * 16
        const overlayAlpha = (1 - blurLift) * 0.5
        for (const el of [bL, bR]) {
          el.style.backdropFilter = `blur(${blurVal}px)`
          ;(el.style as { WebkitBackdropFilter?: string }).WebkitBackdropFilter = `blur(${blurVal}px)`
          el.style.background = `rgba(0,0,0,${overlayAlpha})`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { wrapRef, blurLeftRef, blurRightRef, contentRef }
}

function SanctuaryBg({ s }: { s: Sanctuary }) {
  if (s.bgSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={s.bgSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    )
  }
  return <div style={{ position: 'absolute', inset: 0, background: s.bgColor || '#7e807c' }} />
}

function SanctuaryContent({ s, large = false }: { s: Sanctuary; large?: boolean }) {
  const Heading = large ? 'h1' : 'h2'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 var(--gutter)', height: '100%', color: '#ffffff' }}>
      {s.comingSoon && (
        <p className="label" style={{ marginBottom: 16, color: '#ffffff', fontSize: 10, letterSpacing: 2 }}>COMING SOON</p>
      )}
      <Heading style={{
        fontFamily: 'var(--font-grotesque)',
        fontSize: large ? 'clamp(64px, 16vw, 280px)' : 'clamp(32px, 5.5vw, 60px)',
        lineHeight: large ? 1 : 1.06,
        letterSpacing: large ? '-0.06em' : '-0.05em',
        margin: 0,
        marginBottom: 24,
        color: '#ffffff',
        fontWeight: 400,
      }}>
        {s.name}
      </Heading>
      <p className="p1" style={{ color: '#ffffff', margin: 0, maxWidth: 'min(280px, 84vw)' }}>{s.tagline}</p>
      <p className="label" style={{ marginTop: 16, color: '#ffffff', fontSize: 10, letterSpacing: 1.5 }}>{s.region}</p>
      <p className="label" style={{ marginTop: 8, color: '#ffffff', fontSize: 9, letterSpacing: 1.2, maxWidth: 'min(320px, 84vw)' }}>{s.facts.join('  ·  ')}</p>
      <p className="label" style={{ marginTop: 20, color: '#ffffff', fontSize: 9, letterSpacing: 1.2 }}>{s.coords}</p>
    </div>
  )
}

function SanctuaryBanner({ s, onClick }: { s: Sanctuary; onClick?: () => void }) {
  const { wrapRef, blurRef, contentRef } = useBlurReveal()
  const clickable = !!onClick
  return (
    <section ref={wrapRef} style={{ height: '300vh', position: 'relative', zIndex: 0, display: 'block' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <SanctuaryBg s={s} />
        <div ref={blurRef} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />
        <div
          ref={contentRef}
          onClick={onClick}
          role={clickable ? 'button' : undefined}
          tabIndex={clickable ? 0 : undefined}
          onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.() } : undefined}
          aria-label={clickable ? `Open ${s.name} details` : undefined}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: clickable ? 'pointer' : 'default' }}
        >
          <SanctuaryContent s={s} large />
        </div>
      </div>
    </section>
  )
}

function SanctuaryBanner2Col({ left, right }: { left: Sanctuary; right: Sanctuary }) {
  const { wrapRef, blurLeftRef, blurRightRef, contentRef } = useBlurReveal2()
  return (
    <section ref={wrapRef} style={{ height: '300vh', position: 'relative', zIndex: 0, display: 'block' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div className="sanctuary-2col-bg" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ position: 'relative', overflow: 'hidden', marginRight: -1 }}>
            <SanctuaryBg s={left} />
            <div ref={blurLeftRef} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />
          </div>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <SanctuaryBg s={right} />
            <div ref={blurRightRef} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />
          </div>
        </div>
        <div ref={contentRef} className="sanctuary-2col-content" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', opacity: 0 }}>
          <SanctuaryContent s={left} />
          <SanctuaryContent s={right} />
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 767px) {
          :global(.sanctuary-2col-bg),
          :global(.sanctuary-2col-content) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

export default function Home() {
  const [mudigereOpen, setMudigereOpen] = useState(false)
  const [oharaOpen, setOharaOpen] = useState(false)
  const closeMudigere = useCallback(() => setMudigereOpen(false), [])
  const closeOhara = useCallback(() => setOharaOpen(false), [])

  return (
    <div>
      <MudigereModal open={mudigereOpen} onClose={closeMudigere} />
      <OharaModal open={oharaOpen} onClose={closeOhara} />

      {/* Agent mode — structured data view */}
      <div className="agent-only">
        <AgentHome />
      </div>

      {/* Human mode */}
      <div className="human-only">

      {/* Hero — full viewport, copy centered, whitespace for future design */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'calc(var(--section-gap) + 56px) var(--gutter) var(--section-gap)',
        }}
      >
        <div className="hero-stack">
          <Reveal>
            <div className="hero-logo" style={{ color: 'var(--text)', marginBottom: 32, display: 'flex', justifyContent: 'center', width: 'clamp(110px, 16vw, 210px)' }}>
              <LogoEmblem size={210} />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h3>A regenerative company<br />for generational impact</h3>
          </Reveal>
          <Reveal delay={160}>
            <p className="p2 hero-p">
              We combine ancestral intelligence with creative capital to make what the future cannot automate
            </p>
          </Reveal>
        </div>
        <style jsx>{`
          .hero-stack { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }
          :global(.hero-stack h3) { max-width: 32ch; }
          :global(.hero-p) { max-width: 420px; }
          :global(.hero-logo svg) { width: 100% !important; height: auto !important; }
        `}</style>
      </section>

      {/* Hero Video — scroll-driven blur reveal */}
      <HeroVideo />

      {/* Reason */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1, background: 'var(--bg)' }}>
        <div className="section-w">
          <Reveal>
            <h2 style={{ marginBottom: 'clamp(48px, 8vh, 96px)', maxWidth: 520 }}>We exist to restore what sustains us</h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)' }}>
              <p className="p2">In a world optimised for speed and short-term gain, Aura offers a different model — one rooted in patience, regeneration, and rhythm. Set across a working plantation and creative sanctuary, Aura brings together ancient knowledge and modern tools to build systems that endure. From soil to studio, every element is designed to support a new kind of creation — one who thinks beyond outcomes, and builds for generations to come.</p>
              <p className="p2">Aura exists because modern life has optimised for speed, scale, and extraction — often at the cost of land, attention, health, and human depth. We believe the future will belong to places and systems that restore balance between nature and technology, intelligence and craft, ambition and stillness, people and the planet. Our work is to build those systems — slowly, intentionally, and across generations.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reason Video — expanding 16:9 → fullscreen */}
      <ExpandingVideo
        src="/aura-reason.mp4"
        poster="/aura-reason.jpg"
        alt="Aura regenerative plantation in the Western Ghats"
      />

      {/* Operating System */}
      <section style={{ paddingTop: 'calc(var(--section-gap) + clamp(40px, 6vh, 80px))', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1, background: 'var(--bg)' }}>
        <div className="section-w">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(80px, 12vh, 140px)' }}>
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
              <p className="p1" style={{ marginTop: 28 }}>Ancestral. Natural. Human. Machine Intelligence</p>
              <p className="p2" style={{ marginTop: 12, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
                Aura-OS is our operating philosophy — combining ancestral wisdom, natural systems, human creativity and modern technology into one integrated way of living and building.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 stagger" style={{ gap: 'var(--grid-gap)', marginBottom: 'clamp(80px, 12vh, 140px)' }}>
            {[
              {
                title: 'Plantation',
                href: '/plantation',
                lead: 'We cultivate regenerative land systems',
                desc: 'Coffee, pepper, areca, tea, soil, biodiversity, and long-term stewardship — managed through biodynamic and Vedic agricultural practices.',
                video: '/aura-agroculture.mp4',
                poster: '/aura-agroculture.jpg',
                alt: 'Aura plantation — coffee, pepper, areca, tea, soil biodiversity',
              },
              {
                title: 'Hospitality',
                href: '/hospitality',
                lead: 'Luxury spaces for retreat and reconnection',
                desc: 'Architect-led sanctuaries, slow living experiences, workshops, residencies, and time designed around nature and clarity.',
                video: '/aura-sanctuary.mp4',
                poster: '/aura-sanctuary.jpg',
                alt: 'Aura hospitality — sanctuary, retreats, slow living',
              },
              {
                title: 'Labs',
                href: '/labs',
                lead: 'Design, technology and innovation consulting',
                desc: 'Small-group residencies, experiments, and learning experiences spanning AI, systems thinking, creativity, wellbeing, and craft.',
                video: '/aura-artistry.mp4',
                poster: '/aura-artistry.jpg',
                alt: 'Aura labs — residencies, experiments, learning',
              },
            ].map((card) => (
              <Reveal key={card.title}>
                <Link href={card.href} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                  <PillarVideo src={card.video} poster={card.poster} alt={card.alt} />
                  <h3 style={{ marginTop: 24, marginBottom: 8 }}>{card.title}</h3>
                  <p className="p1" style={{ marginBottom: 10 }}>{card.lead}</p>
                  <p className="p2">{card.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Sanctuaries — full-screen blur-reveal banners (wrapped to keep bg continuous) */}
      <div style={{ background: '#0a0a0a', position: 'relative' }}>
        <div style={{ marginBottom: -2 }}><SanctuaryBanner s={MUDIGERE} onClick={() => setMudigereOpen(true)} /></div>
        <div style={{ marginBottom: -2 }}><SanctuaryBanner s={OHARA_S} onClick={() => setOharaOpen(true)} /></div>
        <SanctuaryBanner2Col left={MUNDUK} right={DAYLESFORD} />
      </div>

      {/* Closing — manifesto centered on top of computational art */}
      <section style={{ position: 'relative', background: 'var(--bg)', zIndex: 1, overflow: 'hidden', minHeight: 'clamp(420px, 60vh, 640px)' }}>
        {/* Computational art — fills the section as backdrop */}
        <VideoReactiveArt
          src="/aura-hero.mp4"
          overlay
          cellSize={10}
          opacity={0.85}
          sparsity={0.42}
          reactivity={0.1}
          colors={['#CA4926', '#DD7C37', '#E4B239', '#E1ADA2', '#A5B6C8', '#B6B050', '#7A7C5C']}
          style={{ position: 'absolute', inset: 0, background: 'transparent', pointerEvents: 'none' }}
        />
        {/* Top fade so the art emerges into the section */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Manifesto on top of the art — left aligned within section-w */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          minHeight: 'inherit',
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--section-gap) 0',
        }}>
          <div className="section-w" style={{ textAlign: 'left' }}>
            <div style={{ maxWidth: 720 }}>
              <Reveal>
                <h2>A 1,000 Year Idea</h2>
              </Reveal>
              <Reveal delay={80}>
                <p className="p2" style={{ marginTop: 16 }}>We think in generations</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      </div>{/* end human-only */}
    </div>
  )
}
