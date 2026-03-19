import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function MercadoPagoCallback() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState('loading'); // loading | success | error

  const mp = searchParams.get('mp');
  const motivo = searchParams.get('motivo');

  useEffect(() => {
    if (mp === 'conectado') {
      setState('success');
    } else if (mp === 'error') {
      setState('error');
    }
    // Si no hay parámetros, el backend no redirigió aún (no debería pasar)
  }, [mp]);

  const errorMessages = {
    rechazado: 'Rechazaste la autorización en Mercado Pago.',
    sin_codigo: 'No se recibió el código de autorización.',
    estado_invalido: 'El estado de seguridad no coincide. Intentá de nuevo.',
    token: 'Error al obtener el token de acceso. Revisá que tu aplicación de MP esté activa.',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 p-8 text-center">
        {state === 'loading' && (
          <>
            <Loader className="w-12 h-12 text-[#009EE3] animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Procesando...</h1>
            <p className="text-gray-500 text-sm">Estamos completando la conexión con Mercado Pago.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black uppercase mb-2">¡Conectado!</h1>
            <p className="text-gray-600 mb-6">
              Tu cuenta de Mercado Pago fue conectada exitosamente. Ya podés recibir pagos.
            </p>
            <Link
              to="/admin/configuracion"
              className="inline-block px-6 py-3 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors"
            >
              Ir al panel de configuración
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black uppercase mb-2">Error de conexión</h1>
            <p className="text-gray-600 mb-6">
              {errorMessages[motivo] || 'Ocurrió un error al conectar con Mercado Pago.'}
            </p>
            <Link
              to="/admin/configuracion"
              className="inline-block px-6 py-3 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors"
            >
              Volver e intentar de nuevo
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
