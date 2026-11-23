import type { Metadata } from 'next'
import { ChapterList } from '@/components/biochem/chapter-list'

export const metadata: Metadata = { title: 'Bioquímica' }

export default function Page() {
  return <ChapterList />
}
