-- ==========================================================
-- FinanzasU - Migracion 002 (hardening + seguridad)
-- Aplica mejoras sobre una BD ya creada con 001_initial_schema.sql
-- ==========================================================

begin;

create extension if not exists pgcrypto;

alter table public.categorias add column if not exists updated_at timestamptz not null default now();
alter table public.transacciones add column if not exists updated_at timestamptz not null default now();
alter table public.presupuestos add column if not exists updated_at timestamptz not null default now();

create unique index if not exists ux_categorias_default_nombre_tipo
on public.categorias ((lower(nombre)), tipo)
where es_predeterminada = true;

create unique index if not exists ux_categorias_usuario_nombre_tipo
on public.categorias (usuario_id, (lower(nombre)), tipo)
where es_predeterminada = false;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at_categorias on public.categorias;
create trigger trg_set_updated_at_categorias
before update on public.categorias
for each row execute function public.set_updated_at();

drop trigger if exists trg_set_updated_at_transacciones on public.transacciones;
create trigger trg_set_updated_at_transacciones
before update on public.transacciones
for each row execute function public.set_updated_at();

drop trigger if exists trg_set_updated_at_presupuestos on public.presupuestos;
create trigger trg_set_updated_at_presupuestos
before update on public.presupuestos
for each row execute function public.set_updated_at();

create or replace function public.validate_categoria_flags()
returns trigger
language plpgsql
as $$
begin
  if new.es_predeterminada and new.usuario_id is not null then
    raise exception 'Una categoria predeterminada no debe tener usuario_id';
  end if;

  if not new.es_predeterminada and new.usuario_id is null then
    raise exception 'Una categoria personalizada requiere usuario_id';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_categoria_flags on public.categorias;
create trigger trg_validate_categoria_flags
before insert or update on public.categorias
for each row execute function public.validate_categoria_flags();

create or replace function public.validate_transaccion_categoria()
returns trigger
language plpgsql
as $$
declare
  v_usuario_id uuid;
  v_es_predeterminada boolean;
  v_tipo varchar(10);
begin
  if new.categoria_id is null then
    return new;
  end if;

  select c.usuario_id, c.es_predeterminada, c.tipo
  into v_usuario_id, v_es_predeterminada, v_tipo
  from public.categorias c
  where c.id = new.categoria_id;

  if not found then
    raise exception 'La categoria seleccionada no existe';
  end if;

  if (not v_es_predeterminada) and v_usuario_id <> new.usuario_id then
    raise exception 'La categoria no pertenece al usuario';
  end if;

  if v_tipo <> new.tipo then
    raise exception 'El tipo de la transaccion no coincide con la categoria';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_transaccion_categoria on public.transacciones;
create trigger trg_validate_transaccion_categoria
before insert or update on public.transacciones
for each row execute function public.validate_transaccion_categoria();

create or replace function public.validate_presupuesto_categoria()
returns trigger
language plpgsql
as $$
declare
  v_usuario_id uuid;
  v_es_predeterminada boolean;
  v_tipo varchar(10);
begin
  select c.usuario_id, c.es_predeterminada, c.tipo
  into v_usuario_id, v_es_predeterminada, v_tipo
  from public.categorias c
  where c.id = new.categoria_id;

  if not found then
    raise exception 'La categoria seleccionada no existe';
  end if;

  if v_tipo <> 'gasto' then
    raise exception 'Solo se pueden crear presupuestos para categorias de gasto';
  end if;

  if (not v_es_predeterminada) and v_usuario_id <> new.usuario_id then
    raise exception 'La categoria del presupuesto no pertenece al usuario';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_presupuesto_categoria on public.presupuestos;
create trigger trg_validate_presupuesto_categoria
before insert or update on public.presupuestos
for each row execute function public.validate_presupuesto_categoria();

-- Re-crear politicas para permitir re-ejecucion segura

drop policy if exists ver_categorias on public.categorias;
drop policy if exists crear_categorias on public.categorias;
drop policy if exists editar_categorias on public.categorias;
drop policy if exists eliminar_categorias on public.categorias;

create policy ver_categorias
on public.categorias
for select
using (es_predeterminada = true or auth.uid() = usuario_id);

create policy crear_categorias
on public.categorias
for insert
with check (auth.uid() = usuario_id and es_predeterminada = false);

create policy editar_categorias
on public.categorias
for update
using (auth.uid() = usuario_id and es_predeterminada = false)
with check (auth.uid() = usuario_id and es_predeterminada = false);

create policy eliminar_categorias
on public.categorias
for delete
using (auth.uid() = usuario_id and es_predeterminada = false);

drop policy if exists ver_transacciones on public.transacciones;
drop policy if exists crear_transacciones on public.transacciones;
drop policy if exists editar_transacciones on public.transacciones;
drop policy if exists eliminar_transacciones on public.transacciones;

create policy ver_transacciones
on public.transacciones
for select
using (auth.uid() = usuario_id);

create policy crear_transacciones
on public.transacciones
for insert
with check (auth.uid() = usuario_id);

create policy editar_transacciones
on public.transacciones
for update
using (auth.uid() = usuario_id)
with check (auth.uid() = usuario_id);

create policy eliminar_transacciones
on public.transacciones
for delete
using (auth.uid() = usuario_id);

drop policy if exists ver_presupuestos on public.presupuestos;
drop policy if exists crear_presupuestos on public.presupuestos;
drop policy if exists editar_presupuestos on public.presupuestos;
drop policy if exists eliminar_presupuestos on public.presupuestos;

create policy ver_presupuestos
on public.presupuestos
for select
using (auth.uid() = usuario_id);

create policy crear_presupuestos
on public.presupuestos
for insert
with check (auth.uid() = usuario_id);

create policy editar_presupuestos
on public.presupuestos
for update
using (auth.uid() = usuario_id)
with check (auth.uid() = usuario_id);

create policy eliminar_presupuestos
on public.presupuestos
for delete
using (auth.uid() = usuario_id);

-- RPCs seguros
create or replace function public.get_resumen_mes(
  p_usuario_id uuid,
  p_mes integer,
  p_anio integer
)
returns table (
  total_ingresos numeric,
  total_gastos numeric,
  balance numeric,
  num_transacciones bigint
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(sum(case when t.tipo = 'ingreso' then t.monto else 0 end), 0) as total_ingresos,
    coalesce(sum(case when t.tipo = 'gasto' then t.monto else 0 end), 0) as total_gastos,
    coalesce(sum(case when t.tipo = 'ingreso' then t.monto else -t.monto end), 0) as balance,
    count(*)::bigint as num_transacciones
  from public.transacciones t
  where t.usuario_id = p_usuario_id
    and extract(month from t.fecha) = p_mes
    and extract(year from t.fecha) = p_anio
    and auth.uid() = p_usuario_id;
$$;

create or replace function public.get_gastos_por_categoria(
  p_usuario_id uuid,
  p_mes integer,
  p_anio integer
)
returns table (
  categoria_nombre varchar,
  categoria_icono varchar,
  total numeric,
  porcentaje numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_gastos numeric;
begin
  if auth.uid() is null or auth.uid() <> p_usuario_id then
    return;
  end if;

  select coalesce(sum(t.monto), 0)
    into v_total_gastos
  from public.transacciones t
  where t.usuario_id = p_usuario_id
    and t.tipo = 'gasto'
    and extract(month from t.fecha) = p_mes
    and extract(year from t.fecha) = p_anio;

  return query
  select
    c.nombre as categoria_nombre,
    c.icono as categoria_icono,
    sum(t.monto) as total,
    case
      when v_total_gastos > 0 then round((sum(t.monto) / v_total_gastos) * 100, 1)
      else 0
    end as porcentaje
  from public.transacciones t
  join public.categorias c on c.id = t.categoria_id
  where t.usuario_id = p_usuario_id
    and t.tipo = 'gasto'
    and extract(month from t.fecha) = p_mes
    and extract(year from t.fecha) = p_anio
  group by c.nombre, c.icono
  order by total desc;
end;
$$;

create or replace function public.get_evolucion_mensual(
  p_usuario_id uuid,
  p_meses integer default 6
)
returns table (
  mes integer,
  anio integer,
  mes_nombre text,
  ingresos numeric,
  gastos numeric
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.uid() <> p_usuario_id then
    return;
  end if;

  return query
  with meses_rango as (
    select
      extract(month from d)::integer as mes_num,
      extract(year from d)::integer as anio_num,
      to_char(d, 'Mon') as nombre_mes
    from generate_series(
      date_trunc('month', current_date) - ((p_meses - 1) || ' months')::interval,
      date_trunc('month', current_date),
      '1 month'::interval
    ) d
  )
  select
    mr.mes_num as mes,
    mr.anio_num as anio,
    mr.nombre_mes as mes_nombre,
    coalesce(sum(case when t.tipo = 'ingreso' then t.monto else 0 end), 0) as ingresos,
    coalesce(sum(case when t.tipo = 'gasto' then t.monto else 0 end), 0) as gastos
  from meses_rango mr
  left join public.transacciones t
    on t.usuario_id = p_usuario_id
    and extract(month from t.fecha) = mr.mes_num
    and extract(year from t.fecha) = mr.anio_num
  group by mr.mes_num, mr.anio_num, mr.nombre_mes
  order by mr.anio_num, mr.mes_num;
end;
$$;

create or replace function public.get_top_categorias(
  p_usuario_id uuid,
  p_mes integer,
  p_anio integer
)
returns table (
  categoria_nombre varchar,
  categoria_icono varchar,
  total numeric,
  num_transacciones bigint
)
language sql
security definer
set search_path = public
as $$
  select
    c.nombre as categoria_nombre,
    c.icono as categoria_icono,
    sum(t.monto) as total,
    count(*)::bigint as num_transacciones
  from public.transacciones t
  join public.categorias c on c.id = t.categoria_id
  where t.usuario_id = p_usuario_id
    and t.tipo = 'gasto'
    and extract(month from t.fecha) = p_mes
    and extract(year from t.fecha) = p_anio
    and auth.uid() = p_usuario_id
  group by c.nombre, c.icono
  order by total desc
  limit 5;
$$;

create or replace function public.get_estado_presupuestos(
  p_usuario_id uuid,
  p_mes integer,
  p_anio integer
)
returns table (
  verde bigint,
  amarillo bigint,
  rojo bigint,
  total_presupuestos bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.uid() <> p_usuario_id then
    return;
  end if;

  return query
  with presupuestos_con_gasto as (
    select
      p.monto_limite,
      coalesce(sum(t.monto), 0) as gastado,
      case
        when coalesce(sum(t.monto), 0) >= p.monto_limite then 'rojo'
        when coalesce(sum(t.monto), 0) >= p.monto_limite * 0.8 then 'amarillo'
        else 'verde'
      end as estado
    from public.presupuestos p
    left join public.transacciones t
      on t.usuario_id = p.usuario_id
      and t.categoria_id = p.categoria_id
      and t.tipo = 'gasto'
      and extract(month from t.fecha) = p.mes
      and extract(year from t.fecha) = p.anio
    where p.usuario_id = p_usuario_id
      and p.mes = p_mes
      and p.anio = p_anio
    group by p.id, p.monto_limite
  )
  select
    count(*) filter (where estado = 'verde') as verde,
    count(*) filter (where estado = 'amarillo') as amarillo,
    count(*) filter (where estado = 'rojo') as rojo,
    count(*) as total_presupuestos
  from presupuestos_con_gasto;
end;
$$;

revoke all on function public.get_resumen_mes(uuid, integer, integer) from public;
revoke all on function public.get_gastos_por_categoria(uuid, integer, integer) from public;
revoke all on function public.get_evolucion_mensual(uuid, integer) from public;
revoke all on function public.get_top_categorias(uuid, integer, integer) from public;
revoke all on function public.get_estado_presupuestos(uuid, integer, integer) from public;

grant execute on function public.get_resumen_mes(uuid, integer, integer) to authenticated, service_role;
grant execute on function public.get_gastos_por_categoria(uuid, integer, integer) to authenticated, service_role;
grant execute on function public.get_evolucion_mensual(uuid, integer) to authenticated, service_role;
grant execute on function public.get_top_categorias(uuid, integer, integer) to authenticated, service_role;
grant execute on function public.get_estado_presupuestos(uuid, integer, integer) to authenticated, service_role;

commit;
