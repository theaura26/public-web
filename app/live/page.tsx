import { permanentRedirect } from 'next/navigation'

/* Aura Live moved to /now.
 *
 * Now used to be an index of thirteen subjects that were never written.
 * The feed is the thing that actually answers "what is happening on the
 * estate today", so it took the URL. This keeps every link already
 * pointing at /live working.
 */
export default function Page() {
  permanentRedirect('/now')
}
