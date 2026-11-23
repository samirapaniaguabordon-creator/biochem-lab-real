import type { AppState } from '@/lib/store'
import { startOfWeek } from '@/lib/store'
import { allLessons, chapters } from '@/lib/data/chapters'

export function computeStats(state: AppState) {
  const weekStart = startOfWeek()
  const weekMinutes = state.sessions
    .filter((s) => new Date(s.date) >= weekStart)
    .reduce((acc, s) => acc + s.minutes, 0)
  const totalMinutes = state.sessions.reduce((acc, s) => acc + s.minutes, 0)
  const completed = state.completedLessons.filter((id) => allLessons.some((l) => l.id === id)).length
  const quizAvg =
    state.quizResults.length > 0
      ? Math.round(
          (state.quizResults.reduce((acc, r) => acc + r.score / r.total, 0) / state.quizResults.length) * 100,
        )
      : null
  const chaptersDone = chapters.filter((c) => c.lessons.every((l) => state.completedLessons.includes(l.id))).length

  const chapterProgress = chapters.map((c) => {
    const done = c.lessons.filter((l) => state.completedLessons.includes(l.id)).length
    return { id: c.id, title: c.title, number: c.number, done, total: c.lessons.length, pct: Math.round((done / c.lessons.length) * 100) }
  })

  return {
    weekMinutes,
    totalMinutes,
    weeklyGoalMinutes: state.weeklyGoalHours * 60,
    completedLessons: completed,
    totalLessons: allLessons.length,
    chaptersDone,
    totalChapters: chapters.length,
    quizAvg,
    quizCount: state.quizResults.length,
    chapterProgress,
    streak: computeStreak(state),
  }
}

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function computeStreak(state: AppState) {
  const days = new Set(state.sessions.map((s) => dayKey(new Date(s.date))))
  let streak = 0
  const cursor = new Date()
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (days.has(dayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export function lastNDays(state: AppState, n: number) {
  const out: { key: string; label: string; minutos: number; horas: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const k = dayKey(d)
    const minutes = state.sessions.filter((s) => dayKey(new Date(s.date)) === k).reduce((a, s) => a + s.minutes, 0)
    out.push({
      key: k,
      label: n <= 7 ? dayNames[d.getDay()] : `${d.getDate()}/${d.getMonth() + 1}`,
      minutos: minutes,
      horas: Math.round((minutes / 60) * 10) / 10,
    })
  }
  return out
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) {
  return new Date(iso).toLocaleDateString('es-ES', opts)
}
