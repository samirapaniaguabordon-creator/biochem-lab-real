import { ArrowDown } from 'lucide-react'
import type { Pathway } from '@/lib/data/pathways'
import { cn } from '@/lib/utils'

export function LinearDiagram({
  pathway,
  selected,
  onSelect,
}: {
  pathway: Pathway
  selected: number
  onSelect: (i: number) => void
}) {
  return (
    <ol className="flex flex-col">
      {pathway.steps.map((step, i) => {
        const showPhase = step.phase && step.phase !== pathway.steps[i - 1]?.phase
        const chained = i > 0 && pathway.steps[i - 1].to === step.from
        const active = i === selected
        return (
          <li key={step.id} className="flex flex-col">
            {showPhase && (
              <p className={cn('mb-2 text-xs font-semibold uppercase tracking-wider text-highlight', i > 0 && 'mt-4')}>
                {step.phase}
              </p>
            )}
            {!chained && (
              <div className="self-start rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium">{step.from}</div>
            )}
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={active}
              aria-label={`Paso ${i + 1}: ${step.enzyme}`}
              className={cn(
                'group my-1 ml-4 flex min-h-11 items-center gap-3 border-l-2 py-1.5 pl-4 text-left transition-colors',
                active ? 'border-highlight' : 'border-border hover:border-highlight/60',
              )}
            >
              <ArrowDown className={cn('size-4 shrink-0', active ? 'text-highlight' : 'text-muted-foreground')} aria-hidden="true" />
              <span
                className={cn(
                  'flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md px-2.5 py-1 text-sm transition-colors',
                  active ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground group-hover:bg-accent/70',
                )}
              >
                <span className="font-mono text-xs opacity-70">{i + 1}</span>
                <span className="font-medium">{step.enzyme}</span>
                {step.rateLimiting && <span className="size-2 rounded-full bg-chart-5" aria-label="Enzima limitante" />}
                {step.irreversible && <span className="size-2 rounded-full bg-destructive" aria-label="Irreversible" />}
                {step.energy && <span className="font-mono text-xs opacity-80">{step.energy}</span>}
              </span>
            </button>
            <div
              className={cn(
                'self-start rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                active ? 'border-highlight bg-card text-highlight' : 'border-border bg-muted',
              )}
            >
              {step.to}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
