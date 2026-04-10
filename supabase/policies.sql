-- ═══════════════════════════════════════════════════════════
-- FinanzasU — Políticas Row Level Security (RLS)
-- Archivo: supabase/policies.sql
-- ═══════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────
-- Políticas para: categorias
-- ─────────────────────────────────────────────────────────

-- Ver: categorías propias + predeterminadas
CREATE POLICY "ver_categorias"
ON categorias FOR SELECT
USING (
  es_predeterminada = true
  OR auth.uid() = usuario_id
);

-- Crear: solo categorías propias
CREATE POLICY "crear_categorias"
ON categorias FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

-- Editar: solo categorías propias (no predeterminadas)
CREATE POLICY "editar_categorias"
ON categorias FOR UPDATE
USING (auth.uid() = usuario_id AND es_predeterminada = false)
WITH CHECK (auth.uid() = usuario_id);

-- Eliminar: solo categorías propias (no predeterminadas)
CREATE POLICY "eliminar_categorias"
ON categorias FOR DELETE
USING (auth.uid() = usuario_id AND es_predeterminada = false);

-- ─────────────────────────────────────────────────────────
-- Políticas para: transacciones
-- ─────────────────────────────────────────────────────────

-- Cada usuario solo ve y modifica sus propias transacciones
CREATE POLICY "ver_transacciones"
ON transacciones FOR SELECT
USING (auth.uid() = usuario_id);

CREATE POLICY "crear_transacciones"
ON transacciones FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "editar_transacciones"
ON transacciones FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "eliminar_transacciones"
ON transacciones FOR DELETE
USING (auth.uid() = usuario_id);

-- ─────────────────────────────────────────────────────────
-- Políticas para: presupuestos
-- ─────────────────────────────────────────────────────────

CREATE POLICY "ver_presupuestos"
ON presupuestos FOR SELECT
USING (auth.uid() = usuario_id);

CREATE POLICY "crear_presupuestos"
ON presupuestos FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "editar_presupuestos"
ON presupuestos FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "eliminar_presupuestos"
ON presupuestos FOR DELETE
USING (auth.uid() = usuario_id);
