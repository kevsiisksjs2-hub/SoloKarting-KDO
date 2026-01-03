
import React, { useState, useEffect } from 'react';
import { Gauge, Zap, Activity, Cpu, Thermometer, Wind, Droplets, Target, Sparkles, BarChart3, ChevronRight, Search, Microscope, Scale, Fuel, AlertCircle, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';

const Telemetria: React.FC = () => {
  const [trackInfo, setTrackInfo] = useState(storageService.getTrackInfo());
  const [setupQuery, setSetupQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Estados para Calculadoras
  const [pilotWeight, setPilotWeight] = useState<number>(0);
  const [minWeight, setMinWeight] = useState<number>(150);
  const [lastre, setLastre] = useState<number | null>(null);

  const [fuelLiters, setFuelLiters] = useState<number>(0);
  const [lapsCount, setLapsCount] = useState<number>(12);
  const [fuelStrategy, setFuelStrategy] = useState<string | null>(null);

  const telemetryData = [
    { label: 'Temp. Ambiente', val: trackInfo.temp, icon: Thermometer, color: 'text-red-500' },
    { label: 'Temp. Pista', val: trackInfo.trackTemp, icon: Zap, color: 'text-yellow-500' },
    { label: 'Humedad', val: trackInfo.humidity, icon: Droplets, color: 'text-blue-500' },
    { label: 'Presión Atm.', val: '1013 hPa', icon: Gauge, color: 'text-emerald-500' },
  ];

  const handleCalculateLastre = () => {
    if (pilotWeight > 0) {
      const res = minWeight - pilotWeight;
      setLastre(res > 0 ? res : 0);
    }
  };

  const handleCalculateFuel = () => {
    if (fuelLiters > 0) {
      const total = fuelLiters * lapsCount * 1.1; // 10% margen de seguridad
      setFuelStrategy(`Necesitas aproximadamente ${total.toFixed(2)} litros para completar las ${lapsCount} vueltas con reserva de seguridad.`);
    }
  };

  const handleAskIA = async () => {
    if (!setupQuery.trim()) return;
    setIsThinking(true);
    try {
      const response = await aiService.getTechnicalSetup(setupQuery, trackInfo);
      setAiResponse(response);
    } catch (e) {
      setAiResponse("No pude conectar con el ingeniero de pista. Reintenta.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-20 racing-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-1 bg-red-600"></div>
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Ingeniería de Pista RMS</span>
          </div>
          <h1 className="text-7xl font-black italic oswald uppercase text-white tracking-tighter mb-4">
            Telemetría <span className="text-red-600">Advanced</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {telemetryData.map((d, i) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-zinc-900 group hover:border-red-600/30 transition-all">
                  <d.icon size={24} className={`${d.color} mb-4`} />
                  <p className="text-4xl font-black oswald text-white mb-1 tracking-tighter">{d.val}</p>
                  <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">{d.label}</p>
                </div>
              ))}
            </div>

            {/* Módulo de Estrategia Pro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Calculadora de Lastre */}
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-10 relative overflow-hidden group">
                  <Scale className="absolute right-8 top-8 text-zinc-800 group-hover:text-red-600 transition-colors" size={48} />
                  <h3 className="text-2xl font-black oswald uppercase text-white mb-6">Calculadora de Lastre</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2 block">Peso Piloto + Kart (Kg)</label>
                        <input 
                          type="number" 
                          value={pilotWeight} 
                          onChange={(e) => setPilotWeight(Number(e.target.value))}
                          className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white font-black oswald text-xl outline-none focus:border-red-600"
                        />
                     </div>
                     <button 
                        onClick={handleCalculateLastre}
                        className="w-full bg-red-600 text-white font-black uppercase py-4 rounded-2xl text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
                     >
                        Calcular Necesidad
                     </button>
                     {lastre !== null && (
                        <div className="mt-4 p-4 bg-zinc-950 border border-emerald-500/30 rounded-2xl flex items-center justify-between animate-in fade-in">
                           <span className="text-zinc-500 text-[10px] font-black uppercase">Lastre Necesario:</span>
                           <span className="text-emerald-500 font-black oswald text-3xl">{lastre} Kg</span>
                        </div>
                     )}
                  </div>
               </div>

               {/* Calculadora de Combustible */}
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-10 relative overflow-hidden group">
                  <Fuel className="absolute right-8 top-8 text-zinc-800 group-hover:text-blue-600 transition-colors" size={48} />
                  <h3 className="text-2xl font-black oswald uppercase text-white mb-6">Estrategia Combustible</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2 block">Consumo por Vuelta (Lts)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={fuelLiters} 
                          onChange={(e) => setFuelLiters(Number(e.target.value))}
                          className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white font-black oswald text-xl outline-none focus:border-blue-600"
                        />
                     </div>
                     <button 
                        onClick={handleCalculateFuel}
                        className="w-full bg-blue-600 text-white font-black uppercase py-4 rounded-2xl text-[10px] tracking-widest hover:bg-white hover:text-black transition-all"
                     >
                        Planificar Carga
                     </button>
                     {fuelStrategy && (
                        <div className="mt-4 p-4 bg-zinc-950 border border-blue-500/30 rounded-2xl animate-in fade-in">
                           <p className="text-blue-400 text-[10px] font-medium leading-relaxed italic">{fuelStrategy}</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Comparativa de Sectores (Existing) */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-[3.5rem] p-12 relative overflow-hidden">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black oswald uppercase text-white flex items-center gap-3"><Activity className="text-red-600" /> Comparativa de Sectores</h3>
               </div>
               <div className="space-y-8">
                  {[
                    { s: 'Sector 1 (Curva del Molino)', your: '18.2s', target: '17.9s', color: 'bg-red-600', w: '92%' },
                    { s: 'Sector 2 (Recta Principal)', your: '22.1s', target: '22.0s', color: 'bg-emerald-500', w: '98%' },
                    { s: 'Sector 3 (Chicana de Boxes)', your: '13.9s', target: '13.5s', color: 'bg-yellow-500', w: '85%' },
                  ].map((sec, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white">{sec.s}</span>
                          <span className="text-zinc-500">{sec.your} <span className="text-zinc-700 ml-2">/ {sec.target}</span></span>
                       </div>
                       <div className="h-4 bg-black rounded-full overflow-hidden border border-zinc-800">
                          <div className={`h-full ${sec.color}`} style={{ width: sec.w }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* AI Engineering Side */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-red-600 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
               <Sparkles className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform" size={180} />
               <h3 className="text-3xl font-black oswald uppercase text-white mb-4 leading-none">Ingeniero <br />de Pista IA</h3>
               <textarea 
                  value={setupQuery}
                  onChange={(e) => setSetupQuery(e.target.value)}
                  placeholder="Ej: El kart se me va de trompa..."
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/40 outline-none focus:border-white transition-all h-32 mb-6"
               />
               <button onClick={handleAskIA} className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl text-[10px] tracking-widest flex items-center justify-center gap-3">
                 <Cpu size={16} /> OBTENER AJUSTE
               </button>
            </div>
            {aiResponse && (
               <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 animate-in fade-in">
                  <div className="prose prose-invert prose-xs text-zinc-400 font-medium italic">{aiResponse}</div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telemetria;
