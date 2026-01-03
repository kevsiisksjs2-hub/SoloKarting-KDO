
import React, { useEffect, useState, useMemo } from 'react';
import { MapPin, Info, Ruler, Zap, Building2, Target, Filter, ChevronDown, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Circuit, Association } from '../types';

const Circuitos: React.FC = () => {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [filterAssocId, setFilterAssocId] = useState<string>('all');

  useEffect(() => {
    setCircuits(storageService.getCircuits());
    setAssociations(storageService.getAssociations());
  }, []);

  const getAssocsForCircuit = (circuitId: string) => {
    return associations.filter(a => a.circuitIds?.includes(circuitId));
  };

  const filteredCircuits = useMemo(() => {
    if (filterAssocId === 'all') return circuits;
    const selectedAssoc = associations.find(a => a.id === filterAssocId);
    if (!selectedAssoc) return circuits;
    return circuits.filter(c => selectedAssoc.circuitIds?.includes(c.id));
  }, [circuits, associations, filterAssocId]);

  return (
    <div className="bg-zinc-950 py-20 min-h-screen selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Seccion con Estetica de Marca */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-left duration-700">
               <div className="w-12 h-1 bg-red-600"></div>
               <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Sedes Oficiales 2024</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic oswald uppercase text-white mb-6 tracking-tighter leading-none animate-in fade-in slide-in-from-left duration-1000">
              Pistas de <span className="text-red-600">Leyenda</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-2xl font-medium leading-relaxed opacity-80 animate-in fade-in duration-1000 delay-300">
              Explora los trazados más exigentes del país. Donde la técnica se encuentra con la velocidad en el corazón de la tierra.
            </p>
          </div>

          <div className="w-full md:w-96 shrink-0 space-y-4 animate-in fade-in slide-in-from-right duration-1000 delay-500">
             <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-2 flex items-center gap-2">
               <Filter size={14} className="text-red-600" /> Filtrar por Asociación
             </label>
             <div className="relative group">
               <select 
                value={filterAssocId} 
                onChange={(e) => setFilterAssocId(e.target.value)} 
                className="w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2rem] px-8 py-5 text-[12px] font-black uppercase text-white outline-none focus:border-red-600 appearance-none cursor-pointer transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-zinc-800"
              >
                <option value="all">Ver Todos los Circuitos</option>
                {associations.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-red-600 transition-colors" size={20} />
             </div>
          </div>
        </div>

        {/* Grid de Circuitos con Staggered Effect */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {filteredCircuits.map((c, index) => {
            const circuitAssocs = getAssocsForCircuit(c.id);
            return (
              <div 
                key={c.id} 
                style={{ animationDelay: `${index * 150}ms` }}
                className="bg-zinc-900/40 backdrop-blur-sm rounded-[3.5rem] overflow-hidden border border-zinc-800/50 group hover:border-red-600/40 transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex flex-col h-full animate-in fade-in zoom-in-95 fill-mode-both"
              >
                {/* Media Container con Hover Pro */}
                <div className="h-96 overflow-hidden relative shrink-0">
                  <img 
                    src={c.image} 
                    alt={c.name} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 brightness-75 group-hover:brightness-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                  
                  {/* Badge de Longitud Glassmorphism */}
                  <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md text-white font-black px-6 py-3 rounded-2xl text-xs oswald flex items-center gap-3 border border-white/10 shadow-2xl z-20">
                    <Ruler size={16} className="text-red-600" />
                    {c.length}
                  </div>

                  {/* Icono de Calidad */}
                  <div className="absolute top-8 right-8 bg-red-600 p-3 rounded-2xl shadow-xl shadow-red-600/30 transform rotate-12 group-hover:rotate-0 transition-transform">
                    <Sparkles size={20} className="text-white" />
                  </div>
                </div>
                
                {/* Content Container */}
                <div className="p-10 flex flex-col flex-grow relative">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,1)]"></div>
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Trazado Federado</span>
                      </div>
                      <h3 className="text-4xl font-black text-white mb-3 uppercase tracking-tighter oswald group-hover:text-red-500 transition-colors leading-none">{c.name}</h3>
                      <div className="flex items-center gap-3 text-zinc-400 text-sm font-bold uppercase tracking-tight">
                        <MapPin size={18} className="text-red-600" />
                        {c.location}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-zinc-500 text-lg mb-10 leading-relaxed italic font-medium opacity-80 group-hover:opacity-100 transition-opacity flex-grow">
                    "{c.description}"
                  </p>

                  <div className="flex flex-wrap gap-3 mb-10">
                    {c.features.map((f, idx) => (
                      <span key={idx} className="bg-zinc-800/50 text-zinc-300 text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-zinc-700/50 flex items-center gap-2 group-hover:bg-zinc-800 transition-colors">
                        <Zap size={12} className="text-red-600" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Asociaciones Federadas linked */}
                  {circuitAssocs.length > 0 && (
                    <div className="mb-10 pt-8 border-t border-zinc-800/50">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 flex items-center gap-2">
                        <Building2 size={14} /> Fiscalización Oficial
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {circuitAssocs.map(a => (
                          <span key={a.id} className="px-4 py-2 bg-zinc-950/80 text-red-500 text-[10px] font-black uppercase rounded-xl border border-red-600/10 shadow-lg group-hover:border-red-600/30 transition-all">
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button className="w-full mt-auto py-5 bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-[1.5rem] transition-all flex items-center justify-center gap-4 group/btn shadow-2xl transform active:scale-95">
                    <Info size={20} className="transition-transform group-hover/btn:rotate-12" />
                    Telemetría & Reglamentos
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State Pro */}
        {filteredCircuits.length === 0 && (
          <div className="py-40 text-center bg-zinc-900/20 rounded-[4rem] border-2 border-dashed border-zinc-800 animate-in fade-in duration-700">
             <div className="bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
               <MapPin size={48} className="text-zinc-600" />
             </div>
             <p className="text-zinc-500 font-black uppercase tracking-[0.4em] italic text-2xl">Buscando trazados compatibles...</p>
             <button onClick={() => setFilterAssocId('all')} className="mt-10 bg-zinc-800 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all">Reiniciar Filtros</button>
          </div>
        )}

        {/* Tip Informativo Pro */}
        <div className="mt-32 p-12 bg-zinc-900/40 border border-zinc-800 rounded-[4rem] flex flex-col md:flex-row items-center gap-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={300} /></div>
          <div className="bg-red-600 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(220,38,38,0.3)] relative z-10">
            <Zap size={54} className="text-white" />
          </div>
          <div className="relative z-10">
            <h4 className="text-4xl font-black text-white uppercase oswald mb-4 tracking-tighter italic">Cultura de <span className="text-red-600">Tierra</span></h4>
            <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed font-medium">
              Competir en tierra no es solo manejo; es ingeniería de precisión. El "Julio Canepa" y el "Miguel Roldán" son catedrales del karting bonaerense. Asegúrate de verificar las presiones de neumáticos y protecciones técnicas antes de cada sesión oficial.
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        .fill-mode-both {
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default Circuitos;
