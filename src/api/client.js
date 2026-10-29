/**
 * @fileoverview Scalable Resilient HTTP Client with Interceptors and Timeout
 */
import { ENV } from '../config/env.js';
import { ApiError, NetworkError, TimeoutError } from './error.js';
import { logger } from '../utils/logger.js';

class ApiClient {
  constructor() {
    this.baseURL = ENV.API_BASE_URL;
    this.timeout = ENV.API_TIMEOUT_MS;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  useRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Executes an HTTP request with error handling and timeout
   * @template T
   * @param {string} endpoint
   * @param {RequestInit} [options]
   * @returns {Promise<T>}
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    let config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      logger.debug(`[HTTP] ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        data = await interceptor(data, response);
      }

      if (!response.ok) {
        throw new ApiError(
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        throw new TimeoutError(`Request exceeded timeout of ${this.timeout}ms`);
      }
      if (err instanceof ApiError) {
        throw err;
      }
      // Network/CORS/Offline errors
      throw new NetworkError(err.message || 'Network request failed');
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

