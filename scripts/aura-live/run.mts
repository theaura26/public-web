/* Run one feed-generation pass from the command line.
 *
 *   npx tsx scripts/aura-live/run.mts            respects publishing windows
 *   npx tsx scripts/aura-live/run.mts --force    runs at any hour
 *   npx tsx scripts/aura-live/run.mts --drain    lifts the per-run caps
 *
 * Same code path the cron route uses, so what it prints is what the
 * scheduled job would have done.
 */
import { runFeedGeneration } from '../../lib/aura-live/pipeline'

const force = process.argv.includes('--force')
const drain = process.argv.includes('--drain')
const outcome = await runFeedGeneration({ force, drain })
console.log('\n' + JSON.stringify(outcome, null, 2))
