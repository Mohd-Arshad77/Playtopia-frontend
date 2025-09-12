import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [Data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

 
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  
  function handleChange(e) {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

 
  function validate(data) {
    const errors = {};
    if (!data.email.includes("@") || !data.email.includes(".com")) {
      errors.email = "Enter a valid email address";
    }
    if (!data.password || data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  }


  function submit(e) {
    e.preventDefault();
    const validationErrors = validate(Data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .get("http://localhost:3001/users")
        .then((res) => {
          const user = res.data.find(
            (u) => u.email === Data.email && u.password === Data.password
          );

          if (user&&user.status==="active") {
           
            localStorage.setItem("user", JSON.stringify(user));

            
            if (user.role === "admin") {
              navigate("/admin/dashboard", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } else {
            
            setErrors({ general: "Invalid Email or Password" });
          }
        })
        .catch((err) => {
          console.error("Login Error", err);
          setErrors({ general: "Something went wrong. Try again!" });
        });
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2022/08/31/09/56/mountains-7422920_640.png')",
      }}
    >
      <div className="bg-gray-500 bg-opacity-80 p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>

       
        {errors.general && (
          <div className="bg-red-600 text-white p-2 rounded text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="font-medium text-white">Email</label>
          <input
            type="email"
            name="email"
            value={Data.email}
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
            value={Data.password}
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
            Login
          </button>
        </form>

        <p className="text-black text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-900 underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
