import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaEye, FaTimes, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import api from "../api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [showNote, setShowNote] = useState(false);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setShowNote(true);
    setTimeout(() => setShowNote(false), 3000);
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/orders/admin/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      triggerNotification(`Order marked as ${newStatus}`);
    } catch (err) {
      triggerNotification("Failed to update status");
    }
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "shipped": return "bg-blue-50 text-blue-600 border-blue-100";
      case "processing": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const isPaid = (order) => {
    const status = order.payment?.status?.toLowerCase() || order.paymentStatus?.toLowerCase();
    return ["paid", "success"].includes(status);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Loading Orders...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Toast */}
      <div className={`fixed top-10 right-10 z-[100] transition-all duration-500 transform ${showNote ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"}`}>
        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
          <FaCheckCircle className="text-emerald-400" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Orders</h1>
            <p className="text-slate-500 font-medium">Manage fulfillment and customer transactions</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <FaBoxOpen size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Database Total</p>
              <p className="text-2xl font-black text-slate-900">{orders.length}</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-6">Reference</th>
                  <th className="p-6">Customer</th>
                  <th className="p-6">Date</th>
                  <th className="p-6">Amount</th>
                  <th className="p-6 text-center">Payment</th>
                  <th className="p-6 text-center">Fulfillment</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => (
                  <tr key={order._id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="p-6 font-mono text-[11px] text-slate-400 font-bold">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800">{order.user?.name || "Guest"}</span>
                        <span className="text-xs text-slate-400">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td className="p-6 font-black text-slate-900">₹{order.total.toLocaleString()}</td>
                    <td className="p-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${isPaid(order) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {isPaid(order) ? <FaCheckCircle /> : <FaClock />} {isPaid(order) ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border outline-none transition-all cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <button onClick={() => openDetails(order)} className="p-3 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Order Invoice</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">REF: {selectedOrder._id}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-rose-500 rounded-full shadow-sm transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="mb-10 grid grid-cols-2 gap-8">
                <div className="bg-indigo-50/50 p-6 rounded-[1.5rem] border border-indigo-100">
                  <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-3 flex items-center gap-2 tracking-widest"><FaTruck /> Shipping To</h4>
                  <p className="font-black text-slate-900">{selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}<br />
                    {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <p className="text-sm font-bold text-indigo-600 mt-3">📞 {selectedOrder.shippingAddress?.mobile}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Customer Details</h4>
                  <p className="font-black text-slate-900">{selectedOrder.user?.name}</p>
                  <p className="text-sm text-slate-500 mt-1">{selectedOrder.user?.email}</p>
                </div>
              </div>

              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Line Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl">
                    <img src={item.product?.image || "https://via.placeholder.com/100"} className="w-14 h-14 object-contain bg-slate-50 rounded-xl" alt="" />
                    <div className="flex-1">
                      <p className="font-black text-slate-900 text-sm">{item.product?.name || "Deleted Product"}</p>
                      <p className="text-xs text-slate-400 font-bold">QTY {item.qty} × ₹{(item.priceAtPurchase || item.product?.price).toLocaleString()}</p>
                    </div>
                    <span className="font-black text-indigo-600">₹{(item.qty * (item.priceAtPurchase || item.product?.price)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Net Total</p>
                <p className="text-3xl font-black text-white">₹{selectedOrder.total.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isPaid(selectedOrder) ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                   {isPaid(selectedOrder) ? 'Payment Verified' : 'Payment Awaiting'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;