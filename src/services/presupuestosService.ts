import { supabase } from './supabaseClient'
import type { Presupuesto, PresupuestoConGasto, PresupuestoInput, EstadoPresupuesto } from '@/types'

export async function getPresupuestos(
  userId: string,
  mes: number,
  anio: number
): Promise<PresupuestoConGasto[]> {
  const { data: presupuestos, error: pError } = await supabase
    .from('presupuestos')
    .select('*, categorias(nombre, icono)')
    .eq('usuario_id', userId)
    .eq('mes', mes)
    .eq('anio', anio)
    .order('created_at')

  if (pError) throw pError
  if (!presupuestos || presupuestos.length === 0) return []

  const { data: gastos, error: gError } = await supabase
    .from('transacciones')
    .select('categoria_id, monto')
    .eq('usuario_id', userId)
    .eq('tipo', 'gasto')
    .gte('fecha', `${anio}-${String(mes).padStart(2, '0')}-01`)
    .lte('fecha', `${anio}-${String(mes).padStart(2, '0')}-31`)

  if (gError) throw gError

  const gastosPorCategoria: Record<string, number> = (gastos || []).reduce(
    (acc: Record<string, number>, g: { categoria_id: string; monto: number }) => {
      acc[g.categoria_id] = (acc[g.categoria_id] || 0) + Number(g.monto)
      return acc
    },
    {}
  )

  return (presupuestos as Presupuesto[]).map((p) => {
    const gastado = gastosPorCategoria[p.categoria_id] || 0
    const porcentaje = p.monto_limite > 0 ? (gastado / Number(p.monto_limite)) * 100 : 0
    let estado: EstadoPresupuesto = 'verde'
    if (porcentaje >= 100) estado = 'rojo'
    else if (porcentaje >= 80) estado = 'amarillo'

    return {
      ...p,
      gastado,
      porcentaje: Math.round(porcentaje * 10) / 10,
      estado,
      restante: Math.max(0, Number(p.monto_limite) - gastado),
    }
  })
}

export async function createPresupuesto(data: PresupuestoInput): Promise<Presupuesto> {
  const { data: result, error } = await supabase
    .from('presupuestos')
    .insert(data)
    .select('*, categorias(nombre, icono)')
    .single()
  if (error) throw error
  return result as Presupuesto
}

export async function updatePresupuesto(
  id: string,
  userId: string,
  data: Partial<PresupuestoInput>
): Promise<Presupuesto> {
  const { data: result, error } = await supabase
    .from('presupuestos')
    .update(data)
    .eq('id', id)
    .eq('usuario_id', userId)
    .select('*, categorias(nombre, icono)')
    .single()
  if (error) throw error
  return result as Presupuesto
}

export async function deletePresupuesto(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('presupuestos')
    .delete()
    .eq('id', id)
    .eq('usuario_id', userId)
  if (error) throw error
}
