import { apiClient } from './axios';
import { SalesReportSummary, RetailerPerformanceReport } from '../types/report';

export const reportsApi = {
  getSalesReport: async (farmId?: string, dateRange?: string): Promise<SalesReportSummary> => {
    const response = await apiClient.get<SalesReportSummary>('/reports/sales', { params: { farmId, dateRange } });
    return response.data;
  },

  getRetailerReport: async (): Promise<RetailerPerformanceReport[]> => {
    const response = await apiClient.get<RetailerPerformanceReport[] | { content: RetailerPerformanceReport[] }>('/reports/retailers');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as any).content)) {
      return (data as any).content;
    }
    return [];
  },
};
