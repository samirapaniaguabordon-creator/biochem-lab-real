'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, MapPin, Zap } from 'lucide-react'
import { pathways } from '@/lib/data/pathways'
import { Btn, Card, PageHeader, Segmented } from '@/components/ui-kit'
import { LinearDiagram } from '@/components/pathways/linear-diagram'
import { CycleDiagram } from '@/components/pathways/cycle-diagram'
import { StepDetail } from '@/components/pathways/step-detail'

export function PathwayExplorer() {
  const params = useSearchParams()
  const router = useRouter()
  const pathway = pathways.find((p) => p.id === params.get('ruta')) ?? pathways[0]
  const [selection, setSelection] = useState<{ pathwayId: string; index: number }>({ pathwayId: pathway.id, index: 0 })
  const index = selection.pathwayId === pathway.id ? selection.index : 0
  const step = pathway.steps[index]

  function select(i: number) {
    setSelection({ pathwayId: pathway.id, index: i })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Módulo 3"
        title="Rutas metabólicas"
        description="Explora cada vía paso a paso. Toca una reacción para ver la enzima, su regulación y la relevancia clínica."
      />

      <div className="mb-6">
        <Segmented
          label="Seleccionar ruta metabólica"
          value={pathway.id}
          onChange={(id) => router.replace(`/rutas?ruta=${id}`, { scroll: false })}
          options={pathways.map((p) => ({ value: p.id, label: p.short }))}
        />
      </div>

      <Card className="mb-6 flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{pathway.name}</h2>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 text-highlight" aria-hidden="true" />
            {pathway.location}
          </p>
        </div>
        <p className="text-pretty leading-relaxed">{pathway.overview}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-muted p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ecuación global</p>
            <p className="font-mono text-sm leading-relaxed">{pathway.equation}</p>
          </div>
          <div className="rounded-lg bg-accent p-3">
            <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              <Zap className="size-3.5" aria-hidden="true" /> Balance energético
            </p>
            <p className="text-sm font-medium text-accent-foreground">{pathway.yield}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="font-semibold">Diagrama interactivo</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-chart-5" aria-hidden="true" /> Limitante
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2.5 rounded-full bg-destructive" aria-hidden="true" /> Irreversible
              </span>
            </div>
          </div>
          {pathway.layout === 'cycle' ? (
            <CycleDiagram pathway={pathway} selected={index} onSelect={select} />
          ) : (
            <LinearDiagram pathway={pathway} selected={index} onSelect={select} />
          )}
        </Card>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <StepDetail step={step} index={index} total={pathway.steps.length} />
          <div className="flex gap-2">
            <Btn variant="outline" className="flex-1" disabled={index === 0} onClick={() => select(index - 1)}>
              <ChevronLeft className="size-4" aria-hidden="true" /> Anterior
            </Btn>
            <Btn className="flex-1" disabled={index === pathway.steps.length - 1} onClick={() => select(index + 1)}>
              Siguiente <ChevronRight className="size-4" aria-hidden="true" />
            </Btn>
          </div>
          <Card className="p-5">
            <h3 className="mb-3 font-semibold">Regulación clave</h3>
            <ul className="flex flex-col gap-2.5">
              {pathway.keyRegulation.map((r) => (
                <li key={r} className="flex gap-2 text-sm leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-highlight" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
