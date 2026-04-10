# Guia de Arquitectura - FinanzasU

## 1. Vision general

FinanzasU sigue una arquitectura frontend + BaaS:

- Frontend: React + Vite + TypeScript
- BaaS: Supabase (Auth, PostgreSQL, RLS, RPC)
- Estilos: Tailwind CSS

Objetivo:

- Separar UI, logica de negocio y acceso a datos para facilitar trabajo paralelo por HU.

## 2. Capas del sistema

### Presentacion

Ubicacion: src/pages y src/components

Responsabilidad:

- Renderizar vistas
- Capturar interaccion del usuario
- Mostrar estados de carga, exito y error

### Logica de aplicacion

Ubicacion: src/hooks y src/contexts

Responsabilidad:

- Orquestar datos para cada modulo
- Administrar estado compartido de sesion
- Encapsular reglas de negocio del cliente

### Acceso a datos

Ubicacion: src/services

Responsabilidad:

- Consumir Supabase (CRUD y RPC)
- Mantener contratos de datos estables
- Aislar detalles de infraestructura

### Persistencia y seguridad

Ubicacion: supabase/migrations y supabase/*.sql

Responsabilidad:

- Definir esquema
- Aplicar RLS
- Exponer funciones RPC seguras para dashboard

## 3. Modulos funcionales

- Autenticacion: login, registro, sesion y perfil
- Transacciones: CRUD, filtros, paginacion y exportacion
- Categorias: predeterminadas y personalizadas
- Presupuestos: limites por categoria y estado
- Dashboard/Analisis: metricas y graficas por RPC

## 4. Flujo de datos

1. Usuario interactua con componente en pages/components.
2. Componente invoca un hook del modulo.
3. Hook consume funciones del service correspondiente.
4. Service ejecuta consulta o RPC en Supabase.
5. RLS filtra datos por auth.uid().
6. Hook normaliza resultados y actualiza estado.
7. UI renderiza datos y feedback al usuario.

## 5. Modos de autenticacion

### Modo local

Condicion:

- VITE_AUTH_MODE=local o credenciales Supabase ausentes

Uso:

- Desarrollo de interfaz
- Pruebas basicas sin backend

### Modo Supabase

Condicion:

- VITE_AUTH_MODE=supabase y variables validas

Uso:

- Historias con persistencia
- Validacion de reglas y RLS

## 6. Esquema de base de datos

Tablas de dominio:

- categorias
- transacciones
- presupuestos

Entidad de autenticacion:

- auth.users (gestionada por Supabase)

Elementos clave:

- RLS en tablas de dominio
- Politicas por usuario autenticado
- RPC de dashboard con security definer + search_path controlado

## 7. Principios de diseno para HU

- Una HU no debe romper contratos de services existentes.
- Cambios de esquema requieren script SQL versionado.
- Todo cambio de datos debe considerar RLS desde el inicio.
- Componentes UI reutilizables en src/components/ui.
- No mezclar consultas directas en pages; usar hooks/services.

## 8. Checklist tecnico por HU

- Criterios de aceptacion implementados
- Lint y build en verde
- Manejo de estado de carga/error
- Validacion de permisos RLS (si aplica)
- Sin regresiones visibles en modulo relacionado
