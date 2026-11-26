// Cliente HTTP único para toda la app: agrega el token, convierte errores y centraliza las rutas de la API.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(status, message, details = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

let authToken = null;
let onUnauthorized = () => {};

export function setAuthToken(token) {
  authToken = token;
}

// El AuthContext registra aquí qué hacer si la API responde 401 (token vencido).
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con la API. ¿Está encendida?');
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && authToken) onUnauthorized();
    throw new ApiError(response.status, data?.error ?? `Error ${response.status}`, data?.details ?? []);
  }
  return data;
}

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  me: () => request('/auth/me'),
};

export const toursApi = {
  list: (params) => request(`/tours?${new URLSearchParams(params)}`),
  get: (id) => request(`/tours/${id}`),
};

export const bookingsApi = {
  create: (data) => request('/bookings', { method: 'POST', body: data }),
  mine: () => request('/bookings/me'),
  cancel: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),
};
