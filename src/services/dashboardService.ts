import { supabase } from './supabaseClient'
import type {
  ResumenMes,
  GastoPorCategoria,
  EvolucionMensual,
  TopCategoria,
  EstadoPresupuestos,
} from '@/types'

export async function getResumenMes(
  userId: string, mes: number, anio: number
): Promise<ResumenMes> {
  const { data, error } = await supabase.rpc('get_resumen_mes', {
    p_usuario_id: userId,
    p_mes: mes,
    p_anio: anio,
  })
  if (error) throw error
  return (data?.[0] as ResumenMes) || {
    total_ingresos: 0, total_gastos: 0, balance: 0, num_transacciones: 0,
  }
}

export async function getGastosPorCategoria(
  userId: string, mes: number, anio: number
): Promise<GastoPorCategoria[]> {
  const { data, error } = await supabase.rpc('get_gastos_por_categoria', {
    p_usuario_id: userId,
    p_mes: mes,
    p_anio: anio,
  })
  if (error) throw error
  return (data || []) as GastoPorCategoria[]
}

export async function getEvolucionMensual(
  userId: string, meses = 6
): Promise<EvolucionMensual[]> {
  const { data, error } = await supabase.rpc('get_evolucion_mensual', {
    p_usuario_id: userId,
    p_meses: meses,
  })
  if (error) throw error
  return (data || []) as EvolucionMensual[]
}

export async function getTopCategorias(
  userId: string, mes: number, anio: number
): Promise<TopCategoria[]> {
  const { data, error } = await supabase.rpc('get_top_categorias', {
    p_usuario_id: userId,
    p_mes: mes,
    p_anio: anio,
  })
  if (error) throw error
  return (data || []) as TopCategoria[]
}

export async function getEstadoPresupuestos(
  userId: string, mes: number, anio: number
): Promise<EstadoPresupuestos> {
  const { data, error } = await supabase.rpc('get_estado_presupuestos', {
    p_usuario_id: userId,
    p_mes: mes,
    p_anio: anio,
  })
  if (error) throw error
  return (data?.[0] as EstadoPresupuestos) || {
    verde: 0, amarillo: 0, rojo: 0, total_presupuestos: 0,
  }
}
