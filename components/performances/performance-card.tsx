import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PerformanceListItem } from '@/lib/types/performance';
import { AvailabilityBadge, AvailabilityIndicator } from './availability-badge';
import { formatDate, formatTime } from '@/lib/utils/date-formatter';
import { formatPriceRange } from '@/lib/utils/price-formatter';
import { cn } from '@/lib/utils';

interface PerformanceCardProps {
  performance: PerformanceListItem;
  eventId: string;
  className?: string;
}

export function PerformanceCard({
  performance,
  eventId,
  className,
}: PerformanceCardProps) {
  return (
    <Link href={`/events/${eventId}/performances/${performance.id}`}>
      <Card
        className={cn(
          'group transition-all hover:shadow-md hover:border-primary/50',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Date and time */}
            <div className="flex items-center gap-4 sm:w-48">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(performance.performanceDate)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatTime(performance.performanceDate)}
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className="sm:w-28">
              <AvailabilityBadge status={performance.status} />
            </div>

            {/* Availability */}
            <div className="flex-1 max-w-xs">
              <AvailabilityIndicator
                available={performance.availableSeats}
                total={performance.totalSeats}
              />
            </div>

            {/* Price */}
            <div className="text-right sm:w-36">
              <span className="font-semibold text-primary">
                {formatPriceRange(
                  performance.priceRange.min,
                  performance.priceRange.max
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
