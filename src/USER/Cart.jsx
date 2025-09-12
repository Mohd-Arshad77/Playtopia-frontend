import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:3001/carts?userId=${user.id}`)
      .then((res) => {
        if (res.data.length > 0) {
          setCart(res.data[0]);
        } else {
          axios
            .post("http://localhost:3001/carts", {
              userId: user.id,
              items: [],
            })
            .then((res) => setCart(res.data));
        }
      })
      .catch((err) => console.error(err));
  }, [user]);

  const updateCart = (updatedItems) => {
    const updatedCart = { ...cart, items: updatedItems };
    setCart(updatedCart);

    axios
      .put(`http://localhost:3001/carts/${cart.id}`, updatedCart)
      .catch((err) => console.error(err));
  };

  const increaseQty = (id) => {
    const updated = cart.items.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart.items.map((item) =>
      item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
    );
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.items.filter((item) => item.id !== id);
    updateCart(updated);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <h2 className="text-lg sm:text-xl font-bold text-red-600 text-center">
          Please login to view your cart.
        </h2>
      </div>
    );
  }

  if (!cart || products.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const cartWithDetails = cart.items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return { ...item, ...product };
  });

  const total = cartWithDetails.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cartWithDetails.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
          <div className="space-y-4">
            {cartWithDetails.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 gap-4"
              >
               
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="font-semibold text-base sm:text-lg">
                      {item.name}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      ₹ {item.price}
                    </p>
                  </div>
                </div>

              
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-600 text-sm sm:text-base"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

       
          <div className="mt-6 text-center sm:text-right space-y-3">
            <h2 className="text-lg sm:text-xl font-bold">
              Total: ₹ {total}
            </h2>

            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3">
              <Link
                to="/checkout"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-center"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
