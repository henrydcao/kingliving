import { useMemo } from "react";
import type { Order } from "../types/Order";
import type { Currency } from "../types/Order";
import type { Region } from "../types/Customer";

const USD_CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  GBP: 1.27,
  AUD: 0.67,
};

interface RegionStats {
  region: Region;
  totalOrders: number;
  totalRevenue: number;
  currency: Currency;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  deliveredCount: number;
  processingCount: number;
  regionStats: RegionStats[];
}

export function useDashboardStats(orders: Order[]): DashboardStats {
  return useMemo(() => {
    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        deliveredCount: 0,
        processingCount: 0,
        regionStats: [],
      };
    }

    const totalOrders = orders.length;
    const deliveredCount = orders.filter(
      (order) => order.status === "Delivered"
    ).length;
    const processingCount = orders.filter(
      (order) => order.status === "Processing"
    ).length;

    const totalRevenue = orders.reduce((sum, order) => {
      const usdAmount =
        order.totalAmount * USD_CONVERSION_RATES[order.currency];
      return sum + usdAmount;
    }, 0);

    const regionStatsMap = new Map<
      Region,
      { totalOrders: number; totalRevenue: number; currency: Currency }
    >();

    orders.forEach((order) => {
      const existing = regionStatsMap.get(order.region) || {
        totalOrders: 0,
        totalRevenue: 0,
        currency: order.currency,
      };

      regionStatsMap.set(order.region, {
        totalOrders: existing.totalOrders + 1,
        totalRevenue: existing.totalRevenue + order.totalAmount,
        currency: order.currency,
      });
    });

    const regionStats: RegionStats[] = Array.from(regionStatsMap.entries()).map(
      ([region, stats]) => ({
        region,
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        currency: stats.currency,
      })
    );

    return {
      totalOrders,
      totalRevenue,
      deliveredCount,
      processingCount,
      regionStats,
    };
  }, [orders]);
}
