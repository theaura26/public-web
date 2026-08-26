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
