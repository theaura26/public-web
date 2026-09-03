/* Quick retrieval smoke test: node scripts/ask-aura/try-retrieval.mts "your question" */
import { search } from '../../../lib/ask-aura/retrieve'

const custom = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const qs = custom.length ? custom : [
  'why Mudigere?',
  'how do you look after the soil',
  'what is Brix',
  'what makes each coffee lot different',
  'how many cattle are there',
  'can I visit the estate',
]
for (const q of qs) {
  const hits = await search(q, { limit: 3 })
  console.log(`\nQ: ${q}`)
  for (const h of hits) console.log(`   [${h.confidence}] ${h.chunk.sectionPath}`)
  if (hits[0]) console.log(`   → ${hits[0].passage.slice(0, 120).replace(/\n/g, ' ')}…`)
}

/* The page in view must always be represented in the evidence.
   "How does this connect to the coffee?" asked on the herd page reads,
   lexically, as a question about coffee — both retrievers dropped the
   herd page entirely, and the model was asked about the herd having
   been shown nothing about it. A score multiplier cannot fix that: the
   page loses on score, so scaling its score still loses. A seat is
   reserved instead. */
console.log('\n  the page in view is always in evidence:')
const PAGES: Array<[string, string | undefined]> = [
  ['How does this connect to the coffee?', 'https://theaura.life/herd'],
  ['What is this place?', 'https://theaura.life/ohara'],
  ['Why here?', 'https://theaura.life/mudigere'],
  ['Tell me about the shade canopy.', 'https://theaura.life/pepper'],
  ['How many cattle are there?', undefined],
]
let seated = 0
for (const [q, page] of PAGES) {
  const hits = await search(q, { limit: 6, pageUrl: page })
  const onPage = hits.filter((h) => h.chunk.url === page).length
  const pass = page ? onPage > 0 : true
  if (pass) seated++
  console.log(`  ${pass ? '✓' : '✗'} ${String(onPage).padStart(2)} on-page  ${q}`)
}
console.log(`\n  page representation ${seated}/${PAGES.length}`)
process.exit(seated === PAGES.length ? 0 : 1)
