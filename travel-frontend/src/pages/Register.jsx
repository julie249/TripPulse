import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("https://trippulse-11nu.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white px-4">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-3 rounded-xl text-black outline-none"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl text-black outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-3 rounded-xl text-black outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 py-3 rounded-xl hover:bg-green-700"
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}