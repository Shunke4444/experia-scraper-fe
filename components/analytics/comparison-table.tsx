'use client';

import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ComparisonData, ValueRating } from '@/lib/types/analytics';
import { formatDate, formatTime } from '@/lib/utils/date-formatter';
import { formatPrice, formatPriceRange } from '@/lib/utils/price-formatter';
import { exportToCSV } from '@/lib/utils/csv-export';
import { cn } from '@/lib/utils';

interface ComparisonTableProps {
  data: ComparisonData;
  className?: string;
}

const valueColors: Record<ValueRating, string> = {
  excellent: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-yellow-100 text-yellow-800',
  premium: 'bg-purple-100 text-purple-800',
};

export function ComparisonTable({ data, className }: ComparisonTableProps) {
  const handleExport = () => {
    const rows = data.performances.flatMap((perf) =>
      perf.sections.map((section) => ({
        Performance: formatDate(perf.performance.performanceDate),
        Time: formatTime(perf.performance.performanceDate),
        Section: section.sectionName,
        Price: formatPrice(section.price),
        Available: section.availableSeats,
        'Availability %': `${section.percentageAvailable.toFixed(1)}%`,
        Value: section.value,
      }))
    );

    exportToCSV(rows, `performance-comparison-${Date.now()}.csv`);
  };

  if (data.performances.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            Select performances to compare
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Comparison</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.performances.map((perf) => (
            <div key={perf.performance.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{formatDate(perf.performance.performanceDate)}</h4>
                <Badge variant="outline">{formatTime(perf.performance.performanceDate)}</Badge>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Range</span>
                  <span className="font-medium">
                    {formatPriceRange(perf.priceRange.min, perf.priceRange.max)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium">{perf.totalAvailability.toFixed(1)}%</span>
                </div>
              </div>
              {perf.recommendedSections.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">Recommended:</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {perf.recommendedSections.slice(0, 2).map((sec) => (
                      <Badge key={sec} variant="secondary" className="text-xs">
                        {sec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Performance</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.performances.map((perf) =>
                perf.sections.map((section, index) => (
                  <TableRow key={`${perf.performance.id}-${section.sectionName}`}>
                    {index === 0 && (
                      <TableCell
                        rowSpan={perf.sections.length}
                        className="font-medium align-top"
                      >
                        <div>
                          {formatDate(perf.performance.performanceDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(perf.performance.performanceDate)}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{section.sectionName}</TableCell>
                    <TableCell>{formatPrice(section.price)}</TableCell>
                    <TableCell>
                      <div>
                        {section.availableSeats}
                        <span className="text-muted-foreground text-sm ml-1">
                          ({section.percentageAvailable.toFixed(0)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn('capitalize', valueColors[section.value])}
                      >
                        {section.value}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
