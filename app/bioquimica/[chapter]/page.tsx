import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { chapters, getChapter } from '@/lib/data/chapters'
import { ChapterView } from '@/components/biochem/chapter-view'

export function generateStaticParams() {
  return chapters.map((c) => ({ chapter: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params
  const c = getChapter(chapter)
  return { title: c ? `${c.number}. ${c.title}` : 'Capítulo' }
}

export default async function Page({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params
  if (!getChapter(chapter)) notFound()
  return (
    <Suspense>
      <ChapterView chapterId={chapter} />
    </Suspense>
  )
}
