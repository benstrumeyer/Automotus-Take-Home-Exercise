import type { VehicleType, OverstayStatus } from '@/types'

export interface ZoneSeed {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  maxCapacity: number
  vehicles: VehicleSeed[]
}

export interface VehicleSeed {
  plate: string
  type: VehicleType
  make: string
  model: string
  color: string
  spot: string
  arrivalMinutesAgo: number
  timeLimitMinutes: number
}

export function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60000).toISOString()
}

export function computeOverstay(arrivalMinutesAgo: number, timeLimitMinutes: number) {
  const overstay = arrivalMinutesAgo - timeLimitMinutes
  let status: OverstayStatus = 'ok'
  if (overstay > 0) status = 'violation'
  else if (overstay > -5) status = 'approaching'
  return { overstay_minutes: Math.max(0, overstay), overstay_status: status }
}

export const ZONE_SEEDS: ZoneSeed[] = [
  // --- HIGH PRIORITY ZONES ---
  {
    id: 'zone-03', name: 'Chestnut & 18th (W)', address: '1800 Chestnut St (West)',
    lat: 39.9521, lng: -75.1718, maxCapacity: 10,
    vehicles: [
      { plate: 'KYZ-4821', type: 'personal', make: 'Kia', model: 'Forte', color: 'Silver', spot: 'A1', arrivalMinutesAgo: 95, timeLimitMinutes: 60 },
      { plate: 'MBR-7733', type: 'delivery', make: 'Mercedes', model: 'Sprinter', color: 'White', spot: 'A2', arrivalMinutesAgo: 80, timeLimitMinutes: 30 },
      { plate: 'LNP-5519', type: 'personal', make: 'Honda', model: 'CR-V', color: 'Blue', spot: 'A3', arrivalMinutesAgo: 70, timeLimitMinutes: 60 },
      { plate: 'RTX-9982', type: 'rideshare', make: 'Hyundai', model: 'Elantra', color: 'Black', spot: 'A4', arrivalMinutesAgo: 25, timeLimitMinutes: 15 },
    ],
  },
  {
    id: 'zone-04', name: 'Chestnut & 18th (E)', address: '1800 Chestnut St (East)',
    lat: 39.9520, lng: -75.1708, maxCapacity: 12,
    vehicles: [
      { plate: 'JWK-3301', type: 'commercial', make: 'Chevrolet', model: 'Express', color: 'White', spot: 'B1', arrivalMinutesAgo: 120, timeLimitMinutes: 45 },
      { plate: 'DFG-8842', type: 'personal', make: 'Nissan', model: 'Altima', color: 'Red', spot: 'B2', arrivalMinutesAgo: 85, timeLimitMinutes: 60 },
      { plate: 'VBN-2210', type: 'delivery', make: 'Mercedes', model: 'Sprinter', color: 'White', spot: 'B3', arrivalMinutesAgo: 50, timeLimitMinutes: 30 },
      { plate: 'PLK-6677', type: 'personal', make: 'Volkswagen', model: 'Jetta', color: 'Gray', spot: 'B4', arrivalMinutesAgo: 40, timeLimitMinutes: 60 },
      { plate: 'QRS-1148', type: 'rideshare', make: 'Toyota', model: 'Corolla', color: 'White', spot: 'B5', arrivalMinutesAgo: 22, timeLimitMinutes: 15 },
    ],
  },
  {
    id: 'zone-07', name: 'Sansom & 17th (W)', address: '1700 Sansom St (West)',
    lat: 39.9508, lng: -75.1698, maxCapacity: 10,
    vehicles: [
      { plate: 'TYU-5543', type: 'personal', make: 'BMW', model: '3 Series', color: 'Black', spot: 'C1', arrivalMinutesAgo: 100, timeLimitMinutes: 60 },
      { plate: 'WER-8891', type: 'delivery', make: 'Hyundai', model: 'Elantra', color: 'Black', spot: 'C2', arrivalMinutesAgo: 65, timeLimitMinutes: 30 },
      { plate: 'ASD-3320', type: 'personal', make: 'Ford', model: 'Focus', color: 'Blue', spot: 'C3', arrivalMinutesAgo: 55, timeLimitMinutes: 60 },
    ],
  },
  {
    id: 'zone-13', name: 'Sansom & 15th', address: '1500 Sansom St',
    lat: 39.9506, lng: -75.1658, maxCapacity: 10,
    vehicles: [
      { plate: 'HJK-2237', type: 'personal', make: 'Mazda', model: '3', color: 'Red', spot: 'E1', arrivalMinutesAgo: 88, timeLimitMinutes: 60 },
      { plate: 'NMB-6651', type: 'delivery', make: 'Honda', model: 'CR-V', color: 'Blue', spot: 'E2', arrivalMinutesAgo: 42, timeLimitMinutes: 30 },
      { plate: 'OIU-3384', type: 'personal', make: 'Volkswagen', model: 'Jetta', color: 'Gray', spot: 'E3', arrivalMinutesAgo: 68, timeLimitMinutes: 60 },
      { plate: 'YTR-7790', type: 'commercial', make: 'Audi', model: 'A4', color: 'Black', spot: 'E4', arrivalMinutesAgo: 55, timeLimitMinutes: 45 },
    ],
  },
  {
    id: 'zone-15', name: 'Rittenhouse NE', address: 'S 17th & Walnut (NE of Square)',
    lat: 39.9496, lng: -75.1700, maxCapacity: 12,
    vehicles: [
      { plate: 'EWQ-1123', type: 'personal', make: 'Audi', model: 'A4', color: 'Black', spot: 'F1', arrivalMinutesAgo: 92, timeLimitMinutes: 60 },
      { plate: 'POI-8845', type: 'rideshare', make: 'Toyota', model: 'Corolla', color: 'White', spot: 'F2', arrivalMinutesAgo: 25, timeLimitMinutes: 15 },
      { plate: 'ZXC-5567', type: 'delivery', make: 'Chevrolet', model: 'Express', color: 'White', spot: 'F3', arrivalMinutesAgo: 48, timeLimitMinutes: 30 },
      { plate: 'MNB-9903', type: 'personal', make: 'Lexus', model: 'ES', color: 'Silver', spot: 'F4', arrivalMinutesAgo: 70, timeLimitMinutes: 60 },
    ],
  },
  {
    id: 'zone-18', name: 'Broad & Sansom', address: 'S Broad St & Sansom St',
    lat: 39.9506, lng: -75.1648, maxCapacity: 14,
    vehicles: [
      { plate: 'GHJ-4478', type: 'commercial', make: 'Mazda', model: '3', color: 'Red', spot: 'G1', arrivalMinutesAgo: 110, timeLimitMinutes: 45 },
      { plate: 'KLM-2256', type: 'personal', make: 'Honda', model: 'CR-V', color: 'Blue', spot: 'G2', arrivalMinutesAgo: 78, timeLimitMinutes: 60 },
      { plate: 'BVC-7712', type: 'delivery', make: 'Mercedes', model: 'Sprinter', color: 'White', spot: 'G3', arrivalMinutesAgo: 55, timeLimitMinutes: 30 },
      { plate: 'XSW-3390', type: 'personal', make: 'BMW', model: '3 Series', color: 'Black', spot: 'G4', arrivalMinutesAgo: 35, timeLimitMinutes: 60 },
    ],
  },
  {
    id: 'zone-19', name: 'Broad & Walnut', address: 'S Broad St & Walnut St',
    lat: 39.9490, lng: -75.1648, maxCapacity: 15,
    vehicles: [
      { plate: 'QAZ-5534', type: 'personal', make: 'Lexus', model: 'ES', color: 'Silver', spot: 'H1', arrivalMinutesAgo: 105, timeLimitMinutes: 60 },
      { plate: 'WSX-8867', type: 'rideshare', make: 'Hyundai', model: 'Elantra', color: 'Black', spot: 'H2', arrivalMinutesAgo: 28, timeLimitMinutes: 15 },
      { plate: 'EDC-1143', type: 'delivery', make: 'Mazda', model: '3', color: 'Red', spot: 'H3', arrivalMinutesAgo: 62, timeLimitMinutes: 30 },
      { plate: 'RFV-6679', type: 'commercial', make: 'Nissan', model: 'Altima', color: 'Red', spot: 'H4', arrivalMinutesAgo: 58, timeLimitMinutes: 45 },
      { plate: 'TGB-2201', type: 'personal', make: 'Volkswagen', model: 'Jetta', color: 'Gray', spot: 'H5', arrivalMinutesAgo: 72, timeLimitMinutes: 60 },
    ],
  },
  // --- MEDIUM PRIORITY ZONES ---
  {
    id: 'zone-02', name: 'Chestnut & 19th (S)', address: '1900 Chestnut St (South)',
    lat: 39.9518, lng: -75.1728, maxCapacity: 8,
    vehicles: [
      { plate: 'BGT-3345', type: 'personal', make: 'BMW', model: '3 Series', color: 'Black', spot: 'K1', arrivalMinutesAgo: 57, timeLimitMinutes: 60 },
      { plate: 'FRD-7718', type: 'delivery', make: 'Honda', model: 'CR-V', color: 'Blue', spot: 'K2', arrivalMinutesAgo: 27, timeLimitMinutes: 30 },
      { plate: 'VHJ-2290', type: 'personal', make: 'Mazda', model: '3', color: 'Red', spot: 'K3', arrivalMinutesAgo: 48, timeLimitMinutes: 60 },
    ],
  },
  {
    id: 'zone-06', name: 'Sansom & 18th', address: '1800 Sansom St',
    lat: 39.9509, lng: -75.1712, maxCapacity: 8,
    vehicles: [
      { plate: 'KHG-6634', type: 'personal', make: 'Nissan', model: 'Altima', color: 'Red', spot: 'L1', arrivalMinutesAgo: 58, timeLimitMinutes: 60 },
      { plate: 'PLO-1187', type: 'rideshare', make: 'Kia', model: 'Forte', color: 'Silver', spot: 'L2', arrivalMinutesAgo: 13, timeLimitMinutes: 15 },
      { plate: 'WQE-5540', type: 'commercial', make: 'BMW', model: '3 Series', color: 'Black', spot: 'L3', arrivalMinutesAgo: 42, timeLimitMinutes: 45 },
    ],
  },
  {
    id: 'zone-09', name: 'Chestnut & 17th', address: '1700 Chestnut St',
    lat: 39.9520, lng: -75.1695, maxCapacity: 10,
    vehicles: [
      { plate: 'RST-8873', type: 'personal', make: 'Volkswagen', model: 'Jetta', color: 'Gray', spot: 'M1', arrivalMinutesAgo: 56, timeLimitMinutes: 60 },
      { plate: 'UVW-4406', type: 'delivery', make: 'Mazda', model: '3', color: 'Red', spot: 'M2', arrivalMinutesAgo: 28, timeLimitMinutes: 30 },
      { plate: 'XYZ-1139', type: 'personal', make: 'Kia', model: 'Forte', color: 'Silver', spot: 'M3', arrivalMinutesAgo: 50, timeLimitMinutes: 60 },
    ],
  },
  {
    id: 'zone-12', name: 'Sansom & 16th', address: '1600 Sansom St',
    lat: 39.9507, lng: -75.1675, maxCapacity: 8,
    vehicles: [
      { plate: 'ABC-6672', type: 'personal', make: 'Lexus', model: 'ES', color: 'Silver', spot: 'N1', arrivalMinutesAgo: 57, timeLimitMinutes: 60 },
      { plate: 'DEF-3305', type: 'commercial', make: 'Hyundai', model: 'Elantra', color: 'Black', spot: 'N2', arrivalMinutesAgo: 43, timeLimitMinutes: 45 },
    ],
  },
  {
    id: 'zone-14', name: 'Rittenhouse NW', address: 'S 18th & Walnut (NW of Square)',
    lat: 39.9496, lng: -75.1718, maxCapacity: 8,
    vehicles: [
      { plate: 'GHI-9938', type: 'personal', make: 'Lexus', model: 'ES', color: 'Silver', spot: 'O1', arrivalMinutesAgo: 56, timeLimitMinutes: 60 },
      { plate: 'JKL-2261', type: 'delivery', make: 'Mercedes', model: 'Sprinter', color: 'White', spot: 'O2', arrivalMinutesAgo: 26, timeLimitMinutes: 30 },
      { plate: 'MNO-5594', type: 'rideshare', make: 'Honda', model: 'CR-V', color: 'Blue', spot: 'O3', arrivalMinutesAgo: 12, timeLimitMinutes: 15 },
    ],
  },
  {
    id: 'zone-16', name: '17th & Walnut', address: 'S 17th St & Walnut St',
    lat: 39.9492, lng: -75.1695, maxCapacity: 10,
    vehicles: [
      { plate: 'PQR-8827', type: 'personal', make: 'Volkswagen', model: 'Jetta', color: 'Gray', spot: 'P1', arrivalMinutesAgo: 55, timeLimitMinutes: 60 },
      { plate: 'STU-1160', type: 'delivery', make: 'Ford', model: 'Focus', color: 'Blue', spot: 'P2', arrivalMinutesAgo: 27, timeLimitMinutes: 30 },
      { plate: 'VWX-4493', type: 'personal', make: 'Honda', model: 'CR-V', color: 'Blue', spot: 'P3', arrivalMinutesAgo: 45, timeLimitMinutes: 60 },
    ],
  },
  // --- CLEAR ZONES ---
  {
    id: 'zone-01', name: 'Chestnut & 19th (N)', address: '1900 Chestnut St (North)',
    lat: 39.9522, lng: -75.1730, maxCapacity: 6,
    vehicles: [
      { plate: 'WXY-4490', type: 'personal', make: 'Mazda', model: '3', color: 'Red', spot: 'T1', arrivalMinutesAgo: 15, timeLimitMinutes: 60 },
      { plate: 'ZAB-7723', type: 'delivery', make: 'Lexus', model: 'ES', color: 'Silver', spot: 'T2', arrivalMinutesAgo: 10, timeLimitMinutes: 30 },
    ],
  },
  {
    id: 'zone-05', name: 'Sansom & 19th', address: '1900 Sansom St',
    lat: 39.9510, lng: -75.1728, maxCapacity: 6,
    vehicles: [
      { plate: 'CDE-1156', type: 'personal', make: 'Audi', model: 'A4', color: 'Black', spot: 'U1', arrivalMinutesAgo: 20, timeLimitMinutes: 60 },
      { plate: 'FGH-4489', type: 'rideshare', make: 'Toyota', model: 'Corolla', color: 'White', spot: 'U2', arrivalMinutesAgo: 5, timeLimitMinutes: 15 },
    ],
  },
]
