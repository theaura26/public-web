'use client'

import { useEffect, useRef, useState } from 'react'
import { SpecTable } from '@/components/article/Article'
import ArrowCta from '@/components/ArrowCta'
import {
  type Cow, type Ymd,
  ageLong, ageOn, breedLabel, cowHref, cowImage, formatBorn, formatDate,
  isMale, pronouns, shortId,
} from '@/lib/living-index/cows'
import { amount, dayMonth } from '@/lib/living-index/herd-logs'
import { useLivingIndex } from './LivingIndexProvider'
import WeekChart from './WeekChart'

/** The flat plate an animal shows until her drawing is made. */
export function PlateToCome({ small, label = 'Drawing to come' }: { small?: boolean; label?: string }) {
  return <span className={`label li-tocome${small ? ' is-small' : ''}`}>{label}</span>
}

/* The passport — one animal's record. A drawer on the right at desktop
   widths, a full-height sheet on a phone. It is a route rather than a
   modal: the URL is the animal's, Back closes it, Esc closes it, and
   the arrow keys walk the herd in whatever order the index is showing. */

export default function CowPassport({
  cow, list, today, birthday, newest, onClose, onMove,
}: {
  cow: Cow
  list: Cow[]
  today: Ymd
  birthday: boolean
  newest: boolean
  onClose: () => void
  onMove: (slug: string) => void
}) {
  const { cowBySlug, childrenOf, siblingsOf, milkFor, snapshot } = useLivingIndex()
  const [shown, setShown] = useState(false)
  /* The "link copied" note belongs to one animal; moving to the next
     clears it. */
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const copied = copiedSlug === cow.slug
  const setCopied = (c: boolean) => setCopiedSlug(c ? cow.slug : null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const i = Math.max(0, list.findIndex((c) => c.slug === cow.slug))
  const prev = list[(i - 1 + list.length) % list.length]
  const next = list[(i + 1) % list.length]

  /* Enter on the next frame so the slide has somewhere to come from. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    closeRef.current?.focus({ preventScroll: true })
    const html = document.documentElement
    const was = html.style.overflow
    html.style.overflow = 'hidden'
    return () => { cancelAnimationFrame(id); html.style.overflow = was }
  }, [])

  /* A new animal starts at the top of her record. */
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [cow.slug])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); onMove(prev.slug) }
      if (e.key === 'ArrowRight') { e.preventDefault(); onMove(next.slug) }
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onMove, prev.slug, next.slug])

  const dam = cowBySlug(cow.dam)
  const calves = childrenOf(cow.slug)
  const milk = milkFor(cow.cowId)
  const siblings = siblingsOf(cow)
  const age = ageLong(cow, today)
  const years = cow.born ? ageOn(cow.born, today).years : 0
  const pron = pronouns(cow).s.replace(/^./, (c) => c.toUpperCase())

  /* Only what the register can say plainly. Health, treatment,
     pregnancy and the shed she sleeps in stay with the herd team. */
  const rows = [
    { label: 'Number', value: cow.cowId },
    ...(cow.earTag ? [{ label: 'Ear tag', value: cow.earTag }] : []),
    { label: 'Born', value: formatBorn(cow) },
    ...(age ? [{ label: 'Age', value: age }] : []),
    { label: 'Sex', value: cow.sex },
    { label: 'Breed', value: breedLabel(cow) },
    ...(cow.markings ? [{ label: 'Coat', value: cow.markings }] : []),
    ...(cow.lactation ? [{ label: 'Milk', value: cow.lactation === 'Milking' ? 'In milk' : 'Dry' }] : []),
    ...(cow.zone ? [{ label: 'Grazes', value: `Zone ${cow.zone}` }] : []),
    { label: 'Joined Aura', value: cow.bornAtAura ? 'Born at the estate' : cow.joined ? formatDate(cow.joined) : 'Unknown' },
  ]

  const share = async () => {
    const url = `${window.location.origin}${cowHref(cow)}`
    try {
      if (navigator.share) { await navigator.share({ title: `${cow.name} — Cows of Aura`, url }); return }
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch { /* the reader dismissed the share sheet */ }
  }

  /* The passport shows the animal herself: her photograph. The plates
     belong to the index. Where there is no photograph yet, her green
     plate stands in, the same drawing the reader just clicked. */
  const photoMissing = cow.hasPlates && !cow.hasPhoto
  const img = cowImage(cow, 'photo')
  const alt = !img ? '' : photoMissing ? `${cow.name}, drawn in green ink` : `${cow.name}, photographed at the estate`

  return (
    <div className={`li-pass${shown ? ' is-shown' : ''}`}>
      <div className="li-pass__dim" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        className="li-pass__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="li-pass-name"
      >
        <div className="li-pass__bar">
          <button type="button" className="label li-pass__nav" onClick={() => onMove(prev.slug)} aria-label={`Previous: ${prev.name}`}>← {prev.name}</button>
          <button type="button" className="label li-pass__nav" onClick={() => onMove(next.slug)} aria-label={`Next: ${next.name}`}>{next.name} →</button>
          <span className="li-pass__grow" />
          <span className="label li-pass__pos">{i + 1} of {list.length}</span>
          <button ref={closeRef} type="button" className="li-pass__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <figure className={`li-pass__fig${photoMissing ? ' is-stand-in' : ''}`}>
          {img
            // eslint-disable-next-line @next/next/no-img-element
            ? <img key={img} src={img} alt={alt} width={895} height={692} />
            : <PlateToCome label={`${cow.name}’s photograph is still to come`} />}
        </figure>
        {photoMissing && <p className="label li-pass__note">No photograph yet. This is {cow.name}’s drawing.</p>}

        <div className="li-pass__body">
          {(birthday || newest) && (
            <p className="label li-pass__flag">
              <span className="li-dot" aria-hidden />
              {birthday ? `It’s ${cow.name}’s birthday today. ${pron} is ${years}.` : 'The newest member of the herd'}
            </p>
          )}
          <p className="label li-pass__id">{cow.cowId}</p>
          <h2 id="li-pass-name" className="li-pass__name">{cow.name}</h2>

          {cow.nameMeaning && (
            <div className="li-pass__meaning">
              <p className="label">The name</p>
              <p className="p1">{cow.nameMeaning}</p>
            </div>
          )}

          <SpecTable standalone={false} title="The record" rows={rows} />

          {milk && (
            <div className="li-pass__milk">
              <p className="label">{isMale(cow) ? 'Milk' : 'Her milk'}</p>
              {milk.last30Days > 0 ? (
                <p className="p1">
                  {amount(milk.last30)} L in the last 30 days, about {amount(milk.perDay30)} litres per logged day.
                  {' '}<span className="li-pass__muted">Records from {dayMonth(milk.firstMilked!, true)}; {amount(milk.total)} L recorded in this history window.</span>
                </p>
              ) : (
                <p className="p1">
                  No quantities recorded in the last 30 calendar days.
                  {' '}<span className="li-pass__muted">{amount(milk.total)} L logged, last on {dayMonth(milk.lastMilked!, true)}.</span>
                </p>
              )}
              <p className="p2 li-pass__muted">{milk.missingSessions} missing session readings in the {snapshot.historyDays}-day history window. Figures sum known readings and may be incomplete.</p>
              {milk.weeks.length > 1 && <WeekChart weeks={milk.weeks} unit="litres" caption="Known litres per logged day, by week" compact />}
              <p className="label li-pass__muted">Logged to {dayMonth(milk.lastMilked!, true)}</p>
            </div>
          )}

          {(dam || calves.length > 0) && (
            <div className="li-pass__family">
              <p className="label">Family</p>
              <div className="li-pass__chain">
                {dam && <Kin cow={dam} role="Mother" onMove={onMove} />}
                {dam && <span className="li-pass__arrow" aria-hidden>→</span>}
                <Kin cow={cow} role={cow.name} self />
                {calves.length > 0 && <span className="li-pass__arrow" aria-hidden>→</span>}
                {calves.map((c) => <Kin key={c.slug} cow={c} role={`${isMale(c) ? 'Son' : 'Daughter'}${c.born ? `, born ${formatBorn(c, true).replace(/^\d+ /, '')}` : ''}`} onMove={onMove} />)}
              </div>
              {/* Brothers and sisters by the same mother, named the way the
                  herd team would say it: Sister Saturn, Brothers Chotu and Guru. */}
              {[
                { kin: siblings.filter((s) => !isMale(s)), one: 'Sister', many: 'Sisters' },
                { kin: siblings.filter((s) => isMale(s)), one: 'Brother', many: 'Brothers' },
              ].filter((g) => g.kin.length).map((g) => (
                <p key={g.one} className="p2 li-pass__sibs">
                  <span className="label li-pass__rel">{g.kin.length === 1 ? g.one : g.many}</span>{' '}
                  {g.kin.map((s, n) => (
                    <span key={s.slug}>
                      <a href={cowHref(s)} onClick={(e) => { e.preventDefault(); onMove(s.slug) }}>{s.name}</a>
                      {n < g.kin.length - 2 ? ', ' : n === g.kin.length - 2 ? ' and ' : ''}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          )}
          {!dam && (
            <p className="p2 li-pass__sibs"><span className="label li-pass__rel">Mother</span> Unknown</p>
          )}

          <div className="li-pass__acts">
            <ArrowCta onClick={share}>{copied ? 'Link copied' : `Share ${cow.name}`}</ArrowCta>
          </div>
        </div>
      </div>
    </div>
  )
}

function Kin({ cow, role, self, onMove }: { cow: Cow; role: string; self?: boolean; onMove?: (slug: string) => void }) {
  const inner = (
    <>
      <span className="li-kin__plate">
        {cowImage(cow, 'green')
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={cowImage(cow, 'green')!} alt="" width={895} height={692} loading="lazy" />
          : <PlateToCome small label="To come" />}
      </span>
      <span className="label li-kin__n">{cow.name} <span className="li-kin__id">{shortId(cow)}</span></span>
      <span className="label li-kin__r">{self ? 'This record' : role}</span>
    </>
  )
  if (self) return <span className="li-kin is-self">{inner}</span>
  return (
    <a className="li-kin" href={cowHref(cow)} onClick={(e) => { e.preventDefault(); onMove?.(cow.slug) }}>
      {inner}
    </a>
  )
}
