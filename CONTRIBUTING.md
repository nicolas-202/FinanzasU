# Guia de Contribucion - FinanzasU

Gracias por contribuir a FinanzasU. Este documento define como colaborar de forma consistente en el proyecto.

## 1. Alcance

Aplica para todo aporte de codigo, documentacion, pruebas y mantenimiento tecnico.

## 2. Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Git
- Proyecto configurado segun [docs/GUIA_INSTALACION.md](docs/GUIA_INSTALACION.md)

## 3. Flujo de ramas

Ramas principales:

- main: estable
- develop: integracion del sprint

Ramas de trabajo:

- feature/HU-XX-descripcion-corta
- bugfix/HU-XX-descripcion-corta
- hotfix/incidencia-descripcion-corta

Reglas:

- No hacer push directo a main.
- No hacer push directo a develop.
- Una HU por rama y una rama por PR.

Referencia detallada: [docs/GUIA_RAMAS.md](docs/GUIA_RAMAS.md)

## 4. Convencion de commits

Formato:

tipo(HU-XX): descripcion corta

Tipos sugeridos:

- feat
- fix
- refactor
- docs
- test
- chore
- style

Ejemplos:

- feat(HU-10): crear formulario de presupuesto mensual
- fix(HU-10): corregir validacion de monto limite

## 5. Pull Requests

Destino:

- feature/* y bugfix/* hacia develop
- hotfix/* hacia main, y luego sincronizacion a develop

Checklist minimo antes de solicitar review:

- npm run lint sin errores
- npm run build exitoso
- cambios probados manualmente
- sin conflictos con develop
- descripcion clara del PR
- evidencia funcional cuando aplique

Plantilla oficial:

- .github/pull_request_template.md

## 6. Estandares de codigo

- Mantener componentes pequenos y reutilizables.
- Evitar logica de negocio compleja dentro de componentes de UI.
- Reutilizar servicios y hooks existentes antes de crear nuevos.
- Nombrar variables y funciones de forma descriptiva.
- Evitar cambios no relacionados en el mismo PR.

## 7. Buenas practicas de colaboracion

- Mantener PR pequenos para acelerar revision.
- Resolver comentarios de review con cambios concretos.
- No usar push --force en ramas compartidas.
- Si un PR crece demasiado, dividir en PRs mas pequenos.

## 8. Reporte de bugs y mejoras

Al reportar un bug o proponer una mejora, incluir:

- contexto
- pasos para reproducir
- resultado esperado
- resultado actual
- evidencia (captura o video)

## 9. Seguridad

- No subir secretos ni credenciales.
- Mantener .env.local fuera del control de versiones.
- Revisar cambios sensibles antes de merge.

## 10. Dudas

Si tienes dudas de implementacion, abre un borrador de PR temprano y solicita retroalimentacion tecnica.
