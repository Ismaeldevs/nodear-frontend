import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistService } from '../services/api';
import { useAuthStore } from './useAuthStore';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      // Cargar wishlist desde el backend
      loadFromBackend: async () => {
        const authState = useAuthStore.getState();
        
        // Verificar que hay token y usuario autenticado
        if (!authState.isAuthenticated || !authState.token) {
          set({ items: [] });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await wishlistService.get();
          set({ items: response.data || [] });
        } catch (error) {
          console.error('Error loading wishlist:', error);
          // Si es error de autenticación, limpiar wishlist
          if (error.response?.status === 401) {
            set({ items: [] });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      // Agregar a wishlist
      addToWishlist: async (productoId) => {
        const authState = useAuthStore.getState();
        
        if (!authState.isAuthenticated) {
          return { success: false, error: 'Debes iniciar sesión' };
        }

        try {
          await wishlistService.add(productoId);
          await get().loadFromBackend();
          return { success: true };
        } catch (error) {
          console.error('Error adding to wishlist:', error);
          return { 
            success: false, 
            error: error.response?.data?.mensaje || error.response?.data?.message || 'Error al agregar a favoritos'
          };
        }
      },

      // Eliminar de wishlist
      removeFromWishlist: async (wishlistItemId) => {
        const authState = useAuthStore.getState();
        
        if (!authState.isAuthenticated) {
          return { success: false, error: 'Debes iniciar sesión' };
        }

        try {
          await wishlistService.remove(wishlistItemId);
          await get().loadFromBackend();
          return { success: true };
        } catch (error) {
          console.error('Error removing from wishlist:', error);
          return { 
            success: false, 
            error: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar de favoritos'
          };
        }
      },

      // Toggle wishlist
      toggleWishlist: async (productoId) => {
        const { items } = get();
        const existingItem = items.find((item) => item.producto?.id === productoId);

        if (existingItem) {
          return await get().removeFromWishlist(existingItem.id);
        } else {
          return await get().addToWishlist(productoId);
        }
      },

      // Verificar si está en wishlist
      isInWishlist: (productoId) => {
        const { items } = get();
        return items.some((item) => item.producto?.id === productoId);
      },

      // Limpiar wishlist
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
