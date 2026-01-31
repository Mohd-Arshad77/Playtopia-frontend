import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; 

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");
  const [showNote, setShowNote] = useState(false);
  
  const navigate = useNavigate();

  const triggerNotification = (msg) => {
    setNotification(msg);
    setShowNote(true);
    setTimeout(() => setShowNote(false), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (token && rawUser && rawUser !== "undefined") {
      try {
        navigate("/", { replace: true });
      } catch (err) {
        localStorage.clear();
      }
    }
  }, [navigate]);

  function handleChange(e) {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validate(values) {
    const errors = {};
    if (!values.name.trim()) errors.name = "Name is required";
    if (!values.email.includes("@")) 
      errors.email = "Enter a valid email address";
    if (!values.password || values.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  }

  async function submit(e) {
    e.preventDefault();
    const validationErrors = validate(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await api.post("/auth/register", data);

      triggerNotification("Registration Successful! Please Login.");
      
      setData({ name: "", email: "", password: "" });
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (err) {
      console.error("Register Error:", err);
      const errorMsg = err.response?.data?.message || "Something went wrong. Try again!";
      triggerNotification(errorMsg);
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      
      <div className={`fixed top-10 z-[100] transition-all duration-500 transform ${showNote ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"}`}>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
          <span className="text-sm font-bold tracking-wide">{notification}</span>
        </div>
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://m.media-amazon.com/images/I/81kvOSiyX4L.jpg')",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-96 p-8 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Register
        </h2>

        <form onSubmit={submit} className="flex flex-col gap-4">
          
          <div>
            <label className="font-medium text-white">Name</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1 font-bold">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1 font-bold">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1 font-bold">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-3 py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-all shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-gray-200 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-300 underline font-bold hover:text-yellow-400 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;