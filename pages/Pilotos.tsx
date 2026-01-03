
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { Pilot, Status } from '../types';
// Fixed: Added missing X, Share2, Flag, and Wrench icons to the lucide-react import
import { 
  Search, Trophy, Medal, Star, ShieldCheck, Zap, Users, 
  ChevronRight, Award, Target, Activity, MapPin, ExternalLink,
  X, Share2, Flag, Wrench
} from 'lucide-react';

const Pilotos: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePilot, setActivePilot] = useState<Pilot | null>(null);

  useEffect(() => {
    setPilots(storageService.getPilots());
  }, []);

  const categories = storageService.getCategories();

  const filteredPilots = pilots.filter(p => 
    p.status !== Status.BAJA && 
    (selectedCategory === 'all' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.number.includes(searchTerm))
  );

  return (
    <div className="bg-zinc-950 py-24 min-h-screen racing-grid selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-20 flex flex-col lg:flex-row justify-between items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-left duration-700">
               <div className="w-12 h-1 bg-red-600 shadow-[0_0_10px_#dc2626]"></div>
               <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Ranking Pro Elite 2024</span>
            </div>
            <h1 className="text-8xl font-black italic oswald uppercase text-white mb-6 tracking-tighter leading-none animate-in fade-in slide-in-from-left duration-1000">
              Pilotos <span className="text-red-600">Federados</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-xl font-medium italic opacity-80 animate-in fade-in duration-1000 delay-300">
              La base de datos oficial del motor bonaerense. Perfiles de competición validados por RMS 3.0.
            </p>
          </div>

          <div className="w-full lg:w-[500px] flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-1000 delay-500">
            <div className="relative group">
               <Search className="absolute left-6 top-6 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={24} />
               <input 
                 type="text" 
                 placeholder="NOMBRE O DORSAL..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-black uppercase text-white outline-none focus:border-red-600 transition-all shadow-2xl placeholder:text-zinc-800"
               />
            </div>
            <div className="flex gap-4">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-grow bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase text-zinc-400 outline-none focus:border-red-600 cursor-pointer shadow-xl appearance-none"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-zinc-600 hover:text-white transition-colors"><Activity size={20}/></button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {filteredPilots.map((p, idx) => (
            <div 
              key={p.id} 
              onClick={() => setActivePilot(p)}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="glass-card rounded-[3.5rem] p-10 hover:border-red-600/40 transition-all duration-500 group relative overflow-hidden shadow-2xl animate-in zoom-in-95 fill-mode-both cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700 pointer-events-none">
                <Trophy size={200} />
              </div>

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="bg-red-600 text-white font-black italic oswald text-5xl px-5 py-3 rounded-[2rem] shadow-2xl shadow-red-600/20 transform -rotate-3 group-hover:rotate-0 transition-all">
                  #{p.number}
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="bg-black/50 border border-zinc-800 p-2.5 rounded-xl text-yellow-500 shadow-inner group-hover:scale-110 transition-transform"><Star size={20} className="fill-current" /></div>
                   <span className="text-[9px] font-black oswald text-zinc-600 uppercase tracking-widest">RANK {p.ranking}º</span>
                </div>
              </div>

              <div className="relative z-10">
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-red-500 transition-colors leading-none oswald">{p.name}</h3>
                 <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 border-l-2 border-red-600/30 pl-3">{p.category}</p>
                 
                 <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-black/40 p-5 rounded-3xl border border-zinc-900 shadow-inner group-hover:border-zinc-800 transition-colors">
                       <p className="text-[8px] font-black text-zinc-700 uppercase mb-2 tracking-widest flex items-center gap-1"><Trophy size={10} className="text-red-600"/> Puntos</p>
                       <p className="text-3xl font-black oswald text-white tracking-tighter leading-none">{p.ranking * 12}</p>
                    </div>
                    <div className="bg-black/40 p-5 rounded-3xl border border-zinc-900 shadow-inner group-hover:border-zinc-800 transition-colors">
                       <p className="text-[8px] font-black text-zinc-700 uppercase mb-2 tracking-widest flex items-center gap-1"><Activity size={10} className="text-blue-500"/> Efectividad</p>
                       <p className="text-3xl font-black oswald text-white tracking-tighter leading-none">84<span className="text-sm opacity-50">%</span></p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-8 border-t border-zinc-900">
                    <div className="flex gap-2">
                       <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-yellow-500 transition-colors" title="Victoria Clásica"><Award size={16} /></div>
                       <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-emerald-500 transition-colors" title="Pole Position"><Target size={16} /></div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Equipo</span>
                       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tight">{p.team || 'PARTICULAR'}</span>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pilot Detail Modal Elite */}
        {activePilot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
             <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-900 rounded-[4rem] overflow-hidden relative shadow-[0_0_150px_rgba(220,38,38,0.15)] flex flex-col md:flex-row max-h-[90vh]">
                <button onClick={() => setActivePilot(null)} className="absolute top-10 right-10 text-zinc-600 hover:text-white transition-colors bg-zinc-900 p-3 rounded-full border border-zinc-800 z-50"><X size={24} /></button>
                
                {/* Left Side: Avatar/Dorsal */}
                <div className="md:w-[40%] bg-zinc-900/50 p-16 flex flex-col justify-between border-r border-zinc-900 relative overflow-hidden">
                   <div className="absolute top-0 left-0 p-10 opacity-5 pointer-events-none"><Zap size={400} /></div>
                   <div className="relative z-10">
                      <div className="bg-red-600 text-white font-black oswald text-[120px] leading-none px-10 py-6 rounded-[4rem] shadow-2xl shadow-red-600/30 w-fit mb-10 transform -rotate-3">#{activePilot.number}</div>
                      <h2 className="text-6xl font-black oswald uppercase text-white tracking-tighter mb-4 leading-none">{activePilot.name}</h2>
                      <p className="text-red-600 font-black uppercase text-xs tracking-[0.4em] mb-12">{activePilot.category}</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-zinc-400 font-bold uppercase text-[10px] tracking-widest bg-black/40 p-5 rounded-3xl border border-zinc-800/50">
                           <MapPin size={18} className="text-red-600" /> {activePilot.association}
                        </div>
                        <div className="flex items-center gap-4 text-zinc-400 font-bold uppercase text-[10px] tracking-widest bg-black/40 p-5 rounded-3xl border border-zinc-800/50">
                           <ShieldCheck size={18} className="text-emerald-500" /> Licencia: {activePilot.sportsLicense}
                        </div>
                      </div>
                   </div>
                   
                   <div className="mt-12 flex gap-4 relative z-10">
                      <button className="flex-grow bg-red-600 hover:bg-white hover:text-black text-white px-8 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-3">
                        <Activity size={18}/> Perfil Pro
                      </button>
                      <button className="bg-zinc-800 p-5 rounded-[2rem] text-white hover:bg-zinc-700 transition-colors"><Share2 size={20}/></button>
                   </div>
                </div>

                {/* Right Side: Detailed Stats */}
                <div className="flex-grow p-16 overflow-y-auto custom-scrollbar">
                   <h3 className="text-3xl font-black oswald uppercase text-white mb-10 border-b border-zinc-900 pb-6 flex items-center gap-4">
                     <Target className="text-red-600" size={28} /> Desempeño RMS 3.0
                   </h3>
                   
                   <div className="grid grid-cols-3 gap-6 mb-16">
                      {[
                        { l: 'Carreras', v: '42', i: Flag },
                        { l: 'Podios', v: '14', i: Award },
                        { l: 'Victorias', v: '6', i: Trophy },
                      ].map((s, i) => (
                        <div key={i} className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800 text-center hover:border-red-600/30 transition-all group">
                           <s.i size={28} className="mx-auto mb-4 text-zinc-700 group-hover:text-red-600 transition-colors" />
                           <p className="text-4xl font-black oswald text-white mb-1">{s.v}</p>
                           <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest">{s.l}</p>
                        </div>
                      ))}
                   </div>

                   <div className="space-y-10">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.4em] mb-6 flex items-center gap-2">
                           <Wrench size={14} className="text-red-600" /> Ficha Técnica del Kart
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-black/40 p-6 rounded-3xl border border-zinc-900">
                              <p className="text-[8px] font-bold text-zinc-700 uppercase mb-2 tracking-widest">Motorista / Preparador</p>
                              <p className="text-lg font-black text-zinc-200 uppercase">{activePilot.engine || 'PENDIENTE'}</p>
                           </div>
                           <div className="bg-black/40 p-6 rounded-3xl border border-zinc-900">
                              <p className="text-[8px] font-bold text-zinc-700 uppercase mb-2 tracking-widest">Chasis</p>
                              <p className="text-lg font-black text-zinc-200 uppercase">{activePilot.chassis || 'PENDIENTE'}</p>
                           </div>
                        </div>
                      </div>

                      <div className="bg-red-600/5 border border-red-600/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Trophy size={120} /></div>
                        <h4 className="text-lg font-black oswald uppercase text-white mb-4 italic">Veredicto de Comisariato</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                          "Piloto de estilo agresivo pero técnico. Destaca en trazados de tierra compactada con baja humedad. Su ranking actual refleja una progresión constante en las últimas 3 fechas."
                        </p>
                        <div className="mt-6 flex items-center gap-2">
                           <div className="h-1 flex-grow bg-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-red-600 w-[72%]"></div>
                           </div>
                           <span className="mono text-[10px] font-bold text-red-600 uppercase">Power: 72%</span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {filteredPilots.length === 0 && (
          <div className="py-60 text-center bg-zinc-900/10 rounded-[4rem] border-2 border-dashed border-zinc-900 animate-in fade-in duration-700">
             <div className="bg-zinc-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 border border-zinc-800 shadow-2xl">
                <Users className="text-zinc-700" size={48} />
             </div>
             <h2 className="text-3xl font-black uppercase oswald text-zinc-700 tracking-[0.4em] mb-4 italic">Zona de Boxes Vacía</h2>
             <p className="text-zinc-800 mono text-sm font-bold uppercase">Sin registros detectados para los filtros actuales</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pilotos;
