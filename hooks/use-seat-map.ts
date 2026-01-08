'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/services/mock/api-client';

export function useSeatMap(performanceId: string) {
  return useQuery({
    queryKey: ['seat-map', performanceId],
    queryFn: () => apiClient.getSeatMap(performanceId),
    enabled: !!performanceId,
  });
}
