import { useState, useMemo } from 'react';
import type { Order } from '../types/Order';

export function useOrders(orders: Order[]) {
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesRegion = regionFilter === 'All' || order.region === regionFilter;
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesRegion && matchesStatus;
    });
  }, [orders, regionFilter, statusFilter]);

  return {
    filteredOrders,
    regionFilter,
    statusFilter,
    setRegionFilter,
    setStatusFilter
  };
}