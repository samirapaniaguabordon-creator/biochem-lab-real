'use client'

import { useEffect, useState } from 'react'
import { Play, Square, Timer, X } from 'lucide-react'
import { useStore } from '@/lib/store'

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export function StudyTimer() {
  const { state, hydrated, startTimer, stopTimer, cancelTimer } = useStore()
  const [now, setNow] = useState(() => Date.now())
  const [message, setMessage] = useState<string | null>(null)
  const running = Boolean(state.timerStartedAt)

  useEffect(() => {
    if (!running) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (!message) return
    const id = setTimeout(() => setMessage(null), 3500)
    return () => clearTimeout(id)
  }, [message])

  if (!hydrated) return <div className="h-11 w-28" />

  if (!running) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => startTimer('Estudio general')}
          className="flex h-11 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Play className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Iniciar sesión de estudio</span>
          <span className="sm:hidden">Estudiar</span>
        </button>
        {message && (
          <p
            role="status"
            className="absolute top-full right-0 mt-2 w-max max-w-64 rounded-lg border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg"
          >
            {message}
          </p>
        )}
      </div>
    )
  }

  const elapsed = now - new Date(state.timerStartedAt as string).getTime()

  return (
    <div className="flex h-11 items-center gap-1 rounded-lg border border-highlight/40 bg-accent pl-3 text-accent-foreground">
      <Timer className="size-4 text-highlight" aria-hidden="true" />
      <span className="font-mono text-sm tabular-nums" aria-live="off">
        {formatElapsed(elapsed)}
      </span>
      <button
        type="button"
        onClick={() => {
          const min = stopTimer()
          setMessage(min > 0 ? `Sesión guardada: ${min} min` : 'Sesión demasiado corta (menos de 1 min)')
        }}
        className="ml-1 flex size-11 items-center justify-center rounded-lg hover:bg-background/50"
        aria-label="Detener y guardar sesión"
        title="Detener y guardar"
      >
        <Square className="size-4 fill-current" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={cancelTimer}
        className="flex size-11 items-center justify-center rounded-lg hover:bg-background/50"
        aria-label="Descartar sesión"
        title="Descartar"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
