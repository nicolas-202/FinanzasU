import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
import { useAuth } from '@/contexts/AuthContext'
import { obtenerSaludo, fechaActualFormateada } from '@/utils/dateHelpers'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userName } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Navbar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 glass border-b border-outline-variant/15">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold font-headline text-on-surface">
                  {obtenerSaludo()}, <span className="text-primary">{userName}</span>
                </h2>
                <p className="text-xs text-outline capitalize">{fechaActualFormateada()}</p>
              </div>
            </div>
            <button className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer relative">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
