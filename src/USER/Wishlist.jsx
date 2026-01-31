import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import api from "../api";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [showNote, setShowNote] = useState(false);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Wishlist Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setShowNote(true);
    setTimeout(() => setShowNote(false), 3000);
  };

  const removeFromWishlist = async (id) => {
    try {
      await api.post("/wishlist/toggle", { productId: id });
      
      setWishlist(wishlist.filter((item) => item._id !== id));
      triggerNotification("Item removed");
      window.dispatchEvent(new Event("wishlistUpdate"));

    } catch (err) {
      console.error(err);
      triggerNotification("Failed to remove");
    }
  };

  const addToCartFromWishlist = async (product) => {
    try {
      await api.post("/cart/add", {
        productId: product._id,
        qty: 1
      });

      triggerNotification("Moved to Cart!");
      window.dispatchEvent(new Event("cartUpdate"));
      
    } catch (err) {
      console.error("Cart Error:", err);
      triggerNotification(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Wishlist...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-6 relative">
      
      <div className={`fixed top-24 right-5 z-[100] transition-all duration-300 ${showNote ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2">
           <span>{notification}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-900">My Favourites</h1>
          <Link to="/shop" className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-400 mb-4">Your wishlist is empty!</h2>
            <Link to="/shop" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition shadow-lg">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div key={item._id} className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100 group hover:shadow-xl transition-all duration-300">
                
                <div className="relative h-64 bg-slate-50 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>
                   <img 
                     src={item.image} 
                     alt={item.name} 
                     className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                   />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.category || "Toy"}</p>
                    </div>
                    <p className="text-indigo-600 font-black text-lg">₹{item.price}</p>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => addToCartFromWishlist(item)}
                      className="flex-1 bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition text-sm font-bold shadow-lg shadow-slate-200"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item._id)}
                      className="bg-rose-50 text-rose-500 w-12 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition border border-rose-100"
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;