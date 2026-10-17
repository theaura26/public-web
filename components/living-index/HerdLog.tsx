 'use client'
import { useLivingIndex } from './LivingIndexProvider'
import { amount, byWeek, dayMonth, lastDays, sum } from '@/lib/living-index/herd-logs'
import WeekChart from './WeekChart'

export default function HerdLog({ onOpen }: { onOpen: (slug: string) => void }) {
  const { snapshot, COWS, milkFor } = useLivingIndex()
  const milkDays = new Map<string, { date:string; quantity:number }>()
  for (const reading of snapshot.milk) {
    if (reading.litres === null) continue
    const day = milkDays.get(reading.date) ?? { date:reading.date, quantity:0 }
    day.quantity += reading.litres
    milkDays.set(day.date,day)
  }
  const milk = [...milkDays.values()].sort((a,b) => a.date.localeCompare(b.date))
  const missing = sum(snapshot.milk.map(d => d.missingSessions))
  const recentMilk = lastDays(milk,30,snapshot.today)
  const milkers = COWS.map(c => ({cow:c, log:milkFor(c.cowId)})).filter(x => x.log && x.log.last30Days > 0)
  return <section className="li-hl" id="herd-log" aria-labelledby="li-hl-h">
    <div className="section-w">
      <div className="li-hl__intro"><h2 id="li-hl-h">What the herd gives back.</h2><div className="li-hl__lede">
        <p className="p1">The estate’s accepted daily records, refreshed automatically. Milk covers the animals published here; dung and urine are herd collections.</p>
        <p className="label li-hl__asof">Checked {dayMonth(snapshot.today,true)} {snapshot.today.slice(0,4)} · Up to {snapshot.historyDays} days of history</p>
      </div></div>
      <Block label="Recorded milk" value={recentMilk.length ? `${amount(sum(recentMilk.map(d => d.quantity)))} L` : 'No readings'}
        lines={['Known readings in the last 30 calendar days',`${recentMilk.length} days with recorded quantities`,`${missing} missing session readings in the history window`]}
        note="Figures sum known readings. Partial days may be incomplete; missing readings are never counted as zero."
        chart={milk.length ? <WeekChart weeks={byWeek(milk,d => d.quantity)} unit="litres" caption="Known litres per logged day, by week" /> : <p>No milk readings are currently published.</p>}>
        <div className="li-hl__milkers"><p className="label li-hl__sub">Last 30 days, cow by cow</p><ul>{milkers.map(({cow,log}) =>
          <li key={cow.cowId}><a href={`/living-index/cows/${cow.slug}`} onClick={e => {e.preventDefault();onOpen(cow.slug)}}>{cow.name}</a><span className="li-hl__n">{amount(log!.last30)} L</span></li>
        )}</ul></div>
      </Block>
      {(['dung','urine'] as const).map(kind => {
        const days = snapshot.collections.filter(c => c.kind === kind)
        const recent = lastDays(days,30,snapshot.today)
        const unit = kind === 'dung' ? 'kg' : 'L'
        return <Block key={kind} label={kind === 'dung' ? 'Dung collected' : 'Urine collected'}
          value={recent.length ? `${amount(sum(recent.map(d => d.quantity)))} ${unit}` : 'No readings'}
          lines={['In the last 30 calendar days',`${recent.length} days with published collections`]}
          note="Herd totals use each group’s reported total, or its components when no total exists. Collections describe the herd as a whole."
          chart={days.length ? <WeekChart weeks={byWeek(days,d => d.quantity)} unit={kind === 'dung' ? 'kilograms' : 'litres'} caption="Quantity per logged day, by week" /> : <p>No collections are currently published.</p>} />
      })}
    </div><HerdLogStyles />
  </section>
}

function Block({
  label, value, lines, note, chart, children,
}: { label: string; value: string; lines: string[]; note?: string; chart: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="li-hl__block">
      <div className="li-hl__fig">
        <p className="label li-hl__label">{label}</p>
        <p className="li-hl__value">{value}</p>
        <p className="p2 li-hl__lines">{lines.map((l, i) => <span key={i}>{l}</span>)}</p>
        {note && <p className="p2 li-hl__note">{note}</p>}
      </div>
      <div className="li-hl__chart">{chart}</div>
      {children && <div className="li-hl__more">{children}</div>}
    </div>
  )
}

function HerdLogStyles() {
  return (
    <style jsx global>{`
      .li-cows { --li-chart: #2F7A3A; }
      [data-theme="night"] .li-cows { --li-chart: #5FA86D; }
      .li-hl { padding: var(--section-gap) 0; border-top: 1px solid var(--border); }
      .li-hl__intro { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); align-items: start; }
      .li-hl__intro h2 { margin: 0; max-width: 560px; }
      .li-hl__lede { display: flex; flex-direction: column; gap: var(--space-4); margin-top: -0.2em; }
      .li-hl__lede p { margin: 0; }
      .li-hl__asof { color: var(--text-muted); }
      /* Figures and their breakdown on the left, the chart on the right;
         on a phone the chart follows the figures and the breakdown comes last. */
      .li-hl__block {
        display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
        grid-template-areas: 'fig chart' 'more chart'; grid-template-rows: auto 1fr;
        column-gap: var(--grid-gap); row-gap: 0;
        margin-top: var(--space-9); padding-top: var(--space-5); border-top: 1.5px solid var(--border-strong);
      }
      .li-hl__fig { grid-area: fig; }
      .li-hl__chart { grid-area: chart; }
      .li-hl__more { grid-area: more; min-width: 0; }
      .li-hl__fig { display: flex; flex-direction: column; gap: var(--space-3); min-width: 0; }
      .li-hl__fig p { margin: 0; }
      .li-hl__label { color: var(--text-muted); }
      /* The h2 size: the figure is the block's headline. */
      .li-hl__value { font-family: var(--font-grotesque); font-size: clamp(36px, 4.6vw, 56px); line-height: 1; letter-spacing: -0.04em; color: var(--text); }
      .li-hl__lines { display: flex; flex-direction: column; gap: 2px; color: var(--text-body); }
      .li-hl__note { color: var(--text-body); max-width: 40ch; }
      .li-hl__sub { color: var(--text-muted); margin-top: var(--space-4) !important; }
      .li-hl__milkers ul, .li-hl__where ul { list-style: none; margin: var(--space-3) 0 0; padding: 0; }
      .li-hl__milkers ul { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--space-6); }
      .li-hl__milkers li { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-3); padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
      .li-hl__milkers a { color: var(--text); text-decoration: none; }
      .li-hl__n { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.5px; color: var(--text-body); font-variant-numeric: tabular-nums; white-space: nowrap; }
      .li-hl__where li { display: grid; grid-template-columns: 1fr auto; align-items: baseline; gap: 4px var(--space-4); padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 14px; color: var(--text); }
      .li-hl__where li.is-unknown { color: var(--text-body); }
      .li-hl__bar { grid-column: 1 / -1; display: block; height: 6px; background: var(--border); border-radius: 0 3px 3px 0; overflow: hidden; }
      .li-hl__bar > span { display: block; height: 100%; background: var(--li-chart); border-radius: 0 3px 3px 0; }
      .li-hl__where li.is-unknown .li-hl__bar > span { background: var(--text-dim); }
      .li-hl__chart { min-width: 0; padding-top: var(--space-6); }
      @media (max-width: 900px) {
        .li-hl__intro { grid-template-columns: 1fr; gap: var(--space-6); }
        .li-hl__block { grid-template-columns: 1fr; grid-template-areas: 'fig' 'chart' 'more'; grid-template-rows: auto; row-gap: var(--space-6); margin-top: var(--space-8); }
        .li-hl__chart { padding-top: 0; }
        .li-hl__more .li-hl__sub { margin-top: 0 !important; }
      }
      @media (max-width: 340px) {
        .li-hl__milkers ul { grid-template-columns: 1fr; }
      }
    `}</style>
  )
}
