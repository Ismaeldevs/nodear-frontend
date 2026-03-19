import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Tags, Ruler, Palette, DollarSign, Ticket, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import logo from '../../assets/nodearTransparante.png';

export default function AdminLayout({ children, title, subtitle, actions }) {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Productos', path: '/admin/products' },
    { icon: Package, label: 'Pedidos', path: '/admin/orders' },
    { icon: Tags, label: 'Categorías', path: '/admin/categories' },
    { icon: Ruler, label: 'Talles', path: '/admin/sizes' },
    { icon: Palette, label: 'Colores', path: '/admin/colors' },
    { icon: Ticket, label: 'Cupones', path: '/admin/cupones' },
    { icon: DollarSign, label: 'Finanzas', path: '/admin/finance' },
    { icon: Settings, label: 'Configuración', path: '/admin/configuracion' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-body">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-black text-white z-50 flex flex-col transition-all duration-300">
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-center lg:justify-start border-b border-white/10 h-24">
           <div className="w-8 h-8 lg:hidden bg-white rounded-full flex items-center justify-center">
             <span className="font-black text-black">N</span>
           </div>
           <span className="hidden lg:block text-2xl font-black uppercase tracking-tighter">
             Node<span className="text-accent">Admin</span>
           </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                
                if (item.disabled) {
                    return (
                        <div
                            key={item.path}
                            className="flex items-center gap-4 p-3 rounded-lg text-gray-600 cursor-not-allowed opacity-50"
                            title="Próximamente"
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="hidden lg:block uppercase tracking-wide text-sm">{item.label}</span>
                        </div>
                    );
                }
                
                return (
                    <Link 
                        key={item.path} 
                        to={item.path}
                        className={`
                            flex items-center gap-4 p-3 rounded-lg transition-all duration-300 group
                            ${isActive 
                                ? 'bg-accent text-black font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]' 
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }
                        `}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="hidden lg:block uppercase tracking-wide text-sm">{item.label}</span>
                    </Link>
                )
            })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
            <button 
                onClick={logout}
                className="w-full flex items-center gap-4 p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
                <LogOut className="w-6 h-6" />
                <span className="hidden lg:block uppercase tracking-wide text-sm font-bold">Cerrar Sesión</span>
            </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
          
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 h-24 px-8 flex items-center justify-between sticky top-0 z-40">
              <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">{title}</h1>
                  {subtitle && <p className="text-gray-500 text-xs uppercase tracking-widest">{subtitle}</p>}
              </div>

              <div className="flex items-center gap-6">
                  {actions}
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                      A
                  </div>
              </div>
          </header>

          {/* Page Content */}
          <main className="p-8">
              {children}
          </main>
      </div>
    </div>
  );
}
