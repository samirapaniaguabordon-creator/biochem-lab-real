import type { Metadata } from 'next'
import { Evaluations } from '@/components/quiz/evaluations'

export const metadata: Metadata = { title: 'Evaluaciones' }

export default function Page() {
  return <Evaluations />
}
