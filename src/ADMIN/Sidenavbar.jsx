import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Menu, 
  X, 
  LogOut 
} from "lucide-react";

function Sidenavbar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="fixed top-0 left-0 w-full bg-white text-slate-800 flex items-center justify-between p-4 md:hidden z-40 shadow-sm border-b border-gray-200">
        <h2 className="text-lg font-bold">Admin Panel</h2>
        <button onClick={() => setOpen(!open)} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white text-slate-600 flex flex-col shadow-xl z-50 
        transform transition-transform duration-300 ease-in-out border-r border-gray-100
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Main Menu</p>
          
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "hover:bg-gray-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full md:ml-64 p-6 mt-16 md:mt-0 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}

export default Sidenavbar;