import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import api from "../api";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser]     = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw && raw !== "undefined" ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount]         = useState(0);
  // Animate the heart badge when count changes
  const [heartBounce, setHeartBounce]     = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ── Fetch counts from API on mount ─────────────────────────────────────────
  useEffect(() => {
    const fetchCounts = async () => {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined") return;
      try {
        const [wishRes, cartRes] = await Promise.all([
          api.get("/wishlist"),
          api.get("/cart"),
        ]);
        setWishlistCount(wishRes.data?.data?.length || 0);
        setCartCount(cartRes.data?.data?.length || 0);
      } catch { /* silent */ }
    };
    fetchCounts();
  }, []);

  // ── Listen for wishlist / cart update events ────────────────────────────────
  useEffect(() => {
    const handleWishlist = (e) => {
      // CustomEvent carries count in detail
      const count = e.detail?.count;
      if (count !== undefined) {
        setWishlistCount(count);
        // Trigger heart bounce animation
        setHeartBounce(true);
        setTimeout(() => setHeartBounce(false), 700);
      }
    };

    const handleCart = (e) => {
      const count = e.detail?.count;
      if (count !== undefined) setCartCount(count);
    };

    const handleAuth = () => {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw && raw !== "undefined" ? JSON.parse(raw) : null);
      } catch { setUser(null); }
    };

    window.addEventListener("wishlistUpdate", handleWishlist);
    window.addEventListener("cartUpdate", handleCart);
    window.addEventListener("authChange", handleAuth);
    window.addEventListener("storage", handleAuth);

    return () => {
      window.removeEventListener("wishlistUpdate", handleWishlist);
      window.removeEventListener("cartUpdate", handleCart);
      window.removeEventListener("authChange", handleAuth);
      window.removeEventListener("storage", handleAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch { /* ignore */ }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setWishlistCount(0);
    setCartCount(0);
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-gray-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="text-white font-black text-xl tracking-widest hidden sm:block">
              PLAY<span className="text-indigo-500">TOPIA</span>
            </span>
          </div>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`text-xs font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                    isActive(link.path) ? "text-white" : "text-gray-500 hover:text-indigo-400"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side icons */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Wishlist icon with live count */}
            <Link to="/wishlist" className="relative p-2 group">
              <FaHeart
                size={20}
                className={`transition-all duration-300 ${
                  wishlistCount > 0
                    ? "text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]"
                    : "text-gray-400 group-hover:text-rose-400"
                } ${heartBounce ? "scale-125" : "scale-100"}`}
                style={{ transition: "transform 0.2s ease, color 0.3s ease" }}
              />
              {wishlistCount > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 bg-rose-500 text-[10px] text-white font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg shadow-rose-500/50 ${
                    heartBounce ? "animate-ping" : ""
                  }`}
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart icon with live count */}
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-indigo-400 transition-all">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-500 text-[10px] text-white font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-lg shadow-indigo-500/30">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User avatar / login */}
            <div className="ml-2 pl-4 border-l border-white/10 flex items-center">
              {user ? (
                <div className="group relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center cursor-pointer border-2 border-white/10 hover:scale-110 transition-transform">
                    <span className="text-white text-sm font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-gray-900 border border-white/10 p-2 rounded-xl shadow-2xl min-w-[160px]">
                      <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-xs text-gray-400">Welcome,</p>
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="bg-white text-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-indigo-500 hover:text-white transition-all">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-white ml-2" onClick={() => setIsOpen(true)}>
              <FaBars size={22} />
            </button>
          </div>
        </div>
      </nav>

      <div className="h-[65px]" />

      {/* Mobile slide-out menu */}
      <div className={`fixed inset-0 z-[200] transition-all ${isOpen ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        />
        <div className={`absolute right-0 top-0 h-full w-72 bg-gray-950 border-l border-white/10 p-6 shadow-2xl transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex justify-between items-center mb-10">
            <span className="text-white font-black">MENU</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <FaTimes size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <Link to="/"        onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-indigo-500">Home</Link>
            <Link to="/shop"    onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-indigo-500">Shop</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-indigo-500">Contact</Link>
            <hr className="border-white/5 my-2" />
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex justify-between items-center text-lg text-gray-300">
              Wishlist
              {wishlistCount > 0 && (
                <span className="bg-rose-500 px-2 py-0.5 rounded-full text-xs text-white font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex justify-between items-center text-lg text-gray-300">
              My Cart
              {cartCount > 0 && (
                <span className="bg-indigo-500 px-2 py-0.5 rounded-full text-xs text-white font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="absolute bottom-10 left-6 right-6">
            {user ? (
              <button onClick={handleLogout} className="w-full bg-rose-600/10 text-rose-500 border border-rose-600/20 py-3 rounded-xl font-bold">
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-indigo-600 text-white text-center py-3 rounded-xl font-bold">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;