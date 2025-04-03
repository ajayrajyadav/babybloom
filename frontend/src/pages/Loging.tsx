import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
const navigate = useNavigate();
const [email, setEmail] = useState("demo@snugglestats.app");
const [password, setPassword] = useState("password123");
const [error, setError] = useState("");

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
    const res = await fetch("/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
        // ✅ Fetch user profile from the correct endpoint
        const profileRes = await fetch("/api/users/profile", {
        credentials: "include",
        });

        const profile = await profileRes.json();

        if (profile && profile._id) {
        localStorage.setItem("userId", profile._id); // ✅ Needed for creating babies
        }

        navigate("/dashboard");
    } else {
        setError(data.message || "Login failed");
    }
    } catch (err) {
    console.error("Login error", err);
    setError("An error occurred. Please try again.");
    }
};

return (
    <div className="min-h-screen flex items-center justify-center bg-bubble px-4">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-navy mb-4">Welcome Back 👋</h1>
        <form onSubmit={handleLogin} className="space-y-4">
        <input
            type="email"
            placeholder="Email"
            className="w-full border border-pink-300 p-2 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            className="w-full border border-pink-300 p-2 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
            type="submit"
            className="w-full bg-brightpink text-white p-2 rounded-2xl hover:bg-pink-500 transition"
        >
            Login 👶
        </button>
        </form>
    </div>
    </div>
);
}