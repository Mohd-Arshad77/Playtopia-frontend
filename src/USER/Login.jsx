import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; 

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

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
        const user = JSON.parse(rawUser);
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
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

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", data);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      triggerNotification("Login Successful");

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1500);

    } catch (err) {
      console.error("Login Error", err);
      triggerNotification(err.response?.data?.message || "Invalid email or password");
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
          Login
        </h2>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="font-medium text-white">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
              required
            />
          </div>

          <div>
            <label className="font-medium text-white">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-3 py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-all shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-gray-200 text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-300 underline font-bold hover:text-yellow-400 transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;