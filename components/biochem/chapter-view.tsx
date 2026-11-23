'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Circle, Clock, NotebookPen, Stethoscope, Workflow } from 'lucide-react'
import { getChapter } from '@/lib/data/chapters'
import { getPathway } from '@/lib/data/pathways'
import { useStore } from '@/lib/store'
import { Badge, Btn, Card, ProgressBar, buttonClass } from '@/components/ui-kit'
import { cn } from '@/lib/utils'

export function ChapterView({ chapterId }: { chapterId: string }) {
  const chapter = getChapter(chapterId)!
  const params = useSearchParams()
  const router = useRouter()
  const { state, toggleLesson, saveNote } = useStore()

  const index = Math.max(0, chapter.lessons.findIndex((l) => l.id === params.get('leccion')))
  const lesson = chapter.lessons[index]
  const complete = state.completedLessons.includes(lesson.id)
  const done = chapter.lessons.filter((l) => state.completedLessons.includes(l.id)).length
  const pathway = lesson.pathwayId ? getPathway(lesson.pathwayId) : undefined

  function go(i: number) {
    router.push(`/bioquimica/${chapter.id}?leccion=${chapter.lessons[i].id}`, { scroll: true })
  }

  function createNote() {
    const id = saveNote({
      title: `Resumen: ${lesson.title}`,
      content: `${lesson.summary}\n\nPuntos clave:\n${lesson.keyPoints.map((p) => `- ${p}`).join('\n')}`,
      category: chapter.title,
      tags: [lesson.title.toLowerCase()],
      pinned: false,
    })
    router.push(`/apuntes?nota=${id}`)
  }

  return (
    <div>
      <Link href="/bioquimica" className={buttonClass('ghost', 'mb-4 -ml-2 px-2 text-muted-foreground')}>
        <ArrowLeft className="size-4" aria-hidden="true" /> Todos los capítulos
      </Link>

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="flex flex-col gap-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-highlight">Capítulo {chapter.number}</p>
            <h1 className="text-lg font-semibold leading-snug">{chapter.title}</h1>
            <ProgressBar value={(done / chapter.lessons.length) * 100} label="Progreso del capítulo" />
            <p className="text-xs text-muted-foreground">
              {done} de {chapter.lessons.length} lecciones completadas
            </p>
            <nav aria-label="Lecciones del capítulo">
              <ol className="flex flex-col gap-1">
                {chapter.lessons.map((l, i) => {
                  const c = state.completedLessons.includes(l.id)
                  return (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => go(i)}
                        aria-current={i === index ? 'page' : undefined}
                        className={cn(
                          'flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-sm transition-colors',
                          i === index ? 'bg-accent font-medium text-accent-foreground' : 'hover:bg-muted',
                        )}
                      >
                        {c ? (
                          <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="Completada" />
                        ) : (
                          <Circle className="size-4 shrink-0 text-muted-foreground" aria-label="Pendiente" />
                        )}
                        {l.title}
                      </button>
                    </li>
                  )
                })}
              </ol>
            </nav>
          </Card>
        </aside>

        <article className="flex min-w-0 flex-col gap-5">
          <header className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                Lección {index + 1} de {chapter.lessons.length}
              </Badge>
              <Badge tone="accent">
                <Clock className="size-3" aria-hidden="true" /> {lesson.minutes} min
              </Badge>
              {complete && <Badge tone="success">Completada</Badge>}
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{lesson.title}</h2>
          </header>

          <Card className="border-l-4 border-l-highlight p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resumen</p>
            <p className="text-pretty leading-relaxed">{lesson.summary}</p>
          </Card>

          <section aria-label="Explicación" className="flex flex-col gap-4 leading-relaxed">
            {lesson.content.map((p, i) => (
              <p key={i} className="text-pretty">
                {p}
              </p>
            ))}
          </section>

          <Card className="p-5">
            <h3 className="mb-3 font-semibold">Puntos clave</h3>
            <ul className="flex flex-col gap-2.5">
              {lesson.keyPoints.map((k) => (
                <li key={k} className="flex gap-2.5 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden="true" />
                  {k}
                </li>
              ))}
            </ul>
          </Card>

          {lesson.clinical && (
            <Card className="bg-accent p-5">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-accent-foreground">
                <Stethoscope className="size-4" aria-hidden="true" /> Correlación clínica
              </h3>
              <p className="text-sm leading-relaxed text-accent-foreground">{lesson.clinical}</p>
            </Card>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Btn variant={complete ? 'outline' : 'primary'} onClick={() => toggleLesson(lesson.id)} aria-pressed={complete}>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {complete ? 'Marcar como pendiente' : 'Marcar como completada'}
            </Btn>
            <Btn variant="outline" onClick={createNote}>
              <NotebookPen className="size-4" aria-hidden="true" /> Crear apunte de esta lección
            </Btn>
            {pathway && (
              <Link href={`/rutas?ruta=${pathway.id}`} className={buttonClass('outline')}>
                <Workflow className="size-4" aria-hidden="true" /> Ver diagrama: {pathway.short}
              </Link>
            )}
          </div>

          <div className="flex gap-2 border-t border-border pt-5">
            <Btn variant="ghost" className="flex-1 sm:flex-none" disabled={index === 0} onClick={() => go(index - 1)}>
              <ChevronLeft className="size-4" aria-hidden="true" /> Anterior
            </Btn>
            <Btn
              variant="secondary"
              className="ml-auto flex-1 sm:flex-none"
              disabled={index === chapter.lessons.length - 1}
              onClick={() => go(index + 1)}
            >
              Siguiente <ChevronRight className="size-4" aria-hidden="true" />
            </Btn>
          </div>
        </article>
      </div>
    </div>
  )
}
