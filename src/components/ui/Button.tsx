import { type ButtonHTMLAttributes, type ElementType } from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'editorial-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02]',
  secondary: 'bg-surface-container-lowest text-on-surface border border-outline-variant/20 hover:bg-surface-container-low',
  danger: 'bg-error-container text-on-error-container border border-error/20 hover:bg-error/10',
  ghost: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
  accent: 'bg-secondary text-on-secondary shadow-lg shadow-secondary/20 hover:opacity-90 hover:scale-[1.02]',
} as const

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
  icon?: ElementType
  iconRight?: ElementType
}

export default function Button({
  children, variant = 'primary', size = 'md', loading = false,
  disabled = false, icon: Icon, iconRight: IconRight, className = '', ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-200 ease-out focus-ring cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4" />}
    </button>
  )
}
