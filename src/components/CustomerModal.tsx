import React from 'react';
import { X, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import type { Customer } from '../types/Customer';
import type { Order } from '../types/Order';

interface CustomerModalProps {
  customer: Customer;
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
}

const USD_CONVERSION_RATES = {
  USD: 1,
  GBP: 1.27,
  AUD: 0.67
};

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function CustomerModal({ customer, orders, isOpen, onClose }: CustomerModalProps) {
  if (!isOpen) return null;

  const totalSpentUSD = orders.reduce((sum, order) => {
    const usdAmount = order.totalAmount * USD_CONVERSION_RATES[order.currency];
    return sum + usdAmount;
  }, 0);

  const recentOrders = orders
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-200"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.45)' }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-200 scale-100">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">ID: {customer.customerId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{customer.region}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Order Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Spent (USD)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalSpentUSD, 'USD')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Orders
            </h3>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {order.product}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount, order.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{order.createdAt.toLocaleDateString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No orders found for this customer.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}