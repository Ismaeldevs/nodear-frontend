import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Reset the toast flag when component unmounts
    return () => {
      hasShownToast.current = false;
    };
  }, []);

  if (!isAuthenticated) {
    if (!hasShownToast.current) {
      toast.error('Debes iniciar sesión para acceder');
      hasShownToast.current = true;
    }
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.rol)) {
    if (!hasShownToast.current) {
      toast.error('No tienes permisos para acceder a esta sección');
      hasShownToast.current = true;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
