'use client';

import { use } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, ArrowLeft, BarChart3, Map } from 'lucide-react';
import { usePerformance } from '@/hooks/use-performances';
import { useEvent } from '@/hooks/use-events';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorDisplay } from '@/components/shared/error-boundary';
import { AppBreadcrumb } from '@/components/layout/breadcrumb';
import { AvailabilityBadge, AvailabilityIndicator } from '@/components/performances/availability-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatTime, formatDuration } from '@/lib/utils/date-formatter';
import { formatPrice } from '@/lib/utils/price-formatter';

interface PerformanceDetailPageProps {
  params: Promise<{ eventId: string; performanceId: string }>;
}

export default function PerformanceDetailPage({ params }: PerformanceDetailPageProps) {
  const { eventId, performanceId } = use(params);
  const { data: performance, isLoading, error, refetch } = usePerformance(performanceId);
  const { data: event } = useEvent(eventId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (error || !performance) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay
          title="Performance not found"
          message="We couldn't find this performance. It may have been cancelled or the link is incorrect."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AppBreadcrumb
        items={[
          { label: 'Events', href: '/events' },
          { label: event?.name || 'Event', href: `/events/${eventId}` },
          { label: formatDate(performance.performanceDate) },
        ]}
      />

      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={`/events/${eventId}`} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Event
        </Link>
      </Button>

      {/* Performance Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <AvailabilityBadge status={performance.status} />
        </div>

        <h1 className="mt-3 text-3xl font-bold">{event?.name || 'Performance'}</h1>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span>{formatDate(performance.performanceDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>{formatTime(performance.performanceDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span>{performance.venue.name}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{formatDuration(performance.duration)}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/events/${eventId}/performances/${performanceId}/seat-map`} className="gap-2">
            <Map className="h-4 w-4" />
            View Seat Map
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/events/${eventId}/performances/${performanceId}/analytics`} className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Price Analytics
          </Link>
        </Button>
      </div>

      {/* Overall Availability */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Availability Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Seats</p>
              <p className="text-2xl font-bold">{performance.totalSeats.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {performance.availableSeats.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sold</p>
              <p className="text-2xl font-bold text-muted-foreground">
                {performance.soldSeats.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <AvailabilityIndicator
              available={performance.availableSeats}
              total={performance.totalSeats}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sections & Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performance.sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.name}</TableCell>
                  <TableCell>
                    <span className="capitalize">{section.priceTier}</span>
                  </TableCell>
                  <TableCell>{formatPrice(section.price)}</TableCell>
                  <TableCell>
                    {section.availableSeats} / {section.totalSeats}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="w-24 ml-auto">
                      <AvailabilityIndicator
                        available={section.availableSeats}
                        total={section.totalSeats}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Metadata */}
      {performance.metadata && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {performance.metadata.cast && performance.metadata.cast.length > 0 && (
                <div>
                  <dt className="text-sm text-muted-foreground">Cast</dt>
                  <dd className="mt-1">{performance.metadata.cast.join(', ')}</dd>
                </div>
              )}
              {performance.metadata.runtime && (
                <div>
                  <dt className="text-sm text-muted-foreground">Runtime</dt>
                  <dd className="mt-1">{formatDuration(performance.metadata.runtime)}</dd>
                </div>
              )}
              {performance.metadata.intermissions !== undefined && (
                <div>
                  <dt className="text-sm text-muted-foreground">Intermissions</dt>
                  <dd className="mt-1">{performance.metadata.intermissions}</dd>
                </div>
              )}
              {performance.metadata.ageRestriction && (
                <div>
                  <dt className="text-sm text-muted-foreground">Age Restriction</dt>
                  <dd className="mt-1">{performance.metadata.ageRestriction}</dd>
                </div>
              )}
              {performance.metadata.specialNotes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm text-muted-foreground">Special Notes</dt>
                  <dd className="mt-1">{performance.metadata.specialNotes}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
