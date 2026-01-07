import { Performance, PerformanceListItem, PerformanceStatus, PriceRange } from '@/lib/types/performance';
import { generateMockEvents, getEventById } from './events.mock';
import { generateMockVenue, getRandomVenue } from './venues.mock';
import { generateMockSections } from './sections.mock';

function generatePerformanceId(): string {
  return `perf_${Math.random().toString(36).substring(2, 9)}`;
}

function getPerformanceStatus(availableSeats: number, totalSeats: number): PerformanceStatus {
  const availablePercent = availableSeats / totalSeats;
  if (availablePercent === 0) return 'sold_out';
  if (availablePercent < 0.2) return 'selling_fast';
  return 'on_sale';
}

function generatePerformanceDates(eventStartDate: Date, count: number): Date[] {
  const dates: Date[] = [];
  const startDate = new Date(eventStartDate);

  for (let i = 0; i < count; i++) {
    const perfDate = new Date(startDate);
    perfDate.setDate(perfDate.getDate() + Math.floor(i / 2) * 7 + (i % 2) * 3);

    // Set time to either 2pm or 7:30pm
    if (i % 2 === 0) {
      perfDate.setHours(19, 30, 0, 0);
    } else {
      perfDate.setHours(14, 0, 0, 0);
    }

    dates.push(perfDate);
  }

  return dates;
}

const performanceCache: Map<string, Performance[]> = new Map();

export function generatePerformancesForEvent(eventId: string): Performance[] {
  if (performanceCache.has(eventId)) {
    return performanceCache.get(eventId)!;
  }

  const event = getEventById(eventId);
  if (!event) return [];

  const performanceCount = event.performanceCount || 5;
  const dates = generatePerformanceDates(event.dateRange.start, performanceCount);
  const venue = generateMockVenue(event.venue.id) || getRandomVenue();

  const performances: Performance[] = dates.map((date, index) => {
    const perfId = generatePerformanceId();
    const soldPercentage = 0.2 + Math.random() * 0.6; // 20-80% sold
    const sections = generateMockSections(perfId, soldPercentage);

    const totalSeats = sections.reduce((sum, s) => sum + s.totalSeats, 0);
    const availableSeats = sections.reduce((sum, s) => sum + s.availableSeats, 0);
    const soldSeats = totalSeats - availableSeats;

    const prices = sections.map((s) => s.price);
    const priceRange: PriceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };

    const doorsDate = new Date(date);
    doorsDate.setHours(doorsDate.getHours() - 1);

    return {
      id: perfId,
      eventId,
      venue,
      performanceDate: date,
      doors: doorsDate,
      duration: 150 + Math.floor(Math.random() * 30),
      status: getPerformanceStatus(availableSeats, totalSeats),
      sections,
      totalSeats,
      availableSeats,
      soldSeats,
      priceRange,
      metadata: {
        cast: ['Principal Artist 1', 'Principal Artist 2', 'Ensemble'],
        runtime: 150,
        intermissions: 1,
        ageRestriction: 'All ages',
        specialNotes: index === 0 ? 'Opening night performance' : undefined,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  performanceCache.set(eventId, performances);
  return performances;
}

export function getPerformanceById(performanceId: string): Performance | undefined {
  for (const [, performances] of performanceCache) {
    const found = performances.find((p) => p.id === performanceId);
    if (found) return found;
  }

  // Generate performances for all events to find the one we need
  const { data: events } = generateMockEvents();
  for (const event of events) {
    const performances = generatePerformancesForEvent(event.id);
    const found = performances.find((p) => p.id === performanceId);
    if (found) return found;
  }

  return undefined;
}

export function getPerformanceListItems(eventId: string): PerformanceListItem[] {
  const performances = generatePerformancesForEvent(eventId);
  return performances.map((p) => ({
    id: p.id,
    performanceDate: p.performanceDate,
    status: p.status,
    availableSeats: p.availableSeats,
    totalSeats: p.totalSeats,
    priceRange: p.priceRange,
  }));
}
