# Ask Aura — decisions, assumptions and open gaps

Running record. Every entry is either a decision taken (with its reason), an
assumption made to keep moving, or a gap that needs a human answer.

---

## Status

Inspection complete. Source inventory generated. Implementation not started
beyond the crawler.

## Inspection findings

| Question | Finding |
| --- | --- |
| Existing chatbot | None. No chat component, route or dependency anywhere in the repo. |
| Existing API pattern | Next route handlers under `app/api/`. `app/api/contact/route.ts` is the reference: reads a server-side key from `process.env`, validates the body, returns `NextResponse.json` with structured errors. Ask Aura should match it. |
| `codex` CLI | Installed and on PATH — `codex-cli 0.145.0`. Authentication not yet verified. |
| Live site | `https://theaura.life` returns 200. `robots.txt` is `Allow: /` with a declared sitemap. |
| Crawl surface | 24 URLs in the sitemap. All 24 fetched cleanly — no errors, no thin pages, no missing titles or canonicals. |
| AI / MCP / vector dependencies | **None present.** No model SDK, no MCP SDK, no vector store, no embedding client. All four have to be added. |
| Analytics | PostHog, already wired, consent-aware. Ask Aura events should go through the existing `lib/analytics` helpers rather than a second pipeline. |

## Decisions taken

**D1 — Sitemap-first discovery, not open crawling.**
The sitemap is the site's own statement of what is public, and it is complete
(24 URLs). An open link-following crawler would add risk for no coverage gain.
Deny-list still applies on top: `/api/`, `/admin`, `/preview`, `/account`,
`/_next/`, and anything with a query string.

**D2 — Crawled content is data, never instruction.**
The crawler does not act on anything it fetches. This is a property of the
pipeline, not a prompt request, so no page — present or future, ours or
injected — can widen crawl scope or change answer policy.

**D3 — Content hashing at page level now, chunk level at ingestion.**
The inventory hashes extracted text per page so re-crawls can detect change.
Semantic chunking and chunk-level provenance belong to the ingestion step.

## Open gaps — need a human answer

**G1 — No model credential exists. (Blocking, for the answer service only.)**
`.env.example` carries PostHog keys only. `RESEND_API_KEY` is read by the
contact route but is not documented in the example either — a pre-existing gap
worth closing. Ask Aura needs a model provider and key. Everything except the
answer call can be built and tested without it.

**G2 — Retrieval store is an unmade infrastructure choice.**
Hybrid retrieval needs somewhere to live. The corpus is small — 24 pages — so
an in-repo lexical index with embeddings held as a build artefact is genuinely
viable and adds no hosting cost or vendor. A managed vector store is the
alternative. This is a paid-infrastructure decision and is explicitly reserved
for human approval.

**G3 — `@ybouane/liquidglass` compatibility is unverified.**
Not yet inspected against React 19 / Next 16. A CSS fallback is required
regardless, so this does not block the dock.

## Content conflicts found (these would poison the knowledge base)

Recorded here because retrieval will ingest both sides and answer
inconsistently until they are resolved.

**C1 — One Arabica lot has two different processes.**
`/coffee` calls it **Anaerobic Natural**. The microsite calls the same lot
*Silver Lining*, method **Appassimento Maceration**. Those are different
processes, not two names for one. Five of the six lots reconcile cleanly — the
journal names lots by method and the microsite carries both names — so this is
a single genuine conflict, not a systemic one.

**C2 — "Appassimento Maceration" names two different things inside the microsite.**
It is the *method* of the Arabica lot *Silver Lining*, and separately the
*name* of a Robusta lot whose method is *Old Peridenia*. Internal collision;
needs one of the two renamed.

**Checked and consistent:** varietals (Sln.9, Sln.795), ferment cut-off
(pH 4.2), elevation (3,600 ft), estate size (150 acres), canopy figures — the
journal's 45%/50% are drying moisture, not canopy cover, so they do not
contradict the microsite's 65–75% canopy.
