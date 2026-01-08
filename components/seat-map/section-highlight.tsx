'use client';

import { Section } from '@/lib/types/section';
import { formatPrice } from '@/lib/utils/price-formatter';
import { cn } from '@/lib/utils';

interface SectionHighlightProps {
  section: Section | null;
  className?: string;
}

export function SectionHighlight({ section, className }: SectionHighlightProps) {
  if (!section) return null;

  const availabilityPercent = (section.availableSeats / section.totalSeats) * 100;

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 shadow-lg transition-all',
        className
      )}
    >
      <h4 className="font-semibold">{section.name}</h4>
      <p className="text-sm text-muted-foreground capitalize">
        {section.priceTier} tier
      </p>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price</span>
          <span className="font-medium">{formatPrice(section.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Available</span>
          <span className="font-medium">
            {section.availableSeats} / {section.totalSeats}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rows</span>
          <span className="font-medium">
            {section.rows.length}
          </span>
        </div>
      </div>

      {/* Availability bar */}
      <div className="mt-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full transition-all',
              availabilityPercent > 50
                ? 'bg-green-500'
                : availabilityPercent > 20
                ? 'bg-yellow-500'
                : 'bg-red-500'
            )}
            style={{ width: `${availabilityPercent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground text-right">
          {availabilityPercent.toFixed(1)}% available
        </p>
      </div>

    </div>
  );
}
