/* Load .env.local the way `next dev` does.
 *
 * Worth saying why this file exists. Retrieval is two rankers fused —
 * BM25 over the text, and cosine over embeddings — and `embedQuery`
 * returns null rather than throwing when OPENAI_API_KEY is absent. Run
 * under plain tsx, which loads no env file, the semantic half was
 * therefore switched off and RRF fused a single list, which is just that
 * list in its original order. The suite scored the degraded path and
 * called it a pass, so a real regression in semantic ranking could not
 * have failed it. Two questions it reported as weak answer correctly in
 * production for exactly this reason.
 *
 * Absent a key the suite now stops rather than scoring something the
 * site never runs. */
import { readFileSync } from 'node:fs'
import path from 'node:path'

export function loadEnvLocal(): void {
  const file = path.join(process.cwd(), '.env.local')
  let raw = ''
  try { raw = readFileSync(file, 'utf8') } catch { return }
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (!m) continue
    const key = m[1]
    if (process.env[key]) continue
    process.env[key] = m[2].trim().replace(/^["'](.*)["']$/, '$1')
  }
}

export function requireEmbeddings(): void {
  loadEnvLocal()
  if (process.env.OPENAI_API_KEY) return
  console.error(
    '\n  OPENAI_API_KEY is not set.\n' +
    '  Retrieval would fall back to lexical-only ranking, which is not what\n' +
    '  the site runs — a pass here would mean nothing. Set it in .env.local.\n',
  )
  process.exit(1)
}
