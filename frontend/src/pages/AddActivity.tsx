import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getUserTimezone } from "../utils/timeUtils";

export default function AddActivity() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type"); // 'diaper', 'sleep', 'feeding'
  const babyId = searchParams.get("babyId");

  const [form, setForm] = useState<any>({
    time: new Date().toISOString().slice(0, 16),
    startTime: new Date().toISOString().slice(0, 16),
    endTime: "",
    durationHours: "",
    durationMinutes: "",
    contents: "",
    color: "",
    notes: "",
  });

  const [incompleteLogId, setIncompleteLogId] = useState<string | null>(null);
  const [incompleteStartTime, setIncompleteStartTime] = useState<string | null>(null);
  const [useEndTime, setUseEndTime] = useState(false); // 🆕 toggle between endTime and duration

  useEffect(() => {
    if (!type || !babyId) {
      navigate("/dashboard");
    } else {
      const timezone = getUserTimezone();
      console.log("🕒 User's timezone is:", timezone);
    }
  }, [type, babyId]);

  useEffect(() => {
    const fetchIncomplete = async () => {
      if (type === "sleep" || type === "feeding") {
        const res = await fetch(`/api/activity/${type}/incomplete/${babyId}`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const log = data?.data || data?.incompleteLog;
          if (log?._id) {
            setIncompleteLogId(log._id);
            setIncompleteStartTime(log.startTime?.slice(0, 16) || null);
            setForm((prev: any) => ({
              ...prev,
              startTime: log.startTime?.slice(0, 16) || prev.startTime,
              notes: log.notes || "",
              amount: log.amount || "",
              method: log.method || "",
              endTime: "",
              durationHours: "",
              durationMinutes: "",
            }));
          }
        }
      }
    };
    fetchIncomplete();
  }, [type, babyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload: any = { babyId, notes: form.notes };

    if (type === "diaper" || type === "feeding") {
      payload.time = new Date(form.time).toISOString();
      if (type === "diaper") {
        payload.contents = form.contents;
        payload.color = form.color;
      }
    }

    if (type === "feeding") {
      payload.amount = Number(form.amount);
      payload.method = form.method;
    }

    if (type === "sleep" || type === "feeding") {
      payload.startTime = new Date(form.startTime).toISOString();

      if (incompleteLogId) {
        const start = new Date(form.startTime);
        console.log("Start: " + start.toISOString());

        if (!useEndTime && (form.durationHours || form.durationMinutes)) {
          const totalMinutes =
            Number(form.durationHours || 0) * 60 + Number(form.durationMinutes || 0);
          if (totalMinutes <= 0) {
            alert("❌ Duration must be greater than 0.");
            return;
          }
          const durationMs = totalMinutes * 60000;
          const calculatedEnd = new Date(start.getTime() + durationMs);

          payload.endTime = calculatedEnd.toISOString();
          payload.duration = Math.floor(durationMs / 1000);
        } else if (useEndTime && form.endTime && form.endTime.trim() !== "") {
          console.log("End time provided:", form.endTime);
          console.log("Endtime.trim():", form.endTime.trim());
          const end = new Date(form.endTime);
          if (end <= start) {
            console.log("Inside end<=start");
            alert("❌ End time must be after start time.");
            return;
          }
          payload.endTime = end.toISOString();
        } else {
          alert("❌ Please provide either an end time or duration.");
          return;
        }
      }
    }

    const url = incompleteLogId
      ? `/api/activity/${type}/${incompleteLogId}`
      : `/api/activity/${type}`;
    const method = incompleteLogId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log(`✅ ${type} activity ${incompleteLogId ? "updated" : "created"}`);
        navigate("/dashboard");
      } else {
        const error = await res.text();
        console.error("❌ Failed to save activity:", error);
      }
    } catch (err) {
      console.error("🔥 Error logging activity:", err);
    }
  };

  return (
    <div className="min-h-screen bg-bubble p-6 text-navy">
      <h2 className="text-2xl font-bold mb-4">➕ Log {type} activity</h2>
      <div className="space-y-4 max-w-md mx-auto">

        {incompleteLogId && (type === "sleep" || type === "feeding") && incompleteStartTime && (
          <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded">
            <p>
              💤 Sleep started at <strong>{new Date(incompleteStartTime).toLocaleString()}</strong>
            </p>
            <p>Add end time or duration below to complete this log.</p>
          </div>
        )}

        {(type === "diaper") && !incompleteLogId && (
          <input
            type="datetime-local"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full p-2 rounded-xl border border-pink-300"
          />
        )}

        {(type === "sleep" || type === "feeding") && (
          <>
            {!incompleteLogId && (
              <>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full p-2 rounded-xl border border-pink-300"
                />
                {type === "feeding" && (
                  <label className="block text-sm text-navy">
                    <input
                      type="checkbox"
                      checked={useEndTime}
                      onChange={(e) => setUseEndTime(e.target.checked)}
                      className="mr-2"
                    />
                    Enter end time instead
                  </label>
                )}
                {!useEndTime ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      name="durationHours"
                      value={form.durationHours}
                      onChange={handleChange}
                      placeholder="Hours"
                      className="w-full p-2 rounded-xl border border-pink-300"
                      min={0}
                    />
                    <input
                      type="number"
                      name="durationMinutes"
                      value={form.durationMinutes}
                      onChange={handleChange}
                      placeholder="Minutes"
                      className="w-full p-2 rounded-xl border border-pink-300"
                      min={0}
                    />
                  </div>
                ) : (
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full p-2 rounded-xl border border-pink-300"
                    placeholder="End time"
                  />
                )}
              </>
            )}

            {incompleteLogId && (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useEndTime}
                    onChange={() => setUseEndTime(!useEndTime)}
                  />
                  <span className="text-sm">Enter end time instead</span>
                </label>

                {useEndTime ? (
                  <input
                    key={incompleteLogId + "_endTime"}
                    type="datetime-local"
                    name="endTime"
                    value={form.endTime ?? ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded-xl border border-pink-300"
                    placeholder="End time"
                    autoComplete="new-password"
                    inputMode="none"
                  />
                ) : (
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      name="durationHours"
                      value={form.durationHours}
                      onChange={handleChange}
                      placeholder="Hours"
                      className="w-full p-2 rounded-xl border border-pink-300"
                      min={0}
                    />
                    <input
                      type="number"
                      name="durationMinutes"
                      value={form.durationMinutes}
                      onChange={handleChange}
                      placeholder="Minutes"
                      className="w-full p-2 rounded-xl border border-pink-300"
                      min={0}
                    />
                    <span className="text-sm text-gray-500">← or enter duration</span>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {type === "feeding" && (
          <>
            <input
              name="amount"
              placeholder="Amount (ml)"
              value={form.amount || ""}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border border-pink-300"
              type="number"
            />
            <input
              name="method"
              placeholder="Method (e.g. bottle, breast)"
              value={form.method || ""}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border border-pink-300"
            />
          </>
        )}

        {type === "diaper" && (
          <>
            <input
              name="contents"
              placeholder="Contents (e.g. wet, soiled)"
              value={form.contents}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border border-pink-300"
            />
            <input
              name="color"
              placeholder="Color (e.g. clear, yellow)"
              value={form.color}
              onChange={handleChange}
              className="w-full p-2 rounded-xl border border-pink-300"
            />
          </>
        )}

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full p-2 rounded-xl border border-pink-300"
        />

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="bg-brightpink text-white px-4 py-2 rounded-xl shadow hover:bg-pink-500 transition"
          >
            ✅ Log {type}
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
