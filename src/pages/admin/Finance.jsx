import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import api from '../../config/axios';

export default function Finance() {
  const [metricas, setMetricas] = useState(null);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

  useEffect(() => {
    cargarDatos();
  }, [mesSeleccionado, anioSeleccionado]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [dashboardRes, ventasRes] = await Promise.all([
        api.get(`/metricas/dashboard?mes=${mesSeleccionado}&anio=${anioSeleccionado}`),
        api.get(`/metricas/ventas-mensuales?anio=${anioSeleccionado}`)
      ]);
      
      setMetricas(dashboardRes.data.data);
      setVentasMensuales(ventasRes.data.data);
    } catch (error) {
      toast.error('Error al cargar métricas financieras');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const calcularPorcentajeCambio = (actual, anterior) => {
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return ((actual - anterior) / anterior * 100).toFixed(1);
  };

  const mesAnteriorData = ventasMensuales[mesSeleccionado - 2] || { totalVentas: 0 };
  const cambioVentas = calcularPorcentajeCambio(
    metricas?.ventasMes?.total || 0,
    mesAnteriorData.totalVentas
  );

  if (loading) {
    return (
      <AdminLayout title="Finanzas" subtitle="Análisis de ventas y ganancias">
        <div className="flex justify-center items-center py-20 bg-white border border-gray-200">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Cargando métricas...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Finanzas" subtitle="Análisis de ventas y ganancias">
      {/* Filtros de período */}
      <div className="bg-white p-4 border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-700">Período:</span>
        </div>
        <div className="flex gap-4">
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
            className="px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 font-bold uppercase text-xs tracking-wider transition-all outline-none"
          >
            {meses.map((mes, idx) => (
              <option key={idx} value={idx + 1}>{mes}</option>
            ))}
          </select>
          <select
            value={anioSeleccionado}
            onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
            className="px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 font-bold uppercase text-xs tracking-wider transition-all outline-none"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
          <button 
            onClick={cargarDatos}
            className="bg-black text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-accent hover:text-black transition-all"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Cards de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Ventas del mes */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-accent">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-black ${parseFloat(cambioVentas) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(cambioVentas) >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(cambioVentas)}%
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Ventas del Mes</p>
          <p className="text-3xl font-black">{formatCurrency(metricas?.ventasMes?.total)}</p>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
            {metricas?.ventasMes?.cantidad} pedidos
          </p>
        </div>

        {/* Pedidos totales */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-500">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Pedidos del Mes</p>
          <p className="text-3xl font-black">{metricas?.pedidos?.total || 0}</p>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
            {metricas?.pedidos?.porEstado?.ENTREGADO || 0} entregados
          </p>
        </div>

        {/* Promedio por venta */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Ticket Promedio</p>
          <p className="text-3xl font-black">{formatCurrency(metricas?.ventasMes?.promedio)}</p>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
            Por pedido
          </p>
        </div>

        {/* Clientes nuevos */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Clientes Nuevos</p>
          <p className="text-3xl font-black">{metricas?.clientes?.nuevos || 0}</p>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
            Este mes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Ventas por estado */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-6">
          <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Ventas por Estado
          </h3>
          <div className="space-y-4">
            {metricas?.ventasPorEstado?.map((estado) => (
              <div key={estado.estado} className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider ${
                    estado.estado === 'ENTREGADO' ? 'bg-green-500 text-white' :
                    estado.estado === 'PAGADO' ? 'bg-blue-500 text-white' :
                    estado.estado === 'PREPARANDO' ? 'bg-yellow-400 text-black' :
                    estado.estado === 'ENVIADO' ? 'bg-purple-500 text-white' :
                    estado.estado === 'CANCELADO' ? 'bg-red-500 text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {estado.estado}
                  </span>
                  <div className="flex-1 bg-gray-200 h-4 relative overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-black"
                      style={{ 
                        width: `${(estado.cantidad / metricas.ventasPorEstado.reduce((acc, e) => acc + e.cantidad, 0) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-black text-lg">{estado.cantidad}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(estado.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de inventario */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
            <Package className="w-5 h-5" /> Inventario
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border-2 border-red-500">
              <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Bajo Stock</p>
              <p className="text-4xl font-black text-red-600">{metricas?.inventario?.productosBajoStock || 0}</p>
              <p className="text-xs text-red-600 mt-2 uppercase">Productos</p>
            </div>
            <div className="p-4 bg-yellow-50 border-2 border-yellow-400">
              <p className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-2">Requieren Atención</p>
              <p className="text-xs text-yellow-700 mt-2 uppercase">Revisar stock pronto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ventas mensuales del año */}
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Ventas Anuales {anioSeleccionado}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-4 text-left font-black uppercase text-xs tracking-wider">Mes</th>
                <th className="px-6 py-4 text-right font-black uppercase text-xs tracking-wider">Ventas</th>
                <th className="px-6 py-4 text-right font-black uppercase text-xs tracking-wider">Pedidos</th>
                <th className="px-6 py-4 text-right font-black uppercase text-xs tracking-wider">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ventasMensuales.map((venta, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 transition-colors ${venta.mes === mesSeleccionado ? 'bg-accent/10' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="font-bold uppercase text-sm">{meses[venta.mes - 1]}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-base">
                    {formatCurrency(venta.totalVentas)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold">
                    {venta.cantidadPedidos}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {venta.cantidadPedidos > 0 ? formatCurrency(venta.totalVentas / venta.cantidadPedidos) : '$0'}
                  </td>
                </tr>
              ))}
              <tr className="bg-black text-white font-black">
                <td className="px-6 py-4 uppercase">Total Anual</td>
                <td className="px-6 py-4 text-right text-lg">
                  {formatCurrency(ventasMensuales.reduce((acc, v) => acc + v.totalVentas, 0))}
                </td>
                <td className="px-6 py-4 text-right text-lg">
                  {ventasMensuales.reduce((acc, v) => acc + v.cantidadPedidos, 0)}
                </td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos más vendidos */}
      {metricas?.productosDestacados && metricas.productosDestacados.length > 0 && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Top Productos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricas.productosDestacados.slice(0, 6).map((producto, idx) => (
              <div key={producto.id} className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-transparent hover:border-black transition-all">
                <div className="w-12 h-12 bg-black text-accent flex items-center justify-center font-black text-lg">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm uppercase truncate">{producto.nombre}</p>
                  <p className="text-xs text-gray-500 uppercase">
                    {producto.cantidadVendida} vendidos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
