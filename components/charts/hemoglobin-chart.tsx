'use client'

import { useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '@/components/ui-kit'
import { RangeControl } from '@/components/charts/range-control'
import { axisTick, chartTooltipProps } from '@/components/charts/chart-theme'

function hill(po2: number, p50: number, n: number) {
  return (100 * Math.pow(po2, n)) / (Math.pow(p50, n) + Math.pow(po2, n))
}

export function HemoglobinChart() {
  const [ph, setPh] = useState(7.4)
  const [bpg, setBpg] = useState(5)
  const [temp, setTemp] = useState(37)
  const [co2, setCo2] = useState(40)

  const p50 = Math.max(
    10,
    26.8 * Math.pow(10, 0.48 * (7.4 - ph)) * (1 + 0.06 * (bpg - 5)) * (1 + 0.024 * (temp - 37)) * (1 + 0.004 * (co2 - 40)),
  )

  const data = Array.from({ length: 51 }, (_, i) => {
    const p = i * 2
    return {
      pO2: p,
      Normal: +hill(p, 26.8, 2.7).toFixed(1),
      Ajustada: +hill(p, p50, 2.7).toFixed(1),
      Mioglobina: +hill(p, 2.8, 1).toFixed(1),
    }
  })

  const shift = p50 > 27.5 ? 'derecha (menor afinidad, más liberación de O₂ a los tejidos)' : p50 < 26 ? 'izquierda (mayor afinidad, menos liberación de O₂)' : 'sin desplazamiento significativo'

  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Curva de disociación del oxígeno</h2>
        <p className="text-sm text-muted-foreground">Efecto Bohr, 2,3-BPG y temperatura sobre la afinidad de la hemoglobina</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="h-72 sm:h-80" role="img" aria-label={`Curva de saturación de hemoglobina con P50 de ${p50.toFixed(1)} mmHg`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 16, left: -8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="pO2" tick={axisTick} stroke="var(--border)" label={{ value: 'pO₂ (mmHg)', position: 'insideBottom', offset: -8, fill: 'var(--muted-foreground)', fontSize: 12 }} />
              <YAxis tick={axisTick} stroke="var(--border)" domain={[0, 100]} unit="%" />
              <Tooltip {...chartTooltipProps} cursor={{ stroke: 'var(--border)' }} labelFormatter={(v) => `pO₂ = ${v} mmHg`} formatter={(v) => `${v}%`} />
              <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine y={50} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="Mioglobina" stroke="var(--chart-4)" strokeWidth={2} dot={false} strokeDasharray="5 4" />
              <Line type="monotone" dataKey="Normal" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Ajustada" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-4">
          <RangeControl label="pH" value={ph} min={7} max={7.8} step={0.05} onChange={setPh} />
          <RangeControl label="2,3-BPG" value={bpg} min={0} max={10} step={0.5} unit="mM" onChange={setBpg} />
          <RangeControl label="Temperatura" value={temp} min={32} max={42} step={0.5} unit="°C" onChange={setTemp} />
          <RangeControl label="pCO₂" value={co2} min={20} max={80} step={5} unit="mmHg" onChange={setCo2} />
          <dl className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-3 text-sm">
            <dt className="text-muted-foreground">P50 normal</dt>
            <dd className="text-right font-mono">26,8 mmHg</dd>
            <dt className="text-muted-foreground">P50 ajustada</dt>
            <dd className="text-right font-mono">{p50.toFixed(1).replace('.', ',')} mmHg</dd>
          </dl>
        </div>
      </div>
      <p className="mt-4 rounded-lg bg-accent p-3 text-sm leading-relaxed text-accent-foreground" aria-live="polite">
        Desplazamiento hacia la {shift}. La mioglobina (hipérbola) tiene mucha más afinidad y no muestra cooperatividad.
      </p>
    </Card>
  )
}
