import { z } from 'zod'
const date = z.iso.date()
const quantity = z.number().finite().nonnegative()
const image = z.string().regex(/^\/v1\/public\/living-index\/media\/[0-9a-f-]{36}$/i)
export const snapshotSchema = z.object({
  schemaVersion: z.literal(1), generatedAt: z.iso.datetime(), today: date,
  timezone: z.literal('Asia/Kolkata'), historyDays: z.literal(366),
  animals: z.array(z.object({
    cowId: z.string().max(100), slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(100),
    name: z.string().max(300).nullable(), sex: z.string().max(100).nullable(), breed: z.string().max(300).nullable(),
    born: date.nullable(), bornPrecision: z.enum(['date','approximate','year','month','unknown']), joined: date.nullable(),
    type: z.enum(['Cow','Bull','Bullock','Heifer','Calf','Unknown']),
    dam: z.string().nullable(), sire: z.string().nullable(), nameMeaning: z.string().max(1000).nullable(), showMilk: z.boolean(),
    images: z.object({ photo: image.optional(), green: image.optional(), tone: image.optional() }).strict(),
  }).strict()).max(10000),
  milk: z.array(z.object({ date, cowId: z.string(), litres: quantity.nullable(), recordedSessions: z.number().int().nonnegative(), missingSessions: z.number().int().nonnegative() }).strict()),
  collections: z.array(z.object({date, kind: z.enum(['dung','urine']), unit: z.enum(['kg','L']), quantity, basis: z.enum(['reported_total','components','mixed_groups'])}).strict()),
  notices: z.array(z.string()),
}).strict()
export type Snapshot = z.infer<typeof snapshotSchema>
export const REFRESH_MS = 120_000
