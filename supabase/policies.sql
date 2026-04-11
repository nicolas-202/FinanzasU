-- Activar RLS
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presupuestos ENABLE ROW LEVEL SECURITY;

-- Perfiles: cada usuario solo ve y edita el suyo
CREATE POLICY "solo_mi_perfil" ON public.perfiles
  FOR ALL USING (auth.uid() = id);

-- Categorías: las suyas + las predeterminadas del sistema (user_id IS NULL)
CREATE POLICY "mis_categorias_y_globales" ON public.categorias
  FOR ALL USING (user_id = auth.uid() OR user_id IS NULL);

-- Transacciones: solo las suyas
CREATE POLICY "solo_mis_transacciones" ON public.transacciones
  FOR ALL USING (auth.uid() = user_id);

-- Presupuestos: solo los suyos
CREATE POLICY "solo_mis_presupuestos" ON public.presupuestos
  FOR ALL USING (auth.uid() = user_id);