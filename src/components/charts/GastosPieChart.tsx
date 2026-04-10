import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { COLORES_GRAFICAS } from '@/utils/constants'
import { formatMoneda } from '@/utils/formatMoneda'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { PieChart as PieIcon } from 'lucide-react'
import type { GastoPorCategoria } from '@/types'

interface TooltipPayload {
  name: string
  value: number
  payload: GastoPorCategoria
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-surface-container-lowest rounded-xl px-4 py-3 shadow-lg border border-outline-variant/15">
      <p className="text-sm font-semibold font-headline text-on-surface">{d.payload.categoria_icono} {d.name}</p>
      <p className="text-xs text-on-surface-variant mt-1">{formatMoneda(d.value)} · {d.payload.porcentaje}%</p>
    </div>
  )
}

export default function GastosPieChart({ data = [] }: { data?: GastoPorCategoria[] }) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader><CardTitle>Gastos por Categoría</CardTitle></CardHeader>
        <EmptyState icon={PieIcon} title="Sin gastos" description="Registra gastos para ver la distribución" />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Gastos por Categoría</CardTitle></CardHeader>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="total" nameKey="categoria_nombre" paddingAngle={3} animationBegin={0} animationDuration={800}>
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORES_GRAFICAS[i % COLORES_GRAFICAS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-on-surface-variant font-medium">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
