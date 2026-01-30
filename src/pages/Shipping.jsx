import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="pt-36 md:pt-48 pb-20 min-h-screen bg-white">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">Envíos y Devoluciones</h1>
        <p className="text-gray-500 mb-16 uppercase tracking-widest text-sm">Políticas transparentes</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-50 p-8 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <Truck className="w-8 h-8" />
             </div>
             <h3 className="font-black uppercase mb-2">Envíos Nacionales</h3>
             <p className="text-sm text-gray-500">Llegamos a cada rincón del país a través de Correo Argentino y Andreani.</p>
          </div>
          <div className="bg-gray-50 p-8 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
             </div>
             <h3 className="font-black uppercase mb-2">Empaquetado Seguro</h3>
             <p className="text-sm text-gray-500">Tu pedido viaja protegido y asegurado hasta que llega a tus manos.</p>
          </div>
          <div className="bg-gray-50 p-8 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <RotateCcw className="w-8 h-8" />
             </div>
             <h3 className="font-black uppercase mb-2">Cambios Simples</h3>
             <p className="text-sm text-gray-500">Gestioná tu cambio de forma rápida contactando a nuestro soporte.</p>
          </div>
        </div>

        <div className="space-y-12">
            <section>
                <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-accent inline-block pb-1">Política de Envíos</h2>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                    <p>
                        Todos los pedidos se procesan dentro de las 24-48 horas hábiles siguientes a la confirmación del pago. 
                        Una vez despachado, recibirás un correo electrónico con el número de seguimiento para que puedas ver el estado de tu paquete.
                    </p>
                    <p>
                        <strong>Tiempos estimados:</strong><br/>
                        - Tucumán y NOA: 2 a 3 días hábiles.<br/>
                        - CABA y GBA: 3 a 5 días hábiles.<br/>
                        - Resto del país: 4 a 7 días hábiles.
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mt-4">
                        * Los tiempos pueden variar en fechas de alta demanda (Hot Sale, Cyber Monday, Navidad).
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-black uppercase mb-4 border-b-2 border-accent inline-block pb-1">Política de Devoluciones</h2>
                <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                    <p>
                        Queremos que ames lo que compraste. Si no es así, tenés 30 días corridos desde la recepción del pedido para solicitar un cambio o devolución.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Las prendas deben estar <strong>sin uso, sin lavar y con todas las etiquetas originales</strong> colocadas.</li>
                        <li>Los costos de envío por cambio (si es por talle o modelo) corren por cuenta del cliente, salvo que sea por falla de fábrica.</li>
                        <li>No se aceptan cambios de ropa interior o accesorios íntimos.</li>
                    </ul>
                    <p className="mt-4">
                        Para iniciar un cambio, envianos un mail a <strong>soporte@nodear.com</strong> con tu número de orden.
                    </p>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
}
