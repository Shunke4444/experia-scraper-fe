'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/services/mock/api-client';

export function usePerformances(eventId: string) {
  return useQuery({
    queryKey: ['performances', eventId],
    queryFn: () => apiClient.getPerformances(eventId),
    enabled: !!eventId,
  });
}

export function usePerformance(performanceId: string) {
  return useQuery({
    queryKey: ['performance', performanceId],
    queryFn: () => apiClient.getPerformance(performanceId),
    enabled: !!performanceId,
  });
}
