'use client'

import { useState } from 'react'
import VideoReactiveArt from '@/components/VideoReactiveArt'
import GenerativeCanvas from '@/components/GenerativeCanvas'

/* ═══════════════════════════════════════════
   COMPUTATIONAL ART PLAYGROUND
   Art 1 (GenerativeCanvas), Art 2 (VideoReactiveArt),
   and Flow Field — with palette + video controls.
═══════════════════════════════════════════ */

const BRAND = [
  '#E8421A', '#F07820', '#F5B810', '#F2A08A',
  '#8AAEE0', '#D4C020', '#7A9040', '#FFFFFF',
]
const WARM = ['#E8421A', '#F07820', '#F5B810', '#E37128']
const COOL = ['#8AAEE0', '#A5B6C8', '#7A9040', '#D4C020']
const EARTH = ['#8B6E4E', '#A67C52', '#C4A265', '#D4C020', '#7A9040', '#4A5E3A']
const DUSK = ['#2D1B4E', '#5C3D7A', '#A878C8', '#E0B8D0', '#F5D0C0', '#FFE8D6']
const FLORA = ['#D4C020', '#7A9040', '#4A7A3A', '#A0D060', '#F5B810', '#FFFFFF']
const OCEAN = ['#0A2E4A', '#1A5276', '#2E86C1', '#85C1E9', '#D6EAF8', '#FFFFFF']
const EMBER = ['#3A0A0A', '#8B1A1A', '#E8421A', '#F07820', '#F5B810', '#FFE0A0']
const MINERAL = ['#2C2C3A', '#4A4A6A', '#8A8AB0', '#C0C0D8', '#E8E8F0', '#FFFFFF']


/* ═══════════════════════════════════════════
   GALLERY PAGE
═══════════════════════════════════════════ */

const VIDEOS = [
  { src: '/aura-hero.mp4', label: 'Hero' },
  { src: '/aura-agroculture.mp4', label: 'Agroculture' },
  { src: '/aura-artistry.mp4', label: 'Artistry' },
  { src: '/aura-reason.mp4', label: 'Reason' },
  { src: '/aura-sanctuary.mp4', label: 'Sanctuary' },
]

const PALETTES = [
  { id: 'brand', label: 'Brand', colors: BRAND },
  { id: 'warm', label: 'Warm', colors: WARM },
  { id: 'cool', label: 'Cool', colors: COOL },
  { id: 'earth', label: 'Earth', colors: EARTH },
  { id: 'dusk', label: 'Dusk', colors: DUSK },
  { id: 'flora', label: 'Flora', colors: FLORA },
  { id: 'ocean', label: 'Ocean', colors: OCEAN },
  { id: 'ember', label: 'Ember', colors: EMBER },
  { id: 'mineral', label: 'Mineral', colors: MINERAL },
  { id: 'mono', label: 'Mono', colors: ['#FFFFFF'] },
]

type ArtId = 'art1' | 'art2'

export default function ArtPage() {
  const [selected, setSelected] = useState<ArtId>('art1')
  const [paletteIdx, setPaletteIdx] = useState(0)

  const pal = PALETTES[paletteIdx]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Controls */}
      <div style={{
        padding: '16px var(--gutter)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        zIndex: 10,
      }}>
        <span className="label">Style</span>
        {([
          { id: 'art1' as ArtId, label: 'Art 1 — Noise Grid' },
          { id: 'art2' as ArtId, label: 'Art 2 — Video Reactive' },
        ]).map(s => (
          <button key={s.id} onClick={() => setSelected(s.id)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 10px',
            border: '1px solid var(--border-strong)', borderRadius: 3,
            background: selected === s.id ? 'rgba(128,128,128,0.15)' : 'transparent',
            color: selected === s.id ? 'var(--text)' : 'var(--text-muted)',
          }}>{s.label}</button>
        ))}

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        <span className="label">Palette</span>
        {PALETTES.map((p, i) => (
          <button key={p.id} onClick={() => setPaletteIdx(i)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 10px',
            border: '1px solid var(--border-strong)', borderRadius: 3,
            background: paletteIdx === i ? 'rgba(128,128,128,0.15)' : 'transparent',
            color: paletteIdx === i ? 'var(--text)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ display: 'flex', gap: 2 }}>
              {p.colors.slice(0, 4).map((c, j) => (
                <span key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
            </span>
            {p.label}
          </button>
        ))}

      </div>

      {/* Canvas */}
      <div style={{ height: 'calc(100vh - 53px)' }}>
        {selected === 'art1' && (
          <GenerativeCanvas style={{ width: '100%', height: '100%' }} />
        )}
        {selected === 'art2' && (
          <VideoReactiveArt
            src="/aura-hero.mp4"
            cellSize={8}
            sparsity={0.40}
            reactivity={0.12}
            colors={pal.colors}
            style={{ height: '100%' }}
          />
        )}
      </div>
    </div>
  )
}
