import type { Metadata } from 'next'
import { FromAuraSwimlanes } from '@/components/Swimlanes'

export const metadata: Metadata = {
  title: 'From Aura',
  description:
    'What the estate grows, what its studios make, and the days it opens to people from outside it.',
  alternates: { canonical: '/from-aura' },
}

export default function Page() {
  return <FromAuraSwimlanes />
}
