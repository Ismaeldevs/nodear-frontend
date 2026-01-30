import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/useAuthStore';
import logo from '../assets/nodearTransparante.png';
import logoDark from '../assets/nodear_Negro_FondoTransparente.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('¡Bienvenido de nuevo!');
      navigate('/');
    } else {
      toast.error(result.error || 'Error al iniciar sesión');
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
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Unite al <br/><span className="text-accent">Movimiento</span></h2>
            <p className="text-gray-400 max-w-sm">
                Accedé antes a los lanzamientos, recompensas exclusivas y compra más rápido. No te duermas.
            </p>
        </div>
        
        {/* Abstract Art Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[150px]" />
        </div>

        {/* Footer */}
        <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-gray-500">Establecido 2026 • Tucumán, AR</p>
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

            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Bienvenido de Nuevo</h1>
            <p className="text-gray-500 mb-10">Ingresá tus datos para iniciar sesión.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b-2 border-gray-200 bg-transparent py-3 text-lg outline-none focus:border-black transition-colors placeholder:text-gray-300 font-bold"
                        placeholder="NOMBRE@EJEMPLO.COM"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-xs font-bold uppercase tracking-wide">Contraseña</label>
                        <a href="#" className="text-xs text-gray-400 hover:text-black">¿Olvidaste tu contraseña?</a>
                    </div>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b-2 border-gray-200 bg-transparent py-3 pr-10 text-lg outline-none focus:border-black transition-colors placeholder:text-gray-300 font-bold"
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

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full bg-black text-white h-14 font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-2px] translate-y-[-2px] hover:translate-x-0 hover:translate-y-0 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Iniciando...' : 'Iniciar Sesión'} {!isLoading && <ArrowRight className="w-5 h-5" />}
                </motion.button>
            </form>

            <div className="mt-10 text-center text-sm">
                <span className="text-gray-500">¿Nuevo por acá? </span>
                <Link to="/register" className="font-bold border-b-2 border-black pb-0.5 hover:text-accent hover:border-accent transition-colors">
                    Crear una cuenta
                </Link>
            </div>
            
            {/* Social Login optional */}
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                 <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">O continuá con</p>
                 <div className="flex justify-center gap-4">
                     <button className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors">
                         <span className="font-bold">G</span>
                     </button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
