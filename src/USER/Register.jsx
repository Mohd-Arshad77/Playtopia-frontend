import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API = "http://localhost:3001";

   useEffect(() => {
      const user = localStorage.getItem("user");
      if (user) {
        navigate("/", { replace: true }); 
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
    if (!values.email.includes("@gmail.com"))
      errors.email = "Enter a valid Gmail address";
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
      
      const res = await axios.get(`${API}/users?email=${data.email}`);
      if (res.data.length > 0) {
        alert("User already exists with this email!");
        return;
      }

      
      await axios.post(`${API}/users`, data);

      alert("Registration Successful!");
      setData({ name: "", email: "", password: "" }); // reset
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Register Error:", err);
      alert("Something went wrong. Try again!");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-gray-500 p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-white">Register</h2>

        <form onSubmit={submit} className="flex flex-col gap-3">
         
          <label className="font-medium text-white">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="p-2 bg-amber-100 rounded-md border"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

         
          <label className="font-medium text-white">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="p-2 bg-amber-100 rounded-md border"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}

        
          <label className="font-medium text-white">Password</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            className="p-2 bg-amber-100 rounded-md border"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}

         
          <button
            type="submit"
            className="mt-2 py-2 px-4 bg-white text-gray-800 font-bold rounded-md hover:bg-gray-800 hover:text-white"
          >
            Submit
          </button>
        </form>

        <p className="text-black text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-900 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
