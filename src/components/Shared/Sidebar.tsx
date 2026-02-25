import { BarChart2, LayoutDashboard, LogOut, Package, Settings, ShoppingCart } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export function Sidebar() {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/billing", icon: ShoppingCart, label: "Billing" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/reports", icon: BarChart2, label: "Reports" },
    { to: "/settings", icon: Settings, label: "Settings" }
  ];

  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-62.5 bg-slate-900 text-white flex flex-col h-screen shrink-0">
      <div className="p-4 text-xl font-bold border-b border-slate-800 flex items-center h-15">
        QuickPOS
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
