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

## Privacy — an open obligation

`ask_aura_question` sends the visitor's **full question text** to PostHog,
together with the page and turn number, gated on `NEXT_PUBLIC_POSTHOG_KEY`.
This was an explicit product decision: Aura wants to know what people are
actually seeking, and to build audience profiles and segmentation from it.

The composer is marked `ph-no-capture`, so keystrokes are not recorded by
session replay — only the submitted question is captured, deliberately.

The dock discloses this in a line beneath the composer: answers can be wrong,
do not enter personal details, questions are recorded.

**What is still owed, and this is not optional:**

- The site has no privacy policy page. Capturing free-text input and building
  profiles from it needs one, and the disclosure line should link to it.
- Under UK GDPR this is likely legitimate-interest processing of personal data,
  because a free-text field is one a visitor may type their own details into
  regardless of being asked not to. A retention period and a deletion route
  need deciding.
- If PostHog is configured with EU ingest (`eu.i.posthog.com`, as in
  `.env.example`), keep it that way.

Engineering has done what it can here: the capture is gated, disclosed, and
narrow. The remaining items are Aura's to decide, not the code's.

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
`abuse`, and 90% overall.

```bash
npx tsx evals/ask-aura/run.mts
```

**Rollback** is a revert plus a redeploy; there is no migration and no
persistent state. To switch the assistant off without a deploy, remove
`OPENAI_API_KEY` — the route then answers with fixed text pointing at the pages
and the contact form.

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
