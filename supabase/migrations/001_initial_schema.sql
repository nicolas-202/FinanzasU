-- ═══════════════════════════════════════════════════════════
-- FinanzasU — Esquema inicial de base de datos
-- Archivo: supabase/migrations/001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────
-- Tabla: categorias
-- Categorías de transacciones (predeterminadas + personalizadas)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(50) NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  icono VARCHAR(30) DEFAULT '📂',
  es_predeterminada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para categorias
CREATE INDEX IF NOT EXISTS idx_categorias_usuario ON categorias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_categorias_tipo ON categorias(tipo);

-- Habilitar RLS
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────
-- Tabla: transacciones
-- Registro de ingresos y gastos del usuario
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transacciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  monto NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  descripcion TEXT,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para transacciones
CREATE INDEX IF NOT EXISTS idx_transacciones_usuario ON transacciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones(tipo);
CREATE INDEX IF NOT EXISTS idx_transacciones_categoria ON transacciones(categoria_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_usuario_fecha ON transacciones(usuario_id, fecha);

-- Habilitar RLS
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────
-- Tabla: presupuestos
-- Límites mensuales de gasto por categoría
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS presupuestos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE NOT NULL,
  monto_limite NUMERIC(12,2) NOT NULL CHECK (monto_limite > 0),
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  anio INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(usuario_id, categoria_id, mes, anio)
);

-- Índices para presupuestos
CREATE INDEX IF NOT EXISTS idx_presupuestos_usuario ON presupuestos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_periodo ON presupuestos(usuario_id, mes, anio);

-- Habilitar RLS
ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
