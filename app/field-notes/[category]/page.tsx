import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NoteIndex } from '@/components/field-notes/NoteIndex'
import { CATEGORIES, categoryById, notesIn, type CategoryId } from '@/lib/field-notes'
import ComingSoon from '@/components/ComingSoon'
import { stubSlugs, labelFor } from '@/lib/site-nav'

type Params = { category: string }

/* The written categories, plus the ones the sitemap names but nobody
   has written yet. Both are a fixed set, so both prerender — and a
   category on neither list still 404s. */
export function generateStaticParams(): Params[] {
  return [
    ...CATEGORIES.map((c) => ({ category: c.id })),
    ...stubSlugs('/field-notes').map((slug) => ({ category: slug })),
  ]
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { category } = await params
  const cat = categoryById(category)
  if (!cat) {
    const label = labelFor(`/field-notes/${category}`)
    return label
      ? { title: `${label} — Field Notes`, robots: { index: false, follow: true } }
      : {}
  }
  return {
    title: `${cat.label} — Field Notes`,
    description: cat.lede,
    alternates: { canonical: `/field-notes/${cat.id}` },
  }
}

export default async function CategoryPage(
  { params }: { params: Promise<Params> },
) {
  const { category } = await params
  const cat = categoryById(category)
  if (!cat) {
    const label = labelFor(`/field-notes/${category}`)
    if (!label) notFound()
    return <ComingSoon title={label} section="Field Notes" sectionHref="/field-notes" />
  }

  return (
    <NoteIndex
      eyebrow="Field Notes"
      title={cat.label}
      lede={cat.lede}
      active={cat.id as CategoryId}
      notes={notesIn(cat.id)}
    />
  )
}
