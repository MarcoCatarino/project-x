// frontend/src/store/useAuthStore.js (CORREGIDO CON DEBUG)
import { create } from "zustand";
import { userAPI } from "../lib/api.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  setUser: (user) => {
    console.log("🔧 [DEBUG] Setting user in store:", user);
    console.log("🔧 [DEBUG] User role:", user?.role);
    set({ user, initialized: true });
  },

  fetchCurrentUser: async () => {
    const { loading, initialized } = get();

    if (loading || initialized) {
      console.log("🔧 [DEBUG] Skipping fetch - already loading or initialized");
      return;
    }

    console.log("🔧 [DEBUG] Fetching current user from API...");
    set({ loading: true, error: null });

    try {
      const response = await userAPI.getCurrent();
      console.log("🔧 [DEBUG] API Response:", response.data);
      console.log("🔧 [DEBUG] User role from API:", response.data.role);
      console.log("🔧 [DEBUG] Is admin check:", response.data.role === "admin");

      set({
        user: response.data,
        loading: false,
        initialized: true,
        error: null,
      });
      return response.data;
    } catch (error) {
      console.error("❌ [DEBUG] Error fetching user:", error);
      console.error("❌ [DEBUG] Error details:", error.response?.data);
      set({
        error: error.message,
        loading: false,
        initialized: true,
      });
      throw error;
    }
  },

  clearUser: () => {
    console.log("🔧 [DEBUG] Clearing user from store");
    set({
      user: null,
      error: null,
      loading: false,
      initialized: false,
    });
  },

  isAdmin: () => {
    const { user } = get();
    const isAdmin = user?.role === "admin";
    console.log("🔧 [DEBUG] Checking admin status:", {
      user: user ? `${user.email} (${user.role})` : "null",
      isAdmin,
    });
    return isAdmin;
  },
}));
