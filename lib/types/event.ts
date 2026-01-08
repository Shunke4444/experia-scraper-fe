import { Venue } from './venue';
import { Performance } from './performance';

export type EventType =
  | 'ballet'
  | 'opera'
  | 'theater'
  | 'concert'
  | 'musical'
  | 'dance'
  | 'other';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  venue: Venue;
  eventType: EventType;
  dateRange: DateRange;
  thumbnail: string;
  performances: Performance[];
  performanceCount?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventListItem {
  id: string;
  name: string;
  description: string;
  venue: {
    id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  eventType: EventType;
  dateRange: DateRange;
  thumbnail: string;
  performanceCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
