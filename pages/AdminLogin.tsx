
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allUsers = storageService.getUsers();
    const match = allUsers.find(u => u.username === username && u.password === password);

    if (match) {
      storageService.setAuth(match);
      navigate('/Administracion19216811/dashboard');
    } else {
      setError('Credenciales incorrectas. Verifique usuario y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className="bg-red-600 inline-block p-2 rounded-xl italic font-black text-white text-2xl oswald tracking-tighter mb-4 shadow-xl shadow-red-600/20">
              SOLO <span className="text-black bg-white px-1 rounded-sm">KARTING</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] oswald">RMS Terminal Elite</h2>
            <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.3em] mt-1">KDO System 1.0</p>
            <div className="h-1 w-12 bg-red-600 mx-auto mt-4"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] ml-1">Identificación</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-zinc-800 focus:outline-none focus:border-red-600 transition-all shadow-inner uppercase"
                  placeholder="USUARIO"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] ml-1">Clave de Seguridad</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-zinc-800 focus:outline-none focus:border-red-600 transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <ShieldCheck size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-5 rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl shadow-red-600/20 tracking-widest text-xs"
            >
              Autenticar Acceso
            </button>
          </form>
        </div>
        
        <p className="text-center text-zinc-700 text-[10px] font-black uppercase mt-8 tracking-widest">
          Sistema de Gestión KDO - v3.2.0 (Elite)
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
