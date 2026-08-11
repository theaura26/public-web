import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/* Exact-match redirect for the private signature page: /signature -> /signature/.

   The signature page's logo (referenced relatively in the approved <table>) and
   its COPY button both resolve against the page URL, so the page must be served
   WITH the trailing slash. A next.config `redirects` rule can't express this
   cleanly — its path matching also matches `/signature/` and loops. Middleware
   with an exact pathname check redirects only the slash-less form; `/signature/`
   falls straight through to the static file. Matcher is scoped to the single
   path so this runs nowhere else. */
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/signature') {
    return NextResponse.redirect(new URL('/signature/', req.url), 308)
  }
  return NextResponse.next()
}

export const config = { matcher: '/signature' }
