'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePerformance } from '@/hooks/use-performances';
import { useEvent } from '@/hooks/use-events';
import { usePriceHistory, useAvailability } from '@/hooks/use-analytics';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorDisplay } from '@/components/shared/error-boundary';
import { AppBreadcrumb } from '@/components/layout/breadcrumb';
import { PriceHistoryChart } from '@/components/analytics/price-history-chart';
import { AvailabilityHeatmap } from '@/components/analytics/availability-heatmap';
import { SellingVelocityCard } from '@/components/analytics/selling-velocity-card';
import { TrendCard } from '@/components/analytics/trend-indicator';
import { Button } from '@/components/ui/button';
import { TimeRange } from '@/lib/types/analytics';
import { formatDate } from '@/lib/utils/date-formatter';
import { formatPrice } from '@/lib/utils/price-formatter';

interface AnalyticsPageProps {
  params: Promise<{ eventId: string; performanceId: string }>;
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { eventId, performanceId } = use(params);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const { data: performance, isLoading: perfLoading } = usePerformance(performanceId);
  const { data: event } = useEvent(eventId);
  const {
    data: priceHistory,
    isLoading: priceLoading,
    error: priceError,
  } = usePriceHistory(performanceId, { timeRange });
  const {
    data: availability,
    isLoading: availLoading,
    error: availError,
  } = useAvailability(performanceId, { timeRange });

  const isLoading = perfLoading || priceLoading || availLoading;
  const error = priceError || availError;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (error || !performance) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay
          title="Failed to load analytics"
          message="We couldn't load the analytics data. Please try again."
        />
      </div>
    );
  }

  // Calculate summary stats
  const avgCurrentPrice =
    priceHistory && priceHistory.length > 0
      ? priceHistory.reduce((sum, s) => sum + s.currentPrice, 0) / priceHistory.length
      : 0;
  const avgPriceChange =
    priceHistory && priceHistory.length > 0
      ? priceHistory.reduce((sum, s) => sum + s.priceChange24h, 0) / priceHistory.length
      : 0;
  const lowestPrice =
    priceHistory && priceHistory.length > 0
      ? Math.min(...priceHistory.map((s) => s.lowestPrice))
      : 0;
  const highestPrice =
    priceHistory && priceHistory.length > 0
      ? Math.max(...priceHistory.map((s) => s.highestPrice))
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <AppBreadcrumb
        items={[
          { label: 'Events', href: '/events' },
          { label: event?.name || 'Event', href: `/events/${eventId}` },
          {
            label: formatDate(performance.performanceDate),
            href: `/events/${eventId}/performances/${performanceId}`,
          },
          { label: 'Analytics' },
        ]}
      />

      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={`/events/${eventId}/performances/${performanceId}`} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Performance
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Price Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          {event?.name} - {formatDate(performance.performanceDate)}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TrendCard
          title="Average Price"
          value={formatPrice(avgCurrentPrice)}
          change={avgPriceChange}
        />
        <TrendCard title="Lowest Price" value={formatPrice(lowestPrice)} />
        <TrendCard title="Highest Price" value={formatPrice(highestPrice)} />
        <TrendCard
          title="Available Seats"
          value={performance.availableSeats.toLocaleString()}
        />
      </div>

      {/* Price History Chart */}
      <div className="mb-8">
        <PriceHistoryChart
          data={priceHistory || []}
          selectedTimeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>

      {/* Availability & Velocity */}
      <div className="grid gap-8 lg:grid-cols-2">
        <AvailabilityHeatmap data={availability || []} />
        <SellingVelocityCard data={availability || []} />
      </div>
    </div>
  );
}
