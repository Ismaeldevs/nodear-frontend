import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { oauthService } from '../../../services/api';
import toast from 'react-hot-toast';

export default function MercadoPagoConnect() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchStatus = async () => {
    try {
      const data = await oauthService.getMercadoPagoStatus();
      setStatus(data);
    } catch {
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { authUrl } = await oauthService.getMercadoPagoAuthUrl();
      // Abrir en la misma pestaña (MP vuelve por redirect)
      window.location.href = authUrl;
    } catch {
      toast.error('No se pudo iniciar la conexión con Mercado Pago');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('¿Estás seguro? Los pagos dejarán de funcionar hasta reconectar.')) return;
    setDisconnecting(true);
    try {
      await oauthService.disconnectMercadoPago();
      toast.success('Mercado Pago desconectado');
      setStatus({ connected: false });
    } catch {
      toast.error('Error al desconectar');
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48 mb-3" />
        <div className="h-10 bg-gray-200 rounded w-56" />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wide">Mercado Pago</h3>
          <p className="text-sm text-gray-500 mt-1">Integración de pagos</p>
        </div>
        {/* Logo MP */}
        <div className="w-10 h-10 bg-[#009EE3] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-sm">MP</span>
        </div>
      </div>

      {status.connected ? (
        <div className="space-y-4">
          {/* Badge conectado */}
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Conectado</p>
              {status.userId && (
                <p className="text-xs text-green-600">User ID: {status.userId}</p>
              )}
            </div>
          </div>

          {/* Advertencia si el token expiró */}
          {status.expired && (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">El token expiró. Reconectá para seguir recibiendo pagos.</p>
            </div>
          )}

          <div className="flex gap-3">
            {status.expired && (
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="flex items-center gap-2 px-4 py-2 bg-[#009EE3] text-white text-sm font-bold uppercase hover:bg-[#0082c1] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${connecting ? 'animate-spin' : ''}`} />
                Reconectar
              </button>
            )}
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-bold uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              {disconnecting ? 'Desconectando...' : 'Desconectar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Conectá tu cuenta de Mercado Pago para empezar a recibir pagos. No necesitás ingresar ningún código técnico.
          </p>

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center gap-2 px-6 py-3 bg-[#009EE3] text-white font-bold uppercase text-sm hover:bg-[#0082c1] transition-colors disabled:opacity-50 w-full justify-center"
          >
            {connecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Conectar con Mercado Pago
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Serás redirigido a Mercado Pago para autorizar la aplicación de forma segura.
          </p>
        </div>
      )}
    </div>
  );
}
