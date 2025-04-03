import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function AddActivity() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type"); // 'diaper', 'sleep', 'feeding'
  const babyId = searchParams.get("babyId");

  const [form, setForm] = useState<any>({
    time: new Date().toISOString().slice(0, 16),
    startTime: new Date().toISOString().slice(0, 16),
    endTime: "",
    contents: "",
    color: "",
    notes: "",
  });

  const [incompleteLogId, setIncompleteLogId] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !babyId) {
      navigate("/dashboard");
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
          if (data?.incompleteLog?._id) {
            setIncompleteLogId(data.incompleteLog._id);
            setForm((prev: any) => ({
              ...prev,
              startTime: data.incompleteLog.startTime?.slice(0, 16) || prev.startTime,
              notes: data.incompleteLog.notes || "",
              amount: data.incompleteLog.amount || "",
              method: data.incompleteLog.method || "",
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
      if (incompleteLogId && form.endTime) {
        payload.endTime = new Date(form.endTime).toISOString();
      } else {
        payload.startTime = new Date(form.startTime).toISOString();
      }
    }

    const url = incompleteLogId
      ? `/api/activity/${type}/${incompleteLogId}`
      : `/api/activity/${type}`;
    const method = incompleteLogId ? "PUT" : "POST";

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
        {(type === "diaper" || type === "feeding") && !incompleteLogId && (
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
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full p-2 rounded-xl border border-pink-300"
              />
            )}
            {incompleteLogId && (
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full p-2 rounded-xl border border-pink-300"
              />
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