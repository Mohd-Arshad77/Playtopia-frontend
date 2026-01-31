import React, { useState, useEffect } from "react";
import api from "../api";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCloudUploadAlt, 
  FaTrash, 
  FaEdit, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaTimes,
  FaSpinner 
} from "react-icons/fa";

const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === "success";
  return (
    <div className="fixed top-5 right-5 z-[100] animate-slide-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 ${isSuccess ? "bg-white border-emerald-100 text-emerald-800" : "bg-white border-rose-100 text-rose-800"}`}>
        <div className={`p-2 rounded-full ${isSuccess ? "bg-emerald-100" : "bg-rose-100"}`}>
          {isSuccess ? <FaCheckCircle size={20} /> : <FaExclamationCircle size={20} />}
        </div>
        <div>
          <h4 className="font-bold text-sm">{isSuccess ? "Success" : "Error"}</h4>
          <p className="text-sm font-medium opacity-90">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
          <FaTimes />
        </button>
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const fetchProducts = async (page) => {
    if (products.length === 0) setLoading(true); 
    try {
      const res = await api.get(`/products?page=${page}&limit=6`);
      setProducts(res.data.products || []);
      
      if(res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages);
        setTotalItems(res.data.pagination.totalProducts);
      }
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      triggerToast("Failed to fetch products", "error");
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("description", form.description);

    if (file) {
      formData.append("image", file);
    }

    try {
      if (editId) {
        await api.put(`/products/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        triggerToast("Product updated successfully!", "success");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        triggerToast("Product created successfully!", "success");
      }

      reset();
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Submit error:", err);
      triggerToast("Failed to save product. Check connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${productToDelete._id}`);
      setShowDeleteModal(false);
      setProductToDelete(null);
      triggerToast("Product deleted successfully", "success");
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Delete error:", err);
      triggerToast("Failed to delete product", "error");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      description: p.description,
    });
    setFile(null);
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
    });
    setFile(null);
    setEditId(null);
  };

  const paginate = (pageNumber) => {
    if(pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  if (loading && products.length === 0) {
    return <div className="p-10 text-center text-slate-500 font-medium">Loading Inventory...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 relative">
      
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Inventory Dashboard
          </h1>

          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
            Total Items: {totalItems}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-10">
          <h2 className="text-xl font-bold mb-6 text-slate-700 border-b pb-4">
            {editId ? "Update Product Details" : "Register New Product"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Product Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Product Image</label>
              <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 p-1 border border-slate-200 rounded-xl bg-slate-50" required={!editId} />
            </div>

            <div className="flex flex-col gap-1 md:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24" />
            </div>

            <div className="md:col-span-3 flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 flex justify-center items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt />
                    {editId ? "Save Changes" : "Create Product"}
                  </>
                )}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={reset}
                  disabled={isSubmitting}
                  className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-56 overflow-hidden bg-white flex items-center justify-center p-4">
                <img src={p.image} alt={p.name} className="max-h-full object-contain transition-transform duration-500 group-hover:scale-110" onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=No+Image")} />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.status === "active" || !p.status ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"}`}>
                  {p.status || "Active"}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{p.name}</h3>
                  <span className="text-indigo-600 font-black text-lg">₹{p.price}</span>
                </div>
                <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase mb-6">
                  <span>Stock: {p.stock}</span>
                  <span>|</span>
                  <span>{p.category || "General"}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleEdit(p)} className="bg-slate-50 hover:bg-amber-50 hover:text-amber-600 text-slate-600 py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => confirmDelete(p)} className="bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-600 py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <FaChevronLeft size={12} />
            </button>
            <span className="text-sm font-bold text-slate-500 mx-2">Page {currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <FaChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-slide-in">
            <h3 className="text-center text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
            <p className="text-center text-slate-500 mb-8 text-sm leading-relaxed">Do you really want to delete <span className="font-bold text-slate-700">"{productToDelete?.name}"</span>?</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDelete} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-100">Yes, Delete It</button>
              <button onClick={() => setShowDeleteModal(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;