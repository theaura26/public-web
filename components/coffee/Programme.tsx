'use client'

import { SunHorizon, Sun, MoonStars } from '@phosphor-icons/react'

/* ── The three days ───────────────────────────────────────────────
   One table, three columns, read left to right. Each day has a theme
   and then runs morning, afternoon, evening down the column, so it
   works either way — across a time of day, or down a single day.

   Built on subgrid rather than a <table>: the three day columns share
   one set of row tracks, so morning lines up with morning across all
   three — and under 900px, where three columns of prose stop being
   readable, each day simply becomes its own block, heading and all.
   A collapsing <table> would have had to drop its own headers to do
   that.

   The time of day is an icon rather than a word. The word is still in
   the DOM, hidden, so screen readers and agent view get it — see the
   .pg-time rules here and the agent block in globals.css.
*/

const TIMES = [
  { name: 'Morning', Icon: SunHorizon },
  { name: 'Afternoon', Icon: Sun },
  { name: 'Evening', Icon: MoonStars },
] as const

type Day = { n: string; title: string; slots: string[] }

const DAYS: Day[] = [
  {
    n: 'Day one',
    title: 'Guests of the Mountain',
    slots: [
      'Four hours up from Bengaluru, and somewhere in the last one the canopy shuts over the road and the temperature drops six degrees. Nobody owns a mountain. You arrive as its guest, which is the only way anyone arrives here.',
      'Walk the estate before a single person explains it. A hundred and fifty acres, four storeys of canopy, and more going on overhead than you will manage to name — this is where you meet the biodiversity rather than read about it.',
      'The first long-table dinner, cooked from the estate and eaten outside. Almost everything on the table grew within sight of where you are sitting.',
    ],
  },
  {
    n: 'Day two',
    title: 'Hands in the ground',
    slots: [
      'A hike before the light, up through all four layers to where the shade thins out. Then down to the wet mill at five, before the pickers come in, to watch a fermentation being read — and to take the Brix yourself.',
      'Biodynamic agriculture from the people who actually practise it: the horn buried through winter, the fourteen compost pits, the quartz that goes in at midsummer. You will bury one with your own hands.',
      'Meet the herd — all fifty-two Malnad Gidda, and they will meet you back. Then the long table again, later and louder than the first one.',
    ],
  },
  {
    n: 'Day three',
    title: 'A lot of your own',
    slots: [
      'Back to the mill for whatever came off the tanks overnight, and the fermentation numbers that made the call while you were asleep.',
      'Cup the lots blind against last season. Nobody says which is which until everyone has committed out loud, and everyone is wrong at least once. It is the best hour of the three days.',
      'Pick a lot and set its protocol — varietal, ferment, drying, all of it. Then down through the Ghats. We build that exact coffee and send it to you under your own name, about four months later.',
    ],
  },
]

export function Programme() {
  return (
    <section className="pg">
      <div className="section-w">
        <div className="pg-t">
          {DAYS.map((d) => (
            <div className="pg-day" key={d.n}>
              <div className="pg-head">
                <span className="pg-n">{d.n}</span>
                <h3 className="pg-dt">{d.title}</h3>
              </div>
              {TIMES.map(({ name, Icon }, i) => (
                <div className="pg-cell" key={name}>
                  <span className="pg-time">
                    <Icon size={22} weight="light" aria-hidden />
                    <span className="pg-time-t">{name}</span>
                  </span>
                  <p className="pg-b">{d.slots[i]}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* No heading and no rule of its own — the handwritten line above
           is the heading, and the table reads straight on from it. */
        .pg {
          background: #000; color: #fff;
          padding: 0 0 clamp(96px, 15vh, 176px);
        }

        /* One table: four shared row tracks — the head, then the three
           times of day — with each column subscribing to them. */
        .pg-t {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto repeat(3, auto);
          column-gap: clamp(32px, 5vw, 88px);
        }
        .pg-day {
          display: grid;
          grid-row: span 4;
          grid-template-rows: subgrid;
        }

        .pg-head { padding-bottom: clamp(20px, 3vh, 30px); }
        .pg-n {
          display: block;
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1.4px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45); margin-bottom: 10px;
        }
        .pg-dt {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(22px, 2.4vw, 34px); line-height: 1.1;
          letter-spacing: -0.03em; color: #fff; margin: 0;
        }
        .pg-cell {
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          padding: clamp(22px, 3vh, 34px) 0;
        }
        .pg-cell:last-child { border-bottom: 1px solid rgba(255, 255, 255, 0.14); }

        .pg-time {
          display: block; color: var(--brand-accent);
          line-height: 0; margin-bottom: 14px;
        }
        /* The word stays in the document for anything that cannot see an
           icon — screen readers, and agent view, which unhides it. */
        .pg-time-t {
          position: absolute; width: 1px; height: 1px;
          overflow: hidden; white-space: nowrap;
          clip-path: inset(50%);
        }
        .pg-b {
          font-size: clamp(14px, 1.15vw, 16px); line-height: 1.6;
          color: rgba(255, 255, 255, 0.78); margin: 0; text-wrap: pretty;
        }

        /* Three columns of prose stop being readable well before phone
           width. Each day becomes its own block, heading and all. */
        @media (max-width: 900px) {
          .pg-t { grid-template-columns: 1fr; grid-template-rows: none; }
          .pg-day {
            grid-row: auto; grid-template-rows: none;
            padding-bottom: clamp(40px, 6vh, 64px);
          }
          .pg-day:last-child { padding-bottom: 0; }
        }
      `}</style>
    </section>
  )
}
