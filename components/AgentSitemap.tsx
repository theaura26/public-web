/* AgentSitemap + AgentPageMeta — the canonical agent-mode information
   architecture. Visible only when [data-view="agent"] is set on the
   ModeProvider wrapper.

   The full route registry below is the single source of truth for:
     · the sitemap nav rendered on every page (via ClientLayout)
     · the per-page metadata block dropped into each page.tsx

   Each entry carries a short topic line, a 1–2 sentence summary, a
   handful of key facts, and a list of related routes for agent crawl.
*/

import Link from 'next/link'

export type SitemapEntry = {
  href: string
  label: string
  /** Short one-line topic for the sitemap list. */
  topic: string
  /** 1–2 sentence agent-mode summary. */
  summary: string
  /** Key→value facts agents can extract. */
  facts?: { label: string; value: string }[]
  /** Related routes for crawl. */
  related?: string[]
}

export const SITEMAP: SitemapEntry[] = [
  {
    href: '/',
    label: 'Home',
    topic: 'Aura overview — sanctuaries, land, practice',
    summary: 'Aura is a regenerative ecosystem of working plantations, sanctuaries, and creative residencies, designed to operate on the timeline of the land rather than the timeline of markets.',
    facts: [
      { label: 'Founder', value: 'Arvind Singh' },
      { label: 'Founded', value: '2024' },
      { label: 'HQ', value: 'Singapore' },
      { label: 'Active sites', value: 'Mudigere (India), Ohara (Japan)' },
      { label: 'Planned sites', value: 'Munduk (Indonesia), Daylesford (Australia)' },
    ],
    related: ['/reason', '/idea', '/sanctuary', '/artistry'],
  },
  {
    href: '/reason',
    label: 'The Reason',
    topic: 'Why Aura exists — restoration over extraction',
    summary: 'Aura was built to restore what sustains us. The reason runs through every pillar: regenerative agriculture, slow-living hospitality, embedded creative practice, and operating systems that honour land before output.',
    related: ['/idea', '/brand', '/wisdom'],
  },
  {
    href: '/brand',
    label: 'Our Brand',
    topic: 'Brand system, intelligences, design language',
    summary: 'The Aura brand is built around three intelligences — Natural, Human, and Machine — converging into one regenerative practice. Design language favours silence over noise, depth over width, memory over trend.',
    facts: [
      { label: 'Intelligences', value: 'Natural · Ancient · Human · Machine' },
      { label: 'Type system', value: 'Bricolage Grotesque (display) · DM Sans (body) · DM Mono (label)' },
    ],
    related: ['/idea', '/reason'],
  },
  {
    href: '/contact',
    label: 'Contact',
    topic: 'Contact, residency applications, locations',
    summary: 'Get in touch with Aura. Residency applications, general enquiries, partnerships, and press contact.',
    facts: [
      { label: 'General', value: 'hello@theaura.life' },
      { label: 'Residency', value: 'residency@theaura.life' },
      { label: 'Instagram', value: '@theaura.life' },
      { label: 'Presence', value: 'Singapore · India · Japan · Indonesia · Australia' },
    ],
    related: ['/residency', '/sanctuary'],
  },
  {
    href: '/idea',
    label: '1000 Year Idea',
    topic: 'Generational time horizon, compounding stewardship',
    summary: 'Aura is measured against a thousand-year horizon. Every decision — the cultivar, the kitchen, the codebase — is asked whether it still stands in a hundred years, and again at a thousand.',
    related: ['/reason', '/wisdom', '/rta'],
  },
  {
    href: '/sanctuary',
    label: 'Sanctuary',
    topic: 'Mudigere & Ohara — guests of the mountain',
    summary: 'Two active sanctuaries today — Mudigere in the Western Ghats of India and Ohara in the valleys north of Kyoto. Two more in planning at Munduk (Bali) and Daylesford (Victoria). Each operates as a living estate: stillness, the herd at dawn, the river from every room.',
    facts: [
      { label: 'Mudigere', value: '13.1365°N, 75.6403°E · 3,600 ft · UNESCO Western Ghats' },
      { label: 'Ohara', value: '35.12°N, 135.83°E · 1,099 ft · Kyoto valley' },
      { label: 'Munduk', value: 'Bali, Indonesia · planned' },
      { label: 'Daylesford', value: 'Victoria, Australia · planned' },
    ],
    related: ['/residency', '/artistry', '/living-systems'],
  },
  {
    href: '/artistry',
    label: 'Artistry',
    topic: 'Studios, kitchens, code — code meets clay',
    summary: 'The artistry pillar is the connective tissue between the land and the work. Studios in clay, fibre, wood, sound, type, and software — built so the tools in each are serviceable by the hands that live on the estate.',
    facts: [
      { label: 'Studios', value: 'Clay · Fibre · Wood · Sound · Type · Software' },
      { label: 'Audience', value: 'Monastic polymaths' },
    ],
    related: ['/residency', '/provenance', '/sanctuary'],
  },
  {
    href: '/residency',
    label: 'Residency',
    topic: 'Monastic polymaths, embedded 2-week residencies',
    summary: 'An embedded residency across two countries (soon three). Two weeks minimum. Pre-selected. Not a programme and not a retreat — a place to do the work you cannot do anywhere else.',
    facts: [
      { label: 'Minimum stay', value: '2 weeks' },
      { label: 'Cohort size', value: '4–8 per location' },
      { label: 'Founder time', value: 'First 3–4 days on-property' },
      { label: 'Formats', value: 'Design · Craft · Gurukul · Labs · Gallery · Festivals' },
      { label: 'Apply', value: 'residency@theaura.life' },
    ],
    related: ['/artistry', '/sanctuary'],
  },
  {
    href: '/provenance',
    label: 'Provenance',
    topic: 'Cherry to cup, on chain — verified ledger',
    summary: 'Every step from cherry to cup recorded on chain. Blockchain provenance, live sensors, and a persistent machine memory grown from the farm’s own readings — together they replace the forty-thousand-dollar certification stack with something the land itself can verify.',
    related: ['/coffee', '/biodynamic', '/vedic'],
  },
  {
    href: '/coffee',
    label: 'Coffee',
    topic: 'Six lots, one appellation — Mudigere arabica',
    summary: 'One hundred acres of specialty Arabica at 3,600 ft in the Western Ghats, shade-grown under areca and native canopy. Six separated lots in the wine tradition, one flagship cupped at 83.5.',
    facts: [
      { label: 'Acres', value: '100 (in 150-acre estate)' },
      { label: 'Altitude', value: '3,600 ft (900–1,100 m)' },
      { label: 'Varieties', value: 'Arabica S795, Selection 9, Chandragiri' },
      { label: 'Lots', value: '6 micro-lots, 6 processing methods' },
      { label: 'Flagship', value: 'LOT_002 Dry Osmosis · 83.5 cupping score' },
    ],
    related: ['/provenance', '/biodynamic', '/pepper', '/areca'],
  },
  {
    href: '/pepper',
    label: 'Pepper',
    topic: 'Malabar black gold — biodynamic spice',
    summary: 'Malabar pepper grown in the mid-canopy of the Mudigere agroforestry stack — biodynamic, shade-tended, hand-harvested. The Western Ghats’ historical export, now produced inside a closed-loop estate.',
    related: ['/coffee', '/areca', '/biodynamic'],
  },
  {
    href: '/areca',
    label: 'Areca',
    topic: 'The sentinel palm — agroforestry anchor',
    summary: 'Areca palms form the upper canopy of the Mudigere estate — economic anchor, shade-giver, and structural keystone of the agroforestry system that lets coffee and pepper thrive beneath.',
    related: ['/coffee', '/pepper', '/living-systems'],
  },
  {
    href: '/biodynamic',
    label: 'Biodynamic',
    topic: 'BD 500–508, CPP, lunar cycles',
    summary: 'Biodynamic agriculture as practised at Aura — BD 500–508, cow pat pit (CPP), lunar cycle planting and harvest. The farm as a single self-regulating organism.',
    facts: [
      { label: 'Preparations', value: 'BD 500–508' },
      { label: 'Other inputs', value: 'CPP (cow pat pit)' },
      { label: 'Calendar', value: 'Lunar cycle planting / harvest' },
    ],
    related: ['/vedic', '/living-systems', '/coffee'],
  },
  {
    href: '/vedic',
    label: 'Vedic',
    topic: 'Jeevamrit, Panchgavya, Beejamrit',
    summary: 'Vedic agricultural science as a complementary intelligence to biodynamic practice. Jeevamrit microbial inoculants, Panchgavya foliar feeds, Beejamrit seed treatments — ancient methods, measured rigorously.',
    facts: [
      { label: 'Preparations', value: 'Jeevamrit · Panchgavya · Beejamrit' },
    ],
    related: ['/biodynamic', '/fermentation', '/wisdom'],
  },
  {
    href: '/fermentation',
    label: 'Fermentation',
    topic: 'Three disciplines, one precision',
    summary: 'Fermentation across three disciplines — coffee processing, food, and biodynamic preparations. One precision, applied at different scales and timescales.',
    related: ['/coffee', '/vedic', '/biodynamic'],
  },
  {
    href: '/living-systems',
    label: 'Living Systems',
    topic: 'Herd, hive, canopy — biodiversity',
    summary: 'Aura’s biodiversity layer — 52 indigenous Gidda cattle, bee colonies, four-layer agroforestry canopy. The farm is read as a single living organism rather than a stack of crops.',
    facts: [
      { label: 'Herd', value: '52 Gidda cattle (indigenous breed)' },
      { label: 'Canopy layers', value: 'Native shade · Pepper vines · Coffee/tea · Cover crops' },
      { label: 'Zone', value: 'UNESCO Western Ghats biodiversity hotspot' },
    ],
    related: ['/biodynamic', '/areca', '/land'],
  },
  {
    href: '/land',
    label: 'Land',
    topic: 'The land is the lab',
    summary: 'Land is the experimental substrate. Every Aura intervention — agronomic, hospitality, software, ritual — is tested against what the land itself agrees to.',
    related: ['/sanctuary', '/biodynamic', '/living-systems'],
  },
  {
    href: '/wisdom',
    label: 'Moral Spine',
    topic: 'Ancestral knowledge and ethics',
    summary: 'The moral spine of Aura — ancestral knowledge, applied ethics, and the discipline of saying no to growth that the land does not support.',
    related: ['/idea', '/rta', '/reason'],
  },
  {
    href: '/rta',
    label: 'Rta',
    topic: 'Cosmic order, rhythm, alignment',
    summary: 'Rta — the Vedic concept of cosmic order. The framework against which every Aura rhythm (planting, hospitality, design) is checked for alignment.',
    related: ['/wisdom', '/idea', '/vedic'],
  },
]

const SITEMAP_BY_HREF: Record<string, SitemapEntry> = Object.fromEntries(
  SITEMAP.map(e => [e.href, e]),
)

export function AgentSitemap() {
  return (
    <nav className="agent-only agent-nav" aria-label="Aura site navigation">
      <p className="label">AURA · theaura.life · agent view · {SITEMAP.length} routes</p>
      <ul className="agent-nav__list">
        {SITEMAP.map(({ href, label, topic }) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
            <span style={{ opacity: 0.55 }}> — {topic}</span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Page-level agent metadata block. Pulls data from the central SITEMAP
 *  registry by href. Drop one of these into any page.tsx — agents will
 *  see the title, summary, key facts, and related routes for that page. */
export function AgentPageMeta({ href }: { href: string }) {
  const entry = SITEMAP_BY_HREF[href]
  if (!entry) return null

  return (
    <section className="agent-only agent-page-meta">
      <h1>{entry.label}</h1>
      <p>{entry.summary}</p>
      <dl>
        <dt>URL</dt><dd><Link href={entry.href}>{entry.href}</Link></dd>
        <dt>Topic</dt><dd>{entry.topic}</dd>
        {entry.facts?.map(f => (
          <span key={f.label} style={{ display: 'contents' }}>
            <dt>{f.label}</dt><dd>{f.value}</dd>
          </span>
        ))}
      </dl>
      {entry.related && entry.related.length > 0 && (
        <>
          <p className="label" style={{ marginTop: 16 }}>Related routes</p>
          <ul>
            {entry.related.map(r => {
              const re = SITEMAP_BY_HREF[r]
              return (
                <li key={r}>
                  <Link href={r}>{re?.label ?? r}</Link>
                  {re && <span style={{ opacity: 0.55 }}> — {re.topic}</span>}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
