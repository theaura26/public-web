import { redirect } from 'next/navigation'

/* The Reason now lives at /reason (the canonical, linked URL). This former
   dev/staging path redirects there so any old/direct links still resolve and
   the page isn't duplicated for crawlers. */
export default function TheReasonRedirect() {
  redirect('/reason')
}
