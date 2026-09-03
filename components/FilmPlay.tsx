'use client'

import { useEffect, useState } from 'react'
import { track } from '@/lib/analytics'

/* ═══════════════════════════════════════════════════════════════════
   FILM PLAY — the play affordance + fullscreen player,
   without the banner background. Made to overlay a crossfade passage
   (StorytellingScroller): a bottom-right "▶ caption" control and an
   optional bottom-left note, that open the YouTube film in the same
   fixed fullscreen viewer (youtube-nocookie, chrome
   stripped back, closed with ✕ or Escape).

   It fills its parent (absolute inset:0) but is click-through except for
   the CTA button itself, so it can sit over a sticky backdrop without
   swallowing scroll.
═══════════════════════════════════════════════════════════════════ */

export function FilmPlay({
  youtubeId,
  caption,
  note,
}: {
  youtubeId: string
  /** Small mono label beside the play glyph, bottom-right. */
  caption?: string
  /** Optional mono line, bottom-left, opposite the CTA. */
  note?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const src =
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&fs=0&color=white`

  return (
    <div className="film-play">
      {note && <span className="label film-play__note">{note}</span>}

      <button
        type="button"
        className="film-play__cta"
        onClick={() => { setOpen(true); track('film_play', { film: caption ?? 'film', note }) }}
        aria-label={caption ? `Play the film — ${caption}` : 'Play the film'}
      >
        <span aria-hidden className="film-play__cta-icon">
          <svg viewBox="0 0 24 24" width={10} height={10}>
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
        {caption && <span className="label">{caption}</span>}
      </button>

      {open && (
        <div className="film-play__fs" role="dialog" aria-modal="true" aria-label="Film">
          <button type="button" className="film-play__close" onClick={() => setOpen(false)} aria-label="Close film">
            <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={1.5} fill="none" />
            </svg>
          </button>
          <div className="film-play__frame">
            <iframe
              src={src}
              title="Aura — film"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .film-play {
          position: absolute;
          inset: 0;
          pointer-events: none; /* click-through except the CTA */
          z-index: 3;
        }
        /* Bottom-right CTA. */
        .film-play__cta {
          position: absolute;
          right: var(--gutter);
          bottom: clamp(24px, 5vh, 56px);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0;
          margin: 0;
          background: transparent;
          border: 0;
          color: #ffffff;
          cursor: pointer;
          pointer-events: auto;
        }
        .film-play__cta .label { color: #fff; }
        @media (max-width: 768px) {
          .film-play__cta { bottom: var(--gutter); max-width: 46%; }
          .film-play__cta .label { line-height: 1.35; text-align: left; }
        }
        .film-play__cta-icon {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          padding-left: 1px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.7);
          color: #ffffff;
          transition: border-color var(--dur-fast) var(--ease);
        }
        .film-play__cta:hover .film-play__cta-icon { border-color: #fff; }
        /* Bottom-left note, opposite the CTA. */
        .film-play__note {
          position: absolute;
          left: var(--gutter);
          bottom: clamp(24px, 5vh, 56px);
          max-width: min(48%, 460px);
          color: #ffffff;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .film-play__note { bottom: var(--gutter); max-width: 40%; line-height: 1.35; }
        }
        /* Fullscreen film overlay. */
        .film-play__fs {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          animation: film-play-fade var(--dur-base) var(--ease-out);
        }
        @keyframes film-play-fade { from { opacity: 0; } to { opacity: 1; } }
        .film-play__frame {
          position: relative;
          width: min(100vw, calc(100svh * 16 / 9));
          aspect-ratio: 16 / 9;
          max-width: 100vw;
          max-height: 100svh;
          overflow: hidden;
        }
        .film-play__frame :global(iframe) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }
        .film-play__close {
          position: absolute;
          top: clamp(16px, 3vh, 32px);
          right: clamp(16px, 3vw, 32px);
          z-index: 2;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.6);
          background: rgba(0, 0, 0, 0.4);
          color: #fff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
        }
        .film-play__close:hover { border-color: #fff; background: rgba(0, 0, 0, 0.6); }
      `}</style>
    </div>
  )
}
