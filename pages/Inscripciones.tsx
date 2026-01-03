
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { HISTORICAL_RANKINGS } from '../constants';
import { Category, Status, Pilot } from '../types';
import { 
  UserPlus, CheckCircle2, Zap, ArrowRight, Stethoscope, 
  IdCard, Trophy, ShieldCheck, Search, Info, Settings2, BoxSelect,
  X, AlertTriangle, Hash, Activity
} from 'lucide-react';

interface FormErrors {
  name?: string;
  number?: string;
  ranking?: string;
  medicalLicense?: string;
  sportsLicense?: string;
}

const Inscripciones: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [autoRankFound, setAutoRankFound] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    category: '',
    ranking: '',
    association: 'Asociación KDO Buenos Aires',
    medicalLicense: '',
    sportsLicense: '',
    team: '',
    chassis: '',
    engine: ''
  });

  useEffect(() => {
    const loadedCats = storageService.getCategories();
    setCategories(loadedCats);
    if (loadedCats.length > 0) setFormData(prev => ({ ...prev, category: loadedCats[0] }));
  }, []);

  // Autofill basado en Ranking Histórico
  useEffect(() => {
    const searchName = formData.name.toUpperCase().trim();
    if (searchName.length > 5) {
      const match = HISTORICAL_RANKINGS.find(h => h.name.toUpperCase().includes(searchName));
      if (match) {
        setFormData(prev => ({ 
          ...prev, 
          ranking: match.ranking.toString(), 
          number: match.number 
        }));
        setAutoRankFound(true);
      } else {
        setAutoRankFound(false);
      }
    }
  }, [formData.name]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validación Nombre
    if (formData.name.trim().split(' ').length < 2) {
      newErrors.name = "Ingrese Apellido y Nombre completo.";
    }

    // Validación Dorsal (0-999)
    const num = parseInt(formData.number);
    if (isNaN(num) || num < 0 || num > 999) {
      newErrors.number = "Dorsal inválido. Rango: 0-999.";
    }

    // Validación Ranking (1-200)
    const rank = parseInt(formData.ranking);
    if (isNaN(rank) || rank < 1 || rank > 200) {
      newErrors.ranking = "Ranking oficial debe estar entre 1 y 200.";
    }

    // Validación Licencia Médica (Alfanumérico min 6)
    if (!/^[A-Z0-9]{6,}$/.test(formData.medicalLicense.toUpperCase().replace(/\s/g, ''))) {
      newErrors.medicalLicense = "Formato inválido. Mínimo 6 caracteres alfanuméricos.";
    }

    // Validación Licencia Deportiva (Alfanumérico min 6)
    if (!/^[A-Z0-9]{6,}$/.test(formData.sportsLicense.toUpperCase().replace(/\s/g, ''))) {
      newErrors.sportsLicense = "Formato inválido. Mínimo 6 caracteres alfanuméricos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const current = storageService.getPilots();
    const newPilot: Pilot = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name.toUpperCase(),
      number: formData.number,
      category: formData.category,
      status: Status.PENDIENTE,
      ranking: parseInt(formData.ranking),
      association: formData.association,
      team: formData.team.toUpperCase() || 'PARTICULAR',
      medicalLicense: formData.medicalLicense.toUpperCase(),
      sportsLicense: formData.sportsLicense.toUpperCase(),
      technicalOk: false,
      paid: false, 
      penaltyPoints: 0,
      chassis: formData.chassis.toUpperCase(),
      engine: formData.engine.toUpperCase(),
      lastUpdated: new Date().toISOString()
    };
    
    storageService.savePilots([...current, newPilot]);
    storageService.addLog(`Inscripción RMS: ${newPilot.name} (#${newPilot.number})`, 'data');
    setSubmitted(true);
    setTimeout(() => { 
      setShowForm(false); 
      setSubmitted(false); 
      setFormData({
        name: '', number: '', category: categories[0], ranking: '', 
        association: 'Asociación KDO Buenos Aires', medicalLicense: '', 
        sportsLicense: '', team: '', chassis: '', engine: ''
      });
    }, 3000);
  };

  return (
    <div className="bg-zinc-950 py-24 min-h-screen relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="bg-red-600 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_20px_60px_rgba(220,38,38,0.3)] rotate-6 border-4 border-white/10">
            <UserPlus size={54} className="text-white -rotate-6" />
          </div>
          <h1 className="text-8xl font-black italic oswald uppercase text-white mb-6 tracking-tighter leading-none">Portal <span className="text-red-600">RMS 3.0</span></h1>
          <p className="text-zinc-500 max-w-xl mx-auto font-black uppercase tracking-[0.3em] text-[10px] leading-loose">
            Registro Oficial de Competidores • Fiscalización KDO Shield Active
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-14 rounded-[4rem] shadow-2xl hover:border-red-600/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-5 mb-10">
                <div className="bg-red-600/10 p-4 rounded-2xl border border-red-600/20">
                  <ShieldCheck className="text-red-600 group-hover:scale-110 transition-transform" size={42} />
                </div>
                <div>
                  <h2 className="text-4xl font-black oswald uppercase text-white tracking-tight">Registro 2024</h2>
                  <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Procedimiento Seguro</span>
                </div>
              </div>
              <p className="text-zinc-400 mb-12 text-lg leading-relaxed font-medium">Sus datos serán validados por el Comisariato Técnico antes de cada competencia. Asegúrese de que sus licencias estén vigentes.</p>
              <div className="grid grid-cols-2 gap-6 mb-12">
                 {[
                   { t: 'Validez Dorsal', i: Hash },
                   { t: 'Firma Médica', i: Stethoscope },
                   { t: 'Precinto Técnico', i: Zap },
                   { t: 'Ranking Oficial', i: Trophy }
                 ].map(item => (
                   <div key={item.t} className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-500 tracking-widest group/icon">
                      <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 group-hover/icon:text-emerald-500 transition-colors">
                        <item.i size={14} />
                      </div>
                      {item.t}
                   </div>
                 ))}
              </div>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-7 rounded-[2rem] shadow-2xl shadow-red-600/20 transition-all flex items-center justify-center gap-4 group text-xl"
            >
              NUEVA INSCRIPCIÓN <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-800/30 p-14 rounded-[4rem] flex flex-col items-center justify-center text-center">
             <div className="bg-zinc-800/50 p-10 rounded-full mb-10 border border-zinc-700 shadow-inner">
                <Activity size={64} className="text-zinc-600 animate-pulse" />
             </div>
             <h3 className="text-4xl font-black oswald uppercase text-white mb-6">Auditoría Técnica</h3>
             <p className="text-zinc-500 text-lg mb-12 max-w-xs font-medium leading-relaxed italic">
               "El control de identidad RMS 3.0 cruza datos con el ranking histórico para evitar suplantaciones de dorsales."
             </p>
             <div className="bg-zinc-950/80 p-8 rounded-[2.5rem] border border-zinc-800 w-full text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><AlertTriangle size={80} /></div>
                <div className="flex items-center gap-3 mb-4">
                   <Zap size={18} className="text-yellow-500" />
                   <span className="text-[11px] font-black uppercase text-zinc-400 tracking-[0.3em]">Protocolo de Seguridad</span>
                </div>
                <p className="text-zinc-500 text-[11px] font-bold uppercase leading-loose relative z-10">
                  La detección de licencias apócrifas resultará en la exclusión inmediata de la fecha y pérdida de puntos en el ranking anual.
                </p>
             </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/98 backdrop-blur-2xl">
            <div className="bg-zinc-900 w-full max-w-2xl rounded-[4rem] border border-zinc-800 p-14 shadow-[0_0_150px_rgba(220,38,38,0.15)] relative animate-in zoom-in-95 overflow-y-auto max-h-[92vh] custom-scrollbar">
              <button onClick={() => setShowForm(false)} className="absolute top-12 right-12 text-zinc-600 hover:text-white transition-colors bg-zinc-950 p-2 rounded-full border border-zinc-800"><X size={28} /></button>
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <header className="mb-14">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-1 bg-red-600"></div>
                      <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.5em]">Terminal de Registro</span>
                    </div>
                    <h2 className="text-6xl font-black oswald uppercase text-white tracking-tighter leading-none">RMS <span className="text-red-600">Shield</span></h2>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-2">Piloto (Apellido y Nombre)</label>
                      <div className="relative group">
                        <Search className="absolute left-6 top-6 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={22} />
                        <input 
                          required 
                          type="text" 
                          value={formData.name} 
                          onChange={e => handleInputChange('name', e.target.value)} 
                          className={`w-full bg-zinc-950 border rounded-[1.5rem] pl-16 pr-8 py-6 text-white font-black uppercase outline-none transition-all placeholder:text-zinc-800 ${errors.name ? 'border-red-600 ring-4 ring-red-600/10' : 'border-zinc-800 focus:border-red-600'}`} 
                          placeholder="Pérez, Juan" 
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 mt-2 ml-2"><AlertTriangle size={12}/> {errors.name}</p>}
                      {autoRankFound && <p className="text-emerald-500 text-[10px] font-black uppercase ml-2 animate-pulse flex items-center gap-2"><CheckCircle2 size={12}/> ¡Dorsal vinculado en ranking!</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-2">Equipo / Motorista</label>
                      <input 
                        type="text" 
                        value={formData.team} 
                        onChange={e => handleInputChange('team', e.target.value)} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-[1.5rem] px-8 py-6 text-white font-black uppercase outline-none focus:border-red-600 transition-all placeholder:text-zinc-800" 
                        placeholder="Particular" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] text-center block">Kart #</label>
                      <input 
                        required 
                        type="text" 
                        maxLength={3}
                        value={formData.number} 
                        onChange={e => handleInputChange('number', e.target.value.replace(/\D/g, ''))} 
                        className={`w-full bg-zinc-950 border rounded-[1.5rem] py-6 text-center font-black oswald text-5xl text-red-600 outline-none transition-all ${errors.number ? 'border-red-600 ring-4 ring-red-600/10' : 'border-zinc-800 focus:border-red-600'}`} 
                        placeholder="0" 
                      />
                      {errors.number && <p className="text-red-500 text-[9px] font-black uppercase text-center mt-2">{errors.number}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] text-center block">Ranking</label>
                      <input 
                        required 
                        type="number" 
                        value={formData.ranking} 
                        onChange={e => handleInputChange('ranking', e.target.value)} 
                        className={`w-full bg-zinc-950 border rounded-[1.5rem] py-6 text-center font-black oswald text-5xl text-white outline-none transition-all ${errors.ranking ? 'border-red-600 ring-4 ring-red-600/10' : 'border-zinc-800 focus:border-red-600'}`} 
                        placeholder="99" 
                      />
                      {errors.ranking && <p className="text-red-500 text-[9px] font-black uppercase text-center mt-2">{errors.ranking}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] text-center block">Categoría</label>
                      <select 
                        value={formData.category} 
                        onChange={e => handleInputChange('category', e.target.value)} 
                        className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-[1.5rem] px-4 text-center font-black uppercase text-xs outline-none focus:border-red-600 appearance-none cursor-pointer"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-2">Lic. Médica (Digital)</label>
                      <div className="relative group">
                        <Stethoscope className="absolute left-6 top-6 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={20} />
                        <input 
                          required 
                          type="text" 
                          value={formData.medicalLicense} 
                          onChange={e => handleInputChange('medicalLicense', e.target.value)} 
                          className={`w-full bg-zinc-950 border rounded-[1.5rem] pl-16 py-6 text-white font-black outline-none transition-all uppercase ${errors.medicalLicense ? 'border-red-600 ring-4 ring-red-600/10' : 'border-zinc-800 focus:border-red-600'}`} 
                          placeholder="MED-XXXXX"
                        />
                      </div>
                      {errors.medicalLicense && <p className="text-red-500 text-[9px] font-black uppercase mt-2 ml-2">{errors.medicalLicense}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] ml-2">Lic. Deportiva</label>
                      <div className="relative group">
                        <IdCard className="absolute left-6 top-6 text-zinc-700 group-focus-within:text-red-600 transition-colors" size={20} />
                        <input 
                          required 
                          type="text" 
                          value={formData.sportsLicense} 
                          onChange={e => handleInputChange('sportsLicense', e.target.value)} 
                          className={`w-full bg-zinc-950 border rounded-[1.5rem] pl-16 py-6 text-white font-black outline-none transition-all uppercase ${errors.sportsLicense ? 'border-red-600 ring-4 ring-red-600/10' : 'border-zinc-800 focus:border-red-600'}`} 
                          placeholder="DEP-XXXXX"
                        />
                      </div>
                      {errors.sportsLicense && <p className="text-red-500 text-[9px] font-black uppercase mt-2 ml-2">{errors.sportsLicense}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 p-10 bg-zinc-950/50 rounded-[3rem] border border-zinc-800/50 relative overflow-hidden group/box">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/box:scale-110 transition-transform"><Settings2 size={120} /></div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] flex items-center gap-3"><Settings2 size={14} className="text-red-600"/> Chasis</label>
                      <input type="text" value={formData.chassis} onChange={e => setFormData({...formData, chassis: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-100 font-black uppercase text-xs outline-none focus:border-red-600 transition-all" placeholder="MARCA" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em] flex items-center gap-3"><BoxSelect size={14} className="text-red-600"/> Motorista</label>
                      <input type="text" value={formData.engine} onChange={e => setFormData({...formData, engine: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-100 font-black uppercase text-xs outline-none focus:border-red-600 transition-all" placeholder="PREPARADOR" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-white text-black hover:bg-red-600 hover:text-white font-black uppercase py-8 rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-5 group text-2xl mt-8 transform active:scale-[0.98]">
                    VALIDAR Y FINALIZAR <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </form>
              ) : (
                <div className="py-40 text-center animate-in zoom-in-50 duration-700">
                   <div className="w-40 h-40 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-12 border-2 border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.15)] relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-ping"></div>
                      <CheckCircle2 size={86} className="text-emerald-500 relative z-10" />
                   </div>
                   <h2 className="text-6xl font-black oswald uppercase text-white mb-6 tracking-tighter">Inscripción Exitosa</h2>
                   <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.5em] max-w-sm mx-auto leading-loose opacity-80">
                     Los datos han sido transmitidos al terminal RMS del circuito. Presentar comprobante digital en boxes.
                   </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inscripciones;
