import React from "react"; // ✅ Required for JSX rendering
import { useParams, useLocation } from "react-router-dom";

export default function AddActivity() {
  const { type } = useParams();
  const search = new URLSearchParams(useLocation().search);
  const babyId = search.get("babyId");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">
        Add {type} for baby {babyId}
      </h1>
      {/* Add your form or logic here */}
    </div>
  );
}