import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PathwayExplorer } from '@/components/pathways/pathway-explorer'

export const metadata: Metadata = { title: 'Rutas metabólicas' }

export default function Page() {
  return (
    <Suspense>
      <PathwayExplorer />
    </Suspense>
  )
}
