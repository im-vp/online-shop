import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export type RequestOptions = {
  query?: Record<string, string | number | boolean>;
  headers?: HeadersInit;
  body?: any;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

type NextFetchRequestConfig = {
  revalidate?: number;
  tags?: string[];
};

class FetchInstance {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || '';
  }

  private buildURL(url: string, query?: RequestOptions['query']) {
    const fullUrl = new URL(`${this.baseURL}${url}`);
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
      next: options.next,
      cache: options.cache,
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

export const apiFetch = new FetchInstance(process.env.NEXT_PUBLIC_API_URL);
