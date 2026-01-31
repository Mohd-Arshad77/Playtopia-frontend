import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === "success";

  return (
    <div className="fixed top-5 right-5 z-[100] animate-slide-in">
      <div 
        className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 ${
          isSuccess 
            ? "bg-white border-emerald-100 text-emerald-800" 
            : "bg-white border-rose-100 text-rose-800"
        }`}
      >
        <div className={`p-2 rounded-full ${isSuccess ? "bg-emerald-100" : "bg-rose-100"}`}>
          {isSuccess ? <FaCheckCircle size={20} /> : <FaExclamationCircle size={20} />}
        </div>
        
        <div>
          <h4 className="font-bold text-sm">{isSuccess ? "Success" : "Error"}</h4>
          <p className="text-sm font-medium opacity-90">{message}</p>
        </div>

        <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
          <FaTimes />
        </button>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
        triggerToast("Message sent successfully!", "success");
        setFormData({ name: "", email: "", message: "" });
        setLoading(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 relative">
      
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tight">
              Get in Touch
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Have questions? Send us a message and we'll respond as soon as possible.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                
                <div>
                    <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaPhoneAlt className="text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-bold uppercase mb-1">Phone</p>
                                <p className="text-lg font-medium">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaEnvelope className="text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-bold uppercase mb-1">Email</p>
                                <p className="text-lg font-medium">support@playtopia.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaMapMarkerAlt className="text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm font-bold uppercase mb-1">Location</p>
                                <p className="text-lg font-medium">123, Tech Park, Calicut, Kerala</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                     <p className="text-slate-400 text-sm mb-4">Follow us</p>
                     <div className="flex gap-4">
                        {['FB', 'IG', 'TW', 'YT'].map((social) => (
                            <div key={social} className="w-10 h-10 rounded-full bg-white/10 hover:bg-indigo-600 transition-colors cursor-pointer flex items-center justify-center font-bold text-xs">
                                {social}
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="How can we help?"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Sending..." : <>Send Message <FaPaperPlane /></>}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;