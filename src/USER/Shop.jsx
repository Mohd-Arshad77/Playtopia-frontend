import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaSearch, FaFilter, FaShoppingCart, FaCheck, FaChevronLeft, FaChevronRight, FaExclamationCircle } from "react-icons/fa";
import api from "../api"; 

const capitalizeWords = (str) => {
  if (!str) return "";
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); 
  const [wishlist, setWishlist] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  
  const [notification, setNotification] = useState({ msg: "", show: false });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const categories = ["All", "Car", "Sports car", "Jeep", "Truck"];

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const prodRes = await api.get(`/products?page=${currentPage}&limit=6&search=${search}&category=${category}`);
      
      if (prodRes.data && prodRes.data.products) {
          setProducts(prodRes.data.products);
          
          if(prodRes.data.pagination) {
            setTotalPages(prodRes.data.pagination.totalPages);
          }
      } else {
          setProducts([]); 
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
           const cartRes = await api.get("/cart");
           setCart(cartRes.data.data || []); 
        } catch (e) { setCart([]); }

        try {
           const wishRes = await api.get("/wishlist");
           setWishlist(wishRes.data.data || []);
        } catch (e) { setWishlist([]); }
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setProducts([]); 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    window.addEventListener("cartUpdate", fetchAllData);
    window.addEventListener("wishlistUpdate", fetchAllData);
    return () => {
      window.removeEventListener("cartUpdate", fetchAllData);
      window.removeEventListener("wishlistUpdate", fetchAllData);
    };
  }, [currentPage, category]); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        setCurrentPage(1); 
        fetchAllData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const triggerNote = (msg) => {
    setNotification({ msg, show: true });
    setTimeout(() => setNotification({ msg: "", show: false }), 3000);
  };

  const toggleWishlist = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      triggerNote("Please login first");
      return;
    }
    try {
      await api.post("/wishlist/toggle", { productId: product._id });
      const exists = wishlist.some((item) => item._id === product._id);
      if (exists) {
        setWishlist(wishlist.filter((item) => item._id !== product._id));
        triggerNote("Removed from favorites");
      } else {
        setWishlist([...wishlist, product]);
        triggerNote("Added to favorites");
      }
      window.dispatchEvent(new Event("wishlistUpdate"));
    } catch (err) {
      console.error(err);
      triggerNote("Failed to update wishlist");
    }
  };

  const addToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      triggerNote("Please login to buy");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const existingItem = cart.find(item => item.product && item.product._id === product._id);
    const currentQty = existingItem ? existingItem.qty : 0;

    if (currentQty + 1 > product.stock) {
      triggerNote(`Stock limit reached! Only ${product.stock} available.`);
      return; 
    }

    try {
      await api.post("/cart/add", { productId: product._id, qty: 1 });
      
      setCart((prevCart) => {
         const exists = prevCart.find(item => item.product._id === product._id);
         if(exists) {
            return prevCart.map(item => item.product._id === product._id ? {...item, qty: item.qty + 1} : item);
         }
         return [...prevCart, { product: { _id: product._id }, qty: 1 }];
      });

      triggerNote("Added to Bag");
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error) {
      console.error(error);
      triggerNote(error.response?.data?.message || "Failed to add item");
    }
  };

  const paginate = (pageNumber) => {
    if(pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-16">
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${notification.show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-lg border border-white/10">
          <span className="text-sm font-bold uppercase tracking-widest">{notification.msg}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            The <span className="text-indigo-600">Showroom</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">Discover our premium die-cast collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
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
                    onClick={() => {
                        setCategory(cat);
                        setCurrentPage(1); 
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all text-left ${category === cat ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-100"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-grow">
            {loading ? (
               <div className="flex justify-center items-center h-64">
                 <p className="text-xl font-bold text-slate-400 animate-pulse">Loading products...</p>
               </div>
            ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => {
                  const isFavorite = wishlist.some((item) => item._id === product._id);
                  const cartItem = cart.find((item) => item.product && item.product._id === product._id);
                  const isInCart = !!cartItem;
                  const isStockFull = cartItem && cartItem.qty >= product.stock;

                  return (
                    <div key={product._id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
                      <div className="relative h-64 overflow-hidden bg-slate-100">
                        <img src={product.image || "https://via.placeholder.com/300"} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                              <span className="text-white font-black uppercase tracking-widest border-2 border-white px-4 py-2">Out of Stock</span>
                          </div>
                        )}
                        <button onClick={() => toggleWishlist(product)} className={`absolute top-5 right-5 p-3 rounded-full backdrop-blur-md transition-all z-20 ${isFavorite ? "bg-rose-500 text-white" : "bg-white/80 text-slate-400 hover:text-rose-500"}`}>
                          {isFavorite ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                        </button>
                        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-slate-900/80 to-transparent z-20">
                          <button onClick={() => navigate(`/product/${product._id}`)} className="w-full bg-white text-slate-900 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-colors">
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
                        
                        {isStockFull ? (
                          <button 
                            disabled 
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                          >
                             <FaExclamationCircle /> Max Limit Reached
                          </button>
                        ) : isInCart ? (
                          <button onClick={() => navigate("/cart")} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg shadow-green-200">
                            <FaCheck size={16} /> Go to Cart
                          </button>
                        ) : (
                          <button onClick={() => addToCart(product)} disabled={product.stock === 0} className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-200 ${product.stock === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-indigo-600"}`}>
                            <FaShoppingCart size={16} /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

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
            
            {!loading && products.length === 0 && (
               <div className="text-center py-24">
                 <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                 <p className="text-slate-400 mt-2">Try checking the "All" category.</p>
               </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;