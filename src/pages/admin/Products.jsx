import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { productService } from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [currentPage, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        page: currentPage,
        limit: 20,
        busqueda: search,
      });
      setProducts(response.data.productos || []);
      setTotalPages(response.data.paginacion?.totalPaginas || 1);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete);
      toast.success('Producto eliminado');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar producto');
    } finally {
        setProductToDelete(null);
    }
  };

  return (
    <AdminLayout 
        title="Inventario" 
        subtitle="Gestión de catálogo"
        actions={
            <Link
                to="/admin/products/new"
                className="flex items-center gap-2 bg-black text-white px-5 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none"
            >
                <Plus className="w-5 h-5" /> <span className="hidden md:inline">Nuevo Item</span>
            </Link>
        }
    >
        {/* Toolbar */}
        <div className="bg-white p-4 border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="w-full md:w-96 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="BUSCAR ITEM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-black focus:ring-0 font-bold uppercase tracking-wide text-sm transition-all outline-none"
              />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
               <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase text-gray-500 hover:text-black transition-colors border border-transparent hover:border-gray-200">
                   <Filter className="w-4 h-4" /> Filtros
               </button>
               <button onClick={loadProducts} className="bg-gray-100 hover:bg-black hover:text-white text-black px-6 py-3 font-bold uppercase text-xs tracking-widest transition-colors">
                  Actualizar
               </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs w-20">IMG</th>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs">Nombre</th>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs hidden md:table-cell">Categoría</th>
                    <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-xs">Precio</th>
                    <th className="px-6 py-4 text-center font-black uppercase tracking-wider text-xs hidden md:table-cell">Stock</th>
                    <th className="px-6 py-4 text-center font-black uppercase tracking-wider text-xs">Estado</th>
                    <th className="px-6 py-4 text-right font-black uppercase tracking-wider text-xs">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                             <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                             <p className="text-xs font-bold uppercase text-gray-400">Cargando datos...</p>
                          </div>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-bold uppercase text-sm">
                        No se encontraron productos en el inventario.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 bg-gray-100 border border-gray-200 overflow-hidden relative">
                              <img
                                src={product.imagenes?.[0] || '/placeholder.jpg'}
                                alt={product.nombre}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-bold text-sm uppercase tracking-tight">{product.nombre}</div>
                            <div className="md:hidden text-xs text-gray-400 mt-1">{product.categoria?.nombre || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                             <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1">
                                {product.categoria?.nombre || 'General'}
                             </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-sm">
                            ${parseFloat(product.precioBase).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center hidden md:table-cell">
                          <span className={`font-mono font-bold ${product.stockTotal < 5 ? 'text-red-500' : 'text-gray-600'}`}>
                             {product.variantes?.reduce((sum, v) => sum + v.stock, 0) || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                              <span
                                className={`w-3 h-3 rounded-full ${
                                  product.activo ? 'bg-green-500' : 'bg-red-500'
                                }`}
                                title={product.activo ? 'Activo' : 'Inactivo'}
                              />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/product/${product.id}`}
                              target="_blank"
                              className="p-2 hover:bg-black hover:text-white transition-colors"
                              title="Ver en tienda"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="p-2 hover:bg-black hover:text-white transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <AlertDialog.Root>
                                <AlertDialog.Trigger asChild>
                                    <button
                                        onClick={() => setProductToDelete(product.id)}
                                        className="p-2 hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal>
                                    <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm animate-overlayShow" />
                                    <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white p-[25px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black focus:outline-none z-[100] animate-contentShow">
                                        <AlertDialog.Title className="text-xl font-black uppercase mb-4">
                                            ¿Estás absolutamente seguro?
                                        </AlertDialog.Title>
                                        <AlertDialog.Description className="text-gray-600 mb-8 font-light leading-normal">
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el producto <span className="font-bold text-black">"{product.nombre}"</span> y lo removerá de nuestros servidores.
                                        </AlertDialog.Description>
                                        <div className="flex justify-end gap-[25px]">
                                            <AlertDialog.Cancel asChild>
                                                <button className="text-gray-500 hover:text-black font-bold uppercase text-sm tracking-wider">
                                                    Cancelar
                                                </button>
                                            </AlertDialog.Cancel>
                                            <AlertDialog.Action asChild>
                                                <button 
                                                    onClick={handleDelete}
                                                    className="bg-red-500 text-white hover:bg-red-600 px-6 py-3 font-bold uppercase text-sm tracking-wider border border-transparent hover:border-black transition-all"
                                                >
                                                    Sí, eliminar
                                                </button>
                                            </AlertDialog.Action>
                                        </div>
                                    </AlertDialog.Content>
                                </AlertDialog.Portal>
                            </AlertDialog.Root>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
          </div>
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
