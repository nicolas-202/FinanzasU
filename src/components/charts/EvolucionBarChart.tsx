import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatMoneda, formatCompacto } from '@/utils/formatMoneda'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { BarChart3 } from 'lucide-react'
import type { EvolucionMensual } from '@/types'

interface TooltipPayload { name: string; value: number; color: string }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container-lowest rounded-xl px-4 py-3 shadow-lg border border-outline-variant/15">
      <p className="text-sm font-semibold font-headline text-on-surface mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.name}: {formatMoneda(entry.value)}
        </p>
      ))}
    </div>
  )
}

export default function EvolucionBarChart({ data = [] }: { data?: EvolucionMensual[] }) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader><CardTitle>Evolución Mensual</CardTitle></CardHeader>
        <EmptyState icon={BarChart3} title="Sin datos" description="Los datos aparecerán cuando registres transacciones" />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Evolución Mensual</CardTitle></CardHeader>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e4" vertical={false} />
          <XAxis dataKey="mes_nombre" axisLine={false} tickLine={false} tick={{ fill: '#757684', fontSize: 12, fontWeight: 500 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#757684', fontSize: 12, fontWeight: 500 }} tickFormatter={formatCompacto} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-on-surface-variant font-medium">{value}</span>} />
          <Bar dataKey="ingresos" name="Ingresos" fill="#006d36" radius={[6, 6, 0, 0]} maxBarSize={40} />
          <Bar dataKey="gastos" name="Gastos" fill="#ba1a1a" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
