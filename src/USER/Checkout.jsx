import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [total, setTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

 
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  
  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

 
  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:3001/carts?userId=${user.id}`)
      .then((res) => {
        if (res.data.length > 0) {
          setCart(res.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [user]);

  
  const cartWithDetails = cart?.items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return { ...item, ...product };
  }) || [];

  useEffect(() => {
    const totalPrice = cartWithDetails.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    setTotal(totalPrice);
  }, [cartWithDetails]);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 
 const handleOrder = async () => {
  if (!form.name || !form.phone || !form.address) {
    alert("Please fill all fields");
    return;
  }

  try {
    
    for (const item of cartWithDetails) {
      const productRes = await axios.get(`http://localhost:3001/products/${item.id}`);
      const product = productRes.data;

      if (item.qty > product.stock) {
        alert(`❌ Not enough stock for "${product.name}". Only ${product.stock} left.`);
        return; 
      }
    }

    
    const order = {
      userId: user.id,
      items: cartWithDetails,
      total,
      customer: form,
      date: new Date().toISOString(),
    };

    await axios.post("http://localhost:3001/orders", order);

    
    for (const item of cartWithDetails) {
      const productRes = await axios.get(`http://localhost:3001/products/${item.id}`);
      const product = productRes.data;

      const updatedStock = product.stock - item.qty;
      await axios.patch(`http://localhost:3001/products/${item.id}`, {
        stock: updatedStock,
      });
    }

   
    await axios.put(`http://localhost:3001/carts/${cart.id}`, {
      ...cart,
      items: [],
    });

    alert("✅ Order placed successfully!");
    navigate("/");

  } catch (err) {
    console.error("Error placing order:", err);
    alert("❌ Something went wrong!");
  }
};

const isOutOfStock = cartWithDetails.some(item => {
  const product = products.find(p => p.id === item.id);
  return product && item.qty > product.stock;
});


  if (!cart || products.length === 0) {
    return <p className="p-6">Loading checkout...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col lg:flex-row gap-8">
    
      <div className="flex-1 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">🛍️ Order Summary</h2>
        {cartWithDetails.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-3">
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.qty} × ₹{item.price}
                </p>
              </div>
            </div>
            <p className="font-semibold">₹ {item.qty * item.price}</p>
          </div>
        ))}

        <h2 className="text-xl font-bold mt-6 text-right">
          Total: ₹ {total}
        </h2>
      </div>

      
      <div className="flex-1 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">📋 Checkout</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
          <textarea
            name="address"
            placeholder="Delivery Address"
            value={form.address}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          ></textarea>

          <button
  onClick={handleOrder}
  disabled={isOutOfStock}
  className={`px-6 py-3 rounded-lg text-white ${
    isOutOfStock
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {isOutOfStock ? "Out of Stock" : "Place Order"}
</button>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
