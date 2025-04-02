import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Babies() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.birthdate || !form.gender) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/babies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        const err = await res.text();
        setError(`Failed to create baby: ${err}`);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-bubble p-6 text-navy">
      <h2 className="text-2xl font-bold mb-4">➕ Add a New Baby</h2>
      <div className="space-y-4 max-w-md mx-auto">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded-xl border border-pink-300"
        />
        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          className="w-full p-2 rounded-xl border border-pink-300"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-2 rounded-xl border border-pink-300"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="bg-brightpink text-white px-4 py-2 rounded-xl shadow hover:bg-pink-500 transition"
          >
            Save
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="border border-pink-300 text-navy px-4 py-2 rounded-xl hover:bg-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
