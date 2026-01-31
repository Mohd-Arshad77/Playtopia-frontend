import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({ wishlist: 0, cart: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const syncData = () => {
    const wish = JSON.parse(localStorage.getItem("wishlist")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCounts({ wishlist: wish.length, cart: cart.length });
    
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
  };

  useEffect(() => {
    syncData();
    window.addEventListener("wishlistUpdate", syncData);
    window.addEventListener("cartUpdate", syncData);
    window.addEventListener("storage", syncData);
    
    return () => {
      window.removeEventListener("wishlistUpdate", syncData);
      window.removeEventListener("cartUpdate", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-gray-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="text-white font-black text-xl tracking-widest hidden sm:block">
              PLAY<span className="text-indigo-500">TOPIA</span>
            </span>
          </div>

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
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-4">
            
            <Link to="/wishlist" className="relative p-2 text-gray-400 hover:text-rose-500 transition-all">
              <FaHeart size={20} />
              {counts.wishlist > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-[10px] text-white font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {counts.wishlist}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-indigo-400 transition-all">
              <FaShoppingCart size={20} />
              {counts.cart > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-500 text-[10px] text-white font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {counts.cart}
                </span>
              )}
            </Link>
            
            <div className="ml-2 pl-4 border-l border-white/10 flex items-center">
              {user ? (
                <div className="group relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center cursor-pointer border-2 border-white/10">
                    <span className="text-white text-sm font-bold">{user.name[0]}</span>
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

            <button className="md:hidden p-2 text-white ml-2" onClick={() => setIsOpen(true)}>
              <FaBars size={22} />
            </button>
          </div>
        </div>
      </nav>

      <div className="h-[65px]"></div>

      <div className={`fixed inset-0 z-[200] transition-visibility ${isOpen ? "visible" : "invisible"}`}>
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
            <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-indigo-500">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-indigo-500">Shop</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-indigo-500">Contact</Link>
            <hr className="border-white/5 my-2" />
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex justify-between items-center text-lg text-gray-300">
              Wishlist <span className="bg-rose-500 px-2 py-0.5 rounded text-xs text-white">{counts.wishlist}</span>
            </Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} className="flex justify-between items-center text-lg text-gray-300">
              My Cart <span className="bg-indigo-500 px-2 py-0.5 rounded text-xs text-white">{counts.cart}</span>
            </Link>
          </div>

          <div className="absolute bottom-10 left-6 right-6">
            {user ? (
              <button onClick={handleLogout} className="w-full bg-rose-600/10 text-rose-500 border border-rose-600/20 py-3 rounded-xl font-bold">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-indigo-600 text-white text-center py-3 rounded-xl font-bold">Login</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;