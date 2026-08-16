import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { StockAdjustmentPayload } from '../types/inventory';
import { FARMS_QUERY_KEY } from './useFarms';

export const INVENTORY_QUERY_KEY = 'inventory';
export const STOCK_ADJUSTMENTS_QUERY_KEY = 'stockAdjustments';

export function useInventory(farmId?: string) {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEY, farmId],
    queryFn: () => inventoryApi.getInventories(farmId),
  });
}

export function useStockAdjustments(farmId?: string) {
  return useQuery({
    queryKey: [STOCK_ADJUSTMENTS_QUERY_KEY, farmId],
    queryFn: () => inventoryApi.getStockAdjustments(farmId),
  });
}

export function useAdjustInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StockAdjustmentPayload) => inventoryApi.adjustStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCK_ADJUSTMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FARMS_QUERY_KEY] });
    },
  });
}
