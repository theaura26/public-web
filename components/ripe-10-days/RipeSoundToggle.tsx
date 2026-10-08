'use client'

import { useEffect, useRef, useState } from 'react'
import { SpeakerHigh } from '@phosphor-icons/react'

/* ── A film's sound, on request ─────────────────────────────────────
   The page's films play silent as they pass — a browser won't start one
   with sound by itself. One with something to hear (a talk) carries this
   button over its corner: pressed, the film starts again from the top
   with its sound, so nothing said is missed; pressed again, it is quiet.
   It goes quiet by itself when it scrolls away (the stage pauses films
   off screen), so it never talks from somewhere the reader can't see.

   Phosphor's speaker-high, alone in white outline over the film's corner:
   a little dim while the film is quiet, full white once its sound is on.
   It sits beside its <video> in the same frame and finds the film there.
─────────────────────────────────────────────────────────────────────── */

export function RipeSoundToggle({ label }: { label: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const film = ref.current?.parentElement?.querySelector('video')
    if (!film) return
    const quiet = () => { film.muted = true; setOn(false) }
    film.addEventListener('pause', quiet)
    return () => film.removeEventListener('pause', quiet)
  }, [])

  const toggle = () => {
    const film = ref.current?.parentElement?.querySelector('video')
    if (!film) return
    if (on) { film.muted = true; setOn(false); return }
    film.currentTime = 0
    film.muted = false
    film.play().catch(() => { film.muted = true; setOn(false) })
    setOn(true)
  }

  return (
    <button
      ref={ref} type="button" className="sound"
      aria-pressed={on}
      aria-label={on ? `Mute ${label}` : `Play ${label} with sound`}
      onClick={toggle}
    >
      <SpeakerHigh size={16} weight="regular" aria-hidden />

      <style jsx>{`
        /* The glyph on its own, no ring or backing; the button around it
           is 24px, the least a finger can reliably press. */
        .sound {
          position: absolute; right: 6px; bottom: 6px; z-index: 1;
          width: 24px; height: 24px; padding: 0;
          border: 0; background: none;
          color: #fff; opacity: 0.8;
          cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: opacity var(--dur-fast) var(--ease);
        }
        .sound:hover, .sound[aria-pressed='true'] { opacity: 1; }
        .sound:focus-visible { outline: 1px solid #fff; outline-offset: 2px; opacity: 1; }
      `}</style>
    </button>
  )
}
