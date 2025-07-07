import { ExtendedApiResponse } from '@/types/types';

type InitOptions = {
  baseURL: string;
} & RequestOptions;

export type RequestOptions = {
  query?: Record<string, string | number | boolean>;
  headers?: HeadersInit;
  body?: any;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
  credentials?: RequestCredentials;
};

type NextFetchRequestConfig = {
  revalidate?: number;
  tags?: string[];
};

class FetchInstance {
  private initOptions: InitOptions = {
    baseURL: '',
    credentials: 'same-origin',
  };

  constructor(configObject: InitOptions) {
    this.initOptions = {
      ...this.initOptions,
      ...configObject,
    };
  }

  private buildURL(url: string, query?: RequestOptions['query']) {
    const fullUrl = new URL(`${this.initOptions.baseURL}${url}`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        fullUrl.searchParams.append(key, String(value));
      });
    }
    return fullUrl.toString();
  }

  private async request<T = null, U = null>(
    method: string,
    url: string,
    options: RequestOptions = {},
  ): Promise<ExtendedApiResponse<T, U>> {
    const fullUrl = this.buildURL(url, options.query);

    const fetchOptions: RequestInit & {
      next?: NextFetchRequestConfig;
    } = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...this.initOptions,
      ...options,
      body: method !== 'GET' && options.body ? JSON.stringify(options.body) : undefined,
    };

    const res = await fetch(fullUrl, fetchOptions);
    const body = await res.json();

    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
    }

    return {
      body,
      headers: res.headers,
      status: res.status,
    };
  }

  get<T = null, U = null>(url: string, options?: RequestOptions) {
    return this.request<T, U>('GET', url, options);
  }

  post<T = null, U = null>(url: string, options?: RequestOptions) {
    return this.request<T, U>('POST', url, options);
  }

  put<T = null, U = null>(url: string, options?: RequestOptions) {
    return this.request<T, U>('PUT', url, options);
  }

  delete<T = null, U = null>(url: string, options?: RequestOptions) {
    return this.request<T, U>('DELETE', url, options);
  }
}

export const apiFetch = new FetchInstance({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  credentials: 'include',
});
