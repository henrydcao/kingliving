export type Region = 'APAC' | 'UK' | 'US';

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  region: Region;
}