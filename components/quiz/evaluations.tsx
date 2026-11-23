'use client'

import { useState } from 'react'
import { PageHeader, Segmented } from '@/components/ui-kit'
import { QuizRunner } from '@/components/quiz/quiz-runner'
import { Flashcards } from '@/components/quiz/flashcards'

type Tab = 'preguntas' | 'flashcards' | 'examen'

export function Evaluations() {
  const [tab, setTab] = useState<Tab>('preguntas')
  return (
    <div>
      <PageHeader eyebrow="Módulo 7" title="Evaluaciones" description="Practica con preguntas por tema, repasa con flashcards o pon a prueba tus conocimientos con un examen cronometrado." />
      <div className="mb-6">
        <Segmented
          label="Tipo de evaluación"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'preguntas', label: 'Preguntas' },
            { value: 'flashcards', label: 'Flashcards' },
            { value: 'examen', label: 'Examen' },
          ]}
        />
      </div>
      {tab === 'preguntas' && <QuizRunner key="quiz" mode="quiz" />}
      {tab === 'flashcards' && <Flashcards />}
      {tab === 'examen' && <QuizRunner key="exam" mode="examen" />}
    </div>
  )
}
