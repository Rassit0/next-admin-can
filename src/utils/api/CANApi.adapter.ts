import { ApiError } from "./errors/ApiError";

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
  timeout?: number;
  cache?: RequestCache;
  omitToken?: boolean;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export type TokenFetcher = () => Promise<string | undefined | null>;

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

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
  getBlob(endpoint: string, options?: HttpRequestOptions): Promise<Blob>;
}

const ERROR_MESSAGES: Readonly<Record<number, string>> = {
  400: "Petición incorrecta",
  401: "Token inválido o expirado",
  403: "Acceso denegado",
  404: "Recurso no encontrado",
  500: "Error interno del servidor",
};

export class CANApiAdapter implements HttpAdapter {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;
  private readonly tokenFetcher?: TokenFetcher;

  constructor(defaultTimeout = 10000, tokenFetcher?: TokenFetcher) {
    this.baseUrl = process.env.NEXT_PUBLIC_CAN_API_URL || "";
    this.defaultTimeout = defaultTimeout;
    this.tokenFetcher = tokenFetcher;

    if (!this.baseUrl) {
      console.error(
        "CRITICAL: NEXT_PUBLIC_CAN_API_URL is missing in environment variables",
      );
    }
  }

  /**
   * Método centralizador: Contiene TODA la lógica de comunicación HTTP.
   * Construye la URL, query params, timeout, AbortController, token,
   * headers, body, cache, ejecuta el fetch y maneja errores de conexión.
   * Retorna el Response crudo sin procesarlo.
   */
  private async requestRaw(
    endpoint: string,
    method: HttpMethod,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<Response> {
    if (!this.baseUrl) {
      throw new ApiError(
        500,
        "El servicio no está disponible en este momento.",
      );
    }

    let url = `${this.baseUrl}${endpoint}`;
    if (options?.params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(options.params)) {
        searchParams.append(key, String(value));
      }
      url += `?${searchParams.toString()}`;
    }

    const timeoutController = new AbortController();
    const ms = options?.timeout || this.defaultTimeout;
    const timeout = setTimeout(() => timeoutController.abort(), ms);

    const signal = options?.signal
      ? AbortSignal.any([options.signal, timeoutController.signal])
      : timeoutController.signal;

    let token: string | undefined | null;
    if (this.tokenFetcher && !options?.omitToken) {
      try {
        token = await this.tokenFetcher();
      } catch (error) {
        console.error("Error fetching token in API Adapter", error);
      }
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    };

    if (data && !(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const fetchOptions: RequestInit = {
      method,
      signal,
      headers,
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
      cache: options?.cache,
      next: options?.next,
    };

    try {
      return await fetch(url, fetchOptions);
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

  /**
   * Ejecuta la petición HTTP y procesa la respuesta como JSON.
   */
  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    data?: any,
    options?: HttpRequestOptions,
  ): Promise<T> {
    const response = await this.requestRaw(endpoint, method, data, options);
    return this.handleResponse<T>(response, endpoint);
  }

  /**
   * Procesa la respuesta HTTP:
   * - 204: retorna objeto vacío
   * - OK + JSON: parsea y retorna
   * - OK + no-JSON: lanza ApiError (respuesta inesperada)
   * - Error: lanza ApiError con el mensaje del servidor
   */
  private async handleResponse<T>(res: Response, endpoint: string): Promise<T> {
    if (res.status === 204) {
      return {} as T;
    }

    const contentType = res.headers.get("content-type");

    if (res.ok) {
      if (contentType?.includes("application/json")) {
        return res.json() as Promise<T>;
      }
      const text = await res.text();
      throw new ApiError(
        res.status,
        `Respuesta inesperada en ${endpoint}`,
        text,
      );
    }

    // Manejo de errores
    let errorData: any = {};
    if (contentType?.includes("application/json")) {
      errorData = await res.json().catch(() => ({}));
    } else {
      errorData = { raw: await res.text() };
    }

    const message =
      errorData.message ||
      ERROR_MESSAGES[res.status] ||
      `Error ${res.status}: ${res.statusText}`;

    throw new ApiError(res.status, message, errorData.errors || errorData);
  }

  // --- Métodos públicos ---

  get<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, "GET", undefined, options);
  }

  /**
   * Descarga contenido binario (PDFs, imágenes, etc.).
   * Reutiliza requestRaw() para la comunicación y handleResponse() para errores.
   */
  async getBlob(endpoint: string, options?: HttpRequestOptions): Promise<Blob> {
    const response = await this.requestRaw(endpoint, "GET", undefined, options);

    if (!response.ok) {
      await this.handleResponse<never>(response, endpoint);
    }

    return response.blob();
  }

  post<T>(
    endpoint: string,
    data: any,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", data, options);
  }

  patch<T>(
    endpoint: string,
    data: any,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "PATCH", data, options);
  }

  put<T>(
    endpoint: string,
    data: any,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", data, options);
  }

  delete<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
}
