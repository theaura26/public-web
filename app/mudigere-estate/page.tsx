'use client'

import { useEffect, useRef, useState } from 'react'
import {
  OneCol,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  ScrollHighlight,
  Term,
} from '@/components/article/Article'
import Reveal from '@/components/RevealOnScroll'

/* ── HeroCrossfade ────────────────────────────────────────────
   Hero is a 200vh wrapper with a sticky 100vh stage. Two layers
   sit absolute inside it — the aerial video at the back and the
   surveyed estate plan in front. A scroll listener crossfades
   the two by adjusting their opacity, so as the reader scrolls
   the video dissolves into the technical drawing while the
   MUDIGERE title (mix-blend-difference) holds against both.
   No new module-level component is added — this is just markup
   composed from the existing global classes (.section-w,
   .studios-title, .studios-title__letters, .label) plus a
   scroll handler. */

/* /mudigere-estate — private briefing for architects and landscape designers.
   Built entirely from the journal kit (JournalHero, OneCol, TwoCol,
   Placeholder, DataGrid, DataCard, PullQuote, ScrollHighlight, Term)
   and the kit's typography tokens. No bespoke components. Light mode
   to match the rest of theaura.life; the global Navbar + Footer wrap
   this page. Throughline mirrors the reference briefing HTML — hero,
   stats, location, land, agroforestry layers, coffee + tea, living
   systems, the architect's brief, the design pillars, invitation. */

export default function MudigerePage() {
  const heroWrapRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const heroMapRef = useRef<HTMLImageElement>(null)
  /* Inline YouTube walkthrough — starts as a still (panorama
     poster + play button), swaps to the actual YouTube embed on
     click. No scroll-driven blur, no autoplay-with-sound. */
  const [walkthroughPlaying, setWalkthroughPlaying] = useState(false)
  /* Second YouTube — a longer-form film placed at the foot of the
     page (between the Design Brief pillars and the ScrollHighlight),
     same click-to-play pattern as the top walkthrough. */
  const [filmPlaying, setFilmPlaying] = useState(false)

  /* Scroll-driven crossfade for the hero stage. Wrapper is 200 vh,
     sticky stage is 100 vh — so we have one full viewport of scroll
     to cross the two layers. p = 0 at the top of the wrapper, 1 when
     the sticky has finished its hold. Video opacity = 1 − p, map
     opacity = p. Smootherstep curve so the transition feels eased
     rather than linear. */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      raf = 0
      const wrap = heroWrapRef.current
      const v = heroVideoRef.current
      const m = heroMapRef.current
      if (!wrap || !v || !m) return
      const rect = wrap.getBoundingClientRect()
      const range = wrap.offsetHeight - window.innerHeight
      if (range <= 0) return
      const raw = Math.max(0, Math.min(1, -rect.top / range))
      const p = reduced
        ? (raw > 0.5 ? 1 : 0)
        : raw * raw * raw * (raw * (raw * 6 - 15) + 10)
      v.style.opacity = String(1 - p)
      m.style.opacity = String(p)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    tick()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Hide the back link the kit injects by default — /mudigere-estate is
          reached by direct invitation, not from another journal, so the
          affordance has nowhere meaningful to return to. One-line CSS
          override; no new component. */}
      <style jsx global>{`
        .hero-banner-back { display: none !important; }
        .mud-walk__play:hover {
          background: rgba(0, 0, 0, 0.55) !important;
          border-color: #ffffff !important;
          transform: translate(-50%, -50%) scale(1.04) !important;
        }
      `}</style>

      {/* ── Hero crossfade ───────────────────────────────────
          200 vh wrapper holds a sticky 100 vh stage. Two full-bleed
          layers live inside: the aerial video at the back, the
          surveyed estate plan in front. Scroll handler (above)
          crossfades their opacity, so the cinematic opener
          dissolves into the technical drawing as the reader
          descends. The MUDIGERE title rides on top via
          mix-blend-difference and inverts cleanly against either
          layer (white video frames, beige paper alike). Caption
          pinned bottom-left, also mix-blend so it stays legible. */}
      <section
        ref={heroWrapRef}
        className="hero-banner-wrap"
        style={{
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          height: '200vh',
          background: '#080908',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100svh',
            minHeight: 600,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Layer 1 — aerial video, full-bleed cover */}
          <video
            ref={heroVideoRef}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster="/journals/land/aura-mudigere-panorama.jpg"
            aria-label="Mudigere — aerial pass over the estate ridgeline"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              zIndex: 1,
              willChange: 'opacity',
            }}
          >
            <source src="/aura-mudigere.mp4" type="video/mp4" />
          </video>

          {/* Layer 2 — surveyed estate plan, full-bleed cover so it
              fills both width AND height of the hero stage. (Contain
              left ~300 px of cream letterbox top + bottom on portrait
              mobile and ~120 px on desktop; cover crops the edges
              instead, which feels more like a banner than a postcard.) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={heroMapRef}
            src="/journals/land/aura-mudigere-map.jpg"
            alt="Sampigelkhan Estate plan — surveyed at 1:2,500. Coffee blocks in green, tea ridge to the north, foot paths threading between."
            loading="eager"
            decoding="async"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              background: '#f4ecd8',
              zIndex: 2,
              opacity: 0,
              willChange: 'opacity',
            }}
          />

          {/* 12 % tint over the footage — legibility floor that the
              estate-plan layer fades through to as well. */}
          <div
            aria-hidden
            className="hero-banner-tint"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.14)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Title overlay + sub-caption — white ink, mix-blend-
              difference so they invert cleanly against the dark
              video AND the light beige map. Title uses the existing
              `.section-w` rail + `.studios-title` letter-spread
              typography; the sub-caption sits directly beneath it,
              centred, in the kit's `.label` token. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mixBlendMode: 'difference',
              color: '#ffffff',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <div className="section-w" style={{ width: '100%' }}>
              <h1 className="studios-title" aria-label="Mudigere" style={{ color: 'inherit' }}>
                <span className="studios-title__letters" aria-hidden>
                  <span>M</span>
                  <span>U</span>
                  <span>D</span>
                  <span>I</span>
                  <span>G</span>
                  <span>E</span>
                  <span>R</span>
                  <span>E</span>
                </span>
                <span className="studios-title__plain">Mudigere</span>
              </h1>
              <p
                className="label mud-hero__caption"
                style={{
                  margin: 'clamp(20px, 3vh, 40px) 0 0',
                  textAlign: 'center',
                  color: 'inherit',
                  letterSpacing: '1px',
                  lineHeight: 1.5,
                }}
              >
                Sampigelkhan Estate · 150 acres · 3,600 ft · Western Ghats · Karnataka
              </p>
            </div>
          </div>

          {/* Download PDF — centered along the bottom of the banner.
              Pill chip with a soft backdrop blur + 1px border so it
              reads as a confident CTA against either layer of the
              crossfade. `left: 50%` + `translateX(-50%)` anchors it
              to the viewport's horizontal centre. */}
          <a
            href="/mudigere-estate-map.pdf"
            download
            className="label mud-hero__download"
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 'clamp(20px, 4vh, 48px)',
              transform: 'translateX(-50%)',
              zIndex: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 18px',
              color: '#ffffff',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: 999,
              backdropFilter: 'blur(8px) saturate(1.1)',
              WebkitBackdropFilter: 'blur(8px) saturate(1.1)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition:
                'background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)',
            }}
          >
            <span>Download estate plan</span>
            <span aria-hidden style={{ fontSize: 12, lineHeight: 1 }}>↓</span>
          </a>
        </div>
      </section>

      {/* Hover lift on the centred Download chip + a smaller pad on
          phones so the chip sits inside the gutter. Caption is now
          stacked under the title (in flow), so it no longer needs the
          collision-avoidance rules its bottom-left version did. */}
      <style jsx global>{`
        .mud-hero__download:hover {
          background: rgba(0, 0, 0, 0.55);
          border-color: #ffffff;
          /* Compose the centring translate with a 1 px lift so the
             hover doesn't snap off-centre. */
          transform: translate(-50%, -1px);
        }
        @media (max-width: 600px) {
          .mud-hero__caption {
            font-size: 10px !important;
            line-height: 1.45 !important;
          }
          .mud-hero__download {
            padding: 10px 14px !important;
            font-size: 10px !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* ── Location, up top ─────────────────────────────────
          Per the reference briefing: as soon as the visitor lands
          they get the where, the coordinates, the CTA — then a big
          full-bleed estate plan as the visual artefact. Composed
          from existing kit primitives: `.section-w`, the TwoCol-style
          heading/body grid, `.label` typography, and `Placeholder`
          for the full-bleed estate map. */}
      <TwoCol id="location" heading="The Western Ghats, Karnataka.">
        <p className="p1">
          Mudigere sits in Chikmagalur district, 45 minutes from
          Chikmagalur town. Fly into Mangalore (5 hrs) or Bangalore
          (4 hrs) — the last stretch is through ghat roads that
          descend into mist and coffee country.
        </p>
        <p className="p2">
          The estate shares its eastern boundary with the <Term tip="Tiger reserve in the Western Ghats of Karnataka. Core habitat for tiger, leopard, gaur, and dhole.">Bhadra Wildlife Reserve</Term> buffer zone — 20 acres of protected forest are part of the estate.
          Leopard, gaur, Malabar giant squirrel, Malabar pied
          hornbill, and king cobra are recorded on the land. The farm
          is managed to attract, not exclude.
        </p>
      </TwoCol>

      {/* Macro-context Google Maps — pinned to the briefing's
          coordinates so the architect can scan the drive in from
          Chikmagalur, the proximity to Bhadra Reserve, and the
          surrounding ghats. The Download PDF affordance lives up in
          the hero banner now, so this section is just the embed. */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal>
            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-1)',
                overflow: 'hidden',
                background: 'var(--bg-elev, #f4f4f4)',
              }}
            >
              {/* Place-name embed — lets Google's geocoder resolve
                  the actual estate location rather than a hand-
                  typed coordinate (the previous pb URL was pinning
                  slightly off). `?output=embed` is the no-API-key
                  embed form Google still serves for place queries. */}
              <iframe
                title="Sampigelkhan Estate — Mudigere, Karnataka"
                src="https://maps.google.com/maps?q=13.168594,75.433983&z=15&t=k&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
              />
            </div>
            {/* Caption row under the map: coordinates on the left,
                Open in Google Maps deeplink on the right. Both share
                the `.label` token so the row reads as one. */}
            <div
              style={{
                marginTop: 'var(--space-4)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-4) var(--space-6)',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <p className="label" style={{ margin: 0 }}>
                13.168594° N · 75.433983° E · Chikmagalur district, Karnataka
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&amp;query=13.168594,75.433983"
                target="_blank"
                rel="noopener noreferrer"
                className="label"
              >
                Open in Google Maps →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <TwoCol heading="The land, at a glance.">
        <DataGrid cols={3}>
          <DataCard value="3,600 ft">Elevation. 1,097 m.</DataCard>
          <DataCard value="150 acres">Total surveyed area.</DataCard>
          <DataCard value="100 acres">Shade-grown Arabica.</DataCard>
          <DataCard value="3,000 mm">Annual rainfall.</DataCard>
          <DataCard value="14 – 30 °C">Year-round temperature.</DataCard>
          <DataCard value="52">Malnad Gidda cattle.</DataCard>
          <DataCard value="20 acres">Protected forest, eastern boundary.</DataCard>
          <DataCard value="13.1686° · 75.4340°">Coordinates · N, E.</DataCard>
          <DataCard value="UNESCO">Western Ghats biodiversity hotspot.</DataCard>
        </DataGrid>
      </TwoCol>

      {/* Walkthrough — panorama still with a centred play button
          that swaps in the YouTube embed on click. Plain section-w
          composition (no ExpandingBanner, no scroll-driven blur) so
          the still reads sharp and the play affordance is obvious.
          The .label caption beneath uses the kit's typography. */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 'var(--radius-1)',
                overflow: 'hidden',
                background: '#000',
              }}
            >
              {walkthroughPlaying ? (
                <iframe
                  title="Mudigere Estate — walkthrough"
                  src="https://www.youtube-nocookie.com/embed/bFTZUfn4D0A?autoplay=1&rel=0&modestbranding=1&playsinline=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }}
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/journals/land/aura-mudigere-panorama.jpg"
                    alt="Mudigere mountains rising over the Western Ghats — Sampigelkhan Estate"
                    loading="lazy"
                    decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* 18 % tint so the play pill reads as the focal
                      point of the frame instead of competing with
                      the mountain silhouette. */}
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.18)',
                      pointerEvents: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setWalkthroughPlaying(true)}
                    aria-label="Play the estate walkthrough"
                    className="mud-walk__play"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 'clamp(72px, 9vw, 104px)',
                      height: 'clamp(72px, 9vw, 104px)',
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 255, 255, 0.85)',
                      background: 'rgba(0, 0, 0, 0.35)',
                      backdropFilter: 'blur(8px) saturate(1.1)',
                      WebkitBackdropFilter: 'blur(8px) saturate(1.1)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      transition:
                        'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden style={{ marginLeft: 4 }}>
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <p className="label" style={{ marginTop: 'var(--space-4)' }}>
              The walkthrough · Sampigelkhan Estate
            </p>
          </Reveal>
        </div>
      </section>

      {/* The technical drawing reads better as a downloadable artefact
          than as a heavy-blurred editorial moment — handed off to the
          OneCol below for the area-statement DataGrid + PDF link.
          Slot keeps the cinematic beat with the biodynamic pollinator
          footage; the closed loop the estate is built around. */}
      <Placeholder
        src="/journals/biodynamic/aura-biodynamic.mp4"
        mediaType="video"
        poster="/journals/biodynamic/aura-biodynamic.jpg"
        alt="A honeybee on lavender — pollinators in the closed-loop biology of the estate"
        caption="Pollinators · the closed loop runs through them"
      />

      <OneCol id="plan" heading="The estate plan.">
        <p className="p1">
          The survey drawing above sets the briefing. Boundary, contour,
          water channels, and the placement of every existing structure
          — at the scale a builder needs.
        </p>
        <p className="p2">
          <a href="/mudigere-estate-map.pdf" target="_blank" rel="noopener" download>Download the plan as PDF</a>{' '}
          (1 sheet · 750 KB). Best read printed and laid flat.
        </p>
        <DataGrid cols={3}>
          <DataCard value="120 – 36">Coffee area · acres &amp; guntas.</DataCard>
          <DataCard value="035 – 01">Tea area.</DataCard>
          <DataCard value="003 – 29">Uncultivated, in coffee block.</DataCard>
          <DataCard value="002 – 00">Uncultivated, in coffee block.</DataCard>
          <DataCard value="161 – 26">Total surveyed area.</DataCard>
          <DataCard value="40 guntas">= 1 acre.</DataCard>
        </DataGrid>
      </OneCol>

      <TwoCol id="ghats" heading="One of the world&rsquo;s 8 hotspots of biological diversity.">
        <p className="p1">
          The <Term tip="UNESCO designation for regions with exceptional plant and animal endemism under high threat of habitat loss.">Western Ghats</Term> run 1,600 km along
          India&rsquo;s western coast — older than the Himalayas.
          Mudigere sits at the intersection of monsoon shadow and mist
          forest, where altitude, rainfall, and red <Term tip="Red, iron-rich, free-draining volcanic soil typical of the Western Ghats. pH 6.0–6.5.">laterite</Term> soil
          create conditions of exceptional biological density.
        </p>
        <p className="p2">
          Soil pH 6.0–6.5 over granite, alive with mycorrhizal networks.
          Excellent drainage. Strong thermal mass. This is not farming
          despite the climate — it is farming because of it.
        </p>
      </TwoCol>

      {/* Three card grid — same biodynamic aesthetic as the journal kit
          uses on /biodynamic. The herd card teases the cattle section
          to come, the canopy cards set up the agroforestry layers. */}
      <DataGrid cols={3} standalone>
        <DataCard
          img="/journals/biodynamic/aura-young-calves.jpg"
          alt="Two young Malnad Gidda calves in the pen — indigenous Karnataka breed adapted to the Western Ghats"
          value="The herd."
        >
          52 indigenous Malnad Gidda. The closed loop runs through them
          — soil, plant, animal, cosmos as one system.
        </DataCard>
        <DataCard
          img="/journals/land/aura-canopy-noon.jpg"
          alt="The four-story canopy at noon — silver oak, Albizzia, jackfruit, fig"
          value="Canopy at noon."
        >
          Silver oak, Albizzia, jackfruit, fig, native hardwoods.
        </DataCard>
        <DataCard
          img="/journals/living-systems/aura-mid-canopy.jpg"
          alt="Mid-canopy at Sampigelkhan — Arecanut and Black Pepper"
          value="Mid-canopy."
        >
          Arecanut palms; pepper climbing them.
        </DataCard>
      </DataGrid>

      <PullQuote>
        A FOREST that produces CROPS. Not a FARM that plants TREES.
      </PullQuote>

      <TwoCol id="layers" heading="Agroforestry, in four strata.">
        <DataGrid cols={2}>
          <DataCard value="Layer 1 — Native shade canopy, 15–25 m">
            Silver oak, Albizzia, jackfruit, fig, rosewood. Regulates
            shade, sequesters carbon, shelters all layers below. Target
            coverage: 60–80% per block.
          </DataCard>
          <DataCard value="Layer 2 — Arecanut &amp; Black Pepper">
            Arecanut palms rise through the shade. Black pepper climbs
            them — each palm acts as trellis and companion. Avocado at
            the margins.
          </DataCard>
          <DataCard value="Layer 3 — Coffee &amp; Tea">
            100 acres Arabica (<Term tip="Selection 9. Ethiopian-hybrid Arabica bred at the Central Coffee Research Institute, Karnataka.">Sln.9</Term>, <Term tip="Selection 795. Kents × S.288 Arabica cross, released 1946. Vigorous; cocoa-malt body under shade.">Sln.795</Term>, <Term tip="A modern Arabica cultivar (Catimor lineage) developed in India, prized for leaf-rust resistance.">Chandragiri</Term>). 35 acres of tea in
            organic transition — targeting 2027 certification.
          </DataCard>
          <DataCard value="Layer 4 — Cardamom, Cacao, Medicinal">
            Cardamom, cacao, avocado, cover crops, medicinal plants,
            vermicompost beds, beehives. Honeybee restoration is active
            and self-sustaining without chemical inputs.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        src="/journals/coffee/aura-our-coffee-story.jpg"
        alt="Six micro lots · Arabica Sln.9 &amp; Sln.795 · Sampigelkhan Estate"
        caption="Six micro lots · Sampigelkhan Estate"
      />

      <TwoCol id="coffee" heading="Six micro lots. Six processing methods. One appellation.">
        <p className="p1">
          Arabica grown at 3,600 ft with native shade canopy — altitude
          slows the cherry&rsquo;s development, concentrating sugars and
          acids into complexity. Three fermentation disciplines: Red
          Honey, <Term tip="Sherry-making technique: carry a fraction of the previous batch forward as a live mother culture.">Solera Maceration</Term> (the flagship), and 25-day natural.
        </p>
        <p className="p2">
          3–7 day micro-fermentation windows. 25 days minimum drying.
          Each lot finds its own clock. Cupped fresh at source.
          Specialty-grade. Blocks with 65–75% canopy coverage produce
          measurably higher <Term tip="Refractometer reading of dissolved sugars in the cherry or wort, expressed as a percentage.">Brix</Term> in the coffee beneath them.
        </p>
      </TwoCol>

      <DataGrid cols={3} standalone>
        <DataCard
          img="/journals/coffee/aura-coffee-grading.jpg"
          alt="Coffee grading by screen size and defect — SCA protocol on the estate"
          value="The cherry."
        >
          Picked only fully ripe — 95% minimum. Brix on harvest day
          drives the lot decision in the wet mill.
        </DataCard>
        <DataCard
          img="/journals/coffee/aura-liquid-gold.jpg"
          alt="Red Honey lot — sticky mucilage on parchment, named Liquid Gold"
          value="The ferment."
        >
          Red Honey, Solera Maceration, 25-day natural. The wet mill is
          the cellar. Temperature logged hourly.
        </DataCard>
        <DataCard
          video="/journals/coffee/aura-solera-macaceration.mp4"
          poster="/journals/coffee/aura-solera-macaceration.jpg"
          alt="Solera Maceration tanks carrying microbial culture forward across batches"
          value="The carry-forward."
        >
          The microbial culture of one batch shapes the next.
          Appellation in microbial form.
        </DataCard>
      </DataGrid>

      <Placeholder
        src="/journals/living-systems/aura-cow-eye.mp4"
        mediaType="video"
        poster="/journals/living-systems/aura-cow-eye.jpg"
        alt="Close on the eye of a Malnad Gidda — indigenous Karnataka breed"
        caption="52 Malnad Gidda · indigenous Karnataka breed"
      />

      <TwoCol id="living" heading="52 cattle. Native bees. 35,000 trees. One living system.">
        <p className="p1">
          The <Term tip="Indigenous Karnataka cattle breed adapted to the Western Ghats over centuries. Small, dark, hardy.">Malnad Gidda</Term> is an indigenous breed adapted
          to this altitude and soil. Their dung and urine feed the
          biodynamic preparations (<Term tip="Rudolf Steiner's biodynamic preparations — eight numbered field and compost sprays applied at precise lunar and seasonal timings.">BD 500–508</Term>) applied at precise
          lunar and seasonal timings. Steiner&rsquo;s methods — adopted
          over the past 12–16 months alongside Vedic practices — guide
          every soil intervention.
        </p>
        <p className="p2">
          Bee activity is read as a predictive signal: when colonies
          drop during flowering, it forecasts lower cherry set 4–6 weeks
          ahead. The nursery programme actively reintroduces native
          species. Orchid restoration is a stated long-term goal. A
          children&rsquo;s garden and donated library sit within the
          estate grounds.
        </p>
      </TwoCol>

      <DataGrid cols={3} standalone>
        <DataCard
          img="/journals/living-systems/aura-cow.jpg"
          alt="Malnad Gidda grazing through the coffee blocks"
          value="43 cattle, in rotation."
        >
          Their movement through the coffee IS the rotation. Their dung
          is the input.
        </DataCard>
        <DataCard
          video="/journals/biodynamic/aura-bee-video.mp4"
          poster="/journals/biodynamic/aura-biodynamic.jpg"
          alt="Native bee colonies working pepper and citrus flowers"
          value="The bees."
        >
          Native colonies in the pepper and the citrus. Pollination
          windows open and close with the rain.
        </DataCard>
        <DataCard
          img="/journals/living-systems/aura-canopy.jpg"
          alt="The twelve-acre native canopy nursery propagating threatened species"
          value="The nursery."
        >
          12 acres of native species under propagation. The canopy we
          plant today is the forest of the next century.
        </DataCard>
      </DataGrid>

      <Placeholder
        src="/aura-people.mp4"
        mediaType="video"
        poster="/journals/coffee/aura-coffee-grading.jpg"
        alt="Pickers and processors at harvest — the hands of the estate"
        caption="The hands of the estate · harvest"
      />

      <PullQuote>
        Grow STRUCTURES around the LANDSCAPE, not THROUGH it. Formless form. What we BUILD should be INVISIBLE in 30 YEARS.
      </PullQuote>

      {/* Architect's brief — inline section so the heading + intro
          can centre-align while the 9-card grid spans the full
          section-w rail. (OneCol would have capped the whole block
          at 760 px left-aligned.) Composed from the standard kit
          globals — `.section-w`, `h2`, `.p1`, `DataGrid`, `DataCard`,
          `Reveal` — no new component. */}
      <section id="brief" style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
              <h2 style={{ marginTop: 0, marginBottom: 'var(--space-4)' }}>
                What the land offers a builder.
              </h2>
              <p className="p1" style={{ margin: 0 }}>
                Read this before the visit. It frames the questions
                worth asking on the walk.
              </p>
            </div>
          </Reveal>
          <DataGrid cols={3}>
            <DataCard value="Three elevation bands.">
              Upper ridge (mist forest), mid-slope (primary coffee),
              lower terraces (water channels).
            </DataCard>
            <DataCard value="Water.">
              East–west natural channels. 3,000 mm rainfall is an
              underused resource — Phase 1 priority: natural
              reservoirs and restored stream corridors.
            </DataCard>
            <DataCard value="Canopy 15–25 m.">
              35,000 individual trees. Botanical mapping of height
              and canopy size in progress.
            </DataCard>
            <DataCard value="Existing structures.">
              Main farmhouse, worker quarters, drying beds,
              processing shed, cattle barn. Colonial-era — optimised
              for extraction, not experience.
            </DataCard>
            <DataCard value="Rocky outcrops.">
              Southern ridge — suitable as anchor points for
              cantilevered structures. Laterite over granite:
              excellent drainage.
            </DataCard>
            <DataCard value="Prevailing wind.">
              Southwest (monsoon, June–September); northeast
              (winter, November–February). Strong exposure on the
              upper ridge.
            </DataCard>
            <DataCard value="Soil.">
              Red laterite, pH 6.0–6.5. Alive with mycorrhizal
              networks. No chemical inputs for 12–16 months.
            </DataCard>
            <DataCard value="Protected forest.">
              20 acres on the eastern boundary — adjacent to Bhadra
              Reserve buffer. Wildlife corridor to preserve and
              extend.
            </DataCard>
            <DataCard value="Access.">
              Main road entry from the south. Internal track network.
              No heavy machinery in the upper blocks.
            </DataCard>
          </DataGrid>
        </div>
      </section>

      <OneCol id="pillars" heading="What we are building toward.">
        <p className="p1">
          A colonial-era plantation — optimised for extraction — being
          rebuilt as a living system that grows its structures around
          the landscape, not through it. The goal is <em>Ṛta</em>:
          total alignment with the environment. Subtle interventions.
          Spaces that enhance natural beauty rather than announce human
          presence.
        </p>
        <DataGrid cols={3}>
          <DataCard value="01 — Biodynamic plantation ecosystem.">
            52 Malnad Gidda cattle, biodynamic composting, closed-loop
            nutrient cycle. Steiner + Vedic methods. One organism.
          </DataCard>
          <DataCard value="02 — Biodiversity &amp; native nursery.">
            Reintroduction of native species. Orchid restoration. Wild
            corridors. Honeybee restoration. 12-acre nursery.
          </DataCard>
          <DataCard value="03 — Built environment.">
            Artist residency, research laboratory, sanctuary spaces.
            Biophilic architecture — structures that integrate, not
            impose.
          </DataCard>
        </DataGrid>
        <p className="p2">
          <strong>Phase 1.</strong> Water reservoirs and a 5-acre
          biophilic pilot. Fix the hydrology first — improve water
          retention and everything else follows. The 5-acre pilot is
          the proof of concept for the master plan.
        </p>
        <p className="p2">
          <strong>Master planning.</strong> Define a core structural
          armature — a spine for the land — before developing floating
          scenario options. The armature is permanent; the scenarios
          are adaptive.
        </p>
      </OneCol>

      {/* Foot-of-page film — second YouTube. Same click-to-play
          pattern as the top walkthrough: sharp still + centred play
          pill swaps in the embed (autoplay=1) on click. Poster is
          YouTube's own maxres thumbnail so the frame matches the
          actual film content rather than a generic estate still. */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 'var(--radius-1)',
                overflow: 'hidden',
                background: '#000',
              }}
            >
              {filmPlaying ? (
                <iframe
                  title="Mudigere Estate — the film"
                  src="https://www.youtube-nocookie.com/embed/NA-qtu8JljA?autoplay=1&rel=0&modestbranding=1&playsinline=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }}
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.youtube.com/vi/NA-qtu8JljA/maxresdefault.jpg"
                    alt="Mudigere Estate — the film"
                    loading="lazy"
                    decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.18)',
                      pointerEvents: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFilmPlaying(true)}
                    aria-label="Play the estate film"
                    className="mud-walk__play"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 'clamp(72px, 9vw, 104px)',
                      height: 'clamp(72px, 9vw, 104px)',
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 255, 255, 0.85)',
                      background: 'rgba(0, 0, 0, 0.35)',
                      backdropFilter: 'blur(8px) saturate(1.1)',
                      WebkitBackdropFilter: 'blur(8px) saturate(1.1)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      transition:
                        'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden style={{ marginLeft: 4 }}>
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <p className="label" style={{ marginTop: 'var(--space-4)' }}>
              The film · Sampigelkhan Estate
            </p>
          </Reveal>
        </div>
      </section>

      <ScrollHighlight>
        {`The land sets the brief.
         The forest is the farm.
         Come and stand on it.`}
      </ScrollHighlight>

      <OneCol id="invite" heading="An invitation.">
        <p className="p1">
          Come stand on the land before drawing a single line. The land
          will tell you more than this page can.
        </p>
        <p className="p2">
          Three days is enough; a week is better. We can arrange the
          visit, the room, and the walk.{' '}
          <a href="mailto:hello@theaura.life?subject=Mudigere%20estate%20visit">hello@theaura.life</a>.
        </p>
        <p className="label" style={{ marginTop: 'var(--space-7)' }}>
          Aura · Sampigelkhan Estate · Mudigere · Private briefing
        </p>
      </OneCol>
    </>
  )
}
