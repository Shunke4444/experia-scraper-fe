import { EventFilters } from '@/lib/types/filters';

export function validateEventFilters(filters: EventFilters): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (filters.search && filters.search.length > 200) {
    errors.push('Search term must be less than 200 characters');
  }

  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    if (start && end && start > end) {
      errors.push('Start date must be before end date');
    }
  }

  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    if (min !== undefined && max !== undefined && min > max) {
      errors.push('Minimum price must be less than maximum price');
    }
    if (min !== undefined && min < 0) {
      errors.push('Price cannot be negative');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePerformanceId(id: string): boolean {
  if (!id) return false;
  // UUID format or prefixed ID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const prefixedIdRegex = /^(perf|evt|sec|seat|venue)_[a-z0-9]+$/i;

  return uuidRegex.test(id) || prefixedIdRegex.test(id);
}

export function validateEventId(id: string): boolean {
  if (!id) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const prefixedIdRegex = /^evt_[a-z0-9]+$/i;

  return uuidRegex.test(id) || prefixedIdRegex.test(id);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeSearchTerm(term: string): string {
  return term
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .slice(0, 200); // Limit length
}
