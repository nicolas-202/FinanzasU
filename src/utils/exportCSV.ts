import type { Transaccion } from '@/types'

export function exportCSV(datos: Transaccion[], nombreArchivo = 'finanzas_export'): void {
  if (!datos || datos.length === 0) {
    alert('No hay datos para exportar')
    return
  }

  const filas = datos.map((t) => ({
    Fecha: t.fecha,
    Tipo: t.tipo === 'ingreso' ? 'Ingreso' : 'Gasto',
    Categoría: t.categorias?.nombre || 'Sin categoría',
    Monto: t.monto,
    Descripción: t.descripcion || '',
  }))

  const headers = Object.keys(filas[0]) as (keyof (typeof filas)[0])[]
  const BOM = '\uFEFF'
  const csvContent =
    BOM +
    [
      headers.join(';'),
      ...filas.map((fila) =>
        headers
          .map((h) => {
            let valor: string | number = fila[h] ?? ''
            if (
              typeof valor === 'string' &&
              (valor.includes(';') || valor.includes('"') || valor.includes('\n'))
            ) {
              valor = `"${valor.replace(/"/g, '""')}"`
            }
            return valor
          })
          .join(';')
      ),
    ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
