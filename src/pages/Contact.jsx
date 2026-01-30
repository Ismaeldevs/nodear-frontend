import { Mail, MapPin, Instagram } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-36 md:pt-48 pb-20 min-h-screen bg-white">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">Contacto</h1>
            <p className="text-gray-500 uppercase tracking-widest text-sm">Estamos acá para ayudarte</p>
        </div>

        <div className="flex justify-center">
             <div className="bg-gray-50 p-8 md:p-12 w-full max-w-2xl mx-auto border border-gray-100">
                <h3 className="text-2xl font-black uppercase mb-6 text-center">Canales Oficiales</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-10 text-center max-w-lg mx-auto">
                    ¿Tenés alguna duda sobre tu pedido, talles o envíos? Escribinos y nuestro equipo te responderá lo antes posible.
                </p>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-6 group bg-white border border-gray-100 hover:border-black transition-all p-6 shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold uppercase text-xs text-gray-400 mb-1">Email Atención</h4>
                            <a href="mailto:hola@nodear.com" className="font-bold text-lg md:text-xl hover:text-accent transition-colors break-all">hola@nodear.com</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 group bg-white border border-gray-100 hover:border-black transition-all p-6 shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                            <Instagram className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold uppercase text-xs text-gray-400 mb-1">Redes Sociales</h4>
                            <a href="#" className="font-bold text-lg md:text-xl hover:text-accent transition-colors">@nodear</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 group bg-white border border-gray-100 hover:border-black transition-all p-6 shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold uppercase text-xs text-gray-400 mb-1">Base Operativa</h4>
                            <span className="font-bold text-lg md:text-xl">San Miguel de Tucumán, AR</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-12 text-center">
             <div className="bg-black text-white p-8 md:p-10 relative overflow-hidden inline-block max-w-2xl w-full text-left md:text-center shadow-[8px_8px_0px_0px_rgba(200,200,200,0.5)]">
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div>
                        <h3 className="font-black uppercase text-xl mb-2">Trabajá con nosotros</h3>
                        <p className="text-gray-400 text-sm">Buscamos talento en diseño y mkt.</p>
                     </div>
                     <a href="mailto:jobs@nodear.com" className="bg-accent text-black px-8 py-3 font-black uppercase text-sm tracking-wider hover:bg-white transition-colors">
                        Aplicar
                     </a>
                 </div>
                 <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl"></div>
            </div>
        </div>

      </div>
    </div>
  );
}
