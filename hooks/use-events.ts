'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/services/mock/api-client';
import { EventFilters } from '@/lib/types/filters';

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => apiClient.getEvents(filters),
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => apiClient.getEvent(eventId),
    enabled: !!eventId,
  });
}

export function useEventWithPerformances(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId, 'with-performances'],
    queryFn: () => apiClient.getEventWithPerformances(eventId),
    enabled: !!eventId,
  });
}

export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: () => apiClient.getVenues(),
  });
}
