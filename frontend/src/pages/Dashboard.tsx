
import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Babies</h2>
      <div className="border p-4 rounded mb-4">
        <div className="flex justify-between items-center">
          <span>👶 Ava</span>
          <div className="space-x-2">
            <button className="text-sm text-blue-600">Rename</button>
            <button className="text-sm text-red-500">Delete</button>
          </div>
        </div>
        <button className="mt-2 text-sm text-purple-600">+ Add Activity</button>
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded-full">+ Add New Baby</button>
    </div>
  );
}
