'use client';

import { Seat } from '@/lib/types/seat';
import { formatPrice } from '@/lib/utils/price-formatter';
import { cn } from '@/lib/utils';

interface SeatTooltipProps {
  seat: Seat | null;
  sectionName?: string;
  position: { x: number; y: number };
  visible: boolean;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  available: { label: 'Available', color: 'text-green-600' },
  reserved: { label: 'Reserved', color: 'text-yellow-600' },
  sold: { label: 'Sold', color: 'text-red-600' },
  blocked: { label: 'Blocked', color: 'text-muted-foreground' },
};

export function SeatTooltip({ seat, sectionName, position, visible }: SeatTooltipProps) {
  if (!visible || !seat) return null;

  const status = statusLabels[seat.status] || statusLabels.available;

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-lg border bg-popover p-3 shadow-lg"
      style={{
        left: position.x + 10,
        top: position.y + 10,
        transform: 'translate(0, -50%)',
      }}
    >
      <div className="space-y-1.5 text-sm">
        <div className="font-semibold">
          {sectionName || 'Section'} - Row {seat.row}, Seat {seat.number}
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Price</span>
          <span className="font-medium">{formatPrice(seat.price)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Status</span>
          <span className={cn('font-medium', status.color)}>{status.label}</span>
        </div>
        {seat.features && (
          <div className="flex flex-wrap gap-1 pt-1">
            {seat.features.accessible && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">
                Accessible
              </span>
            )}
            {seat.features.aisle && (
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-800">
                Aisle
              </span>
            )}
            {seat.features.extraLegroom && (
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">
                Extra Legroom
              </span>
            )}
            {seat.features.obstructedView && (
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-800">
                Limited View
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
