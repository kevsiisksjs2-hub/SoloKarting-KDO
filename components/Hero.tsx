
import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[600px] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1547631618-f29792042761?q=80&w=2071&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h2 className="text-zinc-400 font-bold uppercase tracking-widest mb-4">Solo Karting 2024</h2>
          <h1 className="text-5xl md:text-7xl font-black italic oswald text-white mb-6 uppercase leading-tight">
            TODO SOBRE EL MUNDO DEL <br />
            <span className="text-red-600">KARTING</span>
          </h1>
          <p className="text-xl text-zinc-300 mb-10 leading-relaxed">
            Noticias, Competencias, Rankings y los mejores circuitos del país. 
            Toda la adrenalina en una sola plataforma.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-bold uppercase flex items-center gap-2 transition-all transform hover:-translate-y-1">
              Ver Campeonatos
              <ChevronRight size={20} />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-md font-bold uppercase transition-all">
              Calendario 2024
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
