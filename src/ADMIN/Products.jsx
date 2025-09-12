import React, { useState, useEffect } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

 
  useEffect(() => {
    axios.get("http://localhost:3001/products").then((res) => setProducts(res.data));
  }, []);

 
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`http://localhost:3001/products/${editId}`, form).then((res) => {
        setProducts(products.map((p) => (p.id === editId ? res.data : p)));
        reset();
      });
    } else {
      axios
        .post("http://localhost:3001/products", {
          ...form,
          status: "active",
        })
        .then((res) => setProducts([...products, res.data]));
      reset();
    }
  };

 
  const handleDelete = (id) =>
    axios.delete(`http://localhost:3001/products/${id}`).then(() =>
      setProducts(products.filter((p) => p.id !== id))
    );

 
  const handleEdit = (p) => {
    setForm(p);
    setEditId(p.id);
  };

 
  const toggleStatus = (id) => {
    const product = products.find((p) => p.id === id);
    const updated = { ...product, status: product.status === "active" ? "inactive" : "active" };

    axios.put(`http://localhost:3001/products/${id}`, updated).then((res) => {
      setProducts(products.map((p) => (p.id === id ? res.data : p)));
    });
  };

  const reset = () => {
    setForm({ name: "", price: "", stock: "", category: "", image: "", description: "" });
    setEditId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

   
      <form onSubmit={handleSubmit} className="grid gap-2 bg-white p-4 rounded shadow mb-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="p-2 border rounded" />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="p-2 border rounded" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button type="button" onClick={reset} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 bg-white shadow flex flex-col">
            <img src={p.image} alt={p.name} className="h-40 object-cover rounded mb-2" />
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p className="text-gray-600">₹{p.price} | Stock: {p.stock}</p>
            <p className="text-sm text-gray-500">{p.category}</p>
            <p className={`mt-1 font-semibold ${p.status === "active" ? "text-green-600" : "text-red-600"}`}>
              {p.status.toUpperCase()}
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">
                Delete
              </button>
              <button
                onClick={() => toggleStatus(p.id)}
                className={`px-3 py-1 rounded ${p.status === "active" ? "bg-gray-700" : "bg-green-600"} text-white`}
              >
                {p.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
