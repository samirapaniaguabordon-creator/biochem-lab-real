'use client'

import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, RotateCw, X } from 'lucide-react'
import { flashcards, quizTopics } from '@/lib/data/quiz'
import { useStore } from '@/lib/store'
import { Badge, Btn, Card, ProgressBar } from '@/components/ui-kit'
import { cn } from '@/lib/utils'

export function Flashcards() {
  const { state, setFlashcardKnown } = useStore()
  const [topic, setTopic] = useState('Todos')
  const [onlyPending, setOnlyPending] = useState(false)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const deck = flashcards.filter((c) => (topic === 'Todos' || c.topic === topic) && (!onlyPending || !state.knownFlashcards.includes(c.id)))
  const known = flashcards.filter((c) => state.knownFlashcards.includes(c.id)).length
  const safeIndex = Math.min(index, Math.max(0, deck.length - 1))
  const card = deck[safeIndex]

  function move(delta: number) {
    setFlipped(false)
    setIndex((safeIndex + delta + deck.length) % deck.length)
  }

  function mark(isKnown: boolean) {
    if (!card) return
    setFlashcardKnown(card.id, isKnown)
    setFlipped(false)
    if (!onlyPending || !isKnown) setIndex((safeIndex + 1) % Math.max(1, deck.length))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="fc-topic" className="sr-only">
          Tema
        </label>
        <select
          id="fc-topic"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value)
            setIndex(0)
            setFlipped(false)
          }}
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-base"
        >
          <option>Todos</option>
          {quizTopics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} className="size-5 accent-[var(--highlight)]" />
          Solo pendientes
        </label>
        <div className="flex flex-1 flex-col gap-1 sm:max-w-xs">
          <span className="text-xs text-muted-foreground">
            Dominadas: {known} de {flashcards.length}
          </span>
          <ProgressBar value={(known / flashcards.length) * 100} label="Flashcards dominadas" />
        </div>
      </div>

      {!card ? (
        <Card className="p-8 text-center text-muted-foreground">¡Has dominado todas las tarjetas de este tema!</Card>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setFlipped(!flipped)}
            aria-label={flipped ? 'Mostrar pregunta' : 'Mostrar respuesta'}
            className="group [perspective:1200px]"
          >
            <div
              className={cn(
                'relative min-h-64 w-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none',
                flipped && '[transform:rotateY(180deg)]',
              )}
            >
              <Card className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 [backface-visibility:hidden]">
                <Badge tone="accent">{card.topic}</Badge>
                <p className="text-center text-xl font-semibold text-balance">{card.front}</p>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <RotateCw className="size-3.5" aria-hidden="true" /> Toca para voltear
                </span>
              </Card>
              <Card className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-primary p-6 text-primary-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-center text-lg leading-relaxed text-pretty">{card.back}</p>
              </Card>
            </div>
          </button>
          <p className="text-center text-sm text-muted-foreground" aria-live="polite">
            Tarjeta {safeIndex + 1} de {deck.length}
            {state.knownFlashcards.includes(card.id) && ' · dominada'}
          </p>
          <div className="flex items-center gap-2">
            <Btn variant="ghost" className="px-3" onClick={() => move(-1)} aria-label="Tarjeta anterior">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Btn>
            <Btn variant="outline" className="flex-1" onClick={() => mark(false)}>
              <X className="size-4" aria-hidden="true" /> Repasar
            </Btn>
            <Btn className="flex-1" onClick={() => mark(true)}>
              <Check className="size-4" aria-hidden="true" /> La sé
            </Btn>
            <Btn variant="ghost" className="px-3" onClick={() => move(1)} aria-label="Tarjeta siguiente">
              <ChevronRight className="size-5" aria-hidden="true" />
            </Btn>
          </div>
        </>
      )}
    </div>
  )
}
