import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'chart' | 'seat-map' | 'table' | 'detail';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = 'card',
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  switch (variant) {
    case 'card':
      return (
        <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
          {skeletons.map((i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className={cn('space-y-3', className)}>
          {skeletons.map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      );

    case 'chart':
      return (
        <div className={cn('space-y-4', className)}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-md" />
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'seat-map':
      return (
        <div className={cn('space-y-4', className)}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <Skeleton className="h-96 w-full rounded-md" />
          <div className="flex justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'table':
      return (
        <div className={cn('space-y-2', className)}>
          <div className="flex items-center gap-4 border-b pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-5 flex-1" />
            ))}
          </div>
          {skeletons.map((i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      );

    case 'detail':
      return (
        <div className={cn('space-y-6', className)}>
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-64 w-full md:w-80 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      );

    default:
      return <Skeleton className={cn('h-20 w-full', className)} />;
  }
}
