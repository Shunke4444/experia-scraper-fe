'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvailabilityTrend } from '@/lib/types/analytics';
import { cn } from '@/lib/utils';

interface AvailabilityHeatmapProps {
  data: AvailabilityTrend[];
  className?: string;
}

function getAvailabilityColor(percentage: number): string {
  if (percentage >= 70) return 'bg-green-500';
  if (percentage >= 50) return 'bg-green-400';
  if (percentage >= 30) return 'bg-yellow-400';
  if (percentage >= 15) return 'bg-orange-400';
  if (percentage > 0) return 'bg-red-400';
  return 'bg-red-600';
}

function getAvailabilityLabel(percentage: number): string {
  if (percentage >= 70) return 'High';
  if (percentage >= 50) return 'Good';
  if (percentage >= 30) return 'Moderate';
  if (percentage >= 15) return 'Low';
  if (percentage > 0) return 'Very Low';
  return 'Sold Out';
}

export function AvailabilityHeatmap({ data, className }: AvailabilityHeatmapProps) {
  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Availability Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            No availability data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Availability by Section</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((section) => {
            const latestDataPoint =
              section.dataPoints[section.dataPoints.length - 1];
            const percentage = latestDataPoint?.percentageAvailable || 0;

            return (
              <div
                key={section.sectionId}
                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{section.sectionName}</h4>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium text-white',
                      getAvailabilityColor(percentage)
                    )}
                  >
                    {getAvailabilityLabel(percentage)}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium">
                      {latestDataPoint?.availableSeats || 0}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full transition-all', getAvailabilityColor(percentage))}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {percentage.toFixed(1)}% available
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>High (70%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <span>Moderate (30-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <span>Low (&lt;15%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
