import { useMemo, useState } from 'react'
import { Plus, Download, Trash2, Pencil, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useTransacciones } from '@/hooks/useTransacciones'
import { useCategorias } from '@/hooks/useCategorias'
import { useAuth } from '@/contexts/AuthContext'
import { exportarTransacciones } from '@/services/transaccionesService'
import { exportCSV } from '@/utils/exportCSV'
import { formatMoneda } from '@/utils/formatMoneda'
import { formatFechaCorta, formatFechaInput } from '@/utils/dateHelpers'
import type { TipoTransaccion, TipoFiltro, Transaccion } from '@/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import toast from 'react-hot-toast'

export default function Transacciones() {
  const { userId } = useAuth()
  const { transacciones, loading, paginacion, filtros, crear, actualizar, eliminar, cambiarPagina, cambiarFiltros } = useTransacciones()
  const { categorias } = useCategorias()
  const [searchTerm, setSearchTerm] = useState('')
  const [datePreset, setDatePreset] = useState<'all' | 'month' | '3months' | 'custom'>('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [editando, setEditando] = useState<Transaccion | null>(null)
  const [form, setForm] = useState({ monto: '', tipo: 'gasto' as TipoTransaccion, categoria_id: '', descripcion: '', fecha: formatFechaInput(new Date()) })
  const [exportLoading, setExportLoading] = useState(false)

  const categoriasOpciones = categorias
    .filter((c) => c.tipo === form.tipo)
    .map((c) => ({ value: c.id, label: `${c.icono} ${c.nombre}` }))

  const categoriasGasto = categorias.filter((c) => c.tipo === 'gasto')

  const transaccionesFiltradas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return transacciones

    return transacciones.filter((t) => {
      const descripcion = (t.descripcion || '').toLowerCase()
      const categoria = (t.categorias?.nombre || '').toLowerCase()
      return descripcion.includes(term) || categoria.includes(term)
    })
  }, [transacciones, searchTerm])

  const abrirCrear = () => {
    setEditando(null)
    setForm({ monto: '', tipo: 'gasto', categoria_id: '', descripcion: '', fecha: formatFechaInput(new Date()) })
    setModalOpen(true)
  }

  const abrirEditar = (t: Transaccion) => {
    setEditando(t)
    setForm({ monto: String(t.monto), tipo: t.tipo, categoria_id: t.categoria_id || '', descripcion: t.descripcion || '', fecha: t.fecha })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.monto || !form.categoria_id || !form.fecha) { toast.error('Completa los campos obligatorios'); return }
    try {
      if (editando) {
        await actualizar(editando.id, { ...form, monto: parseFloat(form.monto) })
      } else {
        await crear({ ...form, monto: parseFloat(form.monto) })
      }
      setModalOpen(false)
    } catch { /* handled by hook */ }
  }

  const handleExport = async () => {
    if (!userId) return
    try {
      setExportLoading(true)
      const data = await exportarTransacciones(userId, filtros)
      exportCSV(data as any)
      toast.success('Archivo CSV descargado')
    } catch { toast.error('Error al exportar') }
    finally { setExportLoading(false) }
  }

  const confirmarEliminar = async () => {
    if (deleteModal) { await eliminar(deleteModal); setDeleteModal(null) }
  }

  const aplicarPresetFecha = (preset: 'all' | 'month' | '3months' | 'custom') => {
    setDatePreset(preset)
    const hoy = new Date()

    if (preset === 'all') {
      cambiarFiltros({ fechaInicio: null, fechaFin: null })
      return
    }

    if (preset === 'month') {
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      cambiarFiltros({
        fechaInicio: formatFechaInput(inicio),
        fechaFin: formatFechaInput(hoy),
      })
      return
    }

    if (preset === '3months') {
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1)
      cambiarFiltros({
        fechaInicio: formatFechaInput(inicio),
        fechaFin: formatFechaInput(hoy),
      })
    }
  }

  const filaIconBg = (t: Transaccion) => {
    if (t.tipo === 'ingreso') return 'bg-secondary-container text-secondary'
    const nombre = (t.categorias?.nombre || '').toLowerCase()
    if (nombre.includes('transporte')) return 'bg-primary-fixed text-primary'
    if (nombre.includes('ocio') || nombre.includes('suscrip')) return 'bg-tertiary-fixed-dim/40 text-tertiary'
    return 'bg-tertiary-fixed text-tertiary'
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="w-full sticky top-[72px] z-20 bg-background/80 backdrop-blur-md rounded-2xl border border-outline-variant/10 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar transacciones..."
              className="w-full bg-surface-container border border-outline-variant/20 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <Button onClick={handleExport} variant="secondary" size="md" icon={Download} loading={exportLoading}>Exportar CSV</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-on-background mb-2">Transacciones</h2>
          <p className="text-on-surface-variant font-medium">Controla el flujo de tu libertad financiera.</p>
        </div>
        <button onClick={abrirCrear} className="flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-8 py-3.5 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all cursor-pointer">
          <Plus className="w-5 h-5" />
          Anadir Transaccion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Filtrar por Fecha</h3>
            <div className="space-y-2">
              <button onClick={() => aplicarPresetFecha('all')} className={`w-full text-left px-4 py-2.5 rounded-full text-sm transition-all cursor-pointer ${datePreset === 'all' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>Todo el tiempo</button>
              <button onClick={() => aplicarPresetFecha('month')} className={`w-full text-left px-4 py-2.5 rounded-full text-sm transition-all cursor-pointer ${datePreset === 'month' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>Este mes</button>
              <button onClick={() => aplicarPresetFecha('3months')} className={`w-full text-left px-4 py-2.5 rounded-full text-sm transition-all cursor-pointer ${datePreset === '3months' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>Ultimos 3 meses</button>

              <div className="pt-2">
                <label className="text-[10px] font-bold text-outline px-4 mb-1 block">RANGO PERSONALIZADO</label>
                <div className="bg-surface-container-lowest p-2 rounded-xl space-y-2 border border-outline-variant/20">
                  <input
                    type="date"
                    value={filtros.fechaInicio || ''}
                    onChange={(e) => {
                      setDatePreset('custom')
                      cambiarFiltros({ fechaInicio: e.target.value || null })
                    }}
                    className="w-full border-none bg-surface rounded-lg text-xs font-medium focus:ring-primary"
                  />
                  <input
                    type="date"
                    value={filtros.fechaFin || ''}
                    onChange={(e) => {
                      setDatePreset('custom')
                      cambiarFiltros({ fechaFin: e.target.value || null })
                    }}
                    className="w-full border-none bg-surface rounded-lg text-xs font-medium focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Categoria de Gasto</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => cambiarFiltros({ categoriaId: null })}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${!filtros.categoriaId ? 'bg-secondary-container text-on-secondary-fixed border-secondary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/20'}`}
              >
                Todas
              </button>
              {categoriasGasto.map((c) => (
                <button
                  key={c.id}
                  onClick={() => cambiarFiltros({ categoriaId: c.id })}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${filtros.categoriaId === c.id ? 'bg-secondary-container text-on-secondary-fixed border-secondary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/20'}`}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">Tipo</h3>
            <div className="flex flex-wrap gap-2">
              {(['todos', 'ingreso', 'gasto'] as TipoFiltro[]).map((t) => (
                <button
                  key={t}
                  onClick={() => cambiarFiltros({ tipo: t })}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${filtros.tipo === t ? 'bg-primary-fixed text-primary border-primary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/20'}`}
                >
                  {t === 'todos' ? 'Todos' : t === 'ingreso' ? 'Ingresos' : 'Gastos'}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-9">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : transaccionesFiltradas.length === 0 ? (
            <EmptyState icon={Plus} title="Sin movimientos" description="Registra tu primer ingreso o gasto." actionLabel="Nueva transaccion" onAction={abrirCrear} />
          ) : (
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/15">
              <div className="grid grid-cols-12 px-8 py-6 bg-surface-container-low border-b border-outline-variant/10">
                <div className="col-span-6 text-xs font-bold text-outline uppercase tracking-wider">Concepto y Categoria</div>
                <div className="col-span-3 text-xs font-bold text-outline uppercase tracking-wider">Fecha</div>
                <div className="col-span-3 text-xs font-bold text-outline uppercase tracking-wider text-right">Monto</div>
              </div>

              <div className="divide-y divide-outline-variant/10">
                {transaccionesFiltradas.map((t) => (
                  <div key={t.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-surface-container-low transition-colors group">
                    <div className="col-span-6 flex items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform text-xl ${filaIconBg(t)}`}>
                        {t.categorias?.icono || '💳'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-primary truncate">{t.descripcion || 'Transaccion'}</p>
                        <p className="text-xs text-outline font-medium truncate">{t.categorias?.nombre || 'Sin categoria'}</p>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm font-semibold text-on-surface-variant">{formatFechaCorta(t.fecha)}</p>
                    </div>
                    <div className="col-span-3 text-right flex items-center justify-end gap-3">
                      <p className={`text-lg font-black tracking-tight ${t.tipo === 'ingreso' ? 'text-secondary' : 'text-tertiary'}`}>
                        {t.tipo === 'ingreso' ? '+' : '-'} {formatMoneda(t.monto)}
                      </p>
                      <div className="hidden md:flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => abrirEditar(t)} className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteModal(t.id)} className="p-2 rounded-lg bg-error-container hover:bg-error/20 text-error transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-surface-container-low/40 flex justify-between items-center">
                <p className="text-xs font-bold text-outline">Mostrando {transaccionesFiltradas.length} de {paginacion.total} transacciones</p>
                <div className="flex gap-2 items-center">
                  <button onClick={() => cambiarPagina(paginacion.paginaActual - 1)} disabled={paginacion.paginaActual <= 1}
                    className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all disabled:opacity-50 cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary font-bold bg-surface-container-lowest shadow-sm cursor-default">{paginacion.paginaActual}</button>
                  {paginacion.totalPaginas > paginacion.paginaActual && (
                    <button onClick={() => cambiarPagina(paginacion.paginaActual + 1)} className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface font-bold hover:bg-surface-container transition-all cursor-pointer">
                      {paginacion.paginaActual + 1}
                    </button>
                  )}
                  <button onClick={() => cambiarPagina(paginacion.paginaActual + 1)} disabled={paginacion.paginaActual >= paginacion.totalPaginas}
                    className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all disabled:opacity-50 cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Creación y Edición Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editando ? 'Editar Transacción' : 'Nueva Transacción'}
        footer={<>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{editando ? 'Guardar Cambios' : 'Crear'}</Button>
        </>}>
        <div className="space-y-5">
          <div className="flex gap-3 bg-surface-container p-1.5 rounded-xl">
            {(['gasto', 'ingreso'] as TipoTransaccion[]).map((t) => (
              <button key={t} onClick={() => setForm((f) => ({ ...f, tipo: t, categoria_id: '' }))}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer
                  ${form.tipo === t ? (t === 'ingreso' ? 'bg-secondary text-white' : 'bg-error text-white') : 'bg-transparent shadow-none text-on-surface-variant hover:text-on-surface'}
                `}>
                {t === 'ingreso' ? 'Ingreso' : 'Gasto'}
              </button>
            ))}
          </div>
          <Input id="tx-monto" label="Monto (COP)" type="number" placeholder="50000" value={form.monto}
            onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))} />
          <Select id="tx-categoria" label="Categoría" options={categoriasOpciones} value={form.categoria_id}
            onChange={(e) => setForm((f) => ({ ...f, categoria_id: e.target.value }))} />
          <Input id="tx-desc" label="Descripción (opcional)" placeholder="Ej. Almuerzo, Transporte"
            value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
          <Input id="tx-fecha" label="Fecha" type="date" value={form.fecha}
            onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))} />
        </div>
      </Modal>

      {/* Confirmación Eliminar */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar transacción" size="sm"
        footer={<>
          <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarEliminar}>Eliminar</Button>
        </>}>
        <p className="text-on-surface-variant font-medium">¿Estás seguro? Esta acción no se puede deshacer.</p>
      </Modal>
    </div>
  )
}
