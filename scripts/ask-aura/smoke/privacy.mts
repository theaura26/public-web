import { redact, classifyIntent, admittedGap, insight } from '../../../lib/ask-aura/privacy'

/* Redaction has to hold in both directions. Letting a phone number
   through is the obvious failure; eating "3,600 ft" or "fifty-two
   cattle" is the quiet one that makes the whole corpus of questions
   useless to read. */

console.log('  must be redacted:')
const MUST: Array<[string, string]> = [
  ['email me at aman@theaura.life', 'email'],
  ['contact me on +91 98450 12345', 'phone'],
  ['ring 07700 900123 please', 'phone'],
  ['my card is 4111 1111 1111 1111', 'card'],
  ['see https://example.com/me', 'url'],
  ['I live at SW1A 1AA', 'postcode'],
  ['my pin is 577132', 'postcode'],
  ['find me @amanhandle', 'handle'],
  ['my account 123456789012 is wrong', 'number'],
  ['My NI number is AB 12 34 56 C; can I visit?', 'national-id'],
  ['My PAN is ABCDE1234F; can I buy coffee?', 'national-id'],
  ['I was born on 14/02/1986; can I visit?', 'dob'],
  ['Can you deliver coffee to 10 Downing Street?', 'address'],
]
let pass = 0
for (const [input, expect] of MUST) {
  const r = redact(input)
  const ok = r.found.includes(expect)
  if (ok) pass++
  console.log(`  ${ok ? '✓' : '✗'} ${expect.padEnd(9)} ${r.text}`)
}

console.log('\n  must survive untouched:')
const KEEP = [
  /* Every one of these was mangled by an earlier version of this file.
     Suppression is silent — a question that trips a pattern simply
     vanishes from the record — so a systematic false positive removes a
     whole class of question without anyone noticing. */
  'I am curious how the coffee is fermented',
  'This is regenerative agriculture, right?',
  'Were the 2025 - 2026 - 2027 harvests comparable?',
  'Did the estate produce 250000 kg of coffee in 2026?',
  'Is lot AB12 3CD from Mudigere?',
  'How many cattle are there?',
  'What is the elevation at Mudigere?',
  'The estate is 150 acres at 3,600 ft — is that right?',
  'Four Arabica lots scored between 82.25 and 85.25',
  'What happens in 2025, 2026 and 2027?',
  'Is pH 4.2 normal for this soil?',
  'Tell me about Ohara',
  'What is Rta?',
]
let kept = 0
for (const q of KEEP) {
  const r = redact(q)
  const ok = r.found.length === 0 && r.text === q.replace(/\s+/g, ' ').trim()
  if (ok) kept++
  console.log(`  ${ok ? '✓' : '✗'} ${r.found.join(',') || 'clean'.padEnd(5)} ${r.text}`)
}

console.log('\n  intent:')
const INTENT: Array<[string, string]> = [
  ['How much is a kilo of your coffee?', 'pricing'],
  ['Where can I buy it?', 'buying'],
  ['Can I come and stay?', 'visiting'],
  ['How do I apply for the residency?', 'residency'],
  ['Do you do wholesale?', 'partnership'],
  ['Are you hiring?', 'careers'],
  ['Is biodynamics scientifically proven?', 'science'],
  ['How is the coffee fermented?', 'practice'],
  ['Where are the estates?', 'place'],
  ['Why does Aura exist?', 'philosophy'],
  ['Tell me about the pepper', 'product'],
  ['asdkjh qweqwe', 'other'],
]
let ip = 0
for (const [q, want] of INTENT) {
  const got = classifyIntent(q)
  const ok = got === want
  if (ok) ip++
  console.log(`  ${ok ? '✓' : '✗'} ${got.padEnd(12)} want ${want.padEnd(12)} ${q}`)
}

console.log('\n  gap detection:')
const GAP: Array<[string, boolean]> = [
  ['There is no price per kilo listed in the material provided.', true],
  ['Aura does not publish its annual revenue.', true],
  ['That has not been measured here yet.', true],
  ['The sources do not mention pricing.', true],
  ['I do not have a figure for that.', true],
  /* A grounded "no" is not a gap. Aura genuinely does not sell tea yet,
     and the answer says why — that is the site working, not failing. */
  ['Aura does not currently sell tea in Berlin. The tea is not yet in production; the transition targets 2027.', false],
  ['There are fifty-two Malnad Gidda cattle at Mudigere.', false],
  ['Mudigere sits at 3,600 feet in the Western Ghats.', false],
]
let gp = 0
for (const [a, want] of GAP) {
  const got = admittedGap(a)
  if (got === want) gp++
  console.log(`  ${got === want ? '\u2713' : '\u2717'} gap=${String(got).padEnd(5)} ${a.slice(0, 58)}`)
}

/* The invariant that replaced the safe-question filter. A deny list can
   show that text contains something; it can never show that it contains
   nothing, so the event type simply has no free-text field to fill. This
   is checked structurally rather than by example, because examples are
   what the old design failed on. */
console.log('\n  no analytics field can hold free text:')
const ADVERSARIAL = [
  'Can Jane Smith, born 14/02/1986 and living at Flat 7, 22 Acacia Road, visit?',
  'My NI number is AB 12 34 56 C; can I visit?',
  'i want to kill myself',
  'How can I take my own life?',
  'How much insulin should I take?',
  'Tell me about the coffee',
]
const ALLOWED_KEYS = new Set([
  'intent', 'topics', 'coverage', 'thinEvidence', 'admittedGap', 'refusal', 'redacted',
])
const FIXED_INTENTS = new Set([
  'pricing', 'buying', 'visiting', 'residency', 'partnership', 'careers', 'press',
  'contact', 'science', 'practice', 'provenance', 'people', 'place', 'philosophy',
  'product', 'other',
])
let rp = 0
for (const q of ADVERSARIAL) {
  const out = insight(q, [], { refusal: 'abuse', answer: 'some answer' }) as Record<string, unknown>
  const unexpected = Object.keys(out).filter((k) => !ALLOWED_KEYS.has(k))
  /* Every value must come from a fixed vocabulary — no substring of the
     question can survive into any field. */
  const leaks = q.toLowerCase().split(/\s+/).filter((w) => w.length > 4)
    .some((w) => JSON.stringify(out).toLowerCase().includes(w))
  const ok = unexpected.length === 0 && FIXED_INTENTS.has(out.intent as string) && !leaks
  if (ok) rp++
  console.log(`  ${ok ? '\u2713' : '\u2717'} ${q.slice(0, 52).padEnd(54)}${unexpected.length ? ` extra:${unexpected}` : ''}${leaks ? ' LEAK' : ''}`)
}
const sensitive = ADVERSARIAL

const total = pass === MUST.length && kept === KEEP.length && ip === INTENT.length &&
  gp === GAP.length && rp === sensitive.length
console.log(`\n  redacted ${pass}/${MUST.length} · preserved ${kept}/${KEEP.length} · intent ${ip}/${INTENT.length} · gaps ${gp}/${GAP.length} · refusals ${rp}/${sensitive.length}`)
process.exit(total ? 0 : 1)
