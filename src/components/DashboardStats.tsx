import { TrendingUp, Package, CheckCircle, Clock } from "lucide-react";
import type { Currency } from "../types/Order";

interface RegionStats {
  region: string;
  totalOrders: number;
  totalRevenue: number;
  currency: Currency;
}

interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    deliveredCount: number;
    processingCount: number;
    regionStats: RegionStats[];
  };
  isLoading: boolean;
}

function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

function SkeletonRegionCard() {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-16 mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const summaryCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Revenue (USD)",
      value: formatCurrency(stats.totalRevenue, "USD"),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredCount.toLocaleString(),
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Processing Orders",
      value: stats.processingCount.toLocaleString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonRegionCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-white rounded-2xl shadow-lg border ${card.borderColor} p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-200 transform`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                    {card.title}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-2xl ${card.bgColor} shadow-sm`}
                >
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Regional Breakdown
        </h3>
        {stats.regionStats.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No regional data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {stats.regionStats.map((region, index) => (
              <div
                key={region.region}
                className="border border-gray-200 rounded-2xl p-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {region.region}
                </h4>
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-gray-600 flex justify-between">
                    <span>Orders:</span>
                    <span className="font-semibold text-gray-900">
                      {region.totalOrders.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(region.totalRevenue, region.currency)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
