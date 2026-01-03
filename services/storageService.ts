import { INITIAL_PILOTS, INITIAL_CATEGORIES, INITIAL_ASSOCIATIONS, INITIAL_CHAMPIONSHIPS, INITIAL_CIRCUITS } from '../constants.ts';
import { User } from '../types';

const KEYS = {
  PILOTS: 'sk_pilots',
  AUTH: 'sk_auth',
  USERS: 'sk_users',
  TRACK_STATE: 'sk_track_state',
  LIVE_TIMING: 'sk_live_timing'
};

const subscribers = new Set<() => void>();

const DEFAULT_USERS: User[] = [
  { id: '1', username: 'admin', role: 'admin', password: 'password' },
  { id: '2', username: 'Cronomax', role: 'tecnico', password: 'crono' }
];

export const storageService = {
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  },

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

  // --- Users Administration ---
  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
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

  // --- Track State ---
  getTrackState: () => localStorage.getItem(KEYS.TRACK_STATE) || 'Verde',
  
  setTrackState: (flag: string) => {
    localStorage.setItem(KEYS.TRACK_STATE, flag);
    storageService.notify();
  },

  getAssociations: () => INITIAL_ASSOCIATIONS,
  getCircuits: () => INITIAL_CIRCUITS,
  getChampionships: () => INITIAL_CHAMPIONSHIPS,

  getLiveTiming: () => {
    const data = localStorage.getItem(KEYS.LIVE_TIMING);
    return data ? JSON.parse(data) : { active: false, pilots: {}, flag: 'Roja', sessionTime: 0 };
  },

  setLiveTiming: (data: any) => {
    localStorage.setItem(KEYS.LIVE_TIMING, JSON.stringify(data));
    storageService.notify();
  },

  addLog: (message: string, type: string) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  },

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

  getTrackInfo: () => ({
    temp: '24°C',
    trackTemp: '31°C',
    humidity: '45%'
  })
};