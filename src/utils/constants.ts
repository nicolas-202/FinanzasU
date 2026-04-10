export const CATEGORIAS_PREDETERMINADAS = {
  gasto: [
    { nombre: 'Alimentación', icono: '🍔' },
    { nombre: 'Transporte', icono: '🚌' },
    { nombre: 'Entretenimiento', icono: '🎮' },
    { nombre: 'Educación', icono: '📚' },
    { nombre: 'Salud', icono: '💊' },
    { nombre: 'Ropa', icono: '👕' },
    { nombre: 'Servicios', icono: '💡' },
    { nombre: 'Otros gastos', icono: '📦' },
  ],
  ingreso: [
    { nombre: 'Mesada', icono: '💰' },
    { nombre: 'Beca', icono: '🎓' },
    { nombre: 'Trabajo', icono: '💼' },
    { nombre: 'Freelance', icono: '💻' },
    { nombre: 'Otros ingresos', icono: '🪙' },
  ],
} as const

export const EMOJIS_DISPONIBLES: string[] = [
  '🍔', '🍕', '☕', '🚌', '🚗', '⛽', '🎮', '🎬', '🎵', '📚',
  '💊', '🏋️', '👕', '👟', '💡', '📱', '🏠', '🎁', '✈️', '🛒',
  '💰', '🎓', '💼', '💻', '🪙', '📦', '🐕', '🌿', '🔧', '💳',
]

export const COLORES_GRAFICAS: string[] = [
  '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
]

export const MESES: string[] = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export const MESES_CORTOS: string[] = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

export const ITEMS_POR_PAGINA = 10
