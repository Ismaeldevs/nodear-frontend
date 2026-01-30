import api from './api';

const wishlistService = {
  // Obtener toda la wishlist del usuario
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Agregar producto a wishlist
  addToWishlist: async (productoId) => {
    const response = await api.post('/wishlist', { productoId });
    return response.data;
  },

  // Eliminar producto de wishlist (por ID del wishlistItem)
  removeFromWishlist: async (wishlistItemId) => {
    const response = await api.delete(`/wishlist/${wishlistItemId}`);
    return response.data;
  },

  // Verificar si un producto está en wishlist
  checkInWishlist: async (productoId) => {
    const response = await api.get(`/wishlist/check/${productoId}`);
    return response.data;
  },

  // Vaciar toda la wishlist
  clearWishlist: async () => {
    const response = await api.delete('/wishlist');
    return response.data;
  },
};

export default wishlistService;
