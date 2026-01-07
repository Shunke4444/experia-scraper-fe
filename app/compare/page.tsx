'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useEvents } from '@/hooks/use-events';
import { useComparison } from '@/hooks/use-analytics';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';
import { ErrorDisplay } from '@/components/shared/error-boundary';
import { ComparisonTable } from '@/components/analytics/comparison-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { generatePerformancesForEvent } from '@/lib/services/mock/performances.mock';
import { formatDate, formatTime } from '@/lib/utils/date-formatter';

export default function ComparePage() {
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedPerformanceIds, setSelectedPerformanceIds] = useState<string[]>([]);

  const { data: eventsData, isLoading: eventsLoading } = useEvents();
  const { data: comparison, isLoading: comparisonLoading, error } = useComparison(
    selectedPerformanceIds
  );

  // Get performances for selected event
  const performances = selectedEventId
    ? generatePerformancesForEvent(selectedEventId)
    : [];

  const handleAddPerformance = (performanceId: string) => {
    if (performanceId && !selectedPerformanceIds.includes(performanceId)) {
      setSelectedPerformanceIds([...selectedPerformanceIds, performanceId]);
    }
  };

  const handleRemovePerformance = (performanceId: string) => {
    setSelectedPerformanceIds(
      selectedPerformanceIds.filter((id) => id !== performanceId)
    );
  };

  const handleClearAll = () => {
    setSelectedPerformanceIds([]);
    setSelectedEventId('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Compare Performances</h1>
        <p className="mt-2 text-muted-foreground">
          Select multiple performances to compare prices and availability side-by-side
        </p>
      </div>

      {/* Selection Panel */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Performances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Event Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select Event
                </label>
                {eventsLoading ? (
                  <LoadingSkeleton variant="list" count={1} />
                ) : (
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventsData?.data.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Performance Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Add Performance
                </label>
                <Select
                  value=""
                  onValueChange={handleAddPerformance}
                  disabled={!selectedEventId || selectedPerformanceIds.length >= 5}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a performance" />
                  </SelectTrigger>
                  <SelectContent>
                    {performances
                      .filter((p) => !selectedPerformanceIds.includes(p.id))
                      .map((perf) => (
                        <SelectItem key={perf.id} value={perf.id}>
                          {formatDate(perf.performanceDate)} at{' '}
                          {formatTime(perf.performanceDate)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Performances */}
            {selectedPerformanceIds.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Selected ({selectedPerformanceIds.length}/5)
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-auto py-1 text-destructive hover:text-destructive"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPerformanceIds.map((perfId) => {
                    const perf = performances.find((p) => p.id === perfId);
                    return (
                      <Badge
                        key={perfId}
                        variant="secondary"
                        className="gap-1 py-1.5"
                      >
                        {perf
                          ? `${formatDate(perf.performanceDate)} ${formatTime(
                              perf.performanceDate
                            )}`
                          : perfId}
                        <button
                          onClick={() => handleRemovePerformance(perfId)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedPerformanceIds.length === 0 && (
              <div className="rounded-lg border-2 border-dashed p-8 text-center">
                <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  Select an event and add performances to compare
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonLoading ? (
        <LoadingSkeleton variant="table" count={5} />
      ) : error ? (
        <ErrorDisplay
          title="Failed to load comparison"
          message="We couldn't compare the selected performances. Please try again."
        />
      ) : comparison && selectedPerformanceIds.length > 0 ? (
        <ComparisonTable data={comparison} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Select at least one performance to see comparison data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
