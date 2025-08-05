import { useMemo, useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { generateMockCustomers } from "./data/generateMockCustomers";
import { generateMockOrders } from "./data/generateMockOrders";
import { useOrders } from "./hooks/useOrders";
import { useCustomers } from "./hooks/useCustomers";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { Sidebar } from "./components/Sidebar";
import { DashboardStats } from "./components/DashboardStats";
import { OrderTable } from "./components/OrderTable";
import { Search } from "./components/Search";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const customers = useMemo(() => generateMockCustomers(30), []);
  const orders = useMemo(() => generateMockOrders(customers, 50), [customers]);

  const customerHooks = useCustomers(customers, orders);
  const orderHooks = useOrders({ 
    orders, 
    getCustomerById: customerHooks.getCustomerById 
  });
  const stats = useDashboardStats(orders);

  const lastUpdated = useMemo(() => new Date().toLocaleString(), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}
          onClick={closeSidebar}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-4 rounded-tr-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                style={{ minWidth: "44px", minHeight: "44px" }}
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                King Living Dashboard
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              Last updated: {lastUpdated}
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 rounded-tl-2xl">
          <DashboardStats stats={stats} isLoading={isLoading} />
          <Search
            searchTerm={orderHooks.searchTerm}
            onSearchChange={orderHooks.setSearchTerm}
            isLoading={orderHooks.isSearching && isLoading}
            className="mb-4 sm:mb-6"
          />
          <OrderTable
            orders={orderHooks.filteredOrders}
            customerHooks={customerHooks}
            orderHooks={orderHooks}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
