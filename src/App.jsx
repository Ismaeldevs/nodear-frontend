import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/useAuthStore';
import { useCartStore } from './stores/useCartStore';
import { useWishlistStore } from './stores/useWishlistStore';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import FAQ from './pages/FAQ';
import Shipping from './pages/Shipping';
import SizeGuide from './pages/SizeGuide';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCategories from './pages/admin/Categories';
import AdminSizes from './pages/admin/Sizes';
import AdminColors from './pages/admin/Colors';
import AdminCupones from './pages/admin/Cupones';
import AdminFinance from './pages/admin/Finance';
import AdminClients from './pages/admin/Clients';
import AdminUsers from './pages/admin/Users';
import ProductForm from './pages/admin/ProductForm';
import OrderDetail from './pages/admin/OrderDetail';
import NotFound from './pages/NotFound';
import Lookbook from './pages/Lookbook';
import Maintenance from './pages/Maintenance';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// AppContent handles routes and layout that depend on Router context
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isMaintenancePage = location.pathname === '/maintenance';

  return (
     <div className="min-h-screen flex flex-col font-body selection:bg-accent selection:text-black">
        {!isLoginPage && !isAdminPage && !isMaintenancePage && <Header />}
        {!isAdminPage && !isMaintenancePage && <CartDrawer />}
        
        <main className="flex-grow">
           <Routes>
             <Route path="/maintenance" element={<Maintenance />} />
             <Route path="/" element={<Home />} />
             <Route path="/shop" element={<Shop />} />
             <Route path="/shop/:category" element={<Shop />} />
             <Route path="/lookbook" element={<Lookbook />} />
             <Route path="/product/:id" element={<ProductDetail />} />
             <Route path="/checkout" element={<Checkout />} />
             <Route 
               path="/orders" 
               element={
                 <ProtectedRoute>
                   <Orders />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/wishlist" 
               element={
                 <ProtectedRoute>
                   <Wishlist />
                 </ProtectedRoute>
               } 
             />
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
             <Route path="/faq" element={<FAQ />} />
             <Route path="/shipping" element={<Shipping />} />
             <Route path="/size-guide" element={<SizeGuide />} />
             <Route path="/contact" element={<Contact />} />
             <Route path="/terms" element={<Terms />} />
             <Route path="/privacy" element={<Privacy />} />
             
             {/* Admin Routes - Protected */}
             <Route 
               path="/admin" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminDashboard />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/products" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminProducts />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/products/new" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <ProductForm />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/products/:id/edit" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <ProductForm />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/orders" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminOrders />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/orders/:id" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <OrderDetail />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/categories" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminCategories />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/sizes" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminSizes />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/colors" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminColors />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/cupones" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminCupones />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/finance" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminFinance />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/clients" 
               element={
                 <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                   <AdminClients />
                 </ProtectedRoute>
               } 
             />
             <Route 
               path="/admin/users" 
               element={
                 <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                   <AdminUsers />
                 </ProtectedRoute>
               } 
             />

             {/* 404 Route */}
             <Route path="*" element={<NotFound />} />
           </Routes>
        </main>

        {!isLoginPage && !isAdminPage && <Footer />}
     </div>
  );
}

export default function App() {
  const refreshAuth = useAuthStore((state) => state.refreshAuth);
  const loadFromBackend = useCartStore((state) => state.loadFromBackend);
  const loadWishlist = useWishlistStore((state) => state.loadFromBackend);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Intentar refrescar la autenticación desde las cookies al montar
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    // Cargar carrito y wishlist desde backend cuando el usuario esté autenticado
    // Solo cargar una vez cuando cambie el estado de autenticación
    if (isAuthenticated) {
      loadFromBackend();
      loadWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </CartProvider>
    </Router>
  );
}
