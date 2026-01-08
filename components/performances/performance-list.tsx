import { PerformanceListItem } from '@/lib/types/performance';
import { PerformanceCard } from './performance-card';
import { NoPerformancesFound } from '@/components/shared/empty-state';
import { cn } from '@/lib/utils';

interface PerformanceListProps {
  performances: PerformanceListItem[];
  eventId: string;
  className?: string;
}

export function PerformanceList({
  performances,
  eventId,
  className,
}: PerformanceListProps) {
  if (performances.length === 0) {
    return <NoPerformancesFound />;
  }

  // Sort by date
  const sortedPerformances = [...performances].sort(
    (a, b) =>
      new Date(a.performanceDate).getTime() -
      new Date(b.performanceDate).getTime()
  );

  return (
    <div className={cn('space-y-3', className)}>
      {sortedPerformances.map((performance) => (
        <PerformanceCard
          key={performance.id}
          performance={performance}
          eventId={eventId}
        />
      ))}
    </div>
  );
}
