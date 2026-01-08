import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvailabilityTrend } from '@/lib/types/analytics';
import { formatRelativeTime } from '@/lib/utils/date-formatter';
import { cn } from '@/lib/utils';

interface SellingVelocityCardProps {
  data: AvailabilityTrend[];
  className?: string;
}

export function SellingVelocityCard({ data, className }: SellingVelocityCardProps) {
  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Selling Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No velocity data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by velocity (highest first)
  const sortedData = [...data].sort((a, b) => b.sellingVelocity - a.sellingVelocity);

  // Calculate overall stats
  const totalVelocity = data.reduce((sum, d) => sum + d.sellingVelocity, 0);
  const avgVelocity = totalVelocity / data.length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Selling Velocity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Total Rate</p>
            <p className="text-2xl font-bold">{totalVelocity.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">seats/hour</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Avg per Section</p>
            <p className="text-2xl font-bold">{avgVelocity.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">seats/hour</p>
          </div>
        </div>

        {/* Section Details */}
        <div className="space-y-3">
          {sortedData.map((section) => (
            <div
              key={section.sectionId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <h4 className="font-medium">{section.sectionName}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{section.sellingVelocity.toFixed(1)} seats/hr</span>
                </div>
              </div>

              {section.projectedSellout && (
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    {new Date(section.projectedSellout) < new Date(Date.now() + 24 * 60 * 60 * 1000) && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sellout: {formatRelativeTime(section.projectedSellout)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
