"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

export default function CreatePlanPage() {
  const router = useRouter();

 const [form, setForm] = useState({
  plan_name: "",
  amount: "",
  duration_months: "",
  plan_type: "1",
  is_active: "1", // 
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!form.plan_name || !form.amount || !form.duration_months) {
    setError("All fields are required");
    return;
  }

  try {
    setLoading(true);

const res = await fetch("http://localhost:3000/api/plans/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    plan_name: form.plan_name.trim(),
    amount: Number(form.amount),
    duration_months: Number(form.duration_months),
    plan_type: Number(form.plan_type),
    is_active: Number(form.is_active), //
  }),
});
    const data = await res.json();

    // 🔴 IMPORTANT: backend-safe check
    if (!res.ok || !data.status) {
      throw new Error(data.message || "Failed to create plan");
    }

    // optional success UX
    router.push("/subscriptions");
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <Topbar placeholder="Create new subscription plan..." />

      <main className="p-8 max-w-5xl mx-auto w-full pb-20">
        {/* HEADER (same style as subscriptions page) */}
        <div className="mb-10">
          <p className="text-primary font-bold text-xs tracking-widest uppercase mb-1">
            Monetization
          </p>

          <h1 className="text-[34px] font-extrabold text-on-surface tracking-tight font-headline">
            Create New Plan
          </h1>

          <p className="text-on-surface-variant mt-1 max-w-lg">
            Define pricing, duration, and plan type for your subscription system.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-surface-container rounded-3xl border border-orange-100 shadow-sm p-8 relative overflow-hidden">
          {/* background glow (same style as your UI) */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

          <form
            onSubmit={handleSubmit}
            className="relative z-10 space-y-6"
          >
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* PLAN NAME */}
            <div>
              <label className="text-sm font-bold text-on-surface-variant">
                Plan Name
              </label>
              <input
                type="text"
                name="plan_name"
                value={form.plan_name}
                onChange={handleChange}
                placeholder="e.g. Premium Plan"
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>

            {/* AMOUNT */}
            <div>
              <label className="text-sm font-bold text-on-surface-variant">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 199"
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>

            {/* DURATION */}
            <div>
              <label className="text-sm font-bold text-on-surface-variant">
                Duration (Months)
              </label>
              <input
                type="number"
                name="duration_months"
                value={form.duration_months}
                onChange={handleChange}
                placeholder="e.g. 1 / 6 / 12"
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>

            {/* PLAN TYPE */}
            <div>
              <label className="text-sm font-bold text-on-surface-variant">
                Plan Type
              </label>

              <select
                name="plan_type"
                value={form.plan_type}
                onChange={handleChange}
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
              >
                <option value="1">Premium Plan</option>
                <option value="2">Free Plan</option>
              </select>
            </div>
<div>
  <label className="text-sm font-bold text-on-surface-variant">
    Plan Status
  </label>

  <select
    name="is_active"
    value={form.is_active}
    onChange={handleChange}
    className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
  >
    <option value="1">Active</option>
    <option value="0">Inactive</option>
  </select>
</div>


            {/* BUTTONS */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/subscriptions")}
                className="px-6 py-3 rounded-2xl bg-surface-container-lowest border border-orange-100 font-bold text-on-surface-variant hover:scale-105 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-2xl font-bold text-white hover:scale-105 transition-all flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg,#a14200,#8d3900)",
                  boxShadow:
                    "0 8px 24px rgba(161,66,0,0.22)",
                }}
              >
                <Icon name="add_circle" size={18} />
                {loading ? "Creating..." : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}