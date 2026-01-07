import {
  PriceHistory,
  PriceAnalytics,
  AvailabilityTrend,
  AvailabilityDataPoint,
  TimeRange,
  ComparisonData,
  PerformanceComparison,
  SectionComparison,
  ValueRating,
} from '@/lib/types/analytics';
import { Performance } from '@/lib/types/performance';
import { Section } from '@/lib/types/section';
import { getPerformanceById } from './performances.mock';

function generatePriceHistory(
  performanceId: string,
  sectionId: string,
  currentPrice: number,
  days: number = 30
): PriceHistory[] {
  const history: PriceHistory[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - i);

    // Price varies by ±10% over time, trending slightly upward
    const variation = (Math.random() - 0.4) * 0.1;
    const timeMultiplier = 1 + (days - i) / days * 0.05; // 5% increase over time
    const price = Math.round(currentPrice * (1 + variation) * timeMultiplier);

    // Availability decreases over time
    const baseAvailable = 100 - (days - i) * 2;
    const availableSeats = Math.max(0, baseAvailable + Math.floor(Math.random() * 10));
    const soldSeats = 100 - availableSeats;

    history.push({
      id: `ph_${performanceId}_${sectionId}_${i}`,
      performanceId,
      sectionId,
      timestamp,
      price,
      availableSeats,
      soldSeats,
      changeType: i === days ? undefined : price > history[history.length - 1]?.price ? 'increase' : price < history[history.length - 1]?.price ? 'decrease' : 'unchanged',
    });
  }

  return history;
}

export function generatePriceAnalytics(
  performanceId: string,
  sections: Section[],
  timeRange: TimeRange = '7d'
): PriceAnalytics[] {
  const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 60;

  return sections.map((section) => {
    const history = generatePriceHistory(performanceId, section.id, section.price, days);
    const prices = history.map((h) => h.price);

    const currentPrice = section.price;
    const price24hAgo = history.find((h) => {
      const diff = Date.now() - h.timestamp.getTime();
      return diff >= 23 * 60 * 60 * 1000 && diff <= 25 * 60 * 60 * 1000;
    })?.price || currentPrice;

    const price7dAgo = history.find((h) => {
      const diff = Date.now() - h.timestamp.getTime();
      return diff >= 6.5 * 24 * 60 * 60 * 1000 && diff <= 7.5 * 24 * 60 * 60 * 1000;
    })?.price || currentPrice;

    return {
      sectionId: section.id,
      sectionName: section.name,
      currentPrice,
      history,
      priceChange24h: ((currentPrice - price24hAgo) / price24hAgo) * 100,
      priceChange7d: ((currentPrice - price7dAgo) / price7dAgo) * 100,
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      lastUpdated: new Date(),
    };
  });
}

export function generateAvailabilityTrend(
  performanceId: string,
  sections: Section[],
  timeRange: TimeRange = '7d'
): AvailabilityTrend[] {
  const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 60;

  return sections.map((section) => {
    const dataPoints: AvailabilityDataPoint[] = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - i);

      // Availability decreases over time
      const baseAvailable = section.totalSeats - (days - i) * Math.floor(section.totalSeats / (days + 10));
      const availableSeats = Math.max(0, baseAvailable + Math.floor(Math.random() * 20) - 10);
      const soldSeats = section.totalSeats - availableSeats;

      dataPoints.push({
        timestamp,
        availableSeats,
        soldSeats,
        percentageAvailable: (availableSeats / section.totalSeats) * 100,
      });
    }

    // Calculate selling velocity (seats per hour)
    const firstPoint = dataPoints[0];
    const lastPoint = dataPoints[dataPoints.length - 1];
    const seatsSold = firstPoint.availableSeats - lastPoint.availableSeats;
    const hoursPassed = (lastPoint.timestamp.getTime() - firstPoint.timestamp.getTime()) / (1000 * 60 * 60);
    const sellingVelocity = hoursPassed > 0 ? seatsSold / hoursPassed : 0;

    // Project sellout date
    let projectedSellout: Date | undefined;
    if (sellingVelocity > 0 && lastPoint.availableSeats > 0) {
      const hoursToSellout = lastPoint.availableSeats / sellingVelocity;
      projectedSellout = new Date(Date.now() + hoursToSellout * 60 * 60 * 1000);
    }

    return {
      performanceId,
      sectionId: section.id,
      sectionName: section.name,
      dataPoints,
      sellingVelocity: Math.round(sellingVelocity * 100) / 100,
      projectedSellout,
    };
  });
}

function getValueRating(price: number, avgPrice: number, availabilityPercent: number): ValueRating {
  const priceRatio = price / avgPrice;

  if (priceRatio > 1.3) return 'premium';
  if (priceRatio < 0.7 && availabilityPercent > 30) return 'excellent';
  if (priceRatio < 0.9 && availabilityPercent > 20) return 'good';
  return 'fair';
}

export function generateComparisonData(performanceIds: string[]): ComparisonData {
  const performances: PerformanceComparison[] = [];

  for (const perfId of performanceIds) {
    const performance = getPerformanceById(perfId);
    if (!performance) continue;

    const avgPrice =
      performance.sections.reduce((sum, s) => sum + s.price, 0) / performance.sections.length;

    const sections: SectionComparison[] = performance.sections.map((section) => ({
      sectionName: section.name,
      price: section.price,
      availableSeats: section.availableSeats,
      percentageAvailable: (section.availableSeats / section.totalSeats) * 100,
      pricePerSeat: section.price,
      value: getValueRating(
        section.price,
        avgPrice,
        (section.availableSeats / section.totalSeats) * 100
      ),
    }));

    const recommendedSections = sections
      .filter((s) => s.value === 'excellent' || s.value === 'good')
      .map((s) => s.sectionName);

    performances.push({
      performance,
      sections,
      totalAvailability: (performance.availableSeats / performance.totalSeats) * 100,
      priceRange: performance.priceRange,
      recommendedSections:
        recommendedSections.length > 0 ? recommendedSections : [sections[0]?.sectionName].filter(Boolean),
    });
  }

  return {
    performances,
    generatedAt: new Date(),
  };
}
