import { create } from 'zustand';
import { authService } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Acciones
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      
      // El backend YA NO devuelve token (está en cookie HttpOnly)
      // Solo devuelve { success, message, data: { user } }
      const user = response.data?.user || response.user || response.data;

      if (!user) {
        throw new Error('Respuesta inválida del servidor');
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Cargar carrito y wishlist del usuario
      setTimeout(() => {
        const { useCartStore } = require('./useCartStore');
        const { useWishlistStore } = require('./useWishlistStore');
        useCartStore.getState().clearCart();
        useCartStore.getState().loadFromBackend();
        useWishlistStore.getState().loadFromBackend();
      }, 100);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || error.message || 'Error al iniciar sesión';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      
      // El backend YA NO devuelve token (está en cookie HttpOnly)
      // Solo devuelve { success, message, data: { user } }
      const user = response.data?.user || response.user || response.data;

      if (!user) {
        throw new Error('Respuesta inválida del servidor');
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Cargar carrito y wishlist del usuario
      setTimeout(() => {
        const { useCartStore } = require('./useCartStore');
        const { useWishlistStore } = require('./useWishlistStore');
        useCartStore.getState().loadFromBackend();
        useWishlistStore.getState().loadFromBackend();
      }, 100);

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || error.message || 'Error al registrarse';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      // Llamar al endpoint de logout para eliminar el refresh token
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    
    set({
      user: null,
      isAuthenticated: false,
    });
    
    // Limpiar el carrito y wishlist al hacer logout
    const { useCartStore } = require('./useCartStore');
    const { useWishlistStore } = require('./useWishlistStore');
    useCartStore.getState().clearCart();
    useWishlistStore.getState().clearWishlist();
  },

  refreshAuth: async () => {
    try {
      const response = await authService.refresh();
      const user = response.data?.user || response.user || response.data;
      
      if (user) {
        set({
          user,
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refrescando autenticación:', error);
      get().logout();
      return false;
    }
  },

  isAdmin: () => {
    const { user } = get();
    return user?.rol === 'ADMIN' || user?.rol === 'SUPER_ADMIN';
  },
}));
