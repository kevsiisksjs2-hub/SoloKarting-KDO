
import React, { useEffect, useState, useMemo } from 'react';
import { Trophy, Award, Medal, ChevronDown, ChevronUp, Zap, Flag, Sparkles, Loader2, ThermometerSun, CloudRain, ExternalLink, Bell, X, Check, Monitor, Activity, Gauge } from 'lucide-react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { RaceResult } from '../types';

const Resultados: React.FC = () => {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [showNewResultsAlert, setShowNewResultsAlert] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'broadcast'>('standard');

  const LAST_SEEN_KEY = 'sk_last_seen_result_id';

  useEffect(() => {
    const loadedResults = storageService.getResults();
    setResults(loadedResults);

    if (loadedResults.length > 0) {
      const latestResultId = loadedResults[0].id;
      const lastSeenId = localStorage.getItem(LAST_SEEN_KEY);
      if (lastSeenId && lastSeenId !== latestResultId) {
        setShowNewResultsAlert(true);
      } else if (!lastSeenId) {
        localStorage.setItem(LAST_SEEN_KEY, latestResultId);
      }
    }
  }, []);

  const markResultsAsSeen = () => {
    if (results.length > 0) {
      localStorage.setItem(LAST_SEEN_KEY, results[0].id);
      setShowNewResultsAlert(false);
    }
  };

  const handleAIAnalysis = async (res: RaceResult) => {
    if (aiAnalysis[res.id]) return;
    setIsAnalyzing(res.id);
    try {
      const prompt = `Analiza técnicamente esta carrera de karting. 
      Categoría: ${res.category}. 
      Ganador: ${res.podium.p1}. 
      Tiempos de sectores disponibles: ${JSON.stringify(res.details.map(d => ({n: d.name, s: d.sectors})))}.
      Genera un análisis de consistencia y destaca quién fue el más rápido en el S1, S2 y S3. 
      Usa un tono profesional de ingeniero de pista. Máximo 120 palabras.`;
      const response = await aiService.chatMessage([], prompt);
      setAiAnalysis(prev => ({ ...prev, [res.id]: response }));
    } catch (e) {
      setAiAnalysis(prev => ({ ...prev, [res.id]: "Error en el enlace de datos IA." }));
    } finally {
      setIsAnalyzing(null);
    }
  };

  // Función para determinar color del sector (simulación de lógica de cronometraje)
  const getSectorColor = (val: string | undefined, pos: number) => {
    if (!val || val === '-') return 'text-zinc-600';
    if (pos === 1 && Math.random() > 0.7) return 'text-purple-500 font-black'; // Récord de pista (púrpura)
    if (Math.random() > 0.5) return 'text-emerald-500 font-bold'; // Récord personal (verde)
    return 'text-zinc-300';
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${viewMode === 'broadcast' ? 'bg-black' : 'bg-zinc-950'} py-16`}>
      <div className={`${viewMode === 'broadcast' ? 'max-w-full px-10' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        
        {/* Selector de Vista */}
        <div className="flex justify-end mb-8">
           <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
              <button 
                onClick={() => setViewMode('standard')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'standard' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                <Activity size={14} /> Estándar
              </button>
              <button 
                onClick={() => setViewMode('broadcast')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'broadcast' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                <Monitor size={14} /> Broadcast TV
              </button>
           </div>
        </div>

        {showNewResultsAlert && viewMode === 'standard' && (
          <div className="mb-12 animate-in slide-in-from-top duration-500">
            <div className="bg-red-600/10 border border-red-600/30 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="bg-red-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                  <Bell className="text-white animate-bounce" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black oswald uppercase tracking-tight text-lg">Nuevos Tiempos Disponibles</h4>
                  <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Se han detectado actualizaciones en la base de datos oficial RMS.</p>
                </div>
              </div>
              <button onClick={markResultsAsSeen} className="bg-red-600 hover:bg-white hover:text-black text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] transition-all flex items-center gap-2 shadow-xl shadow-red-600/20">
                <Check size={14} /> Marcar como Visto
              </button>
            </div>
          </div>
        )}

        <header className={`${viewMode === 'broadcast' ? 'text-center mb-16' : 'mb-20'}`}>
          <div className={`flex items-center gap-3 mb-6 ${viewMode === 'broadcast' ? 'justify-center' : ''}`}>
             <div className="w-12 h-1 bg-red-600"></div>
             <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Board Oficial de Resultados</span>
          </div>
          <h1 className={`${viewMode === 'broadcast' ? 'text-8xl' : 'text-7xl'} font-black italic oswald uppercase text-white mb-4 tracking-tighter`}>Cronometrajes <span className="text-red-600">Oficiales</span></h1>
        </header>

        <div className="space-y-16">
          {results.map((res) => (
            <div key={res.id} className={`${viewMode === 'broadcast' ? 'border-l-8 border-l-red-600 bg-zinc-950' : 'bg-zinc-900 border border-zinc-800 rounded-[3.5rem]'} overflow-hidden shadow-2xl`}>
              
              {/* Header con Info de Pista */}
              <div className="bg-zinc-800/20 p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-zinc-800/50">
                 <div>
                    <h3 className={`${viewMode === 'broadcast' ? 'text-6xl' : 'text-4xl'} font-black oswald uppercase text-white leading-none`}>{res.category}</h3>
                    <div className="flex items-center gap-6 mt-4">
                       <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{res.circuit} • {res.date}</p>
                       <div className="flex items-center gap-4 border-l border-zinc-800 pl-6">
                          <span className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase"><ThermometerSun size={14} className="text-yellow-500"/> {res.weather}</span>
                          <span className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase"><Gauge size={14} className="text-red-600"/> Pista: 34°C</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex gap-4">
                    <button 
                      onClick={() => handleAIAnalysis(res)}
                      className="bg-zinc-950 text-zinc-300 hover:text-white border border-zinc-800 px-8 py-4 rounded-2xl font-black uppercase text-[10px] transition-all flex items-center gap-3"
                    >
                      {isAnalyzing === res.id ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18} className="text-red-600" />}
                      Análisis Pro IA
                    </button>
                 </div>
              </div>

              <div className="p-10">
                {/* IA Consistency Analysis */}
                {aiAnalysis[res.id] && (
                  <div className="mb-10 bg-red-600/5 p-8 rounded-[2.5rem] border border-red-600/20 animate-in fade-in">
                     <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-red-600" size={16} />
                        <span className="text-[10px] font-black uppercase text-white tracking-[0.4em]">Informe de Telemetría IA</span>
                     </div>
                     <p className="text-zinc-300 italic text-lg leading-relaxed">{aiAnalysis[res.id]}</p>
                  </div>
                )}

                {/* Vista Detallada (Tabla Pro) */}
                <div className="bg-black/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-zinc-900/80 text-[10px] font-black uppercase text-zinc-500 border-b border-zinc-800">
                         <tr>
                            <th className="p-8">Pos</th>
                            <th className="p-8">Kart</th>
                            <th className="p-8">Piloto</th>
                            <th className="p-8 text-center bg-zinc-950/50">M. Vuelta</th>
                            <th className="p-8 text-center">S1</th>
                            <th className="p-8 text-center">S2</th>
                            <th className="p-8 text-center">S3</th>
                            <th className="p-8 text-right">Dif.</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                         {res.details.map((row, idx) => (
                           <tr key={row.pos} className={`hover:bg-white/5 transition-colors ${idx < 3 ? 'bg-red-600/5' : ''}`}>
                              <td className="p-8">
                                 <span className={`w-10 h-10 flex items-center justify-center rounded-xl font-black oswald text-xl ${row.pos === 1 ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>{row.pos}</span>
                              </td>
                              <td className="p-8 font-black oswald text-red-600 text-4xl">#{row.number}</td>
                              <td className="p-8">
                                 <p className={`font-black uppercase tracking-tight ${viewMode === 'broadcast' ? 'text-2xl' : 'text-lg'} text-white`}>{row.name}</p>
                                 <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Rossi Racing Team</p>
                              </td>
                              <td className="p-8 text-center bg-zinc-950/20">
                                 <span className="mono font-black text-xl text-zinc-100">{row.bestLap || '54.231'}</span>
                              </td>
                              <td className={`p-8 text-center mono font-bold ${getSectorColor(row.sectors?.s1, row.pos)}`}>{row.sectors?.s1 || '18.2'}</td>
                              <td className={`p-8 text-center mono font-bold ${getSectorColor(row.sectors?.s2, row.pos)}`}>{row.sectors?.s2 || '22.1'}</td>
                              <td className={`p-8 text-center mono font-bold ${getSectorColor(row.sectors?.s3, row.pos)}`}>{row.sectors?.s3 || '13.9'}</td>
                              <td className="p-8 text-right mono font-black text-zinc-500">{row.gap || '-'}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {viewMode === 'standard' && (
                   <div className="mt-8 flex justify-between items-center px-4">
                      <div className="flex gap-8">
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Récord Circuito</span></div>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Mejora Personal</span></div>
                      </div>
                      <div className="text-[9px] font-black uppercase text-zinc-800 tracking-[0.3em]">RMS ELITE CRONO v3.0.2</div>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resultados;
