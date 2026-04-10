import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AtSign, Lock, User, Wallet } from 'lucide-react'
import { signUp } from '@/services/authService'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!email) e.email = 'El correo es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Correo no válido'
    if (!password) e.password = 'La contraseña es obligatoria'
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (password !== confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      await signUp(email, password, nombre)
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/')
    } catch (err) {
      const msg = (err as Error).message
      if (msg?.includes('already registered')) toast.error('Este correo ya está registrado')
      else toast.error('Error al registrar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background font-body text-on-surface">
      {/* ═══ Panel visual ═══ */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #006d36 0%, #005227 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary blur-[120px]" />
        </div>
        <div className="relative z-10 p-16 max-w-2xl">
          <div className="mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white font-label text-sm backdrop-blur-md mb-6">
              Tu futuro financiero comienza aquí
            </span>
            <h1 className="font-headline font-extrabold text-white text-6xl tracking-tighter leading-tight mb-8">
              Únete a la<br />Comunidad<br />FinanzasU.
            </h1>
            <p className="text-secondary-fixed text-xl leading-relaxed font-medium">
              Miles de estudiantes ya controlan sus finanzas de manera inteligente. Crea tu cuenta en segundos.
            </p>
          </div>
          <div className="flex gap-8 text-white/80">
            <div><p className="text-3xl font-headline font-extrabold text-white">5K+</p><p className="text-sm">Estudiantes activos</p></div>
            <div><p className="text-3xl font-headline font-extrabold text-white">$2M</p><p className="text-sm">Ahorros generados</p></div>
            <div><p className="text-3xl font-headline font-extrabold text-white">15+</p><p className="text-sm">Universidades</p></div>
          </div>
        </div>
        <div className="absolute bottom-12 left-16 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <span className="font-headline font-bold text-white text-xl tracking-tighter">FinanzasU</span>
        </div>
      </section>

      {/* ═══ Panel del formulario ═══ */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-surface">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-lg editorial-gradient flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline font-extrabold text-primary text-2xl tracking-tighter">FinanzasU</span>
          </div>

          <div className="mb-10">
            <h2 className="font-headline font-extrabold text-on-surface text-4xl tracking-tight mb-3">
              Crear cuenta.
            </h2>
            <p className="text-on-surface-variant font-medium">
              Completa el formulario y comienza a gestionar tus finanzas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="reg-nombre">Nombre completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                <input id="reg-nombre" type="text" placeholder="Tu nombre completo" value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setErrors((p) => ({ ...p, nombre: '' })) }}
                  className={`w-full pl-12 pr-4 py-4 bg-surface-container-lowest border rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all duration-200 placeholder:text-outline/50 outline-none ${errors.nombre ? 'border-error' : 'border-outline-variant/20'}`} />
              </div>
              {errors.nombre && <p className="text-xs text-error ml-1 animate-slide-down">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="reg-email">Correo universitario</label>
              <div className="relative group">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                <input id="reg-email" type="email" placeholder="nombre@universidad.edu" value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
                  className={`w-full pl-12 pr-4 py-4 bg-surface-container-lowest border rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all duration-200 placeholder:text-outline/50 outline-none ${errors.email ? 'border-error' : 'border-outline-variant/20'}`} />
              </div>
              {errors.email && <p className="text-xs text-error ml-1 animate-slide-down">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="reg-password">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                <input id="reg-password" type="password" placeholder="Mínimo 6 caracteres" value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                  className={`w-full pl-12 pr-4 py-4 bg-surface-container-lowest border rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all duration-200 placeholder:text-outline/50 outline-none ${errors.password ? 'border-error' : 'border-outline-variant/20'}`} />
              </div>
              {errors.password && <p className="text-xs text-error ml-1 animate-slide-down">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="reg-confirm">Confirmar contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                <input id="reg-confirm" type="password" placeholder="Repite la contraseña" value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })) }}
                  className={`w-full pl-12 pr-4 py-4 bg-surface-container-lowest border rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all duration-200 placeholder:text-outline/50 outline-none ${errors.confirmPassword ? 'border-error' : 'border-outline-variant/20'}`} />
              </div>
              {errors.confirmPassword && <p className="text-xs text-error ml-1 animate-slide-down">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 editorial-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-on-surface-variant font-medium">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline ml-1">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
