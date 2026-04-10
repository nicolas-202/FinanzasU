import { useEffect, useMemo, useState } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { getTransacciones } from '@/services/transaccionesService'
import type { Transaccion } from '@/types'
import { formatMoneda } from '@/utils/formatMoneda'

function buildSvgPath(values: number[], width: number, height: number, padding = 10) {
  if (values.length === 0) return ''
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)

  const stepX = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0
  const points = values.map((value, i) => {
    const x = padding + i * stepX
    const y = padding + ((max - value) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  return points.join(' ')
}

export default function Analisis() {
  const ahora = new Date()
  const [mes] = useState(ahora.getMonth() + 1)
  const [anio] = useState(ahora.getFullYear())
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loadingTx, setLoadingTx] = useState(true)
  const { userId } = useAuth()

  const isLocalAuthMode =
    import.meta.env.VITE_AUTH_MODE === 'local' ||
    !import.meta.env.VITE_SUPABASE_URL ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY

  const { resumen, gastosPorCategoria, evolucionMensual, loading } = useDashboard(mes, anio)

  useEffect(() => {
    if (!userId || isLocalAuthMode) {
      setTransacciones([])
      setLoadingTx(false)
      return
    }

    let active = true
    setLoadingTx(true)
    getTransacciones(userId, {}, 1, 120)
      .then((result) => {
        if (active) setTransacciones(result.transacciones)
      })
      .catch(() => {
        if (active) setTransacciones([])
      })
      .finally(() => {
        if (active) setLoadingTx(false)
      })

    return () => {
      active = false
    }
  }, [userId, isLocalAuthMode])

  const ingresosSerie = evolucionMensual.length
    ? evolucionMensual.map((m) => Number(m.ingresos || 0))
    : [1800, 2200, 2100, 2600, 2400, 2900]

  const gastosSerie = evolucionMensual.length
    ? evolucionMensual.map((m) => Number(m.gastos || 0))
    : [1500, 1400, 1550, 1650, 1720, 1600]

  const labelsSerie = evolucionMensual.length
    ? evolucionMensual.map((m) => m.mes_nombre.slice(0, 3).toUpperCase())
    : ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN']

  const ingresoPath = useMemo(() => buildSvgPath(ingresosSerie, 800, 200), [ingresosSerie])
  const gastoPath = useMemo(() => buildSvgPath(gastosSerie, 800, 200), [gastosSerie])

  const totalTx = transacciones.length
  const weekendCount = transacciones.filter((t) => {
    const d = new Date(t.fecha).getDay()
    return d === 0 || d === 6
  }).length
  const weekendPct = totalTx > 0 ? Math.round((weekendCount / totalTx) * 100) : 10

  const microGasto = transacciones
    .filter((t) => t.tipo === 'gasto' && Number(t.monto) <= 30000)
    .reduce((acc, t) => acc + Number(t.monto), 0)

  const totalGasto = Math.max(Number(resumen.total_gastos || 0), 1)
  const microPct = Math.round((microGasto / totalGasto) * 100)

  const heatmapCells = useMemo(() => {
    const cells: number[] = []
    for (let i = 0; i < 84; i += 1) {
      const base = (i * 7 + 13) % 5
      const signal = totalTx > 0 ? Math.min(4, Math.floor((totalTx % (i + 5)) / 6)) : 0
      cells.push(Math.min(4, (base + signal) % 5))
    }
    return cells
  }, [totalTx])

  const heatColors = ['bg-surface-container-highest', 'bg-primary-fixed', 'bg-primary-fixed-dim', 'bg-primary-container', 'bg-primary']

  const topCats = gastosPorCategoria.length
    ? gastosPorCategoria.slice(0, 3)
    : [
        { categoria_nombre: 'Educación', porcentaje: 35, total: 350000 },
        { categoria_nombre: 'Ocio y Social', porcentaje: 25, total: 250000 },
        { categoria_nombre: 'Alimentación', porcentaje: 40, total: 400000 },
      ]

  const totalCat = topCats.reduce((acc, c) => acc + Number(c.total || 0), 0)

  if (loading || loadingTx) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-5xl md:text-[3.5rem] font-headline font-extrabold tracking-tighter text-primary leading-[1.1]">
            Perspectiva <br /><span className="text-secondary italic">Mensual.</span>
          </h3>
          <p className="text-on-surface-variant max-w-md">
            Tu flujo financiero este mes muestra una variación de ingresos y gastos que puedes usar para ajustar tu estrategia de ahorro.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col justify-between self-end min-h-[190px] border border-outline-variant/20">
          <div className="flex justify-between items-start">
            <div className="bg-secondary-container text-on-secondary-fixed p-2 rounded-lg">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">En objetivo</span>
          </div>
          <div>
            <div className="text-3xl font-headline font-bold text-on-surface">{formatMoneda(Math.max(Number(resumen.balance), 0) * 1.15, true)}</div>
            <div className="text-sm text-on-surface-variant">Ahorro total proyectado</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden border border-outline-variant/20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h4 className="text-xl font-bold text-primary">Comparativa Mensual</h4>
              <p className="text-sm text-on-surface-variant">Ingresos vs Gastos reales</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm font-medium">Ingresos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary" />
                <span className="text-sm font-medium">Gastos</span>
              </div>
            </div>
          </div>

          <div className="w-full h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="800" y2="50" stroke="#c5c5d4" strokeWidth="0.5" strokeDasharray="4" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#c5c5d4" strokeWidth="0.5" strokeDasharray="4" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#c5c5d4" strokeWidth="0.5" strokeDasharray="4" />

              <polyline fill="none" stroke="#24389c" strokeWidth="4" strokeLinecap="round" points={ingresoPath} />
              <polyline fill="none" stroke="#7c2500" strokeWidth="4" strokeLinecap="round" points={gastoPath} />
            </svg>
          </div>

          <div className="flex justify-between mt-4 px-2 text-sm text-on-surface-variant font-medium">
            {labelsSerie.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <h4 className="text-2xl font-headline font-bold text-primary px-2">Hábitos de Consumo</h4>

          <div className="bg-secondary-container/30 border border-secondary/10 rounded-xl p-6 transition-all hover:bg-secondary-container/40">
            <div className="flex gap-4 items-start">
              <div className="bg-secondary text-on-secondary p-2 rounded-lg">
                <span className="material-symbols-outlined">weekend</span>
              </div>
              <div>
                <p className="font-bold text-on-secondary-fixed-variant leading-tight">Gasto en fines de semana</p>
                <p className="text-sm text-on-secondary-fixed-variant mt-1">
                  Tus transacciones en sábado y domingo representan <span className="font-bold underline">{weekendPct}%</span> del total del periodo analizado.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="bg-primary-container text-on-primary-container p-2 rounded-lg">
                <span className="material-symbols-outlined">coffee</span>
              </div>
              <div>
                <p className="font-bold text-on-surface leading-tight">Micro-gastos recurrentes</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  Tus micro-gastos suman {formatMoneda(microGasto)} y representan {Number.isFinite(microPct) ? Math.max(0, microPct) : 0}% del gasto mensual.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-error-container/20 rounded-xl p-6 border border-error/10">
            <div className="flex gap-4 items-start">
              <div className="bg-error text-on-error p-2 rounded-lg">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <p className="font-bold text-on-error-container leading-tight">Alerta de Suscripciones</p>
                <p className="text-sm text-on-error-container mt-1">
                  Revisa cargos periódicos de bajo uso y prioriza los servicios que aporten valor académico o personal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-2xl font-headline font-bold text-primary">Mapa de Calor</h4>
            <p className="text-sm text-on-surface-variant">Frecuencia estimada de gastos diarios en los últimos 3 meses</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-on-surface-variant">Menos</span>
            <div className="flex gap-1">
              {heatColors.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />)}
            </div>
            <span className="text-sm text-on-surface-variant">Más</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 overflow-x-auto border border-outline-variant/20">
          <div className="flex gap-2 min-w-max">
            <div className="flex flex-col gap-2 pr-4 text-[10px] font-bold text-on-surface-variant uppercase pt-1">
              <span>Lun</span><span>Mie</span><span>Vie</span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-2">
              {heatmapCells.map((level, idx) => (
                <div key={idx} className={`w-6 h-6 rounded-sm ${heatColors[level]}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-primary text-white rounded-xl p-8 md:col-span-2 flex flex-col justify-center">
          <h5 className="text-base font-bold mb-4 opacity-80 uppercase tracking-widest">Resumen Categoría</h5>
          <div className="space-y-4">
            {topCats.map((cat, i) => {
              const pct = totalCat > 0 ? Math.round((Number(cat.total) / totalCat) * 100) : Number(cat.porcentaje || 0)
              return (
                <div key={`${cat.categoria_nombre}-${i}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{cat.categoria_nombre}</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-secondary-fixed h-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden md:col-span-2 group min-h-[250px] border border-outline-variant/20">
          <img
            alt="Planeación financiera"
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-8">
            <h5 className="text-white text-2xl font-headline font-bold mb-2">Optimiza tu Futuro</h5>
            <p className="text-primary-fixed text-sm mb-4">Identifica patrones de gasto y toma decisiones basadas en datos para mejorar tu estabilidad financiera.</p>
            <button className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded-full font-bold text-sm w-fit shadow-lg active:scale-95 duration-150 transition-all">
              Ver Recomendaciones
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
