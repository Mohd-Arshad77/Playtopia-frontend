import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaShieldAlt, FaRocket, FaGem } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white overflow-x-hidden">
      <section className="relative h-[90vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110 animate-pulse"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1594732832278-abd644401426?q=80&w=2070&auto=format&fit=crop')",
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        <div className="relative z-10 text-center px-4">
          <div className="inline-block mb-4 px-4 py-1 border border-yellow-400/50 rounded-full bg-yellow-400/10 backdrop-blur-md">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.3em]">
              The Ultimate Toy Experience
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            PLAY<span className="text-yellow-400">TOPIA</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Crafting memories through premium miniature vehicles. Explore our 
            exclusive collection for racers, dreamers, and collectors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="px-10 py-4 bg-yellow-400 text-black font-black uppercase text-sm tracking-widest rounded-full hover:bg-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
            >
              Explore Shop
            </button>
            <button
              onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 border border-white/30 text-white font-black uppercase text-sm tracking-widest rounded-full hover:bg-white/10 backdrop-blur-md transition-all"
            >
              Our Story
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <FaGem />, title: "Premium Quality", desc: "Die-cast precision" },
          { icon: <FaRocket />, title: "Fast Delivery", desc: "Across the nation" },
          { icon: <FaShieldAlt />, title: "Safe Play", desc: "Non-toxic materials" },
          { icon: <FaTruck />, title: "Exclusive", desc: "Limited editions" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center border border-gray-50 hover:border-yellow-200 transition-all group">
            <div className="text-2xl text-yellow-500 mb-3 group-hover:scale-125 transition-transform">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{item.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </section>

      <section id="about" className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1532330393533-443990a51d10?q=80&w=2070&auto=format&fit=crop" 
              alt="Toy Collection" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <h4 className="text-yellow-600 font-black uppercase tracking-[0.2em] text-sm italic">Authentic Heritage</h4>
            <h2 className="text-5xl font-black text-slate-900 leading-tight">
              Where <span className="text-yellow-500">Wheels</span> Meet Imagination.
            </h2>
          </div>

          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p className="text-lg">
              Welcome to <span className="font-bold text-slate-900">Playtopia</span>, 
              your premium destination for toy vehicles that redefine the joy of play. 
              We specialize in high-quality miniature vehicles designed for those who appreciate 
              the fine art of craftsmanship.
            </p>
            
            <p>
              We believe vehicles are more than just toys – they are symbols of adventure. 
              Whether you are a budding engineer or a seasoned collector, our handpicked 
              selection ensures every wheel, wing, and engine is built for durability and safe play.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-black text-white">Ready to start your collection?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Join the Playtopia community today and get access to exclusive limited-edition releases.
          </p>
          <button 
            onClick={() => navigate("/shop")}
            className="px-12 py-4 bg-white text-slate-900 font-black uppercase text-sm tracking-widest rounded-full hover:bg-yellow-400 transition-colors shadow-xl"
          >
            Go To Shop
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;