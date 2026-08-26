/* Ask Aura — what this visitor keeps coming back to.
 *
 * The first step of personalisation, and the only one that needs no
 * privacy decision at all: the tally lives in the visitor's own browser
 * and never leaves it. No profile, no identifier, no request. If they
 * clear their site data it is gone, which is the correct behaviour for a
 * record of someone's curiosity.
 *
 * It is deliberately small. Counting how often a topic comes up is
 * enough to put the right question at the top of a list of three; it is
 * not enough, and is not intended, to model anybody.
 */

const KEY = 'aura:ask:affinity:v1'
const MAX_TOPICS = 24
/* Old interest should fade rather than accumulate forever: someone who
   read about coffee in March and the residency all week is interested in
   the residency. Applied on write, so it costs nothing to read. */
const HALF_LIFE_DAYS = 30

type Store = {
  v: 1
  at: number
  topics: Record<string, number>
  intents: Record<string, number>
}

const empty = (): Store => ({ v: 1, at: Date.now(), topics: {}, intents: {} })

function read(): Store {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as Store
    if (parsed?.v !== 1 || typeof parsed.at !== 'number') return empty()
    return {
      v: 1,
      at: parsed.at,
      topics: parsed.topics ?? {},
      intents: parsed.intents ?? {},
    }
  } catch {
    return empty()
  }
}

function decay(store: Store, now: number): Store {
  const elapsedDays = (now - store.at) / 86_400_000
  if (elapsedDays <= 0) return store
  const factor = Math.pow(0.5, elapsedDays / HALF_LIFE_DAYS)
  const fade = (counts: Record<string, number>) => {
    const out: Record<string, number> = {}
    for (const [k, v] of Object.entries(counts)) {
      const faded = v * factor
      /* Below this a topic is noise from months ago. Dropping it keeps
         the store small without anyone having to prune it. */
      if (faded >= 0.05) out[k] = Number(faded.toFixed(4))
    }
    return out
  }
  return { v: 1, at: now, topics: fade(store.topics), intents: fade(store.intents) }
}

/**
 * Record one answered question. Takes the same labels the server already
 * computes for analytics — no second classification, and nothing here
 * that is not already known.
 */
export function remember(labels: { topics?: string[]; intent?: string }): void {
  if (typeof window === 'undefined') return
  try {
    const now = Date.now()
    const store = decay(read(), now)
    for (const t of labels.topics ?? []) {
      store.topics[t] = (store.topics[t] ?? 0) + 1
    }
    if (labels.intent && labels.intent !== 'other') {
      store.intents[labels.intent] = (store.intents[labels.intent] ?? 0) + 1
    }
    /* Keep the strongest few. A visitor with two hundred topics has no
       affinity worth acting on. */
    const trim = (counts: Record<string, number>) =>
      Object.fromEntries(
        Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, MAX_TOPICS),
      )
    store.topics = trim(store.topics)
    store.intents = trim(store.intents)
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* Private mode, quota, disabled storage — personalisation is a
       courtesy, and its absence must never break a conversation. */
  }
}

/** The topics this visitor has returned to, strongest first. */
export function affinities(): string[] {
  const store = decay(read(), Date.now())
  return Object.entries(store.topics)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic)
}

/**
 * Order suggestions so that anything touching a topic this visitor keeps
 * returning to comes first. A stable sort, so suggestions the model
 * ranked equally keep the order it gave them — this nudges, it does not
 * reorder wholesale.
 */
export function preferred<T extends { label: string; intent?: string }>(
  suggestions: T[],
): T[] {
  const ranked = affinities()
  if (!ranked.length || suggestions.length < 2) return suggestions

  const weight = (s: T) => {
    const hay = `${s.label} ${s.intent ?? ''}`.toLowerCase()
    for (let i = 0; i < ranked.length; i++) {
      /* Topic ids are page slugs — "living-systems", "malnad-gidda" —
         so each word is matched separately against the suggestion. */
      const words = ranked[i].split('-').filter((w) => w.length > 3)
      if (words.some((w) => hay.includes(w))) return ranked.length - i
    }
    return 0
  }

  return suggestions
    .map((s, i) => ({ s, i, w: weight(s) }))
    .sort((a, b) => b.w - a.w || a.i - b.i)
    .map(({ s }) => s)
}

/** For a "forget me" control, and for tests. */
export function forget(): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(KEY) } catch { /* nothing to do */ }
}
