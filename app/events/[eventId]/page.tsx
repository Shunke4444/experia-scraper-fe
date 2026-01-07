'use client';

import { use } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Ticket, ArrowLeft } from 'lucide-react';
import { useEventWithPerformances } from '@/hooks/use-events';
import { PerformanceList } from '@/components/performances/performance-list';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorDisplay } from '@/components/shared/error-boundary';
import { AppBreadcrumb } from '@/components/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateRange } from '@/lib/utils/date-formatter';
import { formatPriceRange } from '@/lib/utils/price-formatter';

interface EventDetailPageProps {
  params: Promise<{ eventId: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { eventId } = use(params);
  const { data, isLoading, error, refetch } = useEventWithPerformances(eventId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay
          title="Event not found"
          message="We couldn't find this event. It may have been removed or the link is incorrect."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { event, performances } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <AppBreadcrumb
        items={[
          { label: 'Events', href: '/events' },
          { label: event.name },
        ]}
      />

      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/events" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      </Button>

      {/* Event Header */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Event Image Placeholder */}
        <div className="lg:col-span-1">
          <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Ticket className="h-20 w-20 text-primary/30" />
          </div>
        </div>

        {/* Event Details */}
        <div className="lg:col-span-2">
          <div className="flex items-start gap-3 flex-wrap">
            <Badge variant="secondary" className="capitalize">
              {event.eventType.replace('_', ' ')}
            </Badge>
          </div>

          <h1 className="mt-3 text-3xl font-bold">{event.name}</h1>

          <div className="mt-4 space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{event.venue.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formatDateRange(event.dateRange.start, event.dateRange.end)}</span>
            </div>
          </div>

          <p className="mt-4 text-muted-foreground">{event.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Price Range</p>
              <p className="text-xl font-semibold text-primary">
                {formatPriceRange(event.priceRange.min, event.priceRange.max)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Performances</p>
              <p className="text-xl font-semibold">{performances.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performances */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Performances</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceList performances={performances} eventId={eventId} />
        </CardContent>
      </Card>
    </div>
  );
}
