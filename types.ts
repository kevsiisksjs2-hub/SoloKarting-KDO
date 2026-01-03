
export type Category = string;

export enum Status {
  CONFIRMADO = 'Confirmado',
  PENDIENTE = 'Pending',
  BAJA = 'Baja'
}

export enum TrackFlag {
  GREEN = 'Verde',
  YELLOW = 'Amarilla',
  RED = 'Roja',
  BLACK = 'Negra',
  BLUE = 'Azul',
  CHECKERED = 'Cuadriculada'
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  date: string;
}

export interface PilotStats {
  races: number;
  wins: number;
  podiums: number;
  poles: number;
  points: number;
}

export interface Pilot {
  id: string;
  number: string;
  name: string;
  category: Category;
  status: Status;
  ranking: number;
  association: string;
  team: string;
  medicalLicense: string;
  sportsLicense: string;
  technicalOk: boolean;
  paid: boolean;
  chassis?: string;
  engine?: string;
  sealNumber?: string;
  bloodGroup?: string;
  allergies?: string;
  lastUpdated: string;
  penaltyPoints: number;
  achievements?: Achievement[];
  stats?: PilotStats;
  transponderId?: string; // Nuevo campo para cronometraje
}

export interface Incident {
  id: string;
  pilotId: string;
  pilotName: string;
  type: 'Apercibimiento' | 'Recargo' | 'Exclusión' | 'Advertencia';
  description: string;
  pointsPenalty: number;
  timestamp: string;
  official: string;
  resolved: boolean;
}

export interface RaceResult {
  id: string;
  category: Category;
  date: string;
  circuit: string;
  weather: 'Seco' | 'Lluvia' | 'Húmedo';
  temp?: string;
  bestLap?: string;
  gapAnalysis?: string;
  liveLink?: string;
  podium: {
    p1: string;
    p2: string;
    p3: string;
  };
  details: {
    pos: number;
    number: string;
    name: string;
    points: number;
    gap?: string;
    bestLap?: string;
    sectors?: {
      s1?: string;
      s2?: string;
      s3?: string;
    };
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  date: string;
  author: string;
}

export interface Regulation {
  id: string;
  title: string;
  type: 'Deportivo' | 'Técnico';
  date: string;
  url?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'director' | 'tecnico' | 'comisario';
  password?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  timestamp: string;
  type: 'security' | 'data' | 'track' | 'system';
}

export interface Championship {
  id: string;
  name: string;
  status: 'En curso' | 'Próximamente' | 'Finalizado';
  dates: string;
  tracks: string;
  image: string;
  startDate?: string;
  registrationOpen: boolean;
  slotsTotal: number;
  slotsTaken: number;
}

export interface CircuitSector {
  id: string;
  name: string;
  description?: string;
}

export interface Circuit {
  id: string;
  name: string;
  location: string;
  length: string;
  image: string;
  description: string;
  features: string[];
  lat?: number;
  lng?: number;
  sectors?: CircuitSector[];
}

export interface Association {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  circuitIds?: string[];
}
