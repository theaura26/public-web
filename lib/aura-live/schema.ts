/* AURA Live — the contracts.
 *
 * Two of them. The gateway's shape, which we do not control and therefore
 * validate on every response; and the feed entry, which we do control and
 * validate on the way into storage so a bad pipeline run cannot poison
 * the page.
 *
 * The gateway schemas are deliberately permissive about fields the
 * OpenAPI document marks required but which the live service sometimes
 * omits — a missing `summary` should degrade one card, not 500 the feed.
 * They are strict about the fields the editorial policy depends on:
 * canonical_key, actuality, confidence, review status.
 */

import { z } from 'zod'
import { FEED_CATEGORIES } from './taxonomy'

/* ── Gateway ─────────────────────────────────────────────────────────── */

export const ProvenanceSchema = z.object({
  sourceFileId: z.string().nullish(),
  sourcePath: z.string().nullish(),
  sourceKey: z.string().nullish(),
  sourceTab: z.string().nullish(),
  sourceRow: z.number().nullish(),
  sourceTier: z.number().nullish(),
  sourceModifiedTime: z.string().nullish(),
  syncedAt: z.string().nullish(),
  confidence: z.number().nullish(),
  reviewStatus: z.string().nullish(),
  actuality: z.string().nullish(),
})

export const GatewayMediaSchema = z.object({
  source_file_id: z.string(),
  source_path: z.string().nullish(),
  caption: z.string().nullish(),
  speciesName: z.string().nullish(),
  observationDate: z.string().nullish(),
  observed_at: z.string().nullish(),
  location: z.string().nullish(),
  category: z.string().nullish(),
  mediaType: z.enum(['image', 'video']),
  contentUrl: z.string(),
  imageUrl: z.string(),
  thumbnailUrl: z.string(),
  posterUrl: z.string().nullish(),
  width: z.number().nullish(),
  height: z.number().nullish(),
  visible: z.boolean().nullish(),
  review_status: z.string().nullish(),
  confidence: z.number().nullish(),
  entity_ids: z.array(z.string()).nullish(),
  metadata: z.record(z.string(), z.unknown()).nullish(),
  provenance: ProvenanceSchema.nullish(),
  warnings: z.array(z.string()).nullish(),
})
export type GatewayMedia = z.infer<typeof GatewayMediaSchema>

export const GatewayRecordSchema = z.object({
  canonical_key: z.string(),
  record_type: z.string(),
  category: z.string(),
  title: z.string(),
  summary: z.string().nullish(),
  actuality: z.string(),
  resultKind: z.string().nullish(),
  occurred_at: z.string().nullish(),
  entity_ids: z.array(z.string()).nullish(),
  facts: z.record(z.string(), z.unknown()).default({}),
  search_text: z.string().nullish(),
  source_key: z.string().nullish(),
  source_file_id: z.string().nullish(),
  source_row: z.number().nullish(),
  confidence: z.number().nullish(),
  review_status: z.string().nullish(),
  first_seen_at: z.string().nullish(),
  updated_at: z.string().nullish(),
  provenance: ProvenanceSchema.nullish(),
  warnings: z.array(z.string()).default([]),
  media: z.array(GatewayMediaSchema).nullish(),
})
export type GatewayRecord = z.infer<typeof GatewayRecordSchema>

export const FreshnessSchema = z.object({
  lastSuccessfulSyncAt: z.string().nullish(),
  lastAttemptAt: z.string().nullish(),
  stale: z.boolean().nullish(),
  currentRunId: z.string().nullish(),
  lastSuccessfulRunId: z.string().nullish(),
})
export type Freshness = z.infer<typeof FreshnessSchema>

export const MetaSchema = z
  .object({
    freshness: FreshnessSchema.nullish(),
    readOnlySource: z.boolean().nullish(),
    dataWarnings: z.array(z.string()).nullish(),
  })
  .loose()

export const RecordEnvelopeSchema = z.object({
  data: z.object({
    total: z.number().nullish(),
    items: z.array(GatewayRecordSchema).default([]),
    warnings: z.array(z.string()).nullish(),
  }),
  ui: z.unknown().nullish(),
  meta: MetaSchema.nullish(),
})

export const RecordDetailEnvelopeSchema = z.object({
  data: GatewayRecordSchema,
  ui: z.unknown().nullish(),
  meta: MetaSchema.nullish(),
})

export const MediaEnvelopeSchema = z.object({
  data: z.object({
    total: z.number().nullish(),
    items: z.array(GatewayMediaSchema).default([]),
  }),
  ui: z.unknown().nullish(),
  meta: MetaSchema.nullish(),
})

export const StatusEnvelopeSchema = z.object({
  data: z
    .object({
      state: z
        .object({
          last_success_at: z.string().nullish(),
          last_attempt_at: z.string().nullish(),
          last_error: z.string().nullish(),
        })
        .loose()
        .nullish(),
      lastSuccessfulRun: z
        .object({
          id: z.string().nullish(),
          status: z.string().nullish(),
          completed_at: z.string().nullish(),
          record_count: z.number().nullish(),
          media_count: z.number().nullish(),
          /* A content hash of everything the gateway read. Unchanged
             means provably nothing new upstream — the cheapest possible
             answer to "is there anything to do?". */
          source_revision: z.string().nullish(),
        })
        .loose()
        .nullish(),
    })
    .loose(),
  ui: z.unknown().nullish(),
  meta: MetaSchema.nullish(),
})

/* ── The feed entry ──────────────────────────────────────────────────── */

export const FeedMediaSchema = z.object({
  type: z.enum(['image', 'video', 'editorial_thumbnail']),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  posterUrl: z.string().optional(),
  alt: z.string().min(1),
  credit: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  /** Aspect ratio as width/height, for reserving layout space. */
  ratio: z.number().optional(),
  /** True when the picture is archive imagery rather than evidence of
      this event. Drives the reader-facing disclosure; never omitted. */
  isEditorialImagery: z.boolean(),
})
export type FeedMedia = z.infer<typeof FeedMediaSchema>

export const AuraFeedEntrySchema = z.object({
  id: z.string().min(1),
  canonicalKey: z.string().min(1),
  /** Every key that contributed, so a merged card stays traceable. */
  contributingKeys: z.array(z.string()).default([]),
  estate: z.literal('mudigere'),
  category: z.enum(FEED_CATEGORIES),
  headline: z.string().min(1),
  /* Optional, and that is the point: a terse field line that already
     says everything is better published as a headline alone than padded
     out with a sentence restating that it was recorded. */
  body: z.string().optional(),
  significance: z.string().optional(),
  /* Everything the estate recorded that did not fit in two lines: who
     did it, how, on which crop. Verbatim evidence, shown in the panel
     rather than on the card. */
  details: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  actor: z
    .object({
      label: z.string().min(1),
      type: z.enum(['person', 'team', 'species', 'animal', 'natural_process']),
    })
    .optional(),
  location: z
    .object({ label: z.string().min(1), block: z.string().optional(), zone: z.string().optional() })
    .optional(),
  occurredAt: z.string().optional(),
  occurredOn: z.string(),
  timePrecision: z.enum(['exact', 'window', 'date']),
  timeWindow: z.string().optional(),
  publishedAt: z.string(),
  /** Set when a correction rewrote the copy. Never resets publishedAt. */
  updatedAt: z.string().optional(),
  media: z.array(FeedMediaSchema).default([]),
  evidence: z.object({
    actuality: z.string(),
    confidence: z.number().optional(),
    reviewStatus: z.string().optional(),
    syncedAt: z.string().optional(),
    warnings: z.array(z.string()).default([]),
    /* Reader-facing provenance: which of the estate's books this came
       out of, and how many lines of it. Named in English, never as a
       path, a file id or a row number. */
    source: z.string().optional(),
    records: z.number().optional(),
  }),
  editorial: z.object({
    score: z.number(),
    reasons: z.array(z.string()).default([]),
    templateId: z.string().optional(),
    generatedBy: z.enum(['deterministic', 'llm_reviewed']),
    generatorVersion: z.string().optional(),
  }),
})
export type AuraFeedEntry = z.infer<typeof AuraFeedEntrySchema>

/* ── What the store holds ────────────────────────────────────────────── */

export const AuditRecordSchema = z.object({
  at: z.string(),
  canonicalKey: z.string(),
  contributingKeys: z.array(z.string()).default([]),
  outcome: z.enum(['accepted', 'rejected', 'merged', 'updated', 'deferred', 'unchanged']),
  reasons: z.array(z.string()).default([]),
  score: z.number().optional(),
  generatorVersion: z.string(),
})
export type AuditRecord = z.infer<typeof AuditRecordSchema>

export const FeedDocumentSchema = z.object({
  version: z.literal(1),
  /** Newest source `updated_at` a completed run has processed. */
  watermark: z.string().nullable().default(null),
  /** The gateway's content hash as of the last completed discovery. When
      it has not moved, a run can exit after one request. */
  sourceRevision: z.string().nullable().default(null),
  lastRunAt: z.string().nullable().default(null),
  entries: z.array(AuraFeedEntrySchema).default([]),
  /* Every canonical key this feed has ever published, including the ones
     whose cards have since fallen off the end of `entries`.

     Without it, "have we published this?" was asked of `entries` alone —
     and `entries` is trimmed to the page length on every commit. Anything
     trimmed was forgotten, rediscovered on the next run and published
     again with a fresh timestamp, for ever. A drain run made it plain:
     172 records republished on a second pass with nothing new upstream.

     Keys, not entries, because that is all the question needs. Sixty
     entries weigh 369 KB; sixty keys weigh four. */
  publishedKeys: z.array(z.string()).default([]),
  audit: z.array(AuditRecordSchema).default([]),
})
export type FeedDocument = z.infer<typeof FeedDocumentSchema>

export const EMPTY_DOCUMENT: FeedDocument = {
  version: 1,
  watermark: null,
  sourceRevision: null,
  lastRunAt: null,
  entries: [],
  publishedKeys: [],
  audit: [],
}
