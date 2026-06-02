"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Topbar from "@/components/Topbar";
import Icon from "@/components/Icon";

export default function InviteUserPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    try {
      if (!email) {
        alert("Email is required");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/user/invite",
        {
          email,
          role,
        }
      );

      alert(res.data.message || "User invited successfully");

      router.push("/users"); // redirect back
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.log(error.response?.data);
  } else {
    console.log(error);
  }
}finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TOPBAR */}
      <Topbar placeholder="Invite new user..." />

      <main className="p-4 md:p-6 xl:p-8 max-w-2xl mx-auto w-full">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-[28px] font-extrabold text-on-surface font-headline">
            Invite User
          </h2>

          <p className="text-on-surface-variant text-sm mt-1">
            Send an invitation to join your platform.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-6 space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-on-surface-variant">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full mt-1 p-3 border border-outline-variant rounded-lg"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-on-surface-variant">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 p-3 border border-outline-variant rounded-lg"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">

            <button
              onClick={() => router.push("/users")}
              className="px-4 py-2 border border-outline-variant rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleInvite}
              disabled={loading}
              className="px-5 py-2 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2"
            >
              <Icon name="send" size={16} className="text-on-primary" />
              {loading ? "Sending..." : "Send Invite"}
            </button>

          </div>

        </div>
      </main>
    </>
  );
}