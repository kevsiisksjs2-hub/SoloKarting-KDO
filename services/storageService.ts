
import { 
  INITIAL_PILOTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ASSOCIATIONS, 
  INITIAL_CHAMPIONSHIPS, 
  INITIAL_CIRCUITS 
} from '../constants.ts';

const KEYS = {
  PILOTS: 'sk_pilots',
  TRACK_STATE: 'sk_track_state',
  LIVE_TIMING: 'sk_live_timing',
  AUTH: 'sk_auth',
  LOGS: 'sk_logs'
};

// Simple pub-sub to notify components of changes
const listeners: Set<() => void> = new Set();

const notify = () => {
  listeners.forEach(l => l());
};

export const storageService = {
  // Subscribe to changes in storage
  subscribe: (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  getPilots: () => {
    const data = localStorage.getItem(KEYS.PILOTS);
    return data ? JSON.parse(data) : INITIAL_PILOTS;
  },
  savePilots: (pilots: any[]) => {
    localStorage.setItem(KEYS.PILOTS, JSON.stringify(pilots));
    notify();
  },
  getCategories: () => {
    return INITIAL_CATEGORIES;
  },
  getTrackState: () => {
    return localStorage.getItem(KEYS.TRACK_STATE) || 'Verde';
  },
  // Set track state and notify subscribers
  setTrackState: (state: string) => {
    localStorage.setItem(KEYS.TRACK_STATE, state);
    notify();
  },
  getLiveTiming: () => {
    const data = localStorage.getItem(KEYS.LIVE_TIMING);
    return data ? JSON.parse(data) : { active: false, flag: 'Verde', sessionTime: 0, pilots: {} };
  },
  setLiveTiming: (data: any) => {
    localStorage.setItem(KEYS.LIVE_TIMING, JSON.stringify(data));
    notify();
  },
  // Added missing associations getter
  getAssociations: () => {
    return INITIAL_ASSOCIATIONS;
  },
  // Added missing circuits getter
  getCircuits: () => {
    return INITIAL_CIRCUITS;
  },
  // Added missing championships getter
  getChampionships: () => {
    return INITIAL_CHAMPIONSHIPS;
  },
  // Added mock users for admin login
  getUsers: () => {
    return [
      { id: 'u1', username: 'admin', role: 'admin', password: 'password' },
      { id: 'u2', username: 'Cronomax', role: 'tecnico', password: 'password' }
    ];
  },
  // Authentication state management
  setAuth: (user: any) => {
    if (user) {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.AUTH);
    }
    notify();
  },
  getAuth: () => {
    const data = localStorage.getItem(KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  },
  // Added audit logging
  addLog: (action: string, type: string) => {
    const logsData = localStorage.getItem(KEYS.LOGS);
    const logs = logsData ? JSON.parse(logsData) : [];
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      type,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(KEYS.LOGS, JSON.stringify([newLog, ...logs].slice(0, 50)));
  },
  // Added missing results getter
  getResults: () => {
    return [];
  },
  // Added missing track info getter
  getTrackInfo: () => {
    return {
      temp: '24°C',
      trackTemp: '32°C',
      humidity: '45%'
    };
  }
};
