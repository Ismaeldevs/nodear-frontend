import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "¿Cuándo hacen los envíos?",
    answer: "Realizamos envíos todos los días hábiles. Si tu pedido ingresa antes de las 14hs, se despacha en el día. Los tiempos de entrega dependen del correo, generalmente entre 3 a 7 días hábiles."
  },
  {
    question: "¿Tienen local a la calle?",
    answer: "Por el momento operamos exclusivamente online, con base en Tucumán. Realizamos pop-up stores ocasionalmente, seguinos en redes para enterarte."
  },
  {
    question: "¿Qué medios de pago aceptan?",
    answer: "Aceptamos todas las tarjetas de crédito y débito, Mercado Pago y transferencia bancaria (con un 10% de descuento)."
  },
  {
    question: "¿Cómo sé cual es mi talle?",
    answer: "En cada producto y en nuestra sección 'Guía de Talles' podés encontrar las medidas exactas. Nuestras prendas suelen tener corte Boxy u Oversized, te recomendamos tu talle habitual para ese fit."
  },
  {
    question: "¿Hacen cambios?",
    answer: "Si, tenés 30 días para realizar cambios desde que recibís el producto. El mismo debe estar sin uso y con etiqueta."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="pt-36 md:pt-48 pb-20 min-h-screen bg-white">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">Preguntas Frecuentes</h1>
        <p className="text-gray-500 mb-12 uppercase tracking-widest text-sm">Todo lo que necesitas saber</p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 hover:border-black transition-colors">
              <button 
                className="w-full p-6 flex items-center justify-between text-left group"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-bold uppercase tracking-wide text-lg mr-4">{faq.question}</span>
                <span className="flex-shrink-0 transition-transform duration-300">
                  {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50"
                  >
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
