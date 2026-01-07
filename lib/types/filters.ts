import { EventType, DateRange } from './event';
import { PriceRange } from './performance';

export type AvailabilityFilter = 'all' | 'available' | 'selling_fast' | 'sold_out';

export interface EventFilters {
  search?: string;
  eventTypes?: EventType[];
  venues?: string[];
  dateRange?: DateRange;
  priceRange?: PriceRange;
  availability?: AvailabilityFilter;
}

export interface SortOption {
  field: 'name' | 'date' | 'price' | 'availability';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
