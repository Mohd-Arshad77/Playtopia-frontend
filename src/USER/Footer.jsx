import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">P</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
              Play<span className="text-indigo-500">topia</span>
            </h1>
          </div>
          <p className="text-sm leading-relaxed">
            The world's premier destination for high-quality miniature vehicles. 
            From vintage classics to modern racers, we spark imagination in every heart.
          </p>
          <div className="flex space-x-4">
            {[
              { icon: <FaFacebookF />, link: "#" },
              { icon: <FaInstagram />, link: "#" },
              { icon: <FaTwitter />, link: "#" },
              { icon: <FaYoutube />, link: "#" },
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.link} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-xl"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Quick Navigation</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home Dashboard</Link></li>
            <li><Link to="/shop" className="hover:text-indigo-400 transition-colors">Browse Collection</Link></li>
            <li><Link to="/wishlist" className="hover:text-indigo-400 transition-colors">Your Wishlist</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Get in Touch</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-indigo-500" />
              <span>123 Toy Street, Imagination City,<br />Manjeri, Kerala</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-indigo-500" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-indigo-500" />
              <span>support@playtopia.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Join the Community</h3>
          <p className="text-xs mb-4">Subscribe for early access to limited edition drops.</p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              <FaEnvelope size={14} />
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        <p>© {currentYear} PLAYTOPIA — ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;