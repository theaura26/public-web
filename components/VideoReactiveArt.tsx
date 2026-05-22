'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════
   VIDEO-REACTIVE COMPUTATIONAL ART
   Organic clusters of geometric primitives
   that read video and react to motion + mouse.
   Uses noise fields for non-uniform density.
═══════════════════════════════════════════ */

const PALETTE = [
  '#CA4926', // Dry Osmosis
  '#DD7C37', // Red Honey
  '#E4B239', // Banana Wash
  '#E1ADA2', // Solera Maceration
  '#A5B6C8', // Solera Wash
  '#B6B050', // Grappa
  '#7A7C5C', // Volcanic
  '#FFFFFF', // Appassimento
  '#E37128', // Brand accent
]

/* ── Reactive-art glyph set ──
   Five hand-drawn SVG paths supplied as the only shape vocabulary the
   reactive-art canvas may draw with. Each glyph carries its native
   viewBox (200×200 for all but #3 which is 198×200) so the renderer can
   scale it down to the cell size at draw time via canvas transforms.
   The actual `d` payload is the path string from each SVG file in
   /public/reactive-art/. */
type ShapeType = 0 | 1 | 2 | 3 | 4
const SHAPES: ShapeType[] = [0, 1, 2, 3, 4]

const SHAPE_PATHS: { d: string; vb: [number, number] }[] = [
  // 1 — Branched / botanical
  {
    vb: [200, 200],
    d: 'M54.7191 6.70436C59.2979 6.4289 59.8703 6.65539 61.5204 10.5608C65.6669 20.3854 69.5028 32.3097 73.4119 42.5873C76.2736 50.1165 78.5935 57.8232 81.4735 65.3401C82.9531 65.8115 82.947 64.1342 83.1114 63.0446C84.4388 54.2484 87.3371 43.8055 88.0738 35.6458C88.4331 31.6425 87.8363 27.4433 88.1225 23.4828C88.2991 21.0404 92.6161 0.950353 93.5781 0.246405C94.5402 -0.457542 97.2801 0.5035 98.0595 1.17072C100.038 2.84795 99.941 22.6258 100.306 26.5496C101.159 35.5846 103.43 44.5706 103.339 53.7342C104.392 54.0096 104.55 53.2934 105.165 52.8221C114.439 45.6724 118.603 33.4727 125.514 25.0192C129.216 20.4895 134.124 16.2352 137.807 11.6748L139.805 11.8768C141.68 13.4623 141.966 15.3966 141.339 17.7104C139.835 23.2624 134.099 32.0526 131.603 37.8617C128.918 44.1176 126.89 50.8266 124.108 57.1988C122.177 61.6184 118.676 66.0196 118.536 70.8309C119.291 71.6206 132.589 62.7814 134.727 61.7592C145.565 56.5928 152.049 53.9484 162.699 47.7292C166.462 45.5317 179.358 40.0715 183.395 39.19C184.131 39.0309 184.85 38.9329 185.599 39.1349C187.036 39.6185 186.81 42.9974 186.47 44.136C185.897 46.0458 170.304 56.8744 167.472 59.2433C164.093 62.0714 160.933 65.7625 157.438 68.7007C151.465 73.7263 145.029 78.1458 139.208 83.3489C139.184 84.8119 145.479 84.1325 146.782 84.2732C150.539 84.6895 154.534 85.8709 158.315 86.1219C166.23 86.6483 174.316 84.9099 182.031 85.4975C187.474 85.9076 192.93 87.8175 198.44 87.9277L199.701 88.5031C200.784 91.6249 198.793 93.7551 195.865 94.5019C189.965 96.0077 182.719 96.0873 176.733 97.2626C169.488 98.6889 162.394 100.997 155.13 102.423C148.853 103.659 142.301 103.69 136.151 105.649C135.914 106.732 136.462 106.861 137.156 107.381C145.826 113.931 156.342 115.125 165.737 118.969C170.206 120.799 177.769 125.059 182.049 127.618C186.329 130.177 182.731 133.709 179.017 133.617C162.93 129.546 146.448 127.777 130.081 125.194C134.574 130.826 137.643 137.657 142.252 143.191C149.522 151.907 155.313 156.982 161.201 167.51C161.743 168.478 164.787 174.458 164.745 174.936C164.611 176.607 162.577 177.347 161.134 177.415C158.138 177.549 147.184 166.139 144.341 163.685L119.748 144.733C119.669 150.114 119.699 155.5 120.43 160.838C121.38 167.817 124.649 174.238 125.204 181.081C125.508 184.821 125.07 188.904 125.191 192.7C125.295 195.993 127.846 201.575 121.38 199.58C120.351 199.262 119.888 198.154 119.413 197.284C116.35 191.634 114.621 183.23 112.137 177.109C109.543 170.712 106.237 164.578 103.649 158.151C101.816 153.603 100.714 148.026 98.5832 143.699C96.2877 139.034 94.5097 140.497 89.7604 140.546C87.7937 141.22 84.4205 155.384 84.0552 158.029C83.7507 160.287 84.1587 162.509 83.8786 164.572C82.5938 173.938 79.3789 181.926 76.6207 190.882C68.6991 192.393 71.1225 176.717 71.0981 171.275C71.0738 165.111 70.7328 160.293 70.4892 154.221C70.2457 148.149 70.7145 142.578 70.5136 136.794C70.1361 136.347 65.5938 140.258 65.0397 140.754C57.1303 147.8 54.2564 154.68 48.0458 162.154C45.1109 165.686 38.7359 171.85 35.2044 174.905C32.6471 177.115 30.2298 177.225 29.4626 173.448C28.8842 170.626 38.0174 156.853 39.8441 153.297C42.4806 148.155 44.5995 142.738 46.8158 137.406C40.8548 138.545 36.1543 142.468 30.2663 144.28C26.2721 145.511 16.944 147.941 13.0288 148.363C7.90203 148.92 8.99193 143.858 12.2495 141.446C21.6202 134.504 34.425 129.791 43.9784 122.029C44.7761 121.38 45.8294 120.976 45.598 119.697C42.5171 119.44 38.5898 118.491 35.6002 118.448C31.6911 118.387 27.7943 119.44 23.9279 119.465C16.5604 119.513 9.18068 116.857 1.81927 116.367C-0.871995 115.571 -0.238756 112.719 1.5331 111.127C4.1513 108.783 19.5622 108.189 23.9705 107.412C34.6686 105.526 45.1901 102.086 56.1561 101.394C57.1486 100.825 56.7406 97.1402 55.1697 96.9504C48.7886 94.9916 43.0894 91.3189 36.8118 89.1397C29.5113 86.6055 22.7771 86.2443 15.4278 83.1469C10.8125 81.2065 5.60044 78.3173 1.3139 75.9116C1.21648 72.5816 2.58647 71.4002 5.81355 71.3818C12.5295 71.3451 20.853 73.8548 27.6969 74.4792C32.9637 74.9628 39.0221 74.5649 44.3985 75.0975C45.2084 74.3629 36.8423 61.6735 35.7828 60.2472C31.8373 54.9584 27.0149 51.3224 23.4834 45.7337C21.7176 42.9362 16.9988 35.2479 15.9028 32.5913C15.507 31.6425 14.9712 30.7855 15.2756 29.6837C19.2029 25.9925 20.5364 29.298 23.1789 30.7671C24.2567 31.367 25.5292 31.5629 26.5948 32.2179C29.4139 33.9441 58.275 55.8338 59.5841 54.3341C59.3101 51.0041 59.3649 46.9579 58.9083 43.7198C58.1593 38.4555 54.7252 30.5468 54.7252 25.9374V6.69824L54.7191 6.70436Z',
  },
  // 2 — Blob
  {
    vb: [200, 200],
    d: 'M162.579 176.251C133.455 203.822 93.3079 205.481 57.5148 190.979C-64.7613 141.447 28.3182 -53.7088 147.114 14.1898C213.108 51.9088 216.268 125.425 162.579 176.244V176.251Z',
  },
  // 3 — Twin organism
  {
    vb: [198, 200],
    d: 'M115.137 0.350478C142.485 -2.94695 167.403 17.5095 178.341 41.2401C189.278 64.9708 201.023 99.4741 197.295 126.827C192.952 158.673 153.868 188.103 122.224 176.242C115.99 173.909 110.425 168.905 104.292 166.658C95.3989 181.431 84.6689 198.057 65.8224 199.748C28.0293 203.138 3.21826 171.77 0.981579 136.209C-1.25511 100.663 -2.6463 51.2174 31.9493 30.8382C47.3063 21.7953 62.402 17.3782 80.3186 21.5328C82.8012 20.359 83.3085 17.4554 84.9918 15.5326C92.2168 7.28512 104.33 1.65555 115.145 0.358197L115.137 0.350478ZM115.468 150.279C127.535 158.009 136.935 162.419 150.87 155.708C159.709 151.453 173.644 137.908 176.719 128.495C181.323 114.401 174.536 101.891 171.669 88.7864C170.124 81.736 170.086 74.1372 168.664 67.1408C165.643 52.2367 146.043 17.9728 132.708 10.7756C122.493 5.26187 105.783 7.06117 98.5656 16.8299C97.3589 18.4593 94.123 24.4055 93.9616 26.089C93.7925 27.8651 97.5356 29.6489 98.8423 30.9308C115.475 47.3562 137.934 89.4042 135.26 113.034C134.652 118.386 128.619 127.83 125.606 132.618C123.223 136.402 117.066 143.128 115.737 146.588C115.329 147.646 114.876 149.229 115.475 150.264L115.468 150.279ZM73.8852 40.2131C58.997 38.8539 34.6702 48.4219 28.2215 62.546C22.795 74.4384 24.363 83.2032 23.2408 95.3118C22.4799 103.567 19.2517 112.046 18.6214 119.954C17.7836 130.464 19.8743 141.012 22.0879 151.206C26.9225 173.423 33.6633 195.995 61.7871 191.841C69.604 190.69 78.5738 179.408 82.9395 173.021C84.6074 170.573 92.1246 158.117 92.3013 156.14C92.5704 153.152 88.5505 151.793 86.921 150.04C76.0297 138.341 59.0047 120.849 60.0808 103.814C60.8494 91.5974 66.9522 76.4848 69.6808 64.1368C71.4102 56.3373 72.5862 48.113 73.8775 40.2131H73.8852ZM104.469 137.985L124.868 110.316C126.282 106.803 124.291 98.9876 122.816 95.4739C120.241 89.327 112.086 85.5044 108.066 79.4656C105.007 74.8631 103.9 69.3107 101.348 64.631C98.2505 58.9474 92.7702 53.8275 88.8426 48.6999C87.6281 48.6999 84.9072 66.16 84.2385 68.7161C80.8719 81.5043 73.424 95.9218 70.9798 108.602C70.2727 112.285 72.371 115.019 74.3387 117.977C80.5799 127.359 84.5536 125.884 93.0776 130.749C95.3989 132.07 102.97 138.866 104.476 137.978L104.469 137.985Z',
  },
  // 4 — Spiral / wind
  {
    vb: [201, 200],
    d: 'M111.877 88.8526C113.166 89.1193 113.891 88.2201 114.837 87.6409C121.497 83.5411 124.236 77.8409 129.729 72.8875C137.115 66.2195 147.971 60.3059 158.301 63.377C162.093 64.5048 163.741 68.9705 164.13 69.1381C173.469 73.0399 190.009 66.852 197.86 70.9671C202.819 73.5657 201.201 81.2396 197.844 84.707C191.863 90.8873 177.756 97.662 170.035 102.516C166.083 105.001 162.459 108.933 158.027 111.029C153.136 113.338 141.379 114.016 135.795 113.955C131.827 113.909 126.609 112.72 122.52 112.416C124.29 117.308 128.417 117.468 131.827 119.998C132.575 120.554 133.002 122.162 133.575 122.292C134.406 122.475 135.352 120.912 136.542 120.829C142.066 120.425 148.147 127.26 151.008 131.437C159.339 143.584 154.128 158.535 155.227 172.047C155.73 178.25 161.391 193.247 157.523 197.919C153.655 202.59 149.123 198.124 144.904 196.814C133.353 188.324 122.588 181.816 113.41 170.523C101.302 155.624 104.507 146.906 100.272 129.707C99.6926 127.352 97.7166 125.104 98.1667 122.307L94.5962 129.745C91.5597 140.315 91.8573 151.334 86.8066 161.469C83.9151 167.276 72.555 176.253 65.8106 175.179C64.8341 175.026 64.2771 173.19 62.8199 173.182C62.3164 173.182 54.4505 176.39 53.5197 176.84C51.3682 177.876 49.8881 180.475 47.9198 181.877C45.6538 183.485 35.9417 190.58 34.3319 191.091C32.5161 191.662 28.2207 192.264 26.7559 191.037C23.2845 188.134 22.3309 181.953 23.2235 177.716C24.5968 171.216 28.9989 164.617 31.5548 158.695C34.9041 150.93 38.2991 140.688 42.1138 133.54C47.401 123.633 56.2129 120.676 64.506 114.168C65.124 113.681 65.9022 114.191 65.4673 112.431C57.6319 110.99 44.6697 108.979 38.1389 104.399C33.1646 100.916 30.7766 95.8178 27.1755 92.1828C20.2175 85.1566 6.56098 75.1051 1.86129 66.951C-0.862388 62.2339 -1.24386 52.9825 5.1877 51.8318C12.7789 50.4677 23.2235 56.3584 30.2883 57.5472C31.5243 57.753 40.1149 58.355 40.8092 58.2407C41.6789 58.0959 42.2359 55.9012 43.4489 55.101C47.9808 52.1137 55.8696 54.278 60.5845 56.1603C66.1921 58.3931 71.6547 63.9714 75.3473 68.7647C80.4056 75.3413 81.8933 83.3125 88.2867 88.8831C86.3107 80.1728 84.1821 71.4777 83.0606 62.5768C82.3511 56.8995 81.3364 48.4482 81.3974 42.8928C81.4813 35.1808 84.7162 27.5678 85.2273 20.1149C85.6775 13.5535 82.641 9.79657 84.678 2.84658C86.1734 -2.25922 92.2082 0.476578 94.2758 3.50195C95.0845 4.68315 95.176 6.50447 96.0229 7.83807C102.157 17.5467 109.519 27.3849 115.035 37.467C124.656 55.0477 120.521 71.8739 111.861 88.8755L111.877 88.8526Z',
  },
  // 5 — Petal / bird
  {
    vb: [200, 200],
    d: 'M41.1281 118.747C38.7119 114.56 30.2159 112.049 26.1513 109.658C22.8764 107.732 15.0796 103.007 12.849 100.369C10.6584 97.7822 12.0643 94.7358 15.3742 94.2988C16.6387 94.1333 17.9215 94.4023 19.1312 94.7952C21.2711 95.4933 23.3599 96.3837 25.4604 97.1966C28.6044 98.4075 31.7213 99.7545 34.9594 100.695C35.4887 100.849 40.4873 102.038 40.4206 102.624C42.3806 85.7997 49.8643 70.451 63.9298 60.7623C75.1271 53.0514 85.267 51.268 98.6287 52.1306C104.199 52.4909 109.8 53.0204 115.211 54.4528C117.961 55.1832 120.653 56.1352 123.202 57.4073C127.94 59.7758 129.609 59.9997 133.642 56.3036C139.554 50.8819 143.825 45.8389 152.25 45.0773C160.433 44.3407 168.663 47.0635 174.289 53.1681C188.543 68.636 175.193 93.9168 163.183 106.851C160.276 109.982 151.231 116.263 149.839 118.553C148.201 121.247 147.814 126.027 146.705 129.197C138.691 152.126 114.959 164.351 91.7772 164.385C71.108 164.42 52.8538 151.77 45.2041 132.636C43.7297 128.945 42.56 121.222 41.1262 118.738L41.1281 118.747ZM150.405 93.2068C152.817 92.2228 155.02 84.9521 155.919 82.7916C156.704 80.9097 161.537 69.2348 155.84 70.9762C154.207 71.4735 152.674 72.3152 151.372 73.4285C147.559 76.6818 145.537 80.5717 146.894 85.3096C147.16 86.2353 148.845 93.8447 150.404 93.211L150.405 93.2068Z',
  },
]

/* ── Noise functions ── */
function hash(x: number, y: number) {
  let h = x * 374761393 + y * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff
}

function smoothstep(t: number) { return t * t * (3 - 2 * t) }

function noise2D(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = smoothstep(x - ix), fy = smoothstep(y - iy)
  const a = hash(ix, iy), b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}

function fbm(x: number, y: number, octaves: number) {
  let val = 0, amp = 0.5, freq = 1
  for (let i = 0; i < octaves; i++) {
    val += amp * noise2D(x * freq, y * freq)
    amp *= 0.5; freq *= 2
  }
  return val
}

interface CellState {
  shape: ShapeType
  colorIdx: number
  phase: number
  energy: number
  targetEnergy: number
  motionAccum: number
  baseSize: number
}

interface Props {
  /** Video element to read from (external — e.g. existing hero video) */
  videoRef?: React.RefObject<HTMLVideoElement | null>
  /** OR provide a src and the component creates its own video */
  src?: string
  cellSize?: number
  opacity?: number
  /** Transparent background — for overlaying on video */
  overlay?: boolean
  bg?: string
  reactivity?: number
  /** Noise threshold — higher = more sparse (0-1, default 0.38) */
  sparsity?: number
  /** React to mouse movement */
  mouse?: boolean
  /** Override color palette */
  colors?: string[]
  /** Override shape pool. If omitted, all 7 built-in shapes are used. */
  shapes?: ShapeType[]
  className?: string
  style?: React.CSSProperties
}

export default function VideoReactiveArt({
  videoRef: externalVideoRef,
  src,
  cellSize = 12,
  opacity = 1,
  overlay = false,
  bg = '#131719',
  reactivity = 0.12,
  sparsity = 0.38,
  mouse = false,
  colors,
  shapes,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const internalVideoRef = useRef<HTMLVideoElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null)
  const cellsRef = useRef<CellState[]>([])
  const gridRef = useRef({ cols: 0, rows: 0 })
  const timeRef = useRef(0)
  const rafRef = useRef(0)
  const mouseRef = useRef({ x: -1, y: -1 }) // normalised 0-1, -1 = offscreen

  const pal = colors ?? PALETTE
  /* Restrict shape pool if a custom subset is passed. Falls back to all
     7 built-in shapes when omitted. */
  const shapePool = shapes && shapes.length > 0 ? shapes : SHAPES

  const initCells = useCallback((cols: number, rows: number) => {
    const cells: CellState[] = []
    for (let i = 0; i < cols * rows; i++) {
      const col = i % cols, row = Math.floor(i / cols)
      const sNoise = fbm(col * 0.08 + 100, row * 0.08 + 100, 3)
      const cNoise = fbm(col * 0.06 + 200, row * 0.06 + 200, 3)
      cells.push({
        shape: shapePool[Math.floor(sNoise * shapePool.length) % shapePool.length],
        colorIdx: Math.floor(cNoise * pal.length) % pal.length,
        phase: Math.random() * Math.PI * 2,
        energy: 0,
        targetEnergy: 0,
        motionAccum: 0,
        baseSize: 0.35 + sNoise * 0.55,
      })
    }
    return cells
  }, [pal])

  // Mouse tracking
  useEffect(() => {
    if (!mouse) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const onMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    const onLeave = () => { mouseRef.current = { x: -1, y: -1 } }

    window.addEventListener('mousemove', onMove)
    wrapper.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      wrapper.removeEventListener('mouseleave', onLeave)
    }
  }, [mouse])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const video = externalVideoRef?.current ?? internalVideoRef.current

    // Start internal video if we created one
    if (!externalVideoRef && internalVideoRef.current && src) {
      const v = internalVideoRef.current
      v.src = src
      v.muted = true
      v.loop = true
      v.playsInline = true
      v.play().catch(() => {})
    }

    const sampler = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { alpha: overlay })!
    const sCtx = sampler.getContext('2d', { willReadFrequently: true })!

    let resizeTimer = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = wrapper.clientWidth
      const h = wrapper.clientHeight
      const targetW = w * dpr
      const targetH = h * dpr

      // Only update canvas dimensions when they actually change (avoids clearing/flicker)
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW
        canvas.height = targetH
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      const cols = Math.ceil(w / cellSize)
      const rows = Math.ceil(h / cellSize)

      if (cols !== gridRef.current.cols || rows !== gridRef.current.rows) {
        sampler.width = cols
        sampler.height = rows
        gridRef.current = { cols, rows }
        cellsRef.current = initCells(cols, rows)
        prevFrameRef.current = null
      }
    }

    resize()
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeTimer)
      resizeTimer = requestAnimationFrame(resize)
    })
    ro.observe(wrapper)

    // Compile each glyph's SVG path once per mount. Path2D handles
    // SVG-style `d` strings natively and the GPU caches the compiled
    // path, so re-filling thousands of times per frame is cheap.
    const compiledPaths: { path: Path2D; vb: [number, number] }[] =
      SHAPE_PATHS.map(({ d, vb }) => ({ path: new Path2D(d), vb }))

    const drawShape = (
      ctx: CanvasRenderingContext2D,
      x: number, y: number, s: number,
      shape: ShapeType, color: string, alpha: number
    ) => {
      const glyph = compiledPaths[shape]
      if (!glyph) return
      const [vbW, vbH] = glyph.vb
      const scale = s / Math.max(vbW, vbH)
      // Centre the scaled glyph inside the cell — viewBox aspects vary
      // (e.g. 198×200), so we pad whichever axis is shorter.
      const drawW = vbW * scale
      const drawH = vbH * scale
      const ox = x + (s - drawW) / 2
      const oy = y + (s - drawH) / 2
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.translate(ox, oy)
      ctx.scale(scale, scale)
      ctx.fill(glyph.path)
      ctx.restore()
    }

    const animate = () => {
      const { cols, rows } = gridRef.current
      const cells = cellsRef.current
      const w = wrapper.clientWidth
      const h = wrapper.clientHeight

      if (!cols || !rows || !cells.length) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      timeRef.current += 0.016
      const t = timeRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mouse && mx >= 0 && my >= 0

      // Sample video
      if (video && video.readyState >= 2) {
        sCtx.drawImage(video, 0, 0, cols, rows)
        const frame = sCtx.getImageData(0, 0, cols, rows)
        const data = frame.data
        const prev = prevFrameRef.current

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const i = row * cols + col
            const pi = i * 4
            const r = data[pi], g = data[pi + 1], b = data[pi + 2]
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255

            let motion = 0
            if (prev) {
              const pr = prev[pi], pg = prev[pi + 1], pb = prev[pi + 2]
              motion = (Math.abs(r - pr) + Math.abs(g - pg) + Math.abs(b - pb)) / (255 * 3)
            }

            const cell = cells[i]
            cell.motionAccum = cell.motionAccum * 0.92 + motion * 3.5
            cell.motionAccum = Math.min(cell.motionAccum, 1.5)

            // Noise field — organic clusters
            const noiseX = col * 0.04 + t * 0.15 + Math.sin(t * 0.3) * 0.5
            const noiseY = row * 0.04 + t * 0.08 + Math.cos(t * 0.25) * 0.3
            const density = fbm(noiseX, noiseY, 4)

            // Mouse influence — radiate energy from cursor
            let mouseBoost = 0
            if (mouseActive) {
              const nx = col / cols
              const ny = row / rows
              const dx = nx - mx
              const dy = ny - my
              const dist = Math.sqrt(dx * dx + dy * dy)
              mouseBoost = Math.max(0, 1 - dist / 0.25) * 0.6
            }

            const alive = (density > sparsity || mouseBoost > 0.1) ? 1 : 0

            cell.targetEnergy = alive * Math.min(1, brightness * 0.5 + cell.motionAccum * 0.9 + mouseBoost)

            // Mutate on motion
            if (motion > 0.06) {
              if (Math.random() < motion * 2.5) {
                cell.shape = shapePool[Math.floor(Math.random() * shapePool.length)]
              }
              if (Math.random() < motion * 1.8) {
                cell.colorIdx = Math.random() < 0.6
                  ? Math.floor(Math.random() * 4)
                  : Math.floor(Math.random() * pal.length)
              }
            }

            // Mouse proximity — mutate shapes near cursor
            if (mouseActive && mouseBoost > 0.3 && Math.random() < 0.02) {
              cell.shape = shapePool[Math.floor(Math.random() * shapePool.length)]
              cell.colorIdx = Math.random() < 0.5
                ? Math.floor(Math.random() * 4) // warm bias
                : Math.floor(Math.random() * pal.length)
            }

            // Slow organic drift
            if (Math.random() < 0.0008) {
              const cNoise = fbm(col * 0.06 + t * 0.3, row * 0.06 + t * 0.2, 3)
              cell.colorIdx = Math.floor(cNoise * pal.length) % pal.length
            }
            if (Math.random() < 0.0004) {
              const sNoise = fbm(col * 0.08 + t * 0.2, row * 0.08 + t * 0.15, 3)
              cell.shape = shapePool[Math.floor(sNoise * shapePool.length) % shapePool.length]
            }
          }
        }

        prevFrameRef.current = new Uint8ClampedArray(data)
      }

      // Render
      if (overlay) {
        ctx.clearRect(0, 0, w, h)
      } else {
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, w, h)
      }

      const cs = cellSize
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col
          const cell = cells[i]

          cell.energy += (cell.targetEnergy - cell.energy) * reactivity

          if (cell.energy < 0.03) continue

          const x = col * cs
          const y = row * cs

          const pulse = 1 + Math.sin(t * 1.2 + cell.phase) * 0.1 * cell.energy
          const sizeNoise = 0.8 + fbm(col * 0.1 + t * 0.05, row * 0.1, 2) * 0.5
          const drawSize = cs * cell.baseSize * pulse * sizeNoise

          const color = pal[cell.colorIdx]
          const alpha = Math.min(1, cell.energy * 1.3) * opacity

          const ox = x + (cs - drawSize) / 2
          const oy = y + (cs - drawSize) / 2

          drawShape(ctx, ox, oy, drawSize, cell.shape, color, alpha)
        }
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [src, externalVideoRef, cellSize, bg, reactivity, opacity, overlay, sparsity, mouse, initCells])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {!externalVideoRef && src && (
        // Hidden source video — feeds frames to the canvas only.
        // aria-hidden so screen readers + the SEO audit don't flag it
        // as a missing aria-label; it's a data pipe, not media.
        <video
          ref={internalVideoRef}
          aria-hidden="true"
          tabIndex={-1}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
