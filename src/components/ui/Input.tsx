import { useState, type InputHTMLAttributes, type ElementType } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ElementType
}

export default function Input({
  label, error, icon: Icon, type = 'text', className = '', id, ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

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
        <input
          id={id}
          type={inputType}
          className={`
            w-full rounded-xl bg-surface-container-lowest border text-on-surface
            placeholder:text-outline/50 transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-primary-fixed focus:border-primary
            ${Icon ? 'pl-12' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} py-3.5 text-sm
            ${error ? 'border-error focus:ring-error-container focus:border-error' : 'border-outline-variant/20'}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-error ml-1 animate-slide-down">{error}</p>}
    </div>
  )
}
