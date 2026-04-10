# Guia de Instalacion - FinanzasU

Esta guia estandariza la instalacion para todo el equipo de desarrollo.

## 1. Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Git
- Cuenta en Supabase (solo para modo integrado)

Verifica versiones:

```bash
node -v
npm -v
git --version
```

## 2. Clonar e instalar dependencias

```bash
git clone https://github.com/tu-organizacion/finanzasu.git
cd finanzasu
npm install
```

## 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

Configura uno de estos modos.

### Opcion A: Modo local (sin Supabase)

```env
VITE_AUTH_MODE=local
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Uso recomendado:

- Prototipado rapido de UI
- Trabajo en pantallas sin dependencia de backend
- Demo interna sin internet

### Opcion B: Modo integrado (con Supabase)

```env
VITE_AUTH_MODE=supabase
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```

Uso recomendado:

- Historias de usuario con logica de datos
- QA funcional y pruebas de integracion
- Validacion previa a merge en develop

## 4. Preparar la base de datos en Supabase

### Proyecto nuevo

Ejecuta en SQL Editor:

1. supabase/full_database_setup.sql
2. supabase/seed.sql (opcional)

### Proyecto existente con migracion inicial aplicada

Ejecuta en SQL Editor:

1. supabase/migrations/002_hardening_and_security.sql
2. supabase/seed.sql (opcional)

Nota:

- Si vas a usar datos de prueba, crea antes el usuario test@finanzasu.com con clave Test1234 en Supabase Auth.

## 5. Levantar la aplicacion

```bash
npm run dev
```

URL local:

- http://localhost:5173

## 6. Validaciones minimas antes de subir cambios

```bash
npm run lint
npm run build
```

## 7. Problemas frecuentes

### Error de red contra Supabase

Causa comun:

- Variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY invalidas

Solucion:

- Revisa .env.local
- Si no usaras backend, cambia a VITE_AUTH_MODE=local

### No carga datos del dashboard

Causa comun:

- Script de base de datos incompleto

Solucion:

- Reejecuta full_database_setup.sql o la migracion 002 segun el caso

### El seed no inserta datos del usuario test

Causa comun:

- El usuario test no existe en auth.users

Solucion:

- Crea el usuario en Auth y vuelve a ejecutar seed.sql
