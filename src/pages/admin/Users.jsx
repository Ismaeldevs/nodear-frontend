import { useState, useEffect } from 'react';
import { Search, UserCog, Shield, AlertTriangle } from 'lucide-react';
import { userService } from '../../services/api'; // Este usa el fallback a clientes por ahora
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Asumimos que la API devuelve una lista de usuarios (o clientes con datos de usuario)
      const response = await userService.getAll({ busqueda: search });
      const data = response.clientes || response.data?.clientes || [];
      // Filtramos o mapeamos si es necesario, pero como estamos usando el endpoint de clientes...
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar sistema de usuarios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Usuarios" subtitle="Control de acceso y roles">
        
        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-bold text-yellow-700 uppercase">
                        Zona de Administración de Cuentas
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                        Cualquier cambio en los roles afectará inmediantamente el acceso al sistema.
                        (Visualizando cuentas de clientes activas)
                    </p>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 border border-gray-200 mb-6 flex flex-col md:flex-row shadow-sm">
          <div className="w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="BUSCAR CUENTA POR EMAIL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 font-bold uppercase tracking-wide text-sm outline-none"
              />
          </div>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {users.map((user) => (
                <div key={user.id} className="bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                     
                     <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Shield className="w-24 h-24" />
                     </div>

                     <div className="relative z-10">
                         <div className="flex items-start justify-between mb-4">
                             <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-black text-xl">
                                 {user.usuario?.email?.charAt(0).toUpperCase()}
                             </div>
                             <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded border ${user.usuario?.rol === 'ADMIN' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                 {user.usuario?.rol || 'CLIENTE'}
                             </span>
                         </div>
                         
                         <h3 className="font-bold text-lg truncate mb-1">{user.nombre} {user.apellido}</h3>
                         <p className="text-xs font-mono text-gray-500 mb-4 truncate">{user.usuario?.email}</p>
                         
                         <div className="border-t border-gray-100 pt-4 flex gap-2">
                             <button className="flex-1 bg-gray-100 hover:bg-black hover:text-white px-3 py-2 text-xs font-bold uppercase transition-colors">
                                 Cambiar Pass
                             </button>
                             <button className="flex-1 border border-gray-300 hover:border-black px-3 py-2 text-xs font-bold uppercase transition-colors">
                                 Bloquear
                             </button>
                         </div>
                     </div>
                </div>
            ))}
        </div>
    </AdminLayout>
  );
}
