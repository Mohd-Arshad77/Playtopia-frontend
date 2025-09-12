import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOrder, setSortOrder] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const minPrice =
    products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0;
  const maxPrice =
    products.length > 0 ? Math.max(...products.map((p) => p.price)) : 10000;

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
(      category === "All" || product.category === category)&&      product.status=="active"
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  
  if (sortOrder === "lowToHigh")
    filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortOrder === "highToLow")
    filteredProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Playtopia Premium Cars
      </h1>

     
      <div className="flex flex-wrap gap-4 justify-center items-center mb-8 px-6">
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full sm:w-1/6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full sm:w-1/6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Sort by</option>
          <option value="lowToHigh">Price: Low → High</option>
          <option value="highToLow">Price: High → Low</option>
        </select>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform p-4 flex flex-col min-h-[350px]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover rounded-xl mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-700">
              {capitalizeWords(product.name)}
            </h2>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">
                ₹{product.price}
              </span>
              <button
                onClick={() => navigate(`/Product/${product.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No cars found</p>
      )}
    </div>
  );
}

export default Shop;
