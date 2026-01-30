import { Link } from 'react-router-dom';

export default function Footer() {
    return (
      <footer className="bg-black text-white pt-20 pb-10 border-t-4 border-accent">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Node</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Streetwear premium para el explorador urbano moderno. Diseñado en Tucumán, usado en todo el mundo.
              </p>
              <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-black transition-colors" aria-label="Instagram">
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <title>Instagram</title>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-black transition-colors" aria-label="WhatsApp">
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <title>WhatsApp</title>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-black transition-colors" aria-label="TikTok">
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <title>TikTok</title>
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.55-1.07-.01 1.6.01 3.2-.01 4.8-.02 4.25-3.3 7.82-7.55 7.82-3.87 0-7.05-2.91-7.44-6.75a7.51 7.51 0 014.87-7.79 7.45 7.45 0 015.4.15c.1.06.09.2.1.27v4.13c-.65-.3-1.39-.45-2.11-.27-1.35.34-2.28 1.55-2.29 2.95-.01 1.58 1.25 2.91 2.83 2.95 1.59.04 2.87-1.23 2.97-2.81 0-.02 0-.04 0-.06V.02h-.03z"/>
                    </svg>
                  </a>
              </div>
            </div>
  
            <div>
              <h3 className="text-lg font-bold uppercase mb-6 text-white/90">Tienda</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/shop" className="hover:text-accent transition-colors">New Drops</Link></li>
                <li><Link to="/shop" className="hover:text-accent transition-colors">Más Vendidos</Link></li>
                <li><Link to="/shop/hoodies" className="hover:text-accent transition-colors">Buzos</Link></li>
                <li><Link to="/shop/accessories" className="hover:text-accent transition-colors">Accesorios</Link></li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-bold uppercase mb-6 text-white/90">Ayuda</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/faq" className="hover:text-accent transition-colors">Preguntas Frecuentes</Link></li>
                <li><Link to="/shipping" className="hover:text-accent transition-colors">Envíos y Devoluciones</Link></li>
                <li><Link to="/size-guide" className="hover:text-accent transition-colors">Guía de Talles</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-colors">Contacto</Link></li>
              </ul>
            </div>
          </div>
  
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest">
            <p>&copy; 2026 Node. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }
