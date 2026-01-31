import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  Activity
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    income: 0,
    orders: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get("/admin/stats");
        const statsData = statsRes.data.data;

        setStats({
          products: statsData.productsCount || 0,
          users: statsData.usersCount || 0,
          income: statsData.totalRevenue || 0,
          orders: statsData.ordersCount || 0,
        });

        const ordersRes = await api.get("/orders/admin/all");
        setOrders(ordersRes.data.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = orders.slice(0, 10).reverse().map((o, index) => ({
    name: `Order #${o._id.slice(-4)}`,
    amount: o.total,
    date: new Date(o.createdAt).toLocaleDateString()
  }));

  const cards = [
    { 
      title: "Total Revenue", 
      value: `₹${stats.income.toLocaleString()}`, 
      icon: <DollarSign size={28} />, 
      bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
      shadow: "shadow-orange-200"
    },
    { 
      title: "Total Orders", 
      value: stats.orders, 
      icon: <ShoppingCart size={28} />, 
      bg: "bg-gradient-to-br from-purple-500 to-indigo-600",
      shadow: "shadow-indigo-200"
    },
    { 
      title: "Active Users", 
      value: stats.users, 
      icon: <Users size={28} />, 
      bg: "bg-gradient-to-br from-emerald-400 to-teal-600",
      shadow: "shadow-teal-200"
    },
    { 
      title: "Products", 
      value: stats.products, 
      icon: <Package size={28} />, 
      bg: "bg-gradient-to-br from-blue-400 to-cyan-500",
      shadow: "shadow-cyan-200"
    },
  ];

  if (loading) return <div className="p-10 text-center text-slate-500">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, Admin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${c.bg} ${c.shadow} transition-transform hover:scale-105 duration-300`}
            >
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">{c.title}</p>
                  <h3 className="text-3xl font-black">{c.value}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  {c.icon}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="text-indigo-500"/> Revenue Trend
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">Last 10 Orders</span>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10}} 
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      ORD
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Order #{order._id.slice(-4)}</p>
                      <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-indigo-600">₹{order.total}</span>
                </div>
              ))}
              {orders.length === 0 && <p className="text-slate-400 text-center text-sm">No recent activity</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;