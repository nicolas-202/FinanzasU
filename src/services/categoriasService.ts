import { supabase } from './supabaseClient'
import type { Categoria } from '@/types'

export async function getCategorias(userId: string): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .or(`usuario_id.eq.${userId},es_predeterminada.eq.true`)
    .order('es_predeterminada', { ascending: false })
    .order('nombre')

  if (error) throw error
  return (data || []) as Categoria[]
}

export async function getCategoriasPorTipo(userId: string, tipo: string): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .or(`usuario_id.eq.${userId},es_predeterminada.eq.true`)
    .eq('tipo', tipo)
    .order('nombre')

  if (error) throw error
  return (data || []) as Categoria[]
}

export async function createCategoria(data: Partial<Categoria>): Promise<Categoria> {
  const { data: result, error } = await supabase
    .from('categorias')
    .insert({ ...data, es_predeterminada: false })
    .select()
    .single()
  if (error) throw error
  return result as Categoria
}

export async function updateCategoria(
  id: string,
  userId: string,
  data: Partial<Categoria>
): Promise<Categoria> {
  const { data: result, error } = await supabase
    .from('categorias')
    .update(data)
    .eq('id', id)
    .eq('usuario_id', userId)
    .eq('es_predeterminada', false)
    .select()
    .single()
  if (error) throw error
  return result as Categoria
}

export async function deleteCategoria(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id)
    .eq('usuario_id', userId)
    .eq('es_predeterminada', false)
  if (error) throw error
}
