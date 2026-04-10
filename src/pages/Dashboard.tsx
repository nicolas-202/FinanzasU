import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCompacto, formatMoneda } from '@/utils/formatMoneda'
import { MESES } from '@/utils/constants'
import Spinner from '@/components/ui/Spinner'
import { getTransacciones } from '@/services/transaccionesService'
import type { TopCategoria, Transaccion } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const ahora = new Date()
  const [mes, setMes] = useState(ahora.getMonth() + 1)
  const [anio, setAnio] = useState(ahora.getFullYear())
  const [recentTransacciones, setRecentTransacciones] = useState<Transaccion[]>([])
  const { userId } = useAuth()

  const {
    resumen, gastosPorCategoria, evolucionMensual,
    topCategorias, loading,
  } = useDashboard(mes, anio)

  const isLocalAuthMode =
    import.meta.env.VITE_AUTH_MODE === 'local' ||
    !import.meta.env.VITE_SUPABASE_URL ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY

  useEffect(() => {
    if (!userId || isLocalAuthMode) {
      setRecentTransacciones([])
      return
    }

    let active = true
    getTransacciones(userId, {}, 1, 4)
      .then((result) => {
        if (active) setRecentTransacciones(result.transacciones)
      })
      .catch(() => {
        if (active) setRecentTransacciones([])
      })

    return () => {
      active = false
    }
  }, [userId, isLocalAuthMode])

  const cambiarMes = (delta: number) => {
    let nuevoMes = mes + delta
    let nuevoAnio = anio
    if (nuevoMes > 12) { nuevoMes = 1; nuevoAnio++ }
    if (nuevoMes < 1) { nuevoMes = 12; nuevoAnio-- }
    setMes(nuevoMes)
    setAnio(nuevoAnio)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96"><Spinner size="lg" /></div>
  }

  const savingGoalTarget = Math.max(Number(resumen.total_ingresos) || 0, 1)
  const savingGoalCurrent = Math.max(Math.min(Number(resumen.balance) || 0, savingGoalTarget), 0)
  const savingGoalProgress = Math.min((savingGoalCurrent / savingGoalTarget) * 100, 100)

  const barsSource = evolucionMensual.slice(-5)
  const maxIngreso = Math.max(...barsSource.map((m) => Number(m.ingresos || 0)), 1)
  const maxGasto = Math.max(...barsSource.map((m) => Number(m.gastos || 0)), 1)

  const pieColors = ['#24389c', '#006d36', '#7c2500', '#3f51b5', '#4355b9']
  const pieData = (gastosPorCategoria.length ? gastosPorCategoria : topCategorias)
    .slice(0, 5)
    .map((item: TopCategoria | { categoria_nombre: string; total: number; porcentaje?: number }, i) => {
      const total = Number(item.total || 0)
      return {
        nombre: item.categoria_nombre,
        total,
        porcentaje: 0,
        color: pieColors[i % pieColors.length],
      }
    })

  const pieTotal = pieData.reduce((acc, item) => acc + item.total, 0)
  const pieWithPct = pieData.map((item) => ({
    ...item,
    porcentaje: pieTotal > 0 ? (item.total / pieTotal) * 100 : 0,
  }))

  let pieGradient = 'conic-gradient(#dee0ff 0% 100%)'
  if (pieWithPct.length > 0 && pieTotal > 0) {
    let current = 0
    const stops = pieWithPct.map((segment) => {
      const start = current
      current += segment.porcentaje
      return `${segment.color} ${start}% ${current}%`
    })
    pieGradient = `conic-gradient(${stops.join(', ')})`
  }

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-extrabold text-3xl tracking-tight text-on-surface">Vista General</h1>
          <p className="text-sm text-on-surface-variant mt-1">Tu panorama financiero del mes actual</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-sm border border-outline-variant/15">
          <button onClick={() => cambiarMes(-1)} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-bold font-headline text-primary min-w-[150px] text-center tracking-tight">
            {MESES[mes - 1]} {anio}
          </span>
          <button onClick={() => cambiarMes(1)} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-2 uppercase tracking-widest">Saldo Total Disponible</p>
            <h3 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tighter mb-6">{formatMoneda(resumen.balance, true)}</h3>
            <div className="flex flex-wrap gap-3">
              <button className="bg-secondary-fixed text-on-secondary-fixed px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
                <span className="material-symbols-outlined text-base">add_circle</span>
                Depositar
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-white/20 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-base">send</span>
                Transferir
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute right-20 top-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
        </section>

        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div>
            <div className="flex justify-between items-start mb-5">
              <h4 className="font-headline font-bold text-lg text-primary">Meta de ahorro mensual</h4>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight">Activa</span>
            </div>
            <p className="text-3xl font-headline font-bold text-on-surface mb-2">
              {formatMoneda(savingGoalCurrent)} <span className="text-sm text-outline font-normal">/ {formatMoneda(savingGoalTarget)}</span>
            </p>
          </div>
          <div className="space-y-3 mt-3">
            <div className="flex justify-between text-xs font-semibold text-outline uppercase tracking-wider">
              <span>Progreso</span>
              <span>{Math.round(savingGoalProgress)}%</span>
            </div>
            <div className="h-3 w-full bg-secondary-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${savingGoalProgress}%` }} />
            </div>
            <p className="text-[11px] text-outline italic">{savingGoalProgress >= 100 ? 'Meta cumplida este mes.' : `Faltan ${formatMoneda(Math.max(savingGoalTarget - savingGoalCurrent, 0))} para cumplirla.`}</p>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
          <h4 className="font-headline font-bold text-on-surface mb-8">Flujo Mensual</h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-secondary text-sm">arrow_downward</span>
                  <span className="text-xs font-bold text-outline uppercase tracking-tighter">Ingresos</span>
                </div>
                <p className="text-2xl font-headline font-bold text-on-surface">{formatMoneda(resumen.total_ingresos, true)}</p>
              </div>
              <div className="flex items-end gap-1.5 h-16 pt-2">
                {barsSource.map((item, idx) => {
                  const h = Math.max((Number(item.ingresos || 0) / maxIngreso) * 100, 8)
                  return (
                    <div
                      key={`ing-${idx}`}
                      className={`w-full rounded-t transition-all ${idx === barsSource.length - 1 ? 'bg-secondary' : 'bg-secondary/20 hover:bg-secondary/40'}`}
                      style={{ height: `${h}%` }}
                    />
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-tertiary text-sm">arrow_upward</span>
                  <span className="text-xs font-bold text-outline uppercase tracking-tighter">Gastos</span>
                </div>
                <p className="text-2xl font-headline font-bold text-on-surface">{formatMoneda(resumen.total_gastos, true)}</p>
              </div>
              <div className="flex items-end gap-1.5 h-16 pt-2">
                {barsSource.map((item, idx) => {
                  const h = Math.max((Number(item.gastos || 0) / maxGasto) * 100, 8)
                  return (
                    <div
                      key={`gas-${idx}`}
                      className={`w-full rounded-t transition-all ${idx === barsSource.length - 1 ? 'bg-tertiary' : 'bg-tertiary/20 hover:bg-tertiary/40'}`}
                      style={{ height: `${h}%` }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 flex-shrink-0">
            <div className="w-full h-full rounded-full" style={{ background: pieGradient }} />
            <div className="absolute inset-[18px] rounded-full bg-surface-container-lowest" />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xs text-outline font-bold uppercase tracking-widest">Total</span>
              <span className="text-sm font-headline font-bold text-on-surface">{formatCompacto(resumen.total_gastos)}</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <h4 className="font-headline font-bold text-on-surface mb-2">Gastos por Categoría</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {pieWithPct.length === 0 ? (
                <p className="text-sm text-on-surface-variant">Sin gastos para mostrar este mes.</p>
              ) : (
                pieWithPct.map((cat, idx) => (
                  <div key={`${cat.nombre}-${idx}`} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs font-medium text-on-surface-variant">{cat.nombre} ({Math.round(cat.porcentaje)}%)</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="font-headline font-bold text-2xl text-on-surface">Transacciones Recientes</h4>
            <p className="text-on-surface-variant text-sm">Tus últimos movimientos financieros</p>
        </div>
          <Link to="/transacciones" className="text-primary font-bold text-sm hover:underline">Ver Todo</Link>
      </div>

        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
          <div className="divide-y divide-outline-variant/10">
            {recentTransacciones.length === 0 ? (
              <div className="p-6 text-sm text-on-surface-variant">No hay transacciones recientes para mostrar.</div>
            ) : (
              recentTransacciones.map((t) => {
                const esIngreso = t.tipo === 'ingreso'
                return (
                  <div key={t.id} className="flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform text-xl">
                        {t.categorias?.icono || '💳'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-on-surface truncate">{t.descripcion || 'Movimiento'}</p>
                        <p className="text-xs text-outline truncate">{new Date(t.fecha).toLocaleDateString('es-CO')} • {t.categorias?.nombre || 'Sin categoría'}</p>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p className={`font-headline font-bold ${esIngreso ? 'text-secondary' : 'text-tertiary'}`}>
                        {esIngreso ? '+' : '-'}{formatMoneda(t.monto)}
                      </p>
                      <p className="text-[10px] text-outline font-bold uppercase tracking-tighter">{esIngreso ? 'Ingreso' : 'Gasto'}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
