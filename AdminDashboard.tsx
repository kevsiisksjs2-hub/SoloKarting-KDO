
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { generatePilotsPDF } from '../utils/pdfGenerator';
import { Pilot, User, Status } from '../types';
import { 
  Users, LogOut, Flag, Monitor, Satellite, 
  Play, Pause, Square as SquareIcon, Activity, 
  Search, Plus, Trash2, Edit3, FileText, Cpu, Radio, UserPlus, LogIn, ChevronRight, Shield, ShieldCheck, Key
} from 'lucide-react';

type Module = 'orbits' | 'inscriptos' | 'hardware' | 'usuarios';

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
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // User Management State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({ username: '', password: '', role: 'tecnico' as User['role'] });

  const [selectedCategory, setSelectedCategory] = useState<string>(storageService.getCategories()[0]);
  const [maxLaps, setMaxLaps] = useState<number>(12);
  const [raceActive, setRaceActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  
  const [timingData, setTimingData] = useState<Record<string, TimingPilot>>({});
  const [detectedSensors, setDetectedSensors] = useState<string[]>([]); 

  const isCronomax = currentUser?.username === 'Cronomax';
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const auth = storageService.getAuth();
    if (!auth) { navigate('/Administracion19216811'); return; }
    setCurrentUser(auth);

    if (auth.username === 'Cronomax') setActiveModule('orbits');
    else setActiveModule('inscriptos');

    const refreshData = () => {
      setAllPilots(storageService.getPilots());
      setSystemUsers(storageService.getUsers());
      setTrackFlag(storageService.getTrackState());
    };

    refreshData();
    const unsubscribe = storageService.subscribe(refreshData);
    return () => unsubscribe();
  }, [navigate]);

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

  useEffect(() => {
    let interval: any;
    if (raceActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [raceActive]);

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

  const handleUserAction = () => {
    const users = [...systemUsers];
    if (editingUser) {
      const index = users.findIndex(u => u.id === editingUser.id);
      users[index] = { ...editingUser, ...userFormData };
    } else {
      users.push({ id: Math.random().toString(36).substr(2, 9), ...userFormData });
    }
    storageService.saveUsers(users);
    setShowUserModal(false);
    setEditingUser(null);
    setUserFormData({ username: '', password: '', role: 'tecnico' });
  };

  const deleteUser = (id: string) => {
    if (confirm("¿Está seguro de eliminar este usuario?")) {
      const users = systemUsers.filter(u => u.id !== id);
      storageService.saveUsers(users);
    }
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
               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] px-6 mb-2">Operación de Pista</p>
               <button onClick={() => setActiveModule('orbits')} className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeModule === 'orbits' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                 <Monitor size={14} /> Cronometraje
               </button>
               <button onClick={() => setActiveModule('hardware')} className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeModule === 'hardware' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                 <Satellite size={14} /> Antenas (S1-S3)
               </button>
             </div>
           )}

           <div className="space-y-4">
              <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] px-6 mb-2">Comisariato</p>
              <button onClick={() => setActiveModule('inscriptos')} className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeModule === 'inscriptos' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                <Users size={14} /> Pilotos
              </button>
              {isAdmin && (
                <button onClick={() => setActiveModule('usuarios')} className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${activeModule === 'usuarios' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                  <Shield size={14} /> Usuarios
                </button>
              )}
           </div>
        </nav>

        <div className="p-6 border-t border-zinc-900 mt-auto">
           <button onClick={() => { storageService.setAuth(null); navigate('/Administracion19216811'); }} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-700 hover:text-red-500 font-bold uppercase text-[9px] tracking-widest transition-colors">
             <LogOut size={16} /> Salir
           </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col bg-zinc-950 overflow-hidden">
        {activeModule === 'orbits' && (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
             <div className="bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
               <div className="flex items-center gap-6">
                 <div className="space-y-1">
                   <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Categoría Activa</p>
                   <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-black border border-zinc-800 text-white font-black oswald uppercase text-lg px-4 py-2 rounded-lg outline-none focus:border-red-600">
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
             <div className="flex-grow overflow-auto border-r border-zinc-900 custom-scrollbar">
                <table className="w-full text-left">
                   <thead className="bg-zinc-900 sticky top-0 z-10">
                      <tr className="text-[9px] font-black uppercase text-zinc-500 border-b border-zinc-800">
                         <th className="p-4 w-12 text-center">Pos</th>
                         <th className="p-4 w-16 text-center">Kart</th>
                         <th className="p-4">Piloto</th>
                         <th className="p-4 text-center">Lap</th>
                         <th className="p-4 text-center">S1</th>
                         <th className="p-4 text-center">S2</th>
                         <th className="p-4 text-center">S3</th>
                         <th className="p-4 text-center">Mejor</th>
                      </tr>
                   </thead>
                   <tbody>
                      {/* Fix: Explicitly cast Object.values(timingData) to TimingPilot[] to resolve TypeScript 'unknown' inference errors */}
                      {(Object.values(timingData) as TimingPilot[]).sort((a,b) => b.laps - a.laps || parseFloat(a.best === '-' ? '999' : a.best) - parseFloat(b.best === '-' ? '999' : b.best)).map((p, i) => (
                        <tr key={p.id} className="border-b border-zinc-900/50 hover:bg-white/5">
                           <td className="p-4 text-center font-black text-zinc-700">P{i+1}</td>
                           <td className="p-4 text-center font-black text-red-600 text-3xl oswald italic">#{p.number}</td>
                           <td className="p-4">
                              <p className="font-black uppercase text-[11px] text-white">{p.name}</p>
                              <p className="text-[8px] font-black text-zinc-600 uppercase flex items-center gap-1"><Cpu size={10} /> {p.transponderId}</p>
                           </td>
                           <td className="p-4 text-center font-black text-xl text-zinc-500">{p.laps}</td>
                           <td className="p-4 text-center text-zinc-500 text-[10px]">{p.s1}</td>
                           <td className="p-4 text-center text-zinc-500 text-[10px]">{p.s2}</td>
                           <td className="p-4 text-center text-zinc-500 text-[10px]">{p.s3}</td>
                           <td className="p-4 text-center font-black text-purple-500 bg-zinc-950/20">{p.best}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeModule === 'usuarios' && (
          <div className="p-10 animate-in slide-in-from-right duration-300">
             <header className="flex justify-between items-center mb-10">
                <div>
                   <h2 className="text-3xl font-black oswald uppercase text-white">Terminales RMS</h2>
                   <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Gestión de Accesos al Sistema</p>
                </div>
                <button onClick={() => { setEditingUser(null); setUserFormData({username:'', password:'', role:'tecnico'}); setShowUserModal(true); }} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-3">
                   <UserPlus size={16} /> Crear Terminal
                </button>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemUsers.map(u => (
                  <div key={u.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] relative group hover:border-zinc-700 transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div className="bg-red-600/10 p-4 rounded-2xl">
                           <Activity className="text-red-600" size={24} />
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => { setEditingUser(u); setUserFormData({username:u.username, password:u.password || '', role:u.role}); setShowUserModal(true); }} className="p-2 text-zinc-600 hover:text-white"><Edit3 size={16}/></button>
                           <button onClick={() => deleteUser(u.id)} className="p-2 text-zinc-600 hover:text-red-600"><Trash2 size={16}/></button>
                        </div>
                     </div>
                     <h3 className="text-2xl font-black oswald uppercase text-white mb-1">{u.username}</h3>
                     <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{u.role}</p>
                     <div className="mt-6 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Key size={12} className="text-zinc-700" />
                           <span className="text-[10px] text-zinc-600">••••••••</span>
                        </div>
                        <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[8px] font-black uppercase rounded">ID: {u.id}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
             <div className="bg-zinc-900 w-full max-w-md rounded-[3rem] border border-zinc-800 p-10 shadow-2xl animate-in zoom-in-95">
                <h3 className="text-2xl font-black oswald uppercase text-white mb-8">{editingUser ? 'Editar' : 'Nuevo'} Usuario</h3>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Nombre de Usuario</label>
                      <input type="text" value={userFormData.username} onChange={(e) => setUserFormData({...userFormData, username: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white font-bold outline-none focus:border-red-600" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Contraseña</label>
                      <input type="password" value={userFormData.password} onChange={(e) => setUserFormData({...userFormData, password: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white font-bold outline-none focus:border-red-600" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Rol del Sistema</label>
                      <select value={userFormData.role} onChange={(e) => setUserFormData({...userFormData, role: e.target.value as User['role']})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white font-bold outline-none focus:border-red-600">
                         <option value="admin">Administrador</option>
                         <option value="director">Director de Carrera</option>
                         <option value="tecnico">Comisario Técnico</option>
                         <option value="comisario">Comisario Deportivo</option>
                      </select>
                   </div>
                   <div className="flex gap-4 mt-8">
                      <button onClick={() => setShowUserModal(false)} className="flex-grow bg-zinc-800 text-zinc-400 font-black uppercase py-4 rounded-2xl text-[10px]">Cancelar</button>
                      <button onClick={handleUserAction} className="flex-grow bg-red-600 text-white font-black uppercase py-4 rounded-2xl text-[10px]">Guardar Usuario</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* ... Rest of existing modules (inscriptos, hardware) ... */}
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
                      <input type="text" placeholder="BUSCAR PILOTO O KART..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toUpperCase())} className="bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-6 text-[10px] font-black uppercase text-white focus:border-red-600 outline-none w-64" />
                   </div>
                   <button onClick={() => generatePilotsPDF(allPilots, 'Inscriptos')} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                     <FileText size={16} /> Planilla PDF
                   </button>
                </div>
             </header>
             <div className="flex-grow overflow-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {allPilots.filter(p => p.status !== Status.BAJA && (p.name.toUpperCase().includes(searchTerm) || p.number.includes(searchTerm))).map(p => (
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
                           <input type="text" defaultValue={p.transponderId || ''} placeholder="IDENTIFICADOR" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-[11px] font-bold text-emerald-500 uppercase focus:border-emerald-500 outline-none" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
