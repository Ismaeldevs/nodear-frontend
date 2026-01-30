import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { orderService, productService } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVentas: 0,
    pedidosPendientes: 0,
    totalProductos: 0,
    totalClientes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Cargar productos y pedidos reales
      const [productsRes, ordersRes] = await Promise.all([
        productService.getAll({ limit: 1 }).catch(() => ({ data: { productos: [], paginacion: { totalItems: 0 } } })),
        orderService.getAll({ limit: 1000 }).catch(() => ({ data: { pedidos: [], paginacion: { total: 0 } } }))
      ]);

      const totalProductos = productsRes.data?.paginacion?.totalItems || 0;
      const allOrders = ordersRes.data?.pedidos || [];
      
      // Calcular pedidos pendientes
      const pedidosPendientes = allOrders.filter(order => 
        order.estado === 'PENDIENTE' || order.estado === 'CONFIRMADO'
      ).length;
      
      // Calcular total de ventas (pedidos completados)
      const totalVentas = allOrders
        .filter(order => order.estado === 'ENTREGADO')
        .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

      setStats({
        totalVentas,
        pedidosPendientes,
        totalProductos,
        totalClientes: allOrders.length, // Usar total de pedidos como aproximación
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Ventas Totales',
      value: `$${stats.totalVentas.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      accent: 'border-green-500', 
      textAccent: 'text-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Pedidos Pendientes',
      value: stats.pedidosPendientes,
      change: '-2',
      icon: ShoppingCart,
      accent: 'border-yellow-500',
      textAccent: 'text-yellow-500',
      link: '/admin/orders',
    },
    {
      title: 'Productos Activos',
      value: stats.totalProductos,
      change: '+5',
      icon: Package,
      accent: 'border-blue-500',
      textAccent: 'text-blue-500',
      link: '/admin/products',
    },
    {
      title: 'Clientes Totales',
      value: stats.totalClientes,
      change: '+18',
      icon: Users,
      accent: 'border-purple-500',
      textAccent: 'text-purple-500',
      link: '/admin/clients',
    },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Resumen General">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsCards.map((stat, idx) => (
                <Link to={stat.link} key={idx} className={`bg-white p-6 border-l-4 ${stat.accent} shadow-sm hover:shadow-md transition-all duration-300 group`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg bg-gray-50 text-black group-hover:bg-black group-hover:text-white transition-colors`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${stat.textAccent} bg-opacity-10 px-2 py-1 rounded`}>
                            {stat.change}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-black text-black">{stat.value}</h3>
                    </div>
                </Link>
            ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-black text-white p-8 relative overflow-hidden group rounded-sm">
                 <div className="relative z-10">
                     <h3 className="text-2xl font-black uppercase mb-2">Nuevo Producto</h3>
                     <p className="text-gray-400 mb-6 max-w-xs">Agrega un nuevo item a tu colección y publícalo en la tienda.</p>
                     <Link to="/admin/products/new" className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 font-bold uppercase tracking-wider hover:bg-white transition-colors">
                        Crear Producto <ArrowRight className="w-4 h-4" />
                     </Link>
                 </div>
                 <Package className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            
            {/* System Status */}
            <div className="bg-white p-8 border border-gray-100 flex flex-col justify-center rounded-sm">
                 <h3 className="text-xl font-black uppercase mb-6">Estado del Sistema</h3>
                 <div className="space-y-6">
                     <div>
                         <div className="flex justify-between text-xs font-bold uppercase mb-2">
                             <span>Servidor API</span>
                             <span className="text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                             </span>
                         </div>
                         <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-full animate-pulse-slow"></div>
                         </div>
                     </div>
                     <div>
                         <div className="flex justify-between text-xs font-bold uppercase mb-2">
                             <span>Base de Datos</span>
                             <span className="text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Conectado
                             </span>
                         </div>
                         <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-full"></div>
                         </div>
                     </div>
                     
                     <div className="pt-4 border-t border-gray-100 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase">Versión del Sistema</span>
                            <span className="text-xs font-mono font-bold">v2.4.0-STREETWEAR</span>
                        </div>
                     </div>
                 </div>
            </div>
        </div>

    </AdminLayout>
  );
}
