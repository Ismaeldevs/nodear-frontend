import { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { clientService } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadClients();
  }, [currentPage, search]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAll({
        page: currentPage,
        limit: 20,
        busqueda: search,
      });
      
      // Ajustar dependiendo de la respuesta de la API
      setClients(response.clientes || response.data?.clientes || []);
      setTotalPages(response.paginacion?.totalPaginas || response.data?.paginacion?.totalPaginas || 1);
    } catch (error) {
       // Silent error for now or toast
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
      try {
          await clientService.updateStatus(id, !currentStatus);
          toast.success('Estado actualizado');
          loadClients();
      } catch (error) {
          toast.error('Error al actualizar estado');
      }
  }

  return (
    <AdminLayout title="Clientes" subtitle="Base de datos de compradores">
        
        {/* Toolbar */}
        <div className="bg-white p-4 border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="w-full md:w-96 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="BUSCAR CLIENTE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 font-bold uppercase tracking-wide text-sm transition-all outline-none"
              />
          </div>
          
           <button onClick={loadClients} className="bg-black text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-gray-800 transition-colors">
              Actualizar Lista
           </button>
        </div>

        {/* Clients Grid/Table */}
        <div className="grid grid-cols-1 gap-4">
            {loading ? (
                <div className="text-center py-12">
                     <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
                     <p className="text-xs font-bold uppercase text-gray-400">Cargando base de datos...</p>
                </div>
            ) : clients.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200">
                     <p className="text-sm font-bold uppercase text-gray-400">No se encontraron clientes.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs">Usuario</th>
                                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs">Contacto</th>
                                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs hidden md:table-cell">Ubicación</th>
                                    <th className="px-6 py-4 text-center font-black uppercase tracking-wider text-xs">Pedidos</th>
                                    <th className="px-6 py-4 text-center font-black uppercase tracking-wider text-xs">Estado</th>
                                    <th className="px-6 py-4 text-right font-black uppercase tracking-wider text-xs">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {clients.map((client) => (
                                    <tr key={client.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-sm border border-gray-200">
                                                    {client.nombre?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm uppercase tracking-tight">{client.nombre} {client.apellido}</p>
                                                    <p className="text-xs text-gray-400">Registrado: {new Date(client.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Mail className="w-3 h-3" /> {client.usuario?.email}
                                                </div>
                                                {client.telefono && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Phone className="w-3 h-3" /> {client.telefono}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-start gap-2 text-xs text-gray-600 max-w-xs truncate">
                                                <MapPin className="w-3 h-3 shrink-0 mt-0.5" /> 
                                                <span className="truncate">{client.direccion || 'Sin dirección registrada'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded">
                                                <ShoppingBag className="w-3 h-3" /> {client._count?.pedidos || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                             <button 
                                                onClick={() => toggleStatus(client.id, client.usuario?.activo)}
                                                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                                                    client.usuario?.activo 
                                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                }`}
                                             >
                                                 {client.usuario?.activo ? 'Activo' : 'Inactivo'}
                                             </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold uppercase hover:underline">Ver Detalle</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 border border-gray-300 font-bold uppercase text-xs hover:bg-black hover:text-white hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Anterior
            </button>
            <span className="px-4 py-2 bg-black text-white font-mono text-sm font-bold flex items-center">
              {currentPage} / {totalPages}
            </span>
            <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 border border-gray-300 font-bold uppercase text-xs hover:bg-black hover:text-white hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Siguiente
            </button>
          </div>
        )}

    </AdminLayout>
  );
}
