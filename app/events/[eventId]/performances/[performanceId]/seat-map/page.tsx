'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppBreadcrumb } from '@/components/layout/breadcrumb';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorDisplay } from '@/components/shared/error-boundary';
import { SeatMapSVG } from '@/components/seat-map';
import { usePerformance } from '@/hooks/use-performances';
import { useEvent } from '@/hooks/use-events';
import { useSeatMap } from '@/hooks/use-seat-map';
import { formatDate, formatTime } from '@/lib/utils/date-formatter';
import { formatPrice } from '@/lib/utils/price-formatter';
import { Seat } from '@/lib/types/seat';
import { Section } from '@/lib/types/section';

interface SeatMapPageProps {
  params: Promise<{ eventId: string; performanceId: string }>;
}

export default function SeatMapPage({ params }: SeatMapPageProps) {
  const { eventId, performanceId } = use(params);

  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
  } = useEvent(eventId);

  const {
    data: performance,
    isLoading: performanceLoading,
    error: performanceError,
  } = usePerformance(performanceId);

  const {
    data: seatMapData,
    isLoading: seatMapLoading,
    error: seatMapError,
  } = useSeatMap(performanceId);

  const isLoading = eventLoading || performanceLoading || seatMapLoading;
  const error = eventError || performanceError || seatMapError;

  const handleSeatSelect = (seat: Seat, section: Section) => {
    // In a real app, this would add seat to cart or selection state
    console.log('Selected seat:', seat, 'in section:', section);
    alert(`Selected: ${section.name} - Row ${seat.row}, Seat ${seat.number}\nPrice: ${formatPrice(seat.price)}`);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingSkeleton variant="seat-map" />
      </div>
    );
  }

  if (error || !event || !performance || !seatMapData) {
    return (
      <div className="container py-8">
        <ErrorDisplay
          title="Seat map not found"
          message="We couldn't load the seat map. Please try again."
        />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Events', href: '/events' },
    { label: event.name, href: `/events/${eventId}` },
    {
      label: formatDate(performance.performanceDate, 'medium'),
      href: `/events/${eventId}/performances/${performanceId}`,
    },
    { label: 'Seat Map' },
  ];

  // Calculate availability stats
  const totalSeats = seatMapData.sections.reduce(
    (sum, section) => sum + section.totalSeats,
    0
  );
  const availableSeats = seatMapData.sections.reduce(
    (sum, section) => sum + section.availableSeats,
    0
  );
  const priceRange = {
    min: Math.min(...seatMapData.sections.map((s) => s.price)),
    max: Math.max(...seatMapData.sections.map((s) => s.price)),
  };

  return (
    <div className="container py-8">
      <AppBreadcrumb items={breadcrumbItems} className="mb-6" />

      {/* Back button and title */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/events/${eventId}/performances/${performanceId}`}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to performance</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-muted-foreground">Select your seats</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Seat Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Interactive Seat Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SeatMapSVG
              sections={seatMapData.sections}
              onSeatSelect={handleSeatSelect}
              className="min-h-[500px]"
            />
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Performance Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(performance.performanceDate, 'long')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTime(performance.performanceDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.venue.name}</span>
              </div>
            </CardContent>
          </Card>

          {/* Availability Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Seats</span>
                <span className="font-medium">{totalSeats.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium text-green-600">
                  {availableSeats.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Range</span>
                <span className="font-medium">
                  {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </span>
              </div>

              {/* Availability bar */}
              <div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width: `${(availableSeats / totalSeats) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground text-right">
                  {((availableSeats / totalSeats) * 100).toFixed(1)}% available
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {seatMapData.sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between rounded-lg border p-2 text-sm"
                  >
                    <div>
                      <span className="font-medium">{section.name}</span>
                      <span className="ml-2 text-muted-foreground capitalize">
                        ({section.priceTier})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPrice(section.price)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {section.availableSeats} / {section.totalSeats}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" asChild>
                <Link
                  href={`/events/${eventId}/performances/${performanceId}/analytics`}
                >
                  View Price Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
