import { type SelectHTMLAttributes, type ElementType } from 'react'
import { ChevronDown } from 'lucide-react'
import type { SelectOption } from '@/types'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  icon?: ElementType
  options?: SelectOption[]
  placeholder?: string
}

export default function Select({
  label, error, icon: Icon, options = [], placeholder = 'Seleccionar...',
  className = '', id, ...props
}: SelectProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-on-surface ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors pointer-events-none" />
        )}
        <select
          id={id}
          className={`
            w-full rounded-xl bg-surface-container-lowest border text-on-surface
            appearance-none transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-4 focus:ring-primary-fixed focus:border-primary
            ${Icon ? 'pl-12' : 'pl-4'} pr-10 py-3.5 text-sm
            ${error ? 'border-error' : 'border-outline-variant/20'}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
      </div>
      {error && <p className="text-xs text-error ml-1 animate-slide-down">{error}</p>}
    </div>
  )
}
