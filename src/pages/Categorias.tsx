import { useMemo, useState } from 'react'
import { Plus, Trash2, Pencil, Search, ArrowRight } from 'lucide-react'
import { useCategorias } from '@/hooks/useCategorias'
import { EMOJIS_DISPONIBLES } from '@/utils/constants'
import type { TipoTransaccion } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'

export default function Categorias() {
  const { predeterminadas, personalizadas, loading, crear, actualizar, eliminar } = useCategorias()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nombre: '', tipo: 'gasto' as TipoTransaccion, icono: '📂' })

  const categoriasVisibles = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return personalizadas
    return personalizadas.filter((c) => c.nombre.toLowerCase().includes(term))
  }, [personalizadas, search])

  const totalCategorias = predeterminadas.length + personalizadas.length
  const totalGasto = personalizadas.filter((c) => c.tipo === 'gasto').length
  const totalIngreso = personalizadas.filter((c) => c.tipo === 'ingreso').length

  const obtenerEstado = (index: number): { label: string; badge: string; barra: string; porcentaje: number } => {
    const opciones = [
      { label: 'Atención', badge: 'bg-tertiary-fixed-dim/40 text-tertiary', barra: 'bg-tertiary', porcentaje: 82 },
      { label: 'Saludable', badge: 'bg-primary-fixed text-primary', barra: 'bg-primary', porcentaje: 45 },
      { label: 'Saludable', badge: 'bg-secondary-container text-on-secondary-container', barra: 'bg-secondary', porcentaje: 30 },
      { label: 'En crecimiento', badge: 'bg-primary-fixed text-primary', barra: 'bg-secondary', porcentaje: 65 },
      { label: 'Revisar', badge: 'bg-error-container text-error', barra: 'bg-tertiary', porcentaje: 95 },
    ]
    return opciones[index % opciones.length]
  }

  const abrirCrear = () => { setEditId(null); setForm({ nombre: '', tipo: 'gasto', icono: '📂' }); setModalOpen(true) }
  const abrirEditar = (id: string, nombre: string, tipo: TipoTransaccion, icono: string) => {
    setEditId(id); setForm({ nombre, tipo, icono }); setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return
    try {
      if (editId) { await actualizar(editId, form) } else { await crear(form) }
      setModalOpen(false)
    } catch { /* handled */ }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      <div className="flex items-center justify-between gap-4 bg-background/70 backdrop-blur-md sticky top-[72px] z-20 border border-outline-variant/10 rounded-2xl px-4 py-3">
        <h2 className="text-primary font-headline text-2xl font-bold tracking-tight">Categorías</h2>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categorías..."
              className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-full text-sm focus:ring-2 focus:ring-primary w-64 transition-all outline-none"
            />
          </div>
          <Button onClick={abrirCrear} size="md" icon={Plus}>Agregar categoría</Button>
        </div>
      </div>

      <section className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-primary rounded-3xl p-10 text-on-primary relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div className="relative z-10">
            <p className="font-headline font-bold text-on-primary/60 tracking-wider uppercase text-xs mb-2">Panorama de categorías</p>
            <h3 className="font-headline text-5xl font-extrabold tracking-tighter mb-4">Enfoque en crecimiento</h3>
            <p className="max-w-md text-on-primary/80 leading-relaxed">
              Tus categorías personalizadas te ayudan a visualizar mejor cómo distribuyes tu dinero y dónde puedes optimizar.
            </p>
          </div>
          <div className="mt-8 flex gap-8 z-10">
            <div>
              <p className="text-on-primary/60 text-xs font-bold uppercase tracking-widest mb-1">Total categorías</p>
              <p className="text-2xl font-headline font-extrabold">{totalCategorias}</p>
            </div>
            <div>
              <p className="text-on-primary/60 text-xs font-bold uppercase tracking-widest mb-1">Personalizadas</p>
              <p className="text-2xl font-headline font-extrabold">{personalizadas.length}</p>
            </div>
            <div>
              <p className="text-on-primary/60 text-xs font-bold uppercase tracking-widest mb-1">Balance</p>
              <p className="text-2xl font-headline font-extrabold">{totalIngreso}/{totalGasto}</p>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
            <img
              alt="Resumen visual"
              className="object-cover h-full w-full grayscale contrast-125"
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop"
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-secondary-container rounded-3xl p-8 flex flex-col justify-center border border-secondary/10">
          <div className="mb-6">
            <span className="material-symbols-outlined text-secondary text-4xl mb-4">trending_up</span>
            <h4 className="font-headline text-on-secondary-container text-xl font-bold">Sugerencia de optimización</h4>
          </div>
          <p className="text-on-secondary-container/80 text-sm leading-relaxed mb-6">
            Revisa categorías con poco uso para simplificar tu panel y mantener foco en los rubros que realmente impactan tus finanzas.
          </p>
          <button className="bg-secondary text-on-secondary py-3 px-6 rounded-xl font-bold text-sm self-start hover:opacity-90 transition-opacity">
            Ajustar estrategia
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end gap-4">
          <div>
            <h3 className="font-headline text-2xl font-extrabold text-primary">Insights por categoría</h3>
            <p className="text-on-surface-variant text-sm mt-1">Desglose en tiempo real de tu estrategia de asignación.</p>
          </div>
          <div className="flex gap-3">
            <span className="px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface text-xs font-bold border border-outline-variant/20">Activas</span>
            <span className="px-4 py-2 rounded-full text-outline text-xs font-bold">Archivadas</span>
          </div>
        </div>

        {categoriasVisibles.length === 0 ? (
          <Card padding="p-10" className="text-center shadow-sm">
            <p className="text-on-surface font-semibold text-lg">No hay categorías para mostrar</p>
            <p className="text-on-surface-variant text-sm mt-1">Crea una categoría personalizada o cambia el término de búsqueda.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categoriasVisibles.map((c, idx) => {
              const estado = obtenerEstado(idx)
              const usado = Math.round((estado.porcentaje / 100) * 500)
              return (
                <Card key={c.id} padding="p-6" className="group hover:bg-surface-container-low transition-all duration-300 rounded-3xl relative">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => abrirEditar(c.id, c.nombre, c.tipo, c.icono)} className="p-1.5 rounded-lg bg-surface hover:bg-surface-container text-on-surface-variant cursor-pointer"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteModal(c.id)} className="p-1.5 rounded-lg bg-error-container hover:bg-error/20 text-error cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-3xl">
                      {c.icono}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Estado</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${estado.badge}`}>{estado.label}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-headline font-bold text-on-surface">{c.nombre}</h4>
                    <p className="text-on-surface-variant text-sm">{c.tipo === 'gasto' ? 'Categoría de egresos' : 'Categoría de ingresos'}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">{estado.porcentaje}% de referencia</span>
                      <span className="font-bold text-on-surface">${usado.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${estado.barra}`} style={{ width: `${estado.porcentaje}%` }} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      <section className="bg-surface-container-low rounded-[32px] p-8 mt-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-headline text-xl font-bold text-on-surface">Velocidad por categoría</h3>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
            Descargar reporte
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <div className="grid grid-cols-4 px-4 py-4 text-xs font-bold text-outline uppercase tracking-widest">
            <span>Categoría</span>
            <span>Promedio diario</span>
            <span>Frecuencia</span>
            <span className="text-right">Puntaje</span>
          </div>

          {predeterminadas.slice(0, 3).map((c, i) => {
            const puntaje = 72 + i * 9
            return (
              <div key={c.id} className={`grid grid-cols-4 px-4 py-6 items-center rounded-2xl ${i % 2 === 0 ? 'bg-surface-container-lowest' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-bold text-sm">{c.nombre}</span>
                </div>
                <span className="text-sm text-on-surface">${(3.5 + i * 2.2).toFixed(2)}</span>
                <span className="text-sm text-on-surface-variant">{8 + i * 6} veces/mes</span>
                <div className="flex justify-end items-center gap-2">
                  <span className="text-sm font-bold text-on-surface">{puntaje}%</span>
                  <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${puntaje}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Categorías base del sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {predeterminadas.map((c) => (
            <Card key={c.id} padding="p-4" variant="solid" className="text-center opacity-85 shadow-none border-dashed border-2 rounded-2xl">
              <span className="text-3xl block mb-2 grayscale opacity-80">{c.icono}</span>
              <p className="text-sm font-bold text-on-surface truncate">{c.nombre}</p>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 block ${c.tipo === 'ingreso' ? 'text-secondary' : 'text-tertiary'}`}>
                {c.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
              </span>
            </Card>
          ))}
        </div>
      </section>

      <div className="fixed bottom-8 right-8 z-40 md:hidden">
        <button onClick={abrirCrear} className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar categoría' : 'Nueva categoría'} size="md"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>{editId ? 'Guardar' : 'Crear categoría'}</Button></>}>
        <div className="space-y-6">
          <Input id="cat-nombre" label="Nombre de la categoría" placeholder="Ej. Suscripciones" value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-on-surface ml-1">Tipo</span>
            <div className="flex gap-3 bg-surface-container p-1.5 rounded-xl">
              {(['gasto', 'ingreso'] as TipoTransaccion[]).map((t) => (
                <button key={t} onClick={() => setForm((f) => ({ ...f, tipo: t }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer
                    ${form.tipo === t ? (t === 'ingreso' ? 'bg-secondary text-white' : 'bg-error text-white') : 'bg-transparent shadow-none text-on-surface-variant'}
                  `}>{t === 'ingreso' ? 'Ingreso' : 'Gasto'}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="block text-sm font-semibold text-on-surface ml-1 mb-3">Ícono</p>
            <div className="grid grid-cols-6 gap-2 bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl max-h-48 overflow-y-auto">
              {EMOJIS_DISPONIBLES.map((e) => (
                <button key={e} onClick={() => setForm((f) => ({ ...f, icono: e }))}
                  className={`p-2 rounded-xl text-2xl hover:bg-surface-container transition-all cursor-pointer transform hover:scale-110
                    ${form.icono === e ? 'bg-primary-fixed shadow-inner ring-2 ring-primary ring-offset-1' : ''}
                  `}>{e}</button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Eliminación */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmar eliminación" size="sm"
        footer={<><Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancelar</Button>
          <Button variant="danger" onClick={async () => { if (deleteModal) { await eliminar(deleteModal); setDeleteModal(null) } }}>Eliminar categoría</Button></>}>
        <p className="text-on-surface-variant font-medium">¿Seguro que deseas eliminar esta categoría? Las transacciones que la usan quedarán sin asignar.</p>
      </Modal>
    </div>
  )
}
