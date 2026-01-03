
import { aiService } from './services/aiService.ts';
import { storageService } from './services/storageService.ts';

/**
 * VIBE FRAMEWORK CORE
 * Sistema de renderizado basado en componentes funcionales reactivos.
 */

const state = {
  currentPath: window.location.hash.replace('#/', '') || 'inicio',
  user: storageService.getAuth()
};

// --- ROUTER ---
const routes: Record<string, () => string> = {
  'inicio': () => renderHome(),
  'live': () => renderLive(),
  'pilotos': () => renderPilots(),
  'inscripciones': () => renderInscriptions(),
  'admin': () => renderAdmin()
};

function navigate() {
  state.currentPath = window.location.hash.replace('#/', '') || 'inicio';
  render();
}

// --- RENDER ENGINE ---
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const isAdminView = state.currentPath.startsWith('admin');
  
  app.innerHTML = `
    ${!isAdminView ? renderNavbar() : ''}
    <div class="flex-grow animate-in fade-in duration-500">
      ${(routes[state.currentPath] || render404)()}
    </div>
    ${!isAdminView ? renderFooter() : ''}
  `;

  // Post-render: Attach events if needed
  attachEvents();
}

// --- COMPONENTS ---

function renderNavbar() {
  return `
    <nav class="bg-black/80 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-50 h-20 flex items-center">
      <div class="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        <a href="#/inicio" class="flex items-center gap-2">
          <div class="bg-red-600 px-3 py-1.5 rounded italic font-black text-white text-xl oswald tracking-tighter">
            SOLO <span class="text-black bg-white px-1 rounded-sm">KARTING</span>
          </div>
        </a>
        <div class="hidden md:flex gap-8">
          ${['live', 'pilotos', 'inscripciones'].map(path => `
            <a href="#/${path}" class="text-[10px] font-black uppercase tracking-widest ${state.currentPath === path ? 'text-red-600' : 'text-zinc-500 hover:text-white'} transition-colors">
              ${path.replace('-', ' ')}
            </a>
          `).join('')}
        </div>
        <a href="#/admin" class="text-zinc-700 hover:text-red-600"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg></a>
      </div>
    </nav>
  `;
}

function renderHome() {
  const topPilots = storageService.getPilots().slice(0, 5);
  return `
    <section class="relative h-[600px] flex items-center overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547631618-f29792042761?q=80&w=2071')] bg-cover bg-center">
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <h2 class="text-red-600 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Temporada 2024 • Oficial</h2>
        <h1 class="text-7xl md:text-9xl font-black italic oswald text-white mb-8 leading-[0.85] tracking-tighter uppercase">
          VELOCIDAD <br /> EN <span class="text-red-600 underline decoration-8 underline-offset-[10px]">TIERRA</span>
        </h1>
        <div class="flex gap-4">
          <a href="#/inscripciones" class="bg-red-600 hover:bg-white hover:text-black text-white px-10 py-5 rounded-full font-black uppercase text-xs transition-all shadow-2xl shadow-red-600/20">Inscribirme ahora</a>
          <a href="#/live" class="bg-white/5 border border-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full font-black uppercase text-xs transition-all">Ver Live Center</a>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 glass-card rounded-[3rem] p-12 shadow-2xl scanline relative overflow-hidden">
          <div class="flex justify-between items-end mb-10">
            <h3 class="text-4xl font-black oswald uppercase italic text-white leading-none">Top <span class="text-red-600">Ranking</span></h3>
            <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Datos sincronizados RMS 3.0</p>
          </div>
          <div class="space-y-4">
            ${topPilots.map((p, i) => `
              <div class="flex items-center justify-between p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 group hover:border-red-600/30 transition-all">
                <div class="flex items-center gap-6">
                  <span class="oswald font-black text-4xl text-zinc-900 group-hover:text-red-600/10 transition-colors">0${i + 1}</span>
                  <div class="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-600 font-black oswald text-2xl transform group-hover:rotate-3 transition-transform">#${p.number}</div>
                  <div>
                    <p class="font-black text-white uppercase text-lg tracking-tight">${p.name}</p>
                    <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-1">${p.category}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-black oswald text-white">${p.ranking * 12} <span class="text-xs text-zinc-600">PTS</span></p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="space-y-8">
          <div class="bg-cyan-600/10 border border-cyan-500/30 rounded-[3rem] p-10 group transition-all hover:bg-cyan-600/20">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
              <h4 class="text-xl font-black oswald text-white uppercase">AI Spotter</h4>
            </div>
            <p class="text-zinc-400 text-xs font-medium leading-relaxed italic mb-8">"Recibe instrucciones técnicas en tiempo real basadas en telemetría de pista e ingeniería de vanguardia."</p>
            <a href="#/live" class="inline-flex items-center gap-2 text-cyan-500 font-black uppercase text-[10px] tracking-widest group-hover:translate-x-2 transition-transform">
              Activar Radio de Boxes <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>

          <div class="bg-emerald-600/10 border border-emerald-500/30 rounded-[3rem] p-10">
             <h4 class="text-xl font-black oswald text-white uppercase mb-4">RMS Network</h4>
             <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-loose">Conexión satelital activa con todas las federaciones del país. Grilla garantizada.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLive() {
  return `
    <div class="p-10 bg-black min-h-screen pt-20">
      <div class="max-w-7xl mx-auto">
        <header class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">RMS Live-Link Broadcast</span>
            </div>
            <h1 class="text-7xl font-black italic oswald uppercase text-white tracking-tighter leading-none">Live <span class="text-cyan-500">Center</span></h1>
          </div>
          <div class="flex gap-4">
             <div class="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 min-w-[200px]">
                <p class="text-[8px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Reloj Carrera</p>
                <p class="text-4xl font-black text-white tabular-nums oswald tracking-tighter">00:00:00</p>
             </div>
             <div class="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 border-l-4 border-l-emerald-500 min-w-[150px]">
                <p class="text-[8px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Pista</p>
                <p class="text-2xl font-black text-emerald-500 oswald uppercase">VERDE</p>
             </div>
          </div>
        </header>

        <div class="bg-zinc-900/30 rounded-[3rem] border border-zinc-800 overflow-hidden shadow-3xl">
          <table class="w-full text-left">
            <thead class="bg-zinc-900">
              <tr class="text-[9px] font-black uppercase text-zinc-500 border-b border-zinc-800">
                <th class="p-8 w-12 text-center">Pos</th>
                <th class="p-8 w-16 text-center">No</th>
                <th class="p-8">Piloto</th>
                <th class="p-8 text-center">Lap</th>
                <th class="p-8 text-center">Última</th>
                <th class="p-8 text-center">Mejor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="6" class="p-40 text-center">
                   <div class="flex flex-col items-center">
                      <div class="w-20 h-20 rounded-full border-4 border-t-red-600 border-zinc-900 animate-spin mb-8"></div>
                      <p class="text-zinc-600 font-black uppercase text-xs tracking-[0.5em]">Esperando conexión RMS Terminal...</p>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderPilots() {
  const pilots = storageService.getPilots();
  return `
    <div class="py-24 max-w-7xl mx-auto px-6">
      <div class="mb-20">
        <h1 class="text-8xl font-black italic oswald uppercase text-white mb-6 tracking-tighter leading-none">Pilotos <span class="text-red-600">Federados</span></h1>
        <p class="text-zinc-500 font-bold uppercase tracking-widest text-xs">Padrón oficial 2024 • Solo Karting RMS</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${pilots.map(p => `
          <div class="glass-card rounded-[3rem] p-10 border border-zinc-800/50 group hover:border-red-600/30 transition-all cursor-pointer relative overflow-hidden">
            <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></div>
            <div class="flex justify-between items-start mb-10">
              <div class="bg-red-600 text-white font-black oswald text-4xl px-4 py-2 rounded-2xl transform -rotate-3 group-hover:rotate-0 transition-transform shadow-xl">#${p.number}</div>
              <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">RANK ${p.ranking}º</span>
            </div>
            <h3 class="text-2xl font-black text-white uppercase mb-2 oswald leading-none group-hover:text-red-600 transition-colors">${p.name}</h3>
            <p class="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-10">${p.category}</p>
            <div class="pt-8 border-t border-zinc-900 flex justify-between items-center">
              <span class="text-[9px] font-black text-zinc-700 uppercase tracking-widest">${p.team || 'PARTICULAR'}</span>
              <div class="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderInscriptions() {
  return `
    <div class="py-24 max-w-2xl mx-auto px-6">
      <div class="text-center mb-20">
        <div class="bg-red-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/20 rotate-6">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
        </div>
        <h1 class="text-6xl font-black oswald uppercase text-white tracking-tighter">Portal <span class="text-red-600">RMS 3.0</span></h1>
        <p class="text-zinc-600 font-black uppercase text-[10px] tracking-[0.4em] mt-4">Registro Oficial de Competidores</p>
      </div>

      <form class="bg-zinc-900/40 p-14 rounded-[4rem] border border-zinc-800 space-y-10 shadow-3xl">
        <div class="space-y-3">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Nombre Completo del Piloto</label>
          <input type="text" class="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-white font-bold outline-none focus:border-red-600 transition-all uppercase placeholder:text-zinc-800" placeholder="Pérez, Juan">
        </div>
        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-3">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Nº Kart (Dorsal)</label>
            <input type="text" class="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-white font-black oswald text-5xl text-center outline-none focus:border-red-600" placeholder="00">
          </div>
          <div class="space-y-3">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Categoría</label>
            <select class="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-white font-bold h-[100px] outline-none appearance-none text-center uppercase text-xs">
              ${storageService.getCategories().map(c => `<option>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <button type="button" class="w-full bg-red-600 hover:bg-white hover:text-black text-white font-black uppercase py-8 rounded-[2rem] shadow-2xl shadow-red-600/20 transition-all text-xl tracking-tighter oswald italic">Validar y Confirmar</button>
      </form>
    </div>
  `;
}

function renderAdmin() {
  return `
    <div class="flex items-center justify-center min-h-screen px-6 racing-grid bg-black">
      <div class="max-w-md w-full glass-card p-14 rounded-[4rem] border border-zinc-800 shadow-3xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
        <div class="text-center mb-12">
          <h2 class="text-4xl font-black oswald uppercase text-white tracking-tighter">Terminal <span class="text-red-600">Elite</span></h2>
          <p class="text-zinc-600 text-[8px] font-black uppercase tracking-[0.4em] mt-3">KDO System Administration</p>
        </div>
        <div class="space-y-6">
          <input type="text" placeholder="ID OPERADOR" class="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-white font-bold outline-none focus:border-red-600 uppercase text-xs tracking-widest">
          <input type="password" placeholder="••••••••" class="w-full bg-black border border-zinc-800 rounded-3xl p-6 text-white font-bold outline-none focus:border-red-600 uppercase text-xs tracking-widest">
          <button class="w-full bg-red-600 text-white font-black uppercase py-6 rounded-3xl shadow-2xl shadow-red-600/20 text-xs tracking-widest">Autenticar Acceso</button>
        </div>
        <div class="mt-10 pt-10 border-t border-zinc-900 text-center">
           <p class="text-[8px] font-black text-zinc-800 uppercase tracking-widest">v3.2.0 • KDO SHIELD PROTECTED</p>
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer class="bg-black border-t border-zinc-900 py-16 mt-20">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
        <div class="bg-red-600 px-3 py-1.5 rounded italic font-black text-white text-xl oswald tracking-tighter">
          SOLO <span class="text-black bg-white px-1 rounded-sm">KARTING</span>
        </div>
        <div class="flex gap-10 text-zinc-700 text-[9px] font-black uppercase tracking-widest">
           <a href="#" class="hover:text-red-600 transition-colors">Terminos</a>
           <a href="#" class="hover:text-red-600 transition-colors">Privacidad</a>
           <a href="#" class="hover:text-red-600 transition-colors">RMS Docs</a>
        </div>
        <p class="text-zinc-800 text-[9px] font-black uppercase tracking-widest">© 2024 Solo Karting Elite System</p>
      </div>
    </footer>
  `;
}

function render404() {
  return `<div class="p-40 text-center">
    <h1 class="text-9xl font-black oswald text-zinc-900">404</h1>
    <p class="text-zinc-600 font-black uppercase tracking-widest">Pista fuera de límites</p>
    <a href="#/inicio" class="inline-block mt-10 text-red-600 font-black uppercase text-xs underline">Volver a boxes</a>
  </div>`;
}

function attachEvents() {
  // Logic to handle form submissions or dynamic button clicks
}

// --- APP INITIALIZATION ---
window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);

// Initial Render
navigate();
