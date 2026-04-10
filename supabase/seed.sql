-- ==========================================================
-- FinanzasU - Seed real para Supabase (idempotente)
-- Archivo: supabase/seed.sql
--
-- Requisito previo:
-- 1) Debes crear este usuario en Auth:
--    correo: test@finanzasu.com
--    clave:  Test1234
-- ==========================================================

-- ─────────────────────────────────────────────────────────
-- Categorías predeterminadas (sin usuario — visibles para todos)
-- ─────────────────────────────────────────────────────────
insert into public.categorias (nombre, tipo, icono, es_predeterminada)
values
  ('Alimentación',   'gasto',   '🍔', true),
  ('Transporte',     'gasto',   '🚌', true),
  ('Entretenimiento','gasto',   '🎮', true),
  ('Educación',      'gasto',   '📚', true),
  ('Salud',          'gasto',   '💊', true),
  ('Ropa',           'gasto',   '👕', true),
  ('Servicios',      'gasto',   '💡', true),
  ('Otros gastos',   'gasto',   '📦', true),
  ('Mesada',         'ingreso', '💰', true),
  ('Beca',           'ingreso', '🎓', true),
  ('Trabajo',        'ingreso', '💼', true),
  ('Freelance',      'ingreso', '💻', true),
  ('Otros ingresos', 'ingreso', '🪙', true)
on conflict do nothing;

do $$
declare
  v_user_id uuid;
  v_mes int := extract(month from current_date)::int;
  v_anio int := extract(year from current_date)::int;

  v_cat_salud uuid;
  v_cat_suscripciones uuid;
  v_cat_freelance uuid;
  v_cat_trabajo uuid;
  v_cat_alimentacion uuid;
  v_cat_transporte uuid;
begin
  select id into v_user_id
  from auth.users
  where email = 'test@finanzasu.com'
  limit 1;

  if v_user_id is null then
    raise notice 'No existe auth.users para test@finanzasu.com. Crea el usuario y vuelve a correr seed.sql';
    return;
  end if;

  -- Categorias personalizadas del usuario
  insert into public.categorias (usuario_id, nombre, tipo, icono, es_predeterminada)
  values
    (v_user_id, 'Salud preventiva', 'gasto', '🩺', false),
    (v_user_id, 'Suscripciones digitales', 'gasto', '📺', false),
    (v_user_id, 'Proyectos freelance', 'ingreso', '🧑‍💻', false)
  on conflict do nothing;

  select id into v_cat_salud
  from public.categorias
  where usuario_id = v_user_id and lower(nombre) = lower('Salud preventiva') and tipo = 'gasto'
  limit 1;

  select id into v_cat_suscripciones
  from public.categorias
  where usuario_id = v_user_id and lower(nombre) = lower('Suscripciones digitales') and tipo = 'gasto'
  limit 1;

  select id into v_cat_freelance
  from public.categorias
  where usuario_id = v_user_id and lower(nombre) = lower('Proyectos freelance') and tipo = 'ingreso'
  limit 1;

  select id into v_cat_trabajo
  from public.categorias
  where es_predeterminada = true and lower(nombre) = lower('Trabajo') and tipo = 'ingreso'
  limit 1;

  select id into v_cat_alimentacion
  from public.categorias
  where es_predeterminada = true and lower(nombre) = lower('Alimentación') and tipo = 'gasto'
  limit 1;

  select id into v_cat_transporte
  from public.categorias
  where es_predeterminada = true and lower(nombre) = lower('Transporte') and tipo = 'gasto'
  limit 1;

  -- Transacciones ejemplo del mes actual (sin duplicar en re-ejecucion)
  insert into public.transacciones (usuario_id, categoria_id, monto, tipo, descripcion, fecha)
  select
    v_user_id,
    t.categoria_id,
    t.monto,
    t.tipo,
    t.descripcion,
    t.fecha
  from (
    values
      (v_cat_trabajo, 1800000::numeric, 'ingreso'::varchar, 'Pago mensual trabajo de medio tiempo'::text, (current_date - interval '20 day')::date),
      (v_cat_freelance, 550000::numeric, 'ingreso'::varchar, 'Proyecto de diseño landing page'::text, (current_date - interval '12 day')::date),
      (v_cat_alimentacion, 95000::numeric, 'gasto'::varchar, 'Mercado semanal'::text, (current_date - interval '10 day')::date),
      (v_cat_transporte, 40000::numeric, 'gasto'::varchar, 'Recarga tarjeta transporte'::text, (current_date - interval '8 day')::date),
      (v_cat_suscripciones, 39000::numeric, 'gasto'::varchar, 'Plataforma de streaming'::text, (current_date - interval '6 day')::date),
      (v_cat_salud, 25000::numeric, 'gasto'::varchar, 'Medicamentos y vitaminas'::text, (current_date - interval '3 day')::date)
  ) as t(categoria_id, monto, tipo, descripcion, fecha)
  where t.categoria_id is not null
    and not exists (
      select 1
      from public.transacciones tx
      where tx.usuario_id = v_user_id
        and tx.categoria_id = t.categoria_id
        and tx.monto = t.monto
        and tx.tipo = t.tipo
        and coalesce(tx.descripcion, '') = coalesce(t.descripcion, '')
        and tx.fecha = t.fecha
    );

  -- Presupuestos del mes actual
  if v_cat_alimentacion is not null then
    insert into public.presupuestos (usuario_id, categoria_id, monto_limite, mes, anio)
    values (v_user_id, v_cat_alimentacion, 300000, v_mes, v_anio)
    on conflict (usuario_id, categoria_id, mes, anio)
    do update set monto_limite = excluded.monto_limite;
  end if;

  if v_cat_transporte is not null then
    insert into public.presupuestos (usuario_id, categoria_id, monto_limite, mes, anio)
    values (v_user_id, v_cat_transporte, 160000, v_mes, v_anio)
    on conflict (usuario_id, categoria_id, mes, anio)
    do update set monto_limite = excluded.monto_limite;
  end if;

  if v_cat_suscripciones is not null then
    insert into public.presupuestos (usuario_id, categoria_id, monto_limite, mes, anio)
    values (v_user_id, v_cat_suscripciones, 80000, v_mes, v_anio)
    on conflict (usuario_id, categoria_id, mes, anio)
    do update set monto_limite = excluded.monto_limite;
  end if;

  if v_cat_salud is not null then
    insert into public.presupuestos (usuario_id, categoria_id, monto_limite, mes, anio)
    values (v_user_id, v_cat_salud, 120000, v_mes, v_anio)
    on conflict (usuario_id, categoria_id, mes, anio)
    do update set monto_limite = excluded.monto_limite;
  end if;

  raise notice 'Seed completado para usuario %', v_user_id;
end $$;
