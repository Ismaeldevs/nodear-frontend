import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { wishlistItems, isLoading, removeFromWishlist, refetch } = useWishlist();

  useEffect(() => {
    // Recargar wishlist al montar el componente
    refetch();
  }, []);

  const handleRemove = async (wishlistItemId) => {
    const result = await removeFromWishlist(wishlistItemId);
    if (result?.success) {
      toast.success('Eliminado de favoritos', {
        icon: '💔',
      });
    } else if (result?.error) {
      toast.error(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-36 md:pt-48 pb-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
            <p className="mt-4 text-gray-500 uppercase text-sm tracking-wider">Cargando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen pt-36 md:pt-48 pb-16 bg-white">
        <div className="container-custom">
          {/* Header */}
          <div className="border-b-4 border-black pb-8 mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8" />
              <h1 className="text-4xl md:text-6xl font-black uppercase">Favoritos</h1>
            </div>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Tu lista de deseos</p>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-gray-100 rounded-full p-8 mb-6">
              <Heart className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-2">Tus favoritos está vacío</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Agrega productos a tu lista de deseos para verlos aquí
            </p>
            <Link 
              to="/shop" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Explorar productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 md:pt-48 pb-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="border-b-4 border-black pb-8 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8" />
                <h1 className="text-4xl md:text-6xl font-black uppercase">Favoritos</h1>
              </div>
              <p className="text-gray-500 uppercase tracking-widest text-sm">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'producto' : 'productos'} en tu lista
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const producto = item.producto;
            const imagen = producto.imagenes?.[0];
            const precio = producto.precioBase ? `$${parseFloat(producto.precioBase).toFixed(2)}` : '$0.00';
            const hasStock = producto.variantes?.some(v => v.stock > 0);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {/* Imagen */}
                <Link to={`/product/${producto.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
                  {imagen ? (
                    <img 
                      src={imagen} 
                      alt={producto.nombre} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-4xl font-black opacity-20 uppercase">No Image</span>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  {!hasStock && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        Sin stock
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item.id);
                    }}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {producto.categoria?.nombre || 'Sin categoría'}
                  </p>
                  <Link to={`/product/${producto.id}`}>
                    <h3 className="text-lg font-bold uppercase leading-tight mb-2 hover:text-gray-700 transition-colors line-clamp-2">
                      {producto.nombre}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-black">{precio}</p>
                    {hasStock && (
                      <Link
                        to={`/product/${producto.id}`}
                        className="text-xs font-bold uppercase tracking-wider hover:text-accent transition-colors"
                      >
                        Ver →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 flex justify-center">
          <Link 
            to="/shop" 
            className="btn-outline inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
