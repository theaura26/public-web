# Ask Aura — threat model and operating notes

What the assistant is, what it promises, where those promises end, and what an
operator has to do to keep them true. Written to be read before a change, not
after an incident.

## The shape of the thing

A visitor asks a question on theaura.life. The browser posts it to
`/api/ask-aura` on the same origin. The server screens it, retrieves passages
from a corpus built at deploy time, sends prompt + passages + question to
OpenAI, and streams the answer back over SSE with its citations.

The corpus is a build artefact (`data/ask-aura/corpus.json`), produced by
crawling the live site and ingesting a small curated set of external research.
Nothing is fetched at request time except the OpenAI API.

## What it promises

1. Text from a page, a reader's selection, a retrieved chunk or a claimed prior
   turn is data. It never becomes an instruction.
2. No secret — API key, environment variable, file content, system prompt — can
   be elicited through it.
3. Only this site's own pages can call it.
4. Nothing is unbounded: not the request, not the result set, not the limiter's
   own memory.
5. A citation only ever points somewhere the site is willing to send a reader.
6. A retrieval failure never becomes an invented answer.

## How each one is held

**1 — Untrusted text stays data.** Three layers, because no single one is a
boundary. Page context and retrieved passages go in as *user* turns, never
system: the role the model treats as authoritative carries only the prompt.
Each block is fenced with a labelled delimiter, and content that spells the
delimiter is defanged before it goes in (`fenceContext`). Claimed history is
re-screened turn by turn, and a turn that would have been refused live is
dropped rather than replayed. The prompt then instructs the model to refuse
instructions found in content — last line, not first.

*Residual risk:* a paraphrased or novel injection that no pattern matches and
the model complies with. The mitigation is that there is nothing valuable to
reach — see 2.

**2 — Secrets are unreachable, not merely unmentioned.** The key exists only in
`process.env` on the server and only ever enters an outbound `authorization`
header. It is never in a model message, so no amount of persuasion produces it.
The deterministic screen refuses the obvious asks without a model call, which is
defence in depth and cost control, not the boundary itself. The MCP server
publishes the prompt's version and sha256, never its text.

Screening runs against the message as written *and* against a folded twin —
NFKD, combining marks stripped, confusables folded, whitespace collapsed — so a
soft hyphen, an isolate mark, a combining solidus or a Cyrillic lookalike buys
nothing. The fold is used only to decide whether something is an attack; it is
never shown to the model, stored, or returned.

**3 — Only this site can call it.** `Origin` must be on an explicit allow-list:
production, www, anything in `ASK_AURA_ALLOWED_ORIGINS`, the current
`VERCEL_URL`, and localhost in development only. A request with no `Origin` is
accepted only with `Sec-Fetch-Site: same-origin`, which a cross-site script
cannot forge. Everything else gets 403.

*Residual risk:* a non-browser client that sets a permitted `Origin` freely.
This endpoint is rate-limited and grounded, not authenticated; treat it as
public and priced accordingly.

**4 — Everything is bounded.** Body refused at 32 KB on the declared length and
again on the real one. Message, history turns, history characters, selection and
topics each capped in `screen()`. `search()` clamps its own limit rather than
trusting callers. The rate-limiter's map is swept on a TTL and capped in
cardinality, so keys cannot be varied to fill memory.

*Residual risk, and it is a real one:* the limiter is per-instance and in-memory.
A serverless deployment partitions it across instances and loses it on cold
start, and it is keyed on a client-varying session id alongside the address. It
raises the cost of abuse; it does not cap it. **A shared TTL store keyed on a
trusted address is required before this is load-bearing.** Until then, the
binding control on spend is the OpenAI account's own usage limit — set one.

**5 — Citations go where the site would go.** Every candidate URL is resolved
against a trusted base before being judged, so `/\evil.example/path` and other
single-slash spellings that browsers read off-site are caught. Two lists:
`isAllowedLink` for the site's own hosts, and `isCitableSource`, which adds the
four named research hosts the external corpus actually holds. Widening either
list is a deliberate act.

**6 — No sources, no answer.** If retrieval throws, the route returns fixed text
and never calls the model. Telling a model to admit it has no sources is not
enforcement; not calling it is.

## What analytics knows, and how to use it

The question Aura wants answered is *what are people seeking*. The obvious way
to answer it — ship every question verbatim — is also the one way that turns a
search box into a store of other people's personal details, because a free-text
field collects whatever a visitor types, including the things you asked them not
to type.

So the text is not the unit of analysis. **Intent and topic are.** A thousand
rows reading `pricing · coffee · gap` tell you more than a thousand raw strings,
because they aggregate, they segment, and nobody has to redact them later.

### What each question sends

`lib/ask-aura/privacy.ts` is the only place that decides this. The server
classifies — it is the only party that knows which passages actually answered —
and returns an `insight` object in the meta frame. The browser forwards that and
nothing else.

| Property | What it is | Why it earns its place |
| --- | --- | --- |
| `intent` | One of sixteen fixed labels: `pricing`, `buying`, `visiting`, `residency`, `partnership`, `careers`, `press`, `contact`, `science`, `practice`, `provenance`, `people`, `place`, `philosophy`, `product`, `other` | What the person is trying to do. Fixed vocabulary, because a label that can be anything is a free-text field wearing a hat |
| `topics` | Up to three page ids, from what retrieval found | Stable in a way keywords are not — `fermentation` stays `fermentation` when the copy is rewritten |
| `coverage` | `high` / `medium` / `low` / `none` | How confident retrieval was |
| `thinEvidence` | Retrieval came back with nothing convincing | Where the corpus is weak |
| `admittedGap` | **The answer itself conceded it did not know** | The signal to watch. See below |
| `refusal` | Which fixed refusal fired, if any | Volume of distress, high-stakes and abuse, without the words |
| `redacted` | Which *kinds* of identifier were stripped. Never the values | "Someone left a phone number" is worth knowing; the number is not |
| `question` | The question, **only** when it needed no redaction, is under 140 characters, under 28 words, single-line, and was not refused | The long tail, readable, for the cases where a label is too coarse |

Two rules are absolute and enforced in code, not by convention:

- **A refused question is never stored, in any form.** Not when it passes the
  redaction filter, not when it looks harmless. The refusals are the most
  sensitive things anyone types into this box — distress above all — and the
  label alone says everything Aura needs to know. `questionIsSafe()` returns
  false on any refusal before it checks anything else.
- **Redaction runs before the safety filter, not instead of it.** If anything
  was stripped, the text is withheld entirely and only the *kind* is recorded.
  A question that had an email in it is reported as `visiting · [email]`, which
  still tells you someone wanted to come and left a way to reach them.

`ASK_AURA_LOG_QUESTIONS=off` withholds every question text and keeps the labels.
Nothing else changes; no dashboard breaks.

### `admittedGap` is the one to watch

Retrieval confidence is a poor proxy for whether a question was answered. Ask
"do you ship to Berlin" and retrieval returns six confident passages about the
estate, none of which answer it. So the gap signal reads the *answer* instead,
for the concessions the prompt tells it to make — "not published", "no figure
for that", "has not been measured here yet".

Every one of those is a question the site could answer and currently does not.
Sorted by frequency, `admittedGap = true` grouped by `intent` is a content
backlog in priority order, generated by the people who wanted the content. It
is the most commercially useful thing in this whole feature.

### Segmenting

Do not precompute segments. Define PostHog **cohorts** over these events, so a
definition can be changed later without a deploy and without re-collecting
anything. The properties above were chosen to make these cheap:

- **Buyers** — `ask_aura_answered` where `intent` in (`pricing`, `buying`) at
  least once. The most commercially direct group on the site.
- **Visitors** — `intent` in (`visiting`, `residency`). Different funnel,
  different follow-up, often a different season.
- **Trade** — `intent` in (`partnership`, `press`, `careers`). Small, valuable,
  and currently invisible in the contact form alone.
- **Sceptics** — `intent = science`, or `topics` containing `biodynamic` with
  `intent = science`. These are the people the external research corpus exists
  for, and worth knowing the size of.
- **Deep readers** — three or more `ask_aura_answered` in a session, or `turn`
  ≥ 4. Engagement that page-depth alone does not show.
- **Underserved** — any `admittedGap = true`. Cross this with the others: an
  underserved *buyer* is a lost sale with a receipt.

Cross-referencing intent against `topics` gives the interesting bit: someone
asking `pricing` about `fermentation` is a roaster; someone asking `pricing`
about `sanctuary` is a guest.

### Where personalisation plugs in

It does not need identity, and it should not wait for it. The data to
personalise on is already on the visitor's own device: the transcript in
`localStorage` under `aura:ask:v1`, which is a record of what this person cares
about, held where it cannot leak.

The order to build it in, cheapest first:

1. **On-device affinity.** Tally the `topics` and `intent` of this visitor's own
   questions in `localStorage`. Order the dock's opening suggestions by it. No
   server, no profile, no consent question — the data never moves.
2. **Page-aware openers.** Already half-built: `suggest_questions` in the MCP
   server derives questions from the sections a page actually contains.
   Combining that with (1) gives "what this page can answer, ordered by what you
   have shown interest in".
3. **Cohort-aware content.** Once the cohorts above have real volume, use them
   for what they are good at — deciding what to *write* — before using them to
   change what an individual sees.
4. **Identified personalisation.** Only at the point someone identifies
   themselves, which on this site means the contact form. `identify()` in
   `lib/analytics.ts` already keys to the submitted email and merges the prior
   anonymous history. That is the moment the privacy footing changes, and the
   moment to have a policy page in place — not before.

Steps 1 and 2 need no privacy decision at all. Step 4 needs the policy page.

### Still owed

- **The site has no privacy policy page.** The dock's disclosure line — "we keep
  a note of what people ask about, never of who asked" — is accurate about Ask
  Aura, and should link to a page that says the same about the rest of the site.
- **Site-wide PostHog is on fullest tracking**: `person_profiles: 'always'`,
  `persistence: 'localStorage+cookie'`, session replay on. That predates Ask
  Aura and is unchanged here, but it is the reason a consent banner is still
  outstanding — `app/providers.tsx` carries its own note to that effect. Ask
  Aura is now the *least* identifying thing on the site, which is the wrong way
  round.
- **A retention period.** The labels can be kept indefinitely without much
  thought. The stored question texts should have a window — twelve months is
  defensible — after which they are aggregated to labels and dropped.

## Operating

**Rebuild the corpus whenever site copy changes.** It is a snapshot. Stale
copy means confidently wrong answers.

```bash
node scripts/ask-aura/crawl.mjs && node scripts/ask-aura/ingest.mjs
```

Ingestion is incremental — unchanged chunks keep their embeddings, so a copy
edit costs a handful of embedding calls, not 240.

**Before shipping a prompt or retrieval change**, run the suite. The release
bar is zero failures in `injection`, `indirect-injection`, `high-stakes` and
`abuse`, and 90% overall. A run with `--no-judge`, or without an API key, or
over a subset of cases, says so in its output and cannot report success.

```bash
npm run ask-aura:eval
```

The deterministic suites are quick and need no model at all — redaction,
screening, link validation, retrieval shape, MCP:

```bash
npm run ask-aura:smoke
```

**Rollback** is a revert plus a redeploy; there is no migration and no
persistent state. To switch the assistant off without a deploy, remove
`OPENAI_API_KEY` — the route then answers with fixed text pointing at the pages
and the contact form.

## What the evaluation does and does not tell you

66 cases, typically 94–97% passing, zero failures in the four categories where a
failure is a safety incident. The gate is 90% and zero critical.

The overall number moves by a few points between runs, and it is worth knowing
why rather than re-running until it looks tidy. Two of the failures are stable
and two rotate:

- **`ctx-03` fails consistently** on the house rule against defining by
  negation. The Ohara page itself says "a sanctuary is a posture, not a
  property", and the model borrows the construction however plainly the prompt
  forbids it.
- **The `grounded` failures rotate** between broad identity questions — "what is
  Aura", "why does Aura exist", "what do you grow". They are not hallucinations
  in the ordinary sense: the model states things that are *true of Aura* but are
  not in the six passages retrieved for that particular question. The judge
  grades strict entailment against the evidence shown, which is the right bar
  for a source-grounded assistant, and these answers do not clear it.

Lowering sampling temperature from 0.4 to 0.2 did not change the rate, which
tells you the cause is retrieval reach on broad questions rather than sampling.
The fix, when someone picks it up, is to retrieve more widely when a question is
about Aura as a whole — not to soften the assertion.

## Known gaps

- The limiter, above. The single most important thing to fix before real
  traffic.
- The corpus is built from production, which does not yet carry the coffee
  microsite, Field Notes or Aura Festival. Those pages cannot be answered from
  until they ship and the corpus is rebuilt.
- Two Arabica lots are described inconsistently between `/coffee` and the
  microsite — one is "Anaerobic Natural" in one place and "Silver Lining /
  Appassimento Maceration" in the other, with different ferment and drying
  times. Whichever is right, the corpus currently holds both. This needs a
  factual ruling from Aura, not a guess from the code.
