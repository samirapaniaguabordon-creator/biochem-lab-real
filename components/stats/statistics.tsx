'use client'

import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Clock, Flame, Plus, Target, Trash2, Trophy } from 'lucide-react'
import { useStore } from '@/lib/store'
import { computeStats, formatDate } from '@/lib/stats'
import { Btn, Card, PageHeader, ProgressBar, Segmented, inputClass } from '@/components/ui-kit'
import { WeekChart } from '@/components/dashboard/week-chart'
import { axisTick, chartTooltipProps } from '@/components/charts/chart-theme'

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </Card>
  )
}

export function Statistics() {
  const { state, setWeeklyGoal, addSession, deleteSession } = useStore()
  const s = computeStats(state)
  const [range, setRange] = useState<'7' | '30'>('7')
  const [minutes, setMinutes] = useState('45')
  const [topic, setTopic] = useState('')

  const quizData = [...state.quizResults]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => ({ fecha: formatDate(r.date), puntuación: Math.round((r.score / r.total) * 100), tema: r.topic }))

  const sessions = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12)

  return (
    <div>
      <PageHeader eyebrow="Módulo 6" title="Estadísticas" description="Horas de estudio, capítulos completados, puntuaciones de evaluaciones y progreso semanal." />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<Clock className="size-4 text-highlight" aria-hidden="true" />} label="Total estudiado" value={`${(s.totalMinutes / 60).toFixed(1)} h`} hint={`${state.sessions.length} sesiones`} />
        <Stat icon={<Target className="size-4 text-highlight" aria-hidden="true" />} label="Esta semana" value={`${(s.weekMinutes / 60).toFixed(1)} h`} hint={`Meta: ${state.weeklyGoalHours} h`} />
        <Stat icon={<Flame className="size-4 text-highlight" aria-hidden="true" />} label="Racha" value={`${s.streak} ${s.streak === 1 ? 'día' : 'días'}`} />
        <Stat icon={<Trophy className="size-4 text-highlight" aria-hidden="true" />} label="Promedio evaluaciones" value={s.quizAvg === null ? '—' : `${s.quizAvg}%`} hint={`${s.quizCount} intentos`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-semibold">Horas de estudio</h2>
            <Segmented
              label="Rango de días"
              value={range}
              onChange={setRange}
              options={[
                { value: '7', label: '7 días' },
                { value: '30', label: '30 días' },
              ]}
            />
          </div>
          <WeekChart days={Number(range)} height={220} />
        </Card>

        <Card className="flex flex-col gap-4 p-4 sm:p-5">
          <h2 className="font-semibold">Progreso semanal</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span>
                {(s.weekMinutes / 60).toFixed(1)} de {state.weeklyGoalHours} h
              </span>
              <span className="font-medium text-highlight">{Math.min(100, Math.round((s.weekMinutes / s.weeklyGoalMinutes) * 100))}%</span>
            </div>
            <ProgressBar value={(s.weekMinutes / s.weeklyGoalMinutes) * 100} label="Progreso de la meta semanal" className="h-3" />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="goal" className="text-sm font-medium">
              Meta semanal (horas)
            </label>
            <input
              id="goal"
              type="number"
              min={1}
              max={80}
              value={state.weeklyGoalHours}
              onChange={(e) => setWeeklyGoal(Math.max(1, Math.min(80, Number(e.target.value) || 1)))}
              className={`${inputClass} w-24`}
            />
          </div>
          <form
            className="flex flex-col gap-2 border-t border-border pt-4"
            onSubmit={(e) => {
              e.preventDefault()
              const m = Math.round(Number(minutes))
              if (m > 0 && m <= 720) {
                addSession(m, topic.trim() || 'Estudio general')
                setTopic('')
              }
            }}
          >
            <p className="text-sm font-medium">Registrar sesión manual</p>
            <div className="flex gap-2">
              <label htmlFor="sess-min" className="sr-only">
                Minutos
              </label>
              <input id="sess-min" type="number" min={1} max={720} value={minutes} onChange={(e) => setMinutes(e.target.value)} className={`${inputClass} w-24`} />
              <label htmlFor="sess-topic" className="sr-only">
                Tema
              </label>
              <input id="sess-topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Tema estudiado" className={inputClass} />
              <Btn type="submit" aria-label="Añadir sesión" className="px-3">
                <Plus className="size-4" aria-hidden="true" />
              </Btn>
            </div>
          </form>
        </Card>

        <Card className="p-4 sm:p-5">
          <h2 className="mb-4 font-semibold">Capítulos completados</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {s.chaptersDone} de {s.totalChapters} capítulos · {s.completedLessons} de {s.totalLessons} lecciones
          </p>
          <ul className="flex flex-col gap-3">
            {s.chapterProgress.map((c) => (
              <li key={c.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between gap-2 text-sm">
                  <span className="truncate">
                    {c.number}. {c.title}
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {c.done}/{c.total}
                  </span>
                </div>
                <ProgressBar value={c.pct} label={`Progreso de ${c.title}`} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 sm:p-5">
          <h2 className="mb-4 font-semibold">Puntuaciones de evaluaciones</h2>
          {quizData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no has realizado evaluaciones.</p>
          ) : (
            <div className="h-56" role="img" aria-label={`Evolución de puntuaciones, promedio ${s.quizAvg}%`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="fecha" tick={axisTick} stroke="var(--border)" />
                  <YAxis domain={[0, 100]} tick={axisTick} stroke="var(--border)" unit="%" />
                  <Tooltip {...chartTooltipProps} cursor={{ stroke: 'var(--border)' }} formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="puntuación" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--chart-1)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-5 lg:col-span-2">
          <h2 className="mb-3 font-semibold">Sesiones recientes</h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Usa el temporizador o registra una sesión para empezar.</p>
          ) : (
            <ul className="divide-y divide-border">
              {sessions.map((x) => (
                <li key={x.id} className="flex items-center gap-3 py-2">
                  <span className="w-20 shrink-0 text-sm text-muted-foreground">{formatDate(x.date)}</span>
                  <span className="flex-1 truncate text-sm">{x.topic}</span>
                  <span className="font-mono text-sm">{x.minutes} min</span>
                  <Btn variant="ghost" className="px-3 text-muted-foreground" onClick={() => deleteSession(x.id)} aria-label={`Eliminar sesión de ${x.topic}`}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Btn>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
