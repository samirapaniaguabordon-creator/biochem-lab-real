import type { Metadata } from 'next'
import { Statistics } from '@/components/stats/statistics'

export const metadata: Metadata = { title: 'Estadísticas' }

export default function Page() {
  return <Statistics />
}
