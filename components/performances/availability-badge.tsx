import { Badge } from '@/components/ui/badge';
import { PerformanceStatus } from '@/lib/types/performance';
import { cn } from '@/lib/utils';

interface AvailabilityBadgeProps {
  status: PerformanceStatus;
  className?: string;
}

const statusConfig: Record<
  PerformanceStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  on_sale: { label: 'On Sale', variant: 'default' },
  selling_fast: { label: 'Selling Fast', variant: 'destructive' },
  sold_out: { label: 'Sold Out', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'outline' },
  postponed: { label: 'Postponed', variant: 'outline' },
};

export function AvailabilityBadge({ status, className }: AvailabilityBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(
        status === 'selling_fast' && 'animate-pulse',
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

interface AvailabilityIndicatorProps {
  available: number;
  total: number;
  className?: string;
}

export function AvailabilityIndicator({
  available,
  total,
  className,
}: AvailabilityIndicatorProps) {
  const percentage = total > 0 ? (available / total) * 100 : 0;

  let colorClass = 'bg-green-500';
  if (percentage < 20) {
    colorClass = 'bg-red-500';
  } else if (percentage < 50) {
    colorClass = 'bg-yellow-500';
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{available} available</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full transition-all', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
