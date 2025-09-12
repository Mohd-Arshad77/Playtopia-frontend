import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("✅ Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
    
    >
     
      <div className="flex-grow flex items-center justify-center bg-black bg-opacity-60 p-6">
        <div className="backdrop-blur-md bg-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-lg text-white">
          <h2 className="text-4xl font-bold text-center mb-6">Contact Us</h2>
          <p className="text-center text-gray-200 mb-6">
            We’d love to hear from you! Fill out the form below.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            ></textarea>

            <button
              type="submit"
              className="bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
