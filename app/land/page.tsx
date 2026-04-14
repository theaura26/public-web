'use client'

import Reveal from '@/components/RevealOnScroll'

const estateData = [
  { label: 'Location', value: 'Mudigere' },
  { label: 'Altitude', value: '3,600 ft' },
  { label: 'Coffee Area', value: '100 acres' },
  { label: 'Total Estate', value: '150 acres' },
  { label: 'Soil', value: 'Laterite' },
  { label: 'pH', value: '6.0\u20136.5' },
  { label: 'Herd', value: '52 Gidda' },
  { label: 'Zone', value: 'UNESCO' },
]

const rules = [
  { title: 'Soil Comes First', desc: 'All decisions flow from soil health.' },
  { title: 'Do Small Work Properly', desc: 'Mastery before scaling.' },
  { title: 'No Shortcuts', desc: 'Right timing over quick gains.' },
  { title: 'Quality Before Quantity', desc: 'One excellent lot over five average ones.' },
  { title: 'Think 10 Years Ahead', desc: 'Every action serves the long game.' },
  { title: 'Leaders on the Field', desc: 'Authority comes from presence and practice.' },
]

const crops = [
  { name: 'Coffee', meta: '100 acres · Arabica S795, Selection 9, Chandragiri', desc: 'Our flagship crop. Six micro lots, six processing methods. Cupped fresh at source. Specialty-grade fermentation.' },
  { name: 'Pepper', meta: 'Malabar pepper · Shade-grown under native canopy', desc: 'Intercropped with coffee. Biodynamic cultivation. The aromatic backbone of Indian spice tradition.' },
  { name: 'Areca', meta: 'Traditional intercrop · Economic anchor', desc: 'Grown beneath coffee canopy. Supports biodiversity. Provides income stability and forest structure.' },
  { name: 'Tea', meta: 'Experimental plots · Future expansion', desc: 'Small-scale trials at 3,600 feet. Testing processing methods and cultivar adaptation.' },
]

const lots = [
  { name: 'Anaerobic Natural', process: 'Whole cherry in sealed tank', harvest: '450 kg', brix: '24\u201326', ferm: '72h sealed + 20d dry', notes: ['Berries', 'Wine', 'Stone Fruit'] },
  { name: 'Dry Osmosis', process: 'Whole cherry dried 25 days', harvest: '380 kg', brix: '28\u201330', ferm: 'Sun + time', notes: ['Chocolate', 'Dried Fruit', 'Caramel'] },
  { name: 'Red Honey', process: 'Pulped, mucilage intact', harvest: '520 kg', brix: '22\u201324', ferm: '48h wet + 20d dry', notes: ['Florals', 'Honey', 'Citrus'] },
  { name: 'Banana Wash', process: 'Fermented in banana leaf', harvest: '410 kg', brix: '20\u201322', ferm: '36h + 18d dry', notes: ['Tropical', 'Fruit Punch', 'Bright'] },
  { name: 'Solera Maceration', process: 'Anaerobic, Solera method', harvest: '480 kg', brix: '25\u201327', ferm: '96h sealed + 22d dry', notes: ['Plum', 'Jasmine', 'Dark Chocolate'] },
  { name: 'Solera Wash', process: 'Aged in cherry parchment', harvest: '390 kg', brix: '21\u201323', ferm: '60h wet + 21d dry', notes: ['Clean', 'Almond', 'White Tea'] },
]

export default function LandPage() {
  return (
    <div>

      {/* Hero */}
      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 80 }}>
        <div className="section-w">
          <Reveal>
            <h1 style={{ maxWidth: 800 }}>Where Forest and Energy Merge</h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="p2" style={{ maxWidth: 440, marginTop: 32 }}>
              Two ancient farming intelligences. Three fermentation disciplines. Six coffee micro lots. One regenerative vision.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)' }}>
            <Reveal>
              <div>
                <h2>Not Organic as a Marketing Badge</h2>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-col gap-5" style={{ paddingTop: 4 }}>
                <p className="p2">We practice two integrated farming systems: Biodynamic and Vedic. Not competing approaches — complementary intelligence.</p>
                <p className="p2" style={{ color: 'var(--text-muted)' }}>Stabilize → Rebuild → Optimize → Specialize → Higher-value products. Stage 3, transitioning to Stage 4.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Estate Data */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)' }}>
              {/* Left half */}
              <div className="grid grid-cols-2" style={{ gap: 0 }}>
                {estateData.slice(0, 4).map((d) => (
                  <div key={d.label} style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                    <p className="label" style={{ marginBottom: 6 }}>{d.label}</p>
                    <p className="p1" style={{ fontSize: 18 }}>{d.value}</p>
                  </div>
                ))}
              </div>
              {/* Right half */}
              <div className="grid grid-cols-2" style={{ gap: 0 }}>
                {estateData.slice(4).map((d) => (
                  <div key={d.label} style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                    <p className="label" style={{ marginBottom: 6 }}>{d.label}</p>
                    <p className="p1" style={{ fontSize: 18 }}>{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Six Rules */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)' }}>
            <Reveal>
              <div>
                <h2>The Six Rules</h2>
                <p className="p2" style={{ marginTop: 16 }}>Carved on every work shed. In English and Kannada.</p>
                <p className="p2" style={{ marginTop: 16 }}>Be on the land. Be fair. Do the work properly.</p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-col">
                {rules.map((r) => (
                  <div key={r.title} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
                    <p className="p1">{r.title}</p>
                    <p className="p2" style={{ marginTop: 2 }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Crops */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <Reveal>
            <h2 style={{ marginBottom: 'clamp(48px, 6vh, 80px)' }}>Our Crops</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 stagger" style={{ gap: 'var(--grid-gap)' }}>
            {crops.map((c) => (
              <Reveal key={c.name}>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <p className="p1" style={{ marginBottom: 6 }}>{c.name}</p>
                  <p className="label" style={{ marginBottom: 10 }}>{c.meta}</p>
                  <p className="p2">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee Micro Lots */}
      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)', marginBottom: 'clamp(48px, 6vh, 80px)' }}>
            <Reveal>
              <h2>Genetics Are the Instrument. Processing Is the Music.</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="p2" style={{ paddingTop: 4 }}>Six micro lots from the same harvest, same altitude, same soil. Processed differently. Cupped side-by-side. Each tells a story about time.</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 stagger" style={{ gap: 'var(--grid-gap)' }}>
            {lots.map((lot) => (
              <Reveal key={lot.name}>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <p className="p1" style={{ marginBottom: 10 }}>{lot.name}</p>
                  <div className="p2" style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>
                    {lot.process}<br />{lot.harvest} · Brix {lot.brix}<br />{lot.ferm}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lot.notes.map((note) => (
                      <span key={note} className="label" style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 16 }}>{note}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
