import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
        {/* Placeholder for video/image */}
        <div className="w-full h-full bg-[#111] animate-pulse-slow relative overflow-hidden">
             
           {/* Abstract shapes/gradient for visual interest if no image */}
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-blob" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-alt/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
           
        </div>
      </div>

      <div className="container-custom relative z-20 flex flex-col items-center text-center pt-24 md:pt-32">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-sm md:text-base font-bold tracking-[0.5em] mb-4 text-white/50 uppercase">
                PRIMAVERA / VERANO 2026
            </h2>
        </motion.div>
        
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] leading-none font-black uppercase tracking-tighter mb-8 mix-blend-difference"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          NODE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">STREETWEAR</span>
        </motion.h1>

        <motion.p 
          className="max-w-md text-gray-400 text-lg mb-10 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Redefine tu realidad. La nueva colección representa la energía cruda de las calles.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="flex flex-col sm:flex-row gap-4"
        >
            <Link to="/shop" className="btn-street bg-white text-black hover:bg-accent hover:text-black border-transparent text-center px-8 py-4">
                Ver Colección
            </Link>
            <Link to="/lookbook" className="btn-outline text-white border-white hover:bg-white hover:text-black text-center px-8 py-4">
                Ver Lookbook
            </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 opacity-50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-widest">Desliza</span>
        <div className="w-[1px] h-12 bg-white/50" />
      </motion.div>
    </section>
  );
}
