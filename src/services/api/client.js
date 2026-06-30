/**
 * Single API client. Replaces the previous `services/api.js`.
 *
 * Responsibilities:
 *  - Attach Authorization header from secure storage
 *  - Normalize JSON / non-JSON responses
 *  - Throw `ApiError` (from utils/errors) on non-2xx responses, carrying
 *    status, body, and code for downstream consumers.
 */

import { BASE_URL } from '../../constants/endpoints';
import { ApiError } from '../../utils/errors';
import { storage } from '../storageService';

const authHeaders = async () => {
  const token = await storage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseBody = async (response) => {
  const ct = response.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { return await response.json(); } catch { return {}; }
  }
  try { return { message: await response.text() }; } catch { return {}; }
};

const request = async (method, path, { body, signal, query } = {}) => {
  const headers = await authHeaders();
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const url = `${BASE_URL}${path}${query ? `?${query}` : ''}`;
  const init = {
    method,
    headers,
    signal,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  let response;
  try {
    response = await fetch(url, init);
  } catch (networkError) {
    throw new ApiError(networkError.message || 'Network error', {
      status: 0,
      code: 'NETWORK_ERROR',
    });
  }

  const json = await parseBody(response);
  if (!response.ok) {
    throw new ApiError(json.message || json.error || `HTTP ${response.status}`, {
      status: response.status,
      body: json,
    });
  }
  return json;
};

/**
 * Same as `request` but with a timeout. Rejects with an ApiError
 * after `timeoutMs` if the server hasn't responded yet — prevents
 * the UI from spinning forever on a dead request.
 */
const requestWithTimeout = (method, path, opts = {}, timeoutMs = 20000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return request(method, path, { ...opts, signal: controller.signal })
    .finally(() => clearTimeout(timeout))
    .catch((e) => {
      if (e?.name === 'AbortError' || controller.signal.aborted) {
        throw new ApiError('Request timed out — please check your connection and try again.', {
          status: 0,
          code: 'TIMEOUT',
        });
      }
      throw e;
    });
};

/** Public verbs used by services. */
export const api = {
  get: (path, opts) => requestWithTimeout('GET', path, opts),
  post: (path, body, opts) => requestWithTimeout('POST', path, { ...opts, body }),
  put: (path, body, opts) => requestWithTimeout('PUT', path, { ...opts, body }),
  delete: (path, opts) => requestWithTimeout('DELETE', path, opts),
};
