import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Notes } from '@/components/notes/notes'

export const metadata: Metadata = { title: 'Mis apuntes' }

export default function Page() {
  return (
    <Suspense>
      <Notes />
    </Suspense>
  )
}
