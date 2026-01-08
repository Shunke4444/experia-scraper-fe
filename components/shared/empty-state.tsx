import { LucideIcon, Search, Calendar, Ticket, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function NoEventsFound({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={Ticket}
      title="No events found"
      description="We couldn't find any events matching your search criteria. Try adjusting your filters or search terms."
      action={
        onClearFilters
          ? { label: 'Clear filters', onClick: onClearFilters }
          : undefined
      }
    />
  );
}

export function NoPerformancesFound() {
  return (
    <EmptyState
      icon={Calendar}
      title="No performances available"
      description="There are no upcoming performances for this event at the moment. Please check back later."
    />
  );
}

export function NoAnalyticsData() {
  return (
    <EmptyState
      icon={BarChart3}
      title="Insufficient data"
      description="There isn't enough historical data to display meaningful analytics. Data will become available as more price history is collected."
    />
  );
}

export function NoSearchResults({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      icon={Search}
      title={`No results for "${searchTerm}"`}
      description="Try searching with different keywords or browse all events."
    />
  );
}
