import { supabase } from './supabaseClient'
import type { Transaccion, TransaccionInput, FiltrosTransaccion, ResultadoPaginado } from '@/types'

const ITEMS_PER_PAGE = 10

export async function getTransacciones(
  userId: string,
  filtros: Partial<FiltrosTransaccion> = {},
  pagina = 1,
  limite = ITEMS_PER_PAGE
): Promise<ResultadoPaginado<Transaccion>> {
  let query = supabase
    .from('transacciones')
    .select('*, categorias(nombre, icono)', { count: 'exact' })
    .eq('usuario_id', userId)
    .order('fecha', { ascending: false })

  if (filtros.tipo && filtros.tipo !== 'todos') {
    query = query.eq('tipo', filtros.tipo)
  }
  if (filtros.categoriaId) {
    query = query.eq('categoria_id', filtros.categoriaId)
  }
  if (filtros.fechaInicio) {
    query = query.gte('fecha', filtros.fechaInicio)
  }
  if (filtros.fechaFin) {
    query = query.lte('fecha', filtros.fechaFin)
  }

  const offset = (pagina - 1) * limite
  query = query.range(offset, offset + limite - 1)

  const { data, error, count } = await query
  if (error) throw error

  return {
    transacciones: (data || []) as Transaccion[],
    total: count || 0,
    totalPaginas: Math.ceil((count || 0) / limite),
    paginaActual: pagina,
  }
}

export async function createTransaccion(data: TransaccionInput): Promise<Transaccion> {
  const { data: result, error } = await supabase
    .from('transacciones')
    .insert(data)
    .select('*, categorias(nombre, icono)')
    .single()
  if (error) throw error
  return result as Transaccion
}

export async function updateTransaccion(
  id: string,
  userId: string,
  data: Partial<TransaccionInput>
): Promise<Transaccion> {
  const { data: result, error } = await supabase
    .from('transacciones')
    .update(data)
    .eq('id', id)
    .eq('usuario_id', userId)
    .select('*, categorias(nombre, icono)')
    .single()
  if (error) throw error
  return result as Transaccion
}

export async function deleteTransaccion(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('transacciones')
    .delete()
    .eq('id', id)
    .eq('usuario_id', userId)
  if (error) throw error
}

export async function exportarTransacciones(
  userId: string,
  filtros: Partial<FiltrosTransaccion> = {}
): Promise<Transaccion[]> {
  let query = supabase
    .from('transacciones')
    .select('fecha, tipo, monto, descripcion, categorias(nombre)')
    .eq('usuario_id', userId)
    .order('fecha', { ascending: false })

  if (filtros.tipo && filtros.tipo !== 'todos') {
    query = query.eq('tipo', filtros.tipo)
  }
  if (filtros.fechaInicio) {
    query = query.gte('fecha', filtros.fechaInicio)
  }
  if (filtros.fechaFin) {
    query = query.lte('fecha', filtros.fechaFin)
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []) as unknown as Transaccion[]
}
