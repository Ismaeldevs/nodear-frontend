import { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuthStore();

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Error al cargar pedidos');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  const getOrderById = async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderService.getById(orderId);
      return response.data;
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.message || 'Error al cargar pedido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderService.create(orderData);
      await fetchOrders(); // Refrescar lista
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error creating order:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear pedido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      await orderService.cancel(orderId);
      await fetchOrders(); // Refrescar lista
      return { success: true };
    } catch (err) {
      console.error('Error canceling order:', err);
      const errorMessage = err.response?.data?.message || 'Error al cancelar pedido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    getOrderById,
    createOrder,
    cancelOrder,
  };
};
