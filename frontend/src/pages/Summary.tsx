import React, { useEffect, useState } from 'react';

type SummaryData = {
  totalSleep: { seconds: number; formatted: string };
  totalFeeding: { seconds: number; formatted: string };
  diaperStats: Record<string, number>;
};

type Baby = {
  _id: string;
  name: string;
};

export default function Summary() {
  const [babies, setBabies] = useState<Baby[]>([]);
  const [summaries, setSummaries] = useState<Record<string, SummaryData>>({});

  // Fetch babies on mount
  useEffect(() => {
    fetch('/api/babies', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log('👶 Babies:', data);
        if (Array.isArray(data)) {
          setBabies(data);
        } else {
          console.warn('⚠️ Unexpected babies response format:', data);
        }
      })
      .catch(err => console.error('💥 Error fetching babies:', err));
  }, []);

  // Fetch daily summary for each baby
  useEffect(() => {
    babies.forEach(baby => {
      fetch(`/api/activity/summary/${baby._id}?period=daily`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          console.log(`📊 Summary for ${baby.name}:`, data);
          setSummaries(prev => ({
            ...prev,
            [baby._id]: data.data,
          }));
        })
        .catch(err =>
          console.error(`💥 Error fetching summary for ${baby.name}:`, err)
        );
    });
  }, [babies]);

  return (
    <div className="min-h-screen bg-bubble p-6 text-navy">
      <h1 className="text-2xl font-bold mb-4">👶 Summary</h1>

      {babies.length === 0 && (
        <p className="text-gray-500 italic">No babies found. Try logging in or adding one.</p>
      )}

      {babies.map(baby => {
        const summary = summaries[baby._id];
        return (
          <div key={baby._id} className="mb-6">
            <h2 className="text-xl font-semibold text-secondary mb-2">{baby.name}</h2>

            {summary ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow p-4 border border-primary/10">
                  <h3 className="text-md font-medium text-primary mb-1">Sleep</h3>
                  <p className="text-lg">{summary.totalSleep.formatted}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-4 border border-primary/10">
                  <h3 className="text-md font-medium text-primary mb-1">Feeding</h3>
                  <p className="text-lg">{summary.totalFeeding.formatted}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-4 border border-primary/10">
                  <h3 className="text-md font-medium text-primary mb-1">Diapers</h3>
                  <p>Total: {summary.diaperStats.total}</p>
                  {Object.entries(summary.diaperStats).map(([key, value]) =>
                    key === 'total' ? null : (
                      <p key={key} className="text-sm text-gray-600">
                        {key}: {value}
                      </p>
                    )
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Loading summary...</p>
            )}
          </div>
        );
      })}
    </div>
  );
}