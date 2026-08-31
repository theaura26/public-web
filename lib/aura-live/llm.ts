/* AURA Live — the optional writer.
 *
 * Off by default. The feed is complete without it: deterministic
 * templates write every card, and this stage only ever tries to say the
 * same facts more naturally.
 *
 * The division of labour is the whole design. The model is given a
 * normalised evidence object and nothing else — no gateway response, no
 * `facts` blob, no site copy, no earlier cards. It cannot fetch. It is
 * told what it may not do, but that instruction is not the control: the
 * control is that whatever it returns goes through the same claim check
 * as a template, and anything containing a number, a name or a place that
 * is not in the evidence is discarded and the template is used instead.
 *
 * So the model decides phrasing. It never decides truth, and it never
 * decides whether something is published.
 */

import type { MergedCandidate } from './merge'
import type { Copy } from './copy'
import { verifyCopy } from './verify'
import { calendarLabel } from './time'
import type { AuraLiveConfig } from './config'

/** Exactly what the model is allowed to know about the event. */
export function evidenceObject(c: MergedCandidate) {
  return {
    category: c.category,
    subject: c.subject,
    description: c.description ?? null,
    note: c.note ?? null,
    actor: c.actor ?? null,
    location: c.location ? { label: c.location.label, block: c.location.block ?? null } : null,
    when: {
      day: calendarLabel(c.time.occurredOn),
      precision: c.time.precision,
      timeWindow: c.time.timeWindow ?? null,
    },
    quantities: c.quantities,
    area: c.area ? `${c.area} acres` : null,
    method: c.method ?? null,
    crop: c.crop ?? null,
    rowCount: c.rowCount,
    hasEventPhotograph: c.media.some((m) => !m.isEditorialImagery),
  }
}

const SYSTEM = `You write short entries for AURA Live, a public feed of verified events on a regenerative coffee estate at Mudigere, in the Western Ghats.

Voice: calm, observant, precise, warm, quietly confident. The land speaking through evidence.

Rules, in order of importance:
1. Use ONLY the values in the evidence object. Every number, name, place, species, quantity and date in your output must appear in it. If a value is absent, write a shorter sentence — never a vaguer one, and never a guess.
2. Do not add ecological, scientific, health or sustainability claims. Do not call anything rare, endangered, record-breaking or unprecedented.
3. No exclamation marks. No "exciting", "amazing", "proud", "our team". Not an announcement.
4. If the evidence says precision is "date", do not state a time of day.
5. Vary the sentence shape. Do not open every entry the same way.

Return JSON only: {"headline": string, "body": string, "significance": string | null}
- headline: under 80 characters, no trailing full stop.
- body: one or two sentences saying what happened, who or what did it, and when.
- significance: one factual sentence on why it matters, or null. Prefer null over a claim you cannot support from the evidence.`

type LlmCopy = { headline: string; body: string; significance: string | null }

function parseLlmJson(raw: string): LlmCopy | null {
  try {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start < 0 || end < start) return null
    const obj = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>
    const headline = typeof obj.headline === 'string' ? obj.headline.trim() : ''
    const body = typeof obj.body === 'string' ? obj.body.trim() : ''
    if (!headline || !body) return null
    if (headline.length > 100 || body.length > 480) return null
    const significance = typeof obj.significance === 'string' && obj.significance.trim()
      ? obj.significance.trim()
      : null
    return { headline, body, significance }
  } catch {
    return null
  }
}

/**
 * Try to improve on the template. Returns the fallback unchanged on any
 * failure — no key, no network, bad JSON, or a claim that did not verify.
 * A model outage must never stop the feed or change what it says.
 */
export async function writeCopyWithModel(
  c: MergedCandidate,
  fallback: Copy,
  cfg: AuraLiveConfig,
): Promise<{ copy: Copy; generatedBy: 'deterministic' | 'llm_reviewed'; rejection?: string }> {
  if (!cfg.llmEnabled) return { copy: fallback, generatedBy: 'deterministic' }

  let raw: string
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: cfg.llmModel,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: JSON.stringify(evidenceObject(c)) },
        ],
      }),
      signal: AbortSignal.timeout(cfg.gatewayTimeoutMs),
    })
    if (!res.ok) return { copy: fallback, generatedBy: 'deterministic', rejection: `llm-http-${res.status}` }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    raw = json.choices?.[0]?.message?.content ?? ''
  } catch {
    return { copy: fallback, generatedBy: 'deterministic', rejection: 'llm-unreachable' }
  }

  const parsed = parseLlmJson(raw)
  if (!parsed) return { copy: fallback, generatedBy: 'deterministic', rejection: 'llm-bad-json' }

  const candidate: Copy = {
    headline: parsed.headline,
    body: parsed.body,
    significance: parsed.significance ?? undefined,
    templateId: `llm:${cfg.llmModel}`,
  }

  const verdict = verifyCopy(candidate, c)
  if (!verdict.ok) {
    return { copy: fallback, generatedBy: 'deterministic', rejection: `llm-unverified: ${verdict.problems.join('; ')}` }
  }
  return { copy: candidate, generatedBy: 'llm_reviewed' }
}
