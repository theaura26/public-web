'use client'

import { useEffect, useRef } from 'react'

/* StudioPillarMedia — 3:4 media tile for the /studios pillar grid.
   Renders an autoplaying muted loop when `video` is provided (paused
   while offscreen via IntersectionObserver, same gesture the homepage
   pillars use). Falls back to a plain still image otherwise. */
export function StudioPillarMedia({
  image,
  video,
  alt,
}: {
  image: string
  video?: string
  alt: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!video) return
    const el = videoRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [video])

  const surface = {
    position: 'absolute' as const,
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  }

  return (
    <div
      className="studio-pillar-media"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3 / 4',
        overflow: 'hidden',
        borderRadius: 'var(--radius-1)',
        background: 'var(--bg)',
      }}
    >
      {video ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={image}
          aria-label={alt}
          style={surface}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={alt} loading="lazy" decoding="async" style={surface} />
      )}
    </div>
  )
}
