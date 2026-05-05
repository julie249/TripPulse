import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl text-black outline-none"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-3 rounded-xl text-black outline-none"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-center mt-5 text-sm text-gray-200">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-300 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}