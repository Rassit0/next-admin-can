# Changelog — Gestión360 Frontend (`next-admin-can`)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2026-11-12

Primera versión oficial formalmente identificada como línea base del frontend de **Gestión360 (Sistema de Gestión CAN)**. Esta versión consolida la arquitectura Next.js 16 App Router, el nuevo sistema de navegación responsiva, el Resumen Económico Bento Grid, las operaciones de ventanilla y los portales institucionales desarrollados y refinados desde julio de 2026.

### Added
- **Navegación y Experiencia de Usuario Responsiva:**
  - Sidebar colapsable de escritorio con soporte de atajos, persistencia de preferencias de usuario en cookies y visualización de versión oficial.
  - Barra de navegación móvil inferior (*BottomNavbar*) adaptativa con lanzador flotante en hoja deslizable (*sheet-launcher*).
  - Encabezado unificado (*Header*) con buscador contextual, control de temas claro/oscuro y menú de cuenta de usuario (`UserAccountDropdown`).
  - Matriz de permisos RBAC centralizada gobernada por `NavigationConfig` y control de acceso por capacidades.
- **Resumen Económico y Contabilidad:**
  - Rediseño integral del dashboard contable en formato Bento Grid orientado a usuarios no contables.
  - Separación conceptual estricta entre *Situación Actual* (saldos hoy en dinero disponible y cuentas financieras) y *Análisis del Período* (flujo de ingresos, egresos y balance sujetos al filtro de fechas).
  - Gráficos interactivos de flujo de caja y distribución de gastos desarrollados con Recharts.
  - Alertas visuales de cuentas por cobrar vencidas y compromisos de pago pendientes.
  - Soporte de visualización multimoneda (BOB / USD).
- **Operaciones Rápidas (`QuickOperations`):**
  - Panel unificado de atención en secretaría y ventanilla para cobros rápidos, inscripción ágil y regularización de pagos.
  - Integración de recibos de pago y transferencias entre cuentas financieras.
- **Gestión Deportiva y Formativa:**
  - Administración de temporadas deportivas, clubes, categorías, disciplinas y planteles.
  - Registro de atletas, tutores, fichas médicas y documentación.
- **Gestión Académica y Escuelas:**
  - Administración de cursos, turnos, horarios y matrículas estudiantiles.
  - Control de asistencia por sesión y seguimiento pedagógico.
- **Membresías e Inscripciones:**
  - Flujo de vida de membresías: cuotas mensuales, estados de vigencia y aplicación de recargos por mora.
  - Regularización atómica de cuotas acumuladas.
- **Portal Docente:**
  - Interfaz de autoservicio para instructores y profesores con visualización de horarios asignados y pase de lista.
- **CMS Institucional y Portal Web:**
  - Integración del editor de bloques visual Puck para la diagramación del sitio público.
  - Publicación de noticias, historias institucionales, tabla de posiciones y sponsors oficiales del club.
- **Iconografía Unificada:**
  - Estandarización visual completa mediante la librería Hugeicons.

### Changed
- **Evolución del Dashboard de Contabilidad:** Transición de la vista técnica anterior a un Resumen Económico intuitivo con terminología clara.
- **Gestión de Cuentas Financieras:** Interfaz de usuario adaptada para soportar cuentas activas y desactivadas sin romper el historial contable.

### Fixed
- Clarificación de saldos bancarios frente al filtro de fechas, eliminando la ambigüedad entre liquidez en tiempo real y balance por rango temporal.
- Alineación y renderizado de iconos en el acceso directo de aplicaciones rápidas.

---

## Convención de Versionado Futuro

A partir de la versión `1.0.0`, el frontend se rige estrictamente por **Semantic Versioning (`MAJOR.MINOR.PATCH`)**:

- **MAJOR (X.0.0):** Cambios de diseño estructural o incompatibilidades con contratos de backend que requieran cambios globales en la experiencia de usuario o dependencias centrales.
- **MINOR (1.X.0):** Incorporación de nuevas pantallas, módulos o componentes funcionales completos preservando compatibilidad.
- **PATCH (1.0.X):** Correcciones de interfaz (*bugfixes* visuales), ajustes de estilos, mejoras de accesibilidad o parches de dependencias sin impacto funcional disruptivo.

> Cada repositorio gestiona su versión de forma independiente: una actualización de estilo en el frontend no requiere incrementar la versión del backend, y viceversa.

