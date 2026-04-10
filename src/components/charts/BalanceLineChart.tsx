import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Line, ComposedChart } from 'recharts'
import { formatMoneda, formatCompacto } from '@/utils/formatMoneda'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import { TrendingUp } from 'lucide-react'
import type { EvolucionMensual } from '@/types'

interface TooltipPayload { value: number }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container-lowest rounded-xl px-4 py-3 shadow-lg border border-outline-variant/15">
      <p className="text-sm font-semibold font-headline text-on-surface mb-1">{label}</p>
      <p className="text-xs font-semibold text-primary">Balance: {formatMoneda(payload[0]?.value || 0)}</p>
    </div>
  )
}

export default function BalanceLineChart({ data = [] }: { data?: EvolucionMensual[] }) {
  const dataConBalance = data.map((d) => ({
    ...d,
    balance: Number(d.ingresos || 0) - Number(d.gastos || 0),
  }))

  if (!dataConBalance.length) {
    return (
      <Card>
        <CardHeader><CardTitle>Balance Histórico</CardTitle></CardHeader>
        <EmptyState icon={TrendingUp} title="Sin historial" description="El balance aparecerá con tus transacciones" />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Balance Histórico</CardTitle></CardHeader>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={dataConBalance}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#24389c" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#24389c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e4" vertical={false} />
          <XAxis dataKey="mes_nombre" axisLine={false} tickLine={false} tick={{ fill: '#757684', fontSize: 12, fontWeight: 500 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#757684', fontSize: 12, fontWeight: 500 }} tickFormatter={formatCompacto} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="balance" fill="url(#balanceGradient)" stroke="transparent" />
          <Line type="monotone" dataKey="balance" stroke="#24389c" strokeWidth={2.5}
            dot={{ fill: '#24389c', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#24389c', stroke: '#ffffff', strokeWidth: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  )
}
