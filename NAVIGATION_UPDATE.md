# Actualización de Navegación - Módulos de Membresías y Pagos

## Resumen

Se ha actualizado la estructura de navegación para permitir el acceso a los nuevos módulos de **Membresías** y **Pagos** dentro del flujo de gestión de temporadas.

## Rutas Disponibles

### Estructura Base
Todas las rutas siguen este patrón:
```
/admin/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/[teamSeasonId]
```

### Sub-rutas
- **`/payment-plans`** - Gestión de Planes de Pago (existente, actualizado con navegación)
- **`/membresias`** - Gestión de Membresías (nuevo, actualmente con placeholder)
- **`/pagos`** - Gestión de Pagos (nuevo, actualmente con placeholder)

## Cambios Realizados

### 1. Nuevas Páginas Creadas
- `src/app/admin/(admin)/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/[teamSeasonId]/membresias/page.tsx`
- `src/app/admin/(admin)/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/[teamSeasonId]/pagos/page.tsx`

### 2. Navegación Visual
Se agregó una barra de navegación consistente en las tres páginas con:
- Tabs visuales que indican la página actual (resaltada con `bg-accent-soft` y `border-accent`)
- Links a las otras dos páginas
- Styling consistente con el diseño de la aplicación

### 3. Layout Padre
Se creó un layout mínimo en:
- `src/app/admin/(admin)/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/[teamSeasonId]/layout.tsx`

## Acceso a las Rutas

### Desde la UI
1. Navega a "Equipos" en el menú lateral
2. Selecciona un equipo
3. Accede a "Temporadas"
4. Selecciona una temporada
5. Ahora puedes ver los tres tabs de navegación:
   - Planes de Pago
   - Membresías
   - Pagos

### Rutas Directas
```
http://localhost:3000/admin/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/[teamSeasonId]/payment-plans
http://localhost:3000/admin/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/[teamSeasonId]/membresias
http://localhost:3000/admin/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/[teamSeasonId]/pagos
```

## Próximos Pasos

Los módulos `membresias` y `pagos` están listos para ser implementados con:

1. **Integración de componentes**: Reemplazar el placeholder con los componentes reales
2. **Conexión de datos**: Integrar las acciones de servidor (`getMembershipsForTeamSeason`, `getPaymentsForTeamSeason`)
3. **Funcionalidad**: Implementar las tablas, formularios y validaciones necesarias

## Módulos Disponibles

### `/src/modules/membresias`
- Types, Actions, y componentes base
- Exporta: `MembershipsDashboard`, `AssignmentTable`, `AssignmentActions`, `AssignmentModal`
- Actions: `getMembershipsForTeamSeason`, `assignMemberToTeamSeason`, `suspendMemberAssignment`, etc.

### `/src/modules/pagos`
- Types, Actions, y componentes base
- Exporta: `PaymentLedger`, `PaymentForm`, `PaymentStatusChip`
- Actions: `getPaymentsForTeamSeason`, `processPayment`, `retryPayment`, `cancelPayment`

## Estructura de Carpetas

```
src/app/admin/(admin)/teams/[disciplineId]/[clubId]/[teamId]/team-seasons/
├── [teamSeasonId]/
│   ├── layout.tsx (nuevo)
│   ├── payment-plans/
│   │   └── page.tsx (actualizado con navegación)
│   ├── membresias/ (nuevo)
│   │   └── page.tsx
│   └── pagos/ (nuevo)
│       └── page.tsx
```

## Notas de Desarrollo

- Las páginas de Membresías y Pagos actualmente muestran placeholders
- Se mantiene la consistencia visual con el resto de la aplicación
- La navegación está integrada de forma que permite fácil expansión futura
- Todas las rutas están protegidas dentro de la zona administrativa autenticada
