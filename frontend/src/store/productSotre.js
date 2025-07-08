// frontend/src/store/useProductStore.js
import { create } from "zustand";
import { productAPI } from "../lib/api.js";

export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
  filters: {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    featured: "",
  },

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () =>
    set({
      filters: {
        search: "",
        category: "",
        minPrice: "",
        maxPrice: "",
        featured: "",
      },
    }),

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const queryParams = { ...filters, ...params };

      const response = await productAPI.getAll(queryParams);
      set({
        products: response.data.products,
        pagination: response.data.pagination,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await productAPI.getById(id);
      set({ currentProduct: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const response = await productAPI.create(productData);
      set((state) => ({
        products: [response.data, ...state.products],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const response = await productAPI.update(id, productData);
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? response.data : p)),
        currentProduct: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productAPI.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const response = await productAPI.getCategories();
      set({ categories: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
}));
