'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceAnalytics, TimeRange } from '@/lib/types/analytics';
import { formatPrice } from '@/lib/utils/price-formatter';
import { format } from 'date-fns';

interface PriceHistoryChartProps {
  data: PriceAnalytics[];
  onTimeRangeChange?: (range: TimeRange) => void;
  selectedTimeRange?: TimeRange;
  className?: string;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function PriceHistoryChart({
  data,
  onTimeRangeChange,
  selectedTimeRange = '7d',
  className,
}: PriceHistoryChartProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>(
    data.slice(0, 3).map((d) => d.sectionId)
  );

  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    // Get all unique timestamps
    const timestamps = new Set<number>();
    data.forEach((section) => {
      section.history.forEach((h) => {
        timestamps.add(new Date(h.timestamp).getTime());
      });
    });

    // Create chart data points
    return Array.from(timestamps)
      .sort((a, b) => a - b)
      .map((timestamp) => {
        const point: Record<string, number | string> = {
          timestamp,
          date: format(new Date(timestamp), 'MMM d'),
        };

        data.forEach((section) => {
          if (selectedSections.includes(section.sectionId)) {
            const historyPoint = section.history.find(
              (h) => new Date(h.timestamp).getTime() === timestamp
            );
            if (historyPoint) {
              point[section.sectionName] = historyPoint.price;
            }
          }
        });

        return point;
      });
  }, [data, selectedSections]);

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No price history data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Price History</CardTitle>
        {onTimeRangeChange && (
          <Tabs
            value={selectedTimeRange}
            onValueChange={(v) => onTimeRangeChange(v as TimeRange)}
          >
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
        {/* Section toggles */}
        <div className="mb-4 flex flex-wrap gap-2">
          {data.map((section, index) => (
            <button
              key={section.sectionId}
              onClick={() => toggleSection(section.sectionId)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedSections.includes(section.sectionId)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              style={
                selectedSections.includes(section.sectionId)
                  ? { backgroundColor: COLORS[index % COLORS.length] }
                  : undefined
              }
            >
              {section.sectionName}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatPrice(value)}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) => formatPrice(value)}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              {data.map((section, index) => {
                if (!selectedSections.includes(section.sectionId)) return null;
                return (
                  <Line
                    key={section.sectionId}
                    type="monotone"
                    dataKey={section.sectionName}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
