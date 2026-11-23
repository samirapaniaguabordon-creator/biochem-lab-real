import { Stethoscope, SlidersHorizontal } from 'lucide-react'
import type { PathwayStep } from '@/lib/data/pathways'
import { Badge, Card } from '@/components/ui-kit'

export function StepDetail({ step, index, total }: { step: PathwayStep; index: number; total: number }) {
  return (
    <Card className="flex flex-col gap-4 p-5" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>
          Paso {index + 1} de {total}
        </Badge>
        {step.phase && <Badge tone="accent">{step.phase}</Badge>}
        {step.rateLimiting && <Badge tone="warning">Enzima limitante</Badge>}
        {step.irreversible && <Badge tone="danger">Irreversible</Badge>}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          {step.from} <span aria-hidden="true">→</span>
          <span className="sr-only">se convierte en</span> {step.to}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-highlight">{step.enzyme}</h3>
        {step.energy && <p className="mt-1 font-mono text-sm font-medium">{step.energy}</p>}
      </div>
      <p className="leading-relaxed">{step.description}</p>
      {step.regulation && (
        <div className="rounded-lg bg-muted p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" /> Regulación
          </p>
          <p className="text-sm leading-relaxed">{step.regulation}</p>
        </div>
      )}
      {step.clinical && (
        <div className="rounded-lg border border-highlight/30 bg-accent p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            <Stethoscope className="size-3.5" aria-hidden="true" /> Correlación clínica
          </p>
          <p className="text-sm leading-relaxed text-accent-foreground">{step.clinical}</p>
        </div>
      )}
    </Card>
  )
}
