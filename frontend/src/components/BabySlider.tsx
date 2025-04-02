import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

export default function BabySlider({
  baby,
  onRename,
  onDelete,
  lastActivity,
}: {
  baby: { _id: string; name: string };
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  lastActivity?: any;
}) {
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

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
      const timer = setTimeout(() => handleReset(), 30000);
      setResetTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isSwiped]);

  const renderLastActivity = () => {
    if (!lastActivity) return <p className="text-sm text-gray-500">No activity yet</p>;

    const time = new Date(lastActivity.startTime || lastActivity.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (lastActivity.type === "feeding") {
      return (
        <p className="text-sm text-gray-700">
          🍽 Feeding at {time} ({lastActivity.method})
        </p>
      );
    } else if (lastActivity.type === "diaper") {
      return (
        <p className="text-sm text-gray-700">
          💩 Diaper at {time} ({lastActivity.contents})
        </p>
      );
    } else if (lastActivity.type === "sleep") {
      return <p className="text-sm text-gray-700">😴 Sleep started at {time}</p>;
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-4">
      <div className="flex justify-between items-center">
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 shadow cursor-pointer text-lg"
          drag="x"
          dragConstraints={{ left: 0, right: 100 }}
          onDragEnd={handleSwipeEnd}
          animate={controls}
        >
          👶 {baby.name}
        </motion.button>
        <div className="space-x-2">
          <button className="text-sm text-blue-600" onClick={() => onRename(baby._id)}>
            Rename
          </button>
          <button className="text-sm text-red-500" onClick={() => onDelete(baby._id)}>
            Delete
          </button>
        </div>
      </div>

      <div className="mt-2 ml-2">{renderLastActivity()}</div>

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