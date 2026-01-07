import { EventListItem } from '@/lib/types/event';
import { EventCard } from './event-card';
import { NoEventsFound } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils';

interface EventGridProps {
  events: EventListItem[];
  onClearFilters?: () => void;
  className?: string;
}

export function EventGrid({ events, onClearFilters, className }: EventGridProps) {
  if (events.length === 0) {
    return <NoEventsFound onClearFilters={onClearFilters} />;
  }

  return (
    <div
      className={cn(
        'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
