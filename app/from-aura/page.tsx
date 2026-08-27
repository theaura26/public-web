import type { Metadata } from 'next'
import { FromAuraSwimlanes } from '@/components/Swimlanes'

export const metadata: Metadata = {
  title: 'From Aura',
  description:
    'Three directions out of one estate — what the land grows, what the atelier makes, and what is offered to partners buying at volume.',
  alternates: { canonical: '/from-aura' },
}

export default function Page() {
  return <FromAuraSwimlanes />
}
