import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/api';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const statusOptions = [
    'PENDIENTE',
    'CONFIRMADO',
    'ENVIADO',
    'ENTREGADO',
    'CANCELADO'
  ];

  const statusColors = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    CONFIRMADO: 'bg-blue-100 text-blue-800',
    ENVIADO: 'bg-purple-100 text-purple-800',
    ENTREGADO: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getById(id);
      setOrder(response.data);
      setNewStatus(response.data.estado);
    } catch (error) {
      console.error('Error cargando pedido:', error);
      toast.error('Error al cargar el pedido');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === order.estado) {
      toast.error('El estado no ha cambiado');
      return;
    }

    try {
      setUpdating(true);
      await orderService.updateStatus(id, newStatus);
      toast.success('Estado actualizado');
      loadOrder();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Cargando pedido...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Pedido no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Volver a pedidos
            </button>
            <h1 className="text-2xl font-bold">Pedido #{order.numeroPedido}</h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.estado]}`}>
            {order.estado}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del cliente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Cliente</h2>
            {order.cliente ? (
              <div className="space-y-2 text-sm">
                <p><strong>Nombre:</strong> {order.cliente.nombre} {order.cliente.apellido}</p>
                <p><strong>Email:</strong> {order.cliente.usuario?.email || 'N/A'}</p>
                <p><strong>Teléfono:</strong> {order.cliente.telefono || 'N/A'}</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Cliente invitado</p>
                <p><strong>Email:</strong> {order.emailContacto || 'N/A'}</p>
                <p><strong>Teléfono:</strong> {order.telefonoContacto || 'N/A'}</p>
              </div>
            )}
          </div>

          {/* Dirección de envío */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Dirección de Envío</h2>
            <div className="text-sm space-y-1">
              <p>{order.direccionEnvio?.calle} {order.direccionEnvio?.numero}</p>
              {order.direccionEnvio?.piso && <p>Piso {order.direccionEnvio.piso}</p>}
              {order.direccionEnvio?.depto && <p>Depto {order.direccionEnvio.depto}</p>}
              <p>{order.direccionEnvio?.ciudad}, {order.direccionEnvio?.provincia}</p>
              <p>CP: {order.direccionEnvio?.codigoPostal}</p>
            </div>
          </div>

          {/* Estado del pedido */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Actualizar Estado</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === order.estado}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {updating ? 'Actualizando...' : 'Actualizar Estado'}
            </button>
          </div>
        </div>

        {/* Productos del pedido */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Productos</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Producto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Variante</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Cantidad</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Precio Unit.</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.variante?.producto?.nombre}</td>
                    <td className="px-4 py-3">
                      {item.variante?.talle?.nombre} / {item.variante?.color?.nombre}
                    </td>
                    <td className="px-4 py-3 text-center">{item.cantidad}</td>
                    <td className="px-4 py-3 text-right">${item.precioUnitario?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${item.subtotal?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="mt-6 border-t pt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Envío:</span>
                <span>${order.costoEnvio?.toFixed(2)}</span>
              </div>
              {order.descuento > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento:</span>
                  <span>-${order.descuento?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información del pago */}
        {order.pago && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Información de Pago</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>ID Pago MP:</strong> {order.pago.mercadoPagoId || 'N/A'}
              </div>
              <div>
                <strong>Estado:</strong> {order.pago.estado}
              </div>
              <div>
                <strong>Método:</strong> {order.pago.metodoPago || 'N/A'}
              </div>
              <div>
                <strong>Fecha:</strong> {new Date(order.pago.createdAt).toLocaleString('es-AR')}
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Información Adicional</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Fecha de creación:</strong>
              <p>{new Date(order.createdAt).toLocaleString('es-AR')}</p>
            </div>
            <div>
              <strong>Última actualización:</strong>
              <p>{new Date(order.updatedAt).toLocaleString('es-AR')}</p>
            </div>
          </div>
          {order.notas && (
            <div className="mt-4">
              <strong>Notas:</strong>
              <p className="mt-1 text-gray-700">{order.notas}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
