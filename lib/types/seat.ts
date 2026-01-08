import { Coordinates } from './venue';

export type SeatStatus = 'available' | 'reserved' | 'sold' | 'blocked';

export interface SeatFeatures {
  accessible?: boolean;
  aisle?: boolean;
  obstructedView?: boolean;
  extraLegroom?: boolean;
}

export interface Seat {
  id: string;
  sectionId: string;
  row: string;
  number: string;
  status: SeatStatus;
  price: number;
  coordinates?: Coordinates;
  features?: SeatFeatures;
}
