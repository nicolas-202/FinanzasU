import { format, parseISO, startOfMonth, endOfMonth, subMonths, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatFechaLarga(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? parseISO(fecha) : fecha
  if (!isValid(d)) return ''
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es })
}

export function formatFechaCorta(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? parseISO(fecha) : fecha
  if (!isValid(d)) return ''
  return format(d, 'd MMM yyyy', { locale: es })
}

export function formatFechaInput(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? parseISO(fecha) : fecha
  if (!isValid(d)) return ''
  return format(d, 'yyyy-MM-dd')
}

export function getInicioMes(date = new Date()): string {
  return format(startOfMonth(date), 'yyyy-MM-dd')
}

export function getFinMes(date = new Date()): string {
  return format(endOfMonth(date), 'yyyy-MM-dd')
}

export function haceMeses(n: number): Date {
  return subMonths(new Date(), n)
}

export function obtenerSaludo(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export function fechaActualFormateada(): string {
  return format(new Date(), "EEEE, d 'de' MMMM", { locale: es })
}
