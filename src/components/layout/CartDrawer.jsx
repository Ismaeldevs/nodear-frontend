import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const drawerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target)) {
            closeCart();
        }
    };
    
    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }
    
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
            className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight">Carrito <span className="text-gray-400 text-lg align-top ml-1">({items.length})</span></h2>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <span className="text-3xl">🛒</span>
                    </div>
                    <h3 className="text-xl font-bold uppercase">Tu carrito está vacío</h3>
                    <p className="text-gray-500 max-w-xs">Parece que aún no has añadido nada.</p>
                    <button onClick={closeCart} className="btn-street mt-4">
                        Empezar a Comprar
                    </button>
                </div>
              ) : (
                items.map((item) => {
                  const imagen = Array.isArray(item.producto?.imagenes) ? item.producto.imagenes[0] : null;
                  const precio = parseFloat(item.precioUnit);
                  
                  return (
                    <motion.div 
                      layout
                      key={`${item.productoId}-${item.varianteId}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
                    >
                      {/* Image */}
                      <div className="w-24 h-32 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                         {imagen ? (
                           <img src={imagen} alt={item.producto.nombre} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">NO IMG</div>
                         )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                          <div>
                              <div className="flex justify-between items-start">
                                  <h3 className="font-bold uppercase leading-tight pr-4">{item.producto.nombre}</h3>
                                  <button 
                                      onClick={() => removeItem(item.varianteId)}
                                      className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                                  Talle: <span className="text-black">{item.variante.talle?.nombre || 'N/A'}</span> / Color: <span className="text-black">{item.variante.color?.nombre || 'N/A'}</span>
                              </p>
                          </div>

                          <div className="flex justify-between items-end">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-200">
                                  <button 
                                      onClick={() => updateQuantity(item.varianteId, -1)}
                                      className="p-1 hover:bg-gray-100"
                                      disabled={item.cantidad <= 1}
                                  >
                                      <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold">{item.cantidad}</span>
                                  <button 
                                      onClick={() => updateQuantity(item.varianteId, 1)}
                                      className="p-1 hover:bg-gray-100"
                                      disabled={item.cantidad >= item.variante.stock}
                                  >
                                      <Plus className="w-4 h-4" />
                                  </button>
                              </div>
                              
                              <p className="font-bold text-lg">
                                  ${(precio * item.cantidad).toFixed(2)}
                              </p>
                          </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-bold">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Envío</span>
                            <span className="text-green-600 font-bold uppercase text-xs">Calculado al finalizar la compra</span>
                        </div>
                    </div>
                    
                    <Link 
                        to="/checkout" 
                        onClick={closeCart}
                        className="btn-street w-full justify-between group"
                    >
                        <span>Finalizar Compra</span>
                        <div className="flex items-center gap-2">
                             <span>${cartTotal.toFixed(2)}</span>
                             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
