'use client'

import Sparkline from './Sparkline'
import MoonDisc from './MoonDisc'
import SourceNote from './SourceNote'
import type { Today } from '@/lib/aura-live/today'
import { rainCaption } from '@/lib/aura-live/conditions'

/* The land, today.
 *
 * Sits across the seam between the hero and the feed: the black above is
 * the name of the place, the white below is what has already happened,
 * and this is the conditions it happened in.
 *
 * Two readings lead, and the pair is the point: the sky's water and the
 * sky's rhythm, which are the two things a biodynamic estate in a
 * monsoon organises itself around. They are also the only two that carry
 * a picture — one chart and one disc on the whole page.
 *
 * Three more readings sit underneath them — ground water, soil
 * temperature, leaf wetness — and they are the better agronomy of the
 * five. What made the row read as a control panel was not their presence
 * but their charts: five trend lines in a row is instrumentation. With
 * the sparklines gone they are three plain numbers at two thirds the
 * weight, which is what a supporting reading should be.
 *
 * It is also the reading Aura measures itself, in a gauge whose unit is
 * not yet confirmed. When it is, the estate's own figure replaces the
 * modelled one here and the tile stops being borrowed.
 *
 * The deltas are deliberately colourless. On a commerce dashboard red
 * and green are honest: more sales is better. On a farm they are a lie
 * dressed as a convention — rain down ten per cent in August is not bad
 * news, soil moisture up is not good news. So a delta shows direction
 * and size and leaves the meaning to the reader, who knows the land
 * better than the page does.
 */

export default function TodayCard({ today }: { today: Today }) {
  const { dateLabel, conditions, moon } = today

  const rainDelta = conditions && conditions.rain.prev7mm > 0
    ? ((conditions.rain.last7mm - conditions.rain.prev7mm) / conditions.rain.prev7mm) * 100
    : null
  const moistureDelta = conditions?.soilMoisture.weekAgo != null
    ? (conditions.soilMoisture.latest - conditions.soilMoisture.weekAgo) * 100
    : null
  const tempDelta = conditions?.soilTemp.weekAgo != null
    ? conditions.soilTemp.latest - conditions.soilTemp.weekAgo
    : null

  return (
    <section className="today" aria-label="The land today">
      {/* One line, not two. The subject and the day are the same
          statement and were never worth a row each.
          The source rides on the end of it. Four of these five readings
          are modelled several kilometres away, and a page called proof of
          the land cannot show them with no word about where they came
          from. An earlier draft read "open data, 4.3 km off-estate" and
          was too clever by half — a reader had to work out what it meant,
          which is the same as it not being there. This says it in plain
          words. If even this is too much, the honest fix is to drop the
          readings rather than the attribution: AURA_LIVE_CONDITIONS=0
          leaves the moon, which is computed here and needs no source. */}
      <div className="rail">
        <div className="track">
          <div className="band">
        {/* The moon renders whether or not the weather does — it needs
            no network — so it sits outside the conditions guard below and
            is placed by order rather than by nesting. */}
        {conditions && (
          <>
            <div className="tile lead">
              <p className="label cap">
                Rain this monsoon
                <SourceNote>
                  Rain, ground water, soil temperature and leaf wetness are not measured on the
                  estate. They come from a public weather service that models a point about{' '}
                  {Math.round(conditions.grid.offsetKm)} km away — the weather over Mudigere rather
                  than the weather in Block 3. The moon is worked out here from today’s date. What
                  Aura measured itself is the feed below.
                </SourceNote>
              </p>
              <p className="figure">
                <span className="big">
                  {Math.round(conditions.rain.seasonMm).toLocaleString('en-GB')}
                  <span className="unit">mm</span>
                </span>
                <Delta value={rainDelta} format={(v) => `${Math.abs(v).toFixed(0)}%`} />
              </p>
              <Sparkline
                series={conditions.rain.series}
                shape="bars"
                  caption={rainCaption(conditions.rain)}
                formatPoint={(p) => {
                  const [, m, d] = p.day.split('-')
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  return `${Number(d)} ${months[Number(m) - 1]} · ${p.value.toFixed(1)} mm`
                }}
              />
            </div>

        <div className="tile">
          <p className="label cap">Moon</p>
          <div className="moonrow">
            <MoonDisc phase={moon.phase} />
            {/* "91%" alone is a number nobody can place — of what? The
                unit has to carry the noun. */}
            <p className="big small">
              {(moon.illumination * 100).toFixed(0)}<span className="unit">% lit</span>
            </p>
          </div>
          <p className="note">{moon.phaseName}, day {moon.age.toFixed(0)} of the lunation</p>
        </div>

            <div className="tile">
              <p className="label cap">Ground water</p>
              <p className="figure">
                <span className="big">
                  {(conditions.soilMoisture.latest * 100).toFixed(1)}<span className="unit">%</span>
                </span>
                <Delta value={moistureDelta} format={(v) => `${Math.abs(v).toFixed(1)} pt`} />
              </p>
              <p className="note">of the soil, by volume, at 3–9 cm</p>
            </div>

            <div className="tile">
              <p className="label cap">Soil at 6 cm</p>
              <p className="figure">
                <span className="big">
                  {conditions.soilTemp.latest.toFixed(1)}<span className="unit">°C</span>
                </span>
                <Delta value={tempDelta} format={(v) => `${Math.abs(v).toFixed(1)}°`} />
              </p>
              <p className="note">
                {conditions.soilTemp.latest >= 15
                  ? 'warm enough for the soil life to be working'
                  : 'cool — soil life slows below 15°'}
              </p>
            </div>

            {conditions.leafWetness && (
              <div className="tile">
                <p className="label cap">Leaf wetness</p>
                <p className="figure">
                  <span className="big">
                    {conditions.leafWetness.hours}<span className="unit">h</span>
                  </span>
                </p>
                <p className="note">
                  of the last 24 the leaves have been wet.{' '}
                  {conditions.leafWetness.infectionRisk
                    ? 'Long enough for rust and black rot to take.'
                    : 'Short of what rust and black rot need.'}
                </p>
              </div>
            )}
          </>
        )}

          </div>
        </div>
      </div>

      <style jsx>{`
        /* No panel. The container held five readings inside one dark
           rectangle and made them look like a dashboard’s worth of
           instrumentation; free-standing cards on the page’s own ground
           read as five separate things, which is what they are. Same
           move the store makes with its lanes. */
        /* Flush to the page: no inset on the left, and tight under the
           hero. The row is the first thing after the black, so anything
           between them reads as a gap rather than as air. */
        .today {
          display: block;
          padding-top: var(--space-7);
        }

        .source { color: rgba(255, 255, 255, 0.3); }

        /* Full bleed out of the page rail, so the row runs to the
           screen edge and past it. The technique is the store’s: a
           100vw rail with no clipping ancestor, a track that scrolls,
           and left padding that lands the first card exactly on the
           page’s own margin. */
        .rail {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
        }

        .track {
          overflow-x: auto;
          overflow-y: hidden;
          overscroll-behavior-x: contain;
          /* No scroll-snap: snapping drags the first card off the rail
             the moment a reader nudges the track. */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .track::-webkit-scrollbar { display: none; }

        .band {
          display: flex;
          gap: var(--space-5);
          width: max-content;
          /* The first card lands on the page rail — the same x as the
             title above it and every heading below — and the row still
             runs off the right, which is the cue that it scrolls. */
          padding-left: max(var(--gutter), calc(50vw - var(--max-w) / 2 + var(--gutter)));
          padding-right: var(--gutter);
        }

        /* The store fades its lane edge because its cards are
           photographs and a white wash reads as depth over them. These
           cards are dark on a white page, so the same wash bleaches them
           and reads as a rendering fault. The cut edge says "more" on
           its own. */

        /* Each reading is its own card now — its own ground, its own
           edge — rather than a column inside somebody else’s rectangle. */
        .tile {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          flex: 0 0 auto;
          width: 248px;
          padding: var(--space-6);
          background: #16191b;
          color: #fff;
          border-radius: var(--radius-1);
        }
        /* The one carrying a chart needs the room to draw it — three
           weeks of daily bars at 344px put each day under 10px, which
           is a texture rather than a reading. */
        /* The rain card is the lead and carries a chart, so it takes a
           fifth more width than the readings beside it. */
        .lead { width: 552px; }
        .cap {
          margin: 0;
          color: rgba(255, 255, 255, 0.45);
          display: flex;
          align-items: center;
        }

        /* The reading and its week-on-week change belong on one line:
           the delta qualifies the number, and stacked underneath it read
           as two separate facts. Baseline-aligned, so the pill sits on
           the figure’s own line rather than floating beside it. */
        .figure {
          margin: 0;
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        /* One height for the figure row across every card, so the line
           underneath starts at the same place on all of them. The moon’s
           disc is 44px and a line of type is 37, which was quietly
           dropping that card’s note seven pixels below its neighbours'. */
        .figure, .moonrow { min-height: 44px; }

        /* The site's h3 role — clamp(24, 3vw, 32), -0.03em — rather than
           a display size invented for this card. A reading is a
           sub-heading, not a headline. */
        .big {
          display: inline-block;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 500;
          font-size: clamp(24px, 3vw, 32px);
          line-height: 1.15;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .big.small { font-size: clamp(24px, 3vw, 32px); }

        /* The unit rides small and high off the figure, so the number is
           what the eye lands on. */
        .unit {
          font-size: 0.42em;
          font-weight: 400;
          letter-spacing: 0;
          vertical-align: 0.9em;
          margin-left: 0.12em;
          color: rgba(255, 255, 255, 0.55);
        }

        .note {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.42);
          max-width: 42ch;
        }

        .moonrow { display: flex; align-items: center; gap: var(--space-5); }
        .figure { align-content: center; }

        @media (max-width: 768px) {
          .band { gap: var(--space-4); }
          .tile { width: min(72vw, 240px); padding: var(--space-5); }
          .lead { width: min(88vw, 360px); }
        }
      `}</style>
    </section>
  )
}

/* Direction and size, and no opinion about whether it is good news. */
function Delta({ value, format }: { value: number | null; format: (v: number) => string }) {
  if (value == null || !Number.isFinite(value)) return null
  const flat = Math.abs(value) < 0.05
  return (
    /* A span, not a p: this sits inside the figure's own <p>, and a
       nested <p> is invalid HTML — the browser closes the outer one
       early, so the server markup and the client tree disagree and
       hydration fails for the whole page. */
    <span className="delta label">
      <span aria-hidden="true">{flat ? '–' : value > 0 ? '↑' : '↓'}</span>
      {flat ? 'level' : format(value)}
      <style jsx>{`
        .delta {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          margin: 0;
          /* The figure aligns baselines, which leaves the pill's own
             descent and bottom padding hanging below the number. Lift it
             by exactly that, so the pill's bottom edge sits on the
             number's baseline. A transform, so nothing reflows. */
          transform: translateY(calc(-1px - 0.46em));
          padding: 3px 8px;
          width: fit-content;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </span>
  )
}
