import { RipeShell } from '@/components/ripe/RipeShell'
import { RipeHero } from '@/components/ripe/RipeHero'
import { RipeDayNav } from '@/components/ripe/RipeDayNav'
import { RipeSeason, RipeSeasonIntro } from '@/components/ripe/RipeSeason'
import { RipePageBanner } from '@/components/ripe/RipePageBanner'
import { RipeReadMore } from '@/components/ripe/RipeBlocks'
import { DAYS, SEASON_HERO, SEASON_INTRO, SEASON_INTRO_NOTE, SEASON_BANNER } from '@/components/ripe/after-copy'

/* ═══════════════════════════════════════════════════════════════════
   A Season of RIPE — what the ten days at Mudigere left behind.

   RIPE is the invitation; this is the record. Same opener, same black
   ground, same thread down the middle, but in coral rather than green,
   so the two read as one pair rather than one page repeated. The mark and the line at the top lead back to RIPE, and the
   banner at the foot does the same.
═══════════════════════════════════════════════════════════════════ */

export default function SeasonPage() {
  return (
    <RipeShell backdrop={false} accent="#FF60A5" bar={<RipeDayNav days={DAYS} />}>
      {/* The season's banner — seven stills from the ten days, fading one
          into the next — a touch
          dimmed, with a shade rising from its foot under the words so the
          pink reads over the brightest of them. */}
      <RipeHero
        mark={SEASON_HERO.mark}
        name="A Season of RIPE"
        tagline={SEASON_HERO.tagline}
        slides={SEASON_HERO.slides}
        link={SEASON_HERO.link}
        pair={{ current: 'after', href: '/ripe', hover: '#23FF88' }}
        dim={0.86}
        scrim
      />
      <RipeSeasonIntro lines={SEASON_INTRO} note={SEASON_INTRO_NOTE} />
      <RipeSeason days={DAYS} />
      {/* The same way on into the rest of Aura that RIPE ends with, in
          the same place: after the last word, before the banner home. */}
      <RipeReadMore />
      <RipePageBanner banner={SEASON_BANNER} />
    </RipeShell>
  )
}
