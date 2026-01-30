import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, Calendar, Download, Trash2, XCircle } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { orderService } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [filterEstado]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll({
        estado: filterEstado,
      });
      // El backend devuelve data.pedidos, no data directamente
      setOrders(response.data?.pedidos || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar pedidos');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!orderToCancel) return;

    try {
      await orderService.cancel(orderToCancel);
      toast.success('Pedido cancelado exitosamente');
      loadOrders();
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      toast.error('Error al cancelar pedido');
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      PENDIENTE: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      CONFIRMADO: 'bg-blue-50 text-blue-700 border border-blue-200',
      PREPARANDO: 'bg-purple-50 text-purple-700 border border-purple-200',
      ENVIADO: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      ENTREGADO: 'bg-green-50 text-green-700 border border-green-200',
      CANCELADO: 'bg-red-50 text-red-700 border border-red-200',
    };
    return colors[estado] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  return (
    <AdminLayout title="Pedidos" subtitle="Gestión de órdenes">
        
        {/* Toolbar */}
        <div className="bg-white p-4 border border-gray-200 mb-6 flex flex-col xl:flex-row gap-4 xl:items-center justify-between shadow-sm">
          {/* Filters Group */}
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
              <div className="relative group w-full md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <input
                    type="text"
                    placeholder="BUSCAR PEDIDO..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 font-bold uppercase tracking-wide text-xs transition-all outline-none h-10"
                />
              </div>

              <div className="relative w-full md:w-48">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 z-10" />
                  <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-black font-bold uppercase text-xs h-10 appearance-none cursor-pointer"
                  >
                    <option value="">Todos los estados</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="PREPARANDO">Preparando</option>
                    <option value="ENVIADO">Enviado</option>
                    <option value="ENTREGADO">Entregado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45 transform -translate-y-1"></div>
                  </div>
              </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
               <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors h-10">
                   <Calendar className="w-3 h-3" /> Últimos 30 días
               </button>
               <button onClick={loadOrders} className="bg-white border border-gray-300 hover:border-black text-black px-4 py-2 font-bold uppercase text-xs tracking-wider transition-colors h-10">
                  Refrescar
               </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs">Pedido #</th>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs">Cliente</th>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs hidden sm:table-cell">Fecha</th>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs">Total</th>
                    <th className="px-6 py-4 text-center font-black uppercase tracking-wider text-xs">Estado</th>
                    <th className="px-6 py-4 text-right font-black uppercase tracking-wider text-xs">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                             <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                             <p className="text-xs font-bold uppercase text-gray-400">Cargando pedidos...</p>
                          </div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-bold uppercase text-sm">
                        No hay pedidos registrados con este filtro.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <span className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded">
                                #{order.numeroPedido}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                          {order.cliente ? (
                            <div>
                              <p className="font-bold text-sm uppercase tracking-tight">
                                {order.cliente.usuario?.nombre} {order.cliente.usuario?.apellido}
                              </p>
                              <p className="text-xs text-gray-400 lowercase">{order.cliente.usuario?.email}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="font-bold text-sm uppercase tracking-tight">{order.nombreContacto}</p>
                              <p className="text-xs text-gray-400 lowercase">{order.emailContacto}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500 hidden sm:table-cell">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-sm">
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${getEstadoColor(
                              order.estado
                            )}`}
                          >
                            {order.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                              <Link
                                 to={`/admin/orders/${order.id}`} 
                                 className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-colors rounded-sm text-xs font-bold uppercase tracking-wider"
                              >
                                 Ver <Eye className="w-3 h-3" />
                              </Link>
                              
                              {order.estado !== 'CANCELADO' && order.estado !== 'ENTREGADO' && (
                                <AlertDialog.Root>
                                    <AlertDialog.Trigger asChild>
                                        <button 
                                            onClick={() => setOrderToCancel(order.id)}
                                            className="inline-flex items-center gap-2 px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors rounded-sm text-xs font-bold uppercase tracking-wider"
                                            title="Cancelar Pedido"
                                        >
                                            <XCircle className="w-3 h-3" />
                                        </button>
                                    </AlertDialog.Trigger>
                                    <AlertDialog.Portal>
                                        <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm animate-overlayShow" />
                                        <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white p-[25px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black focus:outline-none z-[100] animate-contentShow">
                                            <AlertDialog.Title className="text-xl font-black uppercase mb-4">
                                                ¿Cancelar Pedido?
                                            </AlertDialog.Title>
                                            <AlertDialog.Description className="text-gray-600 mb-8 font-light leading-normal">
                                                Se cancelará el pedido <span className="font-bold text-black">#{order.numeroPedido}</span>. Esta acción no se puede deshacer.
                                            </AlertDialog.Description>
                                            <div className="flex justify-end gap-[25px]">
                                                <AlertDialog.Cancel asChild>
                                                    <button className="text-gray-500 hover:text-black font-bold uppercase text-sm tracking-wider">
                                                        Volver
                                                    </button>
                                                </AlertDialog.Cancel>
                                                <AlertDialog.Action asChild>
                                                    <button 
                                                        onClick={handleCancel}
                                                        className="bg-red-500 text-white hover:bg-red-600 px-6 py-3 font-bold uppercase text-sm tracking-wider border border-transparent hover:border-black transition-all"
                                                    >
                                                        Sí, Cancelar
                                                    </button>
                                                </AlertDialog.Action>
                                            </div>
                                        </AlertDialog.Content>
                                    </AlertDialog.Portal>
                                </AlertDialog.Root>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
          </div>
        </div>
    </AdminLayout>
  );
}
