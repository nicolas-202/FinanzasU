import type { ReactNode, HTMLAttributes } from 'react'

const variants = {
  default: 'bg-surface-container-lowest border border-outline-variant/20',
  elevated: 'bg-surface-container-lowest shadow-lg shadow-black/5 border border-outline-variant/10',
  outlined: 'bg-transparent border border-outline-variant/30',
  solid: 'bg-surface-container border border-outline-variant/15',
} as const

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants
  padding?: string
  animate?: boolean
}

export default function Card({
  children, variant = 'default', padding = 'p-5',
  className = '', animate = true, ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl ${variants[variant]} ${padding} ${animate ? 'animate-fade-in' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-base font-semibold font-headline text-on-surface ${className}`}>{children}</h3>
}
