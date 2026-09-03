import {
  HeroBanner,
  TwoCol,
  OneCol,
  ScrollHighlight,
  Continue,
} from '@/components/article/Article'
import Reveal from '@/components/RevealOnScroll'
import ArrowCta from '@/components/ArrowCta'

/* The four valleys, on one page.
 *
 * They were only ever visible as panels on the home page, where a reader
 * meets them between two other sections and cannot stop on them. The
 * question a sanctuary raises — why four places rather than one bigger
 * one — needs more than a caption to answer, so it is answered here.
 *
 * Two are working and two are being listened to. The page keeps that
 * distinction in its structure rather than in a badge: the working pair
 * open their pages, the coming pair do not open anything, and the
 * paragraph between the two rows says why the second pair is quiet.
 *
 * The rows carry their own introduction. A heading and a paragraph over
 * each one restated what the cards were about to show — the names, the
 * regions and the coordinates are already on the card, and a reader who
 * has them does not need to be told them first.
 */

type Place = {
  name: string
  tagline: string
  region: string
  coords: string
  img: string
  video?: string
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
    video: '/aura-mudigere.mp4',
    alt: 'The Aura estate at Mudigere — coffee under four storeys of canopy in the Western Ghats',
    href: '/mudigere',
  },
  {
    name: 'Ohara',
    tagline: 'Retreats and slow living in nature',
    region: 'Kyoto Prefecture, Japan',
    coords: '35.13°N · 135.83°E',
    img: '/aura-ohara.jpg',
    video: '/aura-ohara.mp4',
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
    video: '/aura-munduk.mp4',
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
  const media = (
    <span className="sc-plate" aria-hidden>
      {p.video ? (
        <video
          src={p.video}
          poster={p.img}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
        />
      ) : (
        <img src={p.img} alt="" loading="lazy" decoding="async" />
      )}
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
        caption="Mudigere, Karnataka — the first of four valleys"
      />

      <ScrollHighlight align="left">{`A sanctuary begins the day someone decides to stay.
Four valleys, two hemispheres, and the same question asked in each: what does this place want to become.
Two of them are answering. Two are still being asked.`}</ScrollHighlight>

      <OneCol id="first" heading="Mudigere came first.">
        <p className="p1">
          A hundred and fifty acres in the Western Ghats that had been farmed hard, and was
          asked — for the first time in a long while — what it needed. The answer took years
          and is still arriving: four storeys of canopy, a herd that makes the fertility the
          soil runs on, and coffee that tastes like the block it grew in.
        </p>
        <p className="p1">
          Ohara answered in another language. North of Kyoto, in a valley that keeps its own
          time, the work is a garden, a house, and the discipline of leaving things alone
          long enough to watch them change. Two valleys this far apart agree slowly, and
          what survives the disagreement is worth keeping.
        </p>
      </OneCol>

      <ul className="sc-row">
        {WORKING.map((p) => (
          <PlaceCard key={p.name} p={p} />
        ))}
      </ul>

      <TwoCol id="listening" heading="The other two are still listening.">
        <p className="p1">
          Munduk and Punakha are named and closed. A sanctuary starts with a season of
          listening, and in both valleys that season is still running: a year of weather, a
          soil record, the names of the people already farming the ridge, and an honest
          account of what the water does in the dry months.
        </p>
        <p className="p1">
          Arriving before that work is finished means bringing an answer to a question the
          valley was never asked. So these two wait. They will be written up here when there
          is something true to write.
        </p>
      </TwoCol>

      <ul className="sc-row">
        {LISTENING.map((p) => (
          <PlaceCard key={p.name} p={p} />
        ))}
      </ul>

      <div className="sc-close">
        <p className="p1">
          What the four have in common is the order of the work: the land first, for as long
          as the land takes, and everything else after it. Mudigere and Ohara are open to
          anyone who wants that pace. Munduk and Punakha will be, when they are ready.
        </p>
        <ArrowCta className="sc-ask" href="/contact">
          Contact Us
        </ArrowCta>
      </div>

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
