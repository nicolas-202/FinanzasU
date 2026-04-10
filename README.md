# 💰 FinanzasU

> Plataforma web de gestión financiera personal dirigida a estudiantes universitarios.

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Gráficas-FF6384?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat-square&logo=vite&logoColor=white)
![Git](https://img.shields.io/badge/Git-GitHub-F05032?style=flat-square&logo=git&logoColor=white)
![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-orange?style=flat-square)
![Universidad](https://img.shields.io/badge/Universidad%20del%20Valle-Sede%20Zarzal-1A5276?style=flat-square)

---

## 📋 Tabla de contenido

- [Descripción](#-descripción)
- [Funcionalidades](#-funcionalidades)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación local](#-instalación-local)
- [Guías operativas](#-guías-operativas)
- [Base de datos Supabase](#-base-de-datos-supabase)
- [Supabase — Endpoints y servicios](#-supabase--endpoints-y-servicios)
- [Seguridad](#-seguridad)
- [Metodología Scrum](#-metodología-scrum)
- [Partes del contrato](#-partes-del-contrato)
- [Equipo de desarrollo](#-equipo-de-desarrollo)

---

## 📖 Descripción

**FinanzasU** es una plataforma web que ayuda a estudiantes universitarios a tomar el control de sus finanzas personales. Permite registrar ingresos y gastos, establecer presupuestos mensuales por categoría, recibir alertas automáticas al acercarse a los límites de gasto y visualizar estadísticas interactivas sobre hábitos de consumo.

El proyecto surge como respuesta a una necesidad real: la mayoría de estudiantes universitarios asume responsabilidades económicas sin formación financiera previa. Las aplicaciones financieras existentes están orientadas a usuarios con experiencia o requieren vinculación bancaria, lo que limita su utilidad para este público.

Desarrollado como proyecto académico en la **Universidad del Valle sede Zarzal** bajo la asignatura *Introducción a la Gestión de Proyectos de Software*, aplicando metodología **Scrum** en 5 sprints de 15 días.

> **Cliente:** FinanzasU S.A.S. — Representante Legal: Juan Camilo Triana
> **Desarrollador:** Rise — Representante Legal: Deibyd Castillo

---

## ✨ Funcionalidades

| Módulo | Descripción |
|---|---|
| 🔐 **Autenticación** | Registro, login y logout con Supabase Auth, tokens JWT y hash bcrypt |
| 💸 **Transacciones** | Registrar, editar, eliminar, filtrar, paginar y exportar a CSV |
| 🏷️ **Categorías** | Categorías predeterminadas del sistema + personalizadas por usuario |
| 📊 **Presupuesto** | Límites mensuales por categoría con alertas automáticas al 80% y 100% |
| 📈 **Dashboard** | Gráficas interactivas con Recharts: torta, barras, línea y tarjetas de resumen |
| 👤 **Perfil** | Edición de datos personales y cambio de contraseña |

---

## 🛠️ Stack tecnológico

```
Frontend      →  React 18+ (Vite como bundler)
Estilos       →  Tailwind CSS
Backend & DB  →  Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Gráficas      →  Recharts
Autenticación →  Supabase Auth (JWT + bcrypt)
Seguridad DB  →  Row Level Security (RLS) de Supabase
Versiones     →  Git + GitHub
```

### ¿Por qué este stack?

| Decisión | Justificación |
|---|---|
| **React** | Componentes reutilizables, ecosistema maduro, ideal para UIs dinámicas |
| **Supabase** | Backend listo en minutos: PostgreSQL + Auth + API REST + RLS |
| **Tailwind CSS** | Utility-first, responsive design sin salir del JSX |
| **Recharts** | Librería de gráficas nativa para React, fácil de integrar con hooks |
| **Vite** | Servidor de desarrollo ultra rápido con HMR y build optimizado |

---

## 📁 Estructura del proyecto

```
finanzasU/
│
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── layout/
│   │   │   ├── Navbar.jsx       # Navegación lateral responsive
│   │   │   ├── Layout.jsx       # Wrapper global con navbar y rutas protegidas
│   │   │   └── ProtectedRoute.jsx  # HOC que verifica sesión Supabase
│   │   ├── ui/
│   │   │   ├── Modal.jsx        # Modal de confirmación reutilizable
│   │   │   ├── ProgressBar.jsx  # Barra de progreso con estados de color
│   │   │   ├── Spinner.jsx      # Indicador de carga
│   │   │   └── AlertBadge.jsx   # Badge de alerta (amarillo / rojo)
│   │   └── charts/
│   │       ├── PieChart.jsx     # Gráfica de torta — gastos por categoría
│   │       ├── BarChart.jsx     # Gráfica de barras — ingresos vs gastos 6 meses
│   │       └── LineChart.jsx    # Gráfica de línea — balance histórico
│   │
│   ├── pages/                   # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transacciones.jsx
│   │   ├── Categorias.jsx
│   │   ├── Presupuestos.jsx
│   │   └── Perfil.jsx
│   │
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.js           # Sesión con Supabase Auth
│   │   ├── useTransacciones.js  # CRUD de transacciones
│   │   ├── useCategorias.js     # CRUD de categorías
│   │   ├── usePresupuestos.js   # Presupuestos con porcentaje calculado
│   │   └── useDashboard.js      # Consultas de estadísticas
│   │
│   ├── services/                # Capa de acceso a Supabase
│   │   ├── supabaseClient.js    # Inicialización del cliente Supabase
│   │   ├── transaccionesService.js
│   │   ├── categoriasService.js
│   │   ├── presupuestosService.js
│   │   └── dashboardService.js
│   │
│   ├── utils/
│   │   ├── formatMoneda.js      # Formateador: $ 1.250.000
│   │   ├── exportCSV.js         # Generador de CSV en el cliente
│   │   └── constants.js         # Categorías predeterminadas y constantes
│   │
│   ├── App.jsx                  # Router principal con rutas protegidas
│   └── main.jsx                 # Punto de entrada React + Vite
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Crea todas las tablas desde cero
│   ├── seed.sql                 # Datos de prueba
│   └── policies.sql             # Políticas Row Level Security (RLS)
│
├── docs/
│   ├── diagrama-ER.png          # Diagrama entidad-relación
│   ├── API.md                   # Documentación de servicios Supabase
│   └── rls-policies.md          # Documentación de políticas RLS
│
├── .env.example                 # Variables de entorno requeridas
├── .env.local                   # Variables locales (NO subir a Git)
├── .gitignore
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🚀 Instalación local

Guia detallada y estandar del equipo:

- [docs/GUIA_INSTALACION.md](docs/GUIA_INSTALACION.md)

### Requisitos previos

- [Node.js](https://nodejs.org/) 18.0 o superior
- [Git](https://git-scm.com/)
- Cuenta en [Supabase](https://supabase.com/) (gratuita)

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/finanzasU.git
cd finanzasU
```

### Paso 2 — Instalar dependencias

```bash
npm install
```

### Paso 3 — Crear el proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com/) y crear un nuevo proyecto
2. Ir a **Settings → API** y copiar:
   - `Project URL`
   - `anon public key`

### Paso 4 — Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Nunca subas `.env.local` al repositorio.** Ya está en el `.gitignore`.

### Paso 5 — Inicializar la base de datos

En el **SQL Editor** de tu proyecto Supabase, ejecuta en orden:

```sql
-- 1. Crear tablas
\i supabase/001_initial_schema.sql

-- 2. Aplicar políticas RLS
\i supabase/policies.sql

-- Datos de prueba (opcional)
\i supabase/seed.sql
```

Guia completa de instalacion:

- [docs/GUIA_INSTALACION.md](docs/GUIA_INSTALACION.md)
O con la CLI de Supabase:

```bash
supabase db push
```

### Paso 6 — Iniciar el servidor de desarrollo

```bash
npm run dev
```

La app estará en:

```
http://localhost:5173
```

Usuario de prueba del `seed.sql`:

```
Correo:     test@finanzasu.com
Contraseña: Test1234
```

---

## 🗄️ Base de datos Supabase

El esquema PostgreSQL contiene 4 tablas con RLS habilitado:

```
auth.users (Supabase)   →  Gestionada automáticamente por Supabase Auth
categorias              →  id, nombre, tipo, usuario_id, icono, es_predeterminada
transacciones           →  id, usuario_id, categoria_id, monto, tipo, descripcion, fecha
presupuestos            →  id, usuario_id, categoria_id, monto_limite, mes, anio
```

Diagrama ER completo: [`/docs/diagrama-ER.png`](docs/diagrama-ER.png)

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Ejemplo de política:

```sql
-- Cada usuario solo ve y modifica sus propias transacciones
CREATE POLICY "solo_mis_transacciones"
ON transacciones FOR ALL
USING (auth.uid() = usuario_id);
```

Documentación completa: [`/docs/rls-policies.md`](docs/rls-policies.md)

---

## 📚 Guías operativas

- Instalación: [docs/GUIA_INSTALACION.md](docs/GUIA_INSTALACION.md)
- Arquitectura: [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)
- Flujo de ramas: [docs/GUIA_RAMAS.md](docs/GUIA_RAMAS.md)

---

## 🔌 Supabase — Endpoints y servicios

El frontend consume Supabase directamente con `@supabase/supabase-js`.

### Autenticación

```javascript
// Registro
await supabase.auth.signUp({ email, password })

// Login
await supabase.auth.signInWithPassword({ email, password })

// Logout
await supabase.auth.signOut()

// Sesión activa
const { data: { session } } = await supabase.auth.getSession()
```

### Transacciones

```javascript
// Listar con filtros y paginación
supabase.from('transacciones')
  .select('*, categorias(nombre)')
  .eq('usuario_id', userId)
  .gte('fecha', inicioMes)
  .lte('fecha', finMes)
  .order('fecha', { ascending: false })
  .range(offset, offset + limite - 1)

// Crear / Editar / Eliminar
supabase.from('transacciones').insert({ ...datos, usuario_id: userId })
supabase.from('transacciones').update(datos).eq('id', id).eq('usuario_id', userId)
supabase.from('transacciones').delete().eq('id', id).eq('usuario_id', userId)
```

### Funciones RPC del Dashboard

| Función | Descripción |
|---|---|
| `get_resumen_mes` | Total ingresos, gastos, balance y N° transacciones |
| `get_gastos_por_categoria` | Distribución de gastos con porcentajes para la torta |
| `get_evolucion_mensual` | Ingresos y gastos de los últimos 6 meses para las barras |
| `get_top_categorias` | Top 5 categorías con más gasto del mes |
| `get_estado_presupuestos` | Contadores verde / amarillo / rojo de presupuestos |

Documentación completa: [`/docs/API.md`](docs/API.md)

---

## 🔒 Seguridad

| Capa | Mecanismo |
|---|---|
| **Autenticación** | Supabase Auth — tokens JWT firmados con expiración automática |
| **Contraseñas** | Hash bcrypt gestionado internamente por Supabase Auth |
| **Acceso a datos** | Row Level Security (RLS) — nadie accede a datos ajenos |
| **Variables sensibles** | `.env.local` excluido del repositorio vía `.gitignore` |
| **Rutas protegidas** | `ProtectedRoute.jsx` verifica sesión antes de renderizar |
| **anon key** | Solo permite operaciones dentro de las políticas RLS definidas |

> Las políticas RLS garantizan que aunque alguien obtenga la `anon key`, **jamás podrá leer ni modificar datos de otro usuario**.

---

## 🔄 Metodología Scrum

Proyecto desarrollado bajo contrato **N° FINU-2026-001** entre FinanzasU S.A.S. y Rise.

| Sprint | Período | Módulo | Entregable |
|---|---|---|---|
| Sprint 1 | Días 1–15 | Autenticación y Base de Datos | Supabase configurado, Auth funcional, esquema + RLS |
| Sprint 2 | Días 16–30 | Transacciones | CRUD completo con filtros, paginación y exportación CSV |
| Sprint 3 | Días 31–45 | Categorías y Presupuesto | Categorías + presupuesto mensual con alertas al 80% y 100% |
| Sprint 4 | Días 46–60 | Dashboard y Gráficas | Recharts con torta, barras, línea y top 5 categorías |
| Sprint 5 | Días 61–75 | Pruebas y Entrega Final | Testing real, corrección de bugs y documentación |

### Flujo de trabajo Git

```
main          ←  producción (solo merge mediante PR aprobado)
  └── develop ←  integración del sprint
        └── feature/HU-XX-nombre-de-la-historia
```

**Convención de commits:**

```
feat:     nueva funcionalidad
fix:      corrección de bug
docs:     cambios en documentación
style:    cambios de estilos sin lógica
refactor: refactorización sin cambio de comportamiento
test:     pruebas
```

### Definición de terminado (DoD)

- ✅ Código en GitHub con commit descriptivo en `feature/HU-XX`
- ✅ Pull Request aprobado por al menos un compañero antes de fusionar a `develop`
- ✅ Probada en escenario exitoso y en al menos un escenario de error
- ✅ Políticas RLS de Supabase verificadas para la funcionalidad
- ✅ Interfaz responsive en 375px (móvil) y 1280px (escritorio)
- ✅ Mensajes al usuario en español sin errores técnicos visibles
- ✅ Token JWT validado correctamente en rutas protegidas
- ✅ Ninguna funcionalidad anterior fue rota (regresión básica)

---

## 📄 Partes del contrato

| Rol | Empresa | Representante Legal |
|---|---|---|
| 🏢 **EL CLIENTE** | FinanzasU S.A.S. | Juan Camilo Triana |
| 💻 **EL DESARROLLADOR** | Rise | Deibyd Castillo |

**Condiciones clave — Contrato N° FINU-2026-001:**
- 5 sprints con Acta de Aceptación firmada por entregable
- Penalización del 10% del monto del sprint por entrega tardía
- 30 días de garantía post-lanzamiento sin errores críticos
- 3 meses de soporte técnico gratuito tras la entrega final
- Todos los derechos de propiedad intelectual cedidos a FinanzasU S.A.S.

---

## 👥 Equipo de desarrollo

**Rise** — empresa desarrolladora

| Integrante | Rol |
|---|---|
| Deibyd Castillo | Representante Legal / Líder del proyecto |
| *(por definir)* | Frontend — React + Tailwind CSS |
| *(por definir)* | Frontend — Hooks + Recharts |
| *(por definir)* | Backend — Supabase + RLS + Edge Functions |

**FinanzasU S.A.S.** — empresa cliente

| Integrante | Rol |
|---|---|
| Juan Camilo Triana | Representante Legal / Product Owner |
| Kevin Marino Villafañe | Co-fundador |
| Juan Carlos Quintero | Co-fundador |
| Juan Andrés Salazar | Co-fundador |

**Supervisor académico:** Gustavo Adolfo Osorio
**Asignatura:** Introducción a la Gestión de Proyectos de Software
**Universidad del Valle — Sede Zarzal · 2026**

---

## 📦 Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo con HMR en localhost:5173
npm run build      # Build de producción optimizado en /dist
npm run preview    # Previsualizar el build de producción localmente
npm run lint       # Verificar código con ESLint
```

---

<div align="center">
  <sub>FinanzasU S.A.S. · Desarrollado por Rise · Universidad del Valle 2026</sub>
</div>
