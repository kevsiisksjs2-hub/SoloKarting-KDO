
import { Status, Pilot, Championship, Circuit, Association } from './types';

export const INITIAL_CATEGORIES = [
  '150cc KDO Power',
  '150cc Supermaster',
  '150cc Master',
  '150cc Clase 2',
  '150cc Clase 1',
  '150cc Menores',
  'Directo Escuela'
];

export const HISTORICAL_RANKINGS = [
  { name: 'Alvarez, Alexis', ranking: 1, number: '1' },
  { name: 'Cardoso, Tomás', ranking: 2, number: '2' },
  { name: 'Fischer, Patricio', ranking: 3, number: '8' },
  { name: 'Benitez, Bautista', ranking: 4, number: '19' },
  { name: 'Musso, Alessandro', ranking: 5, number: '16' },
  { name: 'Durante, Oreste', ranking: 6, number: '6' },
  { name: 'Langarica, Valentín', ranking: 7, number: '323' },
  { name: 'Montero, Ale', ranking: 8, number: '11' },
  { name: 'Altamirano, Nacho', ranking: 9, number: '88' },
  { name: 'Astudillo, Manuel', ranking: 10, number: '48' }
];

export const INITIAL_ASSOCIATIONS: Association[] = [
  {
    id: 'assoc1',
    name: 'Asociación KDO Buenos Aires',
    description: 'Federación oficial de karting en tierra.',
    circuitIds: ['ci1', 'ci2']
  }
];

export const INITIAL_PILOTS: Pilot[] = [
  { 
    id: '1', number: '1', name: 'JUAN ACOSTA', category: '150cc KDO Power', 
    status: Status.CONFIRMADO, ranking: 1, lastUpdated: new Date().toISOString(), 
    association: 'Asociación KDO Buenos Aires', team: 'ROSSI RACING', 
    medicalLicense: '1001', sportsLicense: '2001', technicalOk: true, paid: true, 
    penaltyPoints: 0, bloodGroup: 'A+', engine: 'ALARCÓN', chassis: 'VARA' 
  },
  { 
    id: '2', number: '12', name: 'MARTÍN GARCÍA', category: '150cc Supermaster', 
    status: Status.PENDIENTE, ranking: 5, lastUpdated: new Date().toISOString(), 
    association: 'Asociación KDO Buenos Aires', team: 'PARTICULAR', 
    medicalLicense: '1004', sportsLicense: '2004', technicalOk: false, paid: false, 
    penaltyPoints: 2, bloodGroup: '0-', engine: 'PEÑA EL RAYO'
  }
];

// Fix: Added missing registrationOpen, slotsTotal, and slotsTaken properties to match Championship interface
export const INITIAL_CHAMPIONSHIPS: Championship[] = [
  {
    id: 'c1',
    name: "Campeonato Provincial de Tierra 2024",
    status: "En curso",
    dates: "Marzo - Diciembre",
    tracks: "Zárate, Chivilcoy, Giles",
    image: "https://images.unsplash.com/photo-1547631618-f29792042761?w=800&auto=format",
    startDate: "2024-03-01",
    registrationOpen: true,
    slotsTotal: 100,
    slotsTaken: 45
  },
  {
    id: 'c2',
    name: "Torneo de Verano Nocturno",
    status: "Próximamente",
    dates: "Enero 2025",
    tracks: "Circuito Chivilcoy",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format",
    startDate: "2025-01-15",
    registrationOpen: false,
    slotsTotal: 60,
    slotsTaken: 0
  }
];

export const INITIAL_CIRCUITS: Circuit[] = [
  {
    id: 'ci1',
    name: 'Kartódromo "Julio Canepa"',
    location: "Chivilcoy, BA",
    length: "1.100 mts",
    image: "https://s11.aconvert.com/convert/p3r68-cdx67/13ion-ed12c.webp",
    description: "La catedral del karting en tierra bonaerense.",
    features: ["Tierra Compactada", "Boxes Techados"]
  }
];
