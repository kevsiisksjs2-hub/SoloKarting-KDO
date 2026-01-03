
import React, { useState, useEffect } from 'react';
import { Wrench, Shield, Zap, AlertTriangle, CheckCircle2, History, Plus, Microscope, Gauge, Settings, PenTool, Database, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Pilot } from '../types';

const Logbook: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [selectedPilot, setSelectedPilot] = useState<string>('');
  const [engineHours, setEngineHours] = useState<number>(12.5);
  const [lastService, setLastService] = useState<string>('Cambio de aros y bruñido de cilindro');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setPilots(storageService.getPilots());
  }, []);

  const handleAskIA = async () => {
    const pilot = pilots.find(p => p.id === selectedPilot);
    if (!pilot) return;
    
    setIsThinking(true);
    try {
      const advice = await aiService.getMaintenanceAdvice(engineHours, pilot.category, lastService);
      setAiAdvice(advice);
    } catch (e) {
      setAiAdvice("Error al conectar con el Ingeniero de Taller.");
    } finally {
      setIsThinking(false);
    }
  };

  const selectedPilotData = pilots.find(p => p.id === selectedPilot);

  return (
    <div className="bg-zinc-950 min-h-screen py-20 racing-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-1 bg-blue-600"></div>
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Taller & Mantenimiento Pro</span>
          </div>
          <h1 className="text-7xl font-black italic oswald uppercase text-white tracking-tighter mb-4 leading-none">
            Mi <span className="text-blue-600">Garage</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl font-medium italic">Control total de tu máquina. Registra cada service y monitorea la vida útil de tus componentes.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Panel de Control de Motor */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <Settings className="absolute -right-4 -bottom-4 text-zinc-800/20 group-hover:text-blue-600/10 transition-colors" size={200} />
               
               <h3 className="text-2xl font-black oswald uppercase text-white mb-8 flex items-center gap-3">
                 <Wrench className="text-blue-600" /> Estado del Motor
               </h3>

               <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Identificar Piloto</label>
                    <select 
                      value={selectedPilot}
                      onChange={(e) => setSelectedPilot(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-black oswald text-xl outline-none focus:border-blue-600 appearance-none"
                    >
                      <option value="">-- ELIGE TU PERFIL --</option>
                      {pilots.map(p => (
                        <option key={p.id} value={p.id}>#{p.number} - {p.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedPilotData && (
                    <div className="animate-in fade-in slide-in-from-top-4">
                       <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
                             <p className="text-[9px] font-black text-zinc-600 uppercase mb-2">Horas de Uso</p>
                             <div className="flex items-end gap-2">
                                <input 
                                  type="number" 
                                  value={engineHours}
                                  onChange={(e) => setEngineHours(Number(e.target.value))}
                                  className="bg-transparent text-4xl font-black oswald text-white outline-none w-20"
                                />
                                <span className="text-zinc-700 font-bold mb-1">hrs</span>
                             </div>
                          </div>
                          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
                             <p className="text-[9px] font-black text-zinc-600 uppercase mb-2">Vida Útil (Est.)</p>
                             <p className={`text-4xl font-black oswald ${engineHours > 15 ? 'text-red-600' : 'text-emerald-500'}`}>
                                {Math.max(0, 100 - (engineHours * 5))}%
                             </p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest ml-2">Última Intervención</label>
                          <textarea 
                            value={lastService}
                            onChange={(e) => setLastService(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-zinc-300 font-medium text-xs h-24 outline-none focus:border-blue-600 resize-none"
                          />
                       </div>

                       <button 
                        onClick={handleAskIA}
                        disabled={isThinking}
                        className="w-full mt-6 bg-blue-600 hover:bg-white hover:text-black text-white font-black uppercase py-5 rounded-2xl text-[10px] tracking-widest transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                          {isThinking ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16} />}
                          ANALIZAR MANTENIMIENTO CON IA
                       </button>
                    </div>
                  )}
               </div>
            </div>

            {/* Alerta de Seguridad (Precintos) */}
            <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black oswald uppercase text-white flex items-center gap-3">
                    <Shield className="text-emerald-500" /> Pasaporte Técnico
                  </h3>
                  <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">VALIDADO</div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                     <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Precinto Motor #1</span>
                     <span className="text-white font-black mono text-xs">KDO-44921-A</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                     <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Ficha Técnica Chasis</span>
                     <span className="text-emerald-500 font-black uppercase text-[10px]">Sin Observaciones</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Historial y Recomendaciones */}
          <div className="lg:col-span-7 space-y-8">
            {aiAdvice ? (
              <div className="bg-blue-600 rounded-[3.5rem] p-12 text-white animate-in slide-in-from-right-12 duration-700 relative overflow-hidden">
                 <Sparkles className="absolute -right-8 -top-8 text-white/10" size={240} />
                 <h3 className="text-3xl font-black oswald uppercase mb-8 flex items-center gap-3">
                   Veredicto del <span className="text-black italic">Ingeniero IA</span>
                 </h3>
                 <div className="prose prose-invert max-w-none text-blue-50 font-medium italic text-lg leading-relaxed mb-8">
                    {aiAdvice.split('\n').map((para, i) => <p key={i} className="mb-2">{para}</p>)}
                 </div>
                 <div className="bg-black/20 p-6 rounded-[2rem] border border-white/10 flex items-center gap-4">
                    <AlertTriangle className="text-yellow-400" size={24} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Atención: No exceder las 20 horas sin revisión completa de biela.</p>
                 </div>
                 <button onClick={() => setAiAdvice(null)} className="mt-8 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <History size={14} /> Nueva Consulta
                 </button>
              </div>
            ) : (
              <div className="bg-zinc-900/40 border-4 border-dashed border-zinc-800 rounded-[4rem] flex flex-col items-center justify-center text-center p-20 h-full min-h-[500px]">
                 <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-zinc-800">
                    <Microscope size={48} className="text-zinc-700" />
                 </div>
                 <h4 className="text-2xl font-black oswald uppercase text-zinc-700 mb-2">Diagnóstico Preventivo</h4>
                 <p className="text-zinc-800 font-black uppercase text-[9px] tracking-[0.3em] max-w-xs leading-loose">
                    Selecciona tu perfil y carga las horas del motor para recibir un informe detallado sobre el estado de tus componentes.
                 </p>
              </div>
            )}

            {/* Manual Setup Log (No Telemetría) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[3.5rem] p-12 relative group">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black oswald uppercase text-white flex items-center gap-3">
                    <PenTool className="text-zinc-500" /> Libreta de Setup (Manual)
                  </h3>
                  <button className="bg-zinc-800 hover:bg-white hover:text-black text-zinc-400 p-3 rounded-2xl transition-all">
                    <Plus size={20} />
                  </button>
               </div>
               <div className="space-y-4">
                  {[
                    { date: '12 Oct 2024', circuit: 'Chivilcoy', note: 'Corona 78, Aguja en 2da ranura, Chicler 114. Mucho grip en pista.', type: 'Setup Seco' },
                    { date: '05 Sep 2024', circuit: 'Zárate', note: 'Relación 12:80. Eje duro. Mejor tiempo: 52.4s.', type: 'Entrenamiento' },
                  ].map((log, i) => (
                    <div key={i} className="p-6 bg-zinc-950 rounded-[2rem] border border-zinc-800/50 hover:border-zinc-700 transition-all group/log">
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{log.type}</span>
                          <span className="text-zinc-600 text-[10px] font-bold">{log.date}</span>
                       </div>
                       <p className="text-white font-black oswald text-xl uppercase mb-1 tracking-tight">{log.circuit}</p>
                       <p className="text-zinc-500 text-xs italic font-medium leading-relaxed">"{log.note}"</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>

        {/* Mantenimiento de Repuestos View */}
        <div className="mt-32">
           <div className="flex items-center gap-4 mb-10">
              <Database className="text-zinc-500" />
              <h3 className="text-4xl font-black oswald uppercase text-white italic">Inventario de <span className="text-blue-600">Ciclos</span></h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { part: 'Cubiertas (Tierra)', status: '50%', color: 'bg-yellow-500', icon: Gauge, detail: '4 Ciclos de calor' },
                { part: 'Cadena DID', status: '85%', color: 'bg-emerald-500', icon: Zap, detail: 'Nueva hace 2 fechas' },
                { part: 'Frenos (Pastillas)', status: '20%', color: 'bg-red-600', icon: AlertTriangle, detail: 'Cambio Urgente' },
              ].map((p, i) => (
                <div key={i} className="bg-zinc-900/30 p-8 rounded-[2.5rem] border border-zinc-800 hover:border-zinc-700 transition-all">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">{p.part}</p>
                   <div className="flex items-center justify-between mb-4">
                      <p className="text-3xl font-black oswald text-white">{p.status}</p>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase">{p.detail}</p>
                   </div>
                   <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                      <div className={`h-full ${p.color}`} style={{ width: p.status }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Logbook;
