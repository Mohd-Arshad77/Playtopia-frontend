import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaChevronRight, FaShieldAlt, FaTruck, FaUndo, FaBoxOpen } from "react-icons/fa";
import api from "../api";

// ── Image with skeleton placeholder ─────────────────────────────────────────
function ProductImage({ src, alt, isOutOfStock }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  return (
    <div className="relative w-full h-[400px]">
      {/* Skeleton shown until image loads */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-[2rem]" />
      )}
      <img
        src={error ? "https://via.placeholder.com/600x400?text=No+Image" : src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true); }}
        className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-110 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${isOutOfStock ? "grayscale opacity-50" : ""}`}
      />
    </div>
  );
}

// ── Full page skeleton while data loads ─────────────────────────────────────
function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        <div className="bg-slate-100 rounded-[2rem] h-[480px]" />
        <div className="space-y-6 py-6">
          <div className="h-4 w-24 bg-slate-200 rounded-full" />
          <div className="h-12 w-3/4 bg-slate-200 rounded-full" />
          <div className="h-8 w-1/3 bg-indigo-100 rounded-full" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-100 rounded-full" />
            <div className="h-3 w-5/6 bg-slate-100 rounded-full" />
            <div className="h-3 w-4/5 bg-slate-100 rounded-full" />
          </div>
          <div className="h-16 bg-slate-200 rounded-2xl" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct]       = useState(null);
  const [cart, setCart]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState("");
  const [showNote, setShowNote]     = useState(false);
  const [quantity, setQuantity]     = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch product and cart in parallel
        const raw = localStorage.getItem("user");
        const isLoggedIn = raw && raw !== "undefined";

        const requests = [api.get(`/products/${id}`)];
        if (isLoggedIn) requests.push(api.get("/cart"));

        const [prodRes, cartRes] = await Promise.all(requests);
        setProduct(prodRes.data);
        if (cartRes) setCart(cartRes.data?.data || []);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Re-sync cart when updated elsewhere
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await api.get("/cart");
        setCart(res.data?.data || []);
      } catch { /* silent */ }
    };
    window.addEventListener("cartUpdate", sync);
    return () => window.removeEventListener("cartUpdate", sync);
  }, []);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setShowNote(true);
    setTimeout(() => setShowNote(false), 3000);
  };

  const handleQuantityChange = (type) => {
    if (type === "inc") {
      if (quantity < product.stock) setQuantity(quantity + 1);
      else triggerNotification(`Only ${product.stock} items available!`);
    } else {
      setQuantity(Math.max(1, quantity - 1));
    }
  };

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      await api.post("/cart/add", { productId: product._id, qty: quantity });
      setCart((prev) => [...prev, { product: { _id: product._id } }]);
      triggerNotification("Added to Cart! ✓");
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error) {
      triggerNotification(error.response?.data?.message || "Failed to add item");
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    try {
      await api.post("/cart/add", { productId: product._id, qty: quantity });
      window.dispatchEvent(new Event("cartUpdate"));
      navigate("/checkout");
    } catch (error) {
      triggerNotification("Error processing request");
    }
  };

  if (loading) return <ProductDetailsSkeleton />;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-bold text-slate-400">Product not found</p>
      <button onClick={() => navigate("/shop")} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700">
        Back to Shop
      </button>
    </div>
  );

  const isInCart    = cart.some((item) => item.product?._id === product._id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-white pb-20 pt-24">
      {/* Notification */}
      <div className={`fixed top-24 right-10 z-[100] transition-all duration-500 transform ${showNote ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0 pointer-events-none"}`}>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
          <span className="text-sm font-bold tracking-wide">{notification}</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <FaChevronRight className="text-[10px]" />
        <Link to="/shop" className="hover:text-indigo-400 transition-colors">Shop</Link>
        <FaChevronRight className="text-[10px]" />
        <span className="text-slate-900 line-clamp-1">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image panel */}
        <div className="bg-slate-50 rounded-[2rem] p-12 flex items-center justify-center relative overflow-hidden group">
          <ProductImage src={product.image} alt={product.name} isOutOfStock={isOutOfStock} />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px] z-10">
              <span className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl border border-white/10">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-8 py-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
                {product.category || "Toy"}
              </span>
              {isOutOfStock ? (
                <span className="text-rose-500 text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Out of Stock
                </span>
              ) : (
                <span className="text-emerald-600 text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> In Stock
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 leading-tight">{product.name}</h1>
            <p className="text-4xl font-light text-indigo-600 mt-4 tracking-tight">₹{product.price.toLocaleString()}</p>
          </div>

          <p className="text-slate-500 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6 italic">
            {product.description}
          </p>

          {!isOutOfStock ? (
            <div className="space-y-10">
              {/* Quantity selector */}
              <div className="flex items-center gap-8">
                <span className="font-black text-slate-300 text-sm tracking-widest">QUANTITY</span>
                <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 shadow-inner">
                  <button onClick={() => handleQuantityChange("dec")} className="w-12 h-12 font-black text-xl hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-90">-</button>
                  <span className="w-12 text-center font-black text-slate-900 text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("inc")}
                    className={`w-12 h-12 font-black text-xl rounded-xl transition-all active:scale-90 ${quantity >= product.stock ? "opacity-20 cursor-not-allowed" : "hover:bg-white hover:shadow-sm"}`}
                  >+</button>
                </div>
                <span className="text-xs text-slate-400 font-bold bg-slate-50 px-3 py-1 rounded-md">{product.stock} units left</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-5">
                {isInCart ? (
                  <button onClick={() => navigate("/cart")} className="flex-1 bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 active:scale-95">
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={addToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-300 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {addingToCart ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
                    ) : "Add to Cart"}
                  </button>
                )}
                <button onClick={buyNow} className="flex-1 bg-yellow-400 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-100 active:scale-95">
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
                <h3 className="text-slate-900 font-black text-xl uppercase tracking-tight">Sold Out</h3>
                <p className="text-slate-500 text-sm mt-1">This item is currently unavailable.</p>
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100">
            {[
              { icon: <FaTruck />, label: "Express Shipping", hover: "indigo" },
              { icon: <FaShieldAlt />, label: "Secure Payment", hover: "emerald" },
              { icon: <FaUndo />, label: "Easy Returns", hover: "rose" },
            ].map(({ icon, label, hover }) => (
              <div key={label} className="flex flex-col items-center gap-3 group">
                <div className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-${hover}-50 transition-colors`}>
                  <span className={`text-slate-400 group-hover:text-${hover}-500 transition-colors`}>{icon}</span>
                </div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;