import { ApiError } from "./errors/ApiError";

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
  timeout?: number;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export interface HttpAdapter {
  get<T>(endpoint: string, options?: HttpRequestOptions): Promise<T>;
  post<T>(
    endpoint: string,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<T>;
  patch<T>(
    endpoint: string,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<T>;
  put<T>(
    endpoint: string,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<T>;
  delete<T>(endpoint: string, options?: HttpRequestOptions): Promise<T>;
}

export class CANApiAdapter implements HttpAdapter {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor(defaultTimeout = 10000) {
    this.baseUrl = process.env.NEXT_PUBLIC_CAN_API_URL || "";
    this.defaultTimeout = defaultTimeout;
  }

  // MÉTODO CENTRALIZADOR: Aquí controlas la conexión
  private async request<T>(
    endpoint: string,
    method: string,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<T> {
    if (!this.baseUrl) {
      console.error(
        "CRITICAL: NEXT_PUBLIC_CAN_API_URL is missing in environment variables",
      );
      throw new ApiError(500, "El servicio no está disponible en este momento.");
    }

    let url = `${this.baseUrl}${endpoint}`;
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    const timeoutController = new AbortController();
    const ms = options?.timeout || this.defaultTimeout;
    const timeout = setTimeout(() => {
      timeoutController.abort();
    }, ms);

    const signal = options?.signal
      ? AbortSignal.any([options?.signal, timeoutController.signal])
      : timeoutController.signal;

    const fetchOptions: RequestInit = {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...options?.headers,
      },
      cache: options?.cache,
      next: options?.next,
    };

    if (data) {
      const isFormData = data instanceof FormData;
      fetchOptions.body = isFormData ? data : JSON.stringify(data);
      if (!isFormData) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json",
        };
      }
    }

    try {
      const res = await fetch(url, fetchOptions);
      return await this.handleResponse<T>(res, endpoint);
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if ((error as Error).name === "AbortError") {
        throw new ApiError(
          408,
          "La petición ha tardado demasiado tiempo (Timeout).",
        );
      }

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
    if (res.status === 204) {
      return {} as T;
    }

    const contentType = res.headers.get("content-type");

    if (res.ok) {
      if (contentType && contentType.includes("application/json")) {
        return res.json() as Promise<T>;
      } else {
        const text = await res.text();
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
      400: "Petición incorrecta",
      401: "Token inválido o expirado",
      403: "Acceso denegado",
      404: "Recurso no encontrado",
      500: "Error interno del servidor",
    };

    const message =
      errorData.message ||
      errorMap[res.status] ||
      `Error ${res.status}: ${res.statusText}`;

    throw new ApiError(res.status, message, errorData.errors || errorData);
  }

  async get<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, "GET", undefined, options);
  }

  async post<T>(
    endpoint: string,
    data: any,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", data, options);
  }

  async patch<T>(
    endpoint: string,
    data: any,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "PATCH", data, options);
  }

  async put<T>(
    endpoint: string,
    data: any,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", data, options);
  }

  async delete<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
}
