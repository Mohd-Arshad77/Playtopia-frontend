import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  Shield,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    income: 0,
    orders: 0,
    admins: 0,
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get("http://localhost:3001/products");
        const usersRes = await axios.get("http://localhost:3001/users");
        const ordersRes = await axios.get("http://localhost:3001/orders");

        let income = 0;
        if (ordersRes.data && ordersRes.data.length > 0) {
          income = ordersRes.data.reduce(
            (acc, order) => acc + (order.total || 0),
            0
          );
        }

        setStats({
          products: productsRes.data.length,
          users: usersRes.data.filter((u) => u.role === "user").length,
          income,
          orders: ordersRes.data.length,
          admins: usersRes.data.filter((u) => u.role === "admin").length,
        });

        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchData();
  }, []);

 
  const incomeData = orders.map((o) => ({
    label: o.id ? `Order ${o.id}` : "Unknown",
    income: o.total || 0,
  }));

  const cards = [
    { title: "Products", value: stats.products, icon: <Package />, color: "bg-blue-500" },
    { title: "Users", value: stats.users, icon: <Users />, color: "bg-green-500" },
    { title: "Income", value: `₹${stats.income}`, icon: <DollarSign />, color: "bg-yellow-500" },
    { title: "Orders", value: stats.orders, icon: <ShoppingCart />, color: "bg-purple-500" },
    { title: "Admins", value: stats.admins, icon: <Shield />, color: "bg-red-500" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

     
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`${c.color} text-white p-6 rounded-lg shadow flex items-center justify-between`}
          >
            <div>
              <h2 className="text-lg">{c.title}</h2>
              <p className="text-2xl font-bold">{c.value}</p>
            </div>
            <div className="text-3xl">{c.icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Income Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
