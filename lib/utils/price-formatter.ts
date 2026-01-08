export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}

export function formatPriceWithCents(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) {
    return formatPrice(min);
  }
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

export function formatPriceChange(percentage: number): string {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
}

export function formatCompactPrice(cents: number): string {
  const dollars = cents / 100;

  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`;
  }

  return formatPrice(cents);
}

export function getPriceChangeColor(percentage: number): string {
  if (percentage > 0) {
    return 'text-red-600'; // Price increased
  }
  if (percentage < 0) {
    return 'text-green-600'; // Price decreased
  }
  return 'text-muted-foreground'; // No change
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}
