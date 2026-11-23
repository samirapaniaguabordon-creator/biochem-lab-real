'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookCheck, Clock, Flame, NotebookPen, Target, Trophy } from 'lucide-react'
import { useStore, formatMinutes } from '@/lib/store'
import { computeStats, formatDate } from '@/lib/stats'
import { allLessons } from '@/lib/data/chapters'
import { moduleItems } from '@/lib/nav'
import { Card, ProgressBar, buttonClass } from '@/components/ui-kit'
import { WeekChart } from '@/components/dashboard/week-chart'

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-highlight">{icon}</span>
      </div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </Card>
  )
}

export function Dashboard() {
  const { state } = useStore()
  const stats = computeStats(state)
  const nextLesson = allLessons.find((l) => !state.completedLessons.includes(l.id))
  const recentNotes = [...state.notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)
  const goalPct = (stats.weekMinutes / stats.weeklyGoalMinutes) * 100

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="relative overflow-hidden rounded-2xl bg-[oklch(0.2_0.06_258)] text-white">
        <Image
          src="/images/hero-molecules.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 1100px, 100vw"
          className="object-cover object-right opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.2_0.06_258)] via-[oklch(0.2_0.06_258/0.85)] to-transparent" />
        <div className="relative flex flex-col gap-4 p-6 sm:p-10 md:max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.82_0.11_200)]">
            Laboratorio académico personal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Bienvenida a BioChem Lab</h1>
          <p className="text-pretty text-white/75">
            Tu espacio para dominar la bioquímica médica: organiza tus materiales, recorre las rutas metabólicas y mide tu
            progreso día a día.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {nextLesson ? (
              <Link
                href={`/bioquimica/${nextLesson.chapterId}?leccion=${nextLesson.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[oklch(0.82_0.11_200)] px-4 text-sm font-medium text-[oklch(0.2_0.06_258)] transition-opacity hover:opacity-90"
              >
                Continuar: {nextLesson.title}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href="/evaluaciones"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[oklch(0.82_0.11_200)] px-4 text-sm font-medium text-[oklch(0.2_0.06_258)]"
              >
                Repasar con evaluaciones
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
            <Link
              href="/rutas"
              className="inline-flex min-h-11 items-center rounded-lg border border-white/25 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Explorar rutas
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="progreso" className="flex flex-col gap-4">
        <h2 id="progreso" className="text-lg font-semibold">
          Resumen de progreso
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<Clock className="size-4" aria-hidden="true" />}
            label="Esta semana"
            value={formatMinutes(stats.weekMinutes)}
            hint={`Meta: ${state.weeklyGoalHours} h`}
          />
          <StatCard
            icon={<BookCheck className="size-4" aria-hidden="true" />}
            label="Lecciones"
            value={`${stats.completedLessons}/${stats.totalLessons}`}
            hint={`${stats.chaptersDone} de ${stats.totalChapters} capítulos completos`}
          />
          <StatCard
            icon={<Trophy className="size-4" aria-hidden="true" />}
            label="Promedio evaluaciones"
            value={stats.quizAvg === null ? '—' : `${stats.quizAvg}%`}
            hint={`${stats.quizCount} intentos registrados`}
          />
          <StatCard
            icon={<Flame className="size-4" aria-hidden="true" />}
            label="Racha"
            value={`${stats.streak} ${stats.streak === 1 ? 'día' : 'días'}`}
            hint="Días consecutivos estudiando"
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          <Card className="flex flex-col gap-4 p-5 lg:col-span-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold">Horas de estudio · últimos 7 días</h3>
                <p className="text-sm text-muted-foreground">Total acumulado: {formatMinutes(stats.totalMinutes)}</p>
              </div>
              <Link href="/estadisticas" className="text-sm font-medium text-highlight hover:underline">
                Ver más
              </Link>
            </div>
            <WeekChart />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Target className="size-4" aria-hidden="true" /> Meta semanal
                </span>
                <span className="font-medium tabular-nums">{Math.min(100, Math.round(goalPct))}%</span>
              </div>
              <ProgressBar value={goalPct} label="Progreso de la meta semanal" />
            </div>
          </Card>

          <Card className="flex flex-col gap-4 p-5 lg:col-span-2">
            <h3 className="font-semibold">Avance por capítulo</h3>
            <ul className="flex flex-col gap-3.5">
              {stats.chapterProgress.map((c) => (
                <li key={c.id}>
                  <Link href={`/bioquimica/${c.id}`} className="group flex flex-col gap-1.5">
                    <span className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate group-hover:text-highlight">
                        {c.number}. {c.title}
                      </span>
                      <span className="shrink-0 text-muted-foreground tabular-nums">
                        {c.done}/{c.total}
                      </span>
                    </span>
                    <ProgressBar value={c.pct} label={`Progreso de ${c.title}`} />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section aria-labelledby="modulos" className="flex flex-col gap-4">
        <h2 id="modulos" className="text-lg font-semibold">
          Acceso rápido a módulos
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {moduleItems.map((m) => {
            const Icon = m.icon
            return (
              <Link
                key={m.href}
                href={m.href}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-highlight/50 hover:shadow-md"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-medium group-hover:text-highlight">{m.label}</span>
                  <span className="text-sm text-muted-foreground">{m.description}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="apuntes-recientes" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="apuntes-recientes" className="text-lg font-semibold">
            Apuntes recientes
          </h2>
          <Link href="/apuntes" className={buttonClass('ghost', 'text-highlight')}>
            Ver todos
          </Link>
        </div>
        {recentNotes.length === 0 ? (
          <Card className="p-6 text-sm text-muted-foreground">
            Aún no tienes apuntes.{' '}
            <Link href="/apuntes?nuevo=1" className="font-medium text-highlight hover:underline">
              Crea el primero
            </Link>
            .
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {recentNotes.map((n) => (
              <Link
                key={n.id}
                href={`/apuntes?nota=${n.id}`}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-highlight/50"
              >
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <NotebookPen className="size-3.5" aria-hidden="true" />
                  {n.category} · {formatDate(n.updatedAt)}
                </span>
                <span className="font-medium">{n.title}</span>
                <span className="line-clamp-2 text-sm text-muted-foreground">{n.content}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
