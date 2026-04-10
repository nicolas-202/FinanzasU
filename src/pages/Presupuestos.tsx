import { useState } from 'react'
import { Plus, Trash2, Pencil, PiggyBank, ChevronLeft, ChevronRight, Bolt, ArrowRight } from 'lucide-react'
import { usePresupuestos } from '@/hooks/usePresupuestos'
import { useCategorias } from '@/hooks/useCategorias'
import { formatMoneda } from '@/utils/formatMoneda'
import { MESES } from '@/utils/constants'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import AlertBadge from '@/components/ui/AlertBadge'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'

export default function Presupuestos() {
  const ahora = new Date()
  const [mes, setMes] = useState(ahora.getMonth() + 1)
  const [anio, setAnio] = useState(ahora.getFullYear())
  const { presupuestos, loading, resumen, crear, actualizar, eliminar } = usePresupuestos(mes, anio)
  const { categorias } = useCategorias('gasto')

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ categoria_id: '', monto_limite: '' })

  const categoriasOpciones = categorias.map((c) => ({ value: c.id, label: `${c.icono} ${c.nombre}` }))

  const totalGastado = presupuestos.reduce((acc, p) => acc + Number(p.gastado || 0), 0)
  const totalLimite = presupuestos.reduce((acc, p) => acc + Number(p.monto_limite || 0), 0)
  const porcentajeGlobal = totalLimite > 0 ? Math.min((totalGastado / totalLimite) * 100, 100) : 0
  const disponibles = Math.max(totalLimite - totalGastado, 0)

  const categoriaAlerta = presupuestos.find((p) => p.estado === 'rojo') || presupuestos.find((p) => p.estado === 'amarillo')
  const categoriaSana = presupuestos.find((p) => p.estado === 'verde')
  const proyeccion = totalLimite - totalGastado
  const eficiencia = totalLimite > 0 ? Math.max(0, Math.round((1 - (totalGastado / totalLimite)) * 100)) : 100

  const cambiarMes = (d: number) => {
    let m = mes + d
    let a = anio
    if (m > 12) { m = 1; a++ }
    if (m < 1) { m = 12; a-- }
    setMes(m)
    setAnio(a)
  }

  const abrirCrear = () => {
    setEditId(null)
    setForm({ categoria_id: '', monto_limite: '' })
    setModalOpen(true)
  }

  const abrirEditar = (id: string, catId: string, limite: number) => {
    setEditId(id)
    setForm({ categoria_id: catId, monto_limite: String(limite) })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.categoria_id || !form.monto_limite) return
    try {
      if (editId) {
        await actualizar(editId, { monto_limite: parseFloat(form.monto_limite) })
      } else {
        await crear({ categoria_id: form.categoria_id, monto_limite: parseFloat(form.monto_limite) })
      }
      setModalOpen(false)
    } catch {
      // handled by hook
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-primary-fixed text-sm font-semibold mb-2 uppercase tracking-widest">Estado Mensual</p>
            <h3 className="font-headline text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              {resumen.rojo > 0
                ? 'Tienes categorias que requieren ajuste inmediato'
                : resumen.amarillo > 0
                  ? 'Vas bien, pero algunas categorias estan cerca del limite'
                  : 'Excelente control, tus gastos estan saludables'}
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tighter">{formatMoneda(disponibles, true)}</span>
              <span className="text-primary-fixed mb-1 font-medium">disponibles</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
            <span className="material-symbols-outlined text-[200px]">auto_graph</span>
          </div>
        </div>

        <div className="bg-secondary-container p-8 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-on-secondary-container p-2 bg-white/40 rounded-lg">savings</span>
              <span className="text-xs font-bold text-on-secondary-container bg-white/40 px-2 py-1 rounded-full">{formatMoneda(proyeccion)}</span>
            </div>
            <h4 className="text-on-secondary-container font-bold text-lg leading-tight">Meta: ahorro mensual</h4>
            <p className="text-on-secondary-container/70 text-sm mt-1">Progreso de ahorro</p>
          </div>
          <div className="mt-6">
            <div className="w-full h-2 bg-on-secondary-container/10 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${Math.max(0, 100 - porcentajeGlobal)}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-bold text-on-secondary-container">{Math.max(0, 100 - Math.round(porcentajeGlobal))}% libre</span>
              <span className="text-xs font-medium text-on-secondary-container/60">{formatMoneda(totalLimite)} meta</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-2xl font-bold text-on-surface">Alertas Activas</h3>
          <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1 cursor-pointer">
            Configurar alertas <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-tertiary-fixed border-l-4 border-tertiary p-4 rounded-r-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div className="flex-1">
              <p className="text-tertiary-fixed-dim text-xs font-bold uppercase tracking-wider">Limite Cercano</p>
              <p className="text-on-tertiary-fixed font-semibold">
                {categoriaAlerta
                  ? `Has consumido el ${Math.round(categoriaAlerta.porcentaje)}% de tu presupuesto en "${categoriaAlerta.categorias?.nombre || 'Categoria'}"`
                  : 'No hay categorias en zona de riesgo por ahora.'}
              </p>
            </div>
            <button className="text-tertiary font-bold text-xs uppercase tracking-widest px-4 py-2 bg-white/40 rounded-full cursor-pointer">Revisar</button>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 border border-outline-variant/10">
            <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            <div className="flex-1">
              <p className="text-secondary text-xs font-bold uppercase tracking-wider">Buen Trabajo</p>
              <p className="text-on-surface font-semibold">
                {categoriaSana
                  ? `"${categoriaSana.categorias?.nombre || 'Categoria'}" esta bajo control con ${Math.round(categoriaSana.porcentaje)}% consumido.`
                  : 'Aun no hay datos suficientes para destacar una categoria saludable.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">Presupuestos por Categoria</h3>
            <p className="text-on-surface-variant text-sm mt-1">Planificacion mensual para {MESES[mes - 1]} {anio}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/20 w-fit">
              <button onClick={() => cambiarMes(-1)} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
              <span className="text-sm font-bold font-headline text-primary min-w-[130px] text-center">{MESES[mes - 1]} {anio}</span>
              <button onClick={() => cambiarMes(1)} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
            </div>

            <Button onClick={abrirCrear} size="md" icon={Plus}>Nuevo Presupuesto</Button>
          </div>
        </div>

        {presupuestos.length === 0 ? (
          <EmptyState icon={PiggyBank} title="Sin presupuestos asignados" description="Define cuanto quieres gastar maximo cada mes por categoria." actionLabel="Asignar un limite" onAction={abrirCrear} />
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <AlertBadge estado="verde" label={`${resumen.verde} Sanos`} />
              <AlertBadge estado="amarillo" label={`${resumen.amarillo} Alertas`} pulse={resumen.amarillo > 0} />
              <AlertBadge estado="rojo" label={`${resumen.rojo} Excedidos`} pulse={resumen.rojo > 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presupuestos.map((p) => (
                <Card key={p.id} padding="p-6" className="group hover:shadow-xl transition-shadow duration-300 relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${p.estado === 'rojo' ? 'bg-tertiary-fixed' : p.estado === 'amarillo' ? 'bg-primary-fixed' : 'bg-secondary-fixed'}`}>
                      <span className={`text-2xl ${p.estado === 'rojo' ? 'text-tertiary' : p.estado === 'amarillo' ? 'text-primary' : 'text-secondary'}`}>{p.categorias?.icono || '🏷️'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => abrirEditar(p.id, p.categoria_id, Number(p.monto_limite))} className="text-outline hover:text-on-surface transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteModal(p.id)} className="text-outline hover:text-error transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <h4 className="font-bold text-lg text-on-surface mb-1">{p.categorias?.nombre || 'Categoria'}</h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-extrabold text-on-surface">{formatMoneda(p.gastado)}</span>
                    <span className="text-outline text-sm">/ {formatMoneda(p.monto_limite)} mes</span>
                  </div>

                  <div className="relative pt-1">
                    <div className={`overflow-hidden h-3 mb-4 text-xs flex rounded-full ${p.estado === 'rojo' ? 'bg-error-container/40' : p.estado === 'amarillo' ? 'bg-primary-fixed/50' : 'bg-secondary-container/40'}`}>
                      <div className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full ${p.estado === 'rojo' ? 'bg-tertiary' : p.estado === 'amarillo' ? 'bg-primary' : 'bg-secondary'}`} style={{ width: `${Math.min(p.porcentaje, 100)}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-bold ${p.estado === 'rojo' ? 'text-error' : p.estado === 'amarillo' ? 'text-primary' : 'text-secondary'}`}>
                        {p.estado === 'rojo' ? 'Limite casi alcanzado' : `${Math.round(p.porcentaje)}% Consumido`}
                      </span>
                      <span className="text-on-surface-variant font-medium">{formatMoneda(p.restante)} restantes</span>
                    </div>
                  </div>
                </Card>
              ))}

              <div onClick={abrirCrear} className="border-2 border-dashed border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low transition-colors group">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-outline">add_circle</span>
                </div>
                <p className="font-bold text-on-surface-variant">Anadir nueva categoria</p>
                <p className="text-xs text-outline mt-1">Organiza tus gastos a medida</p>
              </div>

              <div className="bg-inverse-surface p-6 rounded-xl text-inverse-on-surface">
                <h4 className="font-headline font-bold text-lg mb-4">Analisis de Ahorro</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-inverse-on-surface/60 text-sm">Proyeccion final</span>
                    <span className="text-secondary-fixed font-bold">{formatMoneda(proyeccion)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-inverse-on-surface/60 text-sm">Eficiencia de gasto</span>
                    <span className="text-primary-fixed font-bold">{eficiencia}%</span>
                  </div>
                </div>
                <div className="mt-8">
                  <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer">Ver Reporte Detallado</button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <div className="fixed bottom-8 right-8 z-40">
        <button onClick={abrirCrear} className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-95 transition-transform cursor-pointer">
          <Bolt className="w-7 h-7" />
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar Limite' : 'Asignar Presupuesto'} size="md"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>{editId ? 'Guardar' : 'Confirmar'}</Button></>}>
        <div className="space-y-6">
          {!editId && <Select id="pres-cat" label="Selecciona la Categoria" options={categoriasOpciones} value={form.categoria_id}
            onChange={(e) => setForm((f) => ({ ...f, categoria_id: e.target.value }))} />}
          <Input id="pres-monto" label="Cual es tu limite? (COP)" type="number" placeholder="Ej. 100000"
            value={form.monto_limite} onChange={(e) => setForm((f) => ({ ...f, monto_limite: e.target.value }))} />
        </div>
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Eliminar limite de presupuesto" size="sm"
        footer={<><Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancelar</Button>
          <Button variant="danger" onClick={async () => { if (deleteModal) { await eliminar(deleteModal); setDeleteModal(null) } }}>Eliminar</Button></>}>
        <p className="text-on-surface-variant font-medium">Eliminar este presupuesto? Tus transacciones no se borraran.</p>
      </Modal>
    </div>
  )
}
