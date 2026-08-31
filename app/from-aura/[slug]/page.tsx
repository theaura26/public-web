import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { stubSlugs, labelFor, SECTIONS } from '@/lib/site-nav'
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
  /* A parent — Coffee, Pepper, Farm Goods — lists what sits under it.
     A reader on Coffee wants the seasons, and a paragraph about the
     estate’s philosophy is in the way of that. */
  /* Covers for the top-level products. A parent has no lane entry of
     its own — it is a heading over seasons — so its picture is named
     here rather than carried on an item. */
  const COVERS: Record<string, string> = {
    coffee: '/from-aura/coffee/coffee.webp',
    tea: '/from-aura/tea/tea.webp',
    pepper: '/from-aura/pepper/pepper.webp',
    areca: '/from-aura/areca-nut/areca-nut.webp',
    'from-the-farm': '/from-aura/farm-goods/farm-goods.webp',
    objects: '/from-aura/objects/objects.webp',
    experiences: '/from-aura/experiences/experiences.webp',
  }
  const shop = SECTIONS.find((x) => x.id === 'shop')
  const parent = shop?.items.find((x) => x.href === `${PREFIX}/${slug}`)

  return {
    children: parent?.children ?? [],
    img: entry?.img ?? COVERS[slug] ?? null,
    /* labelFor returns "Coffee" for a top-level product and "Coffee —
       2025–26 Lots" for one of its children. Take the child half when
       there is one, the whole label when there is not.

       This was `?? navLabel!`, and `??` does not fall back on an empty
       string — so every top-level product (Coffee, Tea, From the Farm,
       Experiences) got a blank title and a description reading
       " — not released yet." */
    title: entry?.title ?? (navLabel!.split(' — ').slice(1).join(' — ') || navLabel!),
    /* The lane's id, not its label — UNRELEASED is keyed by it. For a
       top-level product the slug IS the lane id. */
    laneId: entry?.lane.id ?? slug,
    lane: entry?.lane.label ?? SECTION,
    description: entry?.description ?? null,
    /* Everything else in the shop, not just the rest of this lane. A
       product page is the end of a path, and the lane it belongs to is
       the one set of things the reader has already seen — showing them
       the other four categories is the point of putting a lane here. */
    siblings: FROM_AURA.flatMap((l) => l.items).filter((i) => i.href !== `${PREFIX}/${slug}`),
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
    /* Each product is its own page. Without this every one of them
       inherits the root canonical and declares itself a duplicate of the
       homepage — twenty-four pages pointing at `/`. */
    alternates: { canonical: `${PREFIX}/${slug}` },
    robots: { index: false, follow: true },
  }
}

/* What "not released yet" means depends on what the thing is.
 *
 * One paragraph used to serve all of them, and it was written for
 * coffee — it promised a residency "the ferment, the drying, and the lab
 * record that closed it", which is not what a residency has. Each lane
 * gets the sentence that is true for it. */
const UNRELEASED: Record<string, React.ReactElement> = {
  coffee: (
    <p className="p1 pd-p">
      Nothing from this harvest is released yet. When it is, this page carries what the
      estate already keeps on it — the block it came from, the ferment, the drying, and
      the lab record that closed the tank.
    </p>
  ),
  'from-the-farm': (
    <p className="p1 pd-p">
      Not released yet. What the estate can spare of this depends on the season, and the
      page will say how much there is and where on the land it came from before it says
      a price.
    </p>
  ),
  objects: (
    <p className="p1 pd-p">
      Not released yet. These are made in the studios on the estate, in small numbers,
      from material the land already grows — so the run is as long as the material allows
      and no longer.
    </p>
  ),
  experiences: (
    <p className="p1 pd-p">
      Not open for booking yet. When it is, this page carries the dates, how many places
      there are, and what the days actually consist of — the estate&rsquo;s working day is
      the thing on offer, so it is described rather than dressed.
    </p>
  ),
  default: (
    <p className="p1 pd-p">
      Not released yet. When it is, this page carries the record the estate already keeps
      on it.
    </p>
  ),
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = product(slug)
  if (!p) notFound()

  return (
    <main className="pd">
      <div className="pd-band">
        <div className="section-w pd-in">
        {/* 4:5, and grey until there is a photograph of the thing. */}
        <div className="pd-plate" data-noimg={p.img ? undefined : 'true'} aria-hidden>
          {p.img && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={p.img} alt="" loading="lazy" decoding="async" />
          )}
        </div>

        <div className="pd-body">
          <h1 className="pd-title">{p.title}</h1>

          {p.description && <p className="p1 pd-lede">{p.description}</p>}

          {p.children.length > 0 ? (
            <>
              <p className="p1 pd-p">
                What is under this, season by season. Each carries its own record when it
                is released.
              </p>
              <ul className="pd-list">
                {p.children.map((c) => (
                  <li key={c.href}>
                    <Link className="pd-child" href={c.href}>{c.label}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              {UNRELEASED[p.laneId] ?? UNRELEASED.default}
              <p className="p1 pd-p">
                Aura publishes the record before it publishes a price, and that holds at the
                point of sale as much as anywhere else.
              </p>
            </>
          )}

          <p className="pd-act">
            <Link className="pd-cta" href="/contact">Get in touch</Link>
          </p>
          </div>
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
        /* Flush to the nav at every width. --head-top is air for a page
           that opens on its title; this one opens on a full-bleed
           picture, and the picture starts where the header stops. The
           mobile rule below used to be the only place that was true. */
        .pd { padding: var(--nav-h) 0 var(--space-9); background: var(--bg); }

        /* The dark belongs to the product, not to the page. The plate is
           a photograph and the copy is short; on white the picture
           floated, and on the inverted band the product is the only lit
           thing. The lane below it sits back on the page's own ground. */
        .pd-band {
          background: var(--contrast-bg);
          color: var(--contrast-text);
          padding: var(--space-9) 0;
          margin-bottom: var(--space-9);
        }
        .pd-in {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(32px, 5vw, 96px);
          /* The column reads off the middle of the picture rather than
             its top edge — the plate is 4:5 and the copy is four short
             paragraphs, so top-aligning left the text stranded against a
             tall image. */
          align-items: center;
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
          overflow: hidden;
        }
        /* The grey is the drafting state, so it is painted only when
           there is nothing over it. */
        .pd-plate:not([data-noimg]) { background: none; }
        .pd-plate img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Edge to edge on a phone: with one column there is no middle
           for the picture to stop at. After the base rule, not before —
           a media query does not raise specificity, so source order is
           the whole of it. */
        @media (max-width: 768px) {
          .pd-plate { width: calc(100% + 2 * var(--pd-rail)); }
        }

        .pd-body { display: flex; flex-direction: column; gap: var(--space-4); }
        .pd-title {
          margin: 0 0 var(--space-3);
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600; text-transform: uppercase;
          /* The h2 size, not the page-title size. These names run from
             "Tea" to "No.1 Experimental Coffee in India", and at 106px
             the long one broke out of its column and off the page. The
             h2 scale holds both. */
          font-size: clamp(32px, 5.5vw, 60px);
          line-height: 1.06; letter-spacing: -0.03em;
          overflow-wrap: break-word;
          color: var(--contrast-text); text-wrap: balance;
        }
        .pd-lede { margin: 0; color: var(--contrast-text); max-width: 42ch; }
        /* .p1 entire — colour as well as size. Moving to the p1 size
           while keeping p2's --text-body was half a change: the text
           still read as secondary next to the line above it, which is
           the thing that was wrong in the first place. */
        .pd-p {
          margin: 0; max-width: 46ch;
          /* .p1 colours from --text, which on this inverted ground is the
             ground itself — the paragraphs were painting dark on dark. */
          color: var(--contrast-text-body, rgba(255, 255, 255, 0.72));
        }

        /* The seasons under a parent, as a plain list. */
        .pd-list {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column;
        }
        .pd-list li { border-top: 1px solid var(--contrast-border, rgba(255, 255, 255, 0.14)); }
        .pd-list li:last-child { border-bottom: 1px solid var(--contrast-border, rgba(255, 255, 255, 0.14)); }
        .pd-child {
          display: block; padding: var(--space-4) 0;
          font-family: var(--font-sans); font-size: 16px; line-height: 1.55;
          color: var(--contrast-text); text-decoration: none;
        }

        .pd-act { margin: var(--space-4) 0 0; }
        /* .p1, like every other link set in running text. The accent
           rule on hover arrives from globals.css, same as anywhere. */
        .pd-cta {
          font-family: var(--font-sans);
          font-size: 16px; line-height: 1.55; letter-spacing: normal;
          color: var(--contrast-text); text-decoration: underline;
          text-underline-offset: var(--rule-offset);
          text-decoration-thickness: var(--rule-weight);
        }
        .pd-cta:hover { text-decoration-color: var(--brand-accent); }
      `}</style>
    </main>
  )
}
