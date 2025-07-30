import { faker } from '@faker-js/faker';
import type { Customer, Region } from '../types/Customer';
import type { Order, OrderStatus, Currency } from '../types/Order';

const FURNITURE_PRODUCTS = [
  'Milano Sofa',
  'Sydney Dining Table',
  'Melbourne Coffee Table',
  'Brisbane Armchair',
  'Perth Bookshelf',
  'Adelaide Bed Frame',
  'Darwin Wardrobe',
  'Hobart Side Table',
  'Canberra Desk',
  'Gold Coast Ottoman'
];

const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const REGION_CURRENCY_MAP: Record<Region, Currency> = {
  'APAC': 'AUD',
  'UK': 'GBP',
  'US': 'USD'
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getCustomersByRegion(customers: Customer[]): Record<Region, Customer[]> {
  return customers.reduce((acc, customer) => {
    if (!acc[customer.region]) {
      acc[customer.region] = [];
    }
    acc[customer.region].push(customer);
    return acc;
  }, {} as Record<Region, Customer[]>);
}

export function generateMockOrders(customers: Customer[], ordersPerRegion: number = 50): Order[] {
  if (customers.length === 0) {
    return [];
  }

  const orders: Order[] = [];
  const customersByRegion = getCustomersByRegion(customers);
  const regions = Object.keys(customersByRegion) as Region[];

  regions.forEach(region => {
    const regionCustomers = customersByRegion[region];
    if (regionCustomers.length === 0) return;

    for (let i = 0; i < ordersPerRegion; i++) {
      const customer = getRandomElement(regionCustomers);
      const basePrice = faker.number.int({ min: 500, max: 5000 });
      const quantity = faker.number.int({ min: 1, max: 5 });
      const totalAmount = basePrice * quantity;
      
      const order: Order = {
        id: faker.string.uuid(),
        region,
        customerId: customer.customerId,
        product: getRandomElement(FURNITURE_PRODUCTS),
        quantity,
        totalAmount,
        currency: REGION_CURRENCY_MAP[region],
        status: getRandomElement(ORDER_STATUSES),
        createdAt: faker.date.recent({ days: 90 })
      };
      
      orders.push(order);
    }
  });

  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}