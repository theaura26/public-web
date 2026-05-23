'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ═══════════════════════════════════════════
   PARTICLE BLOOM — Three.js volumetric flower

   Ethereal, atmospheric particle cloud.
   Optimised: noise computed in GLSL, not JS.
   80k particles, all animation on GPU.
═══════════════════════════════════════════ */

// ── Art Direction ────────────────────────────
const PARTICLE_COUNT  = 80_000
const BLOOM_RADIUS    = 3.8
const PETAL_COUNT     = 13
const PETAL_DEPTH     = 0.45
const PETAL_WIDTH     = 0.55
const DEPTH_SPREAD    = 1.8
const CENTER_DENSITY  = 2.8
const CAMERA_DISTANCE = 6.0

const PALETTE = {
  core:  [0.58, 0.68, 0.15],
  mid1:  [0.38, 0.28, 0.55],
  mid2:  [0.52, 0.42, 0.68],
  outer: [0.78, 0.68, 0.75],
  edge:  [0.92, 0.88, 0.94],
}

interface Props {
  className?: string
  style?: React.CSSProperties
  colors?: string[]
}

/* ── Simple JS noise for particle placement ── */
function hashN(x: number, y: number) {
  let h = x * 374761393 + y * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff
}

function noise3(x: number, y: number, z: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z)
  const fx = x - ix, fy = y - iy, fz = z - iz
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), sz = fz * fz * (3 - 2 * fz)
  const h = (a: number, b: number, c: number) => hashN(a * 73 + c * 179, b * 131 + c * 67) * 2 - 1
  const n000 = h(ix, iy, iz), n100 = h(ix+1, iy, iz), n010 = h(ix, iy+1, iz), n110 = h(ix+1, iy+1, iz)
  const n001 = h(ix, iy, iz+1), n101 = h(ix+1, iy, iz+1), n011 = h(ix, iy+1, iz+1), n111 = h(ix+1, iy+1, iz+1)
  const nx00 = n000 + (n100 - n000) * sx, nx10 = n010 + (n110 - n010) * sx
  const nx01 = n001 + (n101 - n001) * sx, nx11 = n011 + (n111 - n011) * sx
  return (nx00 + (nx10 - nx00) * sy) + ((nx01 + (nx11 - nx01) * sy) - (nx00 + (nx10 - nx00) * sy)) * sz
}

function fbm(x: number, y: number, z: number, oct: number): number {
  let v = 0, a = 0.5, f = 1
  for (let i = 0; i < oct; i++) { v += a * noise3(x * f, y * f, z * f); a *= 0.5; f *= 2.1 }
  return v
}

export default function ParticleBloom({ className, style, colors }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let pal = PALETTE
    if (colors && colors.length >= 4) {
      const h2g = (hex: string): [number, number, number] => [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
      ]
      const c = colors.map(h2g)
      pal = {
        core: c[0], mid1: c[1], mid2: c[Math.min(2, c.length - 1)],
        outer: c[Math.min(3, c.length - 1)],
        edge: c[Math.min(4, c.length - 1)] || c[c.length - 1],
      }
    }

    // ── Scene ──
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x060810)

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.15, CAMERA_DISTANCE)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // ── Generate particle attributes (positions + metadata) ──
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const siz = new Float32Array(PARTICLE_COUNT)
    const alp = new Float32Array(PARTICLE_COUNT)
    const pha = new Float32Array(PARTICLE_COUNT)
    const vel = new Float32Array(PARTICLE_COUNT * 3) // drift direction for GPU anim

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const rawR = Math.pow(Math.random(), 1 / CENTER_DENSITY)
      const theta = Math.random() * Math.PI * 2
      // Irregular phi — multiple overlapping layers, not a clean sphere
      const phiBase = (Math.random() - 0.5) * Math.PI * 0.6
      const phiJitter = fbm(theta * 2, rawR * 3, i * 0.001, 2) * 0.35

      // Petal modulation — asymmetric, noise-broken
      const petalPhase = fbm(theta * 0.5 + 7, rawR * 2, 0, 2) * 0.4
      const petalMod = 1 + PETAL_DEPTH * Math.pow(
        Math.abs(Math.cos((theta * PETAL_COUNT * 0.5) + petalPhase)),
        PETAL_WIDTH
      )
      // Break symmetry further — each petal gets a unique amplitude
      const petalAmp = 0.8 + fbm(Math.floor(theta * PETAL_COUNT / (2 * Math.PI)) * 7, 0, 0, 2) * 0.4

      const r = rawR * BLOOM_RADIUS * petalMod * petalAmp

      // Noise displacement — larger scale, more organic
      const nx = Math.cos(theta) * rawR * 1.6
      const ny = Math.sin(theta) * rawR * 1.6
      const noiseR = fbm(nx + 10, ny + 10, rawR * 2, 3) * 0.5 * rawR
      const noiseTh = fbm(nx + 50, ny + 50, rawR, 2) * 0.35 * (1 - rawR * 0.4)

      const finalR = r + noiseR
      const finalTheta = theta + noiseTh
      const finalPhi = phiBase + phiJitter

      const x = finalR * Math.cos(finalTheta) * Math.cos(finalPhi)
      const y = finalR * Math.sin(finalTheta) * Math.cos(finalPhi)
      const z = finalR * Math.sin(finalPhi) * DEPTH_SPREAD
        + fbm(nx * 0.4 + 200, ny * 0.4, rawR, 2) * DEPTH_SPREAD * 0.5

      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z

      // Drift vector — subtle radial + tangential for breathing
      const len = Math.sqrt(x * x + y * y + z * z) + 0.001
      vel[i * 3] = x / len * 0.015 + (Math.random() - 0.5) * 0.005
      vel[i * 3 + 1] = y / len * 0.015 + (Math.random() - 0.5) * 0.005
      vel[i * 3 + 2] = z / len * 0.008

      // ── Color — smoother transitions, more noise variation ──
      const t = rawR
      const colorNoise = noise3(x * 0.6, y * 0.6, z * 0.6) * 0.09
      const warmShift = noise3(x * 0.3 + 100, y * 0.3, z * 0.3) * 0.04

      // Smooth hermite interpolation across 5 stops
      const stops = [0, 0.12, 0.35, 0.62, 1.0]
      const cols = [pal.core, pal.mid1, pal.mid2, pal.outer, pal.edge]
      let si = 0
      for (let s = 0; s < stops.length - 1; s++) { if (t >= stops[s]) si = s }
      const sf = Math.max(0, Math.min(1, (t - stops[si]) / (stops[si + 1] - stops[si])))
      const sm = sf * sf * (3 - 2 * sf) // smoothstep
      const c0 = cols[si], c1 = cols[si + 1]
      const cr = c0[0] + (c1[0] - c0[0]) * sm + colorNoise + warmShift
      const cg = c0[1] + (c1[1] - c0[1]) * sm + colorNoise * 0.7
      const cb = c0[2] + (c1[2] - c0[2]) * sm + colorNoise * 0.4

      col[i * 3] = Math.max(0, Math.min(1, cr))
      col[i * 3 + 1] = Math.max(0, Math.min(1, cg))
      col[i * 3 + 2] = Math.max(0, Math.min(1, cb))

      // Size — softer outer haze, tight core
      const sizeNoise = noise3(x * 1.5, y * 1.5, z * 1.5) * 0.8
      siz[i] = 1.0 + t * 4.0 + sizeNoise + (t > 0.7 ? (t - 0.7) * 6 : 0)

      // Alpha — luminous center, powdery edges
      const aBase = t < 0.15
        ? 0.7 + (0.15 - t) * 3
        : t < 0.5
          ? 0.55 - (t - 0.15) * 0.5
          : 0.35 - (t - 0.5) * 0.5
      alp[i] = Math.max(0.02, Math.min(1, aBase + noise3(x, y, z) * 0.08))

      pha[i] = Math.random() * Math.PI * 2
    }

    // ── Geometry ──
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(siz, 1))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alp, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(pha, 1))
    geo.setAttribute('aVel', new THREE.BufferAttribute(vel, 3))

    // ── Shader — all animation on GPU ──
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPR: { value: renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aAlpha;
        attribute float aPhase;
        attribute vec3 aVel;

        varying vec3 vCol;
        varying float vAlpha;
        varying float vDist;

        uniform float uTime;
        uniform float uPR;

        void main() {
          vCol = color;

          // Breathing — multi-frequency for organic feel
          float b1 = sin(uTime * 0.7 + aPhase) * 0.06;
          float b2 = sin(uTime * 0.3 + aPhase * 1.7) * 0.03;
          float breath = 1.0 + b1 + b2;

          // Drift along pre-computed velocity
          vec3 p = position + aVel * sin(uTime * 0.4 + aPhase) * breath;

          // Subtle swirl — tangential displacement
          float swirl = sin(uTime * 0.15 + length(position.xy) * 1.5) * 0.015;
          p.x += -position.y * swirl;
          p.y += position.x * swirl;

          vAlpha = aAlpha * (0.88 + sin(uTime * 0.4 + aPhase * 0.8) * 0.12);
          vDist = length(position) / ${BLOOM_RADIUS.toFixed(1)};

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = max(aSize * breath * uPR * (280.0 / -mv.z), 0.3);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vCol;
        varying float vAlpha;
        varying float vDist;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          // Double-gaussian for extra soft halo
          float core = exp(-d * d * 18.0);
          float halo = exp(-d * d * 5.0) * 0.3;
          float soft = core + halo;

          // Outer particles get extra diffuse glow
          float edgeBoost = smoothstep(0.5, 1.0, vDist) * 0.2;
          soft += edgeBoost * exp(-d * d * 3.0);

          gl_FragColor = vec4(vCol, vAlpha * soft);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // ── Resize ──
    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    // ── Animation — lightweight, all heavy lifting in shaders ──
    let frame = 0
    const tick = () => {
      frame++
      mat.uniforms.uTime.value = frame * 0.016

      // Glacial rotation
      points.rotation.z += 0.00006
      points.rotation.x = Math.sin(frame * 0.0002) * 0.025
      points.rotation.y = Math.sin(frame * 0.00015) * 0.015

      renderer.render(scene, camera)
      requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [colors])

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', ...style }} />
}
