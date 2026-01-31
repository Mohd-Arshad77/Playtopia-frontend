import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaArrowRight, FaShoppingCart, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import api from "../api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [notification, setNotification] = useState({ msg: "", show: false, type: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, productId: null });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      const data = res.data.data || [];
      setCartItems(data);
      calculateTotal(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.product.price * item.qty;
    });
    setTotalAmount(total);
  };

  const triggerNote = (msg, type = "success") => {
    setNotification({ msg, show: true, type });
    setTimeout(() => {
      setNotification({ msg: "", show: false, type: "" });
    }, 3000);
  };

  const increaseQty = async (id) => {
    try {
      const res = await api.post("/cart/increase", { productId: id });
      setCartItems(res.data.data);
      calculateTotal(res.data.data);
    } catch (err) {
      triggerNote(err.response?.data?.message || "Stock limit reached", "error");
    }
  };

  const decreaseQty = async (id) => {
    const item = cartItems.find((i) => i.product._id === id);
    if (!item || item.qty <= 1) return;
    try {
      const res = await api.post("/cart/decrease", { productId: id });
      setCartItems(res.data.data);
      calculateTotal(res.data.data);
    } catch {
      triggerNote("Update failed", "error");
    }
  };

  const initiateDelete = (id) => {
    setConfirmModal({ show: true, productId: id });
  };

  const confirmDelete = async () => {
    if (!confirmModal.productId) return;
    try {
      const res = await api.delete(`/cart/remove/${confirmModal.productId}`);
      setCartItems(res.data.data);
      calculateTotal(res.data.data);
      window.dispatchEvent(new Event("cartUpdate"));
      triggerNote("Removed", "success");
    } catch {
      triggerNote("Remove failed", "error");
    }
    setConfirmModal({ show: false, productId: null });
  };

  if (loading) {
    return <div className="text-center pt-32 font-bold text-gray-400">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <FaShoppingCart className="text-5xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Cart is Empty</h2>
        <Link to="/shop" className="px-6 py-3 bg-black text-white rounded-xl">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300 ${
          notification.show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`px-6 py-3 rounded-full flex items-center gap-2 text-white shadow-lg ${
            notification.type === "error" ? "bg-rose-600" : "bg-black"
          }`}
        >
          {notification.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
          {notification.msg}
        </div>
      </div>

      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
            <h3 className="font-bold mb-2 text-lg">Remove Item?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this item?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, productId: null })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
          {cartItems.map((item) => (
            <div key={item.product._id} className="bg-white p-4 rounded-xl flex gap-4 items-center border shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                <img src={item.product.image} className="w-full h-full object-contain" alt={item.product.name} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate text-gray-800">{item.product.name}</h3>
                <p className="text-indigo-600 font-bold">₹{item.product.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
                <button
                  onClick={() => decreaseQty(item.product._id)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                    item.qty <= 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-white"
                  }`}
                  disabled={item.qty <= 1}
                >
                  -
                </button>
                <span className="px-3 font-bold w-8 text-center">{item.qty}</span>
                <button
                  onClick={() => increaseQty(item.product._id)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => initiateDelete(item.product._id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-28">
            <h2 className="font-bold text-lg mb-4 border-b pb-2">Order Summary</h2>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate pr-4">
                    {item.product.name} <span className="text-gray-400">× {item.qty}</span>
                  </span>
                  <span className="font-medium">₹{(item.product.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="flex justify-between items-center font-bold text-xl mb-6">
              <span>Total</span>
              <span className="text-indigo-600">₹{totalAmount.toLocaleString()}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Checkout <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;