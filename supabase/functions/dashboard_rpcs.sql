-- ═══════════════════════════════════════════════════════════
-- FinanzasU — Funciones RPC para el Dashboard
-- Archivo: supabase/functions/dashboard_rpcs.sql
-- ═══════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────
-- get_resumen_mes: Total ingresos, gastos, balance y N° transacciones
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_resumen_mes(
  p_usuario_id UUID,
  p_mes INTEGER,
  p_anio INTEGER
)
RETURNS TABLE (
  total_ingresos NUMERIC,
  total_gastos NUMERIC,
  balance NUMERIC,
  num_transacciones BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE 0 END), 0) AS total_ingresos,
    COALESCE(SUM(CASE WHEN t.tipo = 'gasto' THEN t.monto ELSE 0 END), 0) AS total_gastos,
    COALESCE(SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE -t.monto END), 0) AS balance,
    COUNT(*)::BIGINT AS num_transacciones
  FROM transacciones t
  WHERE t.usuario_id = p_usuario_id
    AND EXTRACT(MONTH FROM t.fecha) = p_mes
    AND EXTRACT(YEAR FROM t.fecha) = p_anio;
END;
$$;

-- ─────────────────────────────────────────────────────────
-- get_gastos_por_categoria: Distribución de gastos (para gráfica de torta)
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_gastos_por_categoria(
  p_usuario_id UUID,
  p_mes INTEGER,
  p_anio INTEGER
)
RETURNS TABLE (
  categoria_nombre VARCHAR,
  categoria_icono VARCHAR,
  total NUMERIC,
  porcentaje NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_gastos NUMERIC;
BEGIN
  -- Calcular total de gastos del mes
  SELECT COALESCE(SUM(t.monto), 0)
  INTO v_total_gastos
  FROM transacciones t
  WHERE t.usuario_id = p_usuario_id
    AND t.tipo = 'gasto'
    AND EXTRACT(MONTH FROM t.fecha) = p_mes
    AND EXTRACT(YEAR FROM t.fecha) = p_anio;

  RETURN QUERY
  SELECT
    c.nombre AS categoria_nombre,
    c.icono AS categoria_icono,
    SUM(t.monto) AS total,
    CASE WHEN v_total_gastos > 0
      THEN ROUND((SUM(t.monto) / v_total_gastos) * 100, 1)
      ELSE 0
    END AS porcentaje
  FROM transacciones t
  JOIN categorias c ON c.id = t.categoria_id
  WHERE t.usuario_id = p_usuario_id
    AND t.tipo = 'gasto'
    AND EXTRACT(MONTH FROM t.fecha) = p_mes
    AND EXTRACT(YEAR FROM t.fecha) = p_anio
  GROUP BY c.nombre, c.icono
  ORDER BY total DESC;
END;
$$;

-- ─────────────────────────────────────────────────────────
-- get_evolucion_mensual: Ingresos y gastos últimos N meses (barras)
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_evolucion_mensual(
  p_usuario_id UUID,
  p_meses INTEGER DEFAULT 6
)
RETURNS TABLE (
  mes INTEGER,
  anio INTEGER,
  mes_nombre TEXT,
  ingresos NUMERIC,
  gastos NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH meses_rango AS (
    SELECT
      EXTRACT(MONTH FROM d)::INTEGER AS mes_num,
      EXTRACT(YEAR FROM d)::INTEGER AS anio_num,
      TO_CHAR(d, 'Mon') AS nombre_mes
    FROM generate_series(
      date_trunc('month', CURRENT_DATE) - ((p_meses - 1) || ' months')::interval,
      date_trunc('month', CURRENT_DATE),
      '1 month'::interval
    ) d
  )
  SELECT
    mr.mes_num AS mes,
    mr.anio_num AS anio,
    mr.nombre_mes AS mes_nombre,
    COALESCE(SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE 0 END), 0) AS ingresos,
    COALESCE(SUM(CASE WHEN t.tipo = 'gasto' THEN t.monto ELSE 0 END), 0) AS gastos
  FROM meses_rango mr
  LEFT JOIN transacciones t
    ON t.usuario_id = p_usuario_id
    AND EXTRACT(MONTH FROM t.fecha) = mr.mes_num
    AND EXTRACT(YEAR FROM t.fecha) = mr.anio_num
  GROUP BY mr.mes_num, mr.anio_num, mr.nombre_mes
  ORDER BY mr.anio_num, mr.mes_num;
END;
$$;

-- ─────────────────────────────────────────────────────────
-- get_top_categorias: Top 5 categorías con más gasto del mes
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_top_categorias(
  p_usuario_id UUID,
  p_mes INTEGER,
  p_anio INTEGER
)
RETURNS TABLE (
  categoria_nombre VARCHAR,
  categoria_icono VARCHAR,
  total NUMERIC,
  num_transacciones BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.nombre AS categoria_nombre,
    c.icono AS categoria_icono,
    SUM(t.monto) AS total,
    COUNT(*)::BIGINT AS num_transacciones
  FROM transacciones t
  JOIN categorias c ON c.id = t.categoria_id
  WHERE t.usuario_id = p_usuario_id
    AND t.tipo = 'gasto'
    AND EXTRACT(MONTH FROM t.fecha) = p_mes
    AND EXTRACT(YEAR FROM t.fecha) = p_anio
  GROUP BY c.nombre, c.icono
  ORDER BY total DESC
  LIMIT 5;
END;
$$;

-- ─────────────────────────────────────────────────────────
-- get_estado_presupuestos: Contadores verde / amarillo / rojo
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_estado_presupuestos(
  p_usuario_id UUID,
  p_mes INTEGER,
  p_anio INTEGER
)
RETURNS TABLE (
  verde BIGINT,
  amarillo BIGINT,
  rojo BIGINT,
  total_presupuestos BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH presupuestos_con_gasto AS (
    SELECT
      p.monto_limite,
      COALESCE(SUM(t.monto), 0) AS gastado,
      CASE
        WHEN COALESCE(SUM(t.monto), 0) >= p.monto_limite THEN 'rojo'
        WHEN COALESCE(SUM(t.monto), 0) >= p.monto_limite * 0.8 THEN 'amarillo'
        ELSE 'verde'
      END AS estado
    FROM presupuestos p
    LEFT JOIN transacciones t
      ON t.usuario_id = p.usuario_id
      AND t.categoria_id = p.categoria_id
      AND t.tipo = 'gasto'
      AND EXTRACT(MONTH FROM t.fecha) = p.mes
      AND EXTRACT(YEAR FROM t.fecha) = p.anio
    WHERE p.usuario_id = p_usuario_id
      AND p.mes = p_mes
      AND p.anio = p_anio
    GROUP BY p.id, p.monto_limite
  )
  SELECT
    COUNT(*) FILTER (WHERE pg.estado = 'verde') AS verde,
    COUNT(*) FILTER (WHERE pg.estado = 'amarillo') AS amarillo,
    COUNT(*) FILTER (WHERE pg.estado = 'rojo') AS rojo,
    COUNT(*) AS total_presupuestos
  FROM presupuestos_con_gasto pg;
END;
$$;
