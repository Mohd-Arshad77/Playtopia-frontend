import React from "react";
import Navbar from "./USER/Navbar";
import Footer from "./USER/Footer";
import Home from "./USER/Home";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Shop from "./USER/Shop";
import Contact from "./USER/Contact";
import ProductDetails from "./USER/ProductDetails";
import Register from "./USER/Register";
import Login from "./USER/Login";
import Cart from "./USER/Cart";
import Checkout from "./USER/Checkout";

import Sidenavbar from "./ADMIN/Sidenavbar";
import Dashboard from "./ADMIN/Dashboard";
import Users from "./ADMIN/Users";
import Products from "./ADMIN/Products";
import Orders from "./ADMIN/Orders";

const App = () => {
  const location = useLocation();
  const hideLayout = ["/login", "/register"].includes(location.pathname);

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;


  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <div>
      {!hideLayout && !location.pathname.startsWith("/admin") && <Navbar />}

      <Routes>
       
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

   
        <Route
          path="/"
          element={
            isUser ? <Home /> : isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/shop"
          element={
            isUser ? <Shop /> : isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/contact"
          element={
            isUser ? <Contact /> : isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/product/:id"
          element={
            isUser ? <ProductDetails /> : isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/cart"
          element={
            isUser ? <Cart /> : isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/checkout"
          element={
            isUser ? <Checkout /> : isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />
          }
        />

       
        <Route
          path="/admin/*"
          element={
            isAdmin ? <Sidenavbar /> : isUser ? <Navigate to="/" /> : <Navigate to="/login" />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

      
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {!hideLayout && !location.pathname.startsWith("/admin") && <Footer />}
    </div>
  );
};

export default App;
