import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import log from "./logger";

interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

interface HttpOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const getRequestInfo = (config: InternalAxiosRequestConfig | undefined): string => {
  if (!config) return "";
  const method = (config.method || "GET").toUpperCase();
  const url = config.url || "";
  const baseURL = config.baseURL || "";
  const fullURL = url.startsWith("http") ? url : `${baseURL}${url}`;
  const params = config.params ? ` params=${JSON.stringify(config.params)}` : "";
  return `${method} ${fullURL}${params}`;
};

export class HttpClient {
  private instance: AxiosInstance;

  constructor(options: HttpOptions = {}) {
    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout ?? 10000,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error: AxiosError) => {
        log.error("[HTTP] Request error:", getRequestInfo(error.config), error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data, config, status } = response;
        if (data.code !== undefined && data.code !== 0 && data.code !== 200) {
          log.error(
            `[HTTP] Business error: ${getRequestInfo(config)} | status=${status} | code=${data.code} | message=${data.message}`,
            `responseData:`,
            data,
            `requestHeaders:`,
            config.headers
          );
          return Promise.reject(new Error(data.message || "Request failed"));
        }
        return response;
      },
      (error: AxiosError) => {
        const { config, response, message } = error;
        const requestInfo = getRequestInfo(config);

        if (response) {
          const { status, statusText, headers, data } = response;
          log.error(
            `[HTTP] Response error: ${requestInfo} | status=${status} ${statusText}`,
            `responseData:`,
            data,
            `responseHeaders:`,
            Object.fromEntries(Object.entries(headers).slice(0, 10)),
            `requestHeaders:`,
            config?.headers
          );
        } else if (error.request) {
          log.error(
            `[HTTP] No response received: ${requestInfo} | message=${message}`,
            `requestHeaders:`,
            config?.headers
          );
        } else {
          log.error(`[HTTP] Request setup error: ${requestInfo} | message=${message}`, error.stack);
        }
        return Promise.reject(error);
      }
    );
  }

  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.instance.get(url, {
      params
    });
  }

  post<T = any>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data);
  }
}

export const http = new HttpClient({ baseURL: import.meta.env.VITE_API_URL });

export default HttpClient;
