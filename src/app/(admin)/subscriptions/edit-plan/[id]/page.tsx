"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://139.59.1.109:3000";

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    plan_name: "",
    amount: "",
    duration_months: "",
    plan_type: "1",
    is_active: "1",
  });

  // ================= FETCH PLAN =================
useEffect(() => {
  const fetchPlan = async () => {
    if (!planId) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/plans/${planId}`
      );

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Failed to load plan");
      }

      const plan = data.data;

      setForm({
        plan_name: plan.plan_name || "",
        amount: plan.amount?.toString() || "",
        duration_months: plan.duration_months?.toString() || "",
        plan_type: plan.plan_type?.toString() || "1",
        is_active: plan.is_active?.toString() || "1",
      });
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  fetchPlan();
}, [planId]);


//   useEffect(() => {
//     const fetchPlan = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `http://localhost:3000/api/plans/${planId}`
//         );

//         const data = await res.json();

//         if (!data.status) {
//           throw new Error("Failed to load plan");
//         }

//         const plan = data.data;

//         setForm({
//           plan_name: plan.plan_name,
//           amount: plan.amount.toString(),
//           duration_months: plan.duration_months.toString(),
//           plan_type: plan.plan_type.toString(),
//           is_active: plan.is_active.toString(),
//         });
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (planId) fetchPlan();
//   }, [planId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE PLAN =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);

      const res = await fetch(
        `${API_URL}/api/plans/update/${planId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_name: form.plan_name.trim(),
            amount: Number(form.amount),
            duration_months: Number(form.duration_months),
            plan_type: Number(form.plan_type),
            is_active: Number(form.is_active),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Update failed");
      }

      router.push("/subscriptions");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Topbar placeholder="Loading plan..." />
        <div className="p-10 text-center text-primary font-bold">
          Loading plan details...
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar placeholder="Edit subscription plan..." />

      <main className="p-8 max-w-5xl mx-auto w-full pb-20">
        {/* HEADER */}
        <div className="mb-10">
          <p className="text-primary font-bold text-xs tracking-widest uppercase mb-1">
            Monetization
          </p>

          <h1 className="text-[34px] font-extrabold text-on-surface tracking-tight font-headline">
            Edit Plan
          </h1>

          <p className="text-on-surface-variant mt-1 max-w-lg">
            Update pricing, duration, and availability of this plan.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-surface-container rounded-3xl border border-orange-100 shadow-sm p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm border border-red-100">
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
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100 focus:ring-2 focus:ring-primary"
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
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100 focus:ring-2 focus:ring-primary"
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
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100 focus:ring-2 focus:ring-primary"
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
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100"
              >
                <option value="1">Premium Plan</option>
                <option value="2">Free Plan</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm font-bold text-on-surface-variant">
                Status
              </label>

              <select
                name="is_active"
                value={form.is_active}
                onChange={handleChange}
                className="mt-2 w-full px-5 py-4 rounded-2xl bg-surface-container-lowest border border-orange-100"
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
                className="px-6 py-3 rounded-2xl bg-surface-container-lowest border border-orange-100 font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-7 py-3 rounded-2xl font-bold text-white flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg,#a14200,#8d3900)",
                  boxShadow:
                    "0 8px 24px rgba(161,66,0,0.22)",
                }}
              >
                <Icon name="edit" size={18} />
                {saving ? "Updating..." : "Update Plan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}