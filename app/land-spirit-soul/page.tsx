'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  Placeholder,
  Portrait,
  ScrollHighlight,
  Continue,
} from '@/components/article/Article'

export default function LandSpiritSoulPage() {
  return (
    <>
      <HeroBanner
        title="Land, Spirit, Soul"
        src="/land-spirit-soul/images/aura-land-spirit-soul-01.webp"
        caption="The lamp at the Gau Angan, lit with ghee from the herd it is lit for"
        alt="Two brass lamps burning, close, at first light"
      />

      <TwoCol id="premise" heading="The day starts with a lamp.">
        <p className="p1">
          Before anyone walks a block, before the barrels are stirred or the herd goes out, a
          lamp is lit at the Gau Angan and a prayer is said to the cows.
        </p>
        <p className="p2">
          An estate that publishes colony counts and lux readings might be expected to keep quiet
          about this. Aura would rather explain it, because leaving it out would misdescribe how
          the place actually runs.
        </p>
      </TwoCol>

      <OneCol heading="Gaumata">
        <p className="p1">
          In Indian tradition the cow is Gaumata — a figure of nourishment, abundance, purity and
          selfless giving. She has held that place in the rural economy for as long as there has
          been one, feeding people while feeding the ground they farm.
        </p>
        <p className="p2">
          Beginning the day at the Gaushala with prayer acknowledges that relationship directly.
          On this estate it is also a plain statement of fact about the fertility system: about fifty
          animals are the reason there is anything to spread on 150 acres.
        </p>
      </OneCol>

      <PullQuote>
        The lamp is lit with ghee from the cows it is lit for.
      </PullQuote>

      <Placeholder
        src="/land-spirit-soul/images/aura-land-spirit-soul-04.webp"
        alt="The shrine dressed with marigold garlands, banana leaf and lights"
        caption="Dressed for a festival — the same wall, the same lamp"
      />

      <TwoCol id="diya" heading="What the flame is made of.">
        <p className="p1">
          The diya brings light into the space — the ordinary meaning, dispelling darkness,
          inviting clarity and a settled start.
        </p>
        <p className="p2">
          When it is lit with cow ghee, something else is happening as well. What the animal gave
          is offered back to her as flame. Given, received, and returned in the same morning.
        </p>
        <p className="p2">
          Everyone here recognises that shape. It is the same one the estate draws on paper as a
          closed loop of fertility: dung to preparation, preparation to soil, soil to the plant
          the herd will graze. The ritual states it in one gesture. The lab states it in colony
          counts. Neither is a decoration on the other.
        </p>
      </TwoCol>

      {/* Twenty-seven mornings in one frame. The page argues the point is
          repetition rather than ceremony, and a grid of different people
          at the same wall makes that argument without a sentence. */}
      <Placeholder
        src="/land-spirit-soul/images/aura-land-spirit-soul-03.webp"
        alt="A grid of twenty-seven frames: different people lighting the same shrine lamp on different mornings"
        caption="A moment of stillness before the day starts — every morning, not on occasion"
      />

      <Portrait
        src="/land-spirit-soul/images/aura-land-spirit-soul-02.webp"
        ratio="4 / 5"
        alt="A man lighting incense at the shrine on the shed wall"
        caption="What the cow gave, offered back to her as light"
      />

      <ScrollHighlight>
        {`The diya brings light.\n   The prayer brings intention.\n   The cow gives nourishment.\n   The Gaushala is the care owed back.`}
      </ScrollHighlight>

      <Placeholder
        src="/land-spirit-soul/images/aura-land-spirit-soul-05.webp"
        alt="A pooja laid out with marigolds, brass lamps, a garlanded coconut and incense smoke"
        caption="The same address, on the days it is made at length"
      />

      <TwoCol id="all-life" heading="Addressed to the whole system.">
        <p className="p1">
          The prayer at the Gaushala is addressed to the whole system. A plantation works because
          an enormous number of organisms are working: cattle, insects, birds, microorganisms,
          plants, and the people who show up.
        </p>
        <p className="p2">
          The morning is a moment to acknowledge that none of them is optional, and that the
          arrangement runs in both directions. The estate takes from all of it, daily. The
          practice is a reminder to put something back with the same regularity.
        </p>
      </TwoCol>

      {/* The act itself, moving, under the section that argues it is the
          repetition rather than the ceremony that matters. */}
      <Placeholder
        src="/land-spirit-soul/videos/aura-land-spirit-soul-02.mp4"
        mediaType="video"
        poster="/land-spirit-soul/images/aura-land-spirit-soul-02.webp"
        alt="Someone lighting the shrine lamp on the shed wall before the day starts"
        caption="Before anyone walks a block"
      />

      <TwoCol id="daily" heading="The significance is in the repetition.">
        <p className="p1">
          The significance is in the repetition. Performed every
          morning, it makes a small pause before work that returns everyone to one idea: we are
          part of nature, not separate from it.
        </p>
        <p className="p2">
          Held daily, that idea becomes a working habit — compassion,
          responsibility and gratitude, carried out of the Gaushala and into the blocks.
        </p>
        <p className="p2">
          The diya brings light. The prayer brings intention. The cow stands for nourishment
          freely given. The Gaushala stands for the care owed back. Aura measures a great deal of
          what happens on this estate, and has never found a way to measure that. It is kept
          anyway, at six in the morning, every day.
        </p>
      </TwoCol>

      <Continue currentHref="/land-spirit-soul" />
    </>
  )
}
