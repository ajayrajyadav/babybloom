import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BabySlider from "../components/BabySlider";

interface Baby {
  _id: string;
  name: string;
}

interface Activity {
  type: string;
  startTime?: string;
  endTime?: string;
  contents?: string;
  notes?: string;
}

export default function Dashboard() {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [lastActivities, setLastActivities] = useState<Record<string, Activity | null>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBabies = async () => {
      try {
        const res = await fetch("/api/babies", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setBabies(data);

          // Fetch last activity for each baby
          data.forEach(async (baby: Baby) => {
            try {
              const activityRes = await fetch(`/api/activity/last/${baby._id}`, {
                method: "GET",
                credentials: "include",
              });
              if (activityRes.ok) {
                const activityData = await activityRes.json();
                setLastActivities((prev) => ({ ...prev, [baby._id]: activityData.lastActivity }));
              } else {
                setLastActivities((prev) => ({ ...prev, [baby._id]: null }));
              }
            } catch (err) {
              console.error("Error fetching last activity for", baby.name, err);
              setLastActivities((prev) => ({ ...prev, [baby._id]: null }));
            }
          });
        } else {
          console.error("Failed to fetch babies");
        }
      } catch (error) {
        console.error("Error fetching babies:", error);
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
          <div key={baby._id}>
            <BabySlider baby={baby} lastActivity={lastActivities[baby._id]} />
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