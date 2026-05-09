'use client'

import { useEffect, useRef, useState } from 'react'
import Reveal from '@/components/RevealOnScroll'
import { useMode } from '@/components/ModeProvider'

/* ═══════════════════════════════════════════
   REASON PAGE
   Original typography preserved.
   Sticky image floats on the right, crossfades
   as sections scroll into view.
═══════════════════════════════════════════ */

const CHAPTER_IMAGES: { id: string; src: string; alt: string }[] = [
  { id: 'opening',    src: '/aura-arvind.jpg',           alt: 'Arvind on the plantation' },
  { id: 'started',    src: '/aura-ohara-friendship.jpg', alt: 'Friendship in Ohara' },
  { id: 'what-aura',  src: '/aura-ohara-barn.jpg',       alt: 'Studio barn in Ohara' },
  { id: 'forgot',     src: '/aura-ohara-moss.jpg',       alt: 'Moss on weathered wood' },
  { id: 'why-now',    src: '/aura-ohara-stream.jpg',     alt: 'Stream through the forest' },
  { id: 'rta',        src: '/aura-ohara-fruit.jpg',      alt: 'Strawberries in a pocket' },
  { id: 'ni',         src: '/aura-ohara-leaves.jpg',     alt: 'Pink autumn leaves' },
  { id: 'pillars',    src: '/aura-mudigere-bees.jpg',    alt: 'Beekeeping in the plantation' },
  { id: 'feels',      src: '/aura-mudigere-flower.jpg',  alt: 'Native flower in the canopy' },
  { id: 'method',     src: '/aura-team.jpg',             alt: 'Team on the hillside' },
  { id: 'geography',  src: '/aura-ohara-stream.jpg',     alt: 'Stream through the forest' },
  { id: 'polymath',   src: '/aura-ohara-barn.jpg',       alt: 'Studio barn in Ohara' },
  { id: 'balance',    src: '/aura-mudigere-family.jpg',   alt: 'Father and child with calf' },
  { id: 'closing',    src: '/aura-mudigere-family.jpg',  alt: 'Father and child with calf' },
]

function Chapter({ title, children, sectionRef, idx, isMobile, isAgent }: {
  title: string
  children: React.ReactNode
  sectionRef: (el: HTMLDivElement | null) => void
  idx: number
  isMobile: boolean
  isAgent: boolean
}) {
  return (
    <div ref={sectionRef}>
      <Reveal>
        <div className="section-w" style={{ paddingTop: isAgent ? 24 : 'clamp(48px, 8vh, 80px)', paddingBottom: isAgent ? 24 : 'clamp(48px, 8vh, 80px)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 640 }}>
            <h2 style={{ marginBottom: 24 }}>{title}</h2>
            <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {children}
            </div>
          </div>
          {isMobile && !isAgent && ![0, 10, 11].includes(idx) && (
            <img src={CHAPTER_IMAGES[idx].src} alt={CHAPTER_IMAGES[idx].alt}
              style={{ width: '100%', height: 'auto', marginTop: 32, display: 'block', borderRadius: 3 }} />
          )}
        </div>
      </Reveal>
    </div>
  )
}

function W({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--text)' }}>{children}</span>
}

export default function ReasonPage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [showImage, setShowImage] = useState(false)
  const { viewMode } = useMode()
  const isAgent = viewMode === 'agent'

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Track which section is active
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sectionRefs.current.forEach((el, idx) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(idx) },
        { rootMargin: '-10% 0px -50% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [isMobile])

  // Show/hide image based on whether the body section is in view
  useEffect(() => {
    if (isMobile || !bodyRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => setShowImage(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )
    obs.observe(bodyRef.current)
    return () => obs.disconnect()
  }, [isMobile])

  // Hide image once we reach the closing section
  const imageVisible = showImage && activeIdx < 13

  const setRef = (idx: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[idx] = el
  }

  return (
    <div>

      {/* Hero */}
      <section style={{ paddingTop: 250, paddingBottom: 80 }}>
        <div className="section-w">
          <Reveal>
            <h1 style={{ maxWidth: 700 }}>The Reason</h1>
          </Reveal>
        </div>
      </section>

      {/* Body — text uses original layout, image floats fixed on right */}
      <div ref={bodyRef} style={{ position: 'relative' }}>

        {/* Sticky image — desktop only, positioned outside flow */}
        {!isMobile && !isAgent && (
          <div style={{
            position: 'sticky',
            top: 0,
            height: 0,
            overflow: 'visible',
            zIndex: 1,
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute',
              top: 'clamp(68px, 10vh, 100px)',
              right: 'var(--gutter)',
              width: 240,
              height: 304,
              overflow: 'hidden',
              borderRadius: 3,
              opacity: imageVisible ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}>
              {CHAPTER_IMAGES.map((img, i) => (
                <img
                  key={img.id}
                  src={img.src}
                  alt={img.alt}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    opacity: i === activeIdx ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                    willChange: 'opacity',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Text — identical to original page structure */}

        {/* 0 — Opening */}
        <div ref={setRef(0)}>
          <Reveal>
            <div className="section-w" style={{ paddingTop: isAgent ? 24 : 'clamp(48px, 8vh, 80px)', paddingBottom: isAgent ? 24 : 'clamp(48px, 8vh, 80px)' }}>
              <div style={{ maxWidth: 640 }}>
                <h2 style={{ marginBottom: 24 }}>I am not a planter. I am not a biologist. I am not a scientist.</h2>
                <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p>I am an entrepreneur. Born in India. Moved to Singapore twenty-four years ago. Built a career in the world of speed and cities and deals.</p>
                  <p>But my way of unwinding was always the same.</p>
                  <p>Building gardens. Setting flower arrangements. Creating spaces where people could sit together. Connecting friends over food and conversation that lasted until nobody noticed the time.</p>
                  <p>I have two boys. Very different from each other. Watching them grow, I stopped thinking in quarters and started thinking in generations.</p>
                  <p><W>What kind of world are they inheriting?</W></p>
                  <p>That question changed everything.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Chapter title="How it Started" sectionRef={setRef(1)} idx={1} isMobile={isMobile} isAgent={isAgent}>
          <p>When I came to a plantation in the <W>Western Ghats</W> — 150 acres at 3,600 feet — I came knowing nothing about the plantation.</p>
          <p>And everything about asking questions.</p>
          <p><W>That turned out to be the advantage.</W></p>
          <p>When you know less, you challenge more.</p>
          <p>I didn&apos;t carry the burden of orthodoxy. So I asked the land instead.</p>
          <p>The land had better answers.</p>
          <p>Then I found <W>Ohara</W>. A quiet valley north of Kyoto. Cedar forests, rivers, temples.</p>
          <p>India gave me the ground.<br />Japan gave me the stillness.<br />Together they became something neither could alone.</p>
        </Chapter>

        <Chapter title="What Aura is" sectionRef={setRef(2)} idx={2} isMobile={isMobile} isAgent={isAgent}>
          <p>Not a company. Not an NGO. Not a farm. Not a hotel. Not a brand.</p>
          <p><W>A platform for generational impact.</W></p>
          <p>A sanctuary for silence. A working plantation. Studios where artists and founders come to build. Festivals around open fire. Forest-to-table dining. Residencies. Labs. Coffee cupped at the source. Workshops in clay, indigo, fermentation.</p>
          <p>A living space for <W>creative monastic people</W> to rest, discover, and create.</p>
          <p><W>Aura is an open-source framework for how to live with land across generations.</W></p>
        </Chapter>

        <Chapter title="What We Forgot" sectionRef={setRef(3)} idx={3} isMobile={isMobile} isAgent={isAgent}>
          <p>A hundred years ago, you didn&apos;t need a certification to prove food was organic. All food was organic.</p>
          <p>We planted by the moon. Composted by instinct. Understood soil was alive.</p>
          <p>Not because we had data. Because we had <W>attention</W>.</p>
          <p>Then we forgot.</p>
          <p><W>The earth does not need us to manage it. It needs us to remember what it already knows.</W></p>
        </Chapter>

        <Chapter title="Why Now" sectionRef={setRef(4)} idx={4} isMobile={isMobile} isAgent={isAgent}>
          <p>The world is entering an age of artificial intelligence.</p>
          <p>What will become rare is not intelligence.</p>
          <p>What will become rare is <W>wisdom</W>. Presence. Judgement. Moral clarity. The ability to be still.</p>
          <p>But soil does not compound quarterly. A canopy takes fifty years. A community takes generations.</p>
          <p><W>You cannot sprint a forest.</W></p>
          <p>The farmer of three thousand years ago had the knowledge.<br />The founder of 2026 has the tools.<br /><W>Aura joins them.</W></p>
        </Chapter>

        <Chapter title={'\u1E5Ata \u2014 The Rhythm We Lost'} sectionRef={setRef(5)} idx={5} isMobile={isMobile} isAgent={isAgent}>
          <p><W>Natural order. Cosmic rhythm. Right relationship.</W></p>
          <p>Everything has a timing. Honour it, and the work becomes effortless.</p>
          <p>A spray applied in the evening when the earth inhales. Coffee fermented for 36 hours, 48 hours, multi-cycle — each lot with its own clock. Drying over 25 days. Not faster. Right.</p>
          <p>We were once aligned with this.<br /><W>Aura is an attempt to return.</W></p>
        </Chapter>

        <Chapter title="Natural Intelligence" sectionRef={setRef(6)} idx={6} isMobile={isMobile} isAgent={isAgent}>
          <p>Three intelligences.</p>
          <p>Artificial: machine computation.<br />Human: reasoning and creativity.<br />And a third, older than both:</p>
          <p><W>Natural Intelligence.</W></p>
          <p>Ecological order. Adaptation. Rhythm. Pattern. Living systems wisdom.</p>
        </Chapter>

        <Chapter title="Three Pillars" sectionRef={setRef(7)} idx={7} isMobile={isMobile} isAgent={isAgent}>
          <p>The plantation is the ground. The experience is the whole ecosystem.</p>
          <p><W>Sanctuary</W></p>
          <p>Silence. Stillness. A 30-year Japanese garden. Forest walks. The river from every room.</p>
          <p><W>Agroculture</W></p>
          <p>100 acres of coffee. 43 indigenous cattle. Bees. A nursery restoring native canopy.</p>
          <p><W>Artistry</W></p>
          <p>Studios. Workshops. Gallery. Gurukul. Labs. Festivals. The connective tissue.</p>
        </Chapter>

        <Chapter title="What it Feels Like" sectionRef={setRef(8)} idx={8} isMobile={isMobile} isAgent={isAgent}>
          <p>Morning mist lifting off coffee rows. A studio with a garden view and nothing on the calendar. Forest-to-table where every ingredient grew within sight.</p>
          <p>A coffee festival on the terrace — six micro lots cupped side by side.</p>
          <p>Pottery with <W>Shigaraki</W> clay. Indigo dyeing. <W>Kintsugi</W>. Fermentation circles.</p>
          <p>A week of silence where the only appointment is tea at four.</p>
          <p><W>Not a destination. A rhythm you enter.</W></p>
          <p>The choices made by one generation shape a thousand that follow.</p>
        </Chapter>

        <Chapter title="The Method" sectionRef={setRef(9)} idx={9} isMobile={isMobile} isAgent={isAgent}>
          <p>Six rules. English and Kannada. Every work shed.</p>
          <p><W>Soil Comes First. Do Small Work Properly. No Shortcuts. Quality Before Quantity. Think 10 Years Ahead. Leaders Must Be on the Field.</W></p>
          <p>Be on the land. Be fair. Do the work properly.</p>
        </Chapter>

        <Chapter title="The Geography" sectionRef={setRef(10)} idx={10} isMobile={isMobile} isAgent={isAgent}>
          <p><W>Mudigere, Western Ghats, India.</W></p>
          <p>150 acres. 3,600 feet. UNESCO biodiversity zone. Coffee, tea, pepper, areca.</p>
          <p><W>Ohara, Kyoto, Japan.</W></p>
          <p>Two properties. Japanese garden. Teahouse. Caf&eacute; on the river. Studios.</p>
          <p><W>Munduk, Bali. Daylesford, Australia.</W></p>
          <p>The ecosystem grows when the land says it&apos;s ready.</p>
        </Chapter>

        <Chapter title="The Monastic Polymath" sectionRef={setRef(11)} idx={11} isMobile={isMobile} isAgent={isAgent}>
          <p>A designer who farms. An engineer who meditates. A farmer who reads philosophy. A chef who understands soil.</p>
          <p>The <W>sanctuary</W> gives them stillness.<br />The <W>plantation</W> gives them ground.<br />The <W>studios</W> give them room.<br />The <W>festivals</W> give them community.<br />The <W>table</W> gives them nourishment.</p>
          <p><W>Not to visit. To return to.</W></p>
        </Chapter>

        <Chapter title="The Balance" sectionRef={setRef(12)} idx={12} isMobile={isMobile} isAgent={isAgent}>
          <p><W>How do we make this generation think in decades instead of hours?</W></p>
          <p>By building spaces that reward patience. Studios where the work takes as long as it takes. A plantation that gets better, not bigger.</p>
          <p><W>Some things just need to be the way they are.</W></p>
        </Chapter>

        {/* Closing */}
        <div ref={setRef(13)} style={{ marginTop: isAgent ? 0 : 'clamp(80px, 12vh, 120px)' }}>
          <Reveal>
            <div className="section-w" style={{ paddingTop: isAgent ? 24 : 'clamp(48px, 8vh, 80px)', paddingBottom: isAgent ? 40 : 'clamp(80px, 14vh, 140px)', borderTop: '1px solid var(--border)' }}>
              <div style={{ maxWidth: 640 }}>
                <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p><W>Aura is not built, it is grown.</W></p>
                  <p>I am the first gardener.<br />I will not be the last.</p>
                </div>
                <div style={{ marginTop: 16 }}>
                  <img src="/arvind.svg" alt="Arvind Singh signature" className="arvind-sig" style={{ height: 32, display: 'block' }} />
                  <style jsx>{`
                    div :global(.arvind-sig) {
                      filter: none;
                      transition: filter 0.4s ease;
                    }
                    :global([data-theme="day"]) div :global(.arvind-sig) {
                      filter: invert(1);
                    }
                  `}</style>
                  <p className="label" style={{ marginTop: 4 }}>Founder, Aura · Mudigere &amp; Ohara · 2026</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </div>
  )
}
