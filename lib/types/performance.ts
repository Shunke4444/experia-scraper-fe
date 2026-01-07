import { Venue } from './venue';
import { Section } from './section';
import { Event } from './event';

export type PerformanceStatus =
  | 'on_sale'
  | 'selling_fast'
  | 'sold_out'
  | 'cancelled'
  | 'postponed';

export interface PriceRange {
  min: number;
  max: number;
}

export interface PerformanceMetadata {
  cast?: string[];
  runtime?: number;
  intermissions?: number;
  ageRestriction?: string;
  specialNotes?: string;
}

export interface Performance {
  id: string;
  eventId: string;
  event?: Event;
  venue: Venue;
  performanceDate: Date;
  doors: Date;
  duration: number;
  status: PerformanceStatus;
  sections: Section[];
  totalSeats: number;
  availableSeats: number;
  soldSeats: number;
  priceRange: PriceRange;
  metadata: PerformanceMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceListItem {
  id: string;
  performanceDate: Date;
  status: PerformanceStatus;
  availableSeats: number;
  totalSeats: number;
  priceRange: PriceRange;
}
