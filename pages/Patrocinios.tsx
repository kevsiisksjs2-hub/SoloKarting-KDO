
import React, { useState, useEffect } from 'react';
import { Briefcase, Target, DollarSign, Presentation, Sparkles, FileText, Share2, TrendingUp, Building2, Download, Star, Award, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Pilot } from '../types';

const Patrocinios: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [selectedPilot, setSelectedPilot] = useState<string>('');
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [pitch, setPitch] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setPilots(storageService.getPilots());
  }, []);

  const handleGeneratePitch = async () => {
    const pilot = pilots.find(p => p.id === selectedPilot);
    if (!pilot || !targetCompany || !budget) return;

    setIsGenerating(true);
    try {
      const result = await aiService.generateSponsorshipPitch(
        pilot.name,
        pilot.category,
        pilot.ranking,
        targetCompany,
        budget
      );
      setPitch(result);
    } catch (e) {
      alert("Error al generar la propuesta.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedPilotData = pilots.find(p => p.id === selectedPilot);

  return (
    <div className="bg-zinc-950 min-h-screen py-20 racing-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-4 animate-in fade-in duration-700">
            <div className="w-12 h-1 bg-[#D4AF37]"></div>
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em]">Marketing & Business Elite</span>
          </div>
          <h1 className="text-7xl font-black italic oswald uppercase text-white tracking-tighter mb-4 leading-none">
            Sponsor <span className="text-[#D4AF37]">Connect</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl font-medium italic">Transforma tus victorias en acuerdos comerciales. El motor de búsqueda de patrocinio impulsado por IA.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Panel de Configuración */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Briefcase size={120} /></div>
              
              <h3 className="text-2xl font-black oswald uppercase text-white mb-8 flex items-center gap-3">
                <Target className="text-[#D4AF37]" /> Configurar Pitch
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Seleccionar Piloto</label>
                  <select 
                    value={selectedPilot}
                    onChange={(e) => setSelectedPilot(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-black oswald text-xl outline-none focus:border-[#D4AF37] appearance-none"
                  >
                    <option value="">-- ELIGE UN PILOTO --</option>
                    {pilots.map(p => (
                      <option key={p.id} value={p.id}>#{p.number} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Empresa Objetivo</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input 
                      type="text" 
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      placeholder="Ej: Taller Mecánico 'García'..."
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-5 pl-14 text-white font-bold placeholder:text-zinc-800 outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Presupuesto Sugerido</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input 
                      type="text" 
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Ej: $200.000 por carrera..."
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-5 pl-14 text-white font-bold placeholder:text-zinc-800 outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleGeneratePitch}
                  disabled={isGenerating || !selectedPilot || !targetCompany}
                  className="w-full bg-[#D4AF37] hover:bg-white text-black font-black uppercase py-6 rounded-2xl text-[11px] tracking-[0.2em] transition-all shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  GENERAR PROPUESTA COMERCIAL
                </button>
              </div>
            </div>

            {/* ROI Metrics Card */}
            <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden group">
               <TrendingUp className="absolute -right-4 -bottom-4 text-[#D4AF37]/5 group-hover:scale-110 transition-transform" size={180} />
               <h4 className="text-xl font-black oswald uppercase text-white mb-6">Métricas de Retorno (ROI)</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-5 rounded-3xl border border-zinc-800">
                     <p className="text-[8px] font-black text-zinc-600 uppercase mb-2">Impactos Mensuales</p>
                     <p className="text-3xl font-black oswald text-white">4.5k+</p>
                  </div>
                  <div className="bg-black/40 p-5 rounded-3xl border border-zinc-800">
                     <p className="text-[8px] font-black text-zinc-600 uppercase mb-2">Seguidores Promedio</p>
                     <p className="text-3xl font-black oswald text-white">1.2k</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Panel de Visualización / Propuesta */}
          <div className="lg:col-span-7">
            {pitch ? (
              <div className="bg-white text-black p-16 rounded-[4rem] shadow-[0_0_100px_rgba(212,175,55,0.2)] animate-in slide-in-from-right-12 duration-700 relative">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Presentation size={300} /></div>
                
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <div className="bg-black text-white px-4 py-1 font-black oswald uppercase text-[10px] w-fit rounded mb-4">CONFIDENCIAL</div>
                      <h2 className="text-5xl font-black oswald uppercase leading-none">PROPUESTA <br /><span className="text-[#D4AF37]">COMERCIAL</span></h2>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-zinc-400">Fecha de Emisión</p>
                      <p className="font-bold">{new Date().toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="prose prose-zinc max-w-none text-zinc-700 font-medium leading-relaxed italic mb-12">
                   {pitch.split('\n').map((para, i) => <p key={i} className="mb-4">{para}</p>)}
                </div>

                <div className="border-t-2 border-zinc-100 pt-10 flex flex-wrap gap-4 items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-black oswald text-xl">#{selectedPilotData?.number}</div>
                      <div>
                         <p className="font-black uppercase text-sm leading-none">{selectedPilotData?.name}</p>
                         <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{selectedPilotData?.category}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="bg-zinc-100 p-4 rounded-2xl text-zinc-400 hover:text-black transition-colors"><Download size={20} /></button>
                      <button className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                         <Share2 size={16} /> Compartir Propuesta
                      </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] border-4 border-dashed border-zinc-800 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 animate-in fade-in">
                 <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mb-10 border border-zinc-800">
                    <FileText size={48} className="text-zinc-700" />
                 </div>
                 <h3 className="text-3xl font-black oswald uppercase text-zinc-700 tracking-tighter italic mb-4">Vista Previa del Portafolio</h3>
                 <p className="text-zinc-800 font-bold uppercase text-[10px] tracking-[0.3em] max-w-xs leading-loose">
                   Completa los datos del piloto y la empresa para que nuestra IA redacte la mejor estrategia de cierre comercial.
                 </p>
              </div>
            )}
          </div>

        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { t: 'Visibilidad Web', d: 'Apareces en el ranking oficial consultado por miles de personas cada semana.', i: TrendingUp },
             { t: 'Branding RMS', d: 'Tu logo institucional en la plataforma líder del karting en tierra.', i: Star },
             { t: 'Cierre de Tratos', d: 'Propuestas escritas por IA que resaltan tus valores deportivos.', i: Award }
           ].map((f, i) => (
             <div key={i} className="bg-zinc-900/30 p-10 rounded-[2.5rem] border border-zinc-800/50 hover:border-[#D4AF37]/30 transition-all group">
                <f.i className="text-zinc-700 group-hover:text-[#D4AF37] transition-colors mb-6" size={32} />
                <h4 className="text-lg font-black oswald uppercase text-white mb-4">{f.t}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.d}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Patrocinios;
