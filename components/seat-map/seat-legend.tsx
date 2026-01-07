import { cn } from '@/lib/utils';

interface LegendItem {
  color: string;
  label: string;
}

interface SeatLegendProps {
  className?: string;
}

const priceTierColors: LegendItem[] = [
  { color: 'bg-purple-500', label: 'Premium' },
  { color: 'bg-blue-500', label: 'Standard' },
  { color: 'bg-green-500', label: 'Value' },
  { color: 'bg-cyan-500', label: 'Accessible' },
];

const statusColors: LegendItem[] = [
  { color: 'bg-green-400', label: 'Available' },
  { color: 'bg-yellow-400', label: 'Reserved' },
  { color: 'bg-gray-400', label: 'Sold' },
  { color: 'bg-gray-200', label: 'Blocked' },
];

export function SeatLegend({ className }: SeatLegendProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <h3 className="mb-3 font-semibold">Legend</h3>

      {/* Price Tiers */}
      <div className="mb-4">
        <p className="mb-2 text-sm text-muted-foreground">Price Tiers</p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-4">
          {priceTierColors.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn('h-4 w-4 rounded', item.color)} />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Status */}
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Availability</p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-4">
          {statusColors.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn('h-4 w-4 rounded-full', item.color)} />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
