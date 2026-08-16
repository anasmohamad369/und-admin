export interface SalesReportSummary {
  totalRevenue: number;
  totalOrders: number;
  totalQuantityKgSold: number;
  averageOrderValue: number;
  revenueByFarm: { farmId: string; farmName: string; revenue: number; quantityKg: number }[];
  salesByCity: { city: string; sales: number; ordersCount: number }[];
  dailyTrends: { date: string; revenue: number; orders: number; quantityKg: number }[];
}

export interface RetailerPerformanceReport {
  retailerId: string;
  retailerName: string;
  shopsCount: number;
  totalOrders: number;
  totalQuantityKg: number;
  totalSpent: number;
  lastOrderDate: string;
}
