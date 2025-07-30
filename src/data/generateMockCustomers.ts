import { faker } from '@faker-js/faker';
import type { Customer, Region } from '../types/Customer';

const REGIONS: Region[] = ['APAC', 'UK', 'US'];

function generateCustomerId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateMockCustomers(customersPerRegion: number = 30): Customer[] {
  const customers: Customer[] = [];

  REGIONS.forEach(region => {
    for (let i = 0; i < customersPerRegion; i++) {
      const customer: Customer = {
        customerId: generateCustomerId(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        region
      };
      customers.push(customer);
    }
  });

  return customers.sort((a, b) => {
    if (a.region !== b.region) {
      return a.region.localeCompare(b.region);
    }
    return a.name.localeCompare(b.name);
  });
}