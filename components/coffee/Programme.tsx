'use client'

/* ── The three days ───────────────────────────────────────────────
   What to expect, day by day.

   This used to be a three-column table with each day running morning /
   afternoon / evening down its own column. It read well across, and
   badly down: three columns of prose forced every entry to be the same
   length whether it had that much to say or not, and a day is not
   actually three equal thirds. The morning of day two is most of day
   two.

   So it is a list now. Each day carries a pair — the mode a guest is in,
   and the thing that mode is for — and then the specific moments
   underneath it, at whatever length each one honestly needs. Nothing is
   padded to fill a cell.

   The times of day are gone as icons; where a time matters it is in the
   sentence, which is where a reader looks for it anyway.
*/

type Day = {
  n: string
  /** The mode, and what the mode is for. */
  title: string
  items: string[]
}

const DAYS: Day[] = [
  {
    n: 'Day one',
    title: 'Arrival / Altitude',
    items: [
      'Four hours up from Bengaluru, and somewhere in the last one the canopy shuts over the road and the temperature drops six degrees.',
      'You walk the estate before a single person explains it — a hundred and fifty acres, four storeys of canopy, and more going on overhead than you will manage to name.',
      'Nobody owns a mountain. You arrive as its guest, which is the only way anyone arrives here.',
      'The first long-table dinner, cooked from the estate and eaten outside. Almost everything on the table grew within sight of where you are sitting.',
    ],
  },
  {
    n: 'Day two',
    title: 'Practice / Ground',
    items: [
      'A hike before the light, up through all four layers to where the shade thins out.',
      'Down to the wet mill at five, before the pickers come in, to watch a fermentation being read — and to take the Brix yourself.',
      'Biodynamic agriculture from the people who actually practise it: the horn buried through winter, the fourteen compost pits, the quartz that goes in at midsummer. You bury one with your own hands.',
      'The herd, all fifty-two Malnad Gidda, and they will meet you back.',
      'The long table again, later and louder than the first one.',
    ],
  },
  {
    n: 'Day three',
    title: 'Judgement / Authorship',
    items: [
      'Back to the mill for whatever came off the tanks overnight, and the fermentation numbers that made the call while you were asleep.',
      'Cup the lots blind against last season. Nobody says which is which until everyone has committed out loud, and everyone is wrong at least once. It is the best hour of the three days.',
      'Pick a lot and set its protocol — varietal, ferment, drying, all of it.',
      'Then down through the Ghats. We build that exact coffee and send it to you under your own name, about four months later.',
    ],
  },
]

export function Programme() {
  return (
    <section className="pg">
      <div className="section-w">
        <h2 className="pg-h">What to expect across three days</h2>

        <ol className="pg-days">
          {DAYS.map((d) => (
            <li className="pg-day" key={d.n}>
              <div className="pg-head">
                <span className="pg-n">{d.n}</span>
                <h3 className="pg-dt">{d.title}</h3>
              </div>
              <ul className="pg-items">
                {d.items.map((line) => (
                  <li className="pg-b" key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <style jsx>{`
        .pg {
          background: #000; color: #fff;
          padding: 0 0 clamp(96px, 15vh, 176px);
        }

        .pg-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(24px, 3vw, 32px); line-height: 1.15;
          letter-spacing: -0.03em; color: #fff;
          margin: 0 0 clamp(40px, 6vh, 72px);
        }

        .pg-days {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column;
          gap: clamp(44px, 6vh, 76px);
        }

        /* Day label and theme on the left, the day itself on the right —
           the same two-column reading the journal kit uses, so the
           festival page does not invent a layout of its own. */
        .pg-day {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          gap: clamp(24px, 4vw, 64px);
          padding-top: clamp(22px, 3vh, 34px);
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }
        @media (max-width: 768px) {
          .pg-day { grid-template-columns: minmax(0, 1fr); gap: 18px; }
        }

        .pg-n {
          display: block;
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45); margin-bottom: 10px;
        }
        .pg-dt {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(24px, 3vw, 32px); line-height: 1.15;
          letter-spacing: -0.03em; color: #fff; margin: 0;
          text-wrap: balance;
        }

        .pg-items {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column;
          gap: clamp(14px, 1.8vh, 20px);
        }
        /* A rule per item rather than a bullet glyph: the list is a
           sequence of moments, and a hairline separates them without
           adding a mark the rest of the site never uses. */
        .pg-b {
          position: relative;
          font-family: var(--font-sans);
          font-size: 16px; line-height: 1.55;
          color: rgba(255, 255, 255, 0.78);
          margin: 0; text-wrap: pretty;
          padding-left: 22px;
        }
        .pg-b::before {
          content: '';
          position: absolute;
          left: 0; top: 0.7em;
          width: 10px; height: 1px;
          background: var(--brand-accent);
        }
      `}</style>
    </section>
  )
}
