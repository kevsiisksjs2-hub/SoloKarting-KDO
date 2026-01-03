
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Radio, FileSignature, Trophy, Briefcase, Activity, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Live Center', path: '/live-center', icon: Radio },
    { name: 'Campeonatos', path: '/campeonatos' },
    { name: 'Pilotos', path: '/pilotos' },
    { name: 'Telemetría', path: '/telemetria', icon: Activity },
    { name: 'Garage', path: '/logbook', icon: Settings },
    { name: 'Patrocinios', path: '/patrocinios', icon: Briefcase },
    { name: 'Inscripciones', path: '/inscripciones', icon: FileSignature },
    { name: 'Resultados', path: '/resultados', icon: Trophy },
  ];

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-1.5 rounded italic font-black text-white text-xl oswald tracking-tighter transition-transform group-hover:scale-105">
                SOLO <span className="text-black bg-white px-1 rounded-sm">KARTING</span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex items-center">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    location.pathname === link.path 
                      ? 'text-cyan-500 bg-cyan-500/5' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {link.icon && <link.icon size={11} />}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-900">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest ${
                  location.pathname === link.path 
                    ? 'text-cyan-500 bg-cyan-500/10' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
