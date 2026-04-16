import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Aura.Life — The 1000-Year Idea'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          gap: 20,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 300, color: '#1a1a1a', letterSpacing: 8, fontFamily: 'sans-serif' }}>
          aura.life
        </div>
        <div style={{ fontSize: 28, fontWeight: 300, color: '#1a1a1a', fontFamily: 'serif', letterSpacing: 0.5 }}>
          The 1000-Year Idea
        </div>
        <div style={{ fontSize: 18, color: 'rgba(26, 26, 26, 0.5)', fontFamily: 'sans-serif', marginTop: 8 }}>
          A regenerative platform for generational impact
        </div>
      </div>
    ),
    { ...size }
  )
}
