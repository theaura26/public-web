'use client'

import { useEffect, useState } from 'react'
import {
  relativeLabel, exactLabel, datetimeAttr, type FeedTime,
} from '@/lib/aura-live/time'

/* The timestamp on a card.
 *
 * Server-rendered with a real label so the feed reads correctly with no
 * JavaScript at all, then re-evaluated on the client and refreshed once a
 * minute. The refresh is arithmetic on a date the browser already has —
 * it never refetches the feed, so a page left open overnight costs
 * nothing and still says the right thing in the morning.
 *
 * The element is a real <time> carrying a machine-readable datetime. For
 * a date-only record that attribute is a plain date, because that is what
 * the record actually establishes; writing a midnight timestamp there
 * would hand a crawler a precision the estate never recorded.
 *
 * The exact reading is on the element as a title (mouse), as
 * aria-label (screen reader), and again in the evidence panel below the
 * card (keyboard, touch) — three routes to the same fact, because a
 * tooltip alone reaches only one kind of reader.
 */
export default function RelativeTime({ time, className }: { time: FeedTime; className?: string }) {
  const [label, setLabel] = useState(() => relativeLabel(time))
  const exact = exactLabel(time)

  useEffect(() => {
    const tick = () => setLabel(relativeLabel(time))
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [time])

  return (
    <time className={className} dateTime={datetimeAttr(time)} title={exact} aria-label={exact}>
      {label}
    </time>
  )
}
