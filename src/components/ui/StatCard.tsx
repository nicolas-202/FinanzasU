import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import Card from './Card'

interface StatCardProps {
  title: string
  value: string
  icon?: LucideIcon
  trend?: number
  trendLabel?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'solid'
  className?: string
}

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, variant = 'elevated', className = '' }: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined) return null
    if (trend > 0) return <TrendingUp className="w-3.5 h-3.5" />
    if (trend < 0) return <TrendingDown className="w-3.5 h-3.5" />
    return <Minus className="w-3.5 h-3.5" />
  }

  const getTrendColor = () => {
    if (trend === undefined) return 'text-outline'
    if (trend > 0) return 'text-secondary'
    if (trend < 0) return 'text-error'
    return 'text-outline'
  }

  return (
    <Card variant={variant} className={`animate-slide-up ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-on-surface-variant font-medium">{title}</p>
          <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">{value}</p>
          {(trend !== undefined || trendLabel) && (
            <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendLabel || `${Math.abs(trend || 0)}%`}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-primary-fixed text-primary">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  )
}
