const formatterCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const formatterCOPDecimals = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoneda(valor: number | string, conDecimales = false): string {
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor
  if (isNaN(numero)) return '$ 0'
  return conDecimales ? formatterCOPDecimals.format(numero) : formatterCOP.format(numero)
}

export function formatCompacto(valor: number | string): string {
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor
  if (isNaN(numero)) return '0'
  if (Math.abs(numero) >= 1_000_000) return `${(numero / 1_000_000).toFixed(1)}M`
  if (Math.abs(numero) >= 1_000) return `${(numero / 1_000).toFixed(0)}K`
  return numero.toLocaleString('es-CO')
}
