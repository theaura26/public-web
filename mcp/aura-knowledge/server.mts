#!/usr/bin/env node
/* Aura Knowledge — MCP server.
 *
 * A read-only window onto the same corpus the website assistant uses.
 * Six tools, no writes, no arbitrary fetching, no filesystem or shell
 * access. Every result carries enough provenance to cite or audit it.
 *
 * The corpus is a build artefact produced by:
 *   node scripts/ask-aura/crawl.mjs && node scripts/ask-aura/ingest.mjs
 *
 * Run:  npx tsx mcp/aura-knowledge/server.mts     (stdio transport)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { search, getPage, listPages, corpus, type Hit } from '../../lib/ask-aura/retrieve'

const ROOT = process.cwd()

/* Bounded everywhere: a tool that can be asked for the whole corpus is
   a tool that can be used to exfiltrate it in one call. */
const MAX_LIMIT = 10
const MAX_QUERY = 400

const server = new McpServer({
  name: 'aura-knowledge',
  version: '1.0.0',
})

/** Provenance shape shared by every retrieval result. */
function cite(h: Hit) {
  return {
    sourceId: h.chunk.id,
    title: h.chunk.title,
    sectionPath: h.chunk.sectionPath,
    canonicalUrl: h.chunk.url,
    sourceType: h.chunk.sourceType,
    namespace: h.chunk.namespace,
    retrievedAt: h.chunk.retrievedAt ?? null,
    publishedAt: h.chunk.publishedAt ?? null,
    confidence: h.confidence,
    passage: h.passage,
  }
}

const ok = (data: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
})

/* ── search_aura ──────────────────────────────────────────────────── */
server.registerTool(
  'search_aura',
  {
    title: 'Search Aura',
    description:
      'Search Aura\'s own pages and the separately-held external research. Returns passages with provenance. ' +
      'Aura-authored content is authoritative about Aura; external sources may only explain or qualify.',
    inputSchema: {
      query: z.string().min(1).max(MAX_QUERY).describe('What to look for'),
      page_context: z.string().url().optional().describe('Canonical URL of the page in view; nudges relevance'),
      source_types: z.array(z.enum(['aura', 'external'])).max(2).optional().describe('Namespaces to search'),
      limit: z.number().int().min(1).max(MAX_LIMIT).optional(),
    },
  },
  async ({ query, page_context, source_types, limit }) => {
    const hits = await search(query, {
      limit: limit ?? 6,
      namespaces: source_types ?? ['aura', 'external'],
      pageUrl: page_context,
    })
    return ok({ query, count: hits.length, results: hits.map(cite) })
  },
)

/* ── get_aura_page ────────────────────────────────────────────────── */
server.registerTool(
  'get_aura_page',
  {
    title: 'Get an Aura page',
    description: 'Every section of one page, in document order, by canonical URL or document id.',
    inputSchema: {
      canonical_url_or_id: z.string().min(1).max(300),
    },
  },
  async ({ canonical_url_or_id }) => {
    const chunks = await getPage(canonical_url_or_id)
    if (!chunks.length) return ok({ found: false, id: canonical_url_or_id })
    return ok({
      found: true,
      id: chunks[0].docId,
      title: chunks[0].title,
      canonicalUrl: chunks[0].url,
      retrievedAt: chunks[0].retrievedAt ?? null,
      sections: chunks.map((c) => ({
        sourceId: c.id, heading: c.heading, sectionPath: c.sectionPath, text: c.text,
      })),
    })
  },
)

/* ── list_aura_topics ─────────────────────────────────────────────── */
server.registerTool(
  'list_aura_topics',
  {
    title: 'List Aura topics',
    description: 'The topic index: every page in the corpus with its section count.',
    inputSchema: {},
  },
  async () => {
    const pages = await listPages()
    const c = await corpus()
    return ok({ builtAt: c.builtAt, counts: c.counts, topics: pages })
  },
)

/* ── get_aura_topic ───────────────────────────────────────────────── */
server.registerTool(
  'get_aura_topic',
  {
    title: 'Get an Aura topic',
    description: 'One topic by id, with its sections. Topic ids come from list_aura_topics.',
    inputSchema: { topic_id: z.string().min(1).max(120) },
  },
  async ({ topic_id }) => {
    const chunks = await getPage(topic_id)
    if (!chunks.length) return ok({ found: false, topic_id })
    return ok({
      found: true,
      topic_id,
      title: chunks[0].title,
      canonicalUrl: chunks[0].url,
      sections: chunks.map((c) => ({ sourceId: c.id, heading: c.heading, text: c.text })),
    })
  },
)

/* ── get_source ───────────────────────────────────────────────────── */
server.registerTool(
  'get_source',
  {
    title: 'Get a source',
    description: 'One chunk by source id, with full provenance. Use to verify a citation.',
    inputSchema: { source_id: z.string().min(1).max(200) },
  },
  async ({ source_id }) => {
    const c = await corpus()
    const chunk = c.chunks.find((x) => x.id === source_id)
    if (!chunk) return ok({ found: false, source_id })
    return ok({
      found: true,
      sourceId: chunk.id,
      title: chunk.title,
      sectionPath: chunk.sectionPath,
      canonicalUrl: chunk.url,
      sourceType: chunk.sourceType,
      namespace: chunk.namespace,
      retrievedAt: chunk.retrievedAt ?? null,
      contentHash: chunk.hash,
      text: chunk.text,
    })
  },
)

/* ── suggest_questions ────────────────────────────────────────────── */
server.registerTool(
  'suggest_questions',
  {
    title: 'Suggest questions',
    description:
      'Questions worth asking from a given page, derived from the sections that page actually contains. ' +
      'Deterministic — no model call.',
    inputSchema: {
      page_context: z.string().min(1).max(300).describe('Canonical URL or document id'),
      limit: z.number().int().min(1).max(6).optional(),
    },
  },
  async ({ page_context, limit }) => {
    const chunks = await getPage(page_context)
    const headings = [...new Set(chunks.map((c) => c.heading).filter(Boolean))]
      .filter((h) => h !== 'Glossary' && h !== 'Images')
      .slice(0, limit ?? 3)
    return ok({
      page: page_context,
      suggestions: headings.map((h) => ({
        label: h.replace(/\.$/, ''),
        intent: h.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40),
      })),
    })
  },
)

/* ── resources ────────────────────────────────────────────────────────
   The prompt and the source policy are exposed read-only so a client
   can see the rules the answers are held to. Nothing here is writable
   and nothing reaches outside these two files. */
/* The prompt itself is not published here. Auditing which rules an
   answer was held to needs the version and a hash to compare against —
   not the text, which the assistant is under standing instruction never
   to reveal. Handing it out through a side door would make that
   instruction a formality. */
server.registerResource(
  'policy-version',
  'aura://policy/version',
  {
    title: 'Aura conversation policy — version',
    description: 'Identifies the prompt an answer was produced under: id, version, and content hash.',
    mimeType: 'application/json',
  },
  async (uri) => {
    const raw = await readFile(path.join(ROOT, 'prompts', 'ask-aura', 'system.v1.md'), 'utf8')
    const front = /^---\n([\s\S]*?)\n---/.exec(raw)?.[1] ?? ''
    const field = (k: string) => new RegExp(`^${k}:\\s*(.+)$`, 'm').exec(front)?.[1]?.trim() ?? null
    return {
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({
          id: field('id'),
          version: field('version'),
          updated: field('updated'),
          owner: field('owner'),
          sha256: createHash('sha256').update(raw).digest('hex'),
          note: 'The prompt text is deliberately not exposed. Compare the hash to audit which policy was in force.',
        }, null, 2),
      }],
    }
  },
)

server.registerResource(
  'topic-index',
  'aura://index/topics',
  {
    title: 'Topic index',
    description: 'Every page in the corpus, with counts and build time.',
    mimeType: 'application/json',
  },
  async (uri) => {
    const c = await corpus()
    return {
      contents: [{
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify({ builtAt: c.builtAt, counts: c.counts, topics: await listPages() }, null, 2),
      }],
    }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
