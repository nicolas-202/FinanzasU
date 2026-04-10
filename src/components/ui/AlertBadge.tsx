import type { EstadoPresupuesto } from '@/types'

const estados: Record<EstadoPresupuesto, { bg: string; border: string; text: string; dot: string }> = {
  verde: { bg: 'bg-secondary/10', border: 'border-secondary/30', text: 'text-secondary', dot: 'bg-secondary' },
  amarillo: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', dot: 'bg-warning' },
  rojo: { bg: 'bg-error/10', border: 'border-error/30', text: 'text-error', dot: 'bg-error' },
}

interface AlertBadgeProps {
  estado?: EstadoPresupuesto
  label: string
  pulse?: boolean
  className?: string
}

export default function AlertBadge({ estado = 'verde', label, pulse = false, className = '' }: AlertBadgeProps) {
  const s = estados[estado]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.border} ${s.text} border ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${pulse ? 'animate-pulse-soft' : ''}`} />
      {label}
    </span>
  )
}
