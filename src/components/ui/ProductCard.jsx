import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlist } from '../../hooks/useWishlist';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();
  // Extraer datos del producto del backend
  const { 
    id, 
    nombre, 
    precioBase, 
    imagenes, 
    categoria,
    variantes
  } = product || {};

  // Primera imagen del array
  const imagen = Array.isArray(imagenes) && imagenes.length > 0 ? imagenes[0] : null;
  // Segunda imagen (para hover)
  const imagenSecundaria = Array.isArray(imagenes) && imagenes.length > 1 ? imagenes[1] : null;
  
  // Formatear precio
  const precio = precioBase ? `$${parseFloat(precioBase).toFixed(2)}` : '$0.00';
  
  // Obtener nombre de categoría
  const nombreCategoria = categoria?.nombre || 'Sin categoría';

  const getCategoryTitle = (cat) => {
      const titles = {
        'hoodies': 'Buzos',
        'tees': 'Remeras',
        'pants': 'Pantalones',
        'outerwear': 'Abrigos',
        'accessories': 'Accesorios',
        'tops': 'Partes de Arriba',
        'bottoms': 'Partes de Abajo',
        'Tops': 'Partes de Arriba',
        'Bottoms': 'Pantalones',
        'Outerwear': 'Abrigos'
      };
      return titles[cat] || cat;
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    
    // Buscar primera variante con stock
    const firstAvailableVariant = variantes?.find(v => v.stock > 0);
    
    if (!firstAvailableVariant) {
      toast.error('Producto sin stock');
      return;
    }

    addItem(product, firstAvailableVariant, 1);
    toast.success('Agregado al carrito');
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    
    const wasInWishlist = isInWishlist(product.id);
    const result = await toggleWishlist(product.id);
    
    if (result?.success) {
      if (wasInWishlist) {
        toast.success('Eliminado de favoritos', {
          icon: '💔',
        });
      } else {
        toast.success('Agregado a favoritos', {
          icon: '❤️',
        });
      }
    } else if (result?.error && result.error !== 'No autenticado') {
      // Solo mostrar error si no es por falta de autenticación (ya se muestra en useWishlist)
      toast.error(result.error);
    }
  };

  return (
    <motion.div 
      className="group relative bg-white border border-transparent hover:border-black transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
        {/* Image Container */}
      <Link to={`/product/${id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 cursor-pointer">
        {imagen ? (
            <>
              <img 
                  src={imagen} 
                  alt={nombre} 
                  className={`w-full h-full object-cover transition-all duration-700 ${imagenSecundaria ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
                  loading="lazy"
              />
              {imagenSecundaria && (
                <img 
                    src={imagenSecundaria} 
                    alt={`${nombre} back`} 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                    loading="lazy"
                />
              )}
            </>
        ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-200">
                <span className="text-4xl font-black opacity-20 uppercase">No Image</span>
            </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
             <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">New</span>
        </div>

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm border-t border-black flex items-center justify-between z-10">
            <button 
              className={`p-2 transition-colors ${isInWishlist(id) ? 'text-red-500' : 'hover:text-accent'}`}
              aria-label="Add to wishlist" 
              onClick={handleWishlistToggle}
            >
                <Heart className={`w-5 h-5 ${isInWishlist(id) ? 'fill-current' : ''}`} />
            </button>
            <Link to={`/product/${id}`} className="text-xs font-black uppercase tracking-wider hover:text-accent transition-colors">
                Vista Rápida
            </Link>
            <button 
              className="p-2 hover:text-accent transition-colors" 
              aria-label="Add to cart" 
              onClick={handleQuickAdd}
            >
                <ShoppingCart className="w-5 h-5" />
            </button>
        </div>
      </Link>

      {/* Info */}
      <div className="px-2 pb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 opacity-70">{getCategoryTitle(nombreCategoria)}</p>
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-bold uppercase leading-none mb-2 group-hover:text-gray-700 transition-colors">{nombre}</h3>
        </Link>
        <p className="text-xl font-black font-heading tracking-wide text-black">{precio}</p>
      </div>
    </motion.div>
  );
}
