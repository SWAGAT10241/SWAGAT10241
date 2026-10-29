/**
 * @fileoverview Scalable Custom API Error Hierarchy
 */

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {any} [data]
   */
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

export class NetworkError extends ApiError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'Network connectivity failure. Please check your connection.') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  /**
   * @param {string} [message]
   */
  constructor(message = 'Request timed out after waiting for server response.') {
    super(message, 408);
    this.name = 'TimeoutError';
  }
}

