'use client'

import { useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, Segmented } from '@/components/ui-kit'
import { RangeControl } from '@/components/charts/range-control'
import { axisTick, chartTooltipProps } from '@/components/charts/chart-theme'

type Inhibition = 'ninguna' | 'competitiva' | 'no-competitiva' | 'acompetitiva'
type View = 'mm' | 'lb'

const descriptions: Record<Inhibition, string> = {
  ninguna: 'Sin inhibidor: la curva hiperbólica alcanza Vmax y Km es la [S] a la mitad de Vmax.',
  competitiva: 'Competitiva: Km aparente aumenta (α·Km), Vmax no cambia. Se revierte con exceso de sustrato. En Lineweaver-Burk las rectas se cruzan en el eje Y.',
  'no-competitiva': 'No competitiva pura: Vmax aparente disminuye (Vmax/α), Km no cambia. Las rectas se cruzan en el eje X.',
  acompetitiva: 'Acompetitiva: el inhibidor se une solo al complejo ES; disminuyen Km y Vmax en la misma proporción. Rectas paralelas.',
}

export function KineticsChart() {
  const [vmax, setVmax] = useState(100)
  const [km, setKm] = useState(5)
  const [inhibition, setInhibition] = useState<Inhibition>('competitiva')
  const [inhibitor, setInhibitor] = useState(2)
  const [view, setView] = useState<View>('mm')
  const ki = 2
  const alpha = 1 + inhibitor / ki

  const appKm = inhibition === 'competitiva' ? km * alpha : inhibition === 'acompetitiva' ? km / alpha : km
  const appVmax = inhibition === 'no-competitiva' || inhibition === 'acompetitiva' ? vmax / alpha : vmax
  const hasInhibitor = inhibition !== 'ninguna'

  const mmData = Array.from({ length: 41 }, (_, i) => {
    const s = i * 1
    return {
      s,
      'Sin inhibidor': +((vmax * s) / (km + s)).toFixed(2),
      ...(hasInhibitor ? { 'Con inhibidor': +((appVmax * s) / (appKm + s)).toFixed(2) } : {}),
    }
  })

  const lbData = Array.from({ length: 30 }, (_, i) => {
    const invS = -0.6 + i * 0.05
    return {
      invS: +invS.toFixed(2),
      'Sin inhibidor': +((km / vmax) * invS + 1 / vmax).toFixed(4),
      ...(hasInhibitor ? { 'Con inhibidor': +((appKm / appVmax) * invS + 1 / appVmax).toFixed(4) } : {}),
    }
  })

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cinética enzimática</h2>
          <p className="text-sm text-muted-foreground">Michaelis-Menten y doble recíproco de Lineweaver-Burk</p>
        </div>
        <Segmented
          label="Tipo de gráfica"
          value={view}
          onChange={setView}
          options={[
            { value: 'mm', label: 'Michaelis-Menten' },
            { value: 'lb', label: 'Lineweaver-Burk' },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="h-72 sm:h-80" role="img" aria-label={`Gráfica de ${view === 'mm' ? 'Michaelis-Menten' : 'Lineweaver-Burk'} con Km ${km} y Vmax ${vmax}`}>
          <ResponsiveContainer width="100%" height="100%">
            {view === 'mm' ? (
              <LineChart data={mmData} margin={{ top: 8, right: 12, bottom: 16, left: -8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="s" tick={axisTick} stroke="var(--border)" label={{ value: '[S] (mM)', position: 'insideBottom', offset: -8, fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis tick={axisTick} stroke="var(--border)" domain={[0, Math.ceil(vmax * 1.1)]} />
                <Tooltip {...chartTooltipProps} cursor={{ stroke: 'var(--border)' }} labelFormatter={(v) => `[S] = ${v} mM`} />
                <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine y={vmax} stroke="var(--chart-1)" strokeDasharray="4 4" />
                <ReferenceLine x={km} stroke="var(--chart-1)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="Sin inhibidor" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
                {hasInhibitor && <Line type="monotone" dataKey="Con inhibidor" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />}
              </LineChart>
            ) : (
              <LineChart data={lbData} margin={{ top: 8, right: 12, bottom: 16, left: -4 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="invS" type="number" domain={[-0.6, 0.85]} tick={axisTick} stroke="var(--border)" label={{ value: '1/[S]', position: 'insideBottom', offset: -8, fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis tick={axisTick} stroke="var(--border)" tickFormatter={(v) => v.toFixed(2)} />
                <Tooltip {...chartTooltipProps} cursor={{ stroke: 'var(--border)' }} labelFormatter={(v) => `1/[S] = ${v}`} />
                <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine x={0} stroke="var(--muted-foreground)" />
                <ReferenceLine y={0} stroke="var(--muted-foreground)" />
                <Line type="linear" dataKey="Sin inhibidor" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
                {hasInhibitor && <Line type="linear" dataKey="Con inhibidor" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4">
          <RangeControl label="Vmax" value={vmax} min={20} max={200} step={5} unit="µmol/min" onChange={setVmax} />
          <RangeControl label="Km" value={km} min={1} max={20} step={0.5} unit="mM" onChange={setKm} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inhibition" className="text-sm font-medium">
              Tipo de inhibición
            </label>
            <select
              id="inhibition"
              value={inhibition}
              onChange={(e) => setInhibition(e.target.value as Inhibition)}
              className="min-h-11 rounded-lg border border-input bg-background px-3 text-base"
            >
              <option value="ninguna">Ninguna</option>
              <option value="competitiva">Competitiva</option>
              <option value="no-competitiva">No competitiva</option>
              <option value="acompetitiva">Acompetitiva</option>
            </select>
          </div>
          {hasInhibitor && <RangeControl label="[Inhibidor]" value={inhibitor} min={0} max={10} step={0.5} unit="mM" onChange={setInhibitor} />}
          <dl className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-3 text-sm">
            <dt className="text-muted-foreground">Km aparente</dt>
            <dd className="text-right font-mono">{appKm.toFixed(2)} mM</dd>
            <dt className="text-muted-foreground">Vmax aparente</dt>
            <dd className="text-right font-mono">{appVmax.toFixed(1)}</dd>
          </dl>
        </div>
      </div>
      <p className="mt-4 rounded-lg bg-accent p-3 text-sm leading-relaxed text-accent-foreground">{descriptions[inhibition]}</p>
    </Card>
  )
}
