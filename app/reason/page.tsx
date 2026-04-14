'use client'

import Reveal from '@/components/RevealOnScroll'

function Chapter({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="section-w" style={{ paddingTop: 'clamp(48px, 8vh, 80px)', paddingBottom: 'clamp(48px, 8vh, 80px)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 640 }}>
          <h2 style={{ marginBottom: 24 }}>{title}</h2>
          <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {children}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

function W({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--text)' }}>{children}</span>
}

export default function ReasonPage() {
  return (
    <div>

      {/* Hero */}
      <section style={{ paddingTop: 250, paddingBottom: 80 }}>
        <div className="section-w">
          <Reveal>
            <h1 style={{ maxWidth: 700 }}>Reason</h1>
          </Reveal>
        </div>
      </section>

      {/* Opening */}
      <Reveal>
        <div className="section-w" style={{ paddingTop: 'clamp(48px, 8vh, 80px)', paddingBottom: 'clamp(48px, 8vh, 80px)' }}>
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

      <Chapter title="How it Started">
        <p>When I came to a plantation in the <W>Western Ghats</W> — 150 acres at 3,600 feet — I came knowing nothing about the plantation.</p>
        <p>And everything about asking questions.</p>
        <p><W>That turned out to be the advantage.</W></p>
        <p>When you know less, you challenge more.</p>
        <p>I didn&apos;t carry the burden of orthodoxy. So I asked the land instead.</p>
        <p>The land had better answers.</p>
        <p>Then I found <W>Ohara</W>. A quiet valley north of Kyoto. Cedar forests, rivers, temples.</p>
        <p>India gave me the ground.<br />Japan gave me the stillness.<br />Together they became something neither could alone.</p>
      </Chapter>

      <Chapter title="What Aura is">
        <p>Not a company. Not an NGO. Not a farm. Not a hotel. Not a brand.</p>
        <p><W>A platform for generational impact.</W></p>
        <p>A sanctuary for silence. A working plantation. Studios where artists and founders come to build. Festivals around open fire. Forest-to-table dining. Residencies. Labs. Coffee cupped at the source. Workshops in clay, indigo, fermentation.</p>
        <p>A living space for <W>creative monastic people</W> to rest, discover, and create.</p>
        <p><W>Aura is an open-source framework for how to live with land across generations.</W></p>
      </Chapter>

      <Chapter title="What We Forgot">
        <p>A hundred years ago, you didn&apos;t need a certification to prove food was organic. All food was organic.</p>
        <p>We planted by the moon. Composted by instinct. Understood soil was alive.</p>
        <p>Not because we had data. Because we had <W>attention</W>.</p>
        <p>Then we forgot.</p>
        <p><W>The earth does not need us to manage it. It needs us to remember what it already knows.</W></p>
      </Chapter>

      <Chapter title="Why Now">
        <p>The world is entering an age of artificial intelligence.</p>
        <p>What will become rare is not intelligence.</p>
        <p>What will become rare is <W>wisdom</W>. Presence. Judgement. Moral clarity. The ability to be still.</p>
        <p>But soil does not compound quarterly. A canopy takes fifty years. A community takes generations.</p>
        <p><W>You cannot sprint a forest.</W></p>
        <p>The farmer of three thousand years ago had the knowledge.<br />The founder of 2026 has the tools.<br /><W>Aura joins them.</W></p>
      </Chapter>

      <Chapter title={'\u1E5Ata \u2014 The Rhythm We Lost'}>
        <p><W>Natural order. Cosmic rhythm. Right relationship.</W></p>
        <p>Everything has a timing. Honour it, and the work becomes effortless.</p>
        <p>A spray applied in the evening when the earth inhales. Coffee fermented for 36 hours, 48 hours, multi-cycle — each lot with its own clock. Drying over 25 days. Not faster. Right.</p>
        <p>We were once aligned with this.<br /><W>Aura is an attempt to return.</W></p>
      </Chapter>

      <Chapter title="Natural Intelligence">
        <p>Three intelligences.</p>
        <p>Artificial: machine computation.<br />Human: reasoning and creativity.<br />And a third, older than both:</p>
        <p><W>Natural Intelligence.</W></p>
        <p>Ecological order. Adaptation. Rhythm. Pattern. Living systems wisdom.</p>
      </Chapter>

      <Chapter title="Three Pillars">
        <p>The plantation is the ground. The experience is the whole ecosystem.</p>
        <p><W>Sanctuary</W></p>
        <p>Silence. Stillness. A 30-year Japanese garden. Forest walks. The river from every room.</p>
        <p><W>Agroculture</W></p>
        <p>100 acres of coffee. 43 indigenous cattle. Bees. A nursery restoring native canopy.</p>
        <p><W>Artistry</W></p>
        <p>Studios. Workshops. Gallery. Gurukul. Labs. Festivals. The connective tissue.</p>
      </Chapter>

      <Chapter title="What it Feels Like">
        <p>Morning mist lifting off coffee rows. A studio with a garden view and nothing on the calendar. Forest-to-table where every ingredient grew within sight.</p>
        <p>A coffee festival on the terrace — six micro lots cupped side by side.</p>
        <p>Pottery with <W>Shigaraki</W> clay. Indigo dyeing. <W>Kintsugi</W>. Fermentation circles.</p>
        <p>A week of silence where the only appointment is tea at four.</p>
        <p><W>Not a destination. A rhythm you enter.</W></p>
        <p>The choices made by one generation shape a thousand that follow.</p>
      </Chapter>

      <Chapter title="The Method">
        <p>Six rules. English and Kannada. Every work shed.</p>
        <p><W>Soil Comes First. Do Small Work Properly. No Shortcuts. Quality Before Quantity. Think 10 Years Ahead. Leaders Must Be on the Field.</W></p>
        <p>Be on the land. Be fair. Do the work properly.</p>
      </Chapter>

      <Chapter title="The Geography">
        <p><W>Mudigere, Western Ghats, India.</W></p>
        <p>150 acres. 3,600 feet. UNESCO biodiversity zone. Coffee, tea, pepper, areca.</p>
        <p><W>Ohara, Kyoto, Japan.</W></p>
        <p>Two properties. Japanese garden. Teahouse. Caf&eacute; on the river. Studios.</p>
        <p><W>Munduk, Bali. Daylesford, Australia.</W></p>
        <p>The ecosystem grows when the land says it&apos;s ready.</p>
      </Chapter>

      <Chapter title="The Monastic Polymath">
        <p>A designer who farms. An engineer who meditates. A farmer who reads philosophy. A chef who understands soil.</p>
        <p>The <W>sanctuary</W> gives them stillness.<br />The <W>plantation</W> gives them ground.<br />The <W>studios</W> give them room.<br />The <W>festivals</W> give them community.<br />The <W>table</W> gives them nourishment.</p>
        <p><W>Not to visit. To return to.</W></p>
      </Chapter>

      <Chapter title="The Balance">
        <p><W>How do we make this generation think in decades instead of hours?</W></p>
        <p>By building spaces that reward patience. Studios where the work takes as long as it takes. A plantation that gets better, not bigger.</p>
        <p><W>Some things just need to be the way they are.</W></p>
      </Chapter>

      {/* Closing */}
      <Reveal>
        <div className="section-w" style={{ paddingTop: 'clamp(48px, 8vh, 80px)', paddingBottom: 'clamp(48px, 8vh, 80px)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 640 }}>
            <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p><W>Aura is not built, it is grown.</W></p>
              <p>I am the first gardener.<br />I will not be the last.</p>
            </div>
            <div style={{ marginTop: 40 }}>
              <img src="/arvind.svg" alt="Arvind" className="arvind-sig" style={{ height: 32, display: 'block' }} />
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
  )
}
