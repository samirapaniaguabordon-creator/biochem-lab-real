'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, Segmented } from '@/components/ui-kit'
import { axisTick, chartTooltipProps } from '@/components/charts/chart-theme'

const glucoseData = [
  { etapa: 'Glucólisis', ATP: 2, NADH: 5, FADH2: 0 },
  { etapa: 'Piruvato DH', ATP: 0, NADH: 5, FADH2: 0 },
  { etapa: 'Krebs', ATP: 2, NADH: 15, FADH2: 3 },
]

const fuelData = [
  { sustrato: 'Glucosa (6C)', atp: 32 },
  { sustrato: 'Palmitato (16C)', atp: 106 },
  { sustrato: 'β-hidroxibutirato', atp: 21.5 },
  { sustrato: 'Acetoacetato', atp: 19 },
  { sustrato: 'Glucólisis anaerobia', atp: 2 },
]

export function EnergyChart() {
  const [view, setView] = useState<'glucosa' | 'sustratos'>('glucosa')
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Rendimiento energético</h2>
          <p className="text-sm text-muted-foreground">ATP obtenido por etapa y por sustrato (valores P/O actuales: NADH 2,5 · FADH₂ 1,5)</p>
        </div>
        <Segmented
          label="Vista de rendimiento"
          value={view}
          onChange={setView}
          options={[
            { value: 'glucosa', label: 'Oxidación de glucosa' },
            { value: 'sustratos', label: 'Comparar sustratos' },
          ]}
        />
      </div>
      <div className="h-72 sm:h-80" role="img" aria-label={view === 'glucosa' ? 'ATP por etapa de la oxidación de glucosa, total 32 ATP' : 'Comparación de ATP por sustrato'}>
        <ResponsiveContainer width="100%" height="100%">
          {view === 'glucosa' ? (
            <BarChart data={glucoseData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="etapa" tick={axisTick} stroke="var(--border)" />
              <YAxis tick={axisTick} stroke="var(--border)" />
              <Tooltip {...chartTooltipProps} formatter={(v) => `${v} ATP`} />
              <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="ATP" name="ATP/GTP directo" stackId="a" fill="var(--chart-1)" />
              <Bar dataKey="NADH" name="Vía NADH" stackId="a" fill="var(--chart-2)" />
              <Bar dataKey="FADH2" name="Vía FADH₂" stackId="a" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={fuelData} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={axisTick} stroke="var(--border)" />
              <YAxis type="category" dataKey="sustrato" tick={axisTick} stroke="var(--border)" width={120} />
              <Tooltip {...chartTooltipProps} formatter={(v) => [`${v} ATP`, 'Rendimiento']} />
              <Bar dataKey="atp" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <p className="mt-4 rounded-lg bg-accent p-3 text-sm leading-relaxed text-accent-foreground">
        {view === 'glucosa'
          ? 'Total por glucosa ≈ 32 ATP (30 si los NADH citosólicos usan la lanzadera de glicerol-fosfato). La mayor parte proviene de la fosforilación oxidativa.'
          : 'Los ácidos grasos rinden más ATP por carbono porque están más reducidos. La glucólisis anaerobia rinde solo 2 ATP, pero es rápida y no requiere O₂.'}
      </p>
    </Card>
  )
}
