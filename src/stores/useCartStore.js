import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/api';
import { useAuthStore } from './useAuthStore';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      isSyncing: false,

      // Acciones UI
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Acciones de carrito
      addItem: (product, variante, quantity = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.varianteId === variante.id
        );

        let newItems;
        if (existingItemIndex > -1) {
          newItems = [...items];
          newItems[existingItemIndex].cantidad += quantity;
        } else {
          newItems = [
            ...items,
            {
              productoId: product.id,
              varianteId: variante.id,
              cantidad: quantity,
              producto: {
                nombre: product.nombre,
                imagenes: product.imagenes,
                precioBase: product.precioBase,
              },
              variante: {
                precio: variante.precio,
                talle: variante.talle,
                color: variante.color,
                stock: variante.stock,
              },
              precioUnit: variante.precio || product.precioBase,
            },
          ];
        }

        set({ items: newItems, isOpen: true });

        // Sincronizar con backend si está autenticado
        if (useAuthStore.getState().isAuthenticated) {
          get().syncWithBackend();
        }
      },

      updateQuantity: (varianteId, delta) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.varianteId === varianteId
              ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
              : item
          ),
        }));

        // Sincronizar con backend si está autenticado
        if (useAuthStore.getState().isAuthenticated) {
          get().syncWithBackend();
        }
      },

      removeItem: async (varianteId) => {
        // Remover del estado local primero
        set((state) => ({
          items: state.items.filter((item) => item.varianteId !== varianteId),
        }));

        // Sincronizar con backend si está autenticado
        if (useAuthStore.getState().isAuthenticated) {
          try {
            // Buscar el ID del detalle en el backend
            const response = await cartService.get();
            const detalle = response.data?.detalles?.find(d => d.varianteId === varianteId);
            
            if (detalle?.id) {
              await cartService.removeItem(detalle.id);
            }
            
            // Recargar el carrito del backend para asegurar sincronización
            await get().loadFromBackend();
          } catch (error) {
            console.error('Error removing item from backend:', error);
          }
        }
      },

      clearCart: () => {
        set({ items: [] });

        // Limpiar en backend si está autenticado
        if (useAuthStore.getState().isAuthenticated) {
          cartService.clear().catch(console.error);
        }
      },

      // Sincronizar con el backend
      syncWithBackend: async () => {
        const { items, isSyncing } = get();
        const authState = useAuthStore.getState();
        
        // Verificar que hay token y usuario autenticado
        if (isSyncing || !authState.isAuthenticated || !authState.token) {
          return;
        }

        set({ isSyncing: true });

        try {
          const itemsToSync = items.map((item) => ({
            productoId: item.productoId,
            varianteId: item.varianteId,
            cantidad: item.cantidad,
          }));

          const response = await cartService.sync(itemsToSync);
          
          // Actualizar con los datos del servidor
          if (response.data?.carrito) {
            const serverItems = response.data.carrito.detalles.map((detalle) => ({
              productoId: detalle.productoId,
              varianteId: detalle.varianteId,
              cantidad: detalle.cantidad,
              producto: {
                nombre: detalle.producto.nombre,
                imagenes: detalle.producto.imagenes,
                precioBase: detalle.producto.precioBase,
              },
              variante: {
                precio: detalle.variante.precio,
                talle: detalle.variante.talle,
                color: detalle.variante.color,
                stock: detalle.variante.stock,
              },
              precioUnit: detalle.precioUnit,
            }));

            set({ items: serverItems });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Cargar carrito desde el backend
      loadFromBackend: async () => {
        const authState = useAuthStore.getState();
        
        // Verificar que hay token y usuario autenticado
        if (!authState.isAuthenticated || !authState.token) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await cartService.get();
          
          if (response.data?.detalles) {
            const serverItems = response.data.detalles.map((detalle) => ({
              productoId: detalle.productoId,
              varianteId: detalle.varianteId,
              cantidad: detalle.cantidad,
              producto: {
                nombre: detalle.producto.nombre,
                imagenes: detalle.producto.imagenes,
                precioBase: detalle.producto.precioBase,
              },
              variante: {
                precio: detalle.variante.precio,
                talle: detalle.variante.talle,
                color: detalle.variante.color,
                stock: detalle.variante.stock,
              },
              precioUnit: detalle.precioUnit,
            }));

            set({ items: serverItems });
          }
        } catch (error) {
          console.error('Error loading cart:', error);
          // Si es error de autenticación, no hacer nada - el interceptor ya lo manejó
          if (error.response?.status === 401) {
            // Limpiar el carrito local
            set({ items: [] });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      // Computed values
      getCartCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.cantidad, 0);
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const precio = parseFloat(item.precioUnit);
          return sum + precio * item.cantidad;
        }, 0);
      },

      getItemQuantity: (varianteId) => {
        const { items } = get();
        const item = items.find((i) => i.varianteId === varianteId);
        return item ? item.cantidad : 0;
      },

      isInCart: (varianteId) => {
        const { items } = get();
        return items.some((item) => item.varianteId === varianteId);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
