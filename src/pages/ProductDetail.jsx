import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, Heart, Share2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../stores/useCartStore';
import { useWishlist } from '../hooks/useWishlist';
import { calcularPrecioTransferencia, DESCUENTO_TRANSFERENCIA, formatARS } from '../utils/mpFees';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Actualizar variante seleccionada cuando cambian talle o color
  useEffect(() => {
    if (!product?.variantes || !selectedSize || !selectedColor) {
      setSelectedVariant(null);
      return;
    }

    const variant = product.variantes.find(
      (v) => v.talleId === selectedSize && v.colorId === selectedColor
    );
    setSelectedVariant(variant);
  }, [selectedSize, selectedColor, product]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Por favor seleccioná un talle y color');
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error('Stock insuficiente');
      return;
    }

    addItem(product, selectedVariant, quantity);
    toast.success('Producto agregado al carrito');
  };

  const handleWishlistToggle = async () => {
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
      toast.error(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-48 md:pt-56 pb-16 bg-white min-h-screen">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-4 animate-pulse">
              <div className="aspect-[4/5] bg-gray-200"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6 animate-pulse">
              <div className="h-12 bg-gray-200"></div>
              <div className="h-8 bg-gray-200 w-1/3"></div>
              <div className="h-20 bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-48 md:pt-56 pb-16 bg-white min-h-screen">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Producto no encontrado</h2>
          <Link to="/shop" className="btn-street">Volver a la tienda</Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.imagenes) ? product.imagenes : [];
  
  // Obtener talles únicos y ordenados
  const sizesMap = new Map();
  product.variantes?.forEach(v => {
    if (v.talleId && v.talle && !sizesMap.has(v.talleId)) {
      sizesMap.set(v.talleId, { 
        id: v.talleId, 
        nombre: v.talle.nombre,
        orden: v.talle.orden || 0
      });
    }
  });
  const availableSizes = Array.from(sizesMap.values()).sort((a, b) => a.orden - b.orden);
  
  // Obtener colores únicos
  const colorsMap = new Map();
  product.variantes?.forEach(v => {
    if (v.colorId && v.color && !colorsMap.has(v.colorId)) {
      colorsMap.set(v.colorId, { 
        id: v.colorId, 
        nombre: v.color.nombre, 
        codigoHex: v.color.codigoHex 
      });
    }
  });
  const availableColors = Array.from(colorsMap.values());
  
  const precio = selectedVariant?.precio || product.precioBase;

  return (
    <div className="pt-48 md:pt-56 pb-16 bg-white">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-8 flex gap-2">
          <Link to="/" className="hover:text-black">Inicio</Link> / <Link to="/shop" className="hover:text-black">Tienda</Link> / {product.categoria?.nombre && <><span>{product.categoria.nombre}</span> / </>}<span className="text-black font-bold">{product.nombre}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery Section */}
          <div className="space-y-4">
            <motion.div 
              className="aspect-[4/5] bg-gray-100 w-full overflow-hidden relative group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
               {images.length > 0 && images[activeImage] ? (
                 <img 
                   src={images[activeImage]} 
                   alt={product.nombre} 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <span className="text-6xl font-black opacity-20 uppercase">Sin Imagen</span>
                 </div>
               )}
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square bg-gray-50 border-2 transition-all overflow-hidden ${activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                  >
                     {img ? (
                       <img src={img} alt={`${product.nombre} ${idx + 1}`} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                         {idx + 1}
                       </div>
                     )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div>
             <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] text-black">
                  {product.nombre}
                </h1>
                <button 
                  className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copiado');
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </button>
             </div>

             <div className="mb-8">
                {/* Precio cuotas */}
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-black">
                    3 cuotas de {formatARS(Math.ceil(parseFloat(precio) / 3))}
                  </span>
                  <span className="text-base font-normal text-gray-500">sin interés</span>
                </div>
                {/* Precio transferencia */}
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-wide">
                    {Math.round(DESCUENTO_TRANSFERENCIA * 100)}% OFF
                  </span>
                  <span className="text-lg font-bold text-green-700">
                    Transferencia: {formatARS(calcularPrecioTransferencia(parseFloat(precio)))}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatARS(parseFloat(precio))}
                  </span>
                </div>
                {/* Stock badge */}
                <div className="mt-3">
                  {selectedVariant ? (
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide ${selectedVariant.stock > 0 ? 'bg-accent/20 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedVariant.stock > 0 ? `Stock: ${selectedVariant.stock}` : 'Sin Stock'}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide">Seleccionar variante</span>
                  )}
                </div>
             </div>

             <p className="text-gray-600 leading-relaxed mb-8 font-light">
               {product.descripcion || 'Sin descripción disponible'}
             </p>

             {/* Color Selector */}
             <div className="mb-8">
               <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 block">
                 Color: <span className="text-black">{selectedColor ? availableColors.find(c => c.id === selectedColor)?.nombre : 'Seleccionar'}</span>
               </span>
               <div className="flex gap-4">
                 {availableColors.map(color => (
                   <button
                     key={color.id}
                     onClick={() => setSelectedColor(color.id)}
                     className={`w-10 h-10 rounded-full border-2 relative transition-transform hover:scale-110 ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-black' : 'border-gray-300'}`}
                     style={{ backgroundColor: color.codigoHex || '#000' }}
                     title={color.nombre}
                   />
                 ))}
               </div>
             </div>

             {/* Size Selector */}
             <div className="mb-8">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                   Talle: <span className="text-black">{selectedSize ? availableSizes.find(s => s.id === selectedSize)?.nombre : 'Seleccionar'}</span>
                 </span>
                 <Link to="/size-guide" className="text-xs underline text-gray-500 hover:text-black uppercase tracking-wide">Guía de Talles</Link>
               </div>
               <div className="grid grid-cols-5 gap-3">
                 {availableSizes.map(size => (
                   <button
                     key={size.id}
                     onClick={() => setSelectedSize(size.id)}
                     className={`h-12 border flex items-center justify-center text-sm font-bold transition-all ${
                       selectedSize === size.id
                         ? 'bg-black text-white border-black' 
                         : 'bg-white text-black border-gray-200 hover:border-black'
                     }`}
                   >
                     {size.nombre}
                   </button>
                 ))}
               </div>
             </div>

             {/* Quantity & Add to Cart */}
             <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-gray-100">
               <div className="flex items-center border border-black w-fit">
                 <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                 >
                   <Minus className="w-4 h-4" />
                 </button>
                 <span className="w-12 text-center font-bold">{quantity}</span>
                 <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  disabled={selectedVariant && quantity >= selectedVariant.stock}
                 >
                   <Plus className="w-4 h-4" />
                 </button>
               </div>

               <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="flex-1 bg-black text-white h-12 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-accent hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-2px] translate-y-[-2px] hover:translate-x-0 hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                 onClick={handleAddToCart}
                 disabled={!selectedVariant || selectedVariant.stock === 0}
               >
                 {selectedVariant && selectedVariant.stock > 0 
                   ? `Agregar al Carrito - $${(parseFloat(precio) * quantity).toFixed(2)}`
                   : 'Seleccionar variante'
                 }
               </motion.button>
               
               <button 
                 className={`h-12 w-12 border flex items-center justify-center transition-colors ${isInWishlist(product.id) ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}
                 onClick={handleWishlistToggle}
               >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
               </button>
             </div>

             {/* Features/Trust */}
             <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <Truck className="w-6 h-6 text-gray-400" />
                  <div>
                    <h4 className="font-bold text-sm uppercase mb-1">Envío Gratis</h4>
                    <p className="text-xs text-gray-500">En pedidos superiores a $150. Envíos nacionales disponibles.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <RotateCcw className="w-6 h-6 text-gray-400" />
                  <div>
                    <h4 className="font-bold text-sm uppercase mb-1">Devoluciones Fáciles</h4>
                    <p className="text-xs text-gray-500">Política de devolución de 30 días para cambio o reembolso.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <ShieldCheck className="w-6 h-6 text-gray-400" />
                  <div>
                    <h4 className="font-bold text-sm uppercase mb-1">Pago Seguro</h4>
                    <p className="text-xs text-gray-500">Checkout seguro garantizado.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
