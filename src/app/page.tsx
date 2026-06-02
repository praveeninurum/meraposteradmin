"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import Icon from "@/components/Icon";

type Category = {
  id: number;
  name: string;
  lang_type?: string;
};

type ChartItem = {
  day: string;
  users: number;
};
type User = {
  user_id_PK: number;
  full_name: string | null;
  email: string | null;
  created_at: string;
};

type RecentActivity = {
  id: number;
  user_id_FK: number;
  full_name: string | null;
  action_type: string;
  template_name: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalContent, setTotalContent] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);

  const [chartData, setChartData] = useState<ChartItem[]>([]);

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);


      const [
        usersRes,
        categoriesRes,
        contentRes,
        activityRes
      ] = await Promise.all([
        axios.get("http://localhost:3000/api/user/users"),
        axios.get("http://localhost:3000/api/content/trending/categories"),
        axios.get("http://localhost:3000/api/content"),
        axios.get("http://localhost:3000/api/activity/recent"),
      ]);

      const users =
        usersRes?.data?.data || [];

      const categoriesData =
        categoriesRes?.data?.data || [];

      const content =
        contentRes?.data?.data || [];
        const activity =
  activityRes?.data?.data || [];

      // COUNTS
   // COUNTS
setTotalUsers(users.length);
setUsers(users);

setTotalCategories(categoriesData.length);
setTotalContent(content.length);
      // SAVE CATEGORIES
      setCategories(categoriesData);
setRecentActivity(activity);
      // USER GROWTH CHART
      const weekDays = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ];

      const counts: Record<string, number> = {
        Sun: 0,
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
      };

      users.forEach((user: User) => {

        if (user.created_at) {

          const day =
            weekDays[
              new Date(
                user.created_at
              ).getDay()
            ];

          counts[day] += 1;
        }
      });

      const finalChart = weekDays.map(
        (day) => ({
          day,
          users: counts[day],
        })
      );

      setChartData(finalChart);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const maxUsers = Math.max(
    ...chartData.map((d) => d.users),
    1
  );

  return (
    <>

      <Topbar placeholder="Search templates, users, or logs…" />

      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* HEADER */}
        <div className="flex items-end justify-between gap-4">

          <div>
            <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight leading-none font-headline">
              Dashboard Overview
            </h2>

            <p className="text-on-surface-variant text-sm mt-1">
              Welcome back, Admin. Here&apos;s what&apos;s happening today.
            </p>
          </div>

          <button className="px-5 py-2 bg-secondary-container text-on-secondary-container text-sm font-semibold rounded-full hover:opacity-90 transition-all flex items-center gap-2">
            <Icon name="calendar_today" size={16} />
            Live Data
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <StatCard
            label="Total Users"
            value={
              loading
                ? "..."
                : totalUsers.toString()
            }
            delta="+12%"
            icon="group"
            color="primary"
            progress="70%"
          />

          <StatCard
            label="Total Categories"
            value={
              loading
                ? "..."
                : totalCategories.toString()
            }
            delta="+8%"
            icon="category"
            color="secondary"
            progress="60%"
          />

          <StatCard
            label="Total Content"
            value={
              loading
                ? "..."
                : totalContent.toString()
            }
            delta="+15%"
            icon="dashboard_customize"
            color="tertiary"
            progress="80%"
          />

        </div>

        {/* CHART + TRENDING */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* USER GROWTH */}
          <div className="lg:col-span-2 bg-surface-container-low rounded-DEFAULT p-7 flex flex-col">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h3 className="text-lg font-bold text-on-surface font-headline">
                  User Growth
                </h3>

                <p className="text-xs text-on-surface-variant">
                  Daily registrations overview
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />

                <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                  New Users
                </span>
              </div>
            </div>

            <div className="flex items-end gap-3 h-52 px-2 pb-4 border-b border-l border-outline-variant/20">

              {chartData.map((item, i) => {

                const height =
                  (item.users / maxUsers) * 100;

                return (

                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >

                    <span className="text-[10px] font-bold text-on-surface opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.users}
                    </span>

                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        i === chartData.length - 1
                          ? "bg-primary"
                          : "bg-primary/20 hover:bg-primary/60"
                      }`}
                      style={{
                        height: `${height}%`
                      }}
                    />

                  </div>
                );
              })}
            </div>

            <div className="flex justify-between px-2 mt-3">

              {chartData.map((item, i) => (

                <span
                  key={i}
                  className="text-[10px] font-bold text-on-surface-variant uppercase"
                >
                  {item.day}
                </span>

              ))}

            </div>

          </div>

          {/* TRENDING CATEGORIES */}
          <div className="bg-surface-container-lowest rounded-DEFAULT p-6">

            <h3 className="text-lg font-bold text-on-surface font-headline mb-5">
              Trending Categories
            </h3>

            <div className="space-y-5">

              {categories.slice(0, 4).map((cat, i) => (

                <div
                  key={cat.id}
                  className="flex items-center gap-3"
                >

                  <div className="w-11 h-11 rounded-lg bg-primary-container flex items-center justify-center shrink-0">

                    <Icon
                      name="category"
                      fill={1}
                      size={20}
                      className="text-on-primary-container"
                    />

                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-bold text-on-surface truncate">
                      {cat.name}
                    </p>

                    <p className="text-[10px] text-on-surface-variant">
                      {cat.lang_type || "Category"}
                    </p>

                  </div>

                  <span className="text-xs font-bold text-primary">
                    #{i + 1}
                  </span>

                </div>

              ))}

            </div>

            <button   onClick={() => router.push("/categories")}   className="w-full mt-6 py-3 text-xs font-bold text-primary bg-primary/5 rounded-DEFAULT hover:bg-primary/10 transition-colors uppercase tracking-widest">
              View All Categories
            </button>

          </div>

        </div>
        {/* RECENT USERS */}
<div className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden border border-outline-variant/10">

  <div className="px-7 py-5 flex items-center justify-between">

    <h3 className="text-lg font-bold text-on-surface font-headline">
      New Users
    </h3>

    <button
      onClick={() => router.push("/users")}
      className="text-xs font-bold text-primary uppercase tracking-widest"
    >
      View All
    </button>

  </div>

  <table className="w-full text-left">

    <thead>
      <tr className="bg-surface-container-low/50">

        {["User", "Email", "Date"].map((h) => (
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

      {users.slice(0, 5).map((user: User, i: number) => (

        <tr
          key={i}
          className="hover:bg-surface-container-low/30 transition-colors border-t border-outline-variant/5"
        >

          {/* USER */}
          <td className="px-7 py-4">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
{user.full_name?.charAt(0).toUpperCase() || "U"}

              </div>

              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {user.full_name || "No Name"}
                </p>
              </div>

            </div>

          </td>

          {/* EMAIL */}
          <td className="px-7 py-4 text-sm text-on-surface-variant">
            {user.email || "No Email"}
          </td>

          {/* DATE */}
          <td className="px-7 py-4 text-sm text-on-surface-variant">

            {user.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "-"}

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>
{/* RECENT ACTIVITY */}
<div className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden border border-outline-variant/10">

  <div className="px-7 py-5 flex items-center justify-between">

    <h3 className="text-lg font-bold text-on-surface font-headline">
      Recent Activity
    </h3>

    <button
      className="text-xs font-bold text-primary hover:underline"
    >
      View All
    </button>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full text-left">

      <thead>

        <tr className="bg-surface-container-low/50 border-y border-outline-variant/10">

          <th className="px-7 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            User
          </th>

          <th className="px-7 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            Action
          </th>

          <th className="px-7 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            Template
          </th>

          <th className="px-7 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            Date
          </th>

          <th className="px-7 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {recentActivity.length > 0 ? (

          recentActivity.map((item: RecentActivity, i: number) => (

            <tr
              key={i}
              className="border-t border-outline-variant/5 hover:bg-surface-container-low/30 transition-colors"
            >

              {/* USER */}
              <td className="px-7 py-4">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-sm">

                    {item.full_name?.charAt(0).toUpperCase() || "U"}

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-on-surface">

                      {item.full_name || "Unknown User"}

                    </p>

                    <p className="text-[11px] text-on-surface-variant">

                      ID #{item.user_id_FK}

                    </p>

                  </div>

                </div>

              </td>

              {/* ACTION */}
              <td className="px-7 py-4 text-sm text-on-surface">

                {item.action_type || "-"}

              </td>

              {/* TEMPLATE */}
              <td className="px-7 py-4 text-sm font-medium text-primary">

                {item.template_name || "-"}

              </td>

              {/* DATE */}
              <td className="px-7 py-4 text-sm text-on-surface-variant">

                {new Date(item.created_at).toLocaleDateString()}

              </td>

              {/* STATUS */}
              <td className="px-7 py-4">

                <span
                  className={`
                    px-3 py-1 rounded-full text-[10px] font-bold uppercase
                    ${
                      item.status === "Published"
                        ? "bg-primary/15 text-primary"
                        : item.status === "Pending"
                        ? "bg-yellow-500/15 text-yellow-600"
                        : "bg-secondary/15 text-secondary"
                    }
                  `}
                >
                  {item.status}
                </span>

              </td>

            </tr>

          ))

        ) : (

          <tr>

            <td
              colSpan={5}
              className="text-center py-10 text-sm text-on-surface-variant"
            >
              No recent activity found
            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>

      </main>

    </>
  );
}




//********************************===================**************************************************//




// import Topbar from "@/components/Topbar";
// import StatCard from "@/components/StatCard";
// import Icon from "@/components/Icon";

// const barData = [40, 60, 55, 80, 70, 90, 95];
// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// const labels = ["1.2k", "2.4k", "2.1k", "3.2k", "2.8k", "3.8k", "4.1k"];

// const trendingCategories = [
//   { icon: "format_quote", bg: "bg-tertiary-container",  text: "text-on-tertiary-container", label: "Inspirational Quotes", sub: "2,431 usages today", rank: "#1", rc: "text-tertiary" },
//   { icon: "favorite",     bg: "bg-secondary-container", text: "text-on-secondary-container", label: "Daily Devotional",     sub: "1,892 usages today", rank: "#2", rc: "text-on-surface-variant" },
//   { icon: "campaign",     bg: "bg-primary-container",   text: "text-on-primary-container",  label: "Business Promotions",  sub: "1,245 usages today", rank: "#3", rc: "text-on-surface-variant" },
//   { icon: "cake",         bg: "bg-surface-container",   text: "text-on-surface-variant",    label: "Birthday Wishes",      sub: "982 usages today",   rank: "#4", rc: "text-on-surface-variant" },
// ];

// const recentActivity = [
//   { init: "AS", name: "Arjun Singh",  action: "New Template Created",  tpl: "Minimalist Morning", date: "2 mins ago",  badge: "Published", bClass: "badge-published" },
//   { init: "MK", name: "Meera K.",     action: "Subscription Upgraded", tpl: "—",                  date: "15 mins ago", badge: "Premium",   bClass: "badge-premium" },
//   { init: "RP", name: "Rahul Prasad", action: "Report Submitted",      tpl: "Sunset Glow v2",     date: "1 hour ago",  badge: "Pending",   bClass: "badge-pending" },
// ];

// export default function Dashboard() {
  
//   return (
//     <>
//       <Topbar placeholder="Search templates, users, or logs…" />
//       <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
//         {/* Header */} 
//         <div className="flex items-end justify-between gap-4">
//           <div>
//             <h2 className="text-[28px] font-extrabold text-on-surface tracking-tight leading-none font-headline">
//               Dashboard Overview
//             </h2>
//             <p className="text-on-surface-variant text-sm mt-1">
//               Welcome back, Admin. Here&apos;s what&apos;s happening today.
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button className="px-5 py-2 bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm font-semibold rounded-full hover:bg-surface-container-high transition-all">
//               Export Report
//             </button>
//             <button className="px-5 py-2 bg-secondary-container text-on-secondary-container text-sm font-semibold rounded-full hover:opacity-90 transition-all flex items-center gap-2">
//               <Icon name="calendar_today" size={16} />
//               Last 30 Days
//             </button>
//           </div>
//         </div>

//         {/* KPIs */}
//         <div className="grid grid-cols-3 gap-6">
//           <StatCard label="Total Users"      value="12,842" delta="+12%" icon="group"    color="primary"   progress="70%" />
//           <StatCard label="Active Templates" value="456"    delta="+4%"  icon="style"    color="secondary" progress="45%" />
//           <StatCard label="Monthly Revenue"  value="$8,240" delta="+28%" icon="payments" color="tertiary"  progress="85%" />
//         </div>

//         {/* Chart + Trending */}
//         <div className="grid grid-cols-3 gap-8">
//           {/* Bar Chart */}
//           <div className="col-span-2 bg-surface-container-low rounded-DEFAULT p-7 flex flex-col">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-lg font-bold text-on-surface font-headline">User Growth</h3>
//                 <p className="text-xs text-on-surface-variant">Daily registrations over the last 7 days</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-primary" />
//                 <span className="text-[10px] font-bold uppercase text-on-surface-variant">New Users</span>
//               </div>
//             </div>
//             <div className="flex items-end gap-3 h-52 px-2 pb-4 border-b border-l border-outline-variant/20">
//               {barData.map((h, i) => (
//                 <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
//                   <span className="text-[10px] font-bold text-on-surface opacity-0 group-hover:opacity-100 transition-opacity">
//                     {labels[i]}
//                   </span>
//                   <div
//                     className={`w-full rounded-t-sm transition-all ${
//                       i === 6 ? "bg-primary" : "bg-primary/20 hover:bg-primary/60"
//                     }`}
//                     style={{ height: `${h}%` }}
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between px-2 mt-3">
//               {days.map((d) => (
//                 <span key={d} className="text-[10px] font-bold text-on-surface-variant uppercase">
//                   {d}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Trending Categories */}
//           <div className="bg-surface-container-lowest rounded-DEFAULT p-6">
//             <h3 className="text-lg font-bold text-on-surface font-headline mb-5">Trending Categories</h3>
//             <div className="space-y-5">
//               {trendingCategories.map((c, i) => (
//                 <div key={i} className="flex items-center gap-3">
//                   <div className={`w-11 h-11 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
//                     <Icon name={c.icon} fill={1} size={20} className={c.text} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-bold text-on-surface truncate">{c.label}</p>
//                     <p className="text-[10px] text-on-surface-variant">{c.sub}</p>
//                   </div>
//                   <span className={`text-xs font-bold ${c.rc}`}>{c.rank}</span>
//                 </div>
//               ))}
//             </div>
//             <button className="w-full mt-6 py-3 text-xs font-bold text-primary bg-primary/5 rounded-DEFAULT hover:bg-primary/10 transition-colors uppercase tracking-widest">
//               View All Analytics
//             </button>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-surface-container-lowest rounded-DEFAULT overflow-hidden border border-outline-variant/10">
//           <div className="px-7 py-5 flex items-center justify-between">
//             <h3 className="text-lg font-bold text-on-surface font-headline">Recent Activity</h3>
//             <div className="flex gap-2">
//               <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
//                 <Icon name="filter_list" size={18} className="text-on-surface-variant" />
//               </button>
//               <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
//                 <Icon name="more_vert" size={18} className="text-on-surface-variant" />
//               </button>
//             </div>
//           </div>
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-surface-container-low/50">
//                 {["User", "Action", "Template", "Date", "Status"].map((h) => (
//                   <th key={h} className="px-7 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {recentActivity.map((r, i) => (
//                 <tr key={i} className="hover:bg-surface-container-low/30 transition-colors border-t border-outline-variant/5">
//                   <td className="px-7 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-on-primary-fixed text-[10px] font-bold flex items-center justify-center">
//                         {r.init}
//                       </div>
//                       <span className="text-sm font-semibold text-on-surface">{r.name}</span>
//                     </div>
//                   </td>
//                   <td className="px-7 py-4 text-sm text-on-surface-variant">{r.action}</td>
//                   <td className="px-7 py-4 text-sm font-medium text-primary">{r.tpl}</td>
//                   <td className="px-7 py-4 text-sm text-on-surface-variant">{r.date}</td>
//                   <td className="px-7 py-4">
//                     <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${r.bClass}`}>
//                       {r.badge}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="px-7 py-4 bg-surface-container-low/20 flex justify-center border-t border-outline-variant/5">
//             <button className="text-xs font-bold text-primary-dim hover:text-primary flex items-center gap-1 uppercase tracking-widest">
//               Show More Activity <Icon name="keyboard_arrow_down" size={18} />
//             </button>
//           </div>
//         </div>
//       </main>

//       {/* FAB */}
//       <button
//         className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50"
//         style={{ background: "linear-gradient(135deg,#a14200,#8d3900)", boxShadow: "0 12px 32px rgba(161,66,0,0.30)" }}
//       >
//         <Icon name="add" fill={1} size={28} className="text-white" />
//       </button>
//     </>
//   );
// }
