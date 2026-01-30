import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/useAuthStore';
import logo from '../assets/nodearTransparante.png';
import logoDark from '../assets/nodear_Negro_FondoTransparente.png';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Crear objeto con los datos para el backend
    const { confirmPassword, ...userData } = formData;
    
    const result = await register(userData);
    
    if (result.success) {
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/');
    } else {
      toast.error(result.error || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-black">
      {/* Visual Section - Hidden on mobile */}
      <div className="hidden md:flex flex-1 bg-black text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Top Content: Logo + Text */}
        <div className="relative z-10">
            <Link to="/" className="block w-32 mb-16 transition-transform hover:scale-105">
                <img src={logo} alt="Node" className="w-full" />
            </Link>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Creá Tu <br/><span className="text-accent">Legado</span></h2>
            <p className="text-gray-400 max-w-sm">
                Unite al círculo íntimo. Drops exclusivos, precios para miembros y lo último antes que nadie.
            </p>
        </div>
        
        {/* Abstract Art Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent rounded-full blur-[120px]" />
             <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[100px]" />
        </div>

        {/* Footer */}
         <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-gray-500">Diseño • Cultura • Futuro</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-20 bg-white">
        <div className="max-w-md w-full mx-auto">
             {/* Mobile Logo */}
            <div className="md:hidden w-full flex justify-start mb-10">
                <Link to="/" className="w-28">
                    <img src={logoDark} alt="Node" className="w-full" />
                </Link>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Registrarse</h1>
            <p className="text-gray-500 mb-8">Ingresá tus datos para crear una cuenta.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide">Nombre</label>
                    <input 
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full border-b-2 border-gray-200 bg-transparent py-2 text-lg outline-none focus:border-black transition-colors placeholder:text-gray-300 font-bold"
                        placeholder="TU NOMBRE"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide">Apellido</label>
                    <input 
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="w-full border-b-2 border-gray-200 bg-transparent py-2 text-lg outline-none focus:border-black transition-colors placeholder:text-gray-300 font-bold"
                        placeholder="TU APELLIDO"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide">Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-b-2 border-gray-200 bg-transparent py-2 text-lg outline-none focus:border-black transition-colors placeholder:text-gray-300 font-bold"
                        placeholder="NOMBRE@EJEMPLO.COM"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide">Contraseña</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 pr-10 text-lg outline-none focus:border-black transition-colors placeholder:text-gray-300 font-bold"
                            placeholder="••••••••"
                            required
                        />
                         <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors p-1"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide">Confirmar Contraseña</label>
                    <div className="relative">
                        <input 
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border-b-2 border-gray-200 bg-transparent py-2 pr-10 text-lg outline-none focus:border-black transition-colors placeholder:text-gray-300 font-bold"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors p-1"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full bg-black text-white h-14 font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-2px] translate-y-[-2px] hover:translate-x-0 hover:translate-y-0 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creando...' : 'Crear Cuenta'} {!isLoading && <ArrowRight className="w-5 h-5" />}
                </motion.button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-gray-500">¿Ya tenés cuenta? </span>
                <Link to="/login" className="font-bold border-b-2 border-black pb-0.5 hover:text-accent hover:border-accent transition-colors">
                    Iniciar sesión
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
