import {
  HeroBanner,
  TwoCol,
  ScrollHighlight,
  Continue,
} from '@/components/article/Article'
import Reveal from '@/components/RevealOnScroll'

/* The four valleys, on one page.
 *
 * They were only ever visible as panels on the home page, where a reader
 * meets them between two other sections and cannot stop on them. The
 * question a sanctuary raises — why four places rather than one bigger
 * one — needs more than a caption to answer, so it is answered here.
 *
 * What a sanctuary is for: somewhere safe enough that mind, body and
 * soul stay in one piece, which is the condition for thinking in
 * generations and for making anything new. A place under threat plans
 * for the season it is in. That argument is the page's opening line and
 * everything else on it follows from that.
 *
 * Two are working and two are being listened to. The page keeps that
 * distinction in its structure rather than in a badge: the working pair
 * open their pages, the coming pair do not open anything, and the one
 * piece of prose on the page says why the second pair is quiet.
 *
 * Almost no prose, on purpose. Every heading-and-paragraph over a row
 * restated what the row was about to show: the names, the regions and
 * the coordinates are already on the cards, and a reader looking at them
 * does not need to be told them first. What is left is the opening
 * statement, the four valleys, and the one thing the pictures cannot
 * say — why two of them are closed.
 */

type Place = {
  name: string
  tagline: string
  region: string
  coords: string
  img: string
  alt: string
  /** Where the place opens. Absent while a valley is still being read. */
  href?: string
}

const WORKING: Place[] = [
  {
    name: 'Mudigere',
    tagline: 'Regenerative plantation sanctuary',
    region: 'Karnataka, India',
    coords: '13.17°N · 75.43°E',
    img: '/aura-mudigere.jpg',
    alt: 'The Aura estate at Mudigere — coffee under four storeys of canopy in the Western Ghats',
    href: '/mudigere',
  },
  {
    name: 'Ohara',
    tagline: 'Retreats and slow living in nature',
    region: 'Kyoto Prefecture, Japan',
    coords: '35.13°N · 135.83°E',
    img: '/aura-ohara.jpg',
    alt: 'Ohara — a valley north of Kyoto, gardens and gate in autumn',
    href: '/ohara',
  },
]

const LISTENING: Place[] = [
  {
    name: 'Munduk',
    tagline: 'Mountain sanctuary for restoration',
    region: 'Bali, Indonesia',
    coords: '8.27°S · 115.06°E',
    img: '/aura-munduk.jpg',
    alt: 'Munduk — mountain forest and terraces in northern Bali',
  },
  {
    name: 'Punakha',
    tagline: 'A space for biodiversity, mindfulness and craft',
    region: 'Punakha, Bhutan',
    coords: '27.59°N · 89.88°E',
    img: '/aura-bhutan.jpg',
    alt: 'Punakha — the river valley in western Bhutan',
  },
]

function PlaceCard({ p }: { p: Place }) {
  /* A still, on every card.
   *
   * Three of the four had film behind them, and the page came to 13.9 MB
   * of video for four cards a third of the rail wide — with
   * aura-mudigere.mp4 pulled twice, once for the banner and once for the
   * card underneath it, because two video elements on one src do not
   * share a range request the way two images share a cache entry.
   *
   * The stills are 0.96 MB for all four. The film is worth its weight in
   * the banner, where it is the size of the screen and the first thing a
   * reader meets; at card size it is a texture, and a card elsewhere on
   * this site — a field note, a swimlane — is a photograph. */
  const media = (
    <span className="sc-plate" aria-hidden>
      <img src={p.img} alt="" loading="lazy" decoding="async" />
    </span>
  )

  const text = (
    <span className="sc-text">
      <span className="sc-name">{p.name}</span>
      <span className="sc-tag">{p.tagline}</span>
      <span className="label sc-meta">
        {p.region} · {p.coords}
      </span>
    </span>
  )

  return (
    <li className="sc-cell">
      <Reveal>
        {p.href ? (
          <a className="sc-card" href={p.href} aria-label={`${p.name} — ${p.tagline}`}>
            {media}
            {text}
          </a>
        ) : (
          /* No link. There is no page behind a valley that is still being
             read, and a card that opens nothing is worse than a card that
             says it opens nothing. */
          <div className="sc-card is-quiet">
            {media}
            {text}
          </div>
        )}
      </Reveal>
    </li>
  )
}

export default function SanctuariesPage() {
  return (
    <>
      <HeroBanner
        title="Sanctuaries"
        src="/aura-mudigere.mp4"
        mediaType="video"
        poster="/aura-mudigere.jpg"
        alt="Mudigere at first light — the working sanctuary in the Western Ghats"
      />

      <ScrollHighlight align="left">{`A sanctuary is a place safe enough to think in generations.
Mind, body and soul kept in one piece, on land that will outlast everyone standing on it.
Four valleys, two hemispheres, and the room to make something nobody has made yet.`}</ScrollHighlight>

      <ul className="sc-row">
        {WORKING.map((p) => (
          <PlaceCard key={p.name} p={p} />
        ))}
      </ul>

      <TwoCol id="listening" heading="The other two are still listening.">
        <p className="p1">
          Munduk and Punakha are named and closed. A place becomes safe to think in once it
          is understood, and in both valleys that understanding is still being gathered: a
          year of weather, a soil record, the names of the people already farming the ridge,
          and an honest account of what the water does in the dry months.
        </p>
        <p className="p1">
          Arriving before that work is finished means bringing an answer to a question the
          valley was never asked. A century of decisions rests on getting the first one
          right, so these two wait. They will be written up here when there is something
          true to write.
        </p>
      </TwoCol>

      <ul className="sc-row">
        {LISTENING.map((p) => (
          <PlaceCard key={p.name} p={p} />
        ))}
      </ul>

      {/* Mudigere and Ohara are two cards up the page and their own
          entries here would be the third time of asking. These three go
          sideways instead: what land is, who stays on it, and the order
          the whole thing is arranged by. */}
      <Continue
        heading="Read on"
        items={[
          {
            href: '/land',
            label: 'The Land',
            description: 'Land carries ancestry as well as acreage.',
            img: '/journals/land/aura-the-land.jpg',
          },
          {
            href: '/residency',
            label: 'Monastic Polymaths',
            description: 'The people who come to stay, and what they come to make.',
            img: '/journals/residency/aura-monastic-polymath.jpg',
          },
          {
            href: '/rta',
            label: 'Rta',
            description: 'The order a place keeps when nobody is watching it.',
            img: '/journals/rta/aura-rta.jpg',
          },
        ]}
      />
    </>
  )
}
