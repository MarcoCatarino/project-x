// frontend/src/store/useAuthStore.js (CORREGIDO)
import { create } from "zustand";
import { userAPI } from "../lib/api.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false, // Nueva bandera para evitar múltiples llamadas

  setUser: (user) => set({ user, initialized: true }),

  fetchCurrentUser: async () => {
    const { loading, initialized } = get();

    // Evitar múltiples llamadas simultáneas
    if (loading || initialized) return;

    set({ loading: true, error: null });

    try {
      const response = await userAPI.getCurrent();
      set({
        user: response.data,
        loading: false,
        initialized: true,
        error: null,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      set({
        error: error.message,
        loading: false,
        initialized: true, // Marcar como inicializado incluso con error
      });
      throw error;
    }
  },

  clearUser: () =>
    set({
      user: null,
      error: null,
      loading: false,
      initialized: false, // Reset para permitir nueva autenticación
    }),

  isAdmin: () => {
    const { user } = get();
    return user?.role === "admin";
  },
}));
