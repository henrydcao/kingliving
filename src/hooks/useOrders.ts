import { useState, useMemo } from "react";
import type { Order } from "../types/Order";
import type { Customer } from "../types/Customer";
import type { DateRange } from "../types/DateRange";

interface UseOrdersProps {
  orders: Order[];
  getCustomerById?: (customerId: string) => Customer | undefined;
}

interface UseOrdersReturn {
  filteredOrders: Order[];
  regionFilter: string;
  statusFilter: string;
  searchTerm: string;
  dateRange: DateRange;
  setRegionFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setSearchTerm: (term: string) => void;
  setDateRange: (range: DateRange) => void;
  isSearching: boolean;
}

export function useOrders({
  orders,
  getCustomerById,
}: UseOrdersProps): UseOrdersReturn {
  const [regionFilter, setRegionFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null
  });

  const isSearching = useMemo(() => searchTerm.length > 0, [searchTerm]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesRegion =
        regionFilter === "All" || order.region === regionFilter;
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      let matchesSearch = true;
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();

        const customer = getCustomerById?.(order.customerId);
        const customerName = customer?.name?.toLowerCase() || "";

        const escapeRegex = (str: string) =>
          str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const safeSearchTerm = escapeRegex(searchLower);

        matchesSearch =
          order.id.toLowerCase().includes(searchLower) ||
          order.product.toLowerCase().includes(searchLower) ||
          customerName.includes(searchLower) ||
          order.status.toLowerCase().includes(searchLower);
      }

      let matchesDateRange = true;
      if (dateRange.startDate || dateRange.endDate) {
        const orderDate = order.createdAt.toISOString().split('T')[0];
        
        if (dateRange.startDate && orderDate < dateRange.startDate) {
          matchesDateRange = false;
        }
        if (dateRange.endDate && orderDate > dateRange.endDate) {
          matchesDateRange = false;
        }
      }

      return matchesRegion && matchesStatus && matchesSearch && matchesDateRange;
    });
  }, [orders, regionFilter, statusFilter, searchTerm, dateRange, getCustomerById]);

  return {
    filteredOrders,
    regionFilter,
    statusFilter,
    searchTerm,
    dateRange,
    setRegionFilter,
    setStatusFilter,
    setSearchTerm,
    setDateRange,
    isSearching,
  };
}
