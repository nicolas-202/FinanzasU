import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = '' }
  }, [isOpen, onClose])

  if (!isOpen) return null
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className={`relative w-full ${sizes[size]} bg-surface-container-lowest rounded-2xl shadow-2xl shadow-black/10 animate-scale-in border border-outline-variant/20`}>
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/15">
          <h2 className="text-lg font-semibold font-headline text-on-surface">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[60vh] overflow-y-auto">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 p-5 border-t border-outline-variant/15">{footer}</div>}
      </div>
    </div>
  )
}
