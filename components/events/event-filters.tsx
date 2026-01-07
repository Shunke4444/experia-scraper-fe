'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EventType } from '@/lib/types/event';
import { EventFilters as EventFiltersType } from '@/lib/types/filters';
import { Venue } from '@/lib/types/venue';
import { cn } from '@/lib/utils';

interface EventFiltersProps {
  filters: EventFiltersType;
  onChange: (filters: EventFiltersType) => void;
  venues?: Venue[];
  className?: string;
}

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'ballet', label: 'Ballet' },
  { value: 'opera', label: 'Opera' },
  { value: 'theater', label: 'Theater' },
  { value: 'concert', label: 'Concert' },
  { value: 'musical', label: 'Musical' },
  { value: 'dance', label: 'Dance' },
  { value: 'other', label: 'Other' },
];

export function EventFilters({
  filters,
  onChange,
  venues = [],
  className,
}: EventFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount =
    (filters.eventTypes?.length || 0) +
    (filters.venues?.length || 0) +
    (filters.availability && filters.availability !== 'all' ? 1 : 0);

  const handleEventTypeChange = (value: string) => {
    if (value === 'all') {
      onChange({ ...filters, eventTypes: undefined });
    } else {
      onChange({ ...filters, eventTypes: [value as EventType] });
    }
  };

  const handleVenueChange = (value: string) => {
    if (value === 'all') {
      onChange({ ...filters, venues: undefined });
    } else {
      onChange({ ...filters, venues: [value] });
    }
  };

  const handleClearFilters = () => {
    onChange({});
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mobile toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Filter controls */}
      <div
        className={cn(
          'space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4',
          !isOpen && 'hidden lg:flex'
        )}
      >
        {/* Event Type */}
        <div className="space-y-2 lg:space-y-0">
          <label className="text-sm font-medium lg:sr-only">Event Type</label>
          <select
            value={filters.eventTypes?.[0] || 'all'}
            onChange={(e) => handleEventTypeChange(e.target.value)}
            className="flex h-10 w-full lg:w-[160px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="all">All Types</option>
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Venue */}
        {venues.length > 0 && (
          <div className="space-y-2 lg:space-y-0">
            <label className="text-sm font-medium lg:sr-only">Venue</label>
            <select
              value={filters.venues?.[0] || 'all'}
              onChange={(e) => handleVenueChange(e.target.value)}
              className="flex h-10 w-full lg:w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Venues</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Clear filters - desktop */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="hidden lg:flex gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filters badges */}
      {activeFiltersCount > 0 && (
        <>
          <Separator className="lg:hidden" />
          <div className="flex flex-wrap gap-2 lg:hidden">
            {filters.eventTypes?.map((type) => (
              <Badge key={type} variant="secondary" className="gap-1">
                {eventTypes.find((t) => t.value === type)?.label}
                <button
                  onClick={() =>
                    onChange({
                      ...filters,
                      eventTypes: filters.eventTypes?.filter((t) => t !== type),
                    })
                  }
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.venues?.map((venueId) => {
              const venue = venues.find((v) => v.id === venueId);
              return (
                <Badge key={venueId} variant="secondary" className="gap-1">
                  {venue?.name || venueId}
                  <button
                    onClick={() =>
                      onChange({
                        ...filters,
                        venues: filters.venues?.filter((v) => v !== venueId),
                      })
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
