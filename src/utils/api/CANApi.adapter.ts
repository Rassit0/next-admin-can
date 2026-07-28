// CANApiAdapter.ts
// Plantilla base mejorada.
// NOTA: Copia la implementación de ApiError<T> y ValidationErrors según tu proyecto.

import { ApiError } from "./errors/ApiError";

export type RequestBody = BodyInit | Record<string, unknown> | null;

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

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface HttpAdapter {
  get<T>(endpoint: string, options?: HttpRequestOptions): Promise<T>;
  post<T>(
    endpoint: string,
    data?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;
  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;
  put<T>(
    endpoint: string,
    data?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T>;
  delete<T>(endpoint: string, options?: HttpRequestOptions): Promise<T>;
  getBlob(endpoint: string, options?: HttpRequestOptions): Promise<Blob>;
  getText(endpoint: string, options?: HttpRequestOptions): Promise<string>;
  getArrayBuffer(
    endpoint: string,
    options?: HttpRequestOptions,
  ): Promise<ArrayBuffer>;
}

export class CANApiAdapter implements HttpAdapter {
  private readonly baseUrl = process.env.NEXT_PUBLIC_CAN_API_URL ?? "";

  constructor(
    private readonly defaultTimeout = 10000,
    private readonly tokenFetcher?: TokenFetcher,
  ) {}

  private buildUrl(endpoint: string, params?: HttpRequestOptions["params"]) {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.append(k, String(v));
      }
    }
    return url.toString();
  }

  private async buildHeaders(
    options?: HttpRequestOptions,
    isJson = true,
  ): Promise<HeadersInit> {
    const token =
      !options?.omitToken && this.tokenFetcher
        ? await this.tokenFetcher().catch(() => undefined)
        : undefined;

    return {
      Accept: isJson ? "application/json" : "*/*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    };
  }

  private createSignal(options?: HttpRequestOptions) {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      options?.timeout ?? this.defaultTimeout,
    );

    return {
      signal: options?.signal
        ? AbortSignal.any([options.signal, controller.signal])
        : controller.signal,
      dispose: () => clearTimeout(timer),
    };
  }

  private async requestRaw(
    endpoint: string,
    method: HttpMethod,
    data?: unknown,
    options?: HttpRequestOptions,
    isJson = true,
  ): Promise<Response> {
    if (!this.baseUrl) {
      throw new ApiError(500, "El servicio no está disponible.");
    }

    const { signal, dispose } = this.createSignal(options);

    try {
      const headers = await this.buildHeaders(options, isJson);

      const init: RequestInit = {
        method,
        signal,
        headers,
        cache: options?.cache,
        next: options?.next,
      };

      if (data != null) {
        const isForm = data instanceof FormData;
        init.body = isForm ? data : JSON.stringify(data);
        if (!isForm) {
          (init.headers as Record<string, string>)["Content-Type"] =
            "application/json";
        }
      }

      return await fetch(this.buildUrl(endpoint, options?.params), init);
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        throw new ApiError(408, "Tiempo de espera agotado.");
      }
      throw new ApiError(503, "No se pudo establecer conexión.", e);
    } finally {
      dispose();
    }
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let payload: any = {};
      if (res.headers.get("content-type")?.includes("application/json")) {
        payload = await res.json().catch(() => ({}));
      }
      throw new ApiError(
        res.status,
        payload.message ?? res.statusText,
        payload.errors,
      );
    }

    if (res.status === 204) return {} as T;

    return res.json() as Promise<T>;
  }

  private async requestWithParser<T>(
    endpoint: string,
    method: HttpMethod,
    parser: (response: Response) => Promise<T>,
    data?: unknown,
    options?: HttpRequestOptions,
    isJson = true,
  ): Promise<T> {
    const response = await this.requestRaw(
      endpoint,
      method,
      data,
      options,
      isJson,
    );

    if (!response.ok) {
      await this.handleResponse<never>(response);
    }

    return parser(response);
  }

  get<T>(endpoint: string, options?: HttpRequestOptions) {
    return this.requestWithParser(
      endpoint,
      HttpMethod.GET,
      (r) => this.handleResponse<T>(r),
      undefined,
      options,
    );
  }

  post<T>(endpoint: string, data?: unknown, options?: HttpRequestOptions) {
    return this.requestWithParser(
      endpoint,
      HttpMethod.POST,
      (r) => this.handleResponse<T>(r),
      data,
      options,
    );
  }

  patch<T>(endpoint: string, data?: unknown, options?: HttpRequestOptions) {
    return this.requestWithParser(
      endpoint,
      HttpMethod.PATCH,
      (r) => this.handleResponse<T>(r),
      data,
      options,
    );
  }

  put<T>(endpoint: string, data?: unknown, options?: HttpRequestOptions) {
    return this.requestWithParser(
      endpoint,
      HttpMethod.PUT,
      (r) => this.handleResponse<T>(r),
      data,
      options,
    );
  }

  delete<T>(endpoint: string, options?: HttpRequestOptions) {
    return this.requestWithParser(
      endpoint,
      HttpMethod.DELETE,
      (r) => this.handleResponse<T>(r),
      undefined,
      options,
    );
  }

  getBlob(endpoint: string, options?: HttpRequestOptions) {
    return this.requestWithParser(
      endpoint,
      HttpMethod.GET,
      (r) => r.blob(),
      undefined,
      options,
      false,
    );
  }

  getText(endpoint: string, options?: HttpRequestOptions) {
    return this.requestWithParser(
      endpoint,
      HttpMethod.GET,
      (r) => r.text(),
      undefined,
      options,
      false,
    );
  }

  getArrayBuffer(endpoint: string, options?: HttpRequestOptions) {
    return this.requestWithParser(
      endpoint,
      HttpMethod.GET,
      (r) => r.arrayBuffer(),
      undefined,
      options,
      false,
    );
  }
}
