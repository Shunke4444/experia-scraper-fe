'use client';

import { useEvents } from '@/hooks/use-events';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatDateRange } from '@/lib/utils/date-formatter';
import { formatPriceRange } from '@/lib/utils/price-formatter';

export default function EventsPage() {
  const { data, isLoading, error } = useEvents({});

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Events</h1>
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Events</h1>
        <p className="text-red-500">Error loading events</p>
      </div>
    );
  }

  const events = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Events ({events.length})</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Performances</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell className="capitalize">{event.eventType}</TableCell>
                <TableCell>{event.venue.name}</TableCell>
                <TableCell>
                  {formatDateRange(event.dateRange.start, event.dateRange.end)}
                </TableCell>
                <TableCell>
                  {formatPriceRange(event.priceRange.min, event.priceRange.max)}
                </TableCell>
                <TableCell>{event.performanceCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
