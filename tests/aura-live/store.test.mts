import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

/* Two reads of the private ledger went wrong in a row, and both were
   invisible from the outside because an unreadable ledger and a quiet
   estate render the same empty page.

   The first asked whether a blob had ever been written by matching the
   thrown error's message against /not found|404|BlobNotFound/, and
   @vercel/blob words it "The requested blob does not exist".

   The second fetched meta.downloadUrl, on the belief that it was a
   signed url that a private store would honour. It is not. These pin the
   fact that replaced that belief, and the shape of the read that follows
   from it. */

const SDK = readFileSync('node_modules/@vercel/blob/dist/index.js', 'utf8')
const STORE = readFileSync('lib/aura-live/store.ts', 'utf8')

test('downloadUrl is the public url with ?download=1, and carries no credentials', () => {
  /* Straight from the SDK: the only difference between url and
     downloadUrl is a query parameter that sets Content-Disposition.
     Nothing about it authenticates, so a bare fetch of it against a
     private store is refused exactly as meta.url would be. */
  assert.match(SDK, /downloadUrl\w*\.searchParams\.set\("download", "1"\)/)
})

test('the ledger is read through the SDK, which authenticates', () => {
  assert.match(STORE, /await get\(this\.key, \{ access: 'private', useCache: false \}\)/)
  assert.ok(
    !/fetch\(meta\.downloadUrl/.test(STORE),
    'reading a private blob over a bare fetch is the bug this replaced',
  )
})

test('a blob that was never written is an empty ledger, not a fault', () => {
  /* get() returns null rather than throwing, so the empty case no longer
     rests on recognising an error class. */
  assert.match(STORE, /if \(!result \|\| !result\.stream\) return \{ \.\.\.EMPTY_DOCUMENT \}/)
})
