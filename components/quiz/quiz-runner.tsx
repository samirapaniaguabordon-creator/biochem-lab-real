'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, RotateCcw, Trophy, XCircle } from 'lucide-react'
import { questions, quizTopics, type Question } from '@/lib/data/quiz'
import { useStore } from '@/lib/store'
import { Badge, Btn, Card, ProgressBar } from '@/components/ui-kit'
import { cn } from '@/lib/utils'

const EXAM_SIZE = 10
const EXAM_SECONDS = 15 * 60

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function QuizRunner({ mode }: { mode: 'quiz' | 'examen' }) {
  const { addQuizResult } = useStore()
  const [topic, setTopic] = useState<string>('Todos')
  const [set, setSet] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS)

  const isExam = mode === 'examen'

  function start() {
    const pool = topic === 'Todos' || isExam ? questions : questions.filter((q) => q.topic === topic)
    const picked = isExam ? shuffle(pool).slice(0, EXAM_SIZE) : shuffle(pool)
    setSet(picked)
    setAnswers(picked.map(() => null))
    setIndex(0)
    setRevealed(false)
    setFinished(false)
    setSecondsLeft(EXAM_SECONDS)
  }

  function finish(final: (number | null)[] = answers) {
    if (!set || finished) return
    const score = set.reduce((acc, q, i) => acc + (final[i] === q.answer ? 1 : 0), 0)
    addQuizResult({ score, total: set.length, topic: isExam ? 'General' : topic, mode })
    setFinished(true)
  }

  useEffect(() => {
    if (!isExam || !set || finished) return
    if (secondsLeft <= 0) {
      finish()
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExam, set, finished, secondsLeft])

  if (!set) {
    return (
      <Card className="flex flex-col gap-5 p-5">
        <div>
          <h2 className="text-lg font-semibold">{isExam ? 'Examen simulado' : 'Preguntas de práctica'}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isExam
              ? `${EXAM_SIZE} preguntas aleatorias de todos los temas · ${EXAM_SECONDS / 60} minutos · la corrección se muestra al final.`
              : 'Responde y recibe retroalimentación inmediata con la explicación de cada respuesta.'}
          </p>
        </div>
        {!isExam && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Tema</legend>
            <div className="flex flex-wrap gap-2">
              {['Todos', ...quizTopics].map((t) => {
                const count = t === 'Todos' ? questions.length : questions.filter((q) => q.topic === t).length
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={topic === t}
                    onClick={() => setTopic(t)}
                    className={cn(
                      'min-h-11 rounded-lg border px-3 text-sm transition-colors',
                      topic === t ? 'border-highlight bg-accent font-medium text-accent-foreground' : 'border-border hover:bg-muted',
                    )}
                  >
                    {t} <span className="text-muted-foreground">({count})</span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}
        <Btn onClick={start} className="self-start">
          {isExam ? 'Comenzar examen' : 'Comenzar práctica'}
        </Btn>
      </Card>
    )
  }

  if (finished) {
    const score = set.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
    const pct = Math.round((score / set.length) * 100)
    return (
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col items-center gap-3 p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent text-highlight">
            <Trophy className="size-7" aria-hidden="true" />
          </span>
          <h2 className="text-2xl font-semibold">
            {score} / {set.length} · {pct}%
          </h2>
          <p className="text-muted-foreground">{pct >= 80 ? '¡Excelente dominio del tema!' : pct >= 60 ? 'Buen trabajo, repasa los errores.' : 'Sigue practicando, vas por buen camino.'}</p>
          <div className="flex gap-2">
            <Btn onClick={start}>
              <RotateCcw className="size-4" aria-hidden="true" /> Repetir
            </Btn>
            <Btn variant="outline" onClick={() => setSet(null)}>
              Volver
            </Btn>
          </div>
        </Card>
        {isExam && (
          <Card className="p-5">
            <h3 className="mb-3 font-semibold">Revisión</h3>
            <ol className="flex flex-col gap-4">
              {set.map((q, i) => {
                const ok = answers[i] === q.answer
                return (
                  <li key={q.id} className="flex gap-3">
                    {ok ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-label="Correcta" /> : <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-label="Incorrecta" />}
                    <div className="flex flex-col gap-1 text-sm">
                      <p className="font-medium">{q.question}</p>
                      {!ok && (
                        <p className="text-destructive">Tu respuesta: {answers[i] === null ? 'Sin responder' : q.options[answers[i] as number]}</p>
                      )}
                      <p className="text-success">Correcta: {q.options[q.answer]}</p>
                      <p className="text-muted-foreground">{q.explanation}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Card>
        )}
      </div>
    )
  }

  const q = set[index]
  const chosen = answers[index]
  const showFeedback = !isExam && revealed
  const last = index === set.length - 1

  function choose(i: number) {
    if (showFeedback) return
    const next = [...answers]
    next[index] = i
    setAnswers(next)
    if (!isExam) setRevealed(true)
  }

  function next() {
    if (last) return finish()
    setIndex(index + 1)
    setRevealed(false)
  }

  const mm = Math.floor(secondsLeft / 60)
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <Card className="flex flex-col gap-5 p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">
            Pregunta {index + 1} de {set.length}
          </span>
          {isExam ? (
            <Badge tone={secondsLeft < 60 ? 'danger' : 'default'} aria-live="off">
              <Clock className="size-3" aria-hidden="true" />
              <span className="font-mono">
                {mm}:{ss}
              </span>
            </Badge>
          ) : (
            <Badge tone="accent">{q.topic}</Badge>
          )}
        </div>
        <ProgressBar value={((index + (chosen !== null ? 1 : 0)) / set.length) * 100} label="Progreso de la evaluación" />
      </div>
      <h2 className="text-lg font-semibold text-pretty">{q.question}</h2>
      <div role="radiogroup" aria-label="Opciones de respuesta" className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const isChosen = chosen === i
          const isCorrect = i === q.answer
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={isChosen}
              onClick={() => choose(i)}
              disabled={showFeedback}
              className={cn(
                'flex min-h-12 items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default',
                showFeedback && isCorrect && 'border-success bg-success/10',
                showFeedback && isChosen && !isCorrect && 'border-destructive bg-destructive/10',
                !showFeedback && isChosen && 'border-highlight bg-accent',
                !showFeedback && !isChosen && 'border-border hover:bg-muted',
                showFeedback && !isChosen && !isCorrect && 'border-border opacity-60',
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current font-mono text-xs">{String.fromCharCode(65 + i)}</span>
              <span className="flex-1">{opt}</span>
              {showFeedback && isCorrect && <CheckCircle2 className="size-5 text-success" aria-label="Respuesta correcta" />}
              {showFeedback && isChosen && !isCorrect && <XCircle className="size-5 text-destructive" aria-label="Respuesta incorrecta" />}
            </button>
          )
        })}
      </div>
      {showFeedback && (
        <p role="status" className={cn('rounded-lg p-3 text-sm leading-relaxed', chosen === q.answer ? 'bg-success/10' : 'bg-destructive/10')}>
          <strong>{chosen === q.answer ? '¡Correcto! ' : 'Incorrecto. '}</strong>
          {q.explanation}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {isExam && index > 0 && (
          <Btn variant="outline" onClick={() => setIndex(index - 1)}>
            Anterior
          </Btn>
        )}
        <Btn onClick={next} disabled={!isExam && !revealed} className="ml-auto">
          {last ? 'Terminar' : 'Siguiente'}
        </Btn>
      </div>
    </Card>
  )
}
