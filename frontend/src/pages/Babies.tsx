import React, { useEffect, useState } from "react";

type Baby = {
  _id: string;
  name: string;
};

export default function Babies() {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBabies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/babies", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setBabies(data);
      }
    } catch (err) {
      console.error("Failed to fetch babies", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/babies/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchBabies();
  };

  useEffect(() => {
    fetchBabies();
  }, []);

  return (
    <div className="min-h-screen bg-skyblue p-6">
      <h1 className="text-3xl font-bold text-navy mb-6">
        🍼 Manage Your Babies
      </h1>

      {loading && <p className="text-navy">Loading...</p>}

      {!loading && babies.length === 0 && (
        <p className="text-navy">No babies yet. Go ahead and add one!</p>
      )}

      {babies.map((baby) => (
        <div
          key={baby._id}
          className="bg-white p-4 rounded-2xl shadow mb-4 flex justify-between items-center"
        >
          <span className="text-lg">{baby.name}</span>
          <div className="space-x-2">
            {/* Rename logic can go here later */}
            <button
              onClick={() => handleDelete(baby._id)}
              className="text-sm text-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
