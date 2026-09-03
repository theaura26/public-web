/* Load .env.local the way `next dev` does.
 *
 * Ingestion builds the semantic half of retrieval, and it reads
 * OPENAI_API_KEY straight off process.env. Run with plain `node`, which
 * loads no env file, the key was never there, so every corpus this
 * script has ever written took the lexical-only branch. The line saying
 * so scrolls past in a wall of build output.
 *
 * The site's retrieval fuses BM25 with cosine over those vectors. With
 * none present, RRF fuses one list, which is that list unchanged — the
 * hybrid was half-built the whole time.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

export function loadEnvLocal() {
  let raw = ''
  try { raw = readFileSync(path.join(process.cwd(), '.env.local'), 'utf8') } catch { return }
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (!m || process.env[m[1]]) continue
    process.env[m[1]] = m[2].trim().replace(/^["'](.*)["']$/, '$1')
  }
}
