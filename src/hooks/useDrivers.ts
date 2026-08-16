import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../api/drivers.api';

export const DRIVERS_QUERY_KEY = 'drivers';

export function useDrivers(farmId?: string) {
  return useQuery({
    queryKey: [DRIVERS_QUERY_KEY, farmId],
    queryFn: () => driversApi.getDrivers(farmId),
  });
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: [DRIVERS_QUERY_KEY, id],
    queryFn: () => driversApi.getDriverById(id),
    enabled: !!id,
  });
}
