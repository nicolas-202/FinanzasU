import { type ElementType } from 'react'
import Button from './Button'

interface EmptyStateProps {
  icon?: ElementType
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({
  icon: Icon, title = 'Sin datos', description = 'No hay información para mostrar.',
  actionLabel, onAction, className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in ${className}`}>
      {Icon && (
        <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 mb-4">
          <Icon className="w-8 h-8 text-outline" />
        </div>
      )}
      <h3 className="text-lg font-semibold font-headline text-on-surface mb-1">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">{actionLabel}</Button>
      )}
    </div>
  )
}
