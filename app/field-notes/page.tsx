import type { Metadata } from 'next'
import { NoteSwimlanes } from '@/components/Swimlanes'

export const metadata: Metadata = {
  title: 'Field Notes',
  description:
    'What the estate has learned, sorted by the discipline that learned it — activities, biodynamic practice, biodiversity and the labs.',
  alternates: { canonical: '/field-notes' },
}

export default function FieldNotesPage() {
  return <NoteSwimlanes />
}
