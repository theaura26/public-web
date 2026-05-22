import Reveal from '@/components/RevealOnScroll'
import { Placeholder, ScrollHighlight } from '@/components/article/Article'
import { StudioPillarMedia } from '@/components/StudioPillarMedia'

/* ═══════════════════════════════════════════
   STUDIOS — Aura's working capabilities.
   Three studios. One ethos: Natural Intelligence.

   Structure:
   1. Display title    — STUDIOS. (full-width, justified edge-to-edge)
   2. ExpandingBanner  — placeholder hero image
   3. Ethos            — Natural Intelligence is the way of doing
   4. Three studios    — Origin · Engine · Hospitality (pillar grid)
   5. Monastic spirit  — polymaths and misfits, learning + creating
   6. In practice      — craft, technology, innovation, impact
   7. ExpandingBanner  — placeholder body image (before invitation)
   8. Invitation       — soft handoff to /contact

   Image placeholders are intentional — production assets to follow.
═══════════════════════════════════════════ */

/* SEO + GEO metadata.
   - Title leads with the brand, then the page, so search snippets show
     "Studios — Aura" rather than the generic "Studios".
   - Description names the three studios and grounds them in the
     locations (Mudigere, Karnataka and Ohara, Kyoto) for geographic
     intent — searchers looking for "regenerative design studio Karnataka"
     or "monastic polymath residency Japan" should match here.
   - openGraph mirrors the canonical metadata and adds an image so
     share unfurls in Slack / iMessage / Discord render properly.
   - twitter card uses summary_large_image so the OG image fills the
     card on x.com link previews. */
export const metadata = {
  /* `title` is a plain string here on purpose: the root layout's
     metadata.title.template ('%s — Aura') wraps it. Set title to
     'Studios' so the rendered <title> becomes 'Studios — Aura' —
     repeating 'Aura' here would produce 'Studios — Aura — Aura'. */
  title: 'Studios',
  description:
    'Origin, Engine, Hospitality. Three studios applying Natural Intelligence to story, systems, and place — built on regenerative land in Mudigere, Karnataka and Ohara, Kyoto. For monastic polymaths and crazy misfits.',
  keywords: [
    'Aura studios',
    'Natural Intelligence',
    'regenerative design',
    'monastic polymath',
    'Mudigere',
    'Karnataka',
    'Ohara',
    'Kyoto',
    'brand identity studio',
    'sensors and agents',
    'hospitality design',
  ],
  alternates: { canonical: '/studios' },
  openGraph: {
    type: 'website',
    url: 'https://theaura.life/studios',
    siteName: 'Aura',
    title: 'Studios — Aura',
    description:
      'Origin, Engine, Hospitality. Three studios applying Natural Intelligence to story, systems, and place. The future cannot automate what is deeply human.',
    images: [
      {
        url: '/aura-studios/aura-studios.jpg',
        width: 1600,
        height: 900,
        alt: 'Aura Studios — natural intelligence at work',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studios — Aura',
    description:
      'Three studios applying Natural Intelligence to story, systems, and place. The future cannot automate what is deeply human.',
    images: ['/aura-studios/aura-studios.jpg'],
  },
}

type Studio = {
  name: string
  lead: string
  body: string
  image: string
  video?: string
  alt: string
}

const STUDIOS: Studio[] = [
  {
    name: 'Origin',
    lead: 'Story, voice, identity.',
    body: 'Where a company is from, what it is for, and how it should sound. Naming, narrative, design language, art direction — the work that decides what the rest of the system is allowed to do.',
    image: '/aura-studios/aura-design.jpg',
    alt: 'Aura Origin studio — story, voice, identity, design language',
  },
  {
    name: 'Engine',
    lead: 'Systems that read the land.',
    body: 'Sensors, models, and quiet automations that listen before they act. We build interfaces, agents, and data flows that translate signal into decision — the machine in service of attention, not in place of it.',
    image: '/aura-studios/aura-technology.jpg',
    video: '/aura-studios/aura-technology.mp4',
    alt: 'Aura Engine studio — sensors, models, agents, data flows',
  },
  {
    name: 'Hospitality',
    lead: 'Places, hosting, and the room itself.',
    body: 'End-to-end sanctuary design — from the soil under the building to the table it ends on. Architecture, kitchen, residency programme, and the operations to keep it running for decades.',
    image: '/aura-studios/aura-hospitality.jpg',
    alt: 'Aura Hospitality studio — sanctuary, architecture, the room itself',
  },
]

export default function StudiosPage() {
  return (
    <>
      {/* ── Display title ────────────────────────────────────
          STUDIOS. set in the same editorial display rhythm as
          the journal heroes — uppercase grotesque, letters
          spread edge-to-edge. The visible letter-spans carry
          the visual weight; the sr-only `.studios-title__plain`
          carries the readable text for screen readers and
          agent mode (which swaps the two via CSS). */}
      <section className="studios-hero">
        <div className="section-w">
          <Reveal>
            <h1 className="studios-title" aria-label="Studios">
              <span className="studios-title__letters" aria-hidden>
                <span>S</span>
                <span>T</span>
                <span>U</span>
                <span>D</span>
                <span>I</span>
                <span>O</span>
                <span>S</span>
              </span>
              <span className="studios-title__plain">Studios</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ── Hero banner ──────────────────────────────────────
          The studios at work — establishing video, same scroll-
          driven blur → clarity → hold gesture as the homepage
          hero moments. */}
      <Placeholder
        src="/aura-studios/aura-studios.mp4"
        poster="/aura-studios/aura-studios.jpg"
        mediaType="video"
        alt="Aura studios — natural intelligence at work"
        caption="Studios — where natural intelligence meets the work"
      />

      {/* ── Ethos + spirit (merged) ─────────────────────────
          The working method and the people who hold it, read as
          one stanza. Method beats lead, the spirit closes — a
          single arc from "how we work" to "who we are" before
          the three studios that follow. */}
      <ScrollHighlight align="left">{`Natural Intelligence is the way of doing.
Read the land first, then build.
Test small ideas at the boundary of nature, technology, and people.
Monastic polymaths. Crazy misfits.
Learning from nature. Creating for the future.`}</ScrollHighlight>

      {/* ── Three studios ────────────────────────────────────
          Pillar grid in the homepage's wider 16/9-derived rail
          so the three cards stretch beyond section-w's content
          width. Each card carries its own 3:4 media tile —
          Engine and Hospitality autoplay short loops; Origin is
          a still. */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div style={{ padding: '0 48px' }}>
          <div
            className="grid grid-cols-1 md:grid-cols-3 stagger pillar-grid"
            style={{ gap: 'var(--grid-gap)', maxWidth: 'calc((100vh - 56px - 96px) * 16 / 9)', margin: '0 auto' }}
          >
            {STUDIOS.map((s) => (
              <Reveal key={s.name}>
                <div className="pillar-card">
                  <StudioPillarMedia image={s.image} video={s.video} alt={s.alt} />
                  <h3 style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>{s.name}</h3>
                  <p className="label" style={{ marginBottom: 'var(--space-4)' }}>{s.lead}</p>
                  <p className="p2">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── In practice ──────────────────────────────────────
          The four words that anchor the studios' working
          standard — craft, technology, innovation, impact —
          stacked as a stanza so each beat lands on its own. */}
      <ScrollHighlight align="left">{`Craft meets technology.
Innovation in service of value.
Impact measured in generations, not quarters.
The website is not the surface. It is the field.`}</ScrollHighlight>

      {/* ── Body banner ──────────────────────────────────────
          A held loop before the closing CTA — the space video
          gives the reading rhythm a visual exhale. */}
      <Placeholder
        src="/aura-studios/aura-space.mp4"
        poster="/aura-studios/aura-space.jpg"
        mediaType="video"
        alt="Aura — regenerative studios, the room itself"
        caption="Regenerative studios"
      />

      {/* ── Invitation ───────────────────────────────────────
          The closing thought stands alone — heading only, no link,
          no body. The page ends on the line; the global nav holds
          the contact affordance. */}
      <section className="one-col" style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal>
            <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'left' }}>
              <h2 style={{ margin: 0 }}>
                The future cannot automate what is deeply human.
              </h2>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
