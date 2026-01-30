import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-12 flex flex-col items-center justify-center text-center px-4 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none overflow-hidden">
         <div className="absolute top-1/4 left-1/4 text-[400px] font-black leading-none">?</div>
         <div className="absolute bottom-0 right-0 text-[300px] font-black leading-none rotate-12">404</div>
      </div>

      <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-2">
             <AlertTriangle className="w-12 h-12 text-black" strokeWidth={3} />
          </div>
          
          <h1 className="text-[120px] md:text-[200px] leading-none font-black tracking-tighter text-black select-none">
            404
          </h1>
          
          <div className="inline-block bg-accent px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 transform mb-8">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-widest text-black">
                Ruta no encontrada
            </h2>
          </div>
          
          <p className="text-gray-500 font-bold uppercase tracking-wide mb-12 max-w-lg mx-auto">
            Parece que te perdiste en el catálogo. La página que buscas no existe o ha sido eliminada.
          </p>

          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Link>
      </div>
    </div>
  );
}
