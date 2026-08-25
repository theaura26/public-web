import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NoteIndex } from '@/components/field-notes/NoteIndex'
import { CATEGORIES, categoryById, notesIn, type CategoryId } from '@/lib/field-notes'

type Params = { category: string }

/** The four categories are a fixed set — prerender all of them. */
export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ category: c.id }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { category } = await params
  const cat = categoryById(category)
  if (!cat) return {}
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
  if (!cat) notFound()

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
