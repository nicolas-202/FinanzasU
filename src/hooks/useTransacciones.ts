import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as transaccionesService from '@/services/transaccionesService'
import type { Transaccion, TransaccionInput, FiltrosTransaccion, Paginacion } from '@/types'
import toast from 'react-hot-toast'

export function useTransacciones() {
  const { userId } = useAuth()
  const isLocalAuthMode =
    import.meta.env.VITE_AUTH_MODE === 'local' ||
    !import.meta.env.VITE_SUPABASE_URL ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paginacion, setPaginacion] = useState<Paginacion>({
    paginaActual: 1,
    totalPaginas: 1,
    total: 0,
  })
  const [filtros, setFiltros] = useState<FiltrosTransaccion>({
    tipo: 'todos',
    categoriaId: null,
    fechaInicio: null,
    fechaFin: null,
  })

  const cargar = useCallback(async (pagina = 1) => {
    if (!userId) {
      setLoading(false)
      return
    }

    if (isLocalAuthMode) {
      setTransacciones([])
      setPaginacion({ paginaActual: 1, totalPaginas: 1, total: 0 })
      setError(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await transaccionesService.getTransacciones(userId, filtros, pagina)
      setTransacciones(result.transacciones)
      setPaginacion({
        paginaActual: result.paginaActual,
        totalPaginas: result.totalPaginas,
        total: result.total,
      })
    } catch (err) {
      setError((err as Error).message)
      toast.error('Error al cargar transacciones')
    } finally {
      setLoading(false)
    }
  }, [userId, filtros, isLocalAuthMode])

  useEffect(() => { cargar(1) }, [cargar])

  const crear = async (data: Omit<TransaccionInput, 'usuario_id'>) => {
    if (!userId || isLocalAuthMode) return
    try {
      await transaccionesService.createTransaccion({ ...data, usuario_id: userId })
      toast.success('Transacción registrada')
      cargar(paginacion.paginaActual)
    } catch (err) {
      toast.error('Error al crear transacción')
      throw err
    }
  }

  const actualizar = async (id: string, data: Partial<TransaccionInput>) => {
    if (!userId || isLocalAuthMode) return
    try {
      await transaccionesService.updateTransaccion(id, userId, data)
      toast.success('Transacción actualizada')
      cargar(paginacion.paginaActual)
    } catch (err) {
      toast.error('Error al actualizar transacción')
      throw err
    }
  }

  const eliminar = async (id: string) => {
    if (!userId || isLocalAuthMode) return
    try {
      await transaccionesService.deleteTransaccion(id, userId)
      toast.success('Transacción eliminada')
      cargar(paginacion.paginaActual)
    } catch (err) {
      toast.error('Error al eliminar transacción')
      throw err
    }
  }

  const cambiarPagina = (pagina: number) => cargar(pagina)
  const cambiarFiltros = (nuevosFiltros: Partial<FiltrosTransaccion>) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }))
  }

  return {
    transacciones, loading, error, paginacion, filtros,
    crear, actualizar, eliminar, cambiarPagina, cambiarFiltros,
    recargar: () => cargar(paginacion.paginaActual),
  }
}
