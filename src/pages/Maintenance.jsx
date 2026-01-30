import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Instagram } from 'lucide-react';
import logo from '../assets/nodearTransparante.png'; // Assuming this exists based on Login context
// If not, I'll use text

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
      
      {/* Abstract Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Content */}
      <div className="max-w-3xl w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Lock Icon / Logo Area */}
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
        >
             <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 mb-6 mx-auto">
                <Lock className="w-8 h-8 text-white" />
             </div>
             <h3 className="text-xl font-mono tracking-widest text-gray-500 uppercase">Sistema Detenido</h3>
        </motion.div>

        {/* Big Text */}
        <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none"
        >
          Preparando<br/>
          <span className="text-stroke-white text-transparent">Nuevo Drop</span>
        </motion.h1>

        <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-400 max-w-lg text-lg font-light"
        >
          La tienda está cerrada momentáneamente mientras actualizamos el stock. 
          Los miembros del club tendrán acceso anticipado en breve.
        </motion.p>
      </div>

      {/* Footer Socials */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 z-20">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5"
                >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
            </a>
      </div>
    </div>
  );
}
