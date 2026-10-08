'use client'

import { useEffect, useRef, useState } from 'react'
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'

/* ── A film's sound, on request ─────────────────────────────────────
   The page's films play silent as they pass — a browser won't start one
   with sound by itself. One with something to hear (a talk) carries this
   button over its corner: pressed, the film starts again from the top
   with its sound, so nothing said is missed; pressed again, it is quiet.
   It goes quiet by itself when it scrolls away (the stage pauses films
   off screen), so it never talks from somewhere the reader can't see.

   Styled as the site's icon controls: a Phosphor glyph in a thin white
   ring, a dark glass behind it. It sits beside its <video> in the same
   frame and finds the film there.
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
      {on ? <SpeakerHigh size={12} weight="regular" aria-hidden /> : <SpeakerSlash size={12} weight="regular" aria-hidden />}

      <style jsx>{`
        /* The house icon control (ArrowLink's 22px ring, Microsite.tsx):
           a small Phosphor glyph in a thin white ring — 24px here, the
           least a finger can reliably press, over the film. */
        .sound {
          position: absolute; right: 8px; bottom: 8px; z-index: 1;
          width: 24px; height: 24px; padding: 0;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.7);
          background: rgba(0, 0, 0, 0.4);
          color: #fff;
          cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
        }
        .sound:hover { border-color: #fff; background: rgba(0, 0, 0, 0.6); }
        .sound:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
      `}</style>
    </button>
  )
}
