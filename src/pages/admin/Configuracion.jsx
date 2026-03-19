import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import MercadoPagoConnect from '../../components/admin/MercadoPagoConnect';
import toast from 'react-hot-toast';

export default function Configuracion() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const mp = searchParams.get('mp');
    if (mp === 'conectado') {
      toast.success('¡Mercado Pago conectado exitosamente!');
      setSearchParams({});
    } else if (mp === 'error') {
      const motivo = searchParams.get('motivo');
      const mensajes = {
        rechazado: 'Cancelaste la autorización en Mercado Pago.',
        sin_codigo: 'No se recibió el código de autorización.',
        estado_invalido: 'Error de seguridad. Intentá de nuevo.',
        token: 'Error al obtener el token. Verificá tu aplicación de MP.',
      };
      toast.error(mensajes[motivo] || 'Error al conectar con Mercado Pago.');
      setSearchParams({});
    }
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        <h1 className="text-3xl font-black uppercase mb-2">Configuración</h1>
        <p className="text-gray-500 mb-10">Gestioná las integraciones de tu tienda.</p>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Métodos de pago
          </h2>
          <MercadoPagoConnect />
        </section>
      </div>
    </AdminLayout>
  );
}
