import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPriceChange, getPriceChangeColor } from '@/lib/utils/price-formatter';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  value: number;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function TrendIndicator({
  value,
  label,
  showIcon = true,
  className,
}: TrendIndicatorProps) {
  const colorClass = getPriceChangeColor(value);

  let Icon = Minus;
  if (value > 0) {
    Icon = TrendingUp;
  } else if (value < 0) {
    Icon = TrendingDown;
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {showIcon && <Icon className={cn('h-4 w-4', colorClass)} />}
      <span className={cn('font-medium', colorClass)}>
        {formatPriceChange(value)}
      </span>
      {label && <span className="text-muted-foreground text-sm">({label})</span>}
    </div>
  );
}

interface TrendCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function TrendCard({
  title,
  value,
  change,
  changeLabel = '24h',
  className,
}: TrendCardProps) {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {change !== undefined && (
        <TrendIndicator value={change} label={changeLabel} className="mt-2" />
      )}
    </div>
  );
}
