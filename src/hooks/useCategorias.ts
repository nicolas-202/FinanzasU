import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as categoriasService from '@/services/categoriasService'
import type { Categoria, TipoTransaccion } from '@/types'
import toast from 'react-hot-toast'

export function useCategorias(tipo?: TipoTransaccion) {
  const { userId } = useAuth()
  const isLocalAuthMode =
    import.meta.env.VITE_AUTH_MODE === 'local' ||
    !import.meta.env.VITE_SUPABASE_URL ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    if (isLocalAuthMode) {
      setCategorias([])
      setError(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = tipo
        ? await categoriasService.getCategoriasPorTipo(userId, tipo)
        : await categoriasService.getCategorias(userId)
      setCategorias(data)
    } catch (err) {
      setError((err as Error).message)
      toast.error('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }, [userId, tipo, isLocalAuthMode])

  useEffect(() => { cargar() }, [cargar])

  const crear = async (data: Partial<Categoria>) => {
    if (!userId) return
    try {
      await categoriasService.createCategoria({ ...data, usuario_id: userId })
      toast.success('Categoría creada')
      cargar()
    } catch (err) {
      toast.error('Error al crear categoría')
      throw err
    }
  }

  const actualizar = async (id: string, data: Partial<Categoria>) => {
    if (!userId) return
    try {
      await categoriasService.updateCategoria(id, userId, data)
      toast.success('Categoría actualizada')
      cargar()
    } catch (err) {
      toast.error('Error al actualizar categoría')
      throw err
    }
  }

  const eliminar = async (id: string) => {
    if (!userId) return
    try {
      await categoriasService.deleteCategoria(id, userId)
      toast.success('Categoría eliminada')
      cargar()
    } catch (err) {
      toast.error('Error al eliminar categoría')
      throw err
    }
  }

  const predeterminadas = categorias.filter((c) => c.es_predeterminada)
  const personalizadas = categorias.filter((c) => !c.es_predeterminada)

  return {
    categorias, predeterminadas, personalizadas,
    loading, error, crear, actualizar, eliminar, recargar: cargar,
  }
}
