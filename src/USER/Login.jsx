import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [notification, setNotification] = useState({ msg: "", type: "", show: false });
  const navigate = useNavigate();

  const triggerNotification = (msg, type = "error") => {
    setNotification({ msg, type, show: true });
    setTimeout(() => setNotification((n) => ({ ...n, show: false })), 3500);
  };

  // Redirect already-logged-in users immediately
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    if (token && rawUser && rawUser !== "undefined") {
      try {
        const user = JSON.parse(rawUser);
        navigate(user.role === "admin" ? "/admin/dashboard" : "/", { replace: true });
      } catch {
        localStorage.clear();
      }
    }
  }, [navigate]);

  function handleChange(e) {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Save auth data and navigate — no artificial delay
  const handleAuthSuccess = (resData) => {
    localStorage.setItem("token", resData.token);
    localStorage.setItem("user", JSON.stringify(resData.user));
    // Notify App.jsx to update route guards reactively
    window.dispatchEvent(new Event("authChange"));
    triggerNotification("Login Successful!", "success");
    // Navigate immediately — no setTimeout lag
    navigate(resData.user.role === "admin" ? "/admin/dashboard" : "/", { replace: true });
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      handleAuthSuccess(res.data);
    } catch (err) {
      triggerNotification(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      handleAuthSuccess(res.data);
    } catch (err) {
      triggerNotification(err.response?.data?.message || "Google login failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">

      {/* Toast notification */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${
          notification.show ? "translate-y-0 opacity-100" : "-translate-y-16 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md text-white text-sm font-bold tracking-wide ${
            notification.type === "success"
              ? "bg-emerald-600 border-emerald-400/30"
              : "bg-rose-600 border-rose-400/30"
          }`}
        >
          <span>
            {notification.type === "success" ? "✓" : "✕"}
          </span>
          {notification.msg}
        </div>
      </div>

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://m.media-amazon.com/images/I/81kvOSiyX4L.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl shadow-2xl bg-white/15 backdrop-blur-xl border border-white/25">
        <h2 className="text-3xl font-extrabold text-center text-white mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-center text-white/60 text-sm mb-7">Sign in to your Playtopia account</p>

        {/* Email/Password form */}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold text-white/90 text-sm mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 font-medium placeholder:text-slate-400 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-white/90 text-sm mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 font-medium placeholder:text-slate-400 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Google Login */}
        <div className="flex flex-col items-center gap-3">
          {googleLoading ? (
            <div className="flex items-center gap-2 text-white/70 text-sm py-3">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Authenticating with Google...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => triggerNotification("Google login failed. Please try again.")}
              useOneTap={false}
              shape="rectangular"
              theme="filled_white"
              size="large"
              width="100%"
              text="signin_with"
            />
          )}
        </div>

        <p className="text-white/70 text-center mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-300 underline font-bold hover:text-yellow-200 transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;