
import React, { useState, useEffect } from 'react';
import { Radio, Zap, Target, Activity, MessageSquare, Timer, Sparkles, Loader2, Flag, Monitor, Signal } from 'lucide-react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';

const LiveCenter: React.FC = () => {
  const [liveData, setLiveData] = useState<any>(storageService.getLiveTiming());
  const [spotterAdvice, setSpotterAdvice] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedPilotId, setSelectedPilotId] = useState<string>('');

  useEffect(() => {
    const refresh = () => {
      const data = storageService.getLiveTiming();
      setLiveData(data);
    };
    refresh();
    const unsubscribe = storageService.subscribe(refresh);
    return () => unsubscribe();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSpotterRequest = async () => {
    if (!selectedPilotId || !liveData.pilots[selectedPilotId]) return;
    setIsThinking(true);
    try {
      const advice = await aiService.getSpotterAdvice(
        liveData.pilots[selectedPilotId],
        Object.values(liveData.pilots)[0],
        { track: "Circuito KDO Oficial", flag: liveData.flag }
      );
      setSpotterAdvice(advice);
    } catch (e) {
      setSpotterAdvice("Error en enlace satelital.");
    } finally {
      setIsThinking(false);
    }
  };

  const sortedPilots = Object.entries(liveData.pilots || {})
    .sort(([, a]: any, [, b]: any) => b.laps - a.laps || parseFloat(a.best === '-' ? '999' : a.best) - parseFloat(b.best === '-' ? '999' : b.best));

  const trackColor = 
    liveData.flag === 'Roja' ? 'border-red-600' : 
    liveData.flag === 'Amarilla' ? 'border-yellow-500' : 
    'border-emerald-500';

  return (
    <div className={`min-h-screen bg-black transition-colors duration-1000 p-4 md:p-10 font-mono ${liveData.flag === 'Roja' ? 'bg-red-950/20' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-stretch gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${liveData.active ? 'bg-emerald-500' : 'bg-red-600'}`}></div>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">RMS Live-Link Broadcast</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic oswald uppercase text-white tracking-tighter leading-none">
              Live <span className="text-cyan-500">Center</span>
            </h1>
            <div className="flex items-center gap-4">
               <span className="text-zinc-700 text-[10px] font-black uppercase tracking-widest border-l border-zinc-800 pl-4">KDO System 1.0</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
             <div className={`bg-zinc-900 border-l-4 ${trackColor} p-6 flex flex-col justify-center min-w-[220px]`}>
                <p className="text-[9px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Estado de Pista</p>
                <div className="flex items-center gap-3">
                   <Flag size={20} className={liveData.flag === 'Verde' ? 'text-emerald-500' : 'text-red-500'} />
                   <span className="text-3xl font-black oswald uppercase text-white">{liveData.flag || 'S/D'}</span>
                </div>
             </div>
             <div className="bg-zinc-900 border-l-4 border-cyan-500 p-6 flex flex-col justify-center min-w-[220px]">
                <p className="text-[9px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Reloj RMS</p>
                <p className="text-4xl font-black tabular-nums text-white oswald tracking-tighter">{formatTime(liveData.sessionTime || 0)}</p>
             </div>
             <div className="bg-zinc-900 border-l-4 border-zinc-700 p-6 flex flex-col justify-center min-w-[150px]">
                <p className="text-[9px] font-black uppercase text-zinc-500 mb-2 tracking-widest">Categoría</p>
                <p className="text-lg font-black oswald text-zinc-400 uppercase truncate max-w-[120px]">{liveData.category || 'Esperando...'}</p>
             </div>
          </div>
        </header>

        {sortedPilots.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center border-4 border-dashed border-zinc-900 rounded-[4rem] text-center">
             <Monitor size={80} className="text-zinc-800 mb-8 animate-pulse" />
             <h2 className="text-4xl font-black oswald text-zinc-700 uppercase tracking-tighter">Sin actividad en pista</h2>
             <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Sincronizando con la terminal KDO...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-9 bg-zinc-900/40 rounded-[3rem] border border-zinc-800 overflow-hidden shadow-2xl">
               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-zinc-900 sticky top-0 z-20">
                        <tr className="text-[10px] font-black uppercase text-zinc-500 border-b border-zinc-800">
                           <th className="p-6 w-12 text-center">Pos</th>
                           <th className="p-6 w-16 text-center">No</th>
                           <th className="p-6">Piloto</th>
                           <th className="p-6 text-center">Lap</th>
                           <th className="p-6 text-center">Última</th>
                           <th className="p-6 text-center bg-zinc-950/30">Mejor</th>
                           <th className="p-6 text-center">S1</th>
                           <th className="p-6 text-center">S2</th>
                           <th className="p-6 text-center">S3</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-800">
                        {sortedPilots.map(([id, p]: any, i) => (
                          <tr key={id} className="hover:bg-white/5 transition-all group">
                             <td className="p-6 text-center font-black oswald text-2xl text-zinc-700">P{i+1}</td>
                             <td className="p-6 text-center font-black oswald text-3xl text-red-600 italic">#{p.number}</td>
                             <td className="p-6">
                                <p className="text-white font-black uppercase text-sm tracking-tight">{p.name}</p>
                                <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">KDO ID: {p.transponderId}</p>
                             </td>
                             <td className="p-6 text-center tabular-nums font-black text-xl text-zinc-500">{p.laps}</td>
                             <td className="p-6 text-center tabular-nums text-white font-bold">{p.last}</td>
                             <td className="p-6 text-center bg-zinc-950/20 tabular-nums">
                                <span className="font-black text-lg text-emerald-500">{p.best}</span>
                             </td>
                             <td className="p-6 text-center tabular-nums text-zinc-600 text-xs">{p.s1}</td>
                             <td className="p-6 text-center tabular-nums text-zinc-600 text-xs">{p.s2}</td>
                             <td className="p-6 text-center tabular-nums text-zinc-600 text-xs">{p.s3}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="xl:col-span-3 space-y-6">
               <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] relative overflow-hidden group">
                  <h3 className="text-xl font-black oswald uppercase text-white mb-6 flex items-center gap-3">
                     <Target className="text-cyan-500" /> AI Spotter
                  </h3>
                  <div className="space-y-4 relative z-10">
                     <select 
                        value={selectedPilotId}
                        onChange={(e) => setSelectedPilotId(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white font-black oswald uppercase text-sm outline-none focus:border-cyan-500"
                     >
                        <option value="">-- SELECCIONA PILOTO --</option>
                        {sortedPilots.map(([id, p]: any) => (
                          <option key={id} value={id}>#{p.number} - {p.name}</option>
                        ))}
                     </select>
                     <button 
                        onClick={handleSpotterRequest}
                        disabled={isThinking || !selectedPilotId}
                        className="w-full bg-cyan-600 hover:bg-white hover:text-black text-black font-black uppercase py-4 rounded-xl text-[10px] tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                        {isThinking ? <Loader2 className="animate-spin" size={16}/> : <Radio size={16} />}
                        CONECTAR RADIO
                     </button>
                     {spotterAdvice && (
                       <div className="bg-black/50 p-6 rounded-2xl border border-cyan-500/30 animate-in slide-in-from-top-4">
                          <p className="text-[10px] font-black uppercase text-cyan-500 mb-2 flex items-center gap-2">
                             <MessageSquare size={12}/> Radio:
                          </p>
                          <p className="text-zinc-400 italic text-xs leading-relaxed font-medium">"{spotterAdvice}"</p>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCenter;
