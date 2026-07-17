import { ApiError } from "./errors/ApiError";

export interface HttpAdapter {
  get<T>(endpoint: string, options?: RequestInit): Promise<T>;
  post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T>;
  patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T>;
  put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T>;
  delete<T>(endpoint: string, options?: RequestInit): Promise<T>;
}

export class CANApiAdapter implements HttpAdapter {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_CAN_API_URL || "";
  }
  // MÉTODO CENTRALIZADOR: Aquí controlas la conexión
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    if (!this.baseUrl) {
      if (!this.baseUrl) {
        // Registra el error real en la consola para ti (desarrollador)
        console.error(
          "CRITICAL: NEXT_PUBLIC_CAN_API_URL is missing in environment variables",
        );

        // Lanza un error genérico para el usuario
        throw new ApiError(
          500,
          "El servicio no está disponible en este momento.",
        );
      }
    }

    console.log("endpoint", endpoint);

    const timeoutController = new AbortController();

    const timeout = setTimeout(() => {
      timeoutController.abort();
    }, 10000);

    const signal = options.signal
      ? AbortSignal.any([options.signal, timeoutController.signal])
      : timeoutController.signal;
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal,
      });
      return await this.handleResponse<T>(res, endpoint);
    } catch (error) {
      // Si el error ya es una instancia de ApiError, lo relanzamos
      if (error instanceof ApiError) throw error;

      // Si llegamos aquí, es un fallo de conexión o red
      throw new ApiError(
        503,
        "No se pudo establecer conexión con el servidor.",
        { originalError: error instanceof Error ? error.message : error },
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private async handleResponse<T>(res: Response, endpoint: string): Promise<T> {
    const contentType = res.headers.get("content-type");

    if (res.ok) {
      if (contentType && contentType.includes("application/json")) {
        return res.json() as Promise<T>;
      } else {
        // console.log("status", res.status);
        // console.log("content-type", res.headers.get("content-type"));
        const text = await res.text();
        // console.log("body", text);
        throw new ApiError(
          res.status,
          `Respuesta inesperada en ${endpoint}`,
          text,
        );
      }
    }

    // Manejo de errores
    let errorData: any = {};
    if (contentType && contentType.includes("application/json")) {
      errorData = await res.json().catch(() => ({}));
    } else {
      errorData = { raw: await res.text() };
    }

    const errorMap: Record<number, string> = {
      401: "Token inválido o expirado",
      403: "Acceso denegado",
      404: "Recurso no encontrado",
    };

    const message =
      errorData.message ||
      errorMap[res.status] ||
      `Error ${res.status}: ${res.statusText}`;

    // console.log("errorData", errorData);
    // console.log("message", message);

    throw new ApiError(res.status, message, errorData.errors || errorData);
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      ...options,
    });
  }

  async post<T>(
    endpoint: string,
    data: FormData | Record<string, any>,
    options?: RequestInit,
  ): Promise<T> {
    // console.log("URL de petición:", `${this.baseUrl}${endpoint}`);
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options?.headers,
      },
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  async patch<T>(
    endpoint: string,
    data: FormData | Record<string, any>,
    options?: RequestInit,
  ): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options?.headers,
      },
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  async put<T>(
    endpoint: string,
    data: FormData | Record<string, any>,
    options?: RequestInit,
  ): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options?.headers,
      },
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...options?.headers,
      },
      ...options,
    });
  }
}
