import { useState, type FormEvent } from 'react'
import { User, Mail, Lock, Shield, School, BellRing, Star, BadgeCheck, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { updateProfile, updatePassword } from '@/services/authService'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function Perfil() {
  const { userName, userEmail } = useAuth()
  const [nombre, setNombre] = useState(userName)
  const [profileLoading, setProfileLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [alertsDiarias, setAlertsDiarias] = useState(true)
  const [resumenSemanal, setResumenSemanal] = useState(true)
  const [novedadesSistema, setNovedadesSistema] = useState(false)

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) { toast.error('El nombre no puede estar vacío'); return }
    try {
      setProfileLoading(true)
      await updateProfile(nombre)
      toast.success('Perfil actualizado')
    } catch { toast.error('Error al actualizar perfil') }
    finally { setProfileLoading(false) }
  }

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) { toast.error('La contraseña debe tener mínimo 6 caracteres'); return }
    if (newPassword !== confirmPassword) { toast.error('Las contraseñas no coinciden'); return }
    try {
      setPasswordLoading(true)
      await updatePassword(newPassword)
      toast.success('Contraseña actualizada')
      setNewPassword(''); setConfirmPassword('')
    } catch { toast.error('Error al cambiar contraseña') }
    finally { setPasswordLoading(false) }
  }

  return (
    <div className="space-y-10 animate-fade-in pb-14">
      <header className="relative px-4 md:px-8 pt-8 pb-14 md:pb-16 bg-surface overflow-hidden rounded-3xl border border-outline-variant/10">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-primary rounded-full blur-[120px] -mr-32 -mt-32" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 relative z-10 text-center md:text-left">
          <div className="relative group">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white md:rotate-3 md:group-hover:rotate-0 transition-transform duration-500 editorial-gradient flex items-center justify-center">
              <span className="text-white text-5xl md:text-6xl font-headline font-black">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 md:translate-x-0 md:-right-2 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter shadow-lg flex items-center gap-1">
              <Star className="w-3.5 h-3.5" /> PREMIUM
            </div>
          </div>

          <div className="flex-1">
            <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-primary tracking-tighter mb-2">{userName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
              <span className="text-on-surface-variant font-medium flex items-center gap-1 text-sm md:text-base">
                <School className="w-4 h-4" /> Estudiante Universitario
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/40 hidden md:block" />
              <span className="text-on-surface-variant font-medium text-sm md:text-base">FinanzasU</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[2rem] shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-lg md:text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Identidad personal
              </h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-outline tracking-widest px-1">Nombre completo</label>
                <Input id="perfil-nombre" icon={User} value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-outline tracking-widest px-1">Correo universitario</label>
                <Input id="perfil-email" icon={Mail} value={userEmail} disabled className="opacity-80 bg-surface-container-low" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" loading={profileLoading} size="md">Guardar datos personales</Button>
              </div>
            </form>
          </div>

          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[2rem] shadow-xl shadow-black/5">
            <h3 className="font-headline font-bold text-lg md:text-xl mb-8 flex items-center gap-2">
              <School className="w-5 h-5 text-primary" /> Contexto académico
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-primary-fixed/40 p-6 rounded-3xl border border-primary-fixed-dim/40 flex flex-col justify-between min-h-[120px]">
                <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Semestre actual</span>
                <p className="text-xl md:text-2xl font-headline font-black text-primary truncate">Intermedio</p>
              </div>
              <div className="bg-secondary-container/40 p-6 rounded-3xl border border-secondary/15 flex flex-col justify-between min-h-[120px]">
                <span className="text-[10px] font-bold text-secondary/70 uppercase tracking-widest">Meta de grado</span>
                <p className="text-xl md:text-2xl font-headline font-black text-secondary truncate">2027</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20 flex flex-col justify-between min-h-[120px]">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Estado académico</span>
                <p className="text-xl md:text-2xl font-headline font-black text-on-surface truncate">Activo</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem]">
            <h3 className="font-headline font-bold text-lg md:text-xl mb-8 flex items-center gap-2 text-primary">
              <Shield className="w-5 h-5" /> Seguridad y control
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <Input
                id="perfil-new-pwd"
                label="Nueva clave"
                type="password"
                icon={Lock}
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                id="perfil-confirm-pwd"
                label="Confirmar clave"
                type="password"
                icon={Lock}
                placeholder="Repite tu nueva clave"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="flex flex-col md:flex-row md:items-center gap-4 pt-2">
                <Button type="submit" loading={passwordLoading} variant="danger" size="md">Cambiar clave</Button>
                <button type="button" className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-error/15 text-error hover:bg-error hover:text-white rounded-2xl font-bold text-sm transition-all">
                  <Trash2 className="w-4 h-4" /> Cerrar cuenta
                </button>
              </div>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-primary text-white p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-primary/20">
            <h3 className="font-headline font-bold text-lg md:text-xl mb-6">Insignias de logro</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/20">
                <Star className="w-7 h-7 text-secondary-fixed" />
                <span className="text-[10px] font-bold uppercase leading-tight">Ahorro del mes</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/20">
                <BadgeCheck className="w-7 h-7 text-primary-fixed" />
                <span className="text-[10px] font-bold uppercase leading-tight">Meta cumplida</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/20">
                <Shield className="w-7 h-7 text-tertiary-fixed" />
                <span className="text-[10px] font-bold uppercase leading-tight">Cuenta segura</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-white/20 opacity-40 grayscale">
                <BellRing className="w-7 h-7" />
                <span className="text-[10px] font-bold uppercase leading-tight">Nivel experto</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors">Ver todos los logros</button>
          </div>

          <div className="bg-surface-container-low p-6 md:p-8 rounded-[2rem]">
            <h3 className="font-headline font-bold text-lg md:text-xl mb-6 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-primary" /> Reglas de notificación
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-bold truncate">Alertas diarias de presupuesto</p>
                  <p className="text-[10px] text-on-surface-variant">Seguimiento instantáneo de gasto</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAlertsDiarias((v) => !v)}
                  className={`w-10 h-6 rounded-full relative flex-shrink-0 cursor-pointer ${alertsDiarias ? 'bg-secondary' : 'bg-outline-variant/40'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alertsDiarias ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-bold truncate">Resumen semanal</p>
                  <p className="text-[10px] text-on-surface-variant">Lunes en la mañana</p>
                </div>
                <button
                  type="button"
                  onClick={() => setResumenSemanal((v) => !v)}
                  className={`w-10 h-6 rounded-full relative flex-shrink-0 cursor-pointer ${resumenSemanal ? 'bg-secondary' : 'bg-outline-variant/40'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${resumenSemanal ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-bold truncate">Novedades del sistema</p>
                  <p className="text-[10px] text-on-surface-variant">Actualizaciones importantes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNovedadesSistema((v) => !v)}
                  className={`w-10 h-6 rounded-full relative flex-shrink-0 cursor-pointer ${novedadesSistema ? 'bg-secondary' : 'bg-outline-variant/40'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${novedadesSistema ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
