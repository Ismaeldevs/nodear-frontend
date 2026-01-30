import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, MapPin, CheckCircle, ShieldCheck, Tag, X } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { orderService, paymentService, cuponService } from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    telefono: '',
    nombreCompleto: user ? `${user.nombre} ${user.apellido}` : '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    provincia: 'Tucumán',
  });
  const [errors, setErrors] = useState({});

  // Estado para cupón
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null);
  const [validandoCupon, setValidandoCupon] = useState(false);
  const [errorCupon, setErrorCupon] = useState('');

  // No redirigir si no está autenticado - permitir compra como invitado
  // useEffect para cargar datos del usuario si está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        nombreCompleto: `${user.nombre} ${user.apellido}`.trim() || prev.nombreCompleto,
      }));
    }
  }, [isAuthenticated, user]);

  const cartTotal = getCartTotal();
  const descuentoCupon = cuponAplicado ? parseFloat(cuponAplicado.descuento) : 0;
  const totalFinal = Math.max(0, cartTotal - descuentoCupon);

  const handleValidarCupon = async () => {
    if (!codigoCupon.trim()) {
      setErrorCupon('Ingresa un código de cupón');
      return;
    }

    setValidandoCupon(true);
    setErrorCupon('');

    try {
      const response = await cuponService.validate(codigoCupon, cartTotal);
      setCuponAplicado(response.data);
      toast.success(`¡Cupón aplicado! Descuento: $${response.data.descuento}`);
    } catch (error) {
      setErrorCupon(error.response?.data?.message || 'Cupón inválido');
      setCuponAplicado(null);
    } finally {
      setValidandoCupon(false);
    }
  };

  const handleRemoverCupon = () => {
    setCuponAplicado(null);
    setCodigoCupon('');
    setErrorCupon('');
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-6">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8 uppercase tracking-widest">No hay nada que procesar aquí.</p>
        <Link to="/shop" className="btn-street bg-black text-white hover:bg-accent hover:text-black px-8 py-4">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefono || formData.telefono.length < 10) {
      newErrors.telefono = 'Teléfono inválido';
    }
    if (!formData.nombreCompleto || formData.nombreCompleto.length < 3) {
      newErrors.nombreCompleto = 'Nombre completo requerido';
    }
    if (!formData.direccion || formData.direccion.length < 5) {
      newErrors.direccion = 'Dirección requerida';
    }
    if (!formData.ciudad || formData.ciudad.length < 2) {
      newErrors.ciudad = 'Ciudad requerida';
    }
    if (!formData.codigoPostal || formData.codigoPostal.length < 4) {
      newErrors.codigoPostal = 'Código postal inválido';
    }
    if (!formData.provincia) {
      newErrors.provincia = 'Provincia requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    try {
      let ordenResponse;

      if (isAuthenticated) {
        // Usuario autenticado: crear orden desde el carrito activo
        const ordenData = {
          direccionEnvio: `${formData.direccion}, ${formData.ciudad}, ${formData.provincia}, CP: ${formData.codigoPostal}`,
          nombreContacto: formData.nombreCompleto,
          telefonoContacto: formData.telefono,
          emailContacto: formData.email,
          requiereEnvio: true,
          cuponId: cuponAplicado?.cupon?.id || null,
        };

        ordenResponse = await orderService.createOrder(ordenData);
      } else {
        // Usuario invitado: crear orden con productos del carrito local
        const ordenData = {
          productos: items.map(item => ({
            varianteId: item.varianteId,
            cantidad: item.cantidad,
          })),
          direccionEnvio: `${formData.direccion}, ${formData.ciudad}, ${formData.provincia}, CP: ${formData.codigoPostal}`,
          nombreContacto: formData.nombreCompleto,
          telefonoContacto: formData.telefono,
          emailContacto: formData.email,
          cuponId: cuponAplicado?.cupon?.id || null,
        };

        ordenResponse = await orderService.createGuestOrder(ordenData);
      }

      const pedidoId = ordenResponse.data.id;
      toast.success('Orden creada exitosamente');

      // Crear preferencia de Mercado Pago según el tipo de usuario
      let mpResponse;
      if (isAuthenticated) {
        mpResponse = await paymentService.createPreference({ pedidoId });
      } else {
        mpResponse = await paymentService.createGuestPreference(pedidoId);
      }

      // Redirigir a Mercado Pago
      if (mpResponse.data.initPoint) {
        window.location.href = mpResponse.data.initPoint;
      } else {
        throw new Error('No se pudo generar el link de pago');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      toast.error(error.response?.data?.message || 'Error al procesar el pago');
      setLoading(false);
    }
  };

  return (
    <div className="pt-48 md:pt-56 pb-20 min-h-screen bg-gray-50">
      <div className="container-custom max-w-7xl mx-auto">
        {/* Breadcrumb / Title */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <Link to="/shop" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Volver a comprar
              </Link>
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9]">Checkout</h1>
           </div>
           {!isAuthenticated && (
             <div className="flex flex-col gap-2 text-sm">
               <p className="text-gray-600">¿Ya tienes cuenta?</p>
               <Link 
                 to="/login" 
                 className="px-4 py-2 border-2 border-black text-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors text-center"
               >
                 Iniciar Sesión
               </Link>
             </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: FORMS */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact Info */}
            <div className="bg-white p-6 md:p-8 border border-transparent hover:border-black/5 transition-all shadow-sm">
               <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" /> Datos de Contacto
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ejemplo@email.com" 
                        className={`w-full bg-gray-50 border p-3 font-bold text-sm focus:border-black outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider">Teléfono</label>
                      <input 
                        type="tel" 
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="+54 9 ..." 
                        className={`w-full bg-gray-50 border p-3 font-bold text-sm focus:border-black outline-none transition-colors ${errors.telefono ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                  </div>
               </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white p-6 md:p-8 border border-transparent hover:border-black/5 transition-all shadow-sm">
               <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" /> Dirección de Envío
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-wider">Nombre Completo</label>
                      <input 
                        type="text" 
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-50 border p-3 font-bold text-sm focus:border-black outline-none transition-colors ${errors.nombreCompleto ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.nombreCompleto && <p className="text-red-500 text-xs">{errors.nombreCompleto}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-wider">Dirección / Calle y Altura</label>
                      <input 
                        type="text" 
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-50 border p-3 font-bold text-sm focus:border-black outline-none transition-colors ${errors.direccion ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.direccion && <p className="text-red-500 text-xs">{errors.direccion}</p>}
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider">Ciudad</label>
                      <input 
                        type="text" 
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-50 border p-3 font-bold text-sm focus:border-black outline-none transition-colors ${errors.ciudad ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.ciudad && <p className="text-red-500 text-xs">{errors.ciudad}</p>}
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider">Código Postal</label>
                      <input 
                        type="text" 
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-50 border p-3 font-bold text-sm focus:border-black outline-none transition-colors ${errors.codigoPostal ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.codigoPostal && <p className="text-red-500 text-xs">{errors.codigoPostal}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-wider">Provincia</label>
                      <select 
                        name="provincia"
                        value={formData.provincia}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-50 border p-3 font-bold text-sm focus:border-black outline-none transition-colors appearance-none ${errors.provincia ? 'border-red-500' : 'border-gray-200'}`}
                      >
                          <option>Tucumán</option>
                          <option>Buenos Aires</option>
                          <option>Córdoba</option>
                          <option>Santa Fe</option>
                          <option>Mendoza</option>
                          <option>Salta</option>
                          <option>Jujuy</option>
                          <option>Entre Ríos</option>
                      </select>
                      {errors.provincia && <p className="text-red-500 text-xs">{errors.provincia}</p>}
                  </div>
               </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 md:p-8 border border-transparent hover:border-black/5 transition-all shadow-sm">
               <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-accent" /> Método de Pago
               </h2>
               <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                 <div className="flex items-center gap-3 mb-2">
                   <img src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg" alt="Mercado Pago" className="h-8" />
                   <span className="font-bold text-sm">Pago seguro con Mercado Pago</span>
                 </div>
                 <p className="text-xs text-gray-600">
                   Serás redirigido a Mercado Pago para completar tu compra de forma segura. Acepta tarjetas de crédito, débito y otros métodos de pago.
                 </p>
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-5">
             <div className="sticky top-24">
                <div className="bg-black text-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(200,200,200,1)]">
                    <h2 className="text-2xl font-black uppercase mb-8 border-b border-white/20 pb-4">Tu Pedido</h2>
                    
                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">
                                <div className="w-16 h-20 bg-white/10 flex-shrink-0 relative overflow-hidden">
                                     {item.producto?.imagenes?.[0] ? (
                                        <img src={item.producto.imagenes[0]} alt={item.producto.nombre} className="w-full h-full object-cover" />
                                     ) : (
                                        <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 font-bold">IMG</span>
                                     )}
                                     <span className="absolute top-0 right-0 bg-accent text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                                         {item.cantidad}
                                     </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm uppercase leading-tight mb-1">{item.producto?.nombre}</h4>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                        {item.variante?.talle?.nombre} / {item.variante?.color?.nombre}
                                    </p>
                                </div>
                                <div className="font-bold font-mono">
                                    ${(parseFloat(item.variante?.precio || 0) * item.cantidad).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sección de Cupón */}
                    <div className="border-t border-white/20 pt-6 mb-6">
                      <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Cupón de Descuento
                      </h3>
                      
                      {!cuponAplicado ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Código de cupón"
                              value={codigoCupon}
                              onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
                              onKeyPress={(e) => e.key === 'Enter' && handleValidarCupon()}
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:border-accent outline-none font-mono uppercase"
                            />
                            <button
                              onClick={handleValidarCupon}
                              disabled={validandoCupon}
                              className="px-4 py-2 bg-accent text-black font-bold text-xs uppercase hover:bg-white transition-colors disabled:opacity-50"
                            >
                              {validandoCupon ? '...' : 'Aplicar'}
                            </button>
                          </div>
                          {errorCupon && (
                            <p className="text-red-400 text-xs">{errorCupon}</p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-green-500/20 border border-green-500 p-3 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-green-400">{cuponAplicado.cupon.codigo}</span>
                            <button
                              onClick={handleRemoverCupon}
                              className="text-white/60 hover:text-white"
                              title="Remover cupón"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {cuponAplicado.cupon.descripcion && (
                            <p className="text-xs text-gray-300">{cuponAplicado.cupon.descripcion}</p>
                          )}
                          <p className="text-sm font-bold text-green-400 mt-2">
                            Descuento: -${descuentoCupon.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 border-t border-white/20 pt-6 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        {cuponAplicado && (
                          <div className="flex justify-between text-green-400">
                            <span>Descuento</span>
                            <span>-${descuentoCupon.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-400">
                            <span>Envío</span>
                            <span className="text-accent uppercase font-bold text-xs">Gratis</span>
                        </div>
                        <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-white/20">
                            <span>Total</span>
                            <span>${totalFinal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      disabled={loading}
                      className="w-full bg-accent text-black font-black uppercase tracking-wider h-14 mt-8 hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Procesando...' : 'Pagar con Mercado Pago'} <ShieldCheck className="w-5 h-5" />
                    </button>
                    
                    <p className="text-[10px] text-center text-gray-500 mt-4 uppercase tracking-wider">
                        Transacciones seguras y encriptadas
                    </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
