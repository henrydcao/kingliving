import { useMemo } from 'react';
import type { Customer } from '../types/Customer';
import type { Order } from '../types/Order';

export function useCustomers(customers: Customer[], orders: Order[]) {
  const getCustomerById = useMemo(() => {
    const customerMap = new Map<string, Customer>();
    customers.forEach(customer => {
      customerMap.set(customer.customerId, customer);
    });
    return (customerId: string): Customer | undefined => {
      return customerMap.get(customerId);
    };
  }, [customers]);

  const getCustomerOrders = useMemo(() => {
    const ordersByCustomer = new Map<string, Order[]>();
    orders.forEach(order => {
      const customerOrders = ordersByCustomer.get(order.customerId) || [];
      customerOrders.push(order);
      ordersByCustomer.set(order.customerId, customerOrders);
    });
    return (customerId: string): Order[] => {
      return ordersByCustomer.get(customerId) || [];
    };
  }, [orders]);

  return {
    getCustomerById,
    getCustomerOrders
  };
}