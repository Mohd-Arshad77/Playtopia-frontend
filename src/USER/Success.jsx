import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import api from "../api";

function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        setLoading(false);
        return;
      }

      try {
        await api.post("/payment/verify-session", { sessionId: sessionId });
        setStatus("success");
        setLoading(false);
      } catch (err) {
        console.error("Payment Verification Failed", err);
        setStatus("error");
        setLoading(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      {loading ? (
        <div className="flex flex-col items-center">
          <FaSpinner className="text-4xl text-indigo-600 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-slate-600 tracking-tight">Verifying Payment...</h2>
          <p className="text-sm text-slate-400 mt-1">Please wait while we confirm your transaction.</p>
        </div>
      ) : status === "success" ? (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight uppercase">Confirmed!</h1>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            Your payment was successful and your order is being processed.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="w-full py-4 text-slate-400 font-black uppercase tracking-widest hover:text-slate-900 transition-all text-xs"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-rose-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-5xl text-rose-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight uppercase">Failed</h1>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">
            We couldn't verify your payment. If money was deducted, please contact support.
          </p>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Success;