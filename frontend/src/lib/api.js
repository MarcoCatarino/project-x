import axios from "axios";
import { ENV } from "../config/env.js";

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
});

//* Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // Solo intentar obtener token si Clerk está disponible y cargado
      if (window.Clerk && window.Clerk.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn("Error getting Clerk token:", error);
      // No lanzar error, continuar sin token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//* Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Solo redirigir si realmente hay un error de auth, no en carga inicial
      console.warn("Authentication error:", error.response?.data?.error);

      // Evitar redirecciones infinitas
      if (window.location.pathname !== "/sign-in") {
        setTimeout(() => {
          window.Clerk?.redirectToSignIn();
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

//* API methods
export const userAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getCurrent: () => api.get("/users/me"),
};

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) =>
    api.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get("/products/categories"),
};

export const heroVideoAPI = {
  getActive: () => api.get("/hero-videos/active"),
  getAll: (params) => api.get("/hero-videos", { params }),
  create: (data) =>
    api.post("/hero-videos", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/hero-videos/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  toggleActive: (id, data) => api.patch(`/hero-videos/${id}/toggle`, data),
  delete: (id) => api.delete(`/hero-videos/${id}`),
};

export default api;
