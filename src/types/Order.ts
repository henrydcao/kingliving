import type { Region } from "./Customer";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";
export type Currency = "AUD" | "GBP" | "USD";

export interface Order {
  id: string;
  region: Region;
  customerId: string;
  product: string;
  quantity: number;
  totalAmount: number;
  currency: Currency;
  status: OrderStatus;
  createdAt: Date;
}
