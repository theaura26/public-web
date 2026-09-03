import Link from 'next/link'
import type { ReactNode } from 'react'

/* The ring-and-arrow call to action.
 *
 * Written once because the site already had it twice: the sanctuary
 * panels on the home page open a place with it, and the From Aura pages
 * ask for a conversation. Both sit on the same dark ground a few scrolls
 * apart, so two hand-kept copies of a 22px circle drift in a way a reader
 * can see.
 *
 * Every colour is currentColor. The caller sets the colour once on the
 * element and the ring follows it at 70%, which is what lets the same
 * component sit on the contrast band and on a photograph without either
 * one hard-coding white.
 */

type Common = {
  children: ReactNode
  /** Spoken label where the visible text is not the whole story. */
  ariaLabel?: string
  className?: string
}

type Props = Common &
  (
    | { href: string; onClick?: never }
    /* A button, for the panels: the whole panel is clickable and the CTA
       inside it must not fire the panel's handler a second time. */
    | { href?: never; onClick: (e: React.MouseEvent) => void }
  )

export default function ArrowCta({ children, ariaLabel, className, href, onClick }: Props) {
  const inner = (
    <>
      <span className="arrow-cta__ring" aria-hidden>
        <svg viewBox="0 0 24 24" width={11} height={11} fill="none" aria-hidden>
          <path
            d="M5 12h13M12.5 6l6.5 6-6.5 6"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </>
  )

  const cls = `arrow-cta label${className ? ` ${className}` : ''}`

  return href ? (
    <Link className={cls} href={href} aria-label={ariaLabel}>
      {inner}
    </Link>
  ) : (
    <button
      type="button"
      className={cls}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
    >
      {inner}
    </button>
  )
}
