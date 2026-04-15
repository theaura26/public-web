'use client'

import { useState } from 'react'
import VideoReactiveArt from '@/components/VideoReactiveArt'

const VIDEOS = [
  { src: '/aura-hero.mp4', label: 'Hero' },
  { src: '/aura-agroculture.mp4', label: 'Agroculture' },
  { src: '/aura-artistry.mp4', label: 'Artistry' },
  { src: '/aura-reason.mp4', label: 'Reason' },
  { src: '/aura-sanctuary.mp4', label: 'Sanctuary' },
]

export default function ArtPage() {
  const [videoIdx, setVideoIdx] = useState(0)
  const [cellSize, setCellSize] = useState(10)
  const [sparsity, setSparsity] = useState(0.40)

  return (
    <div style={{ background: '#131719', minHeight: '100vh', paddingTop: 56 }}>
      {/* Controls */}
      <div style={{
        padding: '16px var(--gutter)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border)',
      }}>
        <span className="label">Video</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {VIDEOS.map((v, i) => (
            <button
              key={v.src}
              onClick={() => setVideoIdx(i)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                padding: '4px 10px',
                border: '1px solid var(--border-strong)',
                borderRadius: 3,
                background: videoIdx === i ? 'rgba(128,128,128,0.15)' : 'transparent',
                color: videoIdx === i ? 'var(--text)' : 'var(--text-muted)',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        <span className="label">Grid</span>
        {[6, 8, 10, 14, 20].map(s => (
          <button
            key={s}
            onClick={() => setCellSize(s)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: '4px 8px',
              border: '1px solid var(--border-strong)',
              borderRadius: 3,
              background: cellSize === s ? 'rgba(128,128,128,0.15)' : 'transparent',
              color: cellSize === s ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {s}px
          </button>
        ))}

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        <span className="label">Density</span>
        {[
          { v: 0.30, l: 'Dense' },
          { v: 0.40, l: 'Medium' },
          { v: 0.50, l: 'Sparse' },
          { v: 0.58, l: 'Minimal' },
        ].map(d => (
          <button
            key={d.v}
            onClick={() => setSparsity(d.v)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: '4px 10px',
              border: '1px solid var(--border-strong)',
              borderRadius: 3,
              background: sparsity === d.v ? 'rgba(128,128,128,0.15)' : 'transparent',
              color: sparsity === d.v ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {d.l}
          </button>
        ))}
      </div>

      {/* Art canvas */}
      <VideoReactiveArt
        key={`${VIDEOS[videoIdx].src}-${cellSize}-${sparsity}`}
        src={VIDEOS[videoIdx].src}
        cellSize={cellSize}
        sparsity={sparsity}
        reactivity={0.12}
        style={{ height: 'calc(100vh - 56px - 53px)' }}
      />
    </div>
  )
}
