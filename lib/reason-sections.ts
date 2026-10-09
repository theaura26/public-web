/* The Reason's five pages, in reading order. One list for the menu, the
   routes and each page's continue links, so they cannot drift apart.

   The Reason has a page of its own at REASON_BASE, the letter that
   opens it. The five pages are listed here for the links between them
   (ReasonKit's ContinueTo); they are published separately. */
export const REASON_BASE = '/regenerative-life/the-reason'

export const REASON_SECTIONS = [
  { id: 'why-aura', label: 'Why Aura' },
  { id: 'natural-intelligence', label: 'Natural Intelligence' },
  { id: 'thousand-year-idea', label: 'The Thousand Year Idea' },
  { id: 'moral-spine', label: 'Moral Spine' },
  { id: 'six-field-rules', label: 'Six Field Rules' },
] as const

export type ReasonSection = (typeof REASON_SECTIONS)[number]
export type ReasonSectionId = ReasonSection['id']

export const reasonHref = (id: ReasonSectionId) => `${REASON_BASE}/${id}`

export function reasonSection(id: string): ReasonSection | undefined {
  return REASON_SECTIONS.find((s) => s.id === id)
}
