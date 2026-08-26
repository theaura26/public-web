/* Ask Aura — what analytics is allowed to know.
 *
 * The question Aura wants answered is "what are people seeking?". The
 * obvious way to answer it — ship every question verbatim — is also the
 * one way that turns a search box into a store of other people's
 * personal details. A free-text field collects whatever a visitor types,
 * including the things you asked them not to type.
 *
 * So the text is not the unit of analysis. Intent and topic are. A
 * thousand rows reading "pricing · coffee · unanswered" tell you more
 * than a thousand raw strings, and they aggregate, segment and survive a
 * subject-access request without anyone having to redact them later.
 *
 * Three things happen here:
 *   redact()    — removes the identifiers a person may have typed
 *   classify()  — turns a question into intent + topics
 *   insight()   — assembles the event that analytics is permitted to see
 *
 * Nothing in this file returns the visitor's own words to a third party
 * unless they survive redaction untouched and are short enough to be
 * unremarkable — and even that is switchable off in one environment
 * variable.
 */

import type { Hit } from './retrieve'

/* ── redaction ──────────────────────────────────────────────────────
   Ordered widest-first: an email inside a longer string should be taken
   as an email, not chewed into a digit run by an earlier pattern. Each
   pattern replaces with a label, so a redacted question stays readable
   as a question — "email me at [email]" is still evidently a request to
   be contacted, which is the intent worth counting. */

/* Order is the whole design here. Each rule consumes the text it
   matches, so a rule that fires early takes ground from every rule after
   it: the six-digit PIN rule, left in front of the phone rule, eats the
   second half of "07700 900123" and turns a phone number into a postcode
   and some loose digits. Widest and most specific first, vaguest last. */
const BEFORE_PHONES: Array<[RegExp, string]> = [
  [/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, '[email]'],
  [/\b(?:https?:\/\/|www\.)[^\s]+/gi, '[url]'],
  /* Card-shaped: 13–19 digits in groups, claimed before anything can
     take a bite out of it. */
  [/\b(?:\d[ -]*?){13,19}\b/g, '[card]'],
]

const AFTER_PHONES: Array<[RegExp, string]> = [
  /* UK postcodes, then Indian PINs. */
  [/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/gi, '[postcode]'],
  [/\b\d{6}\b/g, '[postcode]'],
  [/@[a-z0-9_]{3,}\b/gi, '[handle]'],
  /* Someone introducing themselves. Narrow on purpose: an explicit
     preamble followed by a capitalised word, never a bare capitalised
     word, which would eat Mudigere, Ohara and every place worth
     counting. */
  [/\b(my name(?:'s| is)|i am|i'm|this is)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/gi, '[name]'],
  /* Whatever long digit run is left: an account, an order, an ID. */
  [/\b\d{7,}\b/g, '[number]'],
]

export type Redaction = { text: string; found: string[] }

/* A run of digits and the punctuation people put between them. Whether
   it is a phone number is decided by counting the digits: fewer than
   nine and it is a measurement, a year or a price; more than fifteen and
   no telephone system on earth would route it. */
const DIGIT_RUN = /(?:\+?\d[\d\s().-]{7,})\d/g

function redactPhones(text: string): { text: string; hit: boolean } {
  let hit = false
  const out = text.replace(DIGIT_RUN, (match) => {
    const digits = (match.match(/\d/g) ?? []).length
    /* Separators are what distinguish "07700 900123" from a long ID. A
       bare run of digits with no punctuation is left to the [number]
       rule, which is the more honest label for it. */
    if (digits < 9 || digits > 15 || !/[\s().-]/.test(match)) return match
    hit = true
    return '[phone]'
  })
  return { text: out, hit }
}

/** Strip the identifiers a person may have typed into a public box. */
export function redact(input: string): Redaction {
  let text = input
  const found: string[] = []

  const apply = (rules: Array<[RegExp, string]>) => {
    for (const [pattern, label] of rules) {
      pattern.lastIndex = 0
      if (!pattern.test(text)) continue
      pattern.lastIndex = 0
      text = text.replace(pattern, label)
      found.push(label.slice(1, -1))
    }
  }

  apply(BEFORE_PHONES)
  const phones = redactPhones(text)
  text = phones.text
  if (phones.hit) found.push('phone')
  apply(AFTER_PHONES)

  return { text: text.replace(/\s+/g, ' ').trim(), found: [...new Set(found)] }
}

/* ── intent ─────────────────────────────────────────────────────────
   A small, fixed taxonomy. Fixed because a label that can be anything is
   a free-text field wearing a hat, and because segments are only stable
   if the vocabulary is. Ordered: the first match wins, so the
   commercially specific intents are tested before the general ones. */

const INTENTS: Array<[string, RegExp]> = [
  ['pricing', /\b(price|prices|pricing|cost|costs|how much|per kilo|per kg|rate|quote)\b/i],
  ['buying', /\b(buy|buying|sell|sells|selling|purchase|order|stock|stockist|shop|available|ship|shipping|deliver|delivery|export)\b/i],
  ['visiting', /\b(visit|visiting|stay|stays|book|booking|tour|come|open to|can i see|retreat|accommodation)\b/i],
  ['residency', /\b(residency|resident|apply|application|fellowship|polymath)\b/i],
  ['partnership', /\b(partner|partnership|wholesale|distribut|collaborat|supply|b2b|invest|investment)\b/i],
  ['careers', /\b(job|jobs|hiring|career|vacanc|work with you|internship|volunteer)\b/i],
  ['press', /\b(press|journalist|interview|media enquiry|photograph|feature)\b/i],
  ['contact', /\b(contact|email|get in touch|speak to|reach|phone|call you)\b/i],
  ['science', /\b(evidence|scientific|study|studies|research|proven|peer.review|data|measure|measured)\b/i],
  ['practice', /\b(how do you|how is|process|method|ferment|compost|prune|harvest|graze|soil|jeevamrit|biodynamic|brix|cattle|cow|cows|herd|buffalo|livestock|compost)\b/i],
  ['provenance', /\b(traceab|provenance|origin|lot|batch|certif|organic|audit|transparen)\b/i],
  ['people', /\b(who|founder|team|family|farmer|staff|employ|community|worker)\b/i],
  ['place', /\b(where|located|location|mudigere|ohara|kyoto|karnataka|ghats|acres|elevation|altitude)\b/i],
  ['philosophy', /\b(why|purpose|belief|believe|meaning|vision|mission|values|rta|ṛta|regenerat|philosoph)\b/i],
  ['product', /\b(coffee|pepper|cardamom|honey|areca|arabica|robusta|roast|cup|flavour|taste|variety)\b/i],
]

/** One label for what the visitor is trying to do. */
export function classifyIntent(question: string): string {
  for (const [name, pattern] of INTENTS) {
    if (pattern.test(question)) return name
  }
  return 'other'
}

/* ── topics ─────────────────────────────────────────────────────────
   Taken from what retrieval actually found rather than from the words in
   the question. The corpus already knows which page answers a question,
   and a page id is a stable label in a way that a keyword is not. */

function topicsFrom(hits: Hit[]): string[] {
  const seen: string[] = []
  for (const h of hits) {
    const id = h.chunk.docId
    if (id && !seen.includes(id)) seen.push(id)
    if (seen.length >= 3) break
  }
  return seen
}

/* ── the event ──────────────────────────────────────────────────────
   Everything analytics is allowed to know about one question. Note what
   is absent: no visitor identifier is minted here, no selection text, no
   page-context strings, and — unless it survives the test below — no
   question. */

export type Insight = {
  intent: string
  topics: string[]
  /** How confident retrieval was. Not the same as having answered. */
  coverage: 'high' | 'medium' | 'low' | 'none'
  /** Retrieval came back thin: nothing found, or nothing convincing. */
  thinEvidence: boolean
  /** The answer itself conceded it did not know. This is the signal
      worth watching: retrieval can return six confident passages about
      the estate and still not answer "do you ship to Berlin", so
      confidence is a poor proxy for a gap and the admission is a good
      one. Every one of these is a question the site could answer and
      currently does not. */
  admittedGap: boolean
  /** Which fixed refusal fired, if any. */
  refusal?: string
  /** What kinds of identifier were stripped. Never the values. */
  redacted: string[]
  /** The question itself, only when it is safe and permitted. */
  question?: string
}

const TEXT_LIMIT = 140

/* Text is only ever forwarded when it needed no redaction and is short
   enough to be an ordinary question rather than a paragraph about
   someone's circumstances. Set ASK_AURA_LOG_QUESTIONS=off to hold back
   every question and keep the labels alone. */
function questionIsSafe(redaction: Redaction, refusal?: string): boolean {
  /* A refused question is never forwarded, whatever it looks like. The
     refusals are the most sensitive things anyone types into this box —
     distress above all — and "it passed the redaction filter" is not a
     good enough reason to keep a record of someone's worst evening. The
     label alone says everything Aura needs to know. */
  if (refusal) return false
  if (process.env.ASK_AURA_LOG_QUESTIONS === 'off') return false
  if (redaction.found.length > 0) return false
  if (redaction.text.length > TEXT_LIMIT) return false
  /* A question with no question in it — a paste, a list, a form filled
     into the wrong box — is exactly the shape that carries details
     nobody meant to send. */
  if (redaction.text.split(/\s+/).length > 28) return false
  if (/\n/.test(redaction.text)) return false
  return true
}

/* The shapes the prompt's own instructions produce when the corpus is
   silent. A heuristic, and named as one — it reads the answer rather
   than the sources, which is the only place the concession appears. */
const CONCESSION = [
  /\b(not|isn't|is not|does not|doesn'?t|do not|don'?t)\s+(publish|published|record|recorded|say|state|list|listed|mention|include|cover|give)\b/i,
  /\bno (public |published )?(record|figure|number|price|information|detail|answer)\b/i,
  /* The general shape: a negation followed, close by, by a word meaning
     "written down here". Catches "there is no price per kilo listed" and
     "that is not stated on the pages", which the verb lists above miss
     because the negation and the verb are several words apart. */
  /\b(not|no)\b[^.!?]{0,40}\b(listed|stated|mentioned|specified|given|published|available|recorded)\b/i,
  /\bi (do not|don'?t) have\b/i,
  /\b(not|nothing) (in|on) (the|Aura'?s) (pages|sources|site|corpus)\b/i,
  /\b(has not|hasn'?t) been (measured|published|shared|decided)\b/i,
  /\bnot something (aura|the estate|we) (publishes|shares|says)\b/i,
  /\bthat is not (a thing|something)\b/i,
]

export function admittedGap(answer: string): boolean {
  return CONCESSION.some((p) => p.test(answer))
}

export function insight(
  question: string,
  hits: Hit[],
  opts: { refusal?: string; answer?: string } = {},
): Insight {
  const redaction = redact(question)
  const coverage: Insight['coverage'] = !hits.length
    ? 'none'
    : (hits[0]?.confidence ?? 'low')

  return {
    intent: classifyIntent(redaction.text),
    topics: topicsFrom(hits),
    coverage,
    thinEvidence: !hits.length || coverage === 'low',
    admittedGap: opts.answer ? admittedGap(opts.answer) : false,
    ...(opts.refusal ? { refusal: opts.refusal } : {}),
    redacted: redaction.found,
    ...(questionIsSafe(redaction, opts.refusal) ? { question: redaction.text } : {}),
  }
}
