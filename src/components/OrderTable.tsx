import { useState } from "react";
import { ChevronDown, User, Package, Filter } from "lucide-react";
import type { Order } from "../types/Order";
import type { Customer } from "../types/Customer";
import type { DateRange } from "../types/DateRange";
import { CustomerModal } from "./CustomerModal";
import { DateRangeFilter } from "./DateRangeFilter";

interface OrderTableProps {
  orders: Order[];
  customerHooks: {
    getCustomerById: (customerId: string) => Customer | undefined;
    getCustomerOrders: (customerId: string) => Order[];
  };
  orderHooks: {
    regionFilter: string;
    statusFilter: string;
    dateRange: DateRange;
    setRegionFilter: (filter: string) => void;
    setStatusFilter: (filter: string) => void;
    setDateRange: (range: DateRange) => void;
  };
  isLoading: boolean;
}

const REGIONS = ["All", "APAC", "UK", "US"];
const STATUSES = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  Processing: "bg-blue-100 text-blue-800 border border-blue-200",
  Shipped: "bg-purple-100 text-purple-800 border border-purple-200",
  Delivered: "bg-green-100 text-green-800 border border-green-200",
  Cancelled: "bg-red-100 text-red-800 border border-red-200",
};

const statusAnimations = {
  Pending: "animate-pulse",
  Processing: "animate-bounce",
  Shipped: "",
  Delivered: "animate-pulse",
  Cancelled: "",
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 sm:px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-4 sm:px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </td>
      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-4 sm:px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-4 sm:px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No orders found
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Try adjusting your filters or check back later for new orders.
      </p>
      <div className="flex justify-center">
        <Filter className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-400">
          Clear filters to see all orders
        </span>
      </div>
    </div>
  );
}

export function OrderTable({
  orders,
  customerHooks,
  orderHooks,
  isLoading,
}: OrderTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCustomerClick = (customerId: string) => {
    const customer = customerHooks.getCustomerById(customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Region
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Qty
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(8)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Orders ({orders.length})
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  value={orderHooks.regionFilter}
                  onChange={(e) => orderHooks.setRegionFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 hover:border-gray-400"
                  style={{ minHeight: "44px" }}
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region === "All" ? "All Regions" : region}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={orderHooks.statusFilter}
                  onChange={(e) => orderHooks.setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 hover:border-gray-400"
                  style={{ minHeight: "44px" }}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status === "All" ? "All Statuses" : status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-medium text-gray-700 min-w-fit">
              Date Range:
            </span>
            <DateRangeFilter
              dateRange={orderHooks.dateRange}
              onDateRangeChange={orderHooks.setDateRange}
              disabled={isLoading}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto" style={{ minHeight: "400px" }}>
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Region
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Product
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Qty
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => {
                const customer = customerHooks.getCustomerById(
                  order.customerId
                );
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-blue-50 transition-all duration-200 hover:shadow-sm ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-gray-900">
                      <span className="bg-gray-100 px-2 py-1 rounded-lg">
                        {order.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-medium">
                        {order.region}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleCustomerClick(order.customerId)}
                        className="flex items-center space-x-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-xl"
                        style={{ minWidth: "44px", minHeight: "44px" }}
                      >
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate max-w-[100px] sm:max-w-none">
                          {customer?.name || "Unknown"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                      <span className="truncate max-w-[120px] block">
                        {order.product}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                      <span className="bg-gray-100 px-2 py-1 rounded-lg font-medium">
                        {order.quantity}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount, order.currency)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-xl ${
                          statusColors[order.status]
                        } ${
                          statusAnimations[order.status]
                        } transition-all duration-200`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          orders={customerHooks.getCustomerOrders(selectedCustomer.customerId)}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
