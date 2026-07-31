'use client'

import { useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'

/* ═══════════════════════════════════════════════════════════════════
   FILM BANNER — a full-bleed poster block that opens the film fullscreen.

   Renders like a ParallaxBanner (16:9 desktop / 4:5 mobile, full-bleed)
   with a poster still + a centred play button. On play it opens a
   fixed fullscreen overlay and streams the YouTube film with the
   player chrome stripped back as far as the embed allows:
   `controls=0` removes the scrubber and buttons entirely;
   `modestbranding` + `rel=0` + `iv_load_policy=3` kill related videos,
   annotations, and most branding. The viewer closes with our own ✕
   (or Escape). youtube-nocookie keeps it on the privacy domain.
═══════════════════════════════════════════════════════════════════ */

export type FilmBannerProps = {
  /** YouTube video id, e.g. "bFTZUfn4D0A". Omit when `placeholder`. */
  youtubeId?: string
  /** Poster still shown on the banner before play — and the fallback still
   *  for `bgVideo`. */
  poster?: string
  /** Optional ambient background video (.mp4) — autoplays muted/looped behind
   *  the CTA, with `poster` as the still fallback. The CTA still opens the
   *  full YouTube film. */
  bgVideo?: string
  alt?: string
  /** Small mono label for the play CTA, pinned bottom-right. */
  caption?: string
  /** Optional mono line pinned bottom-left, opposite the CTA — e.g. a vision
   *  line on the closing film. */
  note?: string
  /** Render an empty film slot — same full-bleed geometry, a play
   *  affordance and a dashed drop-zone — while the film is still being
   *  sourced. `caption` becomes the slot label. */
  placeholder?: boolean
}

export function FilmBanner({ youtubeId, poster, alt = '', caption, note, bgVideo, placeholder = false }: FilmBannerProps) {
  const [open, setOpen] = useState(false)
  const bgVideoRef = useRef<HTMLVideoElement>(null)

  // Lock body scroll + wire Escape while the film is fullscreen.
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

  // Lazy-play the ambient background video only while it's near the viewport
  // — same pattern as ParallaxBanner / DataCard. No-op until a bgVideo loads.
  useEffect(() => {
    const v = bgVideoRef.current
    if (!v) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() },
      { threshold: 0.1 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  // Empty film slot — no iframe, no functional play. Signals a film is
  // coming without faking one.
  if (placeholder || !youtubeId) {
    return (
      <div className="film-banner film-banner--ph" role="group" aria-label={caption || 'Film placeholder'}>
        <div className="film-banner__ph">
          <span aria-hidden className="film-banner__ph-play">
            <svg viewBox="0 0 24 24" width={26} height={26}>
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
          <span className="film-banner__ph-label">{caption || 'Estate film'}</span>
          <span className="film-banner__ph-meta">Film placeholder · 16 : 9</span>
        </div>
        <style jsx>{`
          .film-banner--ph {
            position: relative;
            width: 100vw;
            margin-left: calc(50% - 50vw);
            aspect-ratio: 16 / 9;
            overflow: hidden;
            background: #e8e5de;
          }
          @media (max-width: 768px) {
            .film-banner--ph { aspect-ratio: 4 / 5; }
          }
          .film-banner__ph {
            position: absolute;
            inset: clamp(14px, 2vw, 28px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
            text-align: center;
            padding: var(--gutter);
            border: 1px dashed rgba(0, 0, 0, 0.22);
            background-image: repeating-linear-gradient(
              45deg,
              rgba(0, 0, 0, 0.022) 0 14px,
              transparent 14px 28px
            );
          }
          .film-banner__ph-play {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: clamp(60px, 7vw, 84px);
            height: clamp(60px, 7vw, 84px);
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.3);
            color: rgba(0, 0, 0, 0.5);
          }
          .film-banner__ph-label {
            font-family: var(--font-mono);
            font-size: clamp(12px, 1.4vw, 15px);
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.58);
          }
          .film-banner__ph-meta {
            font-family: var(--font-mono);
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.32);
          }
        `}</style>
      </div>
    )
  }

  // Standard player controls (scrubber, play/pause, volume) but the
  // branding pulled back as far as the embed allows: modestbranding
  // trims the logo, rel=0 kills cross-channel related videos,
  // iv_load_policy=3 drops annotations. fs=0 hides YouTube's own
  // fullscreen button — the player is already in our fullscreen overlay.
  const src =
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&fs=0&color=white`

  return (
    <div className="film-banner" role="group">
      {bgVideo ? (
        <video
          ref={bgVideoRef}
          className="film-banner__poster"
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={alt}
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={poster} alt={alt} loading="lazy" decoding="async" className="film-banner__poster" />
      )}
      <div aria-hidden className="film-banner__tint" />

      {/* Whole-block click target — a full-bleed transparent button so a
          click (or keyboard activation) anywhere on the banner opens the
          film. The CTA glyph and note above it are visual only. */}
      <button
        type="button"
        className="film-banner__hit"
        onClick={() => {
          setOpen(true)
          track('film_play', { film: caption ?? 'film', note })
        }}
        aria-label={caption ? `Play the film — ${caption}` : 'Play the film'}
      />

      {/* Optional vision line, pinned bottom-left opposite the CTA — mirrors
          the homepage sanctuary meta row (label left, CTA right). */}
      {note && <span className="label film-banner__note">{note}</span>}

      {/* Visual play affordance only — the whole-block hit button behind it
          handles the click, so this is non-interactive (pointer-events:none). */}
      <span aria-hidden className="film-banner__cta">
        <span className="film-banner__cta-icon">
          <svg viewBox="0 0 24 24" width={10} height={10}>
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        </span>
        {caption && <span className="label" style={{ color: '#fff' }}>{caption}</span>}
      </span>

      {open && (
        <div className="film-banner__fs" role="dialog" aria-modal="true" aria-label="Film">
          <button type="button" className="film-banner__close" onClick={() => setOpen(false)} aria-label="Close film">
            <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={1.5} fill="none" />
            </svg>
          </button>
          <div className="film-banner__frame">
            <iframe
              src={src}
              title="Sampigekhan Estate — film"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .film-banner {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #0a0a0a;
        }
        @media (max-width: 768px) {
          .film-banner { aspect-ratio: 4 / 5; }
        }
        .film-banner__poster {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .film-banner__tint {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.28);
          pointer-events: none;
          z-index: 1;
        }
        /* Matches the homepage sanctuary "Explore X" CTA exactly: a 22px
           mono-bordered circle + label, gap 10, anchored bottom-right at the
           gutter / clamp(24,5vh,56) inset. Same restraint on hover (just a
           border brighten — no fill), so the interaction reads identically. */
        .film-banner__hit {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: transparent;
          border: 0;
          padding: 0;
          margin: 0;
          cursor: pointer;
        }
        .film-banner__cta {
          position: absolute;
          right: var(--gutter);
          bottom: clamp(24px, 5vh, 56px);
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0;
          margin: 0;
          background: transparent;
          border: 0;
          color: #ffffff;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .film-banner__cta { bottom: var(--gutter); }
        }
        .film-banner__cta-icon {
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
        .film-banner:hover .film-banner__cta-icon {
          border-color: #fff;
        }
        /* Vision line, bottom-left — opposite the bottom-right CTA. Capped
           width so it never runs into the CTA. */
        .film-banner__note {
          position: absolute;
          left: var(--gutter);
          bottom: clamp(24px, 5vh, 56px);
          z-index: 3;
          max-width: min(48%, 460px);
          color: #ffffff;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .film-banner__note { bottom: var(--gutter); max-width: 56%; }
        }
        /* Fullscreen film overlay */
        .film-banner__fs {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: film-fade var(--dur-base) var(--ease-out);
        }
        @keyframes film-fade { from { opacity: 0; } to { opacity: 1; } }
        .film-banner__frame {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        /* Iframe fills the frame exactly — the control bar at the bottom
           must stay visible, so no overscale-clip here. */
        .film-banner__frame :global(iframe) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }
        .film-banner__close {
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
        .film-banner__close:hover {
          border-color: #fff;
          background: rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  )
}
