import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as dashboardService from '@/services/dashboardService'
import type {
  ResumenMes, GastoPorCategoria, EvolucionMensual,
  TopCategoria, EstadoPresupuestos,
} from '@/types'

export function useDashboard(mes?: number, anio?: number) {
  const { userId } = useAuth()
  const isLocalAuthMode =
    import.meta.env.VITE_AUTH_MODE === 'local' ||
    !import.meta.env.VITE_SUPABASE_URL ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY
  const [resumen, setResumen] = useState<ResumenMes>({
    total_ingresos: 0, total_gastos: 0, balance: 0, num_transacciones: 0,
  })
  const [gastosPorCategoria, setGastosPorCategoria] = useState<GastoPorCategoria[]>([])
  const [evolucionMensual, setEvolucionMensual] = useState<EvolucionMensual[]>([])
  const [topCategorias, setTopCategorias] = useState<TopCategoria[]>([])
  const [estadoPresupuestos, setEstadoPresupuestos] = useState<EstadoPresupuestos>({
    verde: 0, amarillo: 0, rojo: 0, total_presupuestos: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ahora = new Date()
  const mesActual = mes || ahora.getMonth() + 1
  const anioActual = anio || ahora.getFullYear()

  const cargar = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    if (isLocalAuthMode) {
      setResumen({ total_ingresos: 0, total_gastos: 0, balance: 0, num_transacciones: 0 })
      setGastosPorCategoria([])
      setEvolucionMensual([])
      setTopCategorias([])
      setEstadoPresupuestos({ verde: 0, amarillo: 0, rojo: 0, total_presupuestos: 0 })
      setError(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const [r, g, e, t, ep] = await Promise.all([
        dashboardService.getResumenMes(userId, mesActual, anioActual),
        dashboardService.getGastosPorCategoria(userId, mesActual, anioActual),
        dashboardService.getEvolucionMensual(userId, 6),
        dashboardService.getTopCategorias(userId, mesActual, anioActual),
        dashboardService.getEstadoPresupuestos(userId, mesActual, anioActual),
      ])
      setResumen(r)
      setGastosPorCategoria(g)
      setEvolucionMensual(e)
      setTopCategorias(t)
      setEstadoPresupuestos(ep)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [userId, mesActual, anioActual, isLocalAuthMode])

  useEffect(() => { cargar() }, [cargar])

  return {
    resumen, gastosPorCategoria, evolucionMensual, topCategorias,
    estadoPresupuestos, loading, error, recargar: cargar,
  }
}
