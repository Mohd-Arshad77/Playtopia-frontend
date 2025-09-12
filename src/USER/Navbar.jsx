import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-4 py-5 flex items-center justify-between sticky top-0 z-50">
      
        <div className="flex items-center gap-2">
          <img
            className="w-11 h-14 object-cover rounded-full"
            src="https://pbs.twimg.com/media/DERnpIWUIAAPOgJ?format=png&name=900x900"
            alt="logo"
          />
          <span className="font-bold text-xl">PLAYTOPIA</span>
        </div>

      
        <ul className="hidden md:flex space-x-8 text-lg">
          <li>
            <Link to="/" className="hover:text-yellow-400">Home</Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-yellow-400">Shop</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
          </li>
        </ul>

        
        <div className="flex items-center gap-6">
          <Link to="/cart">
            <FaShoppingCart className="text-2xl cursor-pointer hover:text-yellow-400" />
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="hidden md:block bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden md:block bg-blue-500 px-5 py-2 rounded-lg hover:bg-yellow-600"
            >
              Login
            </Link>
          )}
        </div>

     
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-blue-200 text-center flex flex-col space-y-6 py-6 absolute right-0 top-16 left-0 z-40">
          <Link
            to="/"
            className="hover:text-yellow-400"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-yellow-400"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/contact"
            className="hover:text-yellow-400"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-500 px-5 py-2 rounded-lg hover:bg-yellow-600"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
