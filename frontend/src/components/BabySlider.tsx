import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

type Baby = {
  _id: string;
  name: string;
};

type LastActivity = {
  type: string;
  startTime?: string;
  time?: string;
  method?: string;
  contents?: string;
};

export default function BabySlider({
  baby,
  refresh,
}: {
  baby: Baby;
  refresh: () => void;
}) {
  const controls = useAnimation();
  const navigate = useNavigate();
  const [isSwiped, setIsSwiped] = useState(false);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(baby.name);
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);

  const handleSwipeEnd = (_: any, info: any) => {
    if (info.offset.x > 120) {
      setIsSwiped(true);
    } else {
      setIsSwiped(false);
      controls.start({ x: 0 });
    }
  };

  const handleReset = () => {
    setIsSwiped(false);
    controls.start({ x: 0 });
    if (resetTimer) {
      clearTimeout(resetTimer);
      setResetTimer(null);
    }
  };

  useEffect(() => {
    if (isSwiped) {
      const timer = setTimeout(() => {
        handleReset();
      }, 30000); // 30 seconds
      setResetTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isSwiped]);

  useEffect(() => {
    const fetchLastActivity = async () => {
      try {
        const res = await fetch(`/api/activity/last/${baby._id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setLastActivity(data.lastActivity);
        }
      } catch (err) {
        console.error("Error fetching last activity:", err);
      }
    };
    fetchLastActivity();
  }, [baby._id]);

  const handleRename = async () => {
    try {
      const res = await fetch(`/api/babies/${baby._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        console.log("✅ Baby renamed");
        setIsRenaming(false);
        if (typeof refresh === "function") refresh();
      } else {
        const error = await res.text();
        console.error("❌ Rename failed:", error);
      }
    } catch (err) {
      console.error("🔥 Rename error:", err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this baby?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/babies/${baby._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        console.log("🗑️ Baby deleted");
        refresh();
      } else {
        const error = await res.text();
        console.error("❌ Delete failed:", error);
      }
    } catch (err) {
      console.error("🔥 Delete error:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-4">
      <div className="flex justify-between items-center">
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 shadow cursor-pointer text-lg"
          drag="x"
          dragConstraints={{ left: 0, right: 100 }}
          onDragEnd={handleSwipeEnd}
          animate={controls}
        >
          👶{" "}
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border px-2 py-1 rounded"
                autoFocus
              />
              <button
                onClick={handleRename}
                className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
              >
                ✅
              </button>
              <button
                onClick={() => {
                  setIsRenaming(false);
                  setNewName(baby.name); // reset input
                }}
                className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
              >
                ❌
              </button>
            </div>
            ) : (
              baby.name
              )}
        </motion.div>

        <div className="space-x-2">
          <button onClick={() => setIsRenaming(true)} className="text-sm text-blue-600">
            Rename
          </button>
          <button onClick={handleDelete} className="text-sm text-red-500">
            Delete
            </button>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {lastActivity ? (
          <>
            {lastActivity.type === "feeding" && (
              <>
                🍽️ Feeding at{" "}
                {new Date(lastActivity.startTime || lastActivity.time!).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ({lastActivity.method})
              </>
            )}
            {lastActivity.type === "diaper" && (
              <>
                💩 Diaper at{" "}
                {new Date(lastActivity.time!).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ({lastActivity.contents})
              </>
            )}
            {lastActivity.type === "sleep" && (
              <>
                😴 Sleep started at{" "}
                {new Date(lastActivity.startTime!).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            )}
          </>
        ) : (
          <span className="text-gray-400">No activity yet</span>
        )}
      </div>

      {isSwiped && (
        <div className="mt-3 flex flex-col space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/activity?type=feeding&babyId=${baby._id}`)}
              className="text-sm text-green-600"
            >
              🍽 Feeding
            </button>
            <button
              onClick={() => navigate(`/activity?type=sleep&babyId=${baby._id}`)}
              className="text-sm text-blue-600"
            >
              😴 Sleep
            </button>
            <button
              onClick={() => navigate(`/activity?type=diaper&babyId=${baby._id}`)}
              className="text-sm text-yellow-600"
            >
              💩 Diaper
            </button>
          </div>
          <button onClick={handleReset} className="text-xs text-gray-500 underline">
            ↩ Reset
          </button>
        </div>
      )}
    </div>
  );
}