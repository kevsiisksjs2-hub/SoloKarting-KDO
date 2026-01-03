
import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, MapPin, Timer, Zap } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Championship } from '../types';

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="mt-8 bg-black/40 border border-red-600/30 rounded-2xl p-6 backdrop-blur-md animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
        </div>
        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center gap-2">
          <Timer size={14} className="text-red-600" /> Semáforo en cuenta regresiva
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Días', val: timeLeft.days },
          { label: 'Horas', val: timeLeft.hours },
          { label: 'Min', val: timeLeft.minutes },
          { label: 'Seg', val: timeLeft.seconds }
        ].map((unit, i) => (
          <div key={i} className="text-center group">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl py-3 shadow-inner group-hover:border-red-600/50 transition-colors">
              <span className="text-3xl font-black oswald text-white tabular-nums leading-none">
                {unit.val.toString().padStart(2, '0')}
              </span>
            </div>
            <p className="text-[8px] font-black uppercase text-zinc-600 mt-2 tracking-widest">{unit.label}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2">
        <Zap size={10} className="text-red-600" />
        <span className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter italic">La adrenalina del semáforo está cerca</span>
      </div>
    </div>
  );
};

const Campeonatos: React.FC = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);

  useEffect(() => {
    setChampionships(storageService.getChampionships());
  }, []);

  return (
    <div className="bg-zinc-950 py-20 min-h-screen selection:bg-red-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-left duration-700">
             <div className="w-12 h-1 bg-red-600"></div>
             <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Calendario Oficial</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic oswald uppercase text-white mb-6 tracking-tighter leading-none animate-in fade-in slide-in-from-left duration-1000">
            Nuestros <span className="text-red-600">Campeonatos</span>
          </h1>
          <p className="text-zinc-400 text-xl max-w-3xl font-medium leading-relaxed opacity-80 animate-in fade-in duration-1000 delay-300">
            Sigue de cerca las competencias más importantes de la temporada. Desde trazados de tierra históricos hasta circuitos internacionales.
          </p>
        </div>

        <div className="space-y-12">
          {championships.map((ch, index) => (
            <div 
              key={ch.id} 
              style={{ animationDelay: `${index * 200}ms` }}
              className="bg-zinc-900/40 border border-zinc-800 rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl hover:border-red-600/30 transition-all group animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
            >
              <div className="lg:w-[40%] h-72 lg:h-auto overflow-hidden relative shrink-0">
                <img src={ch.image} alt={ch.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent hidden lg:block"></div>
                
                <div className="absolute top-8 left-8 bg-red-600 text-white font-black italic oswald px-6 py-2 rounded-2xl shadow-xl shadow-red-600/30 transform -rotate-3 group-hover:rotate-0 transition-transform">
                  STATUS: {ch.status.toUpperCase()}
                </div>
              </div>

              <div className="p-12 flex-grow flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Trophy size={200} />
                </div>

                <div className="relative z-10">
                  <h3 className="text-4xl md:text-5xl font-black oswald uppercase text-white mb-8 tracking-tighter group-hover:text-red-500 transition-colors leading-none">{ch.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-400 text-sm font-bold uppercase tracking-tight mb-8">
                    <div className="flex items-center gap-4 group/item">
                      <div className="bg-zinc-800 group-hover/item:bg-red-600/20 p-3 rounded-2xl transition-colors">
                        <Calendar size={20} className="text-red-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-600 tracking-widest font-black">Cronograma</span>
                        <span className="text-zinc-200">{ch.dates}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                      <div className="bg-zinc-800 group-hover/item:bg-red-600/20 p-3 rounded-2xl transition-colors">
                        <MapPin size={20} className="text-red-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-600 tracking-widest font-black">Escenarios</span>
                        <span className="text-zinc-200">{ch.tracks}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contador Regresivo Dinámico */}
                  {ch.startDate && <Countdown targetDate={ch.startDate} />}
                </div>

                <div className="mt-12 flex flex-wrap gap-4 relative z-10">
                  <button className="flex-grow md:flex-none bg-red-600 hover:bg-white hover:text-black text-white font-black uppercase py-5 px-10 rounded-2xl text-[11px] tracking-widest transition-all shadow-xl shadow-red-600/10 transform active:scale-95 flex items-center justify-center gap-3">
                    Inscribirse Ahora
                  </button>
                  <button className="flex-grow md:flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-black uppercase py-5 px-10 rounded-2xl text-[11px] tracking-widest transition-all border border-zinc-700 flex items-center justify-center gap-3">
                    Reglamento Técnico
                  </button>
                </div>
              </div>
            </div>
          ))}

          {championships.length === 0 && (
            <div className="p-32 text-center bg-zinc-900/20 rounded-[4rem] border-2 border-dashed border-zinc-800 animate-in fade-in duration-700">
              <Trophy size={64} className="text-zinc-800 mx-auto mb-8" />
              <p className="text-zinc-600 font-black uppercase text-sm tracking-[0.4em] italic">No se han detectado calendarios activos</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .fill-mode-both {
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default Campeonatos;
