import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetails() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = "http://localhost:3001";

  useEffect(() => {
    axios.get(`${API}/products`)
      .then((res) => {
        const found = res.data.find((p) => String(p.id) === id);
        setProduct(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`${API}/carts?userId=${user.id}`);
      let cart = res.data.length > 0 ? res.data[0] : null;

      if (!cart) {
        cart = { userId: user.id, items: [] };
        await axios.post(`${API}/carts`, cart);
      }

      const existing = cart.items.find((item) => item.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.items.push({ ...product, qty: 1 });
      }

      await axios.put(`${API}/carts/${cart.id}`, cart);
      navigate("/cart");
    } catch (err) {
      console.error("Cart update error:", err);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><h2>Loading...</h2></div>;
  if (!product) return <div className="flex justify-center items-center min-h-screen"><h2 className="text-red-600">Product not found</h2></div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 flex items-center justify-center bg-gray-50 p-6">
          <img src={product.image} alt={product.name} className="w-[400px] h-[400px] object-contain rounded-xl shadow-md" />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <p className="text-3xl font-bold text-green-700 mt-4">₹ {product.price}</p>
          </div>
          <button onClick={addToCart}
            className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
