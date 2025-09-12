import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Sidenavbar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/products", label: "Products" },
    { path: "/admin/orders", label: "Orders" },
  ];

  return (
    <div className="flex min-h-screen">
    
      <div className="fixed top-0 left-0 w-full bg-blue-600 text-white flex items-center justify-between p-4 md:hidden z-40">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

 
      <div
        className={`fixed top-0 left-0 h-screen bg-blue-600 text-white flex flex-col shadow-lg 
        w-60 z-50 transform transition-transform duration-300 overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold p-5 border-b border-blue-500 hidden md:block">
          Admin Panel
        </h2>

        <nav className="flex flex-col p-3 gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `p-3 rounded-md transition ${
                  isActive
                    ? "bg-white text-blue-600 font-semibold"
                    : "hover:bg-blue-500"
                }`
              }
              onClick={() => setOpen(false)} 
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="mt-auto m-3 bg-red-500 hover:bg-red-600 p-3 rounded-md transition"
        >
          Logout
        </button>
      </div>

    
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

     
      <div className="flex-1 p-6 bg-gray-100 w-full md:ml-60 mt-14 md:mt-0 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Sidenavbar;
