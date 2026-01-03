
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { generatePilotsPDF } from '../utils/pdfGenerator';
import { Pilot, User, Status, Incident, AuditLog, NewsItem, Regulation } from '../types';
import { 
  Users, LogOut, Flag, Monitor, Satellite, 
  Play, Pause, Square as SquareIcon, Signal, Activity, 
  Search, Plus, Trash2, Edit3, FileText, RefreshCw, Wifi, Zap, Lock,
  Gavel, Newspaper, BookOpen, ClipboardList, AlertTriangle, CheckCircle, Clock, ShieldCheck, UserPlus, LogIn, ChevronRight, Cpu, Radio, Save as SaveIcon
} from 'lucide-react';

type Module = 'orbits' | 'inscriptos' | 'hardware' | 'sanciones' | 'novedades' | 'reglamentos' | 'auditoria';

interface TimingPilot {
  id: string;
  transponderId: string;
  name: string;
  number: string;
  category: string;
  laps: number;
  s1: string;
  s2: string;
  s3: string;
  last: string;
  best: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<Module>('inscriptos');
  const [trackFlag, setTrackFlag] = useState<string>(storageService.getTrackState());
  const [allPilots, setAllPilots] = useState<Pilot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(storageService.getCategories()[0]);
  const [maxLaps, setMaxLaps] = useState<number>(12);
  const [raceActive, setRaceActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  
  const [timingData, setTimingData] = useState<Record<string, TimingPilot>>({});
  const [detectedSensors, setDetectedSensors] = useState<string[]>([]); 

  const isCronomax = currentUser?.username === 'Cronomax';
  const hasManagementAccess = currentUser?.username !== 'Cronomax';

  useEffect(() => {
    const auth = storageService.getAuth();
    if (!auth) { navigate('/Administracion19216811'); return; }
    setCurrentUser(auth);

    if (auth.username === 'Cronomax') {
      setActiveModule('orbits');
    } else {
      setActiveModule('inscriptos');
    }

    const refreshData = () => {
      setAllPilots(storageService.getPilots());
      setTrackFlag(storageService.getTrackState());
    };

    refreshData();
    const unsubscribe = storageService.subscribe(refreshData);
    return () => unsubscribe();
  }, [navigate]);

  // BROADCAST: Transmitir datos de cronometraje al Live Center
  useEffect(() => {
    if (isCronomax) {
      storageService.setLiveTiming({
        active: raceActive,
        category: selectedCategory,
        sessionTime: sessionTime,
        pilots: timingData,
        maxLaps: maxLaps,
        flag: trackFlag
      });
    }
  }, [timingData, raceActive, sessionTime, trackFlag, selectedCategory, isCronomax, maxLaps]);

  // RELOJ RMS
  useEffect(() => {
    let interval: any;
    if (raceActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [raceActive]);

  // SIMULADOR DE PINGS DE SENSORES
  useEffect(() => {
    if (isCronomax && activeModule === 'orbits') {
      const interval = setInterval(() => {
        if (Math.random() > 0.85) {
          const newId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
          const isAssigned = (Object.values(timingData) as TimingPilot[]).some(p => p.transponderId === newId);
          if (!detectedSensors.includes(newId) && !isAssigned) {
            setDetectedSensors(prev => [newId, ...prev].slice(0, 5));
          }
        }
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isCronomax, activeModule, detectedSensors, timingData]);

  // MOTOR DE CARRERA (SIMULACIÓN DE PASOS POR ANTENA)
  useEffect(() => {
    let interval: any;
    if (isCronomax && raceActive) {
      interval = setInterval(() => {
        const activePilots = (Object.values(timingData) as TimingPilot[]).filter(p => p.laps < maxLaps);
        
        if (activePilots.length === 0 && Object.keys(timingData).length > 0) {
          handleFlagChange('Cuadriculada');
          setRaceActive(false);
          return;
        }

        if (activePilots.length > 0) {
          const pilot = activePilots[Math.floor(Math.random() * activePilots.length)];
          const antennas = ['S1', 'S2', 'S3'];
          const antenna = antennas[Math.floor(Math.random() * antennas.length)];
          const timeVal = (Math.random() * 2 + 15).toFixed(3);
          
          setTimingData(prev => {
            const current = prev[pilot.id];
            if (!current) return prev;
            
            if (antenna === 'S3') {
              const newLaps = current.laps + 1;
              const totalLap = (Math.random() * 2 + 52).toFixed(3);
              const isBest = current.best === '-' || parseFloat(totalLap) < parseFloat(current.best);
              return {
                ...prev,
                [pilot.id]: { ...current, laps: newLaps, s3: timeVal, last: totalLap, best: isBest ? totalLap : current.best }
              };
            } else {
              const key = antenna.toLowerCase() as keyof TimingPilot;
              return { ...prev, [pilot.id]: { ...current, [key]: timeVal } };
            }
          });
        }
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [raceActive, timingData, maxLaps, isCronomax]);

  const handleFlagChange = (flag: string) => {
    setTrackFlag(flag);
    storageService.setTrackState(flag);
  };

  const startRace = () => {
    if (Object.keys(timingData).length === 0) { alert("Asigne pilotos a la grilla."); return; }
    setRaceActive(true); 
    handleFlagChange('Verde');
  };

  const assignSensorToPilot = (transponderId: string, pilotData?: Pilot) => {
    let pilotName = pilotData?.name;
    let pilotNumber = pilotData?.number;
    let pilotId = pilotData?.id || `manual_${Date.now()}`;
    let pilotCategory = pilotData?.category || selectedCategory;

    if (!pilotData) {
      const numInput = prompt("Número de Kart:");
      if (numInput === null) return;
      pilotNumber = numInput || "0";
      const nameInput = prompt("Nombre Piloto:");
      if (nameInput === null) return;
      pilotName = (nameInput || "INVITADO").toUpperCase();
    }

    const newEntry: TimingPilot = {
      id: pilotId,
      transponderId,
      name: pilotName!,
      number: pilotNumber!,
      category: pilotCategory,
      laps: 0, s1: '-', s2: '-', s3: '-', last: '-', best: '-'
    };

    setTimingData(prev => ({ ...prev, [pilotId]: newEntry }));
    setDetectedSensors(prev => prev.filter(id => id !== transponderId));
  };

  const updatePilotTransponder = (pilotId: string, txId: string) => {
    const updated = allPilots.map(p => p.id === pilotId ? { ...p, transponderId: txId.toUpperCase() } : p);
    storageService.savePilots(updated);
    setAllPilots(updated);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-mono">
      <aside className="w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col z-50 shadow-2xl">
        <div className="p-8 border-b border-zinc-900 bg-zinc-900/10">
           <div className="bg-red-600 p-2 rounded italic font-black text-white text-2xl oswald mb-4 inline-block">
            KDO <span className="text-black bg-white px-1 rounded-sm">SYSTEM</span>
           </div>
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isCronomax ? 'bg-red-600 animate-pulse' : 'bg-blue-500'}`}></div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Terminal: {currentUser?.username || 'Admin'}
              </p>
           </div>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
           {isCronomax && (
             <div className="space-y-4 mb-6">
               <div>
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] px-6 mb-2">Operación de Pista</p>
                  <button onClick={() => setActiveModule('orbits')} className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeModule === 'orbits' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                    <Monitor size={14} /> Cronometraje
                  </button>
                  <button onClick={() => setActiveModule('hardware')} className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeModule === 'hardware' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                    <Satellite size={14} /> Antenas (S1-S3)
                  </button>
               </div>
               <div>
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] px-6 mb-2">Información</p>
                  <button onClick={() => setActiveModule('inscriptos')} className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeModule === 'inscriptos' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                    <Users size={14} /> Gestión Sensores
                  </button>
               </div>
             </div>
           )}

           {hasManagementAccess && (
             <div className="space-y-4">
               <div>
                  <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] px-6 mb-2">Comisariato Deportivo</p>
                  <button onClick={() => setActiveModule('inscriptos')} className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeModule === 'inscriptos' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                    <Users size={14} /> Pilotos
                  </button>
               </div>
             </div>
           )}
        </nav>

        <div className="p-6 border-t border-zinc-900 mt-auto">
           <button onClick={() => { storageService.setAuth(null); navigate('/Administracion19216811'); }} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-700 hover:text-red-500 font-bold uppercase text-[9px] tracking-widest transition-colors">
             <LogOut size={16} /> Salir
           </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col bg-zinc-950 overflow-hidden relative">
        {activeModule === 'orbits' && isCronomax && (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
             <div className="bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
               <div className="flex items-center gap-6">
                 <div className="space-y-1">
                   <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Categoría Activa</p>
                   <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-black border border-zinc-800 text-white font-black oswald uppercase text-lg px-4 py-2 rounded-lg outline-none focus:border-red-600"
                    >
                      {storageService.getCategories().map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 <div className="bg-black border border-zinc-800 p-4 rounded-xl min-w-[140px]">
                    <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">Reloj RMS</p>
                    <p className="text-4xl font-black tabular-nums text-cyan-400">{formatTime(sessionTime)}</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  {!raceActive ? (
                    <button onClick={startRace} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-lg shadow-emerald-600/20">
                      <Play size={20} fill="currentColor" /> Iniciar
                    </button>
                  ) : (
                    <button onClick={() => setRaceActive(false)} className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-3">
                      <Pause size={20} fill="currentColor" /> Pausar
                    </button>
                  )}
                  <button onClick={() => { setTimingData({}); handleFlagChange('Roja'); setSessionTime(0); }} className="bg-zinc-800 text-zinc-500 hover:text-white px-4 py-4 rounded-xl"><SquareIcon size={20} fill="currentColor" /></button>
               </div>
             </div>

             <div className="flex-grow flex overflow-hidden">
                <div className="flex-grow overflow-auto border-r border-zinc-900 custom-scrollbar">
                   <table className="w-full text-left">
                      <thead className="bg-zinc-900 sticky top-0 z-10">
                         <tr className="text-[9px] font-black uppercase text-zinc-500 border-b border-zinc-800">
                            <th className="p-4 w-12 text-center">Pos</th>
                            <th className="p-4 w-16 text-center">Kart</th>
                            <th className="p-4">Piloto / Sensor</th>
                            <th className="p-4 text-center">Lap</th>
                            <th className="p-4 text-center">S1</th>
                            <th className="p-4 text-center">S2</th>
                            <th className="p-4 text-center">S3</th>
                            <th className="p-4 text-center bg-zinc-950/40">Mejor</th>
                         </tr>
                      </thead>
                      <tbody>
                         {(Object.values(timingData) as TimingPilot[])
                           .sort((a,b) => b.laps - a.laps || parseFloat(a.best === '-' ? '999' : a.best) - parseFloat(b.best === '-' ? '999' : b.best))
                           .map((p, i) => (
                             <tr key={p.id} className="border-b border-zinc-900/50 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-center font-black text-zinc-700">P{i+1}</td>
                                <td className="p-4 text-center font-black text-red-600 text-3xl oswald italic">#{p.number}</td>
                                <td className="p-4">
                                   <p className="font-black uppercase text-[11px] text-white">{p.name}</p>
                                   <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1"><Cpu size={10} /> {p.transponderId}</p>
                                </td>
                                <td className="p-4 text-center font-black text-xl text-zinc-500">{p.laps}</td>
                                <td className="p-4 text-center text-zinc-500 mono text-[10px]">{p.s1}</td>
                                <td className="p-4 text-center text-zinc-500 mono text-[10px]">{p.s2}</td>
                                <td className="p-4 text-center text-zinc-500 mono text-[10px]">{p.s3}</td>
                                <td className="p-4 text-center font-black text-purple-500 bg-zinc-950/20">{p.best}</td>
                             </tr>
                           ))
                         }
                      </tbody>
                   </table>
                </div>

                <div className="w-96 bg-zinc-950 flex flex-col border-l border-zinc-800 overflow-hidden">
                   <div className="p-6 border-b border-zinc-900 bg-red-600/5">
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2 mb-6">
                         <Activity size={14} className="text-red-600 animate-pulse" /> Sensores Detectados (RX)
                      </p>
                      <div className="space-y-3">
                         {detectedSensors.length === 0 && <p className="text-[8px] text-zinc-700 uppercase text-center py-4">Sin pings detectados...</p>}
                         {detectedSensors.map(id => (
                           <div key={id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group">
                              <div>
                                 <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">ID Sensor</p>
                                 <p className="font-black text-white text-xs">{id}</p>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => assignSensorToPilot(id)} className="bg-zinc-800 hover:bg-blue-600 p-2 rounded-lg text-white" title="Manual">
                                    <UserPlus size={14}/>
                                 </button>
                                 <div className="relative group/popover">
                                    <button className="bg-zinc-800 hover:bg-emerald-600 p-2 rounded-lg text-white" title="Asignar Inscripto">
                                       <LogIn size={14}/>
                                    </button>
                                    <div className="hidden group-hover/popover:block absolute right-0 top-full mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                                       {allPilots.filter(p => p.category === selectedCategory && p.status !== Status.BAJA).map(p => (
                                          <button 
                                            key={p.id}
                                            onClick={() => assignSensorToPilot(id, p)}
                                            className="w-full text-left p-3 hover:bg-white/5 border-b border-zinc-800/50 flex items-center justify-between"
                                          >
                                             <span className="text-[9px] font-black uppercase text-white truncate">{p.name}</span>
                                             <span className="text-red-600 font-bold oswald">#{p.number}</span>
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeModule === 'inscriptos' && (
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
             <header className="p-8 bg-zinc-900/50 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-6">
                <div>
                   <h2 className="text-3xl font-black oswald uppercase text-white">Gestión de Sensores</h2>
                   <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Base de Datos de Inscriptos</p>
                </div>
                <div className="flex gap-4">
                   <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      <input 
                        type="text" 
                        placeholder="BUSCAR PILOTO O KART..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                        className="bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-6 text-[10px] font-black uppercase text-white focus:border-red-600 outline-none w-64"
                      />
                   </div>
                   <button onClick={() => generatePilotsPDF(allPilots, 'Inscriptos')} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                     <FileText size={16} /> Planilla PDF
                   </button>
                </div>
             </header>

             <div className="flex-grow overflow-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {allPilots
                    .filter(p => p.status !== Status.BAJA && (p.name.toUpperCase().includes(searchTerm) || p.number.includes(searchTerm)))
                    .map(p => (
                     <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] relative group hover:border-zinc-700 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="bg-red-600 text-white font-black oswald text-3xl px-3 py-1 rounded-xl italic">#{p.number}</div>
                           <div className="flex-grow overflow-hidden">
                              <h4 className="text-white font-black uppercase text-sm truncate">{p.name}</h4>
                              <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest truncate">{p.category}</p>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest ml-2">ID Sensor (Transponder)</label>
                           <div className="flex gap-2">
                              <input 
                                type="text" 
                                defaultValue={p.transponderId || ''}
                                placeholder="IDENTIFICADOR"
                                onBlur={(e) => updatePilotTransponder(p.id, e.target.value)}
                                className="flex-grow bg-black border border-zinc-800 rounded-xl px-4 py-3 text-[11px] font-bold text-emerald-500 uppercase focus:border-emerald-500 outline-none"
                              />
                           </div>
                           {p.transponderId && isCronomax && (
                              <button 
                                onClick={() => {
                                  setActiveModule('orbits');
                                  setSelectedCategory(p.category);
                                  assignSensorToPilot(p.transponderId!, p);
                                }}
                                className="w-full mt-4 py-3 bg-emerald-600/10 hover:bg-red-600 text-emerald-500 hover:text-white font-black uppercase text-[9px] tracking-widest rounded-xl transition-all border border-emerald-500/20"
                              >
                                Vincular a Grilla
                              </button>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeModule === 'hardware' && isCronomax && (
          <div className="p-10 space-y-8 h-full overflow-auto custom-scrollbar animate-in slide-in-from-right duration-300">
             <header className="mb-10">
                <h2 className="text-4xl font-black oswald uppercase text-white mb-2">Infraestructura KDO</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Monitoreo de Antenas Receptoras</p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: 'S1', name: 'Antena Sector 1', loc: 'Salida Curva 1', icon: Wifi },
                  { id: 'S2', name: 'Antena Sector 2', loc: 'Recta Opuesta', icon: Signal },
                  { id: 'S3', name: 'Antena Llegada / S3', loc: 'Finish Line', icon: Radio }
                ].map((ant, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] relative group hover:border-red-600/30 transition-all">
                     <div className="flex justify-between items-start mb-10">
                        <div className="bg-emerald-500/10 p-4 rounded-2xl">
                          <ant.icon size={32} className="text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Online</span>
                        </div>
                     </div>
                     <h3 className="text-2xl font-black oswald uppercase text-white mb-1">{ant.name}</h3>
                     <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-8">{ant.loc}</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
