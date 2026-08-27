'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import {
  DataGrid,
  DataCard,
  ScrollHighlight,
  Continue,
  Term,
} from '@/components/article/Article'
import Reveal from '@/components/RevealOnScroll'
import { StorytellingScroller } from '@/components/StorytellingScroller'
import { FilmPlay } from '@/components/FilmPlay'
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudSun, CloudMoon } from '@phosphor-icons/react'

/* ═══════════════════════════════════════════════════════════════════
   MUDIGERE — a single scrolling story.

   Seven movements: Mudigere → Estate → Crops → Animals → People →
   Vision → End. No section labels; the headings and the full-bleed
   parallax banners carry the rhythm. Banners are distributed per a
   fixed count per movement (1 / 3 / 2 / 2 / 5 / 2 / 1).
═══════════════════════════════════════════════════════════════════ */

/* ── Live land data (self-contained weather widget) ── */
type WeatherData = { temp: number; humidity: number; wind: number; code: number; isDay: boolean }

const WEATHER_LABELS: Record<number, string> = {
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
  }, [lat, lon])
  return data
}

function WeatherGlyph({ code, isDay, size = 20 }: { code: number; isDay: boolean; size?: number }) {
  const w = 'light' as const
  if (code === 0) return isDay ? <Sun size={size} weight={w} /> : <Moon size={size} weight={w} />
  if (code <= 2) return isDay ? <CloudSun size={size} weight={w} /> : <CloudMoon size={size} weight={w} />
  if (code === 3) return <Cloud size={size} weight={w} />
  if (code <= 48) return <CloudFog size={size} weight={w} />
  if (code <= 67) return <CloudRain size={size} weight={w} />
  if (code <= 77) return <CloudSnow size={size} weight={w} />
  if (code <= 82) return <CloudRain size={size} weight={w} />
  return <CloudLightning size={size} weight={w} />
}

function LiveLandData() {
  const weather = useWeather(13.168594, 75.433983)
  const condition = weather ? (WEATHER_LABELS[weather.code] ?? 'Overcast') : null
  return (
    <div className="land-data">
      <div className="land-data__facts">
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <p className="label" style={{ marginBottom: 'var(--space-2)' }}>LOCATION</p>
          <p style={{ margin: 0, color: 'var(--text)' }}>Mudigere, Chikmagalur District, Karnataka, India.</p>
        </div>

        {weather && (
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <p className="label" style={{ marginBottom: 'var(--space-2)' }}>WEATHER NOW</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)' }}>
              <WeatherGlyph code={weather.code} isDay={weather.isDay} size={20} />
              <span>{weather.temp}&deg;C &middot; {condition}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
          <div><p className="label">COORDINATES</p><p style={{ marginTop: 2, color: 'var(--text)' }}>13.1686&deg; N, 75.4340&deg; E</p></div>
          <div><p className="label">ALTITUDE</p><p style={{ marginTop: 2, color: 'var(--text)' }}>3,600 ft.</p></div>
          <div><p className="label">TEMP.</p><p style={{ marginTop: 2, color: 'var(--text)' }}>{weather ? `${weather.temp}°C now · 14–30°C` : '14–30°C'}</p></div>
          <div><p className="label">HUMIDITY</p><p style={{ marginTop: 2, color: 'var(--text)' }}>{weather ? `${weather.humidity}%` : '58%'}</p></div>
          <div><p className="label">WIND</p><p style={{ marginTop: 2, color: 'var(--text)' }}>{weather ? `${weather.wind} KM/H` : '5 KM/H'}</p></div>
          <div><p className="label">AVG. WIND</p><p style={{ marginTop: 2, color: 'var(--text)' }}>5 KM/H</p></div>
        </div>
      </div>

          {/* Queried by COORDINATES, not a place name — a name query matches
              a nearby business listing and auto-opens its card; coordinates
              drop a clean pin. t=h satellite, the no-API-key ?output=embed form. */}
      <div className="land-data__map">
        <iframe
          title="Aura Estate — Mudigere, Karnataka"
          src="https://maps.google.com/maps?q=13.168594,75.433983&t=h&z=14&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <style jsx>{`
        /* Orientation panel — facts on the left, satellite map on the right.
           The map was pulled in July 2026 because it escaped into the
           agent/reader view; the same commit added a global agent-mode rule
           that hides every iframe in main, so the leak it was removed for is
           handled centrally now and the map can sit here safely. */
        .land-data {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(28px, 5vw, 72px);
          align-items: start;
        }
        @media (max-width: 768px) {
          .land-data { grid-template-columns: 1fr; gap: 32px; }
        }
        .land-data__map {
          position: relative;
          aspect-ratio: 4 / 3;
          border: 1px solid var(--border);
          border-radius: var(--radius-1);
          overflow: hidden;
          background: var(--bg-card);
        }
        .land-data__map :global(iframe) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }
      `}</style>
    </div>
  )
}

/* Heading-left / body-right block — the prose layout used to open
   most movements. */
function HeadingBlock({ heading, children }: { heading: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)', alignItems: 'start' }}>
      <Reveal>
        <h2 style={{ maxWidth: 560, marginTop: 0 }}>{heading}</h2>
      </Reveal>
      <Reveal delay={120}>
        <div className="article-body" style={{ marginTop: '-0.2em' }}>{children}</div>
      </Reveal>
    </div>
  )
}

/* A standard prose movement — full section padding, centred 1200
   content column. */
function Movement({ id, heading, children }: { id?: string; heading: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">{children ? <HeadingBlock heading={heading}>{children}</HeadingBlock> : <h2 style={{ marginTop: 0, maxWidth: 760 }}>{heading}</h2>}</div>
    </section>
  )
}

/* EXPERIMENT (offline): the two plain photo banner-stacks — coffee and
   animals — rebuilt as no-snap crossfades over one sticky backdrop, with the
   surrounding editorial as the covering white panels. The hero, the pinned
   estate wordmark, the parallax/film banners, and the diagrams are left
   untouched (signature moments kept). One caption per block. */
const MUD_PASSAGES = [
  { caption: 'Arabica, ripening in the understory', media: [
    { image: '/journals/coffee/aura-our-coffee-story.jpg', alt: 'Six micro lots · Arabica Sln.9 & Sln.795 · Aura Estate' },
    { video: '/mudigere/aura-coffee.mp4', poster: '/mudigere/aura-coffee.jpg', alt: 'Coffee cherries ripening in the understory under native shade' },
  ] },
  { caption: 'Fauna of Mudigere', media: [
    { video: '/journals/living-systems/aura-cow-eye.mp4', poster: '/journals/living-systems/aura-cow-eye.jpg', alt: 'Close on the eye of a Malnad Gidda — indigenous Karnataka breed' },
    { video: '/mudigere/aura-animals.mp4', poster: '/mudigere/aura-animals.jpg', alt: 'The fauna of the estate — cattle, native bees, and the living loop' },
  ] },
]

/* Estate — the top-view ⇄ walkthrough crossfade, with the pinned AURA ESTATE
   wordmark centred over it and the "Explore Aura Estate" film kept playable.
   No block caption (the wordmark is the title). */
const MUD_ESTATE = [
  { media: [
    { video: '/mudigere/aura-estate-top-view.mp4', poster: '/mudigere/aura-estate-top-view.jpg', alt: 'The four-story canopy from above — Aura Estate, Western Ghats' },
    { video: '/mudigere/aura-estate-walkthrough.mp4', poster: '/mudigere/aura-estate-walkthrough.jpg', alt: 'The estate on film — Aura Estate, Western Ghats' },
  ], overlay: (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mudigere/aura-estate-wordmark.png" alt="" aria-hidden style={{ width: 'min(72vw, 1040px)', maxWidth: '90vw', height: 'auto', display: 'block' }} />
      <FilmPlay youtubeId="NA-qtu8JljA" note="Explore Aura Estate" caption="The estate, on film" />
    </>
  ) },
]

/* People & Vision — residency ⇄ closing film crossfade, "Watch our story"
   kept playable. */
const MUD_PEOPLE = [
  { media: [
    { video: '/mudigere/aura-people.mp4', poster: '/mudigere/aura-people.jpg', alt: 'The residency — those who come to learn' },
    { video: '/mudigere/aura-vision.mp4', poster: '/mudigere/aura-vision.jpg', alt: 'The estate on film — the forest of 2125' },
  ], overlay: (
    <FilmPlay youtubeId="bFTZUfn4D0A" note="Rebuilt as a living system — the forest of 2125" caption="Watch our story" />
  ) },
]

export default function MudigerePage() {
  // Hero wordmark drift — the mark travels slower than the video behind it.
  // The per-frame `.mud-pin-mark` pass that used to live here is gone: it
  // hand-rolled a mark pinned over a stack of banners, and StorytellingScroller
  // holds its overlay for the length of a run now, so the markup it queried no
  // longer exists. It was running a document-wide querySelectorAll on every
  // scroll frame and finding nothing.
  const heroMarkRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const hero = heroMarkRef.current
      if (!hero) return
      const y = Math.min(window.scrollY, window.innerHeight)
      hero.style.transform = `translateY(${(y * 0.28).toFixed(1)}px)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Hide the kit's default back link — /mudigere is reached by
          direct invitation, not from another journal. */}
      <style jsx global>{`
        .hero-banner__back,
        .journal-hero__back,
        .article-hero__back { display: none !important; }
        @media (max-width: 600px) {
          .mud-hero__caption { font-size: 10px !important; line-height: 1.45 !important; }
        }
        /* Four-layer cross-section — flowed into the crops column: the
           label stacked above its description, one block per canopy layer
           so it reads cleanly in the narrower second column. */
        .layer-row {
          border-top: 1px solid var(--border);
          padding: clamp(12px, 1.8vh, 20px) 0;
        }
        .layer-row:last-child { border-bottom: 1px solid var(--border); }
        .layer-row__label { margin: 0 0 4px; }
        .layer-row__body { margin: 0; color: var(--text-body); }
        /* Estate spec cards — each carries a small thumbnail (placeholder
           for now: a dashed drop-zone) above the figure. */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(24px, 3vw, 48px);
          margin-top: clamp(24px, 4vh, 40px);
        }
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: 1fr 1fr; }
        }
        /* Narrow phones: the bigger thumbs need full-width cards or the text
           column gets crushed. Single column below 560px. */
        @media (max-width: 560px) {
          .stat-grid { grid-template-columns: 1fr; }
        }
        .stat-card {
          border-top: 1px solid var(--border);
          padding-top: 16px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .stat-card__thumb {
          flex: 0 0 auto;
          width: clamp(96px, 9vw, 120px);
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-1);
          object-fit: cover;
          display: block;
          background: #e8e5de;
        }
        .stat-card__text { flex: 1 1 auto; min-width: 0; }

        /* Forest pull-quote — doesn't just fade: the blur clears, it rises and
           scales up, then breathes gently so it feels alive. Triggered off the
           parent Reveal's .visible class. */
        .forest-mark {
          opacity: 0;
          transform: scale(0.93) translateY(14px);
          filter: blur(8px);
          will-change: transform, opacity, filter;
        }
        .reveal.visible .forest-mark {
          animation:
            forest-in 1200ms var(--ease-out) forwards,
            forest-breathe 8s ease-in-out 1350ms infinite;
        }
        @keyframes forest-in {
          0%   { opacity: 0; transform: scale(0.93) translateY(14px); filter: blur(8px); }
          55%  { opacity: 1; }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes forest-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-6px) scale(1.006); }
        }
        @media (prefers-reduced-motion: reduce) {
          .forest-mark {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            animation: none !important;
          }
        }

        /* Spec section transitions in card-by-card. The Reveal container
           itself doesn't move (so there's no double-animation); each card
           fades + rises with a staggered delay once the section is in view. */
        .reveal.mud-cascade { opacity: 1; transform: none; }
        .mud-cascade .stat-card {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 560ms var(--ease-out), transform 560ms var(--ease-out);
        }
        .mud-cascade.visible .stat-card { opacity: 1; transform: none; }
        .mud-cascade.visible .stat-card:nth-child(1) { transition-delay: 0ms; }
        .mud-cascade.visible .stat-card:nth-child(2) { transition-delay: 55ms; }
        .mud-cascade.visible .stat-card:nth-child(3) { transition-delay: 110ms; }
        .mud-cascade.visible .stat-card:nth-child(4) { transition-delay: 165ms; }
        .mud-cascade.visible .stat-card:nth-child(5) { transition-delay: 220ms; }
        .mud-cascade.visible .stat-card:nth-child(6) { transition-delay: 275ms; }
        .mud-cascade.visible .stat-card:nth-child(7) { transition-delay: 330ms; }
        .mud-cascade.visible .stat-card:nth-child(8) { transition-delay: 385ms; }
        .mud-cascade.visible .stat-card:nth-child(9) { transition-delay: 440ms; }
        @media (prefers-reduced-motion: reduce) {
          .mud-cascade .stat-card {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ═══ 1 · MUDIGERE ═══ (1 banner — the hero) */}
      <section
        className="hero-banner-wrap"
        style={{
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          height: '100svh',
          minHeight: 600,
          background: '#080908',
          overflow: 'hidden',
        }}
      >
        <video
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster="/journals/land/aura-mudigere-panorama.jpg"
          aria-label="Mudigere — aerial pass over the estate ridgeline"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
        >
          <source src="/aura-mudigere.mp4" type="video/mp4" />
        </video>
        <div aria-hidden className="hero-banner-tint" style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.14)', pointerEvents: 'none', zIndex: 3 }} />
        {/* Bottom-left vignette — same radial the journal-hero media carries,
            so the pinned caption stays legible over busy foliage without
            darkening the frame. */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 45% at 0% 100%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.35) 35%, rgba(0, 0, 0, 0) 75%)', pointerEvents: 'none', zIndex: 4 }} />
        {/* Wordmark — replaces the type, parallaxes over the video.
            Rendered solid white (filter forces white regardless of the
            SVG's own fill); no mix-blend. */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 5 }}>
          <h1 aria-label="Mudigere" style={{ margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={heroMarkRef}
              src="/mudigere/aura-mudigere-wordmark.svg"
              alt="Mudigere"
              style={{ display: 'block', width: 'min(46vw, 560px)', height: 'auto', willChange: 'transform', filter: 'brightness(0) invert(1)' }}
            />
          </h1>
        </div>
        {/* Caption — anchored to the bottom of the banner. */}
        <p
          className="label mud-hero__caption"
          style={{ position: 'absolute', left: 0, right: 0, bottom: 'clamp(48px, 9vh, 96px)', margin: 0, textAlign: 'center', color: '#ffffff', letterSpacing: '1.5px', lineHeight: 1.5, textShadow: '0 1px 12px rgba(0, 0, 0, 0.4)', zIndex: 5, pointerEvents: 'none' }}
        >
          Aura Estate · 150 acres · 3,600 ft · Western Ghats · Karnataka
        </p>
      </section>

      <Movement heading={<>Where Indian coffee began.</>}>
        <p className="p1">
          Four centuries ago, seven coffee seeds crossed from Yemen into
          the hills above Chikmagalur and took root — the cradle of Indian
          coffee, held in the{' '}
          <Term tip="Mountain range along India's west coast. A UNESCO World Heritage site and one of the world's eight 'hottest hotspots' of biological diversity. Older than the Himalayas.">Western Ghats</Term>, a range older than the Himalayas
          and among the eight most biodiverse places on Earth.
        </p>
        <p className="p1">
          Aura farms 150 acres of it at 3,600 feet, on red{' '}
          <Term tip="Red, iron-rich, free-draining volcanic soil typical of the Western Ghats. pH 6.0–6.5, over granite, alive with mycorrhizal networks.">laterite</Term> under a canopy that has never been
          cleared. The work bends toward <em>Ṛta</em> — the old idea that
          a thing is right when it sits in alignment with all around it.
          We read the land before we touch it; we grow around it, not
          through it.
        </p>
      </Movement>

      {/* Live orientation — where the region sits and its weather now,
          with the map. Grounds the opening before the estate proper. */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal><LiveLandData /></Reveal>
        </div>
      </section>

      {/* ═══ 2 · ESTATE ═══ — the banner wall opens the section. An estate
          wordmark is pinned (sticky) and centred over the whole 3-banner
          stack, rendered solid white, while the banners parallax behind it,
          pinned at the viewport middle. */}
      <StorytellingScroller
        passages={MUD_ESTATE}
        sections={[

      /* ═══ 2 · ESTATE — the banner wall crossfades; the pinned AURA ESTATE
             wordmark + the "Explore Aura Estate" film ride over it ═══ */
      <Fragment key="est0" />,

      <Fragment key="est1">
      <Movement id="estate" heading={<>A hundred and fifty acres, read as one.</>}>
        <p className="p1">
          Aura Estate lies in Chikmagalur district, forty-five minutes
          from town — the last stretch an unpaved ghat road that drops
          through mist into coffee country. Every acre is mapped at
          1:2,500: boundary, contour, water channel, and standing
          structure, set down to scale before a single new line is drawn.
        </p>
        <p className="p1">
          Its eastern edge runs hard against the <Term tip="Tiger reserve in the Western Ghats of Karnataka. Core habitat for tiger, leopard, gaur, and dhole.">Bhadra Wildlife Reserve</Term>
          {' '}buffer, and twenty acres of unbroken forest fall inside the
          estate itself. Leopard and gaur move through it; Malabar giant
          squirrel travel the high branches, pied hornbill nest in the old
          trees, and king cobra have been recorded on the ground. The land
          is worked to draw the wild in, not wall it out — the protected
          acres run as a corridor into the reserve, extending the habitat
          instead of fencing it off.
        </p>
      </Movement>

      {/* Spec grid pulled close to the heading it answers — top padding
          dropped (the heading section above already provides the gap).
          Each card carries a small placeholder thumbnail above the figure. */}
      <section style={{ padding: '0 0 var(--section-gap)' }}>
        <div className="section-w">
          <Reveal className="mud-cascade">
            <div className="stat-grid">
              {([
                ['150 acres', 'Total surveyed area — 20 acres protected, on the Bhadra boundary.', 'land'],
                ['100 acres', 'Shade-grown Arabica across 6 micro-lots — 4 centuries in cultivation.', 'coffee'],
                ['32 acres', 'Tea, in organic transition.', 'tea'],
                ['3,000 mm', 'Annual monsoon rainfall.', 'rain'],
                ['35,000', 'Trees, across four canopy layers.', 'trees'],
                ['52', 'Malnad Gidda cattle.', 'cows'],
              ] as const).map(([value, label, thumb]) => (
                <div key={value} className="stat-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/mudigere/aura-thumb-${thumb}.jpg`} alt="" aria-hidden loading="lazy" decoding="async" className="stat-card__thumb" />
                  <div className="stat-card__text">
                    <p className="p1" style={{ margin: '0 0 8px' }}>{value}</p>
                    <div className="p1" style={{ color: 'var(--text-body)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      </Fragment>,

        ]}
      />

      {/* ═══ 3 · CROPS ═══ — the pull-quote opens in a banner frame
          (rough placeholder styling, design TBD); the four-layer content
          reads beneath, then the coffee banners divide into processing. */}
      {/* The pull-quote, as artwork — centred on the page with generous
          whitespace above and below, revealed on scroll. No banner frame. */}
      <section style={{ padding: 'calc(var(--section-gap) * 1.5) 0' }}>
        <div className="section-w" style={{ textAlign: 'center' }}>
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="forest-mark"
              src="/mudigere/aura-forest.svg"
              alt="A forest that produces crops, not a farm that plants trees"
              style={{ display: 'block', width: 'auto', height: 'min(82vh, 768px)', maxWidth: '90%', margin: '0 auto' }}
            />
          </Reveal>
        </div>
      </section>

      <StorytellingScroller
        passages={MUD_PASSAGES}
        sections={[

      /* ═══ M0 · CROPS — the four-layer forest (coffee crossfade after) ═══ */
      <Fragment key="m0">
      <Movement id="crops" heading={<>A forest, farmed in four layers.</>}>
        <p className="p1">
          Nothing here grows alone. Native shade trees hold the sky; areca
          and pepper share the middle air; coffee and tea fill the
          understory; cardamom, cacao, and cover crops knit the floor.
          Each layer shelters the one beneath it, and the whole behaves
          like a forest that happens to yield a harvest.
        </p>
        <p className="p1">
          Blocks with 65–75% canopy coverage measurably outperform the
          rest — proof, on the land&rsquo;s own terms, that the shade is
          not a compromise but the point. The canopy pays past the cup, too:
          four layers and thirty-five thousand trees draw down three to five
          times the carbon of open monoculture.
        </p>
        {/* The four layers, flowed into this column under the prose. */}
        <div style={{ marginTop: 'var(--space-6)' }}>
          <div className="layer-row">
            <p className="p1 layer-row__label">Layer 1 · The canopy</p>
            <p className="p1 layer-row__body">
              Silver oak, albizzia, jackfruit, fig, and rosewood hold the sky
              at 15–25 m — 60–80% cover, the shade the whole system grows
              beneath.
            </p>
          </div>
          <div className="layer-row">
            <p className="p1 layer-row__label">Layer 2 · The middle air</p>
            <p className="p1 layer-row__body">
              Areca palms run in ranks, each one a living trellis for black
              pepper. Avocado fills the margins.
            </p>
          </div>
          <div className="layer-row">
            <p className="p1 layer-row__label">Layer 3 · The understory</p>
            <p className="p1 layer-row__body">
              A hundred acres of Arabica — <Term tip="Selection 9. Ethiopian-hybrid Arabica bred at the Central Coffee Research Institute, Karnataka.">Sln.9</Term>, <Term tip="Selection 795. Kents × S.288 Arabica cross, released 1946.">Sln.795</Term>, <Term tip="A modern Arabica cultivar (Catimor lineage) developed in India, prized for leaf-rust resistance.">Chandragiri</Term> — with thirty-two acres of tea easing into organic.
            </p>
          </div>
          <div className="layer-row">
            <p className="p1 layer-row__label">Layer 4 · The floor</p>
            <p className="p1 layer-row__body">
              Cardamom, cacao, and medicinals carpet the ground; cover crops,
              vermicompost, and recovering honeybee colonies — no chemical
              input.
            </p>
          </div>
        </div>
      </Movement>
      </Fragment>,

      /* ═══ M1 · PROCESSING — six lots, three ferments (coffee crossfade before) ═══ */
      <Fragment key="m1">
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <HeadingBlock heading={<>Six micro lots. Three ferments. One appellation.</>}>
            <p className="p1">
              Arabica grown at 3,600 feet under native shade. Altitude
              slows the cherry, concentrating sugar and acid into
              complexity; three fermentation disciplines carry it forward —
              Red Honey, <Term tip="Sherry-making technique: carry a fraction of the previous batch forward as a live mother culture.">Solera Maceration</Term> (the flagship), and a
              25-day natural.
            </p>
            <p className="p1">
              Only fully ripe cherries, 95% minimum. Short micro-ferment
              windows, twenty-five days of drying, each lot on its own
              clock — cupped fresh at source, specialty-grade. The wet mill
              is the cellar: in the Solera tanks, the culture of one batch
              seeds the next. Appellation, in microbial form.
            </p>
          </HeadingBlock>
        </div>
      </section>

      {/* Crops, in images — the cherry, the ferment, the carry-forward. */}
      <DataGrid cols={3} standalone tightTop>
        <DataCard
          img="/journals/coffee/aura-coffee-grading.jpg"
          alt="Coffee grading by screen size and defect — SCA protocol on the estate"
          value="The cherry."
        >
          Hand-picked dead ripe; the harvest-day Brix reading sets each
          lot&rsquo;s path through the wet mill.
        </DataCard>
        <DataCard
          img="/journals/coffee/aura-liquid-gold.jpg"
          alt="Red Honey lot — sticky mucilage on parchment, named Liquid Gold"
          value="The ferment."
        >
          Micro-ferment windows kept short; tank temperature logged by the
          hour.
        </DataCard>
        <DataCard
          video="/journals/coffee/aura-solera-macaceration.mp4"
          poster="/journals/coffee/aura-solera-macaceration.jpg"
          alt="Solera Maceration tanks carrying microbial culture forward across batches"
          value="The carry-forward."
        >
          A live mother culture carried from batch to batch — the cellar
          never starts from zero.
        </DataCard>
      </DataGrid>
      </Fragment>,

      /* ═══ M2 · ANIMALS — the closed loop (animals crossfade before) ═══ */
      <Fragment key="m2">
      <Movement id="animals" heading={<>The closed loop.</>}>
        <p className="p1">
          What the coffee draws on, the animals give back. The{' '}
          <Term tip="Indigenous Karnataka cattle breed adapted to the Western Ghats over centuries. Small, dark, hardy.">Malnad Gidda</Term> — an indigenous breed, bred to this
          altitude — move through the blocks as the rotation; their dung
          and urine feed the biodynamic preparations (<Term tip="The biodynamic preparations — eight numbered field and compost sprays applied at precise lunar and seasonal timings.">BD 500–508</Term>),
          timed to the moon and the season.
        </p>
        <p className="p1">
          The bees keep the ledger: when colonies thin during flowering,
          the cherry set drops four to six weeks on. A 12-acre nursery
          raises native species for the canopy of the next century; orchid
          restoration is the long horizon. With zero chemical input, season
          on season, the living soil rebuilds itself — the slow capital
          every harvest draws on. Nothing leaves the loop.
        </p>
      </Movement>

      {/* The closed loop, in images — cattle, bees, nursery. */}
      <DataGrid cols={3} standalone tightTop>
        <DataCard
          img="/journals/living-systems/aura-cow.jpg"
          alt="Malnad Gidda grazing through the coffee blocks"
          value="52 cattle, in rotation."
        >
          Their movement through the coffee IS the rotation. Their dung is
          the input.
        </DataCard>
        <DataCard
          img="/journals/biodynamic/aura-biodynamic.jpg"
          alt="Native bee colonies working pepper and citrus flowers"
          value="The bees."
        >
          Native colonies in the pepper and the citrus. Pollination windows
          open and close with the rain.
        </DataCard>
        <DataCard
          img="/journals/living-systems/aura-canopy.jpg"
          alt="The twelve-acre native canopy nursery propagating threatened species"
          value="The nursery."
        >
          12 acres in propagation — native canopy species, raised to be
          planted out.
        </DataCard>
      </DataGrid>

      {/* The brand promise, as artwork — centred and animated in like the
          crops pull-quote, forced to black via a brightness(0) wrapper. It
          opens the People & Vision section: what the community is building. */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w" style={{ textAlign: 'center' }}>
          <Reveal>
            <div style={{ filter: 'brightness(0)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="forest-mark"
                src="/mudigere/aura-whatwebuild.svg"
                alt="What we build should be transparent in 30 years"
                style={{ display: 'block', width: 'min(59vw, 704px)', height: 'auto', maxWidth: '90%', margin: '0 auto' }}
              />
            </div>
          </Reveal>
        </div>
      </section>
      </Fragment>,

        ]}
      />

      <StorytellingScroller
        passages={MUD_PEOPLE}
        sections={[

      /* ═══ 5 · PEOPLE & VISION — residency ⇄ closing film crossfade,
             "Watch our story" kept playable ═══ */
      <Fragment key="ppl0">
      <Movement heading={<>Monastic polymaths. Crazy misfits.</>}>
        <p className="p1">
          A working estate is a community before it is anything else — the
          hands that read the land, the families that have kept it for
          generations, and the ones who come to stay and learn. What is
          learned here is written down and given away: biodynamic and Vedic
          practice, documented and taught, opened to anyone who comes.
        </p>
        <p className="p1">
          Together they are turning a colonial-era plantation, built for
          extraction, into a living system — one that grows its structures
          around the landscape rather than through it. An artist residency, a
          research laboratory, sanctuary spaces: built to be lived in, not
          only worked.
        </p>
        <p className="p1">
          Phase one fixes the hydrology — reservoirs that catch three thousand
          millimetres of monsoon and return it to the watershed below, and a
          five-acre biophilic pilot, the proof of concept for everything that
          follows. The master plan sets a permanent armature and leaves the
          rest adaptive: presence without imposition, a place felt more than
          seen. The canopy planted today is the forest of 2125 — built, from
          the first drawing, to outlast its builders.
        </p>
      </Movement>
      </Fragment>,

      /* ═══ 6 · END — the closing invitation, over the vision film ═══ */
      <Fragment key="ppl1">
      <ScrollHighlight>
        {`The land sets the brief.
         The forest is the farm.
         Come and stand on it.
         Walk it at your own pace.
         The estate reveals more in a single morning than this page can in a year.
         Coffee at dawn, the canopy at noon, the valley quiet by dusk.`}
      </ScrollHighlight>

      <Continue
        items={[
          { href: '/herd', label: 'Ecosystem Engineers', description: 'The estate’s biological engine — fifty-two Malnad Gidda, cared for by hand, each passported.', img: '/herd/images/aura-grassland1.jpg' },
          { href: '/circular', label: 'Circular Intelligence', description: 'What the herd makes — CPP and Jeevamrit, by hand, tested before the soil.', img: '/circular/images/aura-shed.jpg' },
          { href: '/shade', label: 'The Light Instrument', description: 'The canopy above the estate — shade whiskering, measured in lux and cut to prescription.', img: '/aura-land.jpg' },
        ]}
      />
      </Fragment>,

        ]}
      />
    </>
  )
}
