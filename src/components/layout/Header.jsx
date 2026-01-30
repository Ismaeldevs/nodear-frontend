import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useProductsStore } from '../../stores/useProductsStore';
import logo from '../../assets/nodearTransparante.png';
import logoDark from '../../assets/nodear_Negro_FondoTransparente.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const openCart = useCartStore((state) => state.openCart);
  const cartCount = useCartStore((state) => state.getCartCount());
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems?.length || 0;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setFilters = useProductsStore((state) => state.setFilters);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Logic: Transparent on Home top, Solid on scroll. Solid always on other pages.
  const isHome = location.pathname === '/';
  const headerStyle = isHome && !isScrolled 
    ? 'bg-transparent py-6 text-white' 
    : 'bg-white/90 backdrop-blur-md border-b border-black/10 py-3 text-black transition-shadow duration-300';
    
  const logoSrc = isHome && !isScrolled ? logo : logoDark;
  
  // Hover effect color based on background
  const buttonHoverClass = isHome && !isScrolled ? 'hover:bg-white/20' : 'hover:bg-black/5';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast.success('Sesión cerrada');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters({ busqueda: searchQuery.trim() });
      setIsSearchOpen(false);
      setSearchQuery('');
      navigate('/shop');
    }
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerStyle}`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-50 block w-32 md:w-36 transition-transform hover:scale-105">
           <img 
             src={logoSrc} 
             alt="Node" 
             className="w-full h-auto object-contain transition-all duration-300"
           />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: 'New Drop', path: '/shop/newdrop' },
            { name: 'Hoodies', path: '/shop/hoodie' },
            { name: 'Remeras', path: '/shop/remeras' },
            { name: 'Pantalones', path: '/shop/pantalones' },
            { name: 'Accesorios', path: '/shop/accesorios' },
            { name: 'Ver Todo', path: '/shop' }
          ].map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className="text-sm font-bold uppercase tracking-wider hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-full transition-colors relative ${buttonHoverClass}`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-full transition-colors hidden sm:block relative ${buttonHoverClass}`}
            onClick={() => {
              if (isAuthenticated) {
                navigate('/wishlist');
              } else {
                toast.error('Debes iniciar sesión para ver tus favoritos');
                navigate('/login');
              }
            }}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {wishlistCount}
              </span>
            )}
          </motion.button>
          
          {isAuthenticated ? (
            <div className="relative hidden sm:block">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                className={`p-2 rounded-full transition-colors ${buttonHoverClass}`}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="w-5 h-5" />
              </motion.button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-4 w-64 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden"
                  >
                    <div className="p-4 bg-black text-white border-b-2 border-black">
                      <p className="font-black uppercase tracking-wider text-sm truncate">{user?.cliente?.nombre || user?.nombre || 'USUARIO'}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-1 truncate">{user?.email}</p>
                      {(user?.rol === 'ADMIN' || user?.rol === 'SUPER_ADMIN') && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-accent text-black text-[10px] font-black uppercase tracking-widest">
                          {user.rol}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                        {(user?.rol === 'ADMIN' || user?.rol === 'SUPER_ADMIN') && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="px-4 py-3 text-left text-sm bg-black text-white hover:bg-white hover:text-black transition-all flex items-center gap-3 font-bold uppercase tracking-wide border-b border-black group"
                          >
                            <span className="w-8 h-8 grid place-items-center bg-accent group-hover:bg-white group-hover:text-black text-black transition-colors rounded-sm">
                                <LayoutDashboard className="w-4 h-4" />
                            </span>
                            Panel Admin
                          </Link>
                        )}
                        
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="px-4 py-3 text-left text-sm bg-black text-white hover:bg-white hover:text-black transition-all flex items-center gap-3 font-bold uppercase tracking-wide border-b border-black group"
                        >
                          <span className="w-8 h-8 grid place-items-center bg-accent group-hover:bg-white group-hover:text-black text-black transition-colors rounded-sm">
                              <ShoppingBag className="w-4 h-4" />
                          </span>
                          Mis Pedidos
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="px-4 py-3 cursor-pointer text-left text-sm bg-black hover:bg-white hover:text-black transition-all flex items-center gap-3 font-bold uppercase tracking-wide group text-red-600 hover:text-black"
                        >
                           <span className="w-8 h-8 grid place-items-center bg-red-600 text-white group-hover:bg-red-50 group-hover:text-red-600 transition-colors rounded-sm">
                                <LogOut className="w-4 h-4" />
                           </span>
                           Cerrar Sesión
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                className={`p-2 rounded-full transition-colors hidden sm:block ${buttonHoverClass}`}
              >
                <User className="w-5 h-5" />
              </motion.button>
            </Link>
          )}

          <motion.button 
            whileHover={{ scale: 1.1 }}
            className={`p-2 rounded-full transition-colors relative ${buttonHoverClass}`}
            onClick={openCart}
          >
            <ShoppingBag className="w-5 h-5" />
            {(cartCount > 0) && (
                <span className="absolute top-0 right-0 bg-accent text-black text-[10px] grid place-items-center w-4 h-4 rounded-full font-bold">
                    {cartCount}
                </span>
            )}
          </motion.button>

          <button 
            className={`md:hidden p-2 z-50 ${isMobileMenuOpen ? 'text-white' : (!isHome || isScrolled ? 'text-black' : 'text-inherit')}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Search Bar Overlay - Integrated in Header */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 w-full h-full bg-white z-[60] flex items-center border-b-2 border-black"
          >
            <div className="container-custom w-full flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <form onSubmit={handleSearch} className="flex-1">
                    <input 
                    type="text" 
                    placeholder="BUSCAR PRENDAS..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xl font-black uppercase placeholder:text-gray-300 outline-none bg-transparent text-black tracking-wider"
                    autoFocus
                    />
                </form>
                <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-black" />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black text-white z-40 flex flex-col pt-32 px-8 md:hidden overflow-hidden"
          >
             {/* Background Watermark */}
             <div className="absolute -bottom-20 -right-20 text-[200px] leading-none font-black text-white/5 select-none pointer-events-none rotate-12">
                NODE
             </div>

            <nav className="flex flex-col gap-6 relative z-10">
              {[
                { label: 'New Drop', path: '/shop/newdrop' },
                { label: 'Hoodies', path: '/shop/hoodie' },
                { label: 'Remeras', path: '/shop/remeras' },
                { label: 'Pantalones', path: '/shop/pantalones' },
                { label: 'Accesorios', path: '/shop/accesorios' },
                { label: 'Ver Todo', path: '/shop' },
                ...(user?.rol === 'ADMIN' || user?.rol === 'SUPER_ADMIN' ? [{ label: 'Panel Admin', path: '/admin', isAdmin: true }] : []),
                { label: isAuthenticated ? 'Cerrar Sesión' : 'Mi Cuenta', path: isAuthenticated ? null : '/login', isAction: true }
              ].map((item, i) => (
                item.path ? (
                  <Link 
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-4"
                  >
                     <span className="text-xs font-mono text-gray-500 group-hover:text-accent transition-colors">0{i+1}</span>
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter transition-colors ${item.isAction ? 'text-gray-400 hover:text-white' : (item.isAdmin ? 'text-accent hover:text-white' : 'hover:text-accent')}`}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="group flex items-center gap-4 text-left w-full"
                  >
                     <span className="text-xs font-mono text-gray-500 group-hover:text-accent transition-colors">0{i+1}</span>
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-red-600 hover:text-red-500 transition-colors"
                    >
                      {item.label}
                    </motion.div>
                  </button>
                )
              ))}
            </nav>

            {/* Mobile Footer info */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="mt-auto mb-10 relative z-10"
             >
                <div className="w-full h-[1px] bg-white/20 mb-6"></div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Tucumán, ARG</p>
                        <p className="text-xs text-gray-500 font-mono">EST. 2026</p>
                    </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
