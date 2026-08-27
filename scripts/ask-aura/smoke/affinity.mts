/* The affinity store runs in the browser, so it is exercised here against
   a minimal localStorage stand-in. What matters is that it decays, that
   it stays small, that it never throws, and that it only ever nudges. */

const store = new Map<string, string>()
;(globalThis as unknown as { window: unknown }).window = globalThis
;(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => { store.set(k, v) },
  removeItem: (k: string) => { store.delete(k) },
}

const { remember, affinities, preferred, forget } = await import('../../../lib/ask-aura/affinity')

let pass = 0
const check = (name: string, ok: boolean, note = '') => {
  if (ok) pass++
  console.log(`  ${ok ? '✓' : '✗'} ${name}${note ? ` — ${note}` : ''}`)
}
const total = 8

console.log('  affinity:')

forget()
check('empty to begin with', affinities().length === 0)

for (let i = 0; i < 3; i++) remember({ topics: ['coffee', 'fermentation'], intent: 'practice' })
remember({ topics: ['residency'], intent: 'residency' })
const ranked = affinities()
check('strongest first', ranked[0] === 'coffee' || ranked[0] === 'fermentation', ranked.join(','))
check('weaker topic still present', ranked.includes('residency'))

/* "other" is the absence of an intent, not an intent. */
forget()
remember({ topics: ['coffee'], intent: 'other' })
const raw = JSON.parse(store.get('aura:ask:affinity:v1') ?? '{}')
check('"other" is not an affinity', Object.keys(raw.intents ?? {}).length === 0)

/* The store must not grow without bound. */
forget()
for (let i = 0; i < 100; i++) remember({ topics: [`topic-${i}`], intent: 'practice' })
check('bounded at 24 topics', affinities().length <= 24, `${affinities().length}`)

/* Ordering nudges; it must not invent or drop suggestions. */
forget()
for (let i = 0; i < 5; i++) remember({ topics: ['fermentation'], intent: 'practice' })
const given = [
  { label: 'How is the soil cared for', intent: 'soil' },
  { label: 'What is fermentation like here', intent: 'ferment' },
  { label: 'Where are the estates', intent: 'place' },
]
const out = preferred(given)
check('affinity leads', out[0].label === 'What is fermentation like here', out[0].label)
check('nothing added or lost', out.length === given.length && given.every((g) => out.includes(g)))

/* With no history at all, the model's own order must survive untouched. */
forget()
const untouched = preferred(given)
check('no history changes nothing', untouched.every((v, i) => v === given[i]))

console.log(`\n  affinity ${pass}/${total}`)
process.exit(pass === total ? 0 : 1)
