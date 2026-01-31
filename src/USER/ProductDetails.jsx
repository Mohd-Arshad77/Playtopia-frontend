import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaChevronRight, FaShieldAlt, FaTruck, FaUndo, FaBoxOpen } from "react-icons/fa";
import api from "../api";

function ProductDetails() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get(`/products/${id}`);
        setProduct(prodRes.data);

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          try {
            const cartRes = await api.get("/cart");
            setCart(cartRes.data.data || []);
          } catch (e) {
            console.log("Cart fetch error", e);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setShowNote(true);
    setTimeout(() => setShowNote(false), 3000);
  };

  const handleQuantityChange = (type) => {
    if (type === "inc") {
      if (quantity < product.stock) {
        setQuantity(quantity + 1);
      } else {
        triggerNotification(`Only ${product.stock} items available!`);
      }
    } else {
      setQuantity(Math.max(1, quantity - 1));
    }
  };

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      triggerNotification("Please login to continue!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await api.post("/cart/add", {
        productId: product._id,
        qty: quantity,
      });

      setCart((prevCart) => [...prevCart, { product: { _id: product._id } }]);

      triggerNotification("Added to Cart!");
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error) {
      console.error(error);
      triggerNotification(error.response?.data?.message || "Failed to add item");
    }
  };

  const buyNow = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      triggerNotification("Please login to buy!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await api.post("/cart/add", {
        productId: product._id,
        qty: quantity,
      });
      window.dispatchEvent(new Event("cartUpdate"));
      navigate("/checkout");
    } catch (error) {
      console.error(error);
      triggerNotification("Error processing request");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Product not found</div>;

  const isInCart = cart.some((item) => item.product && item.product._id === product._id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-white pb-20 pt-24">
      <div
        className={`fixed top-24 right-10 z-[100] transition-all duration-500 transform ${
          showNote ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
          <span className="text-sm font-bold tracking-wide">{notification}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <FaChevronRight className="text-[10px]" />
        <Link to="/shop" className="hover:text-indigo-400 transition-colors">Shop</Link>
        <FaChevronRight className="text-[10px]" />
        <span className="text-slate-900 line-clamp-1">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-slate-50 rounded-[2rem] p-12 flex items-center justify-center relative overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-[400px] object-contain transition-all duration-500 group-hover:scale-110 ${
              isOutOfStock ? "grayscale opacity-50" : ""
            }`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
              <span className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl border border-white/10">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="space-y-8 py-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                {product.category || "Toy"}
              </span>
              {isOutOfStock ? (
                <span className="text-rose-500 text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div> Out of Stock
                </span>
              ) : (
                <span className="text-emerald-600 text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> In Stock
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 leading-tight">
              {product.name}
            </h1>
            <p className="text-4xl font-light text-indigo-600 mt-4 tracking-tight">
              ₹{product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-slate-500 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6 italic">
            {product.description}
          </p>

          {!isOutOfStock ? (
            <div className="space-y-10">
              <div className="flex items-center gap-8">
                <span className="font-black text-slate-300 text-sm tracking-widest">QUANTITY</span>
                <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 shadow-inner">
                  <button
                    onClick={() => handleQuantityChange("dec")}
                    className="w-12 h-12 font-black text-xl hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-90"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black text-slate-900 text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("inc")}
                    className={`w-12 h-12 font-black text-xl rounded-xl transition-all active:scale-90 ${
                      quantity >= product.stock
                        ? "opacity-20 cursor-not-allowed"
                        : "hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400 font-bold bg-slate-50 px-3 py-1 rounded-md">
                  {product.stock} units left
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                {isInCart ? (
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={addToCart}
                    className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-300 active:scale-95"
                  >
                    Add to Cart
                  </button>
                )}

                <button
                  onClick={buyNow}
                  className="flex-1 bg-yellow-400 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-100 active:scale-95"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <FaBoxOpen className="text-slate-300 text-4xl" />
              </div>
              <div>
                <h3 className="text-slate-900 font-black text-xl uppercase tracking-tight">
                  Sold Out
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  This item is currently unavailable.
                </p>
              </div>
              <button
                disabled
                className="w-full bg-slate-200 text-slate-400 py-5 rounded-2xl font-black uppercase tracking-widest cursor-not-allowed"
              >
                Notify Me
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100">
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                <FaTruck className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                Express Shipping
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <FaShieldAlt className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                Secure Payment
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                <FaUndo className="text-slate-400 group-hover:text-rose-500 transition-colors" />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                Easy Returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;