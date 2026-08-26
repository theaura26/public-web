import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { search, type Hit } from '@/lib/ask-aura/retrieve'
import {
  screen, fenceContext, isCitableSource, LIMITS,
  type PageContext, type Turn,
} from '@/lib/ask-aura/safety'
import { insight } from '@/lib/ask-aura/privacy'

/* Ask Aura — the answer service.
 *
 * Same-origin only. Everything that can be refused without a model call
 * is refused in lib/ask-aura/safety before we get here. Retrieval runs
 * before any Aura-specific claim, and the passages are fenced as
 * reference material so a sentence inside a page cannot become an
 * instruction.
 *
 * Streams SSE: `token` for prose as it arrives, one `meta` frame with
 * citations and follow-ups, then `done`.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* Generous for a question, far below anything that could be used to
   make the server do work on an attacker's behalf. */
const MAX_BODY_BYTES = 32 * 1024

const CHAT_MODEL = 'gpt-4.1'
const SUGGEST_MODEL = 'gpt-4.1-nano'

/* The prompt is a file so that changing how the host speaks is an
   editorial act, not a deploy.
   Cached for the life of the process in production, and deliberately not
   cached in development: editing the prompt and seeing no change is a
   trap worth an hour of anyone's afternoon, and the read is a few
   kilobytes off local disk. */
let promptCache: string | null = null
async function systemPrompt(): Promise<string> {
  if (promptCache && process.env.NODE_ENV === 'production') return promptCache
  promptCache = await readFile(
    path.join(process.cwd(), 'prompts', 'ask-aura', 'system.v1.md'),
    'utf8',
  )
  return promptCache
}

/* Origins this endpoint will answer for. The host header alone is not a
   trust anchor — it is whatever the caller wrote — so production and
   staging are named, and localhost is admitted only in development. */
function allowedOrigins(): Set<string> {
  const set = new Set(['https://theaura.life', 'https://www.theaura.life'])
  const extra = process.env.ASK_AURA_ALLOWED_ORIGINS
  if (extra) for (const o of extra.split(',')) set.add(o.trim().replace(/\/$/, ''))
  /* Vercel names the deployment it is serving; a preview build should
     answer for itself without the list having to know its URL. */
  if (process.env.VERCEL_URL) set.add(`https://${process.env.VERCEL_URL}`)
  if (process.env.NODE_ENV !== 'production') {
    set.add('http://localhost:3000')
    set.add('http://127.0.0.1:3000')
  }
  return set
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')

  if (origin) {
    try {
      return allowedOrigins().has(new URL(origin).origin)
    } catch {
      return false
    }
  }

  /* Absence is not proof of anything on its own — but a browser that
     omits Origin on a same-origin fetch still sends Sec-Fetch-Site, and
     a script forging one from elsewhere cannot set it. Anything with
     neither header is not a page on this site, so it does not get an
     answer. */
  return req.headers.get('sec-fetch-site') === 'same-origin'
}

/** Coarse per-session key. Not identity — just something to rate-limit. */
function sessionKey(req: Request, body: Record<string, unknown>): string {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'local'
  const sid = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : ''
  return `${ip}:${sid}`
}

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

/** A fixed reply, delivered down the same channel the UI already reads. */
function refusalStream(reply: string, kind: string, question = '') {
  /* Even a refusal is worth counting: a run of high-stakes questions is
     a thing Aura would want to know about. The labels go out; the words
     that triggered them do not. */
  const analytics = question ? insight(question, [], { refusal: kind }) : undefined
  const body = new ReadableStream({
    start(c) {
      const enc = new TextEncoder()
      c.enqueue(enc.encode(sse('token', { t: reply })))
      c.enqueue(enc.encode(sse('meta', {
        suggestions: [],
        citations: [],
        confidence: 'high',
        refusal: kind,
        ...(analytics ? { insight: analytics } : {}),
      })))
      c.enqueue(enc.encode(sse('done', {})))
      c.close()
    },
  })
  return new Response(body, { headers: SSE_HEADERS })
}

const SSE_HEADERS = {
  'content-type': 'text/event-stream; charset=utf-8',
  'cache-control': 'no-cache, no-transform',
  connection: 'keep-alive',
  'x-accel-buffering': 'no',
} as const

/** What the model is shown about where the reader is standing. */
function contextBlock(page: PageContext): string {
  const bits = [
    page.title && `Page: ${page.title}`,
    page.url && `URL: ${page.url}`,
    page.sectionTitle && `Section in view: ${page.sectionTitle}`,
    page.topics?.length && `Topics: ${page.topics.join(', ')}`,
    page.selection && `The reader highlighted: "${page.selection}"`,
  ].filter(Boolean)
  if (!bits.length) return ''
  return fenceContext('PAGE CONTEXT', bits.join('\n'))
}

function sourcesBlock(hits: Hit[]): string {
  if (!hits.length) {
    return fenceContext(
      'SOURCES',
      'Nothing in the Aura corpus matched this question. Say so plainly rather than answering from general knowledge.',
    )
  }
  const body = hits
    .map((h, i) =>
      [
        `[${i + 1}] ${h.chunk.sectionPath}`,
        `    url: ${h.chunk.url}`,
        `    type: ${h.chunk.sourceType}`,
        `    ${h.chunk.text}`,
      ].join('\n'),
    )
    .join('\n\n')
  return fenceContext('SOURCES', body)
}

/* Follow-ups used to be written from the answer alone, which let them
   invent the premise of the next question: reading an answer that
   mentions tea in organic transition, organic sprays for the herd and
   soil organic carbon, a model cheerfully offered "What makes your
   coffee organic?" — and nothing on any Aura page says the coffee is
   organic. A question is a claim in disguise; asked from the dock it
   reads as something Aura has said about itself.

   So they are grounded in the same passages the answer was, and told
   plainly that a question may not assert a property. */
async function followUps(
  question: string, answer: string, hits: Hit[], key: string, signal: AbortSignal,
): Promise<Array<{ label: string; intent: string }>> {
  const covered = [...new Set(hits.map((h) => h.chunk.sectionPath))].slice(0, 8)
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      signal,
      body: JSON.stringify({
        model: SUGGEST_MODEL,
        temperature: 0.6,
        max_tokens: 160,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You write follow-up questions a curious visitor to a regenerative coffee estate might ask next. ' +
              'Return JSON: {"suggestions":[{"label":"...","intent":"..."}]}. Two or three. ' +
              'Each must open a NEW subject, never restate what was just answered. ' +
              'Each is a QUESTION someone would actually say out loud, ending in a question mark. ' +
              'Never a command or a topic label: "How is the pepper dried?" is right; ' +
              '"Learn about the pepper" and "Explore drying methods" are wrong. ' +
              'Never begin with Learn, Explore, Discover, Dive or Uncover. ' +
              'Seven words or fewer, sentence case, British English.\n\n' +
              'GROUNDING, and this matters more than phrasing: ask only about subjects named ' +
              'in the SOURCES SEEN below or in the answer itself. A question must not assert ' +
              'or assume a property, certification, claim or outcome — "What makes your coffee ' +
              'organic?" states that the coffee is organic, and asking it puts words in Aura\'s ' +
              'mouth. Ask "Is the coffee certified?" instead of "Why is the coffee certified?". ' +
              'When in doubt, ask about a thing rather than about a quality of a thing.',
          },
          {
            role: 'user',
            content:
              `SOURCES SEEN:\n${covered.join('\n') || '(none)'}\n\n` +
              `They asked: ${question}\n\nThey were told: ${answer.slice(0, 1200)}`,
          },
        ],
      }),
    })
    if (!res.ok) return []
    const json = await res.json()
    const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? '{}')
    return (parsed.suggestions ?? [])
      .slice(0, 3)
      .filter((s: unknown): s is { label: string; intent: string } =>
        Boolean(s && typeof (s as { label?: unknown }).label === 'string'))
      .map((s: { label: string; intent?: string }) => ({
        label: s.label.slice(0, 60),
        intent: (s.intent ?? 'follow_up').slice(0, 40),
      }))
  } catch {
    return []
  }
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID()

  if (!sameOrigin(req)) {
    return NextResponse.json({ error: 'Cross-origin requests are not accepted.' }, { status: 403 })
  }

  /* Refuse on the declared size before reading a byte. Parsing first and
     checking the fields afterwards means the allocation has already
     happened — the limit has to come before `json()`, not inside it. */
  const declared = Number(req.headers.get('content-length') ?? '0')
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'That request is too large.' }, { status: 413 })
  }

  let body: Record<string, unknown>
  try {
    const raw = await req.text()
    /* A caller may lie about content-length, or omit it under chunked
       transfer, so the real length is checked too. */
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'That request is too large.' }, { status: 413 })
    }
    body = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const verdict = screen(body, sessionKey(req, body))
  if (!verdict.ok) {
    return refusalStream(verdict.reply, verdict.kind, typeof body.message === 'string' ? body.message : '')
  }

  const key = process.env.OPENAI_API_KEY
  if (!key) {
    return refusalStream(
      'Ask Aura is not switched on yet. In the meantime the estate pages themselves are the best source, and the contact form reaches a person.',
      'not_configured',
    )
  }

  const { message, history, page } = verdict

  /* Retrieve before any Aura-specific claim. Both namespaces: external
     research may only explain, and the prompt enforces that. */
  let hits: Hit[] = []
  try {
    hits = await search(message, { limit: 6, pageUrl: page.url, signal: req.signal })
  } catch {
    /* Retrieval failure is not licence to invent — and telling the model
       to admit it is not enforcement. With no sources there is nothing
       to ground an answer in, so no answer gets generated. */
    return refusalStream(
      'I could not reach my sources just then, and I would rather say so than answer from memory. Try again in a moment — the estate pages themselves are the better read anyway.',
      'retrieval_unavailable',
    )
  }

  const system = await systemPrompt()

  /* Only the prompt is a system message. Page context and retrieved
     passages are shaped by whoever wrote the page and by whoever is
     reading it, and a string an outsider controls does not belong in the
     role the model treats as authoritative. They go in as user turns,
     fenced and labelled as reference material. */
  const reference = [contextBlock(page), sourcesBlock(hits)].filter(Boolean).join('\n\n')

  const messages = [
    { role: 'system' as const, content: system },
    ...history.map((t: Turn) => ({ role: t.role, content: t.content })),
    { role: 'user' as const, content: `${reference}\n\nMy question: ${message}` },
  ]

  const enc = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let answer = ''
      try {
        const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
          signal: req.signal,
          body: JSON.stringify({
            model: CHAT_MODEL,
            /* Low, and deliberately so. Warmth here comes from the prompt
               and from the source material, not from sampling: every
               degree of temperature is another chance the model reaches
               past the passages it was given for a fact it half-recalls.
               The evaluation suite catches those, and at 0.4 it caught
               different ones on every run. */
            temperature: 0.2,
            max_tokens: 700,
            stream: true,
            messages,
          }),
        })

        if (!upstream.ok || !upstream.body) {
          controller.enqueue(enc.encode(sse('token', {
            t: 'I could not reach my sources just then. Try again in a moment — or the estate pages themselves are the better read anyway.',
          })))
          controller.enqueue(enc.encode(sse('meta', {
            suggestions: [], citations: [], confidence: 'low', error: 'upstream',
          })))
          controller.enqueue(enc.encode(sse('done', {})))
          controller.close()
          return
        }

        const reader = upstream.body.getReader()
        const dec = new TextDecoder()
        let buf = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buf += dec.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const payload = line.slice(6).trim()
            if (payload === '[DONE]') continue
            try {
              const delta = JSON.parse(payload).choices?.[0]?.delta?.content
              if (delta) {
                answer += delta
                controller.enqueue(enc.encode(sse('token', { t: delta })))
              }
            } catch { /* keep-alive or partial frame */ }
          }
        }

        /* Citations are the sources actually put in front of the model,
           filtered to links the site is willing to point at. */
        /* One citation per page, best-ranked chunk wins. Four rows all
           reading the same page title is noise, not provenance — the
           chunk-level detail stays in the trace. */
        const seenPages = new Set<string>()
        const citations = hits
          .filter((h) => isCitableSource(h.chunk.url))
          .filter((h) => !seenPages.has(h.chunk.url) && seenPages.add(h.chunk.url))
          .slice(0, 3)
          .map((h) => ({
            sourceId: h.chunk.id,
            title: h.chunk.sectionPath,
            url: h.chunk.url,
            sourceType: h.chunk.sourceType,
            image: h.chunk.image ?? '',
            /* The page's own name, without the section and without the
               "— Aura" suffix: a card wants a title, not a breadcrumb. */
            page: h.chunk.title.split(' — ')[0].split(' › ')[0],
          }))

        const suggestions = await followUps(message, answer, hits, key, req.signal)
        const best = hits[0]?.confidence ?? 'low'

        /* The evidence actually put in front of the model, echoed back
           for the evaluation harness so a judge can check the answer
           against its sources rather than guessing from tone. Off unless
           explicitly switched on: visitors have no use for it, and it
           would double the size of every response. */
        const trace = process.env.ASK_AURA_EVAL_TRACE === '1'
          ? hits.map((h) => ({ sectionPath: h.chunk.sectionPath, url: h.chunk.url, text: h.chunk.text }))
          : undefined

        /* Classified here, not in the browser: this is the only place
           that knows which passages actually answered the question, and
           the topic labels are worth more when they come from what was
           retrieved than from what was typed. */
        controller.enqueue(enc.encode(sse('meta', {
            suggestions,
          citations,
          confidence: hits.length ? best : 'low',
          requestId,
          insight: insight(message, hits, { answer }),
          ...(trace ? { trace } : {}),
        })))
        controller.enqueue(enc.encode(sse('done', {})))
      } catch (err) {
        /* An aborted request is the visitor pressing stop, not a fault. */
        if ((err as Error)?.name !== 'AbortError') {
          controller.enqueue(enc.encode(sse('error', { message: 'Something went wrong.' })))
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers: { ...SSE_HEADERS, 'x-request-id': requestId } })
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.OPENAI_API_KEY),
    limits: { message: LIMITS.message, perMinute: LIMITS.requestsPerWindow },
  })
}
