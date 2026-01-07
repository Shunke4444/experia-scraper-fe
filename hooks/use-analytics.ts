'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/services/mock/api-client';
import { TimeRange } from '@/lib/types/analytics';

export function usePriceHistory(
  performanceId: string,
  options?: { sectionIds?: string[]; timeRange?: TimeRange }
) {
  return useQuery({
    queryKey: ['price-history', performanceId, options],
    queryFn: () => apiClient.getPriceHistory(performanceId, options),
    enabled: !!performanceId,
  });
}

export function useAvailability(
  performanceId: string,
  options?: { sectionIds?: string[]; timeRange?: TimeRange }
) {
  return useQuery({
    queryKey: ['availability', performanceId, options],
    queryFn: () => apiClient.getAvailability(performanceId, options),
    enabled: !!performanceId,
  });
}

export function useComparison(performanceIds: string[]) {
  return useQuery({
    queryKey: ['comparison', performanceIds],
    queryFn: () => apiClient.comparePerformances(performanceIds),
    enabled: performanceIds.length > 0,
  });
}
