import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { Filter, ChevronDown, X } from 'lucide-react';
import { useProductsStore } from '../stores/useProductsStore';
import { useCategories, useSizes, useColors } from '../hooks/useProducts';

export default function Shop() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  
  const { products, isLoading, pagination, setFilters, setPage, filters } = useProductsStore();
  const { categories } = useCategories();
  const { sizes } = useSizes();
  const { colors } = useColors();

  // Actualizar filtros cuando cambia la categoría en la URL
  useEffect(() => {
    // Si no hay categorías cargadas aún, no hacemos nada
    if (categories.length === 0) return;
    
    // Guardar el valor actual de búsqueda antes de actualizar
    const currentSearch = filters.busqueda;
    
    // Si hay un param de categoría en URL
    if (category) {
        // Special case for New Drop - Shows all products sorted by newest (default)
        if (category.toLowerCase() === 'newdrop') {
            setFilters({
                categoriaId: null,
                busqueda: currentSearch,
            });
        } else {
            const categoryObj = categories.find(c => c.nombre.toLowerCase() === category.toLowerCase());
            
            // Si la categoría existe en DB, filtramos por su ID
            if (categoryObj) {
                setFilters({
                    categoriaId: categoryObj.id,
                    busqueda: currentSearch, // Mantener búsqueda actual
                });
            } else {
                // Si la categoría NO existe...
                // Usaremos un UUID dummy que no existe para asegurar 0 resultados en vez de todos
                setFilters({
                    categoriaId: '00000000-0000-0000-0000-000000000000',
                    busqueda: currentSearch, // Mantener búsqueda actual
                });
            }
        }
    } else {
        // Si no hay categoría en URL (estamos en /shop), solo limpiamos el filtro de categoría
        setFilters({
            categoriaId: null,
            busqueda: currentSearch, // Mantener búsqueda actual
        });
    }
  }, [category, categories]);

  const handleCategoryClick = (cat) => {
    if (cat === 'All' || !cat) {
      navigate('/shop');
    } else {
      navigate(`/shop/${cat.toLowerCase()}`);
    }
  };

  const handleSizeFilter = (sizeId) => {
    setFilters({ talleId: filters.talleId === sizeId ? null : sizeId });
  };

  const handleColorFilter = (colorId) => {
    setFilters({ colorId: filters.colorId === colorId ? null : colorId });
  };

  const handlePriceFilter = () => {
    setFilters({
      precioMin: priceMin ? parseFloat(priceMin) : null,
      precioMax: priceMax ? parseFloat(priceMax) : null,
    });
  };

  const handleSortChange = (sort) => {
    const [ordenarPor, orden] = sort.split('-');
    setFilters({ ordenarPor, orden });
  };

  const getCategoryTitle = (cat) => {
    if (!cat) return 'Catálogo Completo';
    if (cat.toLowerCase() === 'newdrop') return 'NEW DROP';
    const categoryObj = categories.find(c => c.nombre.toLowerCase() === cat.toLowerCase());
    return categoryObj?.nombre || cat;
  };

  return (
    <div className="pt-44 md:pt-48 pb-16 min-h-screen bg-white">
      <div className="container-custom">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-8">
            <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase mb-2">{getCategoryTitle(category)}</h1>
                <p className="text-gray-500 uppercase tracking-widest text-sm">Primavera / Verano 2026</p>
            </div>
            
            <div className="flex gap-4 mt-8 md:mt-0 w-full md:w-auto">
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors uppercase text-xs font-bold w-full md:w-auto justify-center"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <Filter className="w-4 h-4" /> Filtros
                </button>
                <div className="relative group w-full md:w-auto">
                    <select 
                      className="flex items-center justify-between gap-4 px-4 py-2 border border-transparent hover:bg-gray-50 transition-colors uppercase text-xs font-bold w-full md:w-auto appearance-none cursor-pointer bg-transparent"
                      onChange={(e) => handleSortChange(e.target.value)}
                      value={`${filters.ordenarPor}-${filters.orden}`}
                    >
                        <option value="createdAt-DESC">Más Recientes</option>
                        <option value="precioBase-ASC">Precio: Menor a Mayor</option>
                        <option value="precioBase-DESC">Precio: Mayor a Menor</option>
                        <option value="nombre-ASC">Nombre: A-Z</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-64 space-y-8 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Active Search Indicator */}
                {filters.busqueda && (
                  <div className="bg-black text-white px-4 py-3 flex items-center justify-between border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">Buscando:</span>
                      <span className="text-sm font-black uppercase">{filters.busqueda}</span>
                    </div>
                    <button 
                      onClick={() => setFilters({ busqueda: '' })}
                      className="hover:scale-110 transition-transform"
                      title="Limpiar búsqueda"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Categories */}
                <div>
                   <h3 className="text-sm font-bold uppercase mb-4 tracking-wider">Categorías</h3>
                   <ul className="space-y-2">
                     <li>
                        <button 
                          className={`text-sm uppercase tracking-wide text-left w-full hover:text-black ${!category ? 'text-black font-bold' : 'text-gray-500'}`}
                          onClick={() => handleCategoryClick('All')}
                        >
                          Ver Todo
                        </button>
                     </li>
                     {categories.map(cat => (
                       <li key={cat.id}>
                          <button 
                            className={`text-sm uppercase tracking-wide text-left w-full hover:text-black ${category?.toLowerCase() === cat.nombre.toLowerCase() ? 'text-black font-bold' : 'text-gray-500'}`}
                            onClick={() => handleCategoryClick(cat.nombre)}
                          >
                            {cat.nombre}
                          </button>
                       </li>
                     ))}
                   </ul>
                </div>

                {/* Price Range */}
                <div>
                   <h3 className="text-sm font-bold uppercase mb-4 tracking-wider">Precio</h3>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                         <input 
                           type="number" 
                           placeholder="Min" 
                           value={priceMin}
                           onChange={(e) => setPriceMin(e.target.value)}
                           className="w-full border border-gray-300 p-2 text-center outline-none focus:border-black" 
                         />
                         <span>-</span>
                         <input 
                           type="number" 
                           placeholder="Max" 
                           value={priceMax}
                           onChange={(e) => setPriceMax(e.target.value)}
                           className="w-full border border-gray-300 p-2 text-center outline-none focus:border-black" 
                         />
                      </div>
                      <button 
                        onClick={handlePriceFilter}
                        className="w-full bg-black text-white py-2 text-xs font-bold uppercase hover:bg-gray-800 transition-colors"
                      >
                        Aplicar
                      </button>
                   </div>
                </div>

                {/* Sizes */}
                <div>
                   <h3 className="text-sm font-bold uppercase mb-4 tracking-wider">Talle</h3>
                   <div className="grid grid-cols-3 gap-2">
                        {sizes.map(size => (
                            <button 
                              key={size.id} 
                              className={`border py-2 text-xs font-bold transition-all ${filters.talleId === size.id ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                              onClick={() => handleSizeFilter(size.id)}
                            >
                                {size.nombre}
                            </button>
                        ))}
                   </div>
                </div>

                {/* Colors */}
                <div>
                   <h3 className="text-sm font-bold uppercase mb-4 tracking-wider">Color</h3>
                   <div className="flex flex-wrap gap-3">
                        {colors.map(color => (
                            <button 
                              key={color.id}
                              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${filters.colorId === color.id ? 'ring-2 ring-offset-2 ring-black' : 'border-gray-300'}`}
                              style={{ backgroundColor: color.codigoHex || '#000' }}
                              onClick={() => handleColorFilter(color.id)}
                              title={color.nombre}
                            />
                        ))}
                   </div>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 aspect-[3/4] mb-4"></div>
                        <div className="h-4 bg-gray-200 mb-2"></div>
                        <div className="h-4 bg-gray-200 w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-2xl font-bold mb-4">No se encontraron productos</h3>
                    <p className="text-gray-500 mb-6">Intenta ajustar los filtros</p>
                    <button 
                      onClick={() => setFilters({ categoriaId: null, talleId: null, colorId: null, precioMin: null, precioMax: null })}
                      className="btn-outline"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="mt-16 flex justify-center gap-2">
                        {pagination.page > 1 && (
                          <button 
                            onClick={() => setPage(pagination.page - 1)}
                            className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
                          >
                            Anterior
                          </button>
                        )}
                        
                        {[...Array(pagination.totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 border transition-colors ${
                              pagination.page === i + 1
                                ? 'bg-black text-white border-black'
                                : 'border-gray-300 hover:border-black'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        {pagination.page < pagination.totalPages && (
                          <button 
                            onClick={() => setPage(pagination.page + 1)}
                            className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors"
                          >
                            Siguiente
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
