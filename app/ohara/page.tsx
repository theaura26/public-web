'use client'

import { useEffect, useState } from 'react'
import {
  DataGrid,
  DataCard,
  PullQuote,
  ScrollHighlight,
  Continue,
  Term,
} from '@/components/article/Article'
import Reveal from '@/components/RevealOnScroll'
import { ParallaxBanner } from '@/components/ParallaxBanner'
import { WordmarkIntro } from '@/components/WordmarkIntro'
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudSun, CloudMoon } from '@phosphor-icons/react'

/* ═══════════════════════════════════════════════════════════════════
   OHARA — a single scrolling story, structured as the deliberate
   flip of /mudigere. Mudigere opens on land and fact (geology,
   acreage, the world's oldest Arabica region) and only arrives at
   people and philosophy in its final third. Ohara opens on essence —
   the valley, Asa (朝) and Niwa (庭), 豊かな暮らし — and closes on the
   practical shape of the next three years (Shu-Ha-Ri) and the
   sanctuary network. Land-first vs. spirit-first: the same kit,
   read in the opposite direction.

   Source: AURA – OHARA | Asa (朝)・Niwa (庭) (knowledge/Decks). The
   financial overview (§14) is investor material and is deliberately
   excluded from this public page.
═══════════════════════════════════════════════════════════════════ */

/* ── Live land data — same widget as /mudigere's LiveLandData,
   re-pointed at Ohara's coordinates. ── */
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

function OharaLandData() {
  const weather = useWeather(35.1200, 135.8300)
  const condition = weather ? (WEATHER_LABELS[weather.code] ?? 'Overcast') : null
  return (
    <div className="land-data">
      <div className="land-data__facts">
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <p className="label" style={{ marginBottom: 'var(--space-2)' }}>LOCATION</p>
          <p style={{ margin: 0, color: 'var(--text)' }}>Ohara, Kyoto Prefecture, Japan.</p>
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
          <div><p className="label">COORDINATES</p><p style={{ marginTop: 2, color: 'var(--text)' }}>35.1200&deg; N, 135.8300&deg; E</p></div>
          <div><p className="label">ALTITUDE</p><p style={{ marginTop: 2, color: 'var(--text)' }}>1,099 ft.</p></div>
          <div><p className="label">TEMP.</p><p style={{ marginTop: 2, color: 'var(--text)' }}>{weather ? `${weather.temp}°C now · 7–28°C` : '7–28°C'}</p></div>
          <div><p className="label">HUMIDITY</p><p style={{ marginTop: 2, color: 'var(--text)' }}>{weather ? `${weather.humidity}%` : '64%'}</p></div>
          <div><p className="label">WIND</p><p style={{ marginTop: 2, color: 'var(--text)' }}>{weather ? `${weather.wind} KM/H` : '14 KM/H'}</p></div>
          <div><p className="label">SEASON</p><p style={{ marginTop: 2, color: 'var(--text)' }}>Four, distinctly</p></div>
        </div>
      </div>

      <div className="land-data__map">
        <iframe
          title="Ohara — Kyoto Prefecture, Japan"
          src="https://maps.google.com/maps?q=35.1200,135.8300&t=h&z=13&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <style jsx>{`
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
          background: var(--bg-elev, #f4f4f4);
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

/* Heading-left / body-right block — identical to Mudigere's HeadingBlock. */
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

/* A standard prose movement — identical to Mudigere's Movement. */
function Movement({ id, heading, children }: { id?: string; heading: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">{children ? <HeadingBlock heading={heading}>{children}</HeadingBlock> : <h2 style={{ marginTop: 0, maxWidth: 760 }}>{heading}</h2>}</div>
    </section>
  )
}

export default function OharaPage() {
  return (
    <>
      <style jsx global>{`
        .layer-row {
          border-top: 1px solid var(--border);
          padding: clamp(12px, 1.8vh, 20px) 0;
        }
        .layer-row:last-child { border-bottom: 1px solid var(--border); }
        .layer-row__label { margin: 0 0 4px; }
        .layer-row__body { margin: 0; color: var(--text-body); }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(24px, 3vw, 48px);
          margin-top: clamp(24px, 4vh, 40px);
        }
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: 1fr 1fr; }
        }
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
        @media (prefers-reduced-motion: reduce) {
          .mud-cascade .stat-card {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ═══ 1 · OHARA — a white field; the wordmark writes itself in ═══ */}
      <WordmarkIntro
        src="/ohara/aura-ohara-wordmark.svg"
        caption="Ohara valley · north of Kyoto · Kyoto Prefecture, Japan"
        alt="Ohara"
      />

      {/* ═══ 2 · ARRIVAL ═══ — straight from the wordmark into the valley
          in motion: the ridge, the river, the weather, the gate. */}
      <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        <ParallaxBanner
          video="/ohara/videos/aura-header.mp4"
          poster="/ohara/images/aura-header.jpg"
          alt="The Ohara valley from the ridge — cedar slopes and the river below"
          caption="The valley, from the ridge"
        />
        <ParallaxBanner
          video="/ohara/videos/aura-river.mp4"
          poster="/ohara/images/aura-river.jpg"
          alt="The river running through the Ohara valley"
          caption="The river, through the valley"
        />
        <ParallaxBanner
          video="/ohara/videos/aura-weather.mp4"
          poster="/ohara/images/aura-weather.jpg"
          alt="Mist moving through the Ohara valley"
          caption="Weather, moving through"
        />
        <ParallaxBanner
          video="/ohara/videos/aura-gate.mp4"
          poster="/ohara/images/aura-gate.jpg"
          alt="The gate at Ohara — stone lanterns and a moss-lined path into the garden"
          caption="The gate, one stone at a time"
        />
      </div>

      {/* ═══ 3 · ESSENCE ═══ — Preface + Valley of Stillness + Essence
          of Aura, read as one opening movement. Where Mudigere opens
          on geology, Ohara opens on philosophy. */}
      <Movement heading={<>A valley that keeps its own time.</>}>
        <p className="p1">
          North of Kyoto, in the Ohara valley, Aura keeps a sanctuary — cedar
          forest, river, and temple; farmers who still work by hand, and
          artisans who keep rhythm over the clock. We restore before we build,
          and learn the land before we lead it.
        </p>
        <p className="p2">
          <Term tip="朝 — read chō in compounds like 朝食 (breakfast) and 朝食会 (a working breakfast); asa alone is the everyday word for morning.">Asa</Term> is
          light and renewal. <Term tip="庭 — read tei in compounds like 家庭 (household) and 校庭 (schoolyard); niwa alone is the everyday word for garden or yard.">Niwa</Term> is
          calm and reflection. Together they hold{' '}
          <Term tip="豊かな暮らし — 'a rich and mindful life.' The phrase the whole Ohara sanctuary is built to hold.">Yutaka na Kurashi</Term> — a
          rich and mindful life, and the work Aura came here to do: a valley
          made for attention, for craft taken up and tried by hand, and for
          coming back into contact with nature.
        </p>
      </Movement>

      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal><OharaLandData /></Reveal>
        </div>
      </section>

      {/* ═══ 4 · VISION / RESTORATION ═══ */}
      <Movement id="vision" heading={<>A seventy-year-old home, renewed by hand.</>}>
        <p className="p1">
          Aura begins with what already stands: a home of seventy years, and a
          garden thirty years in the making. The teahouse was restored by a
          Kyoto craftsman; its garden is tended now by his grandson.
        </p>
        <p className="p2">
          <Term tip="侘び寂び — beauty in the imperfect and the impermanent. The foundation Ohara is restored on, not designed around.">Wabi-sabi</Term> is
          the foundation: imperfection held as truth. Nothing here is remade in
          a hurry. Each repair is an act of care, made in turn to be cared for.
        </p>
      </Movement>

      <section style={{ padding: '0 0 var(--section-gap)' }}>
        <div className="section-w">
          <Reveal className="mud-cascade">
            <div className="stat-grid">
              {([
                ['Seventy years', 'The home — renovated, its timber and light carried forward.', 'interior'],
                ['Thirty years', 'The garden — three decades of tending, continued by hand.', 'moss'],
                ['One craftsman', 'The teahouse — restored in Kyoto, tended now by his grandson.', 'fountain'],
                ['Wabi-sabi', 'The foundation — imperfection as truth, continuity over completion.', 'winter2'],
              ] as const).map(([value, label, thumb]) => (
                <div key={value} className="stat-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/ohara/images/aura-${thumb}.jpg`} alt="" aria-hidden loading="lazy" decoding="async" className="stat-card__thumb" />
                  <div className="stat-card__text">
                    <p className="p1" style={{ margin: '0 0 8px' }}>{value}</p>
                    <div className="p2" style={{ color: 'var(--text-body)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        <ParallaxBanner
          image="/ohara/images/aura-moss.jpg"
          alt="Moss and fallen maple leaves on the restored roofline"
          caption="The restored roofline, kept aging"
        />
        <ParallaxBanner
          image="/ohara/images/aura-interior.jpg"
          alt="Inside the restored teahouse — the craftsman's repair"
          caption="Inside the teahouse"
        />
        <ParallaxBanner
          image="/ohara/images/aura-emblem.jpg"
          alt="A carved emblem kept from the original home"
          caption="A mark kept from the original"
        />
      </div>

      <Movement heading={<>What renewal actually looks like.</>}>
        <p className="p1">
          The old roof, re-laid tile by tile with the moss still on it. The
          garden&rsquo;s thirty years of undergrowth, thinned by hand until
          the paths surfaced on their own. This is the line Aura holds: a
          rebuild erases the evidence of time, and a renewal keeps it, then
          adds to it.
        </p>
      </Movement>

      <PullQuote>
        Ohara runs *slow* on purpose. *Attention* is what the place is built to make.
      </PullQuote>

      {/* ═══ 5 · RHYTHM OF LIFE ═══ */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <HeadingBlock heading={<>One rhythm, three rooms.</>}>
            <p className="p1">
              Ohara runs on rhythm. It moves in three registers
              across the day — morning light, evening calm, and the terrace
              between them — each with its own pace and its own work.
            </p>
            <p className="p2">
              The three are one valley, read at three different hours — the
              same ground doing different work as the light moves across it.
            </p>
          </HeadingBlock>
        </div>
      </section>

      <DataGrid cols={3} standalone tightTop>
        <DataCard value={<>Asa · 朝 <span className="label" style={{ display: 'block', marginTop: 4 }}>Morning – afternoon</span></>}>
          Light and renewal. Café, tea, and light meals from local
          ingredients; workshops in fermentation, pottery, indigo, and
          kintsugi.
        </DataCard>
        <DataCard value={<>Niwa · 庭 <span className="label" style={{ display: 'block', marginTop: 4 }}>Evening – night</span></>}>
          Calm and reflection. Farm-to-table dinner from the greenhouse and
          the valley's organic growers; wellbeing held at the day's slow
          close.
        </DataCard>
        <DataCard value={<>Terrace · 風の間 <span className="label" style={{ display: 'block', marginTop: 4 }}>Anytime</span></>}>
          Connection. Retail, weddings, and gatherings — the room that holds
          Asa and Niwa together, open whenever the valley calls for it.
        </DataCard>
      </DataGrid>

      {/* ═══ 6 · ASA — the morning ═══ */}
      <Movement id="asa" heading={<>The morning is for making.</>}>
        <p className="p1">
          Matcha, coffee, and light meals from local ingredients, served nine
          to sixteen. The morning is unhurried by design — a counter to lean
          on, and time to make something by hand.
        </p>
        <p className="p2">
          Workshops run alongside it: fermentation, pottery, indigo dyeing,
          and{' '}
          <Term tip="金継ぎ — the Japanese craft of repairing broken pottery with lacquer dusted in gold, making the repair itself the beautiful part.">kintsugi</Term>. Ohara
          is made for this — a place to take up a craft, get it wrong, and try
          again, where care applied by hand is its own kind of rigour.
        </p>
      </Movement>

      <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        <ParallaxBanner
          image="/ohara/images/aura-matcha.jpg"
          alt="Matcha whisked at the morning counter"
          caption="The morning counter"
        />
        <ParallaxBanner
          video="/ohara/videos/aura-indigo.mp4"
          poster="/ohara/images/aura-indigo.jpg"
          alt="Indigo-dyed cloth lifted from the vat to oxidise"
          caption="Indigo, taking colour from the air"
        />
      </div>

      {/* ═══ 7 · NIWA — the evening ═══ */}
      <Movement id="niwa" heading={<>The table the valley sets.</>}>
        <p className="p1">
          Sixteen seats, Friday through Sunday. Dinner is built from
          Ohara&rsquo;s own organic produce and the valley&rsquo;s growers,
          paired with local sake and tea — its roots in{' '}
          <Term tip="お番菜 — home-style Kyoto cooking built from what the season and the local market provide, rather than a fixed menu.">Kyoto obanzai</Term>,
          the everyday, seasonal cooking of the city just south. Nothing is
          flown in to finish a dish; the plate is written around what arrived.
        </p>
        <p className="p2">
          What the season gives in excess, the kitchen ferments — miso, koji,
          pickles, sake. Fermentation is old craft kept as daily practice: it
          carries a summer harvest into winter, and it slows the way people eat
          here until, over years, that becomes the way they live.
        </p>
      </Movement>

      <Movement heading={<>Some of the menu is found in the valley.</>}>
        <p className="p1">
          A handful of wild strawberries, gathered on the walk between the
          workshop and the kitchen, count as much as anything in the
          greenhouse. The kitchen keeps both categories on the same board —
          grown and gathered — because the valley doesn&rsquo;t distinguish
          between them, and neither should the plate.
        </p>
      </Movement>

      <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        <ParallaxBanner
          image="/ohara/images/aura-organic.jpg"
          alt="Organic produce gathered from the valley and greenhouse"
          caption="Foraged and grown"
        />
        <ParallaxBanner
          image="/ohara/images/aura-bento.jpg"
          alt="An obanzai plate built from the valley's produce"
          caption="Written around what arrived"
        />
        <ParallaxBanner
          image="/ohara/images/aura-farm.jpg"
          alt="The kitchen garden and terraced fields that feed the table"
          caption="The fields that feed the table"
        />
      </div>

      {/* ═══ 8 · KI NO IE, RETAIL, WELLBEING ═══ — the spaces and
          rhythms that hold Asa and Niwa together. Denser movement,
          mirroring how Mudigere's People & Vision folds residency,
          community, and phase-one into a single beat. */}
      <Movement id="ki-no-ie" heading={<>季の家 — a pavilion by the river.</>}>
        <p className="p1">
          <Term tip="季の家 — literally 'house of the seasons.' 季 (ki) is the character used for season-marking words like 季節 (kisetsu, the four seasons themselves).">Ki no Ie</Term>,
          the house of seasons, is a transparent pavilion by the river — light
          and air always in motion, built from reclaimed cedar and grown in by
          vines and herbs. It is a room built for makers: craft and
          fermentation workshops by day, seasonal dinners under the same open
          frame by night, and the quiet a resident artist needs to work a
          season through.
        </p>
        <p className="p2">
          The retail counter carries living objects from Ohara's artisans —
          ceramics, linen, wood, incense, tea — each piece carrying the
          maker&rsquo;s name and the season it was made. Its terrace is the same{' '}
          <Term tip="風の間 — 'room of the wind.' The open terrace introduced earlier in the Rhythm of Life grid; this is where it physically sits, off Ki no Ie.">風の間</Term> from
          the rhythm grid above — micro-weddings, family gatherings, poetry
          nights, seen now from where it actually stands.
        </p>
      </Movement>

      <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        <ParallaxBanner
          video="/ohara/videos/aura-flower.mp4"
          poster="/ohara/images/aura-flower.jpg"
          alt="Flowers and herbs growing in around the pavilion"
          caption="Grown in by vines and herbs"
        />
        <ParallaxBanner
          image="/ohara/images/aura-inside.jpg"
          alt="Reclaimed cedar joinery inside the pavilion"
          caption="Reclaimed cedar, unpainted"
        />
        <ParallaxBanner
          image="/ohara/images/aura-fountain.jpg"
          alt="A stone water basin beside the pavilion"
          caption="Stillness, kept by running water"
          crop
          ratio="2 / 1"
          objectPosition="center 68%"
        />
      </div>

      <DataGrid cols={3} standalone rule>
        <DataCard value="One weaver, one thread.">
          The valley&rsquo;s textile atelier still dyes with what grows in it
          — persimmon, indigo, walnut hull. A single scarf can hold
          three seasons&rsquo; worth of gathering before it&rsquo;s finished.
        </DataCard>
        <DataCard value="Everything on the table grew nearby.">
          The kitchen cooks what the valley gives that week — shiso, pickled
          plum, mountain vegetables gathered that morning. The menu is written
          by the season, and never the other way round.
        </DataCard>
        <DataCard value="Some weeks, nothing is scheduled.">
          Rest Weeks hold the valley open for artists and founders in residence
          — people who need the place more than an agenda. No workshop, no
          dinner seating, no counter to staff. Just the rhythm, run without an
          audience.
        </DataCard>
      </DataGrid>

      {/* ═══ 9 · ABOUT AURA ═══ — the brand promise, as a stanza,
          mirroring Mudigere's forest-mark artwork moment. */}
      <ScrollHighlight>{`Mind. Design that stays out of the way.
Body. A place built to coexist with nature.
Soul. A rhythm felt before it is seen.
Aura builds one living system — design, nature, and human rhythm, together.`}</ScrollHighlight>

      <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
        <ParallaxBanner
          video="/ohara/videos/aura-autumn.mp4"
          poster="/ohara/images/aura-autumn.jpg"
          alt="Autumn maple over the moss-grown eaves at Ohara"
          caption="The garden, in autumn"
        />
        <ParallaxBanner
          image="/ohara/images/aura-autumnleaves.jpg"
          alt="Fallen autumn leaves across the moss at Ohara"
          caption="Autumn, come to the ground"
        />
        <ParallaxBanner
          video="/ohara/videos/aura-winter1.mp4"
          poster="/ohara/images/aura-winter1.jpg"
          alt="The same corner of the garden under snow"
          caption="The same corner, in winter"
        />
        <ParallaxBanner
          image="/ohara/images/aura-winter2.jpg"
          alt="Snow settled on the garden's stone and moss"
          caption="Snow on stone and moss"
        />
        <ParallaxBanner
          video="/ohara/videos/aura-winter3.mp4"
          poster="/ohara/images/aura-winter3.jpg"
          alt="Snow falling through the bare maple at Ohara"
          caption="Snow through the bare maple"
        />
      </div>

      {/* ═══ 10 · SHU – HA – RI ═══ — the practical shape of the next
          three years, closing on fact the way Mudigere closes on
          spirit: the flip completed. */}
      <Movement id="shu-ha-ri" heading={<>Shu, Ha, Ri — the shape of what comes next.</>}>
        <p className="p1">
          <Term tip="守破離 — a martial-arts and craft principle: first preserve the form exactly, then adapt it, then move beyond needing it as a form at all. Aura reads that third stage as integration — the practice fully absorbed into how the place runs.">Shu-Ha-Ri</Term> —
          preserve, adapt, integrate — is the discipline Aura applies
          everywhere it works. Here it reads as a timeline: the next three
          years at Ohara, in order.
        </p>
      </Movement>

      <section style={{ padding: '0 0 var(--section-gap)' }}>
        <div className="section-w">
          <Reveal className="mud-cascade">
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              {([
                ['守 Shu', '2025 — Preserve. Restore the teahouse and the garden.'],
                ['破 Ha', '2026 — Adapt. Open Asa and Niwa; launch the first events.'],
                ['離 Ri', '2027 — Integrate. The full ecosystem active; the first Kurashi Week.'],
              ] as const).map(([value, label]) => (
                <div key={value} className="stat-card" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div className="stat-card__text">
                    <p className="p1" style={{ margin: '0 0 8px' }}>{value}</p>
                    <div className="p2" style={{ color: 'var(--text-body)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 11 · END ═══ */}
      <ScrollHighlight>{`Asa is the light. Niwa is the calm.
The terrace is the breath between them.
Together they form the rhythm of Ohara —
a place to return to, and to hand on.`}</ScrollHighlight>

      <Continue
        items={[
          { href: '/artistry', label: 'Artistry', description: 'The studio and labs — making by subtraction, shu-ha-ri at the bench.', img: '/aura-artistry.jpg' },
          { href: '/reason', label: 'The Reason', description: 'Why Aura exists — not built but grown, the belief that ties every estate and studio into one system.', img: '/the-reason/aura-flowers-1.png' },
          { href: '/residency', label: 'Monastic Polymaths', description: 'The residency — makers who live the seasons and work across disciplines, the way a monastery once did.', img: '/journals/residency/aura-monastic-polymath.jpg' },
        ]}
      />
    </>
  )
}
