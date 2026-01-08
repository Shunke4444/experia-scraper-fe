import { Performance } from './performance';
import { PriceRange } from './performance';

export type PriceChangeType = 'increase' | 'decrease' | 'unchanged';

export interface PriceHistory {
  id: string;
  performanceId: string;
  sectionId: string;
  timestamp: Date;
  price: number;
  availableSeats: number;
  soldSeats: number;
  changeType?: PriceChangeType;
}

export interface PriceAnalytics {
  sectionId: string;
  sectionName: string;
  currentPrice: number;
  history: PriceHistory[];
  priceChange24h: number;
  priceChange7d: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  lastUpdated: Date;
}

export interface AvailabilityDataPoint {
  timestamp: Date;
  availableSeats: number;
  soldSeats: number;
  percentageAvailable: number;
}

export interface AvailabilityTrend {
  performanceId: string;
  sectionId: string;
  sectionName: string;
  dataPoints: AvailabilityDataPoint[];
  sellingVelocity: number;
  projectedSellout?: Date;
}

export type ValueRating = 'excellent' | 'good' | 'fair' | 'premium';

export interface SectionComparison {
  sectionName: string;
  price: number;
  availableSeats: number;
  percentageAvailable: number;
  pricePerSeat: number;
  value: ValueRating;
}

export interface PerformanceComparison {
  performance: Performance;
  sections: SectionComparison[];
  totalAvailability: number;
  priceRange: PriceRange;
  recommendedSections: string[];
}

export interface ComparisonData {
  performances: PerformanceComparison[];
  generatedAt: Date;
}

export type TimeRange = '24h' | '7d' | '30d' | 'all';
export type Granularity = 'hour' | 'day' | 'week';
