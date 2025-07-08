// frontend/src/store/useUserStore.js
import { create } from "zustand";
import { userAPI } from "../lib/api.js";

export const useUserStore = create((set, get) => ({
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
  searchQuery: "",

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { searchQuery } = get();
      const queryParams = { search: searchQuery, ...params };

      const response = await userAPI.getAll(queryParams);
      set({
        users: response.data.users,
        pagination: response.data.pagination,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await userAPI.getById(id);
      set({ currentUser: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await userAPI.update(id, userData);
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? response.data : u)),
        currentUser: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await userAPI.delete(id);
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearCurrentUser: () => set({ currentUser: null }),
}));
