export type CowType = 'Cow' | 'Bull' | 'Bullock' | 'Heifer' | 'Calf' | 'Unknown'

type Imported = {
  slug: string
  name: string
  cowId: string
  earTag?: string
  type: CowType
  /** Female, Male, Castrated Male or Unknown, as the register has it. */
  sex: string
  /** YYYY-MM-DD, or null when the register says Unknown. */
  born: string | null
  /** The register's DOB_Confidence was Approximate: show the year only,
   *  never celebrate it as a birthday. */
  bornEstimated?: boolean
  /** The day the animal entered the herd; her birth date if she was
   *  born at the estate. Drives "newest member". */
  joined: string | null
  bornAtAura: boolean
  breed: string
  breedType?: string
  /** Colour and marks, from the register. */
  markings: string | null
  /** Slugs of the mother and father, or null for Unknown. */
  dam: string | null
  sire: string | null
  /** Functional_Role: Milk, Breeding, Calf Rearing… */
  role: string | null
  lactation?: 'Milking' | 'Dry'
  zone: string | null
  hasPlates: boolean
  hasPhoto: boolean
}

export type Cow = Imported & { nameMeaning: string | null; images: Partial<Record<ImageKind, string>> }

export type Ymd = { y: number; m: number; d: number }

export const isMale = (c: Cow) => /male/i.test(c.sex) && !/female/i.test(c.sex)
export const pronouns = (c: Cow) => (isMale(c) ? { s: 'he', o: 'him', p: 'his' } : { s: 'she', o: 'her', p: 'her' })

export type ImageKind = 'photo' | 'green' | 'tone'

/** The green and tone plates, and the photograph. Each is independent:
 *  an animal can be photographed before she is drawn (Nandini, Karuna)
 *  or drawn before she is photographed. A missing photograph falls back
 *  to the green plate; a missing plate is null, and the caller shows a
 *  "drawing to come" plate. */
export function cowImage(cow: Cow, kind: ImageKind): string | null {
  return cow.images[kind] ?? (kind === 'photo' ? cow.images.green ?? null : null)
}

export function cowHref(cow: Cow): string {
  return `/living-index/cows/${cow.slug}`
}

/** The number without its prefix, for the card: COW-0001 → 0001. */
export function shortId(cow: Cow): string {
  return cow.cowId.replace(/^COW-/, '')
}

/** The work an animal does, in words. A calf being reared has none yet. */
export function workLabel(cow: Cow): string {
  if (!cow.role) return 'Unknown'
  if (/calf rearing/i.test(cow.role)) return 'Too young to work yet'
  return cow.role
}

/** Breed with its type where the type adds something: Gir, Malnad Gidda. */
export function breedLabel(cow: Cow): string {
  return cow.breedType && !/indigenous|unknown/i.test(cow.breedType) && cow.breedType !== cow.breed
    ? `${cow.breed} · ${cow.breedType.toLowerCase()}`
    : cow.breed
}

/* ── Dates ──────────────────────────────────────────────────────────── */

export function parseYmd(iso: string): Ymd {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}

export function toIso({ y, m, d }: Ymd): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Today on the estate. A birthday belongs to Mudigere's calendar, so a
 *  reader in another time zone sees the same birthday the herd does. */
export function estateToday(now: Date = new Date()): Ymd {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return { y: get('year'), m: get('month'), d: get('day') }
}

function dayNumber({ y, m, d }: Ymd): number {
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000)
}

export function daysBetween(a: Ymd, b: Ymd): number {
  return dayNumber(b) - dayNumber(a)
}

/** Whole years and remaining months, counted the way people count
 *  birthdays: the month only ticks over on the day of the month. */
export function ageOn(born: string, today: Ymd): { years: number; months: number } {
  const b = parseYmd(born)
  let months = (today.y - b.y) * 12 + (today.m - b.m)
  if (today.d < b.d) months -= 1
  months = Math.max(0, months)
  return { years: Math.floor(months / 12), months: months % 12 }
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/** "1 year, 1 month" for the passport; "About 12 years" when the date
 *  of birth is an estimate; under a month, in days. */
export function ageLong(cow: Cow, today: Ymd): string | null {
  if (!cow.born) return null
  const { years, months } = ageOn(cow.born, today)
  if (cow.bornEstimated) return years > 0 ? `About ${plural(years, 'year', 'years')}` : 'Under a year'
  if (years === 0 && months === 0) {
    const days = Math.max(0, daysBetween(parseYmd(cow.born), today))
    return days === 0 ? 'Born today' : plural(days, 'day', 'days')
  }
  if (years === 0) return plural(months, 'month', 'months')
  if (years < 2 && months) return `${plural(years, 'year', 'years')}, ${plural(months, 'month', 'months')}`
  return plural(years, 'year', 'years')
}

/** "1 yr 1 mo", "3 mo", "c. 12 yrs" — for cards and lists. */
export function ageShort(cow: Cow, today: Ymd): string | null {
  if (!cow.born) return null
  const { years, months } = ageOn(cow.born, today)
  if (cow.bornEstimated) return years > 0 ? `c. ${years} yr${years === 1 ? '' : 's'}` : 'c. 1 yr'
  if (years === 0) return months === 0 ? 'New' : `${months} mo`
  if (years < 2) return months ? `${years} yr ${months} mo` : `${years} yr`
  return `${years} yrs`
}

/** "3 months old", "about 12 years old" — for sentences. */
export function ageWords(cow: Cow, today: Ymd): string {
  if (!cow.born) return ''
  const { years, months } = ageOn(cow.born, today)
  if (cow.bornEstimated) return `about ${plural(Math.max(1, years), 'year', 'years')} old`
  if (years === 0) return months <= 1 ? 'a few weeks old' : `${months} months old`
  return `${plural(years, 'year', 'years')} old`
}

/** A 29 February birthday is kept on 28 February in other years. An
 *  estimated date of birth is never a birthday. */
export function isBirthday(cow: Cow, today: Ymd): boolean {
  if (!cow.born || cow.bornEstimated) return false
  const b = parseYmd(cow.born)
  if (b.y >= today.y) return false
  if (b.m === 2 && b.d === 29) {
    const leap = (today.y % 4 === 0 && today.y % 100 !== 0) || today.y % 400 === 0
    return today.m === 2 && today.d === (leap ? 29 : 28)
  }
  return b.m === today.m && b.d === today.d
}

export function birthdaysOn(today: Ymd, COWS: Cow[]): Cow[] {
  return COWS.filter((c) => isBirthday(c, today))
}

/** How long an animal stays "the newest member of the herd". */
export const NEWEST_FOR_DAYS = 120

/** The most recent arrival, while she is still new. */
export function newestMember(today: Ymd, COWS: Cow[]): Cow | undefined {
  let best: Cow | undefined
  let bestDay = -Infinity
  for (const c of COWS) {
    if (!c.joined) continue
    const day = dayNumber(parseYmd(c.joined))
    if (day > bestDay && day <= dayNumber(today)) { best = c; bestDay = day }
  }
  if (!best || !best.joined) return undefined
  return daysBetween(parseYmd(best.joined), today) <= NEWEST_FOR_DAYS ? best : undefined
}

/** The eldest animals by date of birth; more than one when they tie. */
export function eldest(COWS: Cow[]): Cow[] {
  const dated = COWS.filter((c) => c.born)
  if (!dated.length) return []
  const first = dated.reduce((a, b) => (a.born! <= b.born! ? a : b)).born
  return dated.filter((c) => c.born === first)
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** "10 September 2025"; "c. 2014" when estimated; "Unknown" when blank. */
export function formatBorn(cow: Cow, short = false): string {
  if (!cow.born) return 'Unknown'
  const { y, m, d } = parseYmd(cow.born)
  if (cow.bornEstimated) return `c. ${y}`
  return `${d} ${short ? MONTHS[m - 1].slice(0, 3) : MONTHS[m - 1]} ${y}`
}

export function formatDate(iso: string, short = false): string {
  const { y, m, d } = parseYmd(iso)
  return `${d} ${short ? MONTHS[m - 1].slice(0, 3) : MONTHS[m - 1]} ${y}`
}

/** "A", "A and B", "A, B and C". */
export function listNames(names: string[]): string {
  if (names.length < 2) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

/** Animals with a drawing — the only ones the page can put a face to. */


/** A stable pick for a given day — the cow the page offers first, the
 *  same for every reader until midnight on the estate. */
export function cowOfTheDay(today: Ymd, COWS: Cow[]): Cow | undefined {
  const drawn = COWS.filter(c => c.hasPlates)
  const pool = drawn.length ? drawn : COWS
  const n = dayNumber(today)
  return pool[((n * 2654435761) >>> 0) % pool.length]
}

export const TYPE_ORDER: CowType[] = ['Cow', 'Bull', 'Bullock', 'Heifer', 'Calf', 'Unknown']
export const TYPE_PLURAL: Record<CowType, string> = {
  Cow: 'Cows', Bull: 'Bulls', Bullock: 'Bullocks', Heifer: 'Heifers', Calf: 'Calves', Unknown: 'Unspecified',
}
