import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, MapPin, CreditCard } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import toast from 'react-hot-toast';

const ESTADOS_PEDIDO = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMADO: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
  EN_PREPARACION: { label: 'En Preparación', color: 'bg-purple-100 text-purple-800' },
  EN_CAMINO: { label: 'En Camino', color: 'bg-indigo-100 text-indigo-800' },
  ENTREGADO: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pedidos/mis-pedidos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data.pedidos || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Mis Pedidos</h1>
            <Link to="/shop" className="text-sm underline hover:text-accent font-bold">
                Seguir comprando
            </Link>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-black p-12 text-center"
          >
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold uppercase mb-2">No tienes pedidos aún</h3>
            <p className="text-gray-500 mb-6">Parece que no has realizado ninguna compra todavía.</p>
            <Link 
              to="/shop" 
              className="inline-block px-8 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-colors"
            >
              Explorar Catálogo
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow overflow-hidden group"
              >
                {/* Header del Pedido */}
                <div className="p-6 border-b-2 border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
                            <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-sm ${ESTADOS_PEDIDO[order.estado]?.color || 'bg-gray-100'}`}>
                                {ESTADOS_PEDIDO[order.estado]?.label || order.estado}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black tracking-tighter">
                            ${parseFloat(order.total).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 font-bold uppercase">{order.detalles.length} productos</p>
                    </div>
                </div>
                
                {/* Detalles rápidos */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-black uppercase text-gray-400 mb-1">Dirección de envío</p>
                                <p className="text-sm font-bold">{order.direccionEnvio}</p>
                                {/* <p className="text-sm text-gray-600">{order.ciudad}, {order.codigoPostal}</p> */}
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-black uppercase text-gray-400 mb-1">Método de pago</p>
                                <p className="text-sm font-bold uppercase">{order.pago?.metodoPago || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Preview de items */}
                    <div className="flex -space-x-2 overflow-hidden py-2">
                        {order.detalles.slice(0, 5).map((detalle, i) => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex-shrink-0 overflow-hidden relative" title={detalle.producto.nombre}>
                                {detalle.producto.imagenes && detalle.producto.imagenes[0] ? (
                                    <img 
                                        src={detalle.producto.imagenes[0]} 
                                        alt={detalle.producto.nombre} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 grid place-items-center text-[8px] font-bold">
                                        {detalle.producto.nombre ? detalle.producto.nombre.slice(0, 2).toUpperCase() : 'IMG'}
                                    </div>
                                )}
                            </div> 
                        ))}
                         {order.detalles.length > 5 && (
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 z-10">
                                +{order.detalles.length - 5}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer del card */}
                <div className="bg-black text-white p-3 flex justify-between items-center group-hover:bg-accent group-hover:text-black transition-colors cursor-pointer">
                    <span className="text-xs font-bold uppercase tracking-widest pl-2">Ver Detalles</span>
                    <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}