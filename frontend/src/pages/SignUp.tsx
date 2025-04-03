import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@snugglestats.app");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Demo User");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-skyblue px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-navy mb-4">Join SnuggleStats 💖</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-purple-200 p-2 rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-purple-200 p-2 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-purple-200 p-2 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-2 rounded-2xl hover:bg-purple-600 transition"
          >
            Sign Up 🍼
          </button>
        </form>
      </div>
    </div>
  );
}