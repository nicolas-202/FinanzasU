import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as presupuestosService from '@/services/presupuestosService'
import type { PresupuestoConGasto, PresupuestoInput } from '@/types'
import toast from 'react-hot-toast'

export function usePresupuestos(mes?: number, anio?: number) {
  const { userId } = useAuth()
  const isLocalAuthMode =
    import.meta.env.VITE_AUTH_MODE === 'local' ||
    !import.meta.env.VITE_SUPABASE_URL ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY
  const [presupuestos, setPresupuestos] = useState<PresupuestoConGasto[]>([])
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
      setPresupuestos([])
      setError(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await presupuestosService.getPresupuestos(userId, mesActual, anioActual)
      setPresupuestos(data)

      const excedidos = data.filter((p) => p.estado === 'rojo')
      const enAlerta = data.filter((p) => p.estado === 'amarillo')

      if (excedidos.length > 0) {
        toast.error(`⚠️ ${excedidos.length} presupuesto(s) excedido(s)`, { duration: 5000 })
      } else if (enAlerta.length > 0) {
        toast(`⚡ ${enAlerta.length} presupuesto(s) cerca del límite`, { icon: '⚠️', duration: 4000 })
      }
    } catch (err) {
      setError((err as Error).message)
      toast.error('Error al cargar presupuestos')
    } finally {
      setLoading(false)
    }
  }, [userId, mesActual, anioActual, isLocalAuthMode])

  useEffect(() => { cargar() }, [cargar])

  const crear = async (data: Omit<PresupuestoInput, 'usuario_id' | 'mes' | 'anio'>) => {
    if (!userId) return
    try {
      await presupuestosService.createPresupuesto({
        ...data, usuario_id: userId, mes: mesActual, anio: anioActual,
      })
      toast.success('Presupuesto creado')
      cargar()
    } catch (err) {
      const msg = (err as Error).message
      if (msg?.includes('duplicate') || msg?.includes('23505')) {
        toast.error('Ya existe un presupuesto para esta categoría en este mes')
      } else {
        toast.error('Error al crear presupuesto')
      }
      throw err
    }
  }

  const actualizar = async (id: string, data: Partial<PresupuestoInput>) => {
    if (!userId) return
    try {
      await presupuestosService.updatePresupuesto(id, userId, data)
      toast.success('Presupuesto actualizado')
      cargar()
    } catch (err) {
      toast.error('Error al actualizar presupuesto')
      throw err
    }
  }

  const eliminar = async (id: string) => {
    if (!userId) return
    try {
      await presupuestosService.deletePresupuesto(id, userId)
      toast.success('Presupuesto eliminado')
      cargar()
    } catch (err) {
      toast.error('Error al eliminar presupuesto')
      throw err
    }
  }

  const resumen = {
    verde: presupuestos.filter((p) => p.estado === 'verde').length,
    amarillo: presupuestos.filter((p) => p.estado === 'amarillo').length,
    rojo: presupuestos.filter((p) => p.estado === 'rojo').length,
    total: presupuestos.length,
  }

  return {
    presupuestos, loading, error, resumen,
    crear, actualizar, eliminar, recargar: cargar,
  }
}
