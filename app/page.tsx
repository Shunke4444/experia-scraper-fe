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
import { formatDateRange } from '@/lib/utils/date-formatter';
import { formatPriceRange } from '@/lib/utils/price-formatter';

export default function Home() {
  const { data, isLoading, error } = useEvents({});

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Events Data</h1>
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Events Data</h1>
        <p className="text-red-500">Error loading events</p>
      </div>
    );
  }

  const events = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Events Data ({events.length} events)</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Event Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Min Price</TableHead>
              <TableHead>Max Price</TableHead>
              <TableHead>Performances</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-mono text-xs">{event.id}</TableCell>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell className="capitalize">{event.eventType}</TableCell>
                <TableCell>{event.venue.name}</TableCell>
                <TableCell>{event.venue.address.city}</TableCell>
                <TableCell>{new Date(event.dateRange.start).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(event.dateRange.end).toLocaleDateString()}</TableCell>
                <TableCell>${event.priceRange.min}</TableCell>
                <TableCell>${event.priceRange.max}</TableCell>
                <TableCell>{event.performanceCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
