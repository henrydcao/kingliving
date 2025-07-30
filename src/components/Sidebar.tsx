import { BarChart3, X } from "lucide-react";

const menuItems = [{ icon: BarChart3, label: "Dashboard", active: true }];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-gray-900 text-white flex-col rounded-tr-2xl shadow-xl border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">King Living</h2>
          <p className="text-gray-400 text-sm">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      item.active
                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white cursor-not-allowed hover:rounded-xl"
                    }`}
                    disabled={!item.active}
                    style={{ minHeight: "44px" }}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out rounded-tr-2xl shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">King Living</h2>
            <p className="text-gray-400 text-sm">Admin Panel</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
            style={{ minWidth: "44px", minHeight: "44px" }}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      item.active
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white cursor-not-allowed"
                    }`}
                    disabled={!item.active}
                    style={{ minHeight: "44px" }}
                    onClick={item.active ? onClose : undefined}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </div>
    </>
  );
}
