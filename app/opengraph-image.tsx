import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Aura — The 1000-Year Idea'
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
          background: '#131719',
          gap: 24,
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 300, color: '#ededed', letterSpacing: 12, fontFamily: 'sans-serif' }}>
          aura
        </div>
        <div style={{ fontSize: 22, color: 'rgba(237, 237, 237, 0.5)', fontFamily: 'sans-serif', letterSpacing: 1 }}>
          Think in Generations.
        </div>
      </div>
    ),
    { ...size }
  )
}
