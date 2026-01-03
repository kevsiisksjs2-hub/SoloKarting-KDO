
import { aiService } from './services/aiService.ts';
import { storageService } from './services/storageService.ts';

// --- CONFIGURACIÓN DE RUTAS ---
const routes: Record<string, () => string> = {
  '': () => renderHome(),
  'live': () => renderLive(),
  'pilotos': () => renderPilots(),
  'inscripciones': () => renderInscriptions(),
  'resultados': () => renderResults(),
  'admin': () => renderAdmin()
};

// --- MOTOR DE RENDERIZADO ---
function navigate() {
  const hash = window.location.hash.replace('#/', '');
  const content = routes[hash] || (() => `<div class="p-20 text-center"><h1>404 - Pista no encontrada</h1></div>`);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      ${renderNavbar()}
      <main class="flex-grow">${content()}</main>
      ${renderFooter()}
    `;
    attachEvents();
  }
}

// --- COMPONENTES ---
function renderNavbar() {
  return `
    <nav class="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <a href="#/" class="flex items-center gap-2 group">
          <div class="bg-red-600 p-1.5 rounded italic font-black text-white text-xl oswald tracking-tighter">
            SOLO <span class="text-black bg-white px-1 rounded-sm">KARTING</span>
          </div>
        </a>
        <div class="hidden md:flex gap-6">
          <a href="#/live" class="text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors">Live Center</a>
          <a href="#/pilotos" class="text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors">Pilotos</a>
          <a href="#/inscripciones" class="text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors">Inscripciones</a>
          <a href="#/resultados" class="text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors">Resultados</a>
        </div>
        <a href="#/admin" class="p-2 text-zinc-600 hover:text-red-600"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></a>
      </div>
    </nav>
  `;
}

function renderHome() {
  const pilots = storageService.getPilots().slice(0, 5);
  return `
    <div class="relative h-[500px] flex items-center overflow-hidden">
      <div class="absolute inset-0 z-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1547631618-f29792042761?q=80&w=2071&auto=format&fit=crop')">
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <h2 class="text-zinc-400 font-bold uppercase tracking-widest mb-4">Solo Karting 2024</h2>
        <h1 class="text-6xl md:text-8xl font-black italic oswald text-white mb-6 uppercase leading-tight tracking-tighter">
          TODO SOBRE EL <br /> <span class="text-red-600">KARTING</span>
        </h1>
        <div class="flex gap-4">
          <a href="#/inscripciones" class="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-bold uppercase transition-all">Inscribirme</a>
          <a href="#/live" class="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-md font-bold uppercase transition-all">Ver Live Center</a>
        </div>
      </div>
    </div>

    <section class="max-w-7xl mx-auto px-4 -mt-20 relative z-20 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 glass-card rounded-[3rem] p-10 shadow-2xl">
          <h3 class="text-3xl font-black oswald uppercase italic text-white mb-8">Top <span class="text-red-600">Ranking</span></h3>
          <div class="space-y-4">
            ${pilots.map((p, i) => `
              <div class="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-zinc-800/50">
                <div class="flex items-center gap-6">
                  <span class="oswald font-black text-3xl text-zinc-800">0${i + 1}</span>
                  <div class="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-600 font-black oswald text-xl">#${p.number}</div>
                  <div>
                    <p class="font-black text-white uppercase text-base">${p.name}</p>
                    <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">${p.category}</p>
                  </div>
                </div>
                <p class="text-xl font-black oswald text-white">${p.ranking * 12} PTS</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="space-y-8">
          <div class="bg-cyan-600/10 border border-cyan-500/30 rounded-[3rem] p-10">
            <h4 class="text-2xl font-black oswald text-white mb-4 uppercase">AI Spotter</h4>
            <p class="text-zinc-400 text-xs font-medium leading-relaxed mb-6 italic">"Conéctate al Live Center para recibir instrucciones técnicas de nuestra IA basada en Gemini 3."</p>
            <a href="#/live" class="text-cyan-500 font-black uppercase text-[10px] tracking-widest">Activar Radio de Boxes →</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderLive() {
  const timing = storageService.getLiveTiming();
  return `
    <div class="p-10 bg-black min-h-screen">
      <div class="max-w-7xl mx-auto">
        <header class="flex justify-between items-end mb-10">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">RMS Live Link</span>
            </div>
            <h1 class="text-6xl font-black oswald uppercase text-white tracking-tighter">Live <span class="text-cyan-500">Center</span></h1>
          </div>
          <div class="bg-zinc-900 p-6 rounded-2xl border-l-4 border-cyan-500 min-w-[200px]">
            <p class="text-[9px] font-black text-zinc-500 uppercase mb-2">Reloj RMS</p>
            <p class="text-4xl font-black text-white oswald tabular-nums">00:00</p>
          </div>
        </header>

        <div class="bg-zinc-900/40 rounded-[3rem] border border-zinc-800 overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-zinc-900">
              <tr class="text-[10px] font-black uppercase text-zinc-500 border-b border-zinc-800">
                <th class="p-6 w-12 text-center">Pos</th>
                <th class="p-6 w-16 text-center">Kart</th>
                <th class="p-6">Piloto</th>
                <th class="p-6 text-center">Lap</th>
                <th class="p-6 text-center">Última</th>
                <th class="p-6 text-center">Mejor</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="6" class="p-20 text-center text-zinc-700 font-black uppercase tracking-[0.3em]">Esperando conexión con terminal de cronometraje...</td></tr>
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
    <div class="py-20 max-w-7xl mx-auto px-4">
      <h1 class="text-7xl font-black oswald uppercase text-white mb-16 tracking-tighter italic">Pilotos <span class="text-red-600">Federados</span></h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${pilots.map(p => `
          <div class="glass-card rounded-[3rem] p-10 border border-zinc-800/50 group hover:border-red-600/30 transition-all">
            <div class="flex justify-between items-start mb-8">
              <div class="bg-red-600 text-white font-black oswald text-4xl px-4 py-2 rounded-2xl transform -rotate-3">#${p.number}</div>
              <span class="text-[9px] font-black text-zinc-600 uppercase">RANK ${p.ranking}º</span>
            </div>
            <h3 class="text-2xl font-black text-white uppercase mb-2 oswald">${p.name}</h3>
            <p class="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-6">${p.category}</p>
            <div class="pt-6 border-t border-zinc-900 flex justify-between items-center">
              <span class="text-[10px] font-black text-zinc-700 uppercase">${p.team || 'PARTICULAR'}</span>
              <div class="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-600"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderInscriptions() {
  return `
    <div class="py-20 max-w-3xl mx-auto px-4">
      <div class="text-center mb-16">
        <h1 class="text-6xl font-black oswald uppercase text-white tracking-tighter">Registro <span class="text-red-600">RMS 3.0</span></h1>
        <p class="text-zinc-500 font-black uppercase text-[10px] tracking-[0.3em] mt-4">Inscripción Oficial de Competidores</p>
      </div>
      <form class="bg-zinc-900/50 p-12 rounded-[4rem] border border-zinc-800 space-y-8 shadow-2xl">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Apellido y Nombre</label>
          <input type="text" class="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-white font-bold outline-none focus:border-red-600 transition-all" placeholder="PÉREZ, JUAN">
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Nº Kart</label>
            <input type="text" class="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-white font-black oswald text-4xl text-center outline-none focus:border-red-600" placeholder="00">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4">Categoría</label>
            <select class="w-full bg-black border border-zinc-800 rounded-2xl p-6 text-white font-bold h-[88px] outline-none">
              <option>150cc KDO POWER</option>
              <option>150cc SUPERMASTER</option>
            </select>
          </div>
        </div>
        <button type="button" class="w-full bg-red-600 hover:bg-white hover:text-black text-white font-black uppercase py-8 rounded-[2rem] shadow-2xl transition-all text-xl">Confirmar Registro</button>
      </form>
    </div>
  `;
}

function renderResults() {
  return `
    <div class="py-20 max-w-7xl mx-auto px-4">
      <h1 class="text-7xl font-black oswald uppercase text-white mb-16 tracking-tighter">Boards de <span class="text-red-600">Crono</span></h1>
      <div class="bg-zinc-900 border border-zinc-800 p-20 rounded-[4rem] text-center border-dashed">
        <p class="text-zinc-600 font-black uppercase text-sm tracking-[0.5em]">No hay resultados cargados en la base de datos RMS.</p>
      </div>
    </div>
  `;
}

function renderAdmin() {
  return `
    <div class="flex items-center justify-center min-h-[80vh] px-4">
      <div class="max-w-md w-full glass-card p-12 rounded-[3rem] border border-zinc-800 shadow-2xl">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-black oswald uppercase text-white tracking-tighter">Terminal <span class="text-red-600">Elite</span></h2>
          <p class="text-zinc-600 text-[8px] font-black uppercase tracking-[0.3em] mt-2">KDO System Administration</p>
        </div>
        <div class="space-y-6">
          <input type="text" placeholder="USUARIO" class="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-red-600">
          <input type="password" placeholder="••••••••" class="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-white font-bold outline-none focus:border-red-600">
          <button class="w-full bg-red-600 text-white font-black uppercase py-5 rounded-2xl shadow-xl shadow-red-600/20">Autenticar</button>
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer class="bg-zinc-950 border-t border-zinc-900 py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="bg-red-600 p-1.5 rounded italic font-black text-white text-xl oswald tracking-tighter">
          SOLO <span class="text-black bg-white px-1 rounded-sm">KARTING</span>
        </div>
        <p class="text-zinc-600 text-[10px] font-black uppercase tracking-widest">© 2024 Solo Karting RMS - Elite System</p>
      </div>
    </footer>
  `;
}

function attachEvents() {
  // Aquí puedes añadir manejadores de eventos específicos si fuera necesario
}

// --- ARRANQUE ---
window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);

// Primera carga
navigate();
