import { create } from "zustand";
import { heroVideoAPI } from "../lib/api.js";

export const useHeroVideoStore = create((set, get) => ({
  heroVideos: [],
  activeHeroVideo: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },

  //* Obtener video activo (público)
  fetchActiveHeroVideo: async () => {
    set({ loading: true, error: null });
    try {
      const response = await heroVideoAPI.getActive();
      set({
        activeHeroVideo: response.data,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  //* Obtener todos los videos (admin)
  fetchHeroVideos: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await heroVideoAPI.getAll(params);
      set({
        heroVideos: response.data.videos,
        pagination: response.data.pagination,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  //* Crear nuevo video (admin)
  createHeroVideo: async (videoData) => {
    set({ loading: true, error: null });
    try {
      const response = await heroVideoAPI.create(videoData);
      set((state) => ({
        heroVideos: [response.data, ...state.heroVideos],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  //* Actualizar video (admin)
  updateHeroVideo: async (id, videoData) => {
    set({ loading: true, error: null });
    try {
      const response = await heroVideoAPI.update(id, videoData);
      set((state) => ({
        heroVideos: state.heroVideos.map((v) =>
          v._id === id ? response.data : v
        ),
        loading: false,
      }));
      
      // Si es el video activo, actualizar también
      if (response.data.isActive) {
        set({ activeHeroVideo: response.data });
      }
      
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  //* Activar/desactivar video (admin)
  toggleHeroVideoActive: async (id, isActive) => {
    set({ loading: true, error: null });
    try {
      const response = await heroVideoAPI.toggleActive(id, { isActive });
      set((state) => ({
        heroVideos: state.heroVideos.map((v) =>
          v._id === id ? response.data : { ...v, isActive: false }
        ),
        loading: false,
      }));

      // Actualizar video activo
      if (isActive) {
        set({ activeHeroVideo: response.data });
      } else {
        set({ activeHeroVideo: null });
      }

      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  //* Eliminar video (admin)
  deleteHeroVideo: async (id) => {
    set({ loading: true, error: null });
    try {
      await heroVideoAPI.delete(id);
      set((state) => ({
        heroVideos: state.heroVideos.filter((v) => v._id !== id),
        loading: false,
      }));

      // Si era el video activo, limpiar
      const { activeHeroVideo } = get();
      if (activeHeroVideo && activeHeroVideo._id === id) {
        set({ activeHeroVideo: null });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));