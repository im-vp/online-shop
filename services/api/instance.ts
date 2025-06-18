import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

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

  private async request<T>(method: string, url: string, options: RequestOptions = {}): Promise<T> {
    const fullUrl = this.buildURL(url, options.query);

    const fetchOptions: RequestInit & {
      next?: NextFetchRequestConfig;
    } = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: method !== 'GET' && options.body ? JSON.stringify(options.body) : undefined,
      ...this.initOptions,
      ...options,
    };

    const res = await fetch(fullUrl, fetchOptions);

    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  get<T>(url: string, options?: RequestOptions) {
    return this.request<T>('GET', url, options);
  }

  post<T>(url: string, options?: RequestOptions) {
    return this.request<T>('POST', url, options);
  }

  put<T>(url: string, options?: RequestOptions) {
    return this.request<T>('PUT', url, options);
  }

  delete<T>(url: string, options?: RequestOptions) {
    return this.request<T>('DELETE', url, options);
  }
}

export const apiFetch = new FetchInstance({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  credentials: 'include',
});
