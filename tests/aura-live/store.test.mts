import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BlobNotFoundError, BlobStoreNotFoundError, BlobServiceNotAvailable } from '@vercel/blob'

/* The blob store used to decide "this ledger has never been written" by
   matching the error's message against /not found|404|BlobNotFound/.
   @vercel/blob words it "The requested blob does not exist", which that
   pattern does not match — so the first read on any environment with a
   token but no ledger raised, and /now told readers the record could not
   be reached.
   These pin the two halves of the rule: the empty case is recognised by
   class, and the genuine faults are not swallowed with it. */

test('a never-written blob is recognised by class, not by its wording', () => {
  const err = new BlobNotFoundError()
  assert.ok(err instanceof BlobNotFoundError)
  assert.ok(
    !/not found|404|BlobNotFound/i.test(err.message),
    'the old message pattern still misses this error — it is why the guard is on the class',
  )
})

test('a missing or unavailable store is a fault, not an empty ledger', () => {
  assert.ok(!(new BlobStoreNotFoundError() instanceof BlobNotFoundError))
  assert.ok(!(new BlobServiceNotAvailable() instanceof BlobNotFoundError))
})
