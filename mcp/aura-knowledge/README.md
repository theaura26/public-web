# Aura Knowledge — MCP server

A read-only window onto the same corpus the website assistant answers from.
Six tools, two resources, no writes, no shell, no filesystem parameter, no
arbitrary URL fetching. Every result carries the provenance needed to cite it
or to audit it later.

## Build the corpus first

The server reads a build artefact. Without it there is nothing to serve.

```bash
node scripts/ask-aura/crawl.mjs && node scripts/ask-aura/ingest.mjs
```

`OPENAI_API_KEY` is needed for ingestion (embeddings) and for `search_aura`,
which embeds the query. The other five tools are lexical and need no key.

## Run it

```bash
npx tsx mcp/aura-knowledge/server.mts
```

stdio transport. It expects to be started with the repository root as its
working directory.

## Configure a client

Claude Code:

```bash
claude mcp add aura-knowledge -- npx tsx /absolute/path/to/repo/mcp/aura-knowledge/server.mts
```

Or, for any client that reads the standard config shape:

```json
{
  "mcpServers": {
    "aura-knowledge": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/repo/mcp/aura-knowledge/server.mts"],
      "cwd": "/absolute/path/to/repo",
      "env": { "OPENAI_API_KEY": "sk-proj-..." }
    }
  }
}
```

## Tools

| Tool | Takes | Gives back |
| --- | --- | --- |
| `search_aura` | `query`, optional `page_context`, `source_types`, `limit` | Ranked passages with full provenance |
| `get_aura_page` | `canonical_url_or_id` | Every section of one page, in document order |
| `list_aura_topics` | — | The topic index, with build time and counts |
| `get_aura_topic` | `topic_id` | One topic and its sections |
| `get_source` | `source_id` | One chunk with its content hash, to verify a citation |
| `suggest_questions` | `page_context`, optional `limit` | Questions that page can actually answer. Deterministic — no model call |

Bounded throughout: queries cap at 400 characters, result sets at 10, and
`search()` clamps its own limit rather than trusting the caller.

## Resources

- `aura://index/topics` — every page in the corpus, with counts and build time.
- `aura://policy/version` — the id, version and sha256 of the prompt an answer
  was produced under.

The prompt **text** is deliberately not exposed. The assistant is under
standing instruction never to reveal its instructions; publishing them through
a side door would make that instruction a formality. The hash is enough to
audit which policy was in force.

## What Aura-authored content means here

Aura's own pages are authoritative about Aura. External sources — the four
named institutional and peer-reviewed items in `data/ask-aura/external.json` —
may explain or qualify, never generate a claim about Aura. Each carries an
explicit note on what it does and does not support. `source_types` filters
between the two namespaces.
