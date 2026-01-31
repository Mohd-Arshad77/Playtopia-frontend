import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaTimes,
  FaBan,
  FaLock
} from "react-icons/fa";
import api from "../api";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({ msg: "", show: false, type: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, addressId: null });

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    mobile: "",
    street: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const navigate = useNavigate();

  const triggerNote = (msg, type = "error") => {
    setNotification({ msg, show: true, type });
    setTimeout(() => setNotification({ msg: "", show: false, type: "" }), 3000);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }

        const cartRes = await api.get("/cart");
        const cartData = cartRes.data.data || [];

        if (cartData.length === 0) {
          navigate("/shop");
          return;
        }

        setCart(cartData);
        fetchAddresses();
      } catch {}
    };
    init();
  }, [navigate]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address");
      const list = res.data.data.addresses || [];

      setAddresses(list);

      if (list.length) {
        const def = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(def._id);
      }
    } catch {}
  };

  const totalAmount = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post("/address/add", newAddress);

      setShowAddForm(false);
      setNewAddress({
        fullName: "",
        mobile: "",
        street: "",
        city: "",
        state: "",
        zipCode: ""
      });

      fetchAddresses();
      triggerNote("Address added", "success");
    } catch (err) {
      triggerNote(err.response?.data?.message || "Failed", "error");
    }
  };

  const initiateDelete = (id) => {
    setConfirmModal({ show: true, addressId: id });
  };

  const confirmDelete = async () => {
    if (!confirmModal.addressId) return;

    try {
      await api.delete(`/address/${confirmModal.addressId}`);
      fetchAddresses();
      triggerNote("Removed", "success");
    } catch {
      triggerNote("Failed", "error");
    }

    setConfirmModal({ show: false, addressId: null });
  };

  const handlePayment = async () => {
    if (!selectedAddressId) {
      triggerNote("Select address", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/payment/create-checkout-session", {
        addressId: selectedAddressId
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      triggerNote("Payment failed", "error");
      setLoading(false);
    }
  };

  const hasStockIssue = cart.some((i) => i.qty > i.product.stock);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all ${
          notification.show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`px-6 py-3 rounded-full flex gap-2 text-white shadow-lg ${
            notification.type === "error" ? "bg-rose-600" : "bg-black"
          }`}
        >
          {notification.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
          {notification.msg}
        </div>
      </div>

      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-2xl">
            <h3 className="font-bold mb-2 text-lg">Delete Address?</h3>
            <p className="text-sm mb-4 text-gray-500">Are you sure you want to remove this address?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, addressId: null })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Shipping Details</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`text-sm px-5 py-2.5 rounded-full flex items-center gap-2 transition-all ${
                showAddForm ? "bg-gray-200 text-gray-700" : "bg-black text-white hover:bg-gray-800 shadow-md"
              }`}
            >
              {showAddForm ? <FaTimes /> : <FaPlus />}
              {showAddForm ? "Close" : "Add New Address"}
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddAddress}
              className="bg-white p-6 rounded-2xl shadow-sm border grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300"
            >
              <input
                required
                placeholder="Full Name"
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                required
                placeholder="Mobile Number"
                onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                required
                placeholder="Street Address"
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="p-3 border rounded-xl md:col-span-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                required
                placeholder="City"
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                required
                placeholder="State"
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                required
                placeholder="Zip Code"
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                className="p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100">
                Save Shipping Address
              </button>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => setSelectedAddressId(addr._id)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedAddressId === addr._id
                    ? "border-indigo-600 bg-indigo-50 shadow-md"
                    : "bg-white border-transparent hover:border-gray-200 shadow-sm"
                }`}
              >
                {selectedAddressId === addr._id && (
                  <FaCheckCircle className="absolute right-4 top-4 text-indigo-600 text-lg" />
                )}
                <h3 className="font-bold flex items-center gap-2 text-gray-800">
                  <FaMapMarkerAlt className="text-indigo-500" />
                  {addr.fullName}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {addr.street}, {addr.city}
                  <br />
                  {addr.state} - {addr.zipCode}
                </p>
                <p className="text-sm font-bold mt-2 text-gray-700">{addr.mobile}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    initiateDelete(addr._id);
                  }}
                  className="text-gray-400 hover:text-red-500 text-xs mt-4 flex items-center gap-1 transition-colors"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl h-fit sticky top-28 shadow-sm border">
          <h2 className="font-bold text-lg mb-6 text-gray-800 border-b pb-4">Order Summary</h2>

          <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-1">
            {cart.map((item) => {
              const out = item.qty > item.product.stock;
              return (
                <div key={item.product._id} className={`flex gap-3 p-2 rounded-xl transition-colors ${out ? "bg-rose-50" : "hover:bg-gray-50"}`}>
                  <img src={item.product.image} className="w-12 h-12 rounded-lg object-contain bg-gray-50 p-1" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-gray-800">{item.product.name}</p>
                    <p className="text-xs text-gray-500 font-medium">Qty: {item.qty}</p>
                    {out && (
                      <p className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-1">
                        <FaExclamationCircle /> Out of stock
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-gray-800 whitespace-nowrap">
                    ₹{(item.product.price * item.qty).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center font-bold text-xl mb-8 pt-6 border-t border-gray-100">
            <span className="text-gray-800">Total Amount</span>
            <span className="text-indigo-600">₹{totalAmount.toLocaleString()}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !selectedAddressId || hasStockIssue}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
              loading || !selectedAddressId || hasStockIssue
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Redirecting...
              </>
            ) : hasStockIssue ? (
              <><FaBan /> Blocked</>
            ) : !selectedAddressId ? (
              <><FaLock /> Blocked</>
            ) : (
              "Pay Now"
            )}
          </button>
          
          {hasStockIssue && (
             <p className="text-center text-[11px] text-rose-500 mt-4 font-medium italic">
              Checkout disabled due to stock issues.
            </p>
          )}
          {!selectedAddressId && !hasStockIssue && !loading && (
             <p className="text-center text-[11px] text-gray-400 mt-4 italic">
              Select an address to enable payment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;