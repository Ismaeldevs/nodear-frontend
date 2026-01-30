import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';

const LOOKS = [
  {
    id: 1,
    image: '/images/Hoodie/hoodie_frente.webp',
    title: 'THE ESSENTIAL HOODIE',
    category: 'HOODIES',
    link: '/shop/hoodie',
    size: 'large' // spans 2 cols
  },
  {
    id: 2,
    image: '/images/pantalones/pantalon1_frente.webp',
    title: 'TACTICAL UTILITY',
    category: 'PANTALONES',
    link: '/shop/pantalones',
    size: 'normal'
  },
  {
    id: 3,
    image: '/images/Remeras/remera1_dorso.webp',
    title: 'GRAPHIC BACK',
    category: 'REMERAS',
    link: '/shop/remeras',
    size: 'tall' // spans 2 rows
  },
  {
    id: 4,
    image: '/images/accesorios/gorra1_frente.webp',
    title: 'HEADWEAR SELECTION',
    category: 'ACCESORIOS',
    link: '/shop/accesorios',
    size: 'normal'
  },
  {
    id: 5,
    image: '/images/Remeras/remera2_frente.webp',
    title: 'MINIMAL BLACK',
    category: 'REMERAS',
    link: '/shop/remeras',
    size: 'large'
  },
  {
    id: 6,
    image: '/images/accesorios/anteojos1_frente.webp',
    title: 'RETRO VISION',
    category: 'ACCESORIOS',
    link: '/shop/accesorios',
    size: 'normal'
  },
  {
    id: 7,
    image: '/images/pantalones/pantalon2_frente.webp',
    title: 'OLIVE CARGO',
    category: 'PANTALONES',
    link: '/shop/pantalones',
    size: 'tall'
  },
  {
    id: 8,
    image: '/images/Hoodie/hoodie_dorso.webp',
    title: 'OVERSIZE FIT',
    category: 'HOODIES',
    link: '/shop/hoodie',
    size: 'normal'
  }
];

export default function Lookbook() {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 bg-white">
      <div className="container-custom">
        {/* Header Section */}
        <div className="mb-16 md:mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
                <h2 className="text-6xl md:text-[120px] leading-none font-black tracking-tighter mb-4 pt-5">
                    LOOKBOOK
                </h2>
                <div className="flex items-center justify-center gap-4 text-sm md:text-xl font-bold uppercase tracking-widest">
                    <span>Season 01</span>
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    <span>2026 Collection</span>
                </div>
            </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 auto-rows-[400px]">
           {LOOKS.map((look, index) => (
             <motion.div
               key={look.id}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className={`relative group overflow-hidden border-2 border-black
                 ${look.size === 'large' ? 'md:col-span-2' : ''}
                 ${look.size === 'tall' ? 'md:row-span-2' : ''}
               `}
             >
                <img 
                    src={look.image} 
                    alt={look.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-accent font-mono text-xs mb-2">0{index + 1} // {look.category}</p>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{look.title}</h3>
                        <Link 
                            to={look.link}
                            className="inline-flex items-center gap-2 bg-white text-black px-6 py-2 font-black uppercase text-sm hover:bg-accent transition-colors"
                        >
                            Compra este look <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Floating CTA */}
        <div className="mt-24 text-center">
            <div className="inline-block p-1 border-2 border-black rotate-1 hover:rotate-0 transition-transform duration-300">
                 <div className="bg-black text-white p-8 md:p-12 text-center">
                    <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">Define tu estilo</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto uppercase tracking-wide">
                        Únete al movimiento. Comparte tu outfit usando #NODESTREETWEAR
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="#" className="flex items-center gap-2 text-white hover:text-accent font-bold uppercase transition-colors">
                            <Instagram className="w-5 h-5" /> @nodear
                        </a>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}
