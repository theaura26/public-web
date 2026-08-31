import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { runFeedGeneration } from '@/lib/aura-live/pipeline'
import { loadConfig } from '@/lib/aura-live/config'

/* AURA Live — the scheduled run.
 *
 * Called by Vercel Cron every half hour. The schedule is deliberately
 * dumber than the policy: cron fires on a fixed clock, and the job itself
 * decides whether the estate is inside a publishing window, in Asia/
 * Kolkata, from configuration. That way the windows can be changed with
 * an environment variable rather than a redeploy, which is what the brief
 * asked for — and a run outside them costs one early return.
 *
 * The endpoint is a writer, so it is authenticated. Vercel Cron sends
 * `Authorization: Bearer $CRON_SECRET`; nothing else may call it.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  /* Without a secret configured, only allow this off production — a
     public write endpoint is not something to leave on by accident. */
  if (!secret) return process.env.NODE_ENV !== 'production'
  const header = request.headers.get('authorization')
  return header === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ error: 'not authorised' }, { status: 401 })
  }

  const url = new URL(request.url)
  /* `?force=1` runs outside a publishing window. For backfills and for
     seeing what a run would do, never on the schedule. */
  const force = url.searchParams.get('force') === '1'

  const started = Date.now()
  try {
    const outcome = await runFeedGeneration({ force })

    /* Only bust the page cache when the page actually changed. */
    if (outcome.published || outcome.updated) revalidatePath('/live')

    console.log(JSON.stringify({
      evt: 'aura-live.run',
      ...outcome,
      durationMs: Date.now() - started,
      generator: loadConfig().generatorVersion,
    }))
    return NextResponse.json(outcome, { headers: { 'cache-control': 'no-store' } })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(JSON.stringify({ evt: 'aura-live.run-failed', message, durationMs: Date.now() - started }))
    /* The ledger is untouched on failure, so the page keeps serving what
       it had. Report the failure rather than a silent 200. */
    return NextResponse.json({ error: 'run failed', message }, { status: 500 })
  }
}
