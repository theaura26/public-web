'use client'

import { CloudSlash, Leaf } from '@phosphor-icons/react'

/* What the feed says when it has no entries.
 *
 * It used to say one long thing in both cases: a paragraph about
 * confirmed events, dates, places and evidence, which is the reasoning
 * behind the page rather than an answer to the question a reader is
 * actually asking, which is why is there nothing here.
 *
 * Two answers, because there are two situations and they are not the
 * same. A feed that cannot be reached is offline and will return. A feed
 * that is working and has published nothing is a quiet day on a farm.
 * Saying the first when the second is true would be a small lie, and
 * saying the second when the first is true would be a larger one.
 */

export default function FeedState({ offline }: { offline: boolean }) {
  const Icon = offline ? CloudSlash : Leaf

  return (
    <div className="fs">
      {/* Light, the same hairline the category glyphs are drawn at. */}
      <Icon size={28} weight="light" aria-hidden="true" focusable="false" />
      {offline ? (
        <p className="fs-t">
          The feed is offline right now. Back shortly.
        </p>
      ) : (
        <p className="fs-t">
          Nothing to report from the estate today.
        </p>
      )}

      <style jsx>{`
        .fs {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-4);
          color: var(--text-muted);
        }
        .fs-t {
          margin: 0;
          max-width: 42ch;
          color: var(--text-body);
        }
      `}</style>
    </div>
  )
}
