import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { stubSlugs, labelFor } from '@/lib/site-nav'
import { FROM_AURA } from '@/lib/from-aura'
import { RelatedLane } from '@/components/Swimlanes'

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
    /* The rest of its own lane. A buyer looking at one season of coffee
       is more likely to want another season than a bar of soapnut. */
    siblings: (entry?.lane.items ?? []).filter((i) => i.href !== `${PREFIX}/${slug}`),
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

          <p className="p1 pd-p">
            Nothing from this lot is released yet. When it is, this page carries what the
            estate already keeps on it — the block it came from, the ferment, the drying,
            and the lab record that closed it.
          </p>
          <p className="p1 pd-p">
            Aura publishes the record before it publishes a price. That is the whole
            argument, and it would be a strange thing to abandon at the point of sale.
          </p>

          <p className="pd-act">
            <Link className="pd-cta" href="/contact">Get in touch</Link>
          </p>
        </div>
      </div>

      {p.siblings.length > 0 && (
        <RelatedLane
          label="More from the store"
          items={p.siblings}
          ratio="4 / 5"
        />
      )}

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

        /* The product runs off the left edge of the page. The rail is
           reproduced as a negative margin and given back as width, the
           same arithmetic the lane tracks use to line their first card
           up with a heading — so the text column stays on the rail while
           the picture does not. */
        .pd {
          --pd-rail: max(var(--gutter), calc(50vw - var(--max-w) / 2 + var(--gutter)));
        }
        .pd-plate {
          margin-left: calc(-1 * var(--pd-rail));
          width: calc(100% + var(--pd-rail));
          aspect-ratio: 4 / 5;
          /* The same grey the journal kit's drafting cards use, so an
             unphotographed product reads as 'image to come' rather than
             as an empty column. --bg-card is near-white and vanished. */
          background: #d6d6d6;
          border-radius: var(--radius-1);
        }

        /* Edge to edge on a phone: with one column there is no middle
           for the picture to stop at. After the base rule, not before —
           a media query does not raise specificity, so source order is
           the whole of it. */
        @media (max-width: 768px) {
          .pd-plate { width: calc(100% + 2 * var(--pd-rail)); }
          /* Flush to the header line. --head-top is air for a page that
             opens on its title; this one opens on a full-bleed picture,
             and the picture should start where the header stops. */
          .pd { padding-top: var(--nav-h); }
        }

        .pd-body { display: flex; flex-direction: column; gap: var(--space-4); }
        .pd-title {
          margin: 0 0 var(--space-3);
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600; text-transform: uppercase;
          font-size: clamp(48px, 7.2vw, 106px);
          line-height: 1; letter-spacing: -0.03em;
          color: var(--text); text-wrap: balance;
        }
        .pd-lede { margin: 0; color: var(--text); max-width: 42ch; }
        /* .p1 entire — colour as well as size. Moving to the p1 size
           while keeping p2's --text-body was half a change: the text
           still read as secondary next to the line above it, which is
           the thing that was wrong in the first place. */
        .pd-p { margin: 0; max-width: 46ch; }

        .pd-act { margin: var(--space-4) 0 0; }
        /* .p1, like every other link set in running text. The accent
           rule on hover arrives from globals.css, same as anywhere. */
        .pd-cta {
          font-family: var(--font-sans);
          font-size: 16px; line-height: 1.55; letter-spacing: normal;
          color: var(--text); text-decoration: none;
        }
      `}</style>
    </main>
  )
}
