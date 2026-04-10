import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Tag, PiggyBank, User, LogOut, X, Wallet, ChartColumn } from 'lucide-react'
import { signOut } from '@/services/authService'
import toast from 'react-hot-toast'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transacciones', label: 'Transacciones', icon: ArrowLeftRight },
  { to: '/categorias', label: 'Categorías', icon: Tag },
  { to: '/presupuestos', label: 'Presupuestos', icon: PiggyBank },
  { to: '/analisis', label: 'Análisis', icon: ChartColumn },
  { to: '/perfil', label: 'Mi Perfil', icon: User },
]

interface NavbarProps { isOpen: boolean; onClose: () => void }

export default function Navbar({ isOpen, onClose }: NavbarProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await signOut(); toast.success('Sesión cerrada'); navigate('/login') }
    catch { toast.error('Error al cerrar sesión') }
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={`
        fixed top-0 left-0 h-full w-[280px] bg-surface-container-lowest/95 backdrop-blur-xl
        border-r border-outline-variant/15 z-50 flex flex-col
        transition-transform duration-300 ease-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/15">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl editorial-gradient shadow-lg shadow-primary/15">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-headline text-primary tracking-tighter">FinanzasU</h1>
              <p className="text-[10px] text-outline tracking-wider uppercase">Tu dinero, tu control</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-surface-container text-outline transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} end={to === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'editorial-gradient text-white shadow-lg shadow-primary/15'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }
              `}>
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-outline-variant/15">
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
              text-error hover:bg-error-container transition-all duration-200 cursor-pointer">
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
