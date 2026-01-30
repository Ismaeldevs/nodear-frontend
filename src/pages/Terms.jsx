export default function Terms() {
  return (
    <div className="pt-36 md:pt-48 pb-20 min-h-screen bg-white">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">Términos y Condiciones</h1>
        <p className="text-gray-500 mb-16 uppercase tracking-widest text-sm">Última actualización: Enero 2026</p>

        <div className="space-y-12 text-gray-600 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">1. Introducción</h2>
            <p>
              Bienvenido a Node. Al acceder a nuestro sitio web y realizar compras, aceptas los siguientes términos y condiciones. 
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">2. Productos y Disponibilidad</h2>
            <p>
              Todos los productos están sujetos a disponibilidad. Nos esforzamos por mostrar los colores y texturas con la mayor precisión posible, 
              pero no podemos garantizar que el monitor de tu computadora refleje exactamente el producto real.
              Node se reserva el derecho de limitar las cantidades de cualquier producto o servicio que ofrezcamos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">3. Precios y Pagos</h2>
            <p>
              Los precios están expresados en pesos argentinos e incluyen IVA. Nos reservamos el derecho de modificar los precios sin previo aviso.
              El pago se procesa a través de plataformas seguras. No almacenamos datos de tarjetas de crédito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">4. Envíos</h2>
            <p>
              Los tiempos de envío son estimados y comienzan a contar a partir del despacho del producto. 
              No nos responsabilizamos por demoras ocasionadas por la empresa de logística ajena a Node.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">5. Propiedad Intelectual</h2>
            <p>
              Todo el contenido de este sitio (imágenes, textos, logotipos, diseños) es propiedad exclusiva de Node 
              y está protegido por las leyes de propiedad intelectual de Argentina.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
