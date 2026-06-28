import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart, FaRegHeart, FaSearch, FaFilter,
  FaShoppingCart, FaCheck, FaChevronLeft,
  FaChevronRight, FaExclamationCircle
} from "react-icons/fa";
import api from "../api";

/* ─── Injected CSS for heart burst animation ───────────────────────────────── */
const HEART_STYLE = `
  @keyframes heartRise {
    0%   { transform: translate(-50%, -50%) scale(0) rotate(0deg);   opacity: 1; }
    25%  { transform: translate(-50%, -80%) scale(1.5) rotate(-15deg); opacity: 1; }
    60%  { transform: translate(-50%, -130%) scale(1.1) rotate(12deg); opacity: 0.85; }
    100% { transform: translate(-50%, -200%) scale(0.5) rotate(-8deg); opacity: 0; }
  }
  @keyframes heartRiseL {
    0%   { transform: translate(-80%, -40%) scale(0) rotate(-20deg); opacity: 1; }
    30%  { transform: translate(-110%, -90%) scale(1.2) rotate(-30deg); opacity: 1; }
    100% { transform: translate(-130%, -190%) scale(0.4) rotate(-20deg); opacity: 0; }
  }
  @keyframes heartRiseR {
    0%   { transform: translate(-20%, -40%) scale(0) rotate(20deg);  opacity: 1; }
    30%  { transform: translate(10%, -90%) scale(1.2) rotate(30deg); opacity: 1; }
    100% { transform: translate(30%, -190%) scale(0.4) rotate(20deg); opacity: 0; }
  }
  @keyframes heartRiseLL {
    0%   { transform: translate(-120%, -20%) scale(0) rotate(-35deg); opacity: 1; }
    100% { transform: translate(-160%, -170%) scale(0.3) rotate(-25deg); opacity: 0; }
  }
  @keyframes heartRiseRR {
    0%   { transform: translate(20%, -20%) scale(0) rotate(35deg);  opacity: 1; }
    100% { transform: translate(60%, -170%) scale(0.3) rotate(25deg); opacity: 0; }
  }
  .heart-center { animation: heartRise  0.9s cubic-bezier(.17,.67,.35,1.2) forwards; }
  .heart-left   { animation: heartRiseL 0.85s cubic-bezier(.17,.67,.35,1.2) 0.06s forwards; }
  .heart-right  { animation: heartRiseR 0.85s cubic-bezier(.17,.67,.35,1.2) 0.1s  forwards; }
  .heart-ll     { animation: heartRiseLL 0.75s ease-out 0.15s forwards; }
  .heart-rr     { animation: heartRiseRR 0.75s ease-out 0.18s forwards; }
`;

/* ─── 3D Heart Burst popup ──────────────────────────────────────────────────── */
function HeartBurst({ x, y, id, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, [id, onDone]);

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 99999,
        userSelect: "none",
      }}
    >
      <span className="heart-center" style={{ position: "absolute", fontSize: 36, filter: "drop-shadow(0 0 8px #f43f5e)" }}>❤️</span>
      <span className="heart-left"   style={{ position: "absolute", fontSize: 26 }}>💖</span>
      <span className="heart-right"  style={{ position: "absolute", fontSize: 24 }}>💗</span>
      <span className="heart-ll"     style={{ position: "absolute", fontSize: 18 }}>💕</span>
      <span className="heart-rr"     style={{ position: "absolute", fontSize: 16 }}>💓</span>
    </div>
  );
}

/* ─── Skeleton placeholder card ─────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-64 bg-slate-200" />
    <div className="p-6 space-y-3">
      <div className="h-3 w-1/3 bg-slate-200 rounded-full" />
      <div className="h-5 w-2/3 bg-slate-200 rounded-full" />
      <div className="h-3 w-full bg-slate-100 rounded-full" />
      <div className="h-3 w-4/5 bg-slate-100 rounded-full" />
      <div className="h-12 bg-slate-200 rounded-2xl mt-4" />
    </div>
  </div>
);

const capitalizeWords = (str) => {
  if (!str) return "";
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

function Shop() {
  const [products, setProducts]         = useState([]);
  const [cart, setCart]                 = useState([]);
  const [wishlist, setWishlist]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [search, setSearch]             = useState("");
  const [category, setCategory]         = useState("All");
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [notification, setNotification] = useState({ msg: "", show: false });

  // Heart burst animations — array of { id, x, y }
  const [hearts, setHearts]             = useState([]);

  const navigate    = useNavigate();
  const searchTimer = useRef(null);
  const isFirstLoad = useRef(true);
  const heartId     = useRef(0);

  const categories = ["All", "Car", "Sports car", "Jeep", "Truck"];

  /* ── Fetch products ──────────────────────────────────────────────────────── */
  const fetchProducts = useCallback(async (page, cat, q) => {
    if (isFirstLoad.current) { setLoading(true); }
    else { setRefreshing(true); }

    try {
      const res = await api.get(
        `/products?page=${page}&limit=6&search=${encodeURIComponent(q)}&category=${cat}`
      );
      setProducts(res.data?.products || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFirstLoad.current = false;
    }
  }, []);

  /* ── Fetch user cart + wishlist ──────────────────────────────────────────── */
  const fetchUserData = useCallback(async () => {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined") return;
    try {
      const [cartRes, wishRes] = await Promise.all([
        api.get("/cart"),
        api.get("/wishlist"),
      ]);
      setCart(cartRes.data?.data || []);
      setWishlist(wishRes.data?.data || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchProducts(1, "All", "");
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) return;
    fetchProducts(currentPage, category, search);
  }, [currentPage, category]);

  useEffect(() => {
    if (isFirstLoad.current) return;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, category, search);
    }, 450);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  useEffect(() => {
    window.addEventListener("cartUpdate", fetchUserData);
    window.addEventListener("wishlistUpdate", fetchUserData);
    return () => {
      window.removeEventListener("cartUpdate", fetchUserData);
      window.removeEventListener("wishlistUpdate", fetchUserData);
    };
  }, [fetchUserData]);

  /* ── Toast notification ──────────────────────────────────────────────────── */
  const triggerNote = (msg) => {
    setNotification({ msg, show: true });
    setTimeout(() => setNotification({ msg: "", show: false }), 2800);
  };

  /* ── Wishlist toggle with heart burst ────────────────────────────────────── */
  const toggleWishlist = async (product, e) => {
    const exists = wishlist.some((item) => item._id === product._id);
    const newWishlist = exists
      ? wishlist.filter((item) => item._id !== product._id)
      : [...wishlist, product];

    // Optimistic update
    setWishlist(newWishlist);

    // Spawn heart burst only when ADDING to wishlist
    if (!exists) {
      const rect = e.currentTarget.getBoundingClientRect();
      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;
      const id = ++heartId.current;
      setHearts((prev) => [...prev, { id, x: bx, y: by }]);
    }

    try {
      await api.post("/wishlist/toggle", { productId: product._id });
      // Fire CustomEvent with count so Navbar updates instantly
      window.dispatchEvent(
        new CustomEvent("wishlistUpdate", { detail: { count: newWishlist.length } })
      );
      triggerNote(exists ? "Removed from Favourites" : "Added to Favourites ❤️");
    } catch {
      // Revert on failure
      setWishlist(wishlist);
      triggerNote("Failed to update wishlist");
    }
  };

  const removeHeart = useCallback((id) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  /* ── Add to cart ─────────────────────────────────────────────────────────── */
  const addToCart = async (product) => {
    const existingItem = cart.find((i) => i.product?._id === product._id);
    const currentQty   = existingItem ? existingItem.qty : 0;

    if (currentQty + 1 > product.stock) {
      triggerNote(`Stock limit! Only ${product.stock} available.`);
      return;
    }
    try {
      await api.post("/cart/add", { productId: product._id, qty: 1 });
      const newCart = existingItem
        ? cart.map((i) => i.product?._id === product._id ? { ...i, qty: i.qty + 1 } : i)
        : [...cart, { product: { _id: product._id, ...product }, qty: 1 }];
      setCart(newCart);
      triggerNote("Added to Cart ✓");
      window.dispatchEvent(
        new CustomEvent("cartUpdate", { detail: { count: newCart.length } })
      );
    } catch (error) {
      triggerNote(error.response?.data?.message || "Failed to add item");
    }
  };

  const paginate = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-16">
      {/* Inject heart animation CSS */}
      <style>{HEART_STYLE}</style>

      {/* Heart burst portals */}
      {hearts.map((h) => (
        <HeartBurst key={h.id} id={h.id} x={h.x} y={h.y} onDone={() => removeHeart(h.id)} />
      ))}

      {/* Toast */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 ${notification.show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"}`}>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-lg border border-white/10">
          <span className="text-sm font-bold uppercase tracking-widest">{notification.msg}</span>
        </div>
      </div>

      {/* Subtle refresh progress bar */}
      <div className={`fixed top-0 left-0 h-0.5 bg-indigo-500 z-[300] transition-all duration-300 ${refreshing ? "w-full opacity-100" : "w-0 opacity-0"}`} />

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            The <span className="text-indigo-600">Showroom</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">Discover our premium die-cast collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0 space-y-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                <FaFilter /> Categories
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all text-left ${
                      category === cat
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                <p className="text-slate-400 mt-2">Try checking the "All" category.</p>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 transition-opacity duration-200 ${refreshing ? "opacity-60" : "opacity-100"}`}>
                  {products.map((product) => {
                    const isFav      = wishlist.some((item) => item._id === product._id);
                    const cartItem   = cart.find((item) => item.product?._id === product._id);
                    const isInCart   = !!cartItem;
                    const isMaxQty   = cartItem && cartItem.qty >= product.stock;

                    return (
                      <div
                        key={product._id}
                        className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                      >
                        <div className="relative h-64 overflow-hidden bg-slate-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                          />

                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                              <span className="text-white font-black uppercase tracking-widest border-2 border-white px-4 py-2">Out of Stock</span>
                            </div>
                          )}

                          {/* Heart / wishlist button */}
                          <button
                            onClick={(e) => toggleWishlist(product, e)}
                            className={`absolute top-5 right-5 p-3 rounded-full backdrop-blur-md transition-all duration-300 z-20 ${
                              isFav
                                ? "bg-rose-500 text-white scale-110 shadow-lg shadow-rose-400/50"
                                : "bg-white/80 text-slate-400 hover:text-rose-500 hover:scale-110"
                            }`}
                            title={isFav ? "Remove from favourites" : "Add to favourites"}
                          >
                            {isFav
                              ? <FaHeart size={18} className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                              : <FaRegHeart size={18} />
                            }
                          </button>

                          {/* Quick view hover overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-slate-900/80 to-transparent z-20">
                            <button
                              onClick={() => navigate(`/product/${product._id}`)}
                              className="w-full bg-white text-slate-900 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-colors"
                            >
                              Quick View
                            </button>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">{product.category}</p>
                              <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{capitalizeWords(product.name)}</h2>
                            </div>
                            <span className="text-xl font-black text-slate-900 italic">₹{product.price}</span>
                          </div>
                          <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10 font-medium">{product.description}</p>

                          {isMaxQty ? (
                            <button disabled className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200">
                              <FaExclamationCircle /> Max Limit Reached
                            </button>
                          ) : isInCart ? (
                            <button onClick={() => navigate("/cart")} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg shadow-green-200">
                              <FaCheck size={16} /> Go to Cart
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-200 ${
                                product.stock === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-indigo-600"
                              }`}
                            >
                              <FaShoppingCart size={16} />
                              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 gap-2">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <FaChevronLeft size={12} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => paginate(i + 1)} className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;