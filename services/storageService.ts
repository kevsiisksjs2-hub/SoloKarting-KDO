
import { INITIAL_PILOTS, INITIAL_CATEGORIES, INITIAL_ASSOCIATIONS, INITIAL_CHAMPIONSHIPS, INITIAL_CIRCUITS } from '../constants.ts';

const KEYS = {
  PILOTS: 'sk_pilots',
  AUTH: 'sk_auth',
  TRACK_STATE: 'sk_track_state',
  LIVE_TIMING: 'sk_live_timing'
};

// Set to keep track of subscribers for reactivity
const subscribers = new Set<() => void>();

export const storageService = {
  // --- Subscription Mechanism ---
  // Fix: Added missing subscribe method for reactive updates
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  },

  // Internal helper to notify all subscribers of changes
  notify: () => {
    subscribers.forEach(callback => callback());
  },

  // --- Pilots ---
  getPilots: () => {
    try {
      const data = localStorage.getItem(KEYS.PILOTS);
      return data ? JSON.parse(data) : INITIAL_PILOTS;
    } catch {
      return INITIAL_PILOTS;
    }
  },
  
  savePilots: (pilots: any[]) => {
    localStorage.setItem(KEYS.PILOTS, JSON.stringify(pilots));
    storageService.notify();
  },

  // --- Categories ---
  getCategories: () => INITIAL_CATEGORIES,

  // --- Authentication ---
  getAuth: () => {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },

  setAuth: (user: any) => {
    if (user) localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
    else localStorage.removeItem(KEYS.AUTH);
    storageService.notify();
  },

  // Fix: Added missing getUsers method for admin login
  getUsers: () => [
    { id: '1', username: 'admin', role: 'admin', password: 'password' },
    { id: '2', username: 'Cronomax', role: 'tecnico', password: 'crono' }
  ],

  // --- Track State ---
  // Fix: Added missing track state management methods
  getTrackState: () => localStorage.getItem(KEYS.TRACK_STATE) || 'Verde',
  
  setTrackState: (flag: string) => {
    localStorage.setItem(KEYS.TRACK_STATE, flag);
    storageService.notify();
  },

  // --- Static Data Fetchers ---
  // Fix: Added missing methods to fetch static initial data
  getAssociations: () => INITIAL_ASSOCIATIONS,
  getCircuits: () => INITIAL_CIRCUITS,
  getChampionships: () => INITIAL_CHAMPIONSHIPS,

  // --- Live Timing ---
  // Fix: Added missing methods for live timing management
  getLiveTiming: () => {
    const data = localStorage.getItem(KEYS.LIVE_TIMING);
    return data ? JSON.parse(data) : { active: false, pilots: {}, flag: 'Roja', sessionTime: 0 };
  },

  setLiveTiming: (data: any) => {
    localStorage.setItem(KEYS.LIVE_TIMING, JSON.stringify(data));
    storageService.notify();
  },

  // --- Audit & Logging ---
  // Fix: Added missing addLog method for auditing actions
  addLog: (message: string, type: string) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  },

  // --- Results & Telemetry ---
  // Fix: Added missing getResults method for the results page
  getResults: () => {
    return [
      {
        id: 'res1',
        category: '150cc KDO Power',
        date: '24/11/2024',
        circuit: 'Kartódromo "Julio Canepa"',
        weather: 'Seco',
        podium: { p1: 'JUAN ACOSTA', p2: 'MARTÍN GARCÍA', p3: 'ALEXIS ALVAREZ' },
        details: [
          { pos: 1, number: '1', name: 'JUAN ACOSTA', points: 25, sectors: { s1: '18.1', s2: '21.9', s3: '13.8' } },
          { pos: 2, number: '12', name: 'MARTÍN GARCÍA', points: 18, sectors: { s1: '18.3', s2: '22.1', s3: '14.0' } }
        ]
      }
    ];
  },

  // Fix: Added missing getTrackInfo method for telemetry page
  getTrackInfo: () => ({
    temp: '24°C',
    trackTemp: '31°C',
    humidity: '45%'
  })
};
