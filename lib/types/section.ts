import { Seat } from './seat';

export type PriceTier = 'premium' | 'standard' | 'value' | 'accessible';

export interface SectionLocation {
  floor: string;
  position: string;
  distanceFromStage?: number;
}

export interface Row {
  row: string;
  seats: Seat[];
}

export interface Section {
  id: string;
  performanceId: string;
  name: string;
  priceTier: PriceTier;
  price: number;
  totalSeats: number;
  availableSeats: number;
  location: SectionLocation;
  amenities: string[];
  restrictions?: string[];
  rows: Row[];
}
