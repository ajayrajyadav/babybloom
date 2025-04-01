import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

export default function BabySlider({ baby }: { baby: { _id: string; name: string } }) {
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);
  const navigate = useNavigate();
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);

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

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isSwiped]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-4">
      <div className="flex justify-between items-center">
        {/* Draggable emoji/name */}
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 shadow cursor-pointer text-lg"
          drag="x"
          dragConstraints={{ left: 0, right: 100 }}
          onDragEnd={handleSwipeEnd}
          animate={controls}
        >
          👶 {baby.name}
        </motion.button>

        {/* Rename / Delete */}
        <div className="space-x-2">
          <button className="text-sm text-blue-600">Rename</button>
          <button className="text-sm text-red-500">Delete</button>
        </div>
      </div>

      {/* Reveal actions if swiped */}
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