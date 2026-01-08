import Link from 'next/link';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventListItem } from '@/lib/types/event';
import { formatDateRange } from '@/lib/utils/date-formatter';
import { formatPriceRange } from '@/lib/utils/price-formatter';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: EventListItem;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card
        className={cn(
          'group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50',
          className
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Ticket className="h-16 w-16 text-primary/30" />
          </div>
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 capitalize"
          >
            {event.eventType.replace('_', ' ')}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {event.name}
          </h3>

          <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{event.venue.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{formatDateRange(event.dateRange.start, event.dateRange.end)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
          <span className="font-medium text-primary">
            {formatPriceRange(event.priceRange.min, event.priceRange.max)}
          </span>
          <span className="text-sm text-muted-foreground">
            {event.performanceCount} performances
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
