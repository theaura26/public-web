import { RipeShell } from '@/components/ripe/RipeShell'
import { RipeHero } from '@/components/ripe/RipeHero'
import { RipeDayNav } from '@/components/ripe/RipeDayNav'
import { RipeSeason, RipeSeasonIntro } from '@/components/ripe/RipeSeason'
import { RipePageBanner } from '@/components/ripe/RipePageBanner'
import { RipeReadMore } from '@/components/ripe/RipeBlocks'
import { DAYS, SEASON_HERO, SEASON_INTRO, SEASON_BANNER } from '@/components/ripe/after-copy'

/* ═══════════════════════════════════════════════════════════════════
   A Season of RIPE — what the ten days at Mudigere left behind.

   RIPE is the invitation; this is the record. Same opener, same thread
   down the middle, but printed on white and in coral rather than lit on
   black in green, so the two read as one pair rather than one page
   repeated. The mark and the line at the top lead back to RIPE, and the
   banner at the foot does the same.
═══════════════════════════════════════════════════════════════════ */

export default function SeasonPage() {
  return (
    <RipeShell paper backdrop={false} accent="#FF4796">
      {/* A tenth darker than RIPE's own opener: the canopy film is brighter
          than the aerial, and the coral has to hold over it. */}
      <RipeHero
        mark={SEASON_HERO.mark}
        name="A Season of RIPE"
        tagline={SEASON_HERO.tagline}
        film={SEASON_HERO.film}
        link={SEASON_HERO.link}
        pair={{ current: 'after', href: '/ripe', hover: '#23FF88' }}
        dim={0.72}
      />
      <RipeDayNav days={DAYS} />
      <RipeSeasonIntro lines={SEASON_INTRO} />
      <RipeSeason days={DAYS} />
      {/* The same way on into the rest of Aura that RIPE ends with, in
          the same place: after the last word, before the banner home. */}
      <RipeReadMore />
      <RipePageBanner banner={SEASON_BANNER} />
    </RipeShell>
  )
}
