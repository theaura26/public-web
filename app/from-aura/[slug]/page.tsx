import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { stubSlugs, labelFor } from '@/lib/site-nav'
import { FROM_AURA } from '@/lib/from-aura'

/* A product page.
 *
 * From Aura is the store, so these are not article stubs — they are the
 * page a buyer lands on. The shape is the one a product gets everywhere:
 * the thing on the left at 4:5, and on the right its name, what it is,
 * and the one action available.
 *
 * That action is not Add to basket. Nothing here is for sale yet, and
 * the page says so plainly rather than dressing an empty shelf as a
 * shop. Get in touch is the real offer until a lot is released.
 *
 * The layout lives in this file rather than in a component of its own:
 * one route renders every product, so there is exactly one caller and
 * nothing to share it with.
 */

const PREFIX = '/from-aura'
const SECTION = 'From Aura'

export const dynamicParams = false

export function generateStaticParams() {
  /* Both sources. The menu lists products by crop and the index page
     lists them by who is buying, and the two do not hold the same set —
     Jeevamrit and Green Coffee are on the page and not in the menu. A
     product the store displays is a product the store can open, so the
     routes are the union rather than whichever list happened to be
     asked. */
  const fromLanes = FROM_AURA.flatMap((l) =>
    l.items.map((i) => i.href.slice(PREFIX.length + 1)),
  )
  return [...new Set([...stubSlugs(PREFIX), ...fromLanes])].map((slug) => ({ slug }))
}

/** What the store knows about this product, where the store knows it. */
function product(slug: string) {
  const entry = FROM_AURA.flatMap((l) => l.items.map((i) => ({ ...i, lane: l })))
    .find((i) => i.href === `${PREFIX}/${slug}`)
  const navLabel = labelFor(`${PREFIX}/${slug}`)
  if (!entry && !navLabel) return null
  return {
    title: entry?.title ?? navLabel!.split(' — ').slice(1).join(' — ') ?? navLabel!,
    lane: entry?.lane.label ?? SECTION,
    description: entry?.description ?? null,
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const p = product(slug)
  return {
    title: p ? `${p.title} — ${SECTION}` : SECTION,
    description: p?.description ?? `${p?.title ?? SECTION} — not released yet.`,
    robots: { index: false, follow: true },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = product(slug)
  if (!p) notFound()

  return (
    <main className="pd">
      <div className="section-w pd-in">
        {/* 4:5, and grey until there is a photograph of the thing. */}
        <div className="pd-plate" aria-hidden />

        <div className="pd-body">
          <h1 className="pd-title">{p.title}</h1>

          {p.description && <p className="p1 pd-lede">{p.description}</p>}

          <p className="p2 pd-p">
            Nothing from this lot is released yet. When it is, this page carries what the
            estate already keeps on it — the block it came from, the ferment, the drying,
            and the lab record that closed it.
          </p>
          <p className="p2 pd-p">
            Aura publishes the record before it publishes a price. That is the whole
            argument, and it would be a strange thing to abandon at the point of sale.
          </p>

          <p className="pd-act">
            <Link className="pd-cta" href="/contact">Get in touch</Link>
          </p>

          <p className="label pd-back">
            <Link href={PREFIX}>← All of {SECTION}</Link>
          </p>
        </div>
      </div>

      <style>{`
        .pd { padding: calc(var(--nav-h) + var(--head-top)) 0 var(--space-9); background: var(--bg); }
        .pd-in {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(32px, 5vw, 96px);
          align-items: start;
        }
        @media (max-width: 768px) {
          .pd-in { grid-template-columns: minmax(0, 1fr); gap: var(--space-7); }
        }

        .pd-plate {
          aspect-ratio: 4 / 5;
          /* The same grey the journal kit's drafting cards use, so an
             unphotographed product reads as 'image to come' rather than
             as an empty column. --bg-card is near-white and vanished. */
          background: #d6d6d6;
          border-radius: var(--radius-1);
        }

        .pd-body { display: flex; flex-direction: column; gap: var(--space-4); }
        .pd-title {
          margin: 0 0 var(--space-3);
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600; text-transform: uppercase;
          font-size: clamp(44px, 9vw, 88px);
          line-height: 1.02; letter-spacing: -0.06em;
          color: var(--text); text-wrap: balance;
        }
        .pd-lede { margin: 0; color: var(--text); max-width: 42ch; }
        .pd-p { margin: 0; color: var(--text-body); max-width: 46ch; }

        .pd-act { margin: var(--space-4) 0 0; }
        .pd-cta {
          font-family: var(--font-sans);
          font-size: 16px; line-height: 1.55;
          color: var(--text); text-decoration: none;
        }
        .pd-back { margin: var(--space-6) 0 0; }
        .pd-back a { color: var(--text-muted); text-decoration: none; }
      `}</style>
    </main>
  )
}
