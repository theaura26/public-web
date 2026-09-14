'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BEATS } from './copy'
import { useGround } from './RipeBackdrop'

/* ── The days ────────────────────────────────────────────────────────
   Ten cards down one dotted spine.

   LAYOUT, from the frame's own coordinates. On the 1920 design the beat
   title starts at x433, the photograph runs x508–1412, and the day's
   programme sits x1458–1819. Those are the three percentages below, so
   the title hangs off the picture's left edge exactly as far as it does
   in the file. The spine is `Vector 136`: a 1px white rule, dash [4,4],
   at x960 — which is the midpoint of the picture column rather than of
   the page.

   SEQUENCE. Each card is a scrubbed timeline: the title arrives first,
   the photograph second, the programme last, and then the whole card
   dissolves upward as it leaves the top. Scrubbed rather than triggered,
   so the order belongs to the reader's scroll instead of firing once at
   a threshold and running on its own clock.

   DEPTH. While the run is on screen the page carries a blur band at the
   top and bottom: content arrives soft from below, sharpens through the
   middle, and softens again on the way out. It is a backdrop-filter with
   a feathered mask rather than a painted overlay, so it carries no
   colour of its own and nothing under it shifts hue.

   prefers-reduced-motion: everything is placed and legible, no scrub,
   no blur.
─────────────────────────────────────────────────────────────────────── */

/* ── The spine ───────────────────────────────────────────────────────
   One straight dotted line down the run: the design's own Vector 136, a
   white rule at the middle of the picture column. It grows with the
   reader. Its tip is held at the middle of the screen from the moment the
   run arrives there until it leaves, so the line is always drawn exactly
   as far down as the reader has come, with the aura mark at the end
   marking where they are. One custom property drives both, so the tip
   and the line cannot drift apart. */

export function RipeDays() {
  const root = useRef<HTMLDivElement>(null)
  /* The 23 September screen is the page's ground turning indigo, not a
     picture inside a card. */
  const bleed = useRef<HTMLElement>(null)
  useGround('indigo', bleed, 'indigo')

  /* The spine reads the scroll position itself, on every scroll event,
     rather than through a ScrollTrigger tween. A tween is advanced on the
     animation frame, and wherever frames are held back (a background tab,
     an embedded preview) the line stood still at full length. It is not
     decorative motion either — it is where the reader is — so it runs
     with reduced motion too. */
  useEffect(() => {
    const el = root.current
    const spine = el?.querySelector<HTMLElement>('.days__spine')
    if (!el || !spine) return
    const update = () => {
      const r = el.getBoundingClientRect()
      const reach = window.innerHeight / 2 - r.top
      const grow = Math.min(Math.max(reach / r.height, 0), 1)
      spine.style.setProperty('--grow', (grow * 100).toFixed(3) + '%')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.querySelectorAll<HTMLElement>('.beat__title, .beat__fig, .beat__prog, .beat__quote')
        .forEach((n) => { n.style.opacity = '1'; n.style.transform = 'none' })
      return
    }

    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.beat').forEach((beat) => {
        /* The full-screen beat is its own thing: the picture consumes
           the viewport as the reader arrives, holds, and releases it on
           the way out. The cards either side have already dissolved, so
           nothing competes with it while it is up. */
        if (beat.classList.contains('is-bleed')) {
          const fig = beat.querySelector('.beat__fig')
          const words = beat.querySelectorAll('.beat__title, .beat__prog, .beat__quote')
          if (fig) {
            /* Up across the first screen, held across the second, gone
               across the last. The hold is the span between these two
               triggers — top-top to bottom-bottom — where neither runs. */
            gsap.fromTo(fig, { autoAlpha: 0, scale: 1.06 }, {
              autoAlpha: 1, scale: 1, ease: 'none',
              scrollTrigger: { trigger: beat, start: 'top bottom', end: 'top top', scrub: true },
            })
            gsap.to(fig, {
              autoAlpha: 0, ease: 'none',
              scrollTrigger: { trigger: beat, start: 'bottom bottom', end: 'bottom top', scrub: true },
            })
          }
          gsap.fromTo(words, { autoAlpha: 0, y: 40 }, {
            autoAlpha: 1, y: 0, ease: 'none', stagger: 0.2,
            scrollTrigger: { trigger: beat, start: 'top bottom-=40%', end: 'top top+=10%', scrub: true },
          })
          gsap.to(words, {
            autoAlpha: 0, ease: 'none',
            scrollTrigger: { trigger: beat, start: 'bottom bottom-=10%', end: 'bottom top+=40%', scrub: true },
          })
          return
        }

        const title = beat.querySelector('.beat__title')
        const fig = beat.querySelector('.beat__fig')
        const prog = beat.querySelector('.beat__prog')
        const quote = beat.querySelector('.beat__quote')

        /* In: title, then picture, then programme — and each has to be
           legibly its own step.

           The first pass ran this from the card touching the bottom of
           the viewport to its centre, about 480px of scroll for a card
           this size. Measured at three points, all three elements read
           opacity 1.0 at the same position: the span was too short for a
           stagger to survive in, so the sequence collapsed into a single
           fade. It now runs the full height of the card's approach —
           bottom of the viewport to the card's top near the top of it —
           and the three phases are spaced across that with no overlap:
           title 0-36%, picture 32-68%, programme 64-100%. */
        const tl = gsap.timeline({
          scrollTrigger: { trigger: beat, start: 'top bottom', end: 'top top+=22%', scrub: true },
        })
        if (title) tl.fromTo(title, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 1 }, 0)
        if (fig) tl.fromTo(fig, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 1 }, 0.9)
        if (prog) tl.fromTo(prog, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 1 }, 1.8)
        /* The hand writes itself on. A mask wipes left to right with a
           short feathered edge, so the letterforms arrive stroke by
           stroke the way a pen lays them down — rather than the whole
           line fading up at once, which reads as a caption appearing
           instead of a note being written. */
        if (quote) {
          tl.fromTo(quote, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.25 }, 2.0)
          tl.fromTo(quote, { ['--wipe']: '0%' }, { ['--wipe']: '112%', ease: 'none', duration: 1.1 }, 2.0)
        }

        /* Out: the card dissolves upward off the top, and the next one
           takes the screen. */
        gsap.to(beat, {
          autoAlpha: 0, y: -70, ease: 'none',
          scrollTrigger: { trigger: beat, start: 'bottom top+=42%', end: 'bottom top-=6%', scrub: true },
        })
      })

      /* The blur bands belong to this section only. */
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom-=15%',
        end: 'bottom top+=15%',
        onToggle: (self) => document.body.classList.toggle('ripe-timeline', self.isActive),
      })
    }, el)

    return () => { ctx.revert(); document.body.classList.remove('ripe-timeline') }
  }, [])

  return (
    <div ref={root} className="days">
      <div className="days__spine" aria-hidden>
        {/* The site's animated aura mark, slowed to a quarter speed for
            this page — public/RIPE/aura-mark-slow.svg is the navbar's
            aura-animated.svg at 24s a loop instead of 6s. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="days__tip" src="/RIPE/aura-mark-slow.svg" alt="" loading="lazy" decoding="async" />
      </div>
      {BEATS.map((b) => (
        <article
          key={b.title}
          ref={b.bleed ? (bleed as React.RefObject<HTMLElement>) : undefined}
          className={`beat ${b.bleed ? 'is-bleed' : ''}`}
        >
          <div className="beat__media">
            {b.image && !b.bleed && (
              <figure className="beat__fig">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt={b.alt ?? ''} loading="lazy" decoding="async" />
              </figure>
            )}
            <h3 className={`beat__title ${b.green ? 'is-green' : ''}`}>{b.title}</h3>
            {b.quote && (
              <p
                className="beat__quote"
                style={{
                  ...(b.qx !== undefined ? { ['--qx' as string]: `${b.qx}%` } : {}),
                  ...(b.qy !== undefined ? { ['--qy' as string]: `${b.qy}%` } : {}),
                }}
              >
                {b.quote}
              </p>
            )}
          </div>

          <div className="beat__prog">
            {b.date && <p className="beat__date">{b.date}</p>}
            {b.lead && <p className="p2 beat__lead">{b.lead}</p>}
            {b.prose && <p className="p2 beat__prose">{b.prose.join(' ')}</p>}
            {b.list && (
              <ul className="beat__list">
                {b.list.map((l) => <li key={l} className="p2">{l}</li>)}
              </ul>
            )}
          </div>
        </article>
      ))}

      <style jsx>{`
        /* Proportions are the frame's own, as fractions of 1920:
             title   x433  w312   -> 22.55% .. 38.80%
             picture x508  w904   -> 26.46% .. 73.54%
             column  x1458 w361   -> 75.94% .. 94.74%
           So the title starts 3.9% of the viewport left of the picture
           and runs 12.3% of the viewport over it. That overlap is the
           whole arrangement, which is why it is expressed against the
           picture column rather than nudged by hand. */
        .days {
          position: relative;
          width: 100vw; margin-left: calc(50% - 50vw);
          padding: clamp(48px, 8vh, 110px) 0 var(--ripe-section-gap);
        }
        /* Dots rather than a dashed border: a border dash is drawn by the
           browser at whatever rhythm it likes, and a gradient repeats at
           exactly the step given. The clip reveals it from the top down
           to --grow; with reduced motion nothing sets it and the whole
           line shows. */
        .days__spine {
          --grow: 100%;
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 3px; transform: translateX(-50%);
          /* Above the cards, so the mark rides over pictures and words
             rather than disappearing behind them. */
          z-index: 2;
          pointer-events: none;
        }
        .days__spine::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0.55px, transparent 1px)
            center top / 3px 7px repeat-y;
          /* The dots stop short of the mark: half its height (32px wide at
             859 by 731 is 27px tall) plus a small gap, so the line ends
             above the symbol instead of running into it. */
          clip-path: inset(0 0 calc(100% - var(--grow) + 20px) 0);
        }
        /* The clip is on the dots alone, so the tip is never cut off by
           the edge it marks. */
        .days__tip {
          position: absolute; left: 50%; top: var(--grow);
          width: 32px; height: auto; max-width: none;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
        }

        .beat {
          position: relative;
          display: grid; grid-template-columns: minmax(0, 1fr);
          gap: var(--space-5);
          padding: 0 6%;
          margin: 0 0 clamp(88px, 16vh, 200px);
        }
        .beat__media { position: relative; min-width: 0; }
        .beat__fig { margin: 0; }
        .beat__fig img {
          display: block; width: 100%; height: auto;
          aspect-ratio: 904 / 475; object-fit: cover;
        }
        /* The 23 September beat is a screen rather than a card. The
           image node in the file is 1916 by 1079 at full frame width,
           with the title and the day's programme laid over it rather
           than sitting beside it. */
        /* Two viewports tall, with the picture and the words pinned to
           the screen inside it. That extra viewport is the hold: the
           image fades up over the first screen of scroll, sits at full
           strength for the second, and releases on the way out. At one
           viewport there is nowhere for a hold to happen — it would be a
           fade straight into a fade. */
        .beat.is-bleed {
          width: 100vw; margin-left: calc(50% - 50vw);
          min-height: 200dvh; align-content: start;
          padding: 0 6%;
          /* The picture is scaled on its way in, and a scaled child
             reaches past its parent's box. Without this it pushed the
             document 57px wider than the viewport. clip rather than
             hidden: hidden makes this block its own scroll container, and
             the sticky picture and words inside it then stick to the
             block instead of the screen, so the hold never happened. */
          overflow: clip;
        }
        .is-bleed .beat__media,
        .is-bleed .beat__prog {
          position: sticky; top: 0; height: 100dvh;
          display: flex; flex-direction: column; justify-content: center;
        }
        /* Always the full viewport, never letterboxed: the figure is the
           screen, and the picture covers it. */
        .is-bleed .beat__fig {
          position: absolute; top: 0; height: 100dvh;
          left: 50%; width: 100vw; transform: translateX(-50%);
          z-index: 0; overflow: hidden; margin: 0;
        }
        .is-bleed .beat__fig img {
          width: 100%; height: 100dvh; object-fit: cover;
        }
        .is-bleed .beat__fig img {
          width: 100%; height: 100%; aspect-ratio: auto; object-fit: cover;
        }
        /* The programme is left out: it is the sticky column, and a
           position here, later in the sheet, overrode that and let the
           words scroll away during the hold. It is lifted over the
           picture with z-index alone. */
        .is-bleed .beat__title,
        .is-bleed .beat__quote { position: relative; z-index: 1; }
        .is-bleed .beat__prog { z-index: 1; }

        .beat__title {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 400; color: #fff;
          font-size: var(--t-display-size);
          line-height: var(--t-display-lh); letter-spacing: var(--t-track);
          margin: var(--space-4) 0 0; max-width: 12ch;
          text-wrap: balance;
        }
        .beat__title.is-green { color: var(--ripe-green); }

        .beat__quote {
          font-family: var(--font-hand), cursive;
          /* The pen. --wipe is driven by the card's timeline; the 7%
             feather is the width of the nib. */
          -webkit-mask-image: linear-gradient(to right,
            #000 calc(var(--wipe, 112%) - 7%), transparent var(--wipe, 112%));
          mask-image: linear-gradient(to right,
            #000 calc(var(--wipe, 112%) - 7%), transparent var(--wipe, 112%));
          font-size: var(--t-hand-size); line-height: var(--t-hand-lh);
          letter-spacing: var(--t-track);
          color: #fff; margin: var(--space-4) 0 0; max-width: 20ch;
          /* balance, not pretty: these are two or three short lines and
             the last word of one was landing on a line of its own. */
          text-wrap: balance;
        }

        .beat__prog { min-width: 0; }
        .beat__date {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 800; font-size: var(--t-body-size);
          line-height: var(--t-label-lh); letter-spacing: var(--t-track);
          color: #fff; margin: 0 0 1.1em;
        }
        /* Body/20 Light — the day's lead and its list are one block in
           the file, split into a Card/Date heading and a Light body. */
        .beat__lead {
          font-family: var(--font-grotesque), sans-serif; font-weight: 300;
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: #fff;
          margin: 0 0 1.1em; text-wrap: pretty;
        }
        /* Body/20 — the prose beats, at the Regular weight. The file sets
           these at 150% and one of them at 120%; that inconsistency is
           noted in SPEC.md rather than reproduced, and 150% wins because
           it is what the longer passage uses. */
        .beat__prose {
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: #fff;
          margin: 0 0 1.1em; text-wrap: pretty;
        }
        .beat__lead:last-child, .beat__prose:last-child { margin-bottom: 0; }
        .beat__list { list-style: none; margin: 0; padding: 0; }
        .beat__list li {
          font-family: var(--font-grotesque), sans-serif; font-weight: 300;
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 0.62em;
          text-wrap: pretty;
        }
        .beat__list li:last-child { margin-bottom: 0; }

        /* The programme column runs at the site's own body role. .p2 sets
           its colour from --text-body, which follows the day/night theme;
           this page is black in both, so the colour is held here. */
        .beat__prog :global(.p2) {
          color: #fff;
          letter-spacing: var(--t-track);
        }

        /* Phones and tablets, up to 1100px. The three-band desktop card
           needs the width: at 900 it left the programme 162px of text and
           at 1024 under 250. A day with a photograph is the card from the mobile
           reference: the picture full width with its handwritten line on
           it, then the title on the left and the programme on the right.
           A day without one (Come in, Get closer) and the indigo screen
           are a single centred stack: title, programme, then the line.

           The title and the line live inside .beat__media with the
           picture, so that wrapper steps out of the layout (display:
           contents) and its children become grid items.

           The spine runs down the middle behind the cards. */
        @media (max-width: 1099px) {
          .beat .beat__media { display: contents; }
          .beat .beat__title {
            margin: 0; font-size: calc(var(--t-body-size) * 1.9);
            line-height: 1.1;
          }

          .beat:has(.beat__fig) {
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
            column-gap: var(--space-5);
            row-gap: var(--space-6);
            align-items: start;
          }
          .beat .beat__fig { grid-column: 1 / -1; grid-row: 1; }
          .beat:has(.beat__fig) .beat__quote {
            grid-column: 1 / -1; grid-row: 1;
            align-self: center; justify-self: center;
            /* No side padding: 8% of the card on each side left a short
               line like 23 September 2026 about 100px to set in, and it
               broke onto two lines. */
            margin: 0; padding: 0; max-width: 24ch;
            position: relative; z-index: 1;
            text-align: center;
            text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
          }
          .beat:has(.beat__fig) .beat__title { grid-column: 1; grid-row: 2; max-width: none; }
          .beat:has(.beat__fig) .beat__prog { grid-column: 2; grid-row: 2; }

          .beat:not(:has(.beat__fig)) {
            grid-template-columns: minmax(0, 1fr);
            justify-items: center;
            row-gap: var(--space-5);
            text-align: center;
          }
          .beat:not(:has(.beat__fig)) .beat__title { order: 1; max-width: 16ch; }
          .beat:not(:has(.beat__fig)) .beat__prog { order: 2; max-width: 75%; }
          .beat:not(:has(.beat__fig)) .beat__quote { order: 3; margin: 0; text-align: center; }
          /* A single centred column, so its programme is P1; the photo
             cards keep P2 because they run title and programme side by
             side. */
          .beat:not(:has(.beat__fig)) :is(.beat__lead, .beat__prose, .beat__list li) {
            font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          }

          .beat.is-bleed {
            min-height: 100dvh;
            align-content: center;
          }
          .is-bleed .beat__prog {
            position: relative; top: auto; height: auto;
            display: block;
          }
        }

        @media (min-width: 1100px) {
          /* The middle of the picture column, x960 of 1920 in the frame. */
          .days__spine { left: 49%; }
          /* x508-1412 of 1920 for the picture, x1458-1819 for the
             programme — the design's own three bands. */
          .beat {
            grid-template-columns: 22% 54% 24%;
            gap: 0; padding: 0;
            align-items: start;
            margin-bottom: var(--ripe-card-gap);
          }
          .beat__media { grid-column: 2; position: static; }
          .beat__prog {
            grid-column: 3; align-self: start;
            margin-top: 50px;
            padding-left: 5.1%; padding-right: 20%;
          }

          /* Every title on the same left edge, whether or not its beat
             carries a picture: x433 of 1920, which is 22.55%, and 312
             wide, which is 16.25%.

             They are positioned against the beat rather than against the
             picture column — the two origins were the reason a title with
             a photograph and one without did not line up. A beat with no
             picture has no height of its own once its title is taken out
             of the flow, so it is given one. */
          /* Mostly clear of the picture, with only its last few
             characters over it. The picture column starts at 22%, so a
             title set at 9% and 16.25% wide runs to 25.25% — about a
             fifth of it touching, and the rest on the black. */
          .beat__title {
            position: absolute; z-index: 1;
            left: calc(9% + 30px); width: 16.25%; max-width: none;
            overflow-wrap: normal; hyphens: none;
            /* Level with 27 SEPTEMBER, not with the top of the card.
               The programme column starts 50px down, and the two blocks
               are set at different sizes and leadings — so aligning the
               boxes leaves the two cap-heights visibly apart. Each block
               carries its own distance from box top to cap top: half its
               leading, plus the font's own gap above the caps, measured
               at 0.105em. The title is pulled up by its own and pushed
               down by the column's, which lands the two cap lines on
               each other whatever the viewport does to either size. */
            top: 50px;
            margin: calc(var(--t-body-size) * 0.205 - 0.13em) 0 0;
          }
          /* A beat with no date opens its column on prose instead, which
             is set at a longer leading — so its cap line sits lower and
             the title has to follow it down. Same arithmetic, that
             block's own leading. */
          .beat:not(:has(.beat__date)) .beat__title {
            margin-top: calc(var(--t-body-size) * 0.305 - 0.13em);
            text-align: left;
            text-shadow: 0 2px 22px rgba(0, 0, 0, 0.5);
          }
          .beat:not(:has(.beat__fig)) {
            min-height: calc(var(--t-display-size) * 2.3);
          }

          /* Scattered, not centred: each line sits where the frame puts
             it — qx across the viewport, qy down its picture. The
             fallbacks are what a beat with no coordinates gets. */
          /* Centred on the picture, and centre-set. The vertical stays
             per-beat so the lines still land in different places down
             the run rather than all at one height. */
          .beat__quote {
            position: absolute; z-index: 1; margin: 0;
            left: 50%; top: var(--qy, 55%);
            bottom: auto; transform: translateX(-50%);
            width: 20ch; text-align: center;
            text-shadow: 0 2px 20px rgba(0, 0, 0, 0.65);
          }
          .beat:not(:has(.beat__fig)) .beat__quote { top: 0.1em; }

          .beat.is-bleed {
            grid-template-columns: 22% 54% 24%;
            /* The row has to be the full two screens. Left to size to its
               content it is one screen tall — the height of the sticky
               columns — and a sticky box cannot travel inside a cell no
               taller than itself, so there was no hold. */
            grid-template-rows: minmax(200dvh, auto);
            align-items: start; padding: 0;
            /* No card gap after this one. It is two viewports tall and
               its last screen is the fade-out, which is already empty —
               a card gap on top of that is a second hole. */
            margin-bottom: 0;
          }
          /* The same left edge as every other title, in viewport units.
             A percentage cannot be used here: this beat's media column is
             sticky, and a sticky element is a containing block for its
             absolute children — so 16.25% resolved against the 54%-wide
             column rather than the page, and the title came out narrow
             and out of line with the rest. Viewport units are measured
             the same wherever they sit; the column's own left edge is at
             22vw, so the offset backs out from there. */
          /* Title and programme hang from one line, 36% down the screen,
             rather than each being centred on its own height — the title
             is three short lines and the programme twice as tall, so
             centring both left the title's first line well below the
             date. The cap line is corrected the same way as every other
             card's title, so WHITE. and 23 SEPTEMBER share a baseline
             for their caps. */
          .is-bleed .beat__title {
            position: absolute;
            left: calc(30px - 13vw); width: 16.25vw;
            top: 36%; transform: none;
            margin: calc(var(--t-body-size) * 0.205 - 0.13em) 0 0;
          }
          /* No drop shadow anywhere on this screen. The indigo ground is
             dimmed in RipeBackdrop now, which is the honest way to make
             white type legible over a cream print — a shadow behind every
             letter was the page apologising for a ground that was too
             bright. */
          .is-bleed .beat__prog {
            align-self: start; margin-top: 0;
            justify-content: flex-start; padding-top: 36dvh;
          }
          .is-bleed .beat__quote {
            left: 50%; top: 14%; bottom: auto;
            transform: translateX(-50%);
          }
          .is-bleed .beat__title,
          .is-bleed .beat__quote,
          .is-bleed .beat__prog { text-shadow: none; }
        }
      `}</style>

      <style jsx global>{`
        /* Soft at the edges of the screen, clear in the middle. Two
           backdrop-filter bands with feathered masks, so they blur what
           is behind them without painting anything themselves. They live
           under both navigation bars and above the page. */
        .ripe-timeline-fade {
          position: fixed; left: 0; right: 0; z-index: 38;
          height: 20vh; pointer-events: none;
          opacity: 0; transition: opacity 420ms var(--ease);
        }
        body.ripe-timeline .ripe-timeline-fade { opacity: 1; }
        .ripe-timeline-fade--top {
          top: 0;
          backdrop-filter: blur(11px);
          -webkit-backdrop-filter: blur(11px);
          -webkit-mask-image: linear-gradient(to bottom, #000 18%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 18%, transparent 100%);
        }
        .ripe-timeline-fade--bottom {
          bottom: 0;
          backdrop-filter: blur(11px);
          -webkit-backdrop-filter: blur(11px);
          -webkit-mask-image: linear-gradient(to top, #000 12%, transparent 100%);
          mask-image: linear-gradient(to top, #000 12%, transparent 100%);
        }
        /* The site's own bottom vignette would stack with ours. */
        body.ripe-timeline .page-vignette { opacity: 0; }

        @media (prefers-reduced-motion: reduce) {
          .ripe-timeline-fade { display: none; }
        }
        @media (max-width: 1099px) {
          .ripe-timeline-fade { height: 12vh; }
        }
      `}</style>
    </div>
  )
}
