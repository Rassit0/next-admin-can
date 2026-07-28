import { ApiError } from "./errors/ApiError";

type JsonBody = Record<string, unknown> | unknown[];

export type RequestBody =
  | JsonBody
  | FormData
  | Blob
  | ArrayBuffer
  | ArrayBufferView
  | URLSearchParams
  | null;

export type ResponseType = "json" | "blob" | "text" | "arrayBuffer";

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
  timeout?: number;
  cache?: RequestCache;
  omitToken?: boolean;
  responseType?: ResponseType;
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

type FetchOptions = RequestInit & {
  next?: HttpRequestOptions["next"];
};

const ACCEPT_HEADER: Record<ResponseType, string> = {
  json: "application/json",
  blob: "*/*",
  text: "text/plain",
  arrayBuffer: "*/*",
};

export class CANApiAdapter implements HttpAdapter {
  private readonly baseUrl: string;

  constructor(
    private readonly defaultTimeout = 10000,
    private readonly tokenFetcher?: TokenFetcher,
  ) {
    this.baseUrl = process.env.NEXT_PUBLIC_CAN_API_URL ?? "";
  }

  private buildUrl(
    endpoint: string,
    params?: HttpRequestOptions["params"],
  ): string {
    if (!this.baseUrl && !/^https?:\/\//.test(endpoint)) {
      throw new ApiError(
        500,
        "El servicio no está disponible: NEXT_PUBLIC_CAN_API_URL no está configurada.",
      );
    }

    try {
      if (/^https?:\/\//.test(endpoint)) {
        return endpoint;
      }

      const base = this.baseUrl.replace(/\/+$/, "");
      const path = endpoint.replace(/^\/+/, "");
      const url = new URL(`${base}/${path}`);

      if (params) {
        for (const [key, value] of Object.entries(params)) {
          if (value == null) continue;
          url.searchParams.append(key, String(value));
        }
      }

      return url.toString();
    } catch {
      throw new ApiError(
        500,
        `URL inválida: no se pudo construir la ruta para "${endpoint}".`,
      );
    }
  }

  private async buildHeaders(
    options?: HttpRequestOptions,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      Accept: ACCEPT_HEADER[options?.responseType ?? "json"],
    };

    if (!options?.omitToken && this.tokenFetcher) {
      const token = await this.tokenFetcher().catch(() => undefined);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    return headers;
  }

  private buildRequestBody(
    data: unknown,
    headers: Record<string, string>,
  ): BodyInit | undefined {
    if (data == null) return undefined;

    if (
      data instanceof FormData ||
      data instanceof Blob ||
      data instanceof ArrayBuffer ||
      data instanceof URLSearchParams
    ) {
      return data;
    }

    if (ArrayBuffer.isView(data)) {
      return data as BodyInit;
    }

    try {
      const seen = new WeakSet();
      const json = JSON.stringify(data, (_key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return undefined;
          }
          seen.add(value);
        }
        return value;
      });

      if (json === undefined) {
        throw new ApiError(
          400,
          "No se pudo serializar el cuerpo de la petición.",
        );
      }

      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      return json;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        400,
        "No se pudo serializar el cuerpo de la petición.",
        error,
      );
    }
  }

  private createAbortController(options?: HttpRequestOptions): {
    signal: AbortSignal;
    abortReason: () => "timeout" | "external" | undefined;
    dispose: () => void;
  } {
    const controller = new AbortController();
    const externalSignal = options?.signal;
    let abortReason: "timeout" | "external" | undefined;
    const disposers: Array<() => void> = [];

    const timeout = options?.timeout ?? this.defaultTimeout;

    if (typeof AbortSignal.timeout === "function" && timeout > 0) {
      const timeoutSignal = AbortSignal.timeout(timeout);
      const onTimeout = () => {
        if (controller.signal.aborted) return;
        abortReason = "timeout";
        controller.abort();
      };
      timeoutSignal.addEventListener("abort", onTimeout, { once: true });
      disposers.push(() =>
        timeoutSignal.removeEventListener("abort", onTimeout),
      );
    } else {
      const timer = setTimeout(() => {
        abortReason = "timeout";
        controller.abort();
      }, timeout);
      disposers.push(() => clearTimeout(timer));
    }

    if (externalSignal) {
      if (externalSignal.aborted) {
        abortReason = "external";
        controller.abort();
      } else {
        const onExternalAbort = () => {
          if (controller.signal.aborted) return;
          abortReason = "external";
          controller.abort();
        };
        externalSignal.addEventListener("abort", onExternalAbort, {
          once: true,
        });
        disposers.push(() =>
          externalSignal.removeEventListener("abort", onExternalAbort),
        );
      }
    }

    return {
      signal: controller.signal,
      abortReason: () => abortReason,
      dispose: () => {
        for (const fn of disposers) {
          fn();
        }
      },
    };
  }

  private async executeFetch(
    endpoint: string,
    method: HttpMethod,
    data?: unknown,
    options?: HttpRequestOptions,
  ): Promise<Response> {
    const url = this.buildUrl(endpoint, options?.params);

    const { signal, abortReason, dispose } =
      this.createAbortController(options);

    try {
      const headers = await this.buildHeaders(options);

      const init: FetchOptions = {
        method,
        signal,
        headers,
        cache: options?.cache,
        next: options?.next,
      };

      const body = this.buildRequestBody(data, headers);
      if (body !== undefined) {
        init.body = body;
      }

      return await fetch(url, init);
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if (error instanceof TypeError) {
        throw new ApiError(
          503,
          "No se pudo conectar con el servidor.",
          error.message,
        );
      }

      if (error instanceof Error && error.name === "AbortError") {
        if (abortReason() === "timeout") {
          throw new ApiError(408, "Tiempo de espera agotado.");
        }
        throw new ApiError(499, "Petición cancelada.");
      }

      throw new ApiError(503, "No se pudo establecer conexión.", error);
    } finally {
      dispose();
    }
  }

  private async parseErrorResponse(
    response: Response,
  ): Promise<{ message: string; errors?: unknown }> {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const text = await response.text().catch(() => "");
      if (text) {
        try {
          const body = JSON.parse(text) as Record<string, unknown>;
          return {
            message:
              typeof body.message === "string"
                ? body.message
                : response.statusText,
            errors: body.errors,
          };
        } catch {
          /* JSON inválido */
        }
      }
    }

    if (contentType.startsWith("text/")) {
      const text = await response.text().catch(() => "");
      return { message: text || response.statusText };
    }

    return { message: response.statusText || "Error desconocido" };
  }

  private parseSuccessResponse<T>(
    response: Response,
    responseType: ResponseType,
  ): Promise<T> {
    switch (responseType) {
      case "json": {
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          return response.json() as Promise<T>;
        }
        if (contentType.startsWith("text/")) {
          return response.text() as unknown as Promise<T>;
        }
        return Promise.resolve({} as T);
      }
      case "blob":
        return response.blob() as Promise<T>;
      case "text":
        return response.text() as Promise<T>;
      case "arrayBuffer":
        return response.arrayBuffer() as Promise<T>;
    }
  }

  private emptyResult<T>(): T {
    return {} as T;
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    data?: unknown,
    options?: HttpRequestOptions,
    responseType?: ResponseType,
  ): Promise<T> {
    const resolvedType = responseType ?? options?.responseType ?? "json";

    const response = await this.executeFetch(endpoint, method, data, options);

    if (!response.ok) {
      const cloned = response.clone();
      const errorBody = await this.parseErrorResponse(cloned);
      throw new ApiError(response.status, errorBody.message, errorBody.errors);
    }

    if (response.status === 204) {
      return this.emptyResult<T>();
    }

    return this.parseSuccessResponse<T>(response, resolvedType);
  }

  get<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(
      endpoint,
      HttpMethod.GET,
      undefined,
      options,
      "json",
    );
  }

  post<T>(
    endpoint: string,
    data?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, HttpMethod.POST, data, options, "json");
  }

  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, HttpMethod.PATCH, data, options, "json");
  }

  put<T>(
    endpoint: string,
    data?: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, HttpMethod.PUT, data, options, "json");
  }

  delete<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>(
      endpoint,
      HttpMethod.DELETE,
      undefined,
      options,
      "json",
    );
  }

  getBlob(endpoint: string, options?: HttpRequestOptions): Promise<Blob> {
    return this.request<Blob>(
      endpoint,
      HttpMethod.GET,
      undefined,
      options,
      "blob",
    );
  }

  getText(endpoint: string, options?: HttpRequestOptions): Promise<string> {
    return this.request<string>(
      endpoint,
      HttpMethod.GET,
      undefined,
      options,
      "text",
    );
  }

  getArrayBuffer(
    endpoint: string,
    options?: HttpRequestOptions,
  ): Promise<ArrayBuffer> {
    return this.request<ArrayBuffer>(
      endpoint,
      HttpMethod.GET,
      undefined,
      options,
      "arrayBuffer",
    );
  }
}
