
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { Category, Pilot, Status, Association } from '../types';
import { storageService } from '../services/storageService';
import { 
  ChevronRight, Users, Calendar, MapPin, Newspaper, Trophy, 
  ShieldCheck, Flag, Activity, Zap, Star, Radio, FileSignature, ArrowRight, Sparkles
} from 'lucide-react';

const Home: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trackState, setTrackState] = useState<string>(storageService.getTrackState());

  useEffect(() => {
    const refresh = () => {
      setPilots(storageService.getPilots());
      setAssociations(storageService.getAssociations());
      setCategories(storageService.getCategories());
      setTrackState(storageService.getTrackState());
    };
    refresh();
    const unsubscribe = storageService.subscribe(refresh);
    return () => unsubscribe();
  }, []);

  const topPilots = pilots
    .filter(p => p.status === Status.CONFIRMADO)
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, 5);

  return (
    <div className="bg-zinc-950 min-h-screen page-enter">
      {/* Dynamic News Ticker */}
      <div className={`h-10 border-b overflow-hidden flex items-center transition-colors duration-500 ${
        trackState === 'Roja' ? 'bg-red-600 border-red-500' : 'bg-zinc-900 border-zinc-800'
      }`}>
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Zap size={14} fill="currentColor" /> INSCRIPCIONES ABIERTAS: PRÓXIMA FECHA EN CHIVILCOY
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
                <Radio size={14} /> LIVE CENTER: ESTRATEGIA DE CARRERA E INGENIERO IA EN VIVO
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Activity size={14} /> ESTADO DE PISTA: {trackState.toUpperCase()}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <Hero />

      {/* War Room / Scoreboard Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-32 relative z-30 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Scoreboard */}
          <div className="lg:col-span-8 glass-panel rounded-[3rem] p-10 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
              <Trophy size={300} />
            </div>
            
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black oswald uppercase italic text-white tracking-tighter">Líderes de <span className="text-red-600">Ranking</span></h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Temporada Oficial 2024</p>
              </div>
              <Link to="/pilotos" className="bg-zinc-800 hover:bg-red-600 text-white p-4 rounded-2xl transition-all shadow-xl">
                <ChevronRight size={24} />
              </Link>
            </div>

            <div className="space-y-4">
              {topPilots.map((pilot, idx) => (
                <div key={pilot.id} className="flex items-center justify-between p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 hover:border-red-600/30 transition-all group/item">
                  <div className="flex items-center gap-6">
                    <span className="oswald font-black text-3xl text-zinc-800 group-hover/item:text-red-600 transition-colors">0{idx + 1}</span>
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-600 font-black oswald text-xl">
                      #{pilot.number}
                    </div>
                    <div>
                      <p className="font-black text-white uppercase text-base tracking-tight">{pilot.name}</p>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{pilot.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black oswald text-white">{pilot.ranking * 12} pts</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Info Panels */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Center Card (The Big New Idea) */}
            <Link to="/live-center" className="block bg-cyan-600/10 border border-cyan-500/30 rounded-[3rem] p-8 shadow-2xl group relative overflow-hidden transition-all transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent"></div>
              <Radio className="text-cyan-500/10 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" size={140} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-cyan-400" size={16} />
                  <span className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">Pit Wall Digital</span>
                </div>
                <h3 className="text-3xl font-black oswald uppercase text-white mb-2 leading-none">Live <br /><span className="text-cyan-500">Center</span></h3>
                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">Monitorea los gaps en tiempo real y recibe instrucciones tácticas de nuestro AI Spotter.</p>
                <div className="mt-8 flex items-center gap-4 text-cyan-500 font-black uppercase text-xs">
                  <span>Conectar Radio de Boxes</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>

            {/* Quick Registration Link */}
            <Link to="/inscripciones" className="block bg-red-600 hover:bg-red-700 rounded-[3rem] p-8 shadow-2xl shadow-red-600/20 group relative overflow-hidden transition-all transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <FileSignature className="text-white/20 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" size={140} />
              <div className="relative z-10">
                <h3 className="text-3xl font-black oswald uppercase text-white mb-2 leading-none">Portal de <br />Inscripciones</h3>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Reserva tu kart en la grilla oficial</p>
                <div className="mt-8 flex items-center gap-4 text-white font-black uppercase text-xs">
                  <span>Ir al Formulario</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
