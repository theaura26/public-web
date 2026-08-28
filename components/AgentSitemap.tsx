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

/* Agent map — every published route (reworked editorials/places + the
   journals live on theaura.life), matching sitemap.xml. Two not-yet-
   published journals (idea, vedic) show as "coming soon" in the human menu
   and are kept out of this map until they launch. */
export const SITEMAP: SitemapEntry[] = [
  {
    href: '/',
    label: 'Home',
    topic: 'Aura overview — land, herd, practice',
    summary: 'Aura is a regenerative ecosystem of working plantations and creative studios, designed to operate on the timeline of the land rather than the timeline of markets.',
    facts: [
      { label: 'Founder', value: 'Arvind Singh' },
      { label: 'Founded', value: '2024' },
      { label: 'HQ', value: 'Singapore' },
      { label: 'Active sites', value: 'Mudigere (India), Ohara (Japan)' },
      { label: 'Planned sites', value: 'Munduk (Indonesia), Punakha (Bhutan)' },
    ],
    related: ['/reason', '/herd', '/ohara'],
  },
  {
    href: '/reason',
    label: 'The Reason',
    topic: 'Why Aura exists — restoration over extraction',
    summary: 'Aura was built to restore what sustains us. The reason runs through every pillar: regenerative agriculture, slow-living hospitality, embedded creative practice, and operating systems that honour land before output.',
    related: ['/brand', '/herd', '/circular'],
  },
  {
    href: '/brand',
    label: 'Our Brand',
    topic: 'Brand system, intelligences, design language',
    summary: 'The Aura brand is built around three intelligences — Natural, Human, and Machine — converging into one regenerative practice. Design language favours silence over noise, depth over width, memory over trend.',
    facts: [
      { label: 'Intelligences', value: 'Natural · Human · Machine' },
      { label: 'Type system', value: 'Bricolage Grotesque (display + body) · DM Mono (label) · Mynerve (pull quote)' },
    ],
    related: ['/reason', '/artistry'],
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
    related: ['/mudigere', '/ohara'],
  },
  {
    href: '/mudigere',
    label: 'Mudigere',
    topic: 'Aura Estate — the Indian estate',
    summary: 'Aura’s Indian estate: 150 acres at 3,600 ft in the Western Ghats of Karnataka. A four-story shade-grown polyculture of coffee, pepper, cardamom, and areca, worked with a 52-head Malnad Gidda herd and a combined biodynamic and Vedic preparation programme.',
    facts: [
      { label: 'Estate', value: 'Aura Estate, Mudigere, Karnataka' },
      { label: 'Area', value: '150 acres' },
      { label: 'Altitude', value: '3,600 ft (Western Ghats)' },
      { label: 'Herd', value: '52 Malnad Gidda' },
    ],
    related: ['/herd', '/circular', '/shade'],
  },
  {
    href: '/ohara',
    label: 'Ohara',
    topic: 'The Kyoto estate — Asa and Niwa',
    summary: 'Aura’s Japanese estate in Ohara, north of Kyoto — a valley kept on its own time. Morning (Asa) and evening (Niwa) rhythms, a tea house, a thirty-year-old garden, and craft in fermentation, pottery, indigo, and kintsugi.',
    facts: [
      { label: 'Location', value: 'Ohara, north of Kyoto, Japan' },
      { label: 'Rhythm', value: 'Asa (morning) · Niwa (evening)' },
    ],
    related: ['/artistry', '/shade'],
  },
  {
    href: '/herd',
    label: 'Ecosystem Engineers',
    topic: 'The herd as the estate’s biological engine',
    summary: 'Aura runs a 52-head herd of indigenous Malnad Gidda at Mudigere as the estate’s biological engine — the living source of every soil preparation. Each animal is individually passported, grazes the same 150 acres it feeds, and its dung and urine are measured back into the fertility programme; traceability runs animal → preparation → soil → cherry → cup.',
    facts: [
      { label: 'Herd', value: '52 Malnad Gidda (indigenous breed)' },
      { label: 'Role', value: 'Biological engine — dung/urine for all preparations' },
      { label: 'Record', value: 'Individual passport per animal' },
    ],
    related: ['/circular', '/shade', '/mudigere'],
  },
  {
    href: '/circular',
    label: 'Circular Intelligence',
    topic: 'The closed fertility loop — CPP and Jeevamrit',
    summary: 'The closed fertility loop at Mudigere: the herd’s dung and urine remade by hand into measured fertility — CPP (Cow Pat Pit) compost and Jeevamrit microbial culture — tested before it touches the soil, with a 90-day feedback loop cross-referencing preparation to soil outcome.',
    facts: [
      { label: 'CPP', value: '~2,420 kg/yr across 14 hand-turned pits' },
      { label: 'Jeevamrit', value: '~154,000 L/yr, stirred twice daily' },
      { label: 'Principle', value: 'Nothing imported, nothing wasted, everything measured' },
    ],
    related: ['/herd', '/shade', '/mudigere'],
  },
  {
    href: '/shade',
    label: 'The Light Instrument',
    topic: 'Shade whiskering — data-driven canopy management',
    summary: 'Shade whiskering, the selective removal of shade-tree branches to regulate light on the coffee, run as a measured practice. In the 2026 pre-monsoon season Aura whiskered ~80 acres against lux readings and CCRI light targets, prescribed block by block and validated after cutting.',
    facts: [
      { label: 'Practice', value: 'Shade whiskering (selective canopy pruning)' },
      { label: 'Light targets', value: 'Arabica 50–70k lux · Robusta 70–90k lux (CCRI)' },
      { label: 'Sampling', value: 'Five clusters × ten readings = 50 lux readings/acre' },
      { label: 'Scope', value: '~80 acres, May–June pre-monsoon window' },
    ],
    related: ['/circular', '/herd', '/mudigere'],
  },
  {
    href: '/ecology',
    label: 'The Health Index',
    topic: 'Whole-farm ecological monitoring — the Ecological Health Index',
    summary: 'Aura reads its estate as one living system, above ground and below — retained wood and the saprophytic fungi that eat it, forest islands, soil respiration, earthworms, roots — and folds fifteen monitoring programmes into one Ecological Health Index per block.',
    facts: [
      { label: 'Approach', value: 'Measure ecological outcomes, not activities' },
      { label: 'Wood biomass', value: 'Retained in-block; decay class I–V; fungal carbon' },
      { label: 'Index', value: 'Ecological Health Index — 0–100 composite per block' },
      { label: 'Programmes', value: '~15 (respiration, worms, roots, fungi, birds, water, carbon…)' },
    ],
    related: ['/circular', '/shade', '/herd'],
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
    related: ['/ohara', '/mudigere'],
  },
  {
    href: '/wisdom',
    label: 'Moral Spine',
    topic: 'The things we will not do — restraint as intelligence',
    summary: 'Aura’s moral spine: attention treated as a moral choice and restraint as a form of intelligence — a running account of the lines the estate holds even when it could cross them.',
    related: ['/reason', '/brand'],
  },
  {
    href: '/living-systems',
    label: 'Living Systems',
    topic: 'A forest that produces crops — the canopy read as one organism',
    summary: 'The estate read as one living organism: a four-story shade-grown polyculture where crop, canopy, understorey and soil are treated as a single system rather than separate yields.',
    related: ['/ecology', '/shade', '/land'],
  },
  {
    href: '/coffee',
    label: 'Our Bean Story',
    topic: 'Six lots, one harvest — one Arabica, six fermentations',
    summary: 'One harvest of a single Arabica taken through six distinct fermentation methods — six separate lots and six cups — the estate’s coffee read as an experiment in method.',
    related: ['/fermentation', '/circular', '/mudigere'],
  },
  {
    href: '/rta',
    label: 'Rta',
    topic: 'Right time, right action — the Vedic order behind each decision',
    summary: 'Ṛta — the Vedic principle of right time and right action — as the ordering logic behind estate decisions, timed to season, moon and the state of the ground rather than the calendar.',
    related: ['/biodynamic', '/circular'],
  },
  {
    href: '/fermentation',
    label: 'Fermentation',
    topic: 'Three fermentation disciplines — coffee, pepper, cow dung',
    summary: 'Three fermentation disciplines worked on one estate — coffee, pepper and cow dung — each a controlled microbial process feeding a different part of the system, from cup to soil.',
    related: ['/coffee', '/circular', '/biodynamic'],
  },
  {
    href: '/land',
    label: 'The Land',
    topic: 'Land as ancestry — Mudigere and Ohara in dialogue',
    summary: 'The estate and the sanctuary in dialogue — Mudigere in the Western Ghats and Ohara north of Kyoto — held as ancestry and stewardship across generations rather than acreage.',
    related: ['/mudigere', '/ohara', '/ecology'],
  },
  {
    href: '/biodynamic',
    label: 'A Living Organism',
    topic: 'A worldview worked as method — BD 500–508, Jeevamrit, Panchgavya',
    summary: 'Biodynamics at Mudigere as a worldview worked as method: the BD 500–508 preparations, Jeevamrit microbial culture and Panchgavya, all driven by the herd as the estate’s biological engine.',
    facts: [
      { label: 'Preparations', value: 'BD 500–508 · Jeevamrit · Panchgavya' },
    ],
    related: ['/circular', '/herd', '/rta'],
  },
  {
    href: '/atelier',
    label: 'Atelier',
    topic: 'The studios — Natural Intelligence applied to story, systems and place',
    summary: 'Origin, Engine, Hospitality. Three studios applying Natural Intelligence to story, systems, and place — built on regenerative land in Mudigere, Karnataka and Ohara, Kyoto. For monastic polymaths and crazy misfits.',
    facts: [
      { label: 'Studios', value: 'Origin · Engine · Hospitality' },
      { label: 'Previously', value: '/studios — redirected permanently to /atelier' },
    ],
    related: ['/artistry', '/brand', '/residency'],
  },
  {
    href: '/sanctuary',
    label: 'Sanctuary',
    topic: 'The land in rhythm — estate and sanctuary as one ecosystem',
    summary: 'Aura Sanctuary — the land in rhythm. A 1000-year regenerative ecosystem across Mudigere, Ohara, and coming valleys in Munduk and Punakha.',
    facts: [
      { label: 'Active', value: 'Mudigere (India) · Ohara (Japan)' },
      { label: 'Coming', value: 'Munduk (Indonesia) · Punakha (Bhutan)' },
    ],
    related: ['/mudigere', '/ohara', '/land'],
  },
  {
    href: '/provenance',
    label: 'Provenance',
    topic: 'Cherry to cup, written down — a signed record in place of legacy certification',
    summary: 'Aura replaces legacy certification with a live, sensor-fed, signed record. Blockchain-verified provenance from the Mudigere estate — cherry to cup, on chain.',
    facts: [
      { label: 'Method', value: 'Live sensor data, signed at source, kept in plain formats' },
      { label: 'Replaces', value: 'Legacy third-party certification' },
    ],
    related: ['/coffee', '/mudigere', '/ecology'],
  },
  {
    href: '/areca',
    label: 'Areca — The Sentinel Palm',
    topic: 'Areca as the mid-canopy and the cultural spine of coastal Karnataka',
    summary: 'Areca catechu as the mid-canopy of the Aura estate. Vertical architecture, five-layer shade system, and the cultural spine of coastal Karnataka.',
    facts: [
      { label: 'Role', value: 'Mid-canopy in the five-layer shade system' },
      { label: 'Carries', value: 'The pepper vine' },
    ],
    related: ['/pepper', '/shade', '/living-systems'],
  },
  {
    href: '/pepper',
    label: 'Pepper — Malabar Black Gold',
    topic: 'Single-estate Malabar pepper, climbing the areca',
    summary: 'Single-estate Malabar black pepper climbing the areca. Black, white, and green — water-retted and experimentally anaerobic. Grown in the Western Ghats biosphere.',
    facts: [
      { label: 'Types', value: 'Black · White · Green' },
      { label: 'Processing', value: 'Water-retted; experimentally anaerobic' },
    ],
    related: ['/areca', '/fermentation', '/mudigere'],
  },
  {
    href: '/residency',
    label: 'Monastic Polymaths',
    topic: 'An artist residency for natural intelligence',
    summary: 'An embedded, invitation-based residency for monastic polymaths — makers who work across science, craft and code — living on the estate and building for a generational horizon.',
    related: ['/artistry', '/contact'],
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
