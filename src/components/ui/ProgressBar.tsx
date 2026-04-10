interface ProgressBarProps {
  porcentaje?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export default function ProgressBar({ porcentaje = 0, size = 'md', showLabel = true, className = '' }: ProgressBarProps) {
  const clamped = Math.min(Math.max(porcentaje, 0), 150)
  const display = Math.min(clamped, 100)

  let colorClass = 'bg-secondary'
  if (clamped >= 100) colorClass = 'bg-error'
  else if (clamped >= 80) colorClass = 'bg-warning'

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-on-surface-variant">{porcentaje.toFixed(0)}% usado</span>
          {porcentaje >= 80 && (
            <span className={`text-xs font-medium ${porcentaje >= 100 ? 'text-error' : 'text-warning'}`}>
              {porcentaje >= 100 ? '¡Excedido!' : 'Cerca del límite'}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-surface-container-high rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${display}%`, animation: 'progressFill 0.8s ease-out' }}
        />
      </div>
    </div>
  )
}
