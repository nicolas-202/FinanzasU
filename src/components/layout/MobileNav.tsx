import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Tag, PiggyBank, User, ChartColumn } from 'lucide-react'

const links = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/transacciones', label: 'Movimientos', icon: ArrowLeftRight },
  { to: '/categorias', label: 'Categorías', icon: Tag },
  { to: '/analisis', label: 'Análisis', icon: ChartColumn },
  { to: '/presupuestos', label: 'Presupuesto', icon: PiggyBank },
  { to: '/perfil', label: 'Perfil', icon: User },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass border-t border-outline-variant/15">
      <div className="flex items-center justify-around py-2 px-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => `
              flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[56px] transition-all duration-200
              ${isActive ? 'text-primary' : 'text-outline hover:text-on-surface-variant'}
            `}>
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-primary-fixed' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
