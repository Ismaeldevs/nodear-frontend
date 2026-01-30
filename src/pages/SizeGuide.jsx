import sizeImage from '../assets/Tabla-de-talles_remera-boxy.png';

export default function SizeGuide() {
  return (
    <div className="pt-36 md:pt-48 pb-20 min-h-screen bg-white">
      <div className="container-custom max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">Guía de Talles</h1>
        <p className="text-gray-500 mb-16 uppercase tracking-widest text-sm">Encontrá tu fit perfecto</p>

        <div className="bg-gray-50 p-8 md:p-12 border border-gray-100 flex flex-col items-center">
            <div className="mb-8">
                <span className="inline-block px-4 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">Referencia</span>
                <h2 className="text-2xl font-black uppercase">Remeras Boxy Fit</h2>
            </div>
            
            <div className="w-full max-w-2xl bg-white p-4 shadow-lg mb-8">
                 <img src={sizeImage} alt="Tabla de Talles Node" className="w-full h-auto" />
            </div>

            <div className="max-w-xl text-left text-gray-500 text-sm space-y-4">
                <p>
                    <strong>Ancho:</strong> Medido de axila a axila, con la prenda apoyada sobre una superficie plana.
                </p>
                <p>
                    <strong>Largo:</strong> Medido desde el punto más alto del hombro hasta el borde inferior de la prenda.
                </p>
                <div className="p-4 bg-accent/10 border border-accent/20 mt-6">
                    <p className="text-black font-bold uppercase text-xs">Tip de Estilo</p>
                    <p className="mt-1">Nuestras prendas tienen mordería Oversized/Boxy. Si buscás un fit más al cuerpo, te recomendamos llevar un talle menos del que usás habitualmente.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
