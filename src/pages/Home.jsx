import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';

export default function Home() {
  const { products, isLoading } = useProducts({ limite: 8, ordenarPor: 'createdAt', orden: 'DESC' });

  return (
    <>
      <Hero />
      
      {/* Featured Drop Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-2">Último Drop</h2>
              <p className="text-gray-500 uppercase tracking-widest text-sm">Colección Primavera 2026</p>
            </div>
            <Link to="/shop" className="hidden md:block text-sm font-bold uppercase border-b-2 border-black pb-1 hover:text-accent hover:border-accent transition-colors">
              Ver Todo
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] mb-4"></div>
                  <div className="h-4 bg-gray-200 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
              <Link to="/shop" className="btn-outline w-full inline-block text-center pt-3">Ver Todo</Link>
          </div>
        </div>
      </section>

      {/* Brand Statement / Marquee */}
      <section className="py-20 bg-black text-white overflow-hidden">
          <div className="relative flex whitespace-nowrap">
               <div className="animate-marquee flex gap-16 text-6xl md:text-9xl font-black uppercase opacity-20 select-none">
                  <span>Cultura Urbana</span>
                  <span>•</span>
                  <span>Calidad Premium</span>
                  <span>•</span>
                  <span>Drops Limitados</span>
                  <span>•</span>
                  <span>Cultura Urbana</span>
                  <span>•</span>
                  <span>Calidad Premium</span>
                  <span>•</span>
                  <span>Drops Limitados</span>
               </div>
          </div>
      </section>
    </>
  );
}
