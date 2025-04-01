import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Baby = {
  _id: string;
  name: string;
};

export default function Dashboard() {
  const [babies, setBabies] = useState<Baby[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBabies = async () => {
      try {
        console.log("🔐 userId from localStorage:", localStorage.getItem("userId"));
        const res = await fetch("/api/babies", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ⬅️ critical for sending cookies
        });
  
        if (res.ok) {
          const data = await res.json();
          console.log("🐣 Babies fetched via GET:", data);
          setBabies(data);
        } else {
          const error = await res.text();
          console.error("❌ Failed GET /api/babies:", error);
        }
      } catch (err) {
        console.error("🔥 Error calling GET /api/babies:", err);
      }
    };
  
    fetchBabies();
  }, []);

  return (
    <div className="min-h-screen bg-babyblue p-6">
      <h2 className="text-3xl font-bold text-navy mb-4">👶 Your Babies</h2>

      {babies.length === 0 ? (
        <p className="text-navy mb-4">No babies yet. Click below to add one!</p>
      ) : (
        babies.map((baby) => (
          <div key={baby._id} className="bg-white p-4 rounded-2xl shadow mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">👧 {baby.name}</span>
              <div className="space-x-2">
                <button className="text-sm text-blue-600">Rename</button>
                <button className="text-sm text-red-500">Delete</button>
              </div>
            </div>
            <button className="mt-2 text-sm text-purple-600">+ Add Activity</button>
          </div>
        ))
      )}

      <button
        onClick={() => navigate("/babies")}
        className="bg-brightpink text-white px-4 py-2 rounded-2xl shadow hover:bg-pink-500 transition"
      >
        + Add New Baby
      </button>
    </div>
  );
}