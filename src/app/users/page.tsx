"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Icon from "@/components/Icon";

type User = {
  user_id_PK: number;
  full_name: string;
  phone_number: string;
  profile_image: string | null;
  country_code: string;
  email: string;
  is_premium: number | null;
  status: number | null;
  created_at: string;
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // CHANGE API URL IF NEEDED
      const res = await axios.get("http://localhost:3000/api/user/users");

      // supports both:
      // { data: [...] }
      // [...]
      const usersData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setUsers(usersData);
    } catch (error) {
      console.error("Users fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  //=============================
  //delete user
  const handleDelete = async (
    userId: number
  ) => {

    const confirmDelete =
      confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:3000/api/user/delete/${userId}`
      );

      alert("User deleted successfully");

      // refresh users
      fetchUsers();

    } catch (error: unknown) {

      console.log(
        "Delete error:",
        error
      );

      alert(
        
        "Failed to delete user"
      );
    }
  };



  // =========================
  // SEARCH FILTER
  // =========================
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const keyword = search.toLowerCase();

      return (
        u.full_name?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword) ||
        u.phone_number?.toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  // =========================
  // STATS
  // =========================
  const totalUsers = users.length;

  const premiumUsers = users.filter(
    (u) => Number(u.is_premium) === 1
  ).length;

  const freeUsers = users.filter(
    (u) => Number(u.is_premium) === 2 || !u.is_premium
  ).length;

  const monthlyNew = users.filter((u) => {
    const created = new Date(u.created_at);
    const now = new Date();

    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  // =========================
  // HELPERS
  // =========================
  const getInitials = (name: string) => {
    if (!name) return "NA";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[1].charAt(0)
    ).toUpperCase();
  };

  const getPlan = (isPremium: number | null) => {
    return Number(isPremium) === 1 ? "Premium" : "Free";
  };

  const getStatus = (status: number | null) => {
    if (Number(status) === 1) return "Active";
    if (Number(status) === 0) return "Pending";
    if (Number(status) === 2) return "Inactive";

    return "Pending";
  };

  const statusClass = (status: string) => {
    if (status === "Active") {
      return "badge-published";
    }

    if (status === "Pending") {
      return "badge-pending";
    }

    return "bg-surface-container text-on-surface-variant";
  };

  return (
    <>
      {/* ========================= */}
      {/* TOPBAR */}
      {/* ========================= */}
      <Topbar
        placeholder="Search users..."
        value={search}
        onChange={setSearch}
      />

      {/* ========================= */}
      {/* PAGE */}
      {/* ========================= */}
      <main className="p-4 md:p-6 xl:p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
              User Management
            </h2>

            <p className="text-on-surface-variant text-sm mt-1">
              View and manage all registered users across your platform.
            </p>
          </div>

          <button    onClick={() => router.push("/users/invite")}   className="px-7 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-2 shadow-primary hover:bg-primary-dim transition-all">
            <Icon
              name="person_add"
              size={18}
              className="text-on-primary"
            />

            Invite User
          </button>
        </div>

        {/* ========================= */}
        {/* STATS */}
        {/* ========================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={String(totalUsers)}
            icon="group"
            color="primary"
            progress="100%"
          />

          <StatCard
            label="Premium Users"
            value={String(premiumUsers)}
            icon="workspace_premium"
            color="secondary"
            progress={`${premiumUsers || 0}%`}
          />

          <StatCard
            label="Free Users"
            value={String(freeUsers)}
            icon="person"
            color="primary"
            progress={`${freeUsers || 0}%`}
          />

          <StatCard
            label="Monthly New"
            value={`+${monthlyNew}`}
            icon="person_add"
            color="tertiary"
            progress="80%"
          />
        </div>

        {/* ========================= */}
        {/* TABLE */}
        {/* ========================= */}
        <div className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden border border-outline-variant/10">

          {/* TABLE HEADER */}
          <div className="px-4 md:px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold font-headline">
              All Users
            </h3>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">
                Filter
              </button>

              <button className="px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">
                Export
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">

              <thead>
                <tr className="bg-surface-container-low/50">
                  {[
                    "User",
                    "Email",
                    "Phone",
                    "Plan",
                    "Joined",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-7 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-on-surface-variant"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-on-surface-variant"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const plan = getPlan(u.is_premium);
                    const status = getStatus(u.status);

                    return (
                      <tr
                        key={u.user_id_PK}
                        className="hover:bg-surface-container-low/30 transition-colors border-t border-outline-variant/5"
                      >
                        {/* USER */}
                        <td className="px-7 py-4">
                          <div className="flex items-center gap-3">

                            {u.profile_image ? (
                              <Image
                                unoptimized
                                src={u.profile_image}
                                alt={u.full_name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary-fixed-dim text-on-primary-fixed text-xs font-bold flex items-center justify-center">
                                {getInitials(u.full_name)}
                              </div>
                            )}

                            <div>
                              <p className="text-sm font-semibold text-on-surface">
                                {u.full_name}
                              </p>

                              <p className="text-xs text-on-surface-variant">
                                ID #{u.user_id_PK}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-7 py-4 text-sm text-on-surface-variant">
                          {u.email || "-"}
                        </td>

                        {/* PHONE */}
                        <td className="px-7 py-4 text-sm text-on-surface-variant">
                          {u.country_code} {u.phone_number}
                        </td>

                        {/* PLAN */}
                        <td className="px-7 py-4">
                          <span
                            className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${plan === "Premium"
                              ? "badge-premium"
                              : "bg-surface-container text-on-surface-variant"
                              }`}
                          >
                            {plan}
                          </span>
                        </td>

                        {/* JOINED */}
                        <td className="px-7 py-4 text-sm text-on-surface-variant">
                          {new Date(u.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-7 py-4">
                          <span
                            className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${statusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-7 py-4">
                          <div className="flex gap-2">

                            <button onClick={() =>
                              window.location.href =
                              `/users/edit/${u.user_id_PK}`
                            } className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                              <Icon name="edit" size={16} />
                            </button>

                            <button onClick={() =>
                              handleDelete(u.user_id_PK)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-full transition-all">
                              <Icon name="delete" size={16} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}


/*=====***********====================***************///////////////*/

// import Topbar from "@/components/Topbar";
// import StatCard from "@/components/StatCard";
// import Icon from "@/components/Icon";

// const users = [
//   { init: "AS", name: "Arjun Singh",   email: "arjun@example.com",  plan: "Premium", joined: "Apr 12, 2024", status: "Active" },
//   { init: "MK", name: "Meera Kapoor",  email: "meera@example.com",  plan: "Premium", joined: "Mar 3, 2024",  status: "Active" },
//   { init: "RP", name: "Rahul Prasad",  email: "rahul@example.com",  plan: "Free",    joined: "Jan 20, 2024", status: "Pending" },
//   { init: "NK", name: "Neha Kulkarni", email: "neha@example.com",   plan: "Free",    joined: "May 1, 2024",  status: "Active" },
//   { init: "VS", name: "Vikram Sharma", email: "vikram@example.com", plan: "Premium", joined: "Feb 14, 2024", status: "Inactive" },
// ];

// function statusClass(s: string) {
//   if (s === "Active")   return "badge-published";
//   if (s === "Pending")  return "badge-pending";
//   return "bg-surface-container text-on-surface-variant";
// }

// export default function UsersPage() {
//   return (
//     <>
//       <Topbar placeholder="Search users…" />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
//         <div className="flex items-end justify-between gap-4">
//           <div>
//             <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight font-headline">
//               User Management
//             </h2>
//             <p className="text-on-surface-variant text-sm mt-1">
//               View and manage all registered users across your platform.
//             </p>
//           </div>
//           <button className="px-7 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center gap-2 shadow-primary hover:bg-primary-dim transition-all">
//             <Icon name="person_add" size={18} className="text-on-primary" />
//             Invite User
//           </button>
//         </div>

//         <div className="grid grid-cols-4 gap-4">
//           <StatCard label="Total Users"   value="12,842" icon="group"              color="primary"   progress="68%" />
//           <StatCard label="Premium Users" value="3,241"  icon="workspace_premium"  color="secondary" progress="25%" />
//           <StatCard label="Free Users"    value="9,601"  icon="person"             color="primary"   progress="68%" />
//           <StatCard label="Monthly New"   value="+428"   icon="person_add"         color="tertiary"  progress="82%" />
//         </div>

//         <div className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden border border-outline-variant/10">
//           <div className="px-7 py-5 flex items-center justify-between">
//             <h3 className="text-lg font-bold font-headline">All Users</h3>
//             <div className="flex gap-2">
//               <button className="px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">Filter</button>
//               <button className="px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">Export</button>
//             </div>
//           </div>
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-surface-container-low/50">
//                 {["User", "Email", "Plan", "Joined", "Status", "Actions"].map((h) => (
//                   <th key={h} className="px-7 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u, i) => (
//                 <tr key={i} className="hover:bg-surface-container-low/30 transition-colors border-t border-outline-variant/5">
//                   <td className="px-7 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 rounded-full bg-primary-fixed-dim text-on-primary-fixed text-xs font-bold flex items-center justify-center">
//                         {u.init}
//                       </div>
//                       <span className="text-sm font-semibold text-on-surface">{u.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-7 py-4 text-sm text-on-surface-variant">{u.email}</td>
//                   <td className="px-7 py-4">
//                     <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${u.plan === "Premium" ? "badge-premium" : "bg-surface-container text-on-surface-variant"}`}>
//                       {u.plan}
//                     </span>
//                   </td>
//                   <td className="px-7 py-4 text-sm text-on-surface-variant">{u.joined}</td>
//                   <td className="px-7 py-4">
//                     <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${statusClass(u.status)}`}>
//                       {u.status}
//                     </span>
//                   </td>
//                   <td className="px-7 py-4">
//                     <div className="flex gap-2">
//                       <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-full transition-all">
//                         <Icon name="edit" size={16} />
//                       </button>
//                       <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-full transition-all">
//                         <Icon name="delete" size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </>
//   );
// }
