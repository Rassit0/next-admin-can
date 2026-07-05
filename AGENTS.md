## 📐 Arquitectura y Estructura de Carpetas (Screaming Architecture)

El proyecto utiliza **Screaming Architecture** organizada por dominios o módulos de negocio. Mantenemos las rutas de Next.js separadas de la lógica modular.

1. **`app/` (Enrutamiento Nativo):** Contiene ÚNICAMENTE los archivos de enrutamiento obligatorios de Next.js (`page.tsx`, `layout.tsx`, `loading.tsx`). **No meter lógica pesada aquí**, solo importar los componentes/vistas desde los módulos correspondientes.
2. **`modules/` (o la carpeta raíz de tus módulos, ej. `src/modules/` o `modules/`):** Organizado por características/dominios (ej: `auth/`, `user/`, `matches/`).

### Estructura de un Módulo de Negocio:

Cada módulo debe mantener estrictamente la siguiente anatomía interna:

- `actions/` -> Server Actions exclusivos del módulo para interactuar con la API.
- `components/` -> Componentes de UI (HeroUI v3) específicos de este dominio.
- `interfaces/` -> Tipados y contratos de TypeScript exclusivos del módulo.
- `hooks/` -> Custom hooks de React para lógica de estado/interacción.
- `index.ts` -> **Barril de exportación (Public API).** Todo lo que se use fuera del módulo debe ser exportado aquí. Las páginas en `app/` solo importan desde este archivo.

### Ejemplo de flujo para el Agente:

Si se solicita crear una nueva funcionalidad (ej. "Módulo de Torneos"):

1. Crear la carpeta en `modules/tournaments/`.
2. Crear subcarpetas (`actions/`, `components/`, etc.).
3. Crear los Server Actions importando el adapter base `@/utils/api/CANApi.adapter.ts`.
4. Exponer todo en `modules/tournaments/index.ts`.
5. En `app/tournaments/page.tsx`, simplemente importar y renderizar el componente principal desde `@/modules/tournaments`.

## ⚡ Estándar de Server Actions (Data Fetching & Mutations)

Todos los Server Actions dentro de las carpetas `actions/` de cada módulo deben seguir estrictamente el patrón de manejo de errores, tipado y transformación de datos que se muestra a continuación.

### Reglas Críticas para Actions:

- **Wrapper Obligatorio:** Envolver siempre la lógica en `handleServerAction(async () => { ... })`.
- **Tipado de Retorno:** Siempre retornar un `Promise<ServiceResponse<T>>`.
- **Query Params:** Construir los parámetros dinámicos utilizando `URLSearchParams`.
- **Caché de Next.js:** Configurar adecuadamente las opciones de `next.tags` y `revalidate` según corresponda para optimizar la carga.
- **Sanitización/Mapeo de Datos:** Transformar los strings de fechas provenientes de la API en objetos `Date` nativos de JavaScript antes de enviarlos al componente.

### Código de Referencia Estricto (Ejemplo: Módulo Temporadas):

```typescript
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeasonsResponse } from "../interfaces/season.interface";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  sortField?: "name" | "startDate" | "endDate" | "createdAt" | "updatedAt";
  orderBy?: "asc" | "desc";
  callbackUrl?: string;
}

export const getSeasons = async ({
  search,
  per_page = "5",
  page = "1",
  sortField = "name",
  orderBy = "asc",
}: SearchParams): Promise<ServiceResponse<ISeasonsResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (sortField) params.set("sortField", sortField);
    if (orderBy) params.set("orderBy", orderBy);

    const res = await api.get<ISeasonsResponse>(
      `seasons?${params.toString()}`,
      {
        next: {
          tags: ["seasons"],
          revalidate: 3600,
        },
      },
    );

    // Mapeo y transformación de tipos crudos (ej. fechas)
    const data = res.data.map((season) => ({
      ...season,
      startDate: new Date(season.startDate),
      endDate: new Date(season.endDate),
      createdAt: new Date(season.createdAt),
      updatedAt: new Date(season.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Temporadas obtenidas exitosamente",
    };
  });
};
```
