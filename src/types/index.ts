// ═══════════════════════════════════════════════════════════
// FinanzasU — Tipos compartidos
// ═══════════════════════════════════════════════════════════

// ── Enums ──
export type TipoTransaccion = 'ingreso' | 'gasto'
export type EstadoPresupuesto = 'verde' | 'amarillo' | 'rojo'
export type TipoFiltro = 'todos' | 'ingreso' | 'gasto'

// ── Categoría ──
export interface Categoria {
  id: string
  usuario_id: string | null
  nombre: string
  tipo: TipoTransaccion
  icono: string
  es_predeterminada: boolean
  created_at: string
}

// ── Transacción ──
export interface Transaccion {
  id: string
  usuario_id: string
  categoria_id: string | null
  monto: number
  tipo: TipoTransaccion
  descripcion: string | null
  fecha: string
  created_at: string
  categorias?: {
    nombre: string
    icono: string
  } | null
}

export interface TransaccionInput {
  usuario_id: string
  categoria_id: string
  monto: number
  tipo: TipoTransaccion
  descripcion?: string
  fecha: string
}

// ── Presupuesto ──
export interface Presupuesto {
  id: string
  usuario_id: string
  categoria_id: string
  monto_limite: number
  mes: number
  anio: number
  created_at: string
  categorias?: {
    nombre: string
    icono: string
  } | null
}

export interface PresupuestoConGasto extends Presupuesto {
  gastado: number
  porcentaje: number
  estado: EstadoPresupuesto
  restante: number
}

export interface PresupuestoInput {
  usuario_id: string
  categoria_id: string
  monto_limite: number
  mes: number
  anio: number
}

// ── Dashboard ──
export interface ResumenMes {
  total_ingresos: number
  total_gastos: number
  balance: number
  num_transacciones: number
}

export interface GastoPorCategoria {
  categoria_nombre: string
  categoria_icono: string
  total: number
  porcentaje: number
}

export interface EvolucionMensual {
  mes: number
  anio: number
  mes_nombre: string
  ingresos: number
  gastos: number
}

export interface TopCategoria {
  categoria_nombre: string
  categoria_icono: string
  total: number
  num_transacciones: number
}

export interface EstadoPresupuestos {
  verde: number
  amarillo: number
  rojo: number
  total_presupuestos: number
}

// ── Filtros ──
export interface FiltrosTransaccion {
  tipo: TipoFiltro
  categoriaId: string | null
  fechaInicio: string | null
  fechaFin: string | null
}

// ── Paginación ──
export interface Paginacion {
  paginaActual: number
  totalPaginas: number
  total: number
}

export interface ResultadoPaginado<T> {
  transacciones: T[]
  total: number
  totalPaginas: number
  paginaActual: number
}

// ── Select Option ──
export interface SelectOption {
  value: string
  label: string
}
