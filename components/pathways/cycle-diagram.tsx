import type { Pathway } from '@/lib/data/pathways'
import { cn } from '@/lib/utils'

const SIZE = 420
const C = SIZE / 2
const R = 150

function shortLabel(name: string) {
  return name.replace('Acetil-CoA + ', '').replace('Complejo ', '')
}

export function CycleDiagram({
  pathway,
  selected,
  onSelect,
}: {
  pathway: Pathway
  selected: number
  onSelect: (i: number) => void
}) {
  const n = pathway.steps.length
  const nodes = pathway.steps.map((s, i) => {
    const angle = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2
    return { name: s.to, x: C + R * Math.cos(angle), y: C + R * Math.sin(angle), angle }
  })

  return (
    <div className="flex flex-col gap-4">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-md" role="group" aria-label={`Diagrama del ${pathway.name}`}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--highlight)" />
          </marker>
        </defs>
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="3 5" />
        <text x={C} y={C - 6} textAnchor="middle" className="fill-foreground text-[15px] font-semibold">
          {pathway.short}
        </text>
        <text x={C} y={C + 14} textAnchor="middle" className="fill-muted-foreground text-[11px]">
          {pathway.location}
        </text>

        <line x1={C} y1={8} x2={C} y2={C - R - 26} stroke="var(--chart-2)" strokeWidth={2} markerEnd="url(#arrow)" />
        <text x={C + 8} y={20} className="fill-muted-foreground text-[11px]">
          Acetil-CoA
        </text>

        {pathway.steps.map((step, i) => {
          const start = nodes[(i - 1 + n) % n]
          const end = nodes[i]
          const startA = start.angle + 0.17
          const endA = end.angle - 0.17
          const x1 = C + R * Math.cos(startA)
          const y1 = C + R * Math.sin(startA)
          const x2 = C + R * Math.cos(endA)
          const y2 = C + R * Math.sin(endA)
          const mid = (start.angle + (end.angle < start.angle ? end.angle + Math.PI * 2 : end.angle)) / 2
          const bx = C + (R - 38) * Math.cos(mid)
          const by = C + (R - 38) * Math.sin(mid)
          const active = i === selected
          return (
            <g
              key={step.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={`Paso ${i + 1}: ${step.enzyme}`}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(i)
                }
              }}
              className="cursor-pointer outline-none [&:focus-visible_circle.step]:stroke-ring"
            >
              <path
                d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                fill="none"
                stroke={active ? 'var(--highlight)' : 'var(--muted-foreground)'}
                strokeOpacity={active ? 1 : 0.5}
                strokeWidth={active ? 3 : 2}
                markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'}
              />
              <circle
                className="step"
                cx={bx}
                cy={by}
                r={14}
                fill={active ? 'var(--primary)' : 'var(--card)'}
                stroke={step.rateLimiting ? 'var(--chart-5)' : step.irreversible ? 'var(--destructive)' : 'var(--border)'}
                strokeWidth={2}
              />
              <text
                x={bx}
                y={by + 4}
                textAnchor="middle"
                className={cn('text-[12px] font-semibold', active ? 'fill-primary-foreground' : 'fill-foreground')}
              >
                {i + 1}
              </text>
            </g>
          )
        })}

        {nodes.map((node, i) => {
          const lx = C + (R + 22) * Math.cos(node.angle)
          const ly = C + (R + 22) * Math.sin(node.angle)
          const anchor = Math.abs(Math.cos(node.angle)) < 0.3 ? 'middle' : Math.cos(node.angle) > 0 ? 'start' : 'end'
          const active = i === selected
          return (
            <g key={node.name} aria-hidden="true">
              <circle cx={node.x} cy={node.y} r={7} fill={active ? 'var(--highlight)' : 'var(--chart-1)'} />
              <text
                x={lx}
                y={ly + 4}
                textAnchor={anchor}
                className={cn('text-[12px] font-medium', active ? 'fill-highlight' : 'fill-foreground')}
              >
                {shortLabel(node.name)}
              </text>
            </g>
          )
        })}
      </svg>

      <ol className="grid gap-1.5 sm:grid-cols-2">
        {pathway.steps.map((step, i) => (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={i === selected}
              className={cn(
                'flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                i === selected ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent',
              )}
            >
              <span className="font-mono text-xs opacity-70">{i + 1}</span>
              <span className="truncate">{step.enzyme}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
