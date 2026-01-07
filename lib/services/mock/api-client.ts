import { EventListItem, Event } from '@/lib/types/event';
import { Performance, PerformanceListItem } from '@/lib/types/performance';
import { Venue } from '@/lib/types/venue';
import { EventFilters, PaginationInfo } from '@/lib/types/filters';
import {
  PriceAnalytics,
  AvailabilityTrend,
  ComparisonData,
  TimeRange,
} from '@/lib/types/analytics';
import { Section } from '@/lib/types/section';

import { generateMockEvents, getEventById } from './events.mock';
import { generateMockVenue, generateMockVenues } from './venues.mock';
import {
  generatePerformancesForEvent,
  getPerformanceById,
  getPerformanceListItems,
} from './performances.mock';
import {
  generatePriceAnalytics,
  generateAvailabilityTrend,
  generateComparisonData,
} from './analytics.mock';
import { generateSeatMapData, updateSeatCoordinates, SeatMapResponse } from './seats.mock';

const MOCK_DELAY_MS = parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY_MS || '300', 10);

class MockApiClient {
  private async simulateDelay(ms: number = MOCK_DELAY_MS): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private simulateError(): boolean {
    // 5% chance of error for testing error states
    return Math.random() < 0.05;
  }

  async getEvents(
    filters?: EventFilters
  ): Promise<{ data: EventListItem[]; pagination: PaginationInfo }> {
    await this.simulateDelay();
    return generateMockEvents(filters);
  }

  async getEvent(eventId: string): Promise<EventListItem | null> {
    await this.simulateDelay(200);
    const event = getEventById(eventId);
    return event || null;
  }

  async getEventWithPerformances(
    eventId: string
  ): Promise<{ event: EventListItem; performances: PerformanceListItem[] } | null> {
    await this.simulateDelay(300);
    const event = getEventById(eventId);
    if (!event) return null;

    const performances = getPerformanceListItems(eventId);
    return { event, performances };
  }

  async getPerformances(eventId: string): Promise<PerformanceListItem[]> {
    await this.simulateDelay(200);
    return getPerformanceListItems(eventId);
  }

  async getPerformance(performanceId: string): Promise<Performance | null> {
    await this.simulateDelay(250);
    const performance = getPerformanceById(performanceId);
    return performance || null;
  }

  async getSeatMap(performanceId: string): Promise<SeatMapResponse | null> {
    await this.simulateDelay(400);
    const performance = getPerformanceById(performanceId);
    if (!performance) return null;

    const sectionsWithCoords = updateSeatCoordinates(performance.sections);
    const seatMapData = generateSeatMapData(sectionsWithCoords);

    return {
      performanceId,
      venue: {
        id: performance.venue.id,
        name: performance.venue.name,
        layout: {
          type: performance.venue.layout.type,
          floors: performance.venue.layout.floors,
          seatMapData,
        },
      },
      sections: sectionsWithCoords,
    };
  }

  async getPriceHistory(
    performanceId: string,
    options?: { sectionIds?: string[]; timeRange?: TimeRange }
  ): Promise<PriceAnalytics[]> {
    await this.simulateDelay(350);
    const performance = getPerformanceById(performanceId);
    if (!performance) return [];

    let sections = performance.sections;
    if (options?.sectionIds && options.sectionIds.length > 0) {
      sections = sections.filter((s) => options.sectionIds!.includes(s.id));
    }

    return generatePriceAnalytics(performanceId, sections, options?.timeRange || '7d');
  }

  async getAvailability(
    performanceId: string,
    options?: { sectionIds?: string[]; timeRange?: TimeRange }
  ): Promise<AvailabilityTrend[]> {
    await this.simulateDelay(350);
    const performance = getPerformanceById(performanceId);
    if (!performance) return [];

    let sections = performance.sections;
    if (options?.sectionIds && options.sectionIds.length > 0) {
      sections = sections.filter((s) => options.sectionIds!.includes(s.id));
    }

    return generateAvailabilityTrend(performanceId, sections, options?.timeRange || '7d');
  }

  async comparePerformances(performanceIds: string[]): Promise<ComparisonData> {
    await this.simulateDelay(400);
    return generateComparisonData(performanceIds);
  }

  async getVenue(venueId: string): Promise<Venue | null> {
    await this.simulateDelay(150);
    const venue = generateMockVenue(venueId);
    return venue || null;
  }

  async getVenues(): Promise<Venue[]> {
    await this.simulateDelay(200);
    return generateMockVenues();
  }
}

export const apiClient = new MockApiClient();
export default apiClient;
