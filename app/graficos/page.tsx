import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui-kit'
import { KineticsChart } from '@/components/charts/kinetics-chart'
import { HemoglobinChart } from '@/components/charts/hemoglobin-chart'
import { EnergyChart } from '@/components/charts/energy-chart'

export const metadata: Metadata = { title: 'Gráficos' }

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Módulo 5"
        title="Gráficos interactivos"
        description="Manipula los parámetros y observa cómo cambian la cinética enzimática, la afinidad de la hemoglobina y el rendimiento energético."
      />
      <div className="flex flex-col gap-6">
        <KineticsChart />
        <HemoglobinChart />
        <EnergyChart />
      </div>
    </div>
  )
}
