import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Babies() {
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: "Male",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    setError("");

    const payload = {
      name: form.name,
      birthdate: form.birthdate,
      gender: form.gender,
    };

    console.log("📦 Submitting baby:", JSON.stringify(payload));

    try {
      const res = await fetch("/api/babies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const resultText = await res.text();
      console.log("🔁 Server response text:", resultText);

      if (res.ok) {
        console.log("✅ Baby created successfully");
        navigate("/dashboard");
      } else {
        setError(`Creation failed: ${res.status}`);
        console.error("❌ Creation failed with status:", res.status);
      }
    } catch (err) {
      console.error("🔥 Error submitting baby:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-babyblue p-6">
      <h2 className="text-3xl font-bold text-navy mb-4">Add a Baby</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="block w-full p-2 rounded-lg border border-gray-300"
          required
        />

        <input
          name="birthdate"
          type="date"
          value={form.birthdate}
          onChange={handleChange}
          className="block w-full p-2 rounded-lg border border-gray-300"
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="block w-full p-2 rounded-lg border border-gray-300"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-brightpink text-white px-4 py-2 rounded-2xl shadow hover:bg-pink-500 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}