'use client'

import Link from 'next/link'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { chapters } from '@/lib/data/chapters'
import { useStore } from '@/lib/store'
import { Card, PageHeader, ProgressBar } from '@/components/ui-kit'

export function ChapterList() {
  const { state } = useStore()
  return (
    <div>
      <PageHeader
        eyebrow="Módulo 4"
        title="Bioquímica"
        description="Lecciones organizadas por capítulos, con resúmenes, explicaciones, puntos clave y correlaciones clínicas."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((c) => {
          const done = c.lessons.filter((l) => state.completedLessons.includes(l.id)).length
          const minutes = c.lessons.reduce((a, l) => a + l.minutes, 0)
          return (
            <Card key={c.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-lg font-semibold text-primary-foreground">
                  {c.number}
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/bioquimica/${c.id}`} className="font-semibold hover:text-highlight">
                    {c.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {done}/{c.lessons.length} lecciones
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden="true" /> {minutes} min
                  </span>
                </div>
                <ProgressBar value={(done / c.lessons.length) * 100} label={`Progreso de ${c.title}`} />
              </div>
              <ul className="flex flex-col gap-1">
                {c.lessons.map((l) => {
                  const complete = state.completedLessons.includes(l.id)
                  return (
                    <li key={l.id}>
                      <Link
                        href={`/bioquimica/${c.id}?leccion=${l.id}`}
                        className="flex min-h-11 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors hover:bg-muted"
                      >
                        {complete ? (
                          <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Completada" />
                        ) : (
                          <Circle className="size-4 shrink-0 text-muted-foreground" aria-label="Pendiente" />
                        )}
                        <span className="flex-1">{l.title}</span>
                        <span className="text-xs text-muted-foreground">{l.minutes} min</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
