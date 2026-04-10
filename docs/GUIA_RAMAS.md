# Guia de Ramas y Colaboracion - FinanzasU

Esta guia define como se trabaja en Git para el desarrollo de HU.

## 1. Estrategia de ramas

- main: produccion estable
- develop: integracion continua del sprint
- feature/HU-XX-nombre-corto: desarrollo de una historia de usuario


## 2. Regla base

- Una HU por rama feature.
- Una rama feature por Pull Request.
- No se hace push directo a main 

## 3. Convencion de nombres

Formato:

- feature/HU-07-presupuesto-alertas
- feature/HU-12-exportar-transacciones


## 4. Flujo de trabajo diario

1. Actualizar develop local.
2. Crear rama feature desde develop.
3. Implementar cambios atomicos por commit.
4. Ejecutar lint y build.
5. Abrir PR hacia develop con plantilla y checklist.
6. Resolver observaciones de review.
7. Hacer merge cuando el PR quede aprobado.

## 5. Comandos recomendados

```bash
git checkout develop
git pull origin develop
git checkout -b feature/HU-XX-descripcion

# ... trabajo ...

git add .
git commit -m "feat(HU-XX): descripcion corta"
git push -u origin feature/HU-XX-descripcion
```

## 6. Convencion de commits

- feat: nueva funcionalidad
- fix: correccion de bug
- refactor: mejora interna sin cambiar comportamiento
- docs: cambios de documentacion
- test: pruebas
- chore: tareas de mantenimiento

Ejemplos:

- feat(HU-10): crear formulario de presupuesto mensual
- fix(HU-10): corregir validacion de monto limite
- docs(HU-10): actualizar criterios de aceptacion

## 7. Politica de Pull Request

Requisitos minimos:

- Titulo con HU y objetivo
- Descripcion con alcance y cambios
- Evidencia funcional (capturas o video)
- Checklist tecnico completado
- Al menos 1 aprobacion de companero

Checklist sugerido:

- lint y build exitosos
- no rompe rutas existentes
- responsive basico verificado
- textos en espanol
- considera errores de red y estados vacios

## 8. Integracion y releases

- develop se integra continuamente durante el sprint.
- Al cierre del sprint, se prepara release/sprint-N (si aplica).
- main solo recibe merge desde release o hotfix validado.

## 9. Manejo de hotfix

1. Crear hotfix desde main.
2. Corregir y validar.
3. PR a main.
4. Propagar el mismo cambio a develop para mantener sincronia.

## 10. Reglas de oro para el equipo

- No usar push --force sobre ramas compartidas.
- No mezclar varias HU en un mismo PR.
- Resolver conflictos en la rama feature, no en develop.
- Mantener PR pequenos para acelerar revision.
