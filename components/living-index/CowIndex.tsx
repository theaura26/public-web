'use client'

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { HeroBanner, TwoCol, PullQuote, Continue } from '@/components/article/Article'
import ArrowCta from '@/components/ArrowCta'
import { journalImage } from '@/lib/journals'
import {
  TYPE_ORDER, TYPE_PLURAL,
  type Cow, type CowType, type Ymd,
  ageOn, ageShort, ageWords, cowHref, cowImage,
  estateToday, formatBorn, formatDate, listNames, parseYmd, pronouns, shortId, toIso,
} from '@/lib/living-index/cows'
import { useLivingIndex } from './LivingIndexProvider'
import CowPassport, { PlateToCome } from './CowPassport'
import HerdLog from './HerdLog'
import PagedGrid from './PagedGrid'

/* ═══════════════════════════════════════════════════════════════════
   COWS OF AURA — the Living Index of the herd. Concept A, the Plate
   Wall: every animal as her green pointillist plate, number and name
   beneath. Hover swaps the drawing for the photograph and her dates;
   a click opens the passport, which is a route of its own
   (/living-index/cows/<slug>) so any animal can be linked to.

   Three things make the page worth coming back to: a birthday on the
   estate is shown on the day, the newest member of the herd is
   introduced while she is new, and there is always someone to say
   hello to.
═══════════════════════════════════════════════════════════════════ */

const BASE = '/living-index/cows'
type Sort = 'name' | 'number' | 'eldest' | 'youngest'

function slugFromPath(pathname: string | null): string | null {
  const m = pathname?.match(/^\/living-index\/cows\/([^/?#]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

const noSubscribe = () => () => {}

/** Today on the estate as YYYY-MM-DD. A `?today=YYYY-MM-DD` override
 *  lets a reviewer see a birthday or a new arrival on a day it would
 *  not otherwise show. */
function clientTodayIso(): string {
  try {
    const v = new URLSearchParams(window.location.search).get('today')
    if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v
  } catch { /* fall through to the real date */ }
  return toIso(estateToday())
}

export default function CowIndex() {
  const { COWS } = useLivingIndex()
  if (!COWS.length) return <div className="section-w" style={{paddingTop:'calc(var(--nav-h) + 80px)',paddingBottom:80}}><h1>Cows of Aura</h1><p>No animal profiles are currently published. Please check back soon.</p></div>
  return <PopulatedCowIndex />
}
function PopulatedCowIndex() {
  const { COWS, HERD_SIZE, HERD_TO_ADD, HERD_UPDATED, HERD_IS_PLACEHOLDER, cowBySlug, birthdaysOn, newestMember, eldest, cowOfTheDay } = useLivingIndex()
  /* The server renders against the date the data was last changed; the
     browser then moves to today on the estate. React hydrates with the
     server's answer and re-renders with the browser's, so the two never
     disagree mid-hydration. */
  const todayIso = useSyncExternalStore(noSubscribe, clientTodayIso, () => HERD_UPDATED)
  const ready = useSyncExternalStore(noSubscribe, () => true, () => false)
  const today = useMemo(() => parseYmd(todayIso), [todayIso])

  const [type, setType] = useState<CowType | 'All'>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('name')

  const visible = useMemo(() => {
    /* A name, or a number in any form: "Litty", "0001", "1", "COW-0001". */
    const q = query.trim().toLowerCase().replace(/^cow-?/, '')
    const asNumber = /^\d+$/.test(q) ? Number(q) : null
    const list = COWS.filter((c) =>
      (type === 'All' || c.type === type) &&
      (!q || c.name.toLowerCase().includes(q) || (asNumber !== null && Number(shortId(c)) === asNumber)),
    )
    const bornKey = (c: Cow) => c.born ?? '9999'
    if (sort === 'number') list.sort((a, b) => a.cowId.localeCompare(b.cowId))
    if (sort === 'eldest') list.sort((a, b) => bornKey(a).localeCompare(bornKey(b)))
    if (sort === 'youngest') list.sort((a, b) => bornKey(b).localeCompare(bornKey(a)))
    return list
  }, [type, query, sort, COWS])

  const counts = useMemo(() => {
    const m = new Map<CowType, number>()
    for (const c of COWS) m.set(c.type, (m.get(c.type) ?? 0) + 1)
    return m
  }, [COWS])

  const birthdays = useMemo(() => (ready ? birthdaysOn(today) : []), [ready, today, birthdaysOn])
  const newest = useMemo(() => (ready ? newestMember(today) : undefined), [ready, today, newestMember])
  const birthdaySet = useMemo(() => new Set(birthdays.map((c) => c.slug)), [birthdays])

  /* ── The passport is a route. Opening pushes /living-index/cows/<slug>;
        moving between cows replaces it, so Back always closes. ── */
  const pathname = usePathname()
  const openSlug = slugFromPath(pathname)
  const openCow = cowBySlug(openSlug)
  const pushedRef = useRef(false)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  /* The query string rides along, so a ?today= preview survives opening
     and closing a passport. */
  const open = useCallback((slug: string) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null
    window.history.pushState(null, '', `${BASE}/${slug}${window.location.search}`)
    pushedRef.current = true
  }, [])
  const move = useCallback((slug: string) => {
    window.history.replaceState(null, '', `${BASE}/${slug}${window.location.search}`)
  }, [])
  const close = useCallback(() => {
    if (pushedRef.current) { pushedRef.current = false; window.history.back() }
    else window.history.replaceState(null, '', `${BASE}${window.location.search}`)
    const el = returnFocusRef.current
    if (el) requestAnimationFrame(() => el.focus?.())
  }, [])

  /* Cow of the day: the same for every reader until midnight on the
     estate, and a different one tomorrow. On a birthday the birthday
     cow takes the place. */
  const hello = cowOfTheDay(today)!

  const year = today.y
  const calvesThisYear = COWS.filter((c) => c.born?.startsWith(String(year)) && !c.bornEstimated && c.born <= todayIso).length
  const indigenous = COWS.filter((c) => c.breed === 'Malnad Gidda').length
  const elders = eldest()
  const elderAge = elders[0] ? ageShort(elders[0], today) : null
  const tileCount = (newest ? 1 : 0) + 1

  return (
    <div className="li-cows">
      <HeroBanner
        title="Cows of Aura"
        src="/living-index/video/cows-of-aura.mp4"
        mediaType="video"
        poster="/living-index/video/cows-of-aura-poster.jpg"
        alt="A Malnad Gidda cow walking through the undergrowth at Mudigere, seen through leaves"
        caption={`${HERD_SIZE} published members of the herd, each with a number issued once`}
      />

      {/* ── Premise, the herd in four numbers, and today ── */}
      <section className="li-intro">
        <div className="section-w">
          <div className="li-intro__two">
            <h2>Meet the herd, by name and by number.</h2>
            <div className="li-intro__body">
              <p className="p1">
                Meet the published members of the herd at Mudigere: their names and numbers,
                their drawings and photographs, and the family links recorded in the estate’s register.
              </p>
              <p className="p1" style={{ color: 'var(--text-body)' }}>
                Each drawing opens onto the cow herself, and her record.
              </p>
            </div>
          </div>

          <dl className="li-stats">
            <div className="li-stat"><dt className="li-stat__v">{HERD_SIZE}</dt><dd className="p2">published members of the herd</dd></div>
            <div className="li-stat"><dt className="li-stat__v">{indigenous}</dt><dd className="p2">Malnad Gidda, the breed of these hills</dd></div>
            <div className="li-stat"><dt className="li-stat__v">{calvesThisYear}</dt><dd className="p2">animals born in {year}</dd></div>
            {elders.length > 0 && elderAge && (
              <div className="li-stat"><dt className="li-stat__v">{elderAge}</dt><dd className="p2">{listNames(elders.map((c) => c.name))}, the eldest</dd></div>
            )}
          </dl>

          <div className="li-today" aria-label="The herd today">
            <p className="label li-today__h">The herd today</p>
            <div
              className={`li-today__row${tileCount >= 3 ? ' is-3' : ''}`}
              style={{ ['--n' as string]: Math.max(2, tileCount) }}
            >
              {newest && (
                <TodayTile
                  cow={newest}
                  kicker="Newest member of the herd"
                  title={`Meet ${newest.name}`}
                  line={newestLine(newest, today, cowBySlug(newest.dam))}
                  cta={`Meet ${newest.name}`}
                  onOpen={open}
                  accent
                />
              )}
              {birthdays.length > 0 ? (
                <BirthdayTile cows={birthdays} today={today} onOpen={open} />
              ) : (
                <TodayTile
                  cow={hello}
                  kicker="Cow of the day"
                  title="Say hello to a cow today"
                  line={`Today it’s ${hello.name}${ageShort(hello, today) ? `, ${ageWords(hello, today)}` : ''}.`}
                  cta={`Say hello to ${hello.name}`}
                  onOpen={open}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Controls. Sticky under the nav so the herd can be narrowed
            from anywhere in the grid; the wrapper ends the stickiness
            where the grid ends. ── */}
      <div className="li-wall">
      <div className="li-controls" id="herd">
        <div className="section-w">
          <div className="li-controls__row">
            <div className="li-filters" role="group" aria-label="Show">
              <FilterButton label="All" count={COWS.length} on={type === 'All'} onClick={() => setType('All')} />
              {TYPE_ORDER.filter((t) => counts.get(t)).map((t) => (
                <FilterButton key={t} label={TYPE_PLURAL[t]} count={counts.get(t)!} on={type === t} onClick={() => setType(t)} />
              ))}
            </div>
            <span className="label li-updated"><span className="li-dot" aria-hidden />Checked {formatDate(HERD_UPDATED)}</span>
          </div>
          <div className="li-controls__row">
            <label className="li-search">
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={1.6} />
                <path d="M20 20l-4-4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              </svg>
              <span className="sr-only">Find a cow</span>
              <input
                type="search"
                className="label"
                placeholder="Name or number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label className="label li-sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="label">
                <option value="name">Name A–Z</option>
                <option value="number">Number</option>
                <option value="eldest">Eldest first</option>
                <option value="youngest">Youngest first</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* ── The index ── */}
      <section className="li-index" aria-label="The herd">
        <div className="section-w">
          {visible.length ? (
            <PagedGrid
              items={visible}
              perPage={20}
              countLine={(from, to, total, screens) =>
                (screens > 1 ? `Showing ${from}–${to} of ${total}` : `Showing ${total} of ${COWS.length}`)
                + (total === COWS.length && HERD_TO_ADD > 0 ? ` · ${HERD_TO_ADD} more members of the herd still to be added` : '')}
              itemKey={(c) => c.slug}
              renderItem={(c) => (
                <CowCard
                  cow={c}
                  today={today}
                  birthday={birthdaySet.has(c.slug)}
                  newest={newest?.slug === c.slug}
                  onOpen={open}
                />
              )}
            />
          ) : (
            <p className="p1 li-empty">
              No cow by that name or number. Try a name like Litty, or a number like 0001.
            </p>
          )}
          {HERD_IS_PLACEHOLDER && (
            <p className="label li-count">Names and pictures are real; numbers, dates and lineage are placeholders until the register is connected</p>
          )}
        </div>
      </section>
      </div>

      <HerdLog onOpen={open} />

      <TwoCol id="register" heading="An ear tag can fall out. A name is not a record.">
        <p className="p1">
          Tags come off, get replaced and get reused. Names repeat, shorten, and change with
          whoever is speaking. So every member of the herd carries a third thing: a Cow ID,
          issued once and never reassigned.
        </p>
        <p className="p1" style={{ color: 'var(--text-body)' }}>
          This index shares the herd’s published profiles and daily records. Where a detail is
          unknown, it stays unknown. As the estate’s register changes, these pages follow.
        </p>
        <p style={{ marginTop: 'var(--space-5)' }}>
          <ArrowCta href="/herd">Read how the herd is kept</ArrowCta>
        </p>
      </TwoCol>

      <PullQuote>The ear tag can change. The Cow ID must not.</PullQuote>

      <Continue
        items={[
          { href: '/herd', label: 'Ecosystem Engineers', img: journalImage('/herd') },
          { href: '/biodynamic', label: 'A Living Organism', img: journalImage('/biodynamic') },
          { href: '/land', label: 'The Land', img: journalImage('/land') },
        ]}
      />

      {openCow && (
        <CowPassport
          key="passport"
          cow={openCow}
          list={visible.some((c) => c.slug === openCow.slug) ? visible : COWS}
          today={today}
          birthday={ready && birthdaySet.has(openCow.slug)}
          newest={newest?.slug === openCow.slug}
          onClose={close}
          onMove={move}
        />
      )}

      <IndexStyles />
    </div>
  )
}

function newestLine(c: Cow, today: Ymd, dam: Cow | undefined): string {
  const age = ageWords(c, today)
  if (c.bornAtAura) return `Born ${formatBorn(c)}${dam ? ` to ${dam.name}` : ''}. ${age.charAt(0).toUpperCase() + age.slice(1)}.`
  return `Joined the herd on ${c.joined ? formatDate(c.joined) : 'a recent day'}.`
}

/* One tile for every birthday on the day. Twins in the register (Chotu
   and Guru share 12 March) are celebrated together rather than as two
   tiles that push the strip onto a second row. */
function BirthdayTile({ cows, today, onOpen }: { cows: Cow[]; today: Ymd; onOpen: (slug: string) => void }) {
  const { cowBySlug } = useLivingIndex()
  const turns = (c: Cow) => (c.born ? ageOn(c.born, today).years : 0)
  if (cows.length === 1) {
    const c = cows[0]
    const dam = cowBySlug(c.dam)
    return (
      <TodayTile
        cow={c}
        kicker="Cow of the day · Birthday"
        title={`${c.name} turns ${turns(c)} today`}
        line={`Born ${formatBorn(c)}${dam ? ` to ${dam.name}` : ''}.`}
        cta={`Wish ${pronouns(c).o} a happy birthday`}
        onOpen={onOpen}
        accent
      />
    )
  }
  const sameAge = cows.every((c) => turns(c) === turns(cows[0]))
  const sameDay = cows.every((c) => c.born === cows[0].born)
  const toMother = (c: Cow) => { const d = cowBySlug(c.dam); return d ? `${c.name} to ${d.name}` : c.name }
  const line = sameDay
    ? `${cows.length === 2 ? 'Both' : 'All'} born ${formatBorn(cows[0])}, ${listNames(cows.map(toMother))}.`
    : listNames(cows.map((c) => `${c.name} was born ${formatBorn(c)}`)) + '.'
  return (
    <TodayTile
      cow={cows.find((c) => c.hasPlates) ?? cows[0]}
      kicker="Cows of the day · Birthdays"
      title={sameAge ? `${listNames(cows.map((c) => c.name))} turn ${turns(cows[0])} today` : `Birthdays for ${listNames(cows.map((c) => c.name))}`}
      line={line}
      cta={`Wish ${cows[0].name} a happy birthday`}
      onOpen={onOpen}
      accent
      extra={cows.slice(1).map((c) => (
        <button key={c.slug} type="button" className="label li-linkbtn" onClick={() => onOpen(c.slug)}>And {c.name}</button>
      ))}
    />
  )
}

function FilterButton({ label, count, on, onClick }: { label: string; count: number; on: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`label li-filter${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onClick}>
      <span className="li-filter__t">{label}</span> <span className="li-filter__n">{count}</span>
    </button>
  )
}

function TodayTile({
  cow, kicker, title, line, cta, onOpen, extra, accent,
}: {
  cow: Cow; kicker: string; title: string; line: string; cta: string
  onOpen: (slug: string) => void; extra?: React.ReactNode; accent?: boolean
}) {
  return (
    <div className="li-tile">
      <a
        className="li-tile__plate"
        href={cowHref(cow)}
        onClick={(e) => { e.preventDefault(); onOpen(cow.slug) }}
        aria-label={`${cow.name}, ${cow.cowId}`}
      >
        {cowImage(cow, 'green')
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={cowImage(cow, 'green')!} alt="" width={895} height={692} loading="lazy" decoding="async" />
          : <PlateToCome small />}
      </a>
      <div className="li-tile__text">
        <p className="label li-tile__k">{accent && <span className="li-dot" aria-hidden />}{kicker}</p>
        <h3 className="li-tile__h">{title}</h3>
        <p className="p2 li-tile__l">{line}</p>
        <div className="li-tile__acts">
          <ArrowCta onClick={() => onOpen(cow.slug)}>{cta}</ArrowCta>
          {extra}
        </div>
      </div>
    </div>
  )
}

function CowCard({
  cow, today, birthday, newest, onOpen,
}: { cow: Cow; today: Ymd; birthday: boolean; newest: boolean; onOpen: (slug: string) => void }) {
  /* The photograph is only fetched once someone shows interest in this
     card — pointer over it, or focus on it — never all 39 up front. */
  const [warm, setWarm] = useState(false)
  const age = ageShort(cow, today)
  /* Hover shows when she was born and how old she is, nothing more. An
     estimated date already reads "c. 2014", so the age says "about". */
  const hoverAge = age && cow.bornEstimated ? age.replace(/^c\. /, 'about ') : age
  const green = cowImage(cow, 'green')
  const photo = cow.hasPhoto ? cowImage(cow, 'photo') : null
  return (
    <a
      className={`li-card${warm ? ' is-warm' : ''}${green ? '' : ' is-undrawn'}`}
      href={cowHref(cow)}
      onPointerEnter={() => setWarm(true)}
      onFocus={() => setWarm(true)}
      onClick={(e) => { e.preventDefault(); onOpen(cow.slug) }}
    >
      <span className="li-plate">
        {green ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="li-plate__green" src={green} alt="" width={895} height={692} loading="lazy" decoding="async" />
        ) : (
          <PlateToCome />
        )}
        {warm && photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="li-plate__photo" src={photo} alt="" width={895} height={692} decoding="async" />
        )}
        <span className="li-plate__scrim" aria-hidden />
        <span className="label li-plate__details" aria-hidden>
          <span>Born {formatBorn(cow, true)}{hoverAge ? ` · ${hoverAge}` : ''}</span>
        </span>
      </span>
      <span className="li-cap">
        <span className="li-name">{cow.name}</span>
        <span className="label li-id">{shortId(cow)}</span>
      </span>
      <span className="label li-sub">{[age, cow.type].filter(Boolean).join(' · ')}</span>
      {(birthday || newest) && (
        <span className="label li-mark"><span className="li-dot" aria-hidden />{birthday ? 'Birthday today' : 'Newest member'}</span>
      )}
    </a>
  )
}

/* One global block, namespaced under .li-cows: the cards are plain
   anchors and the passport is its own component, so scoped styled-jsx
   would miss most of what it is meant to reach. */
function IndexStyles() {
  return (
    <style jsx global>{`
      .li-cows { --plate-ground: transparent; --paper: #efede6; }
      [data-theme="night"] .li-cows { --plate-ground: var(--paper); }
      .li-cows .arrow-cta { color: var(--text); text-align: left; }
      .li-cows .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
      .li-cows .li-dot {
        display: inline-block; width: 6px; height: 6px; border-radius: 50%;
        background: var(--brand-accent); margin-right: 8px; vertical-align: 1px; flex: none;
      }

      /* Intro */
      .li-intro { padding: var(--section-gap) 0 calc(var(--section-gap) * 0.6); }
      .li-intro__two { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); align-items: start; }
      .li-intro__two h2 { margin: 0; max-width: 560px; }
      .li-intro__body { display: flex; flex-direction: column; gap: var(--space-4); margin-top: -0.2em; }
      .li-intro__body p { margin: 0; }
      .li-stats {
        display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--space-6); margin: var(--space-9) 0 0; padding: 0;
      }
      .li-stat { border-top: 1.5px solid var(--border-strong); padding-top: var(--space-4); margin: 0; }
      /* The h3 role's measurements; a stat is a figure, not a heading. */
      .li-stat__v {
        font-family: var(--font-grotesque); font-size: clamp(22px, 3vw, 32px);
        line-height: 1.15; letter-spacing: -0.03em; color: var(--text); margin: 0 0 var(--space-2);
      }
      .li-stat dd { margin: 0; color: var(--text-body); }

      /* Today */
      .li-today { margin-top: var(--space-9); }
      .li-today__h { margin: 0 0 var(--space-5); color: var(--text-muted); }
      /* One or two tiles sit side by side, plate beside text. On a day
         with three (a birthday, a newcomer and a hello) each stands as a
         short column instead, so none is squeezed. A single tile keeps
         to half the row. */
      .li-today__row { display: grid; grid-template-columns: repeat(var(--n, 2), minmax(0, 1fr)); gap: var(--space-6); }
      .li-today__row.is-3 .li-tile { grid-template-columns: 1fr; gap: var(--space-4); }
      .li-today__row.is-3 .li-tile__plate { width: 168px; }
      @media (max-width: 1023px) {
        .li-today__row, .li-today__row.is-3 { grid-template-columns: 1fr; }
        .li-today__row.is-3 .li-tile { grid-template-columns: 150px 1fr; gap: var(--space-5); }
        .li-today__row.is-3 .li-tile__plate { width: auto; }
      }
      .li-tile { display: grid; grid-template-columns: 150px 1fr; gap: var(--space-5); align-items: start; padding-top: var(--space-4); border-top: 1px solid var(--border); }
      .li-tile__plate { display: block; aspect-ratio: 895 / 692; background: var(--plate-ground); border-radius: var(--radius-1); overflow: hidden; }
      .li-tile__plate img { width: 100%; height: 100%; object-fit: contain; display: block; mix-blend-mode: multiply; }
      .li-tile__text { display: flex; flex-direction: column; gap: var(--space-2); min-width: 0; }
      .li-tile__k { margin: 0; color: var(--text); display: flex; align-items: center; }
      .li-tile__h { margin: 0; font-size: clamp(20px, 2vw, 24px); }
      .li-tile__l { margin: 0; color: var(--text-body); }
      .li-tile__acts { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3) var(--space-5); margin-top: var(--space-2); }
      .li-linkbtn { background: none; border: 0; padding: 0; color: var(--text-body); cursor: pointer; }

      /* Controls */
      .li-controls {
        position: sticky; top: var(--nav-h); z-index: 20;
        background: var(--bg); border-bottom: 1px solid var(--border);
        padding: var(--space-5) 0 var(--space-4);
      }
      .li-controls__row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4) var(--space-6); }
      .li-controls__row + .li-controls__row { margin-top: var(--space-4); }
      .li-filters { display: flex; flex-wrap: wrap; gap: var(--space-3) var(--space-6); flex: 1 1 auto; }
      .li-filter { background: none; border: 0; padding: 4px 0; color: var(--text-body); cursor: pointer; }
      .li-filter__n { color: var(--text-muted); margin-left: 4px; }
      /* Selection is the hover underline held on. */
      .li-filter.is-on { color: var(--text); }
      .li-filter.is-on .li-filter__t {
        text-decoration: underline; text-decoration-color: var(--brand-accent);
        text-underline-offset: var(--rule-offset); text-decoration-thickness: var(--rule-weight);
      }
      .li-filter:hover { text-decoration: none; }
      .li-filter:hover .li-filter__t {
        text-decoration: underline; text-decoration-color: var(--brand-accent);
        text-underline-offset: var(--rule-offset); text-decoration-thickness: var(--rule-weight);
      }
      .li-updated { display: inline-flex; align-items: center; color: var(--text-body); }
      .li-search {
        display: inline-flex; align-items: center; gap: 10px; width: min(280px, 100%);
        border: 1px solid var(--border-strong); border-radius: var(--radius-2);
        padding: 9px 14px; color: var(--text-muted);
      }
      .li-search input {
        flex: 1; min-width: 0; border: 0; background: transparent; outline: none;
        color: var(--text); padding: 0; margin: 0;
      }
      .li-search input::placeholder { color: var(--text-muted); }
      .li-search:focus-within { border-color: var(--text-muted); }
      .li-sort { display: inline-flex; align-items: center; gap: 10px; color: var(--text-muted); }
      .li-sort select {
        appearance: none; border: 0; background: transparent; color: var(--text-body);
        padding: 4px 16px 4px 0; cursor: pointer;
        background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);
        background-position: right 4px center, right 0 center; background-size: 4px 4px; background-repeat: no-repeat;
      }

      /* The grid */
      .li-index { padding: var(--space-7) 0 var(--space-8); }
      .li-grid {
        list-style: none; margin: 0; padding: 0;
        display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
        column-gap: var(--space-6); row-gap: var(--space-7);
      }
      .li-grid > li { margin: 0; min-width: 0; }
      .li-card { display: flex; flex-direction: column; gap: var(--space-3); color: inherit; text-decoration: none; }
      .li-card:hover, .li-card:focus-visible { text-decoration: none; outline: none; }
      .li-plate {
        position: relative; display: block; aspect-ratio: 895 / 692;
        border-radius: var(--radius-1); overflow: hidden; background: var(--plate-ground);
      }
      .li-plate img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
      /* The plates are drawn on a near-white ground; multiply lets the page
         white through so a plate never shows as a grey box. */
      .li-plate__green { object-fit: contain; mix-blend-mode: multiply; }
      /* A few plates were exported on grey or cream. A light lift takes
         the ground to white without thinning the ink; re-exported plates
         on true white will make this unnecessary. */
      .li-plate__green, .li-tile__plate img, .li-kin__plate img { filter: brightness(1.06) contrast(1.1); }
      .li-plate__photo { object-fit: cover; opacity: 0; transition: opacity var(--dur-slow) var(--ease-out); }
      .li-plate__scrim {
        position: absolute; inset: 0; opacity: 0; pointer-events: none;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.6) 100%);
        transition: opacity var(--dur-base) var(--ease);
      }
      .li-plate__details {
        position: absolute; left: 14px; right: 14px; bottom: 12px;
        display: flex; flex-direction: column; gap: 4px;
        color: #fff; opacity: 0; transform: translateY(4px);
        transition: opacity var(--dur-base) var(--ease), transform var(--dur-base) var(--ease);
        text-shadow: 0 1px 8px rgba(0, 0, 0, 0.35);
      }
      .li-card:focus-visible .li-plate { box-shadow: 0 0 0 2px var(--brand-accent); }
      /* An animal not drawn yet: a flat plate with a line of mono, the way
         unwritten notes show elsewhere on the site, so the gap reads as
         work to come rather than a broken picture. */
      .li-cows .li-tocome {
        position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
        background: color-mix(in srgb, var(--text-muted) 12%, transparent); color: var(--text-muted);
        border-radius: inherit; text-align: center; padding: 0 12px;
      }
      .li-cows .li-tocome.is-small { font-size: 10px; letter-spacing: 0.6px; }
      .li-tile__plate, .li-kin__plate, .li-pass__fig { position: relative; }
      @media (hover: hover) {
        .li-card.is-warm:hover .li-plate__photo { opacity: 1; transition-delay: 80ms; }
        .li-card:hover .li-plate__scrim,
        .li-card:hover .li-plate__details { opacity: 1; transform: translateY(0); transition-delay: 120ms; }
      }
      .li-card.is-warm:focus-visible .li-plate__photo,
      .li-card:focus-visible .li-plate__scrim,
      .li-card:focus-visible .li-plate__details { opacity: 1; transform: translateY(0); }
      .li-cap { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-3); }
      .li-name { font-family: var(--font-sans); font-size: 16px; line-height: 1.55; color: var(--text); }
      .li-card:hover .li-name, .li-card:focus-visible .li-name {
        text-decoration: underline; text-decoration-color: var(--brand-accent);
        text-underline-offset: var(--rule-offset); text-decoration-thickness: var(--rule-weight);
      }
      .li-id { color: var(--text-muted); }
      /* Pointer screens get the age on hover; touch screens have no hover,
         so the age is always printed. */
      .li-sub { display: none; color: var(--text-muted); margin-top: -6px; }
      @media (hover: none) { .li-sub { display: block; } }
      .li-mark { display: inline-flex; align-items: center; color: var(--text); margin-top: -4px; }
      .li-count { margin: var(--space-7) 0 0; color: var(--text-muted); max-width: 80ch; }
      .li-empty { margin: var(--space-7) 0; color: var(--text-body); }

      @media (max-width: 1100px) {
        .li-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .li-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 768px) {
        .li-intro__two { grid-template-columns: 1fr; gap: var(--space-5); }
        .li-stats { margin-top: var(--space-7); gap: var(--space-5); }
        .li-today { margin-top: var(--space-7); }
        .li-tile, .li-today__row.is-3 .li-tile { grid-template-columns: 112px 1fr; gap: var(--space-4); }
        .li-today__row, .li-today__row.is-3 { gap: var(--space-5); }
        /* Sticky on a phone, the controls would hold a third of the
           screen. They sit at the head of the grid and scroll with it. */
        .li-controls { position: static; padding: var(--space-4) 0 var(--space-3); }
        /* Filters run sideways on a phone rather than wrapping into a block. */
        .li-filters { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 calc(var(--gutter) * -1); padding: 0 var(--gutter); }
        .li-filters::-webkit-scrollbar { display: none; }
        .li-filter { white-space: nowrap; }
        .li-updated { display: none; }
        .li-controls__row + .li-controls__row { margin-top: var(--space-3); gap: var(--space-3) var(--space-5); }
        .li-search { width: 100%; }
      }
      @media (max-width: 600px) {
        .li-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--space-4); row-gap: var(--space-6); }
        .li-name { font-size: 14px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .li-plate__photo, .li-plate__scrim, .li-plate__details { transition: none !important; }
      }

      /* ── Passport ── */
      .li-pass { position: fixed; inset: 0; z-index: 9500; }
      .li-pass__dim {
        position: absolute; inset: 0; background: rgba(19, 23, 25, 0.4);
        opacity: 0; transition: opacity var(--dur-base) var(--ease);
      }
      .li-pass__panel {
        position: absolute; top: 0; right: 0; bottom: 0; width: min(560px, 100vw);
        background: var(--bg); color: var(--text); overflow-y: auto; overscroll-behavior: contain;
        box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
        transform: translateX(100%); transition: transform var(--dur-slow) var(--ease-spring);
        padding: 0 var(--space-7) var(--space-8);
      }
      .li-pass.is-shown .li-pass__dim { opacity: 1; }
      .li-pass.is-shown .li-pass__panel { transform: translateX(0); }
      .li-pass__bar {
        position: sticky; top: 0; z-index: 2; background: var(--bg);
        display: flex; align-items: center; gap: var(--space-5);
        padding: var(--space-5) 0 var(--space-4); margin-bottom: var(--space-2);
      }
      .li-pass__nav, .li-pass__close { background: none; border: 0; padding: 4px 0; color: var(--text-body); cursor: pointer; }
      .li-pass__close { color: var(--text); display: inline-flex; padding: 4px; margin-right: -4px; }
      .li-pass__close:hover { text-decoration: none; }
      .li-pass__grow { flex: 1; }
      .li-pass__pos { color: var(--text-muted); }
      .li-pass__fig {
        margin: 0; aspect-ratio: 895 / 692; border-radius: var(--radius-1); overflow: hidden;
        background: var(--plate-ground);
      }
      .li-pass__fig img { width: 100%; height: 100%; display: block; object-fit: cover; }
      .li-pass__fig.is-stand-in img { object-fit: contain; mix-blend-mode: multiply; filter: brightness(1.06) contrast(1.1); }
      .li-pass__note { margin: var(--space-3) 0 0; color: var(--text-muted); }
      .li-pass__body { display: flex; flex-direction: column; gap: var(--space-6); margin-top: var(--space-7); }
      .li-pass__flag { display: flex; align-items: center; margin: 0 0 calc(var(--space-6) * -0.5); color: var(--text); }
      .li-pass__id { margin: 0 0 calc(var(--space-6) * -1 + var(--space-3)); color: var(--text-muted); }
      .li-pass__name { margin: 0; }
      .li-pass__meaning { display: flex; flex-direction: column; gap: var(--space-2); }
      .li-pass__meaning p { margin: 0; }
      .li-pass__meaning .label { color: var(--text-muted); }
      .li-pass .spec { padding: var(--space-5) var(--space-6) var(--space-6); }
      .li-pass .spec__row { padding: 14px 0; }
      .li-pass__milk { display: flex; flex-direction: column; gap: var(--space-3); }
      .li-pass__milk > p { margin: 0; }
      .li-pass__milk > .label:first-child { color: var(--text-muted); }
      .li-pass__muted { color: var(--text-muted); }
      .li-pass__family { display: flex; flex-direction: column; gap: var(--space-4); }
      .li-pass__family > .label { margin: 0; color: var(--text-muted); }
      .li-pass__chain { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4) var(--space-3); }
      .li-pass__arrow { color: var(--text-muted); }
      .li-kin { display: flex; flex-direction: column; gap: 6px; width: 120px; color: inherit; text-decoration: none; }
      .li-kin:hover { text-decoration: none; }
      .li-kin:hover .li-kin__n { text-decoration: underline; text-decoration-color: var(--brand-accent); text-underline-offset: var(--rule-offset); text-decoration-thickness: var(--rule-weight); }
      .li-kin__plate { display: block; aspect-ratio: 895 / 692; background: var(--plate-ground); border-radius: var(--radius-1); overflow: hidden; }
      .li-kin.is-self .li-kin__plate { box-shadow: inset 0 0 0 1px var(--border-strong); }
      .li-kin__plate img { width: 100%; height: 100%; object-fit: contain; display: block; mix-blend-mode: multiply; }
      .li-kin__n { color: var(--text); }
      .li-kin__id, .li-kin__r { color: var(--text-muted); }
      .li-pass__sibs { margin: 0; color: var(--text-body); display: flex; align-items: baseline; gap: var(--space-3); flex-wrap: wrap; }
      .li-pass__sibs + .li-pass__sibs { margin-top: calc(var(--space-4) * -0.5); }
      .li-pass__rel { color: var(--text-muted); min-width: 72px; }
      .li-pass__sibs a { color: var(--text); }
      .li-pass__acts { display: flex; gap: var(--space-6); }
      @media (max-width: 899px) {
        /* A sheet that rises from the bottom, the full height of the phone. */
        .li-pass__panel { width: 100vw; transform: translateY(100%); padding: 0 var(--gutter) var(--space-8); box-shadow: none; }
        .li-pass.is-shown .li-pass__panel { transform: translateY(0); }
        .li-pass__fig { margin: 0 calc(var(--gutter) * -1); border-radius: 0; }
        .li-pass__body { margin-top: var(--space-6); gap: var(--space-5); }
      }
      @media (prefers-reduced-motion: reduce) {
        .li-pass__panel, .li-pass__dim { transition: none !important; }
      }

      /* Agent view: the record as text. */
      [data-view="agent"] .li-pass__dim { display: none; }
      [data-view="agent"] .li-cows .li-sub { display: block; }
      [data-view="agent"] .li-cows .li-plate__details { display: none; }
    `}</style>
  )
}
