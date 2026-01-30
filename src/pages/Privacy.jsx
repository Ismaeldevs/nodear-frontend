export default function Privacy() {
  return (
    <div className="pt-36 md:pt-48 pb-20 min-h-screen bg-white">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">Política de Privacidad</h1>
        <p className="text-gray-500 mb-16 uppercase tracking-widest text-sm">Tu privacidad es importante</p>

        <div className="space-y-12 text-gray-600 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">1. Recolección de Datos</h2>
            <p>
              Recopilamos información personal que nos proporcionas voluntariamente al realizar una compra, registrarte o contactarnos. 
              Esto incluye tu nombre, dirección de correo electrónico, dirección de envío y número de teléfono.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">2. Uso de la Información</h2>
            <p>
              Utilizamos tu información para procesar pedidos, gestionar envíos, mejorar nuestro servicio al cliente y, si aceptaste, 
              enviarte novedades sobre lanzamientos (New Drops). No vendemos tus datos a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">3. Cookies</h2>
            <p>
              Utilizamos cookies para mejorar tu experiencia de navegación, recordar tus preferencias y analizar el tráfico del sitio. 
              Podés desactivar las cookies en la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">4. Seguridad</h2>
            <p>
              Implementamos medidas de seguridad para proteger tu información personal. Sin embargo, ninguna transmisión por internet es 100% segura.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-4 text-black">5. Tus Derechos</h2>
            <p>
              Tenés derecho a acceder, corregir o eliminar tu información personal de nuestra base de datos en cualquier momento. 
              Para ejercer estros derechos, contactanos a través de nuestros canales oficiales.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
