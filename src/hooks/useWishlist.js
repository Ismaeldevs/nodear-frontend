import { useWishlistStore } from '../stores/useWishlistStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useWishlist = () => {
  const navigate = useNavigate();
  const items = useWishlistStore((state) => state.items);
  const isLoading = useWishlistStore((state) => state.isLoading);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const loadFromBackend = useWishlistStore((state) => state.loadFromBackend);
  const { isAuthenticated } = useAuthStore();

  // Wrapper para agregar con validación de autenticación
  const addToWishlistWithAuth = async (productoId) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar a favoritos');
      navigate('/login');
      return { success: false, error: 'No autenticado' };
    }
    return await addToWishlist(productoId);
  };

  // Wrapper para remover con validación de autenticación
  const removeFromWishlistWithAuth = async (wishlistItemId) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return { success: false, error: 'No autenticado' };
    }
    return await removeFromWishlist(wishlistItemId);
  };

  // Wrapper para toggle con validación de autenticación
  const toggleWishlistWithAuth = async (productoId) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar a favoritos');
      navigate('/login');
      return { success: false, error: 'No autenticado' };
    }
    return await toggleWishlist(productoId);
  };

  return {
    wishlistItems: items,
    isLoading,
    isAuthenticated,
    addToWishlist: addToWishlistWithAuth,
    removeFromWishlist: removeFromWishlistWithAuth,
    isInWishlist,
    toggleWishlist: toggleWishlistWithAuth,
    refetch: loadFromBackend,
  };
};
