import type { Metadata } from 'next'
import { Library } from '@/components/library/library'

export const metadata: Metadata = { title: 'Mi biblioteca' }

export default function Page() {
  return <Library />
}
