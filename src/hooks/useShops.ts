import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopsApi } from '../api/shops.api';
import { CreateShopPayload } from '../types/shop';
import { RETAILERS_QUERY_KEY } from './useRetailers';

export const SHOPS_QUERY_KEY = 'shops';

export function useShops(retailerIdFilter?: string) {
  return useQuery({
    queryKey: [SHOPS_QUERY_KEY, retailerIdFilter],
    queryFn: () => shopsApi.getShops(retailerIdFilter),
  });
}

export function useRetailerShops(retailerId?: string) {
  return useQuery({
    queryKey: [SHOPS_QUERY_KEY, 'retailer', retailerId],
    queryFn: () => (retailerId ? shopsApi.getShopsByRetailerId(retailerId) : Promise.resolve([])),
    enabled: !!retailerId && retailerId !== 'ALL',
  });
}

export function useShop(id: string) {
  return useQuery({
    queryKey: [SHOPS_QUERY_KEY, id],
    queryFn: () => shopsApi.getShopById(id),
    enabled: !!id,
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShopPayload) => shopsApi.createShop(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SHOPS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [RETAILERS_QUERY_KEY] });
      if (variables.retailerId) {
        queryClient.invalidateQueries({ queryKey: [SHOPS_QUERY_KEY, 'retailer', variables.retailerId] });
      }
    },
  });
}
