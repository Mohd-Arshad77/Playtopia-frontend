import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-17 flex flex-col md:flex-row justify-between items-center">
        
       
        <h1 className="text-xl font-bold text-white mb-2 md:mb-0">
          Playtopia
        </h1>

        
        <ul className="flex space-x-8 mb-4 md:mb-0">
          <li><a href="#" className="hover:text-white">Home</a></li>

          <li><a href="#" className="hover:text-white">Shop</a></li>
          <li><a href="#" className="hover:text-white">Contact</a></li>
        </ul>

        
        <div className="flex space-x-9">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FaFacebookF size={22} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FaInstagram size={22} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FaTwitter size={22} />
          </a>
        </div>
      </div>

     
      <div className="text-center text-sm text-gray-500 mt-16">
        © {new Date().getFullYear()} Playtopia. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;

