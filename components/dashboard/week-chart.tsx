'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useStore } from '@/lib/store'
import { lastNDays } from '@/lib/stats'
import { chartTooltipProps } from '@/components/charts/chart-theme'

export function WeekChart({ days = 7, height = 180 }: { days?: number; height?: number }) {
  const { state } = useStore()
  const data = lastNDays(state, days)
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} allowDecimals />
          <Tooltip {...chartTooltipProps} formatter={(v) => [`${v} h`, 'Estudio']} />
          <Bar dataKey="horas" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
