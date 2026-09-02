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
/* What each of these is, and how a reader gets it.
 *
 * This described the page rather than the thing — "when it is, this page
 * carries what the estate already keeps on it" — and framed everything as
 * a wait. Nothing on the estate is sold from a shelf; it is arranged with
 * the estate directly. So each of these says what the thing is, and the
 * line beneath tells the reader how to ask for it. */
const UNRELEASED: Record<string, React.ReactElement> = {
  coffee: (
    <p className="p1 pd-p">
      One harvest, split by the block and the ferment it came off. Each lot carries the
      file that made it — the block, the ferment, the drying, and the lab record that
      closed the tank.
    </p>
  ),
  'from-the-farm': (
    <p className="p1 pd-p">
      Tea, pepper, areca and what else the canopy gives, grown beside the coffee and
      picked when the season gives it. What the estate can spare of any of it moves with
      the year.
    </p>
  ),
  objects: (
    <p className="p1 pd-p">
      Made in the studios on the estate, from material the land already grows. A run lasts
      as long as the material allows and stops there.
    </p>
  ),
  experiences: (
    <p className="p1 pd-p">
      The estate&rsquo;s working day is the thing on offer — three days at Mudigere, twenty
      places, three times a year.
    </p>
  ),
  default: (
    <p className="p1 pd-p">
      Grown, made or kept on the estate at Mudigere.
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
              {/* The line here used to be "Aura publishes the record before
                  it publishes a price, and that holds at the point of sale
                  as much as anywhere else" — which restates its own premise
                  and leaves the reader nothing to do. Every one of these is
                  arranged with the estate directly, so the useful thing is
                  the route to a person. */}
              <p className="p1 pd-p">
                Allocation is arranged with the estate directly. Tell us what you are after
                and who it is for.{' '}
                <Link className="pd-ask" href="/contact">Write to us</Link>
              </p>
            </>
          )}

          </div>
        </div>
      </div>

      {p.siblings.length > 0 && (
        <RelatedLane
          label="More From Aura"
          items={p.siblings}
          ratio="4 / 5"
        />
      )}

      <style>{`
        /* Flush to the nav at every width. --head-top is air for a page
           that opens on its title; this one opens on a full-bleed
           picture, and the picture starts where the header stops. The
           mobile rule below used to be the only place that was true. */
        /* No bottom padding: the band ends where its picture ends, and
           the lane below brings its own space. */
        .pd { padding: var(--nav-h) 0 0; background: var(--bg); }

        /* The dark belongs to the product, not to the page. The plate is
           a photograph and the copy is short; on white the picture
           floated, and on the inverted band the product is the only lit
           thing. The lane below it sits back on the page's own ground. */
        .pd-band {
          background: var(--contrast-bg);
          color: var(--contrast-text);
          /* Flush. The picture reaches the top and bottom of the dark,
             which is the point of putting it on a band rather than in a
             box — padding here left it floating in a field of black. */
          padding: 0;
        }
        .pd-in {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(32px, 5vw, 96px);
          /* Stretch, so the picture is as tall as the band whichever
             column is the taller one. Centring it meant that once the
             text column grew past the plate — which the column's own
             padding does — the plate stopped reaching the band's edges
             and the dark showed above and below it as two empty strips.
             The copy is centred within its own column instead. */
          align-items: stretch;
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
          /* The ratio is the floor, not the height: it sizes the band on
             a page whose copy is short, and gives way to the row height
             when the copy is long. */
          aspect-ratio: 4 / 5;
          align-self: stretch;
          /* A product with no photograph yet keeps its column as a card
             on the page's own ground, not a grey plate: grey reads as a
             picture that failed rather than one nobody has taken. */
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-1);
          overflow: hidden;
        }
        /* The grey is the drafting state, so it is painted only when
           there is nothing over it. */
        .pd-plate:not([data-noimg]) { background: none; border: 0; }
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

        /* The band runs flush so the picture can reach its top and bottom
           edge, which leaves the text column starting at y=0 of the band.
           On a page where the band is the first thing after the header —
           every product page — the title was rendering under the fixed
           nav and losing its top edge. The padding goes on the column,
           not the band, so the picture still bleeds. */
        .pd-body {
          display: flex; flex-direction: column; justify-content: center;
          gap: var(--space-4);
          padding: clamp(72px, 9vh, 128px) 0;
        }
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

        /* .p1, like every other link set in running text. The accent
           rule on hover arrives from globals.css, same as anywhere. */
      `}</style>
    </main>
  )
}
