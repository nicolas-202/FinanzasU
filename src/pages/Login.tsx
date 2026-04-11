import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '@/services/authService'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = (): boolean => {
    const e: typeof errors = {}
    if (!email) e.email = 'El correo es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Correo no válido'
    if (!password) e.password = 'La contraseña es obligatoria'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      await signIn(email, password)
      toast.success('¡Bienvenido de vuelta!')
      navigate('/')
    } catch {
      toast.error('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background font-body text-on-surface min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="flex min-h-screen">
        <section className="hidden lg:flex lg:w-1/2 relative editorial-gradient items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary blur-[120px]" />
          </div>

          <div className="relative z-10 p-16 max-w-2xl">
            <div className="mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white font-label text-sm backdrop-blur-md mb-6">
                Diseñado para estudiantes universitarios
              </span>
              <h1 className="font-headline font-extrabold text-white text-5xl xl:text-6xl tracking-tighter leading-tight whitespace-nowrap mb-8">
                Finanzas ágiles y claras.
              </h1>
              <p className="text-on-primary-container text-xl leading-relaxed font-medium">
                Impulsamos a la nueva generación de líderes académicos con herramientas financieras inteligentes y fáciles de usar.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <img
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-fixed"
                  alt="Julian Rivera"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr9SH9qlaaKjg5SRoKCHWfWdcz-TmvRcj_YcZk2MUXkIY8uTuSleyt6ONk-zeXpzvRlWWnICRGxHaMeFx1nWbnzUGoOHIQHeoKdBvZJHNMrW0RYzXOkHwpxJt_eUbHCuAqNIc2j0GFjirSxrZTkQpiSPdXk9pNvCS3emLkV9rPGxONgoqtDKKBta5j9IOFQtcWFJBSZO_n4SBAC1vuehkouZZM5c89AACLmFFuurT5W4XwnqeXd6rZFSWX5vpQceM_ME3kPjuvRGM"
                />
                <div>
                  <p className="text-white font-semibold">Julian Rivera</p>
                  <p className="text-white/60 text-sm">Estudiante de Economía, UNAM</p>
                </div>
              </div>
              <p className="text-white text-lg italic leading-snug">
                "FinanzasU cambió mi forma de ver mi presupuesto. No es solo un registro; es una guía que habla mi idioma."
              </p>
            </div>
          </div>

          <div className="absolute bottom-12 left-16 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-fixed text-xl">account_balance_wallet</span>
            </div>
            <span className="font-headline font-bold text-white text-xl tracking-tighter">FinanzasU</span>
          </div>
        </section>

        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-surface">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-lg editorial-gradient flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
              </div>
              <span className="font-headline font-extrabold text-primary text-2xl tracking-tighter">FinanzasU</span>
            </div>

            <div className="mb-10">
              <h2 className="font-headline font-extrabold text-on-surface text-4xl tracking-tight mb-3">Bienvenido de nuevo.</h2>
              <p className="text-on-surface-variant font-medium">Continúa tu camino hacia la libertad financiera.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="email">Correo universitario</label>
                <div className="login-field-wrap relative group">
                  <span className="material-symbols-outlined login-field-icon text-outline group-focus-within:text-primary transition-colors">alternate_email</span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@universidad.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors((p) => ({ ...p, email: undefined }))
                    }}
                    className={`login-input w-full pl-12 pr-4 py-4 bg-surface-container-lowest border rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all duration-200 placeholder:text-outline/50 outline-none ${
                      errors.email ? 'border-error' : 'border-outline-variant/20'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-error ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-sm font-semibold text-on-surface" htmlFor="password">Contraseña</label>
                  <a className="text-xs font-bold text-primary hover:text-primary-container transition-colors" href="#">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="login-field-wrap relative group">
                  <span className="material-symbols-outlined login-field-icon text-outline group-focus-within:text-primary transition-colors">lock</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrors((p) => ({ ...p, password: undefined }))
                    }}
                    className={`login-input w-full pl-12 pr-12 py-4 bg-surface-container-lowest border rounded-xl focus:ring-4 focus:ring-primary-fixed focus:border-primary transition-all duration-200 placeholder:text-outline/50 outline-none ${
                      errors.password ? 'border-error' : 'border-outline-variant/20'
                    }`}
                  />
                  <button className="login-plain-btn login-field-action text-outline hover:text-on-surface" onClick={() => setShowPassword(!showPassword)} type="button">
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {errors.password && <p className="text-xs text-error ml-1">{errors.password}</p>}
              </div>

              <div className="flex items-center gap-3 px-1 py-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="login-checkbox w-5 h-5 rounded border-outline-variant/30 text-primary focus:ring-primary"
                />
                <label className="text-sm font-medium text-on-surface-variant" htmlFor="remember">Recordarme en este dispositivo</label>
              </div>

              <button className="w-full py-4 editorial-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-lg disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading} type="submit">
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-on-surface-variant font-medium">
                ¿Nuevo en FinanzasU?
                <Link className="text-primary font-bold hover:underline ml-1" to="/register">Crear una cuenta</Link>
              </p>
            </div>

            <div className="mt-20 flex justify-center opacity-30">
              <svg fill="none" height="40" viewBox="0 0 120 40" width="120">
                <path d="M0 35C20 35 30 5 60 5C90 5 100 35 120 35" stroke="#006d36" strokeLinecap="round" strokeWidth="8" />
                <path d="M0 35C20 35 30 5 60 5" stroke="#83fba5" strokeLinecap="round" strokeWidth="8" />
              </svg>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 hidden md:block">
        <div className="flex gap-6 text-[10px] font-label text-outline uppercase tracking-widest">
          <a className="hover:text-primary transition-colors" href="#">Política de privacidad</a>
          <a className="hover:text-primary transition-colors" href="#">Términos del servicio</a>
          <a className="hover:text-primary transition-colors" href="#">Cookies</a>
        </div>
      </footer>
    </div>
  )
}
