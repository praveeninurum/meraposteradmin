"use client";

import { useRouter, usePathname } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import Icon from "@/components/Icon";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
const pathname = usePathname();
  const menu = [
    { name: "Dashboard", icon: "dashboard", path: "/" },
    { name: "Users", icon: "group", path: "/users" },
    { name: "Categories", icon: "category", path: "/categories" },
    { name: "Content", icon: "dashboard_customize", path: "/content" },
    { name: "Templates", icon: "style", path: "/templates" },
    { name: "Subscriptions", icon: "payments", path: "/subscriptions" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ];

  return (
    <AdminGuard>
      <div className="h-screen bg-surface flex text-on-surface overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-72 bg-surface-container-low border-r border-outline-variant/10 flex flex-col h-full">

          <div className="p-6 border-b border-outline-variant/10">
            <h1
              className="text-xl font-extrabold text-on-surface cursor-pointer hover:text-primary transition-colors"
              onClick={() => router.push("/")}
            >
              Mera Poster
            </h1>
            <p
              className="text-xs text-on-surface-variant mt-1 cursor-pointer hover:text-primary transition-colors"
              onClick={() => router.push("/")}
            >
              Admin Panel
            </p>
          </div>

      <nav className="flex-1 p-4 space-y-2">
  {menu.map((item) => {
    const active = pathname === item.path;

    return (
      <button
        key={item.path}
        onClick={() => router.push(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-DEFAULT text-sm font-medium transition-all
          ${
            active
              ? "bg-primary text-white"
              : "hover:bg-surface-container-high text-on-surface-variant"
          }`}
      >
        <Icon name={item.icon} size={20} />
        {item.name}
      </button>
    );
  })}
</nav>

        </aside>

        {/* MAIN */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-surface-container-low border-b border-outline-variant/10 flex items-center px-6 shrink-0">
            <h2 className="font-bold">Admin Dashboard</h2>
          </header>

          <main className="flex-1 overflow-y-auto bg-surface">
            {children}
          </main>
        </div>

      </div>
    </AdminGuard>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Icon from "@/components/Icon";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [loading, setLoading] = useState(true);
//   const [allowed, setAllowed] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");

//     if (!token) {
//       router.replace("/login");
//       setAllowed(false);
//     } else {
//       setAllowed(true);
//     }

//     setLoading(false);
//   }, []);

//   // 🔒 BLOCK EVERYTHING BEFORE AUTH CHECK
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-surface">
//         <p className="text-on-surface-variant text-sm">
//           Checking authentication...
//         </p>
//       </div>
//     );
//   }

//   // 🔒 HARD BLOCK (IMPORTANT)
//   if (!allowed) {
//     return null;
//   }

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("admin");
//     router.replace("/login");
//   };

//   const menu = [
//     { name: "Dashboard", icon: "dashboard", path: "/" },
//     { name: "Users", icon: "group", path: "/users" },
//     { name: "Categories", icon: "category", path: "/categories" },
//     { name: "Content", icon: "dashboard_customize", path: "/content" },
//     { name: "Templates", icon: "style", path: "/templates" },
//     { name: "Subscriptions", icon: "payments", path: "/subscriptions" },
//     { name: "Settings", icon: "settings", path: "/settings" },
//   ];

//   return (
//     <div className="min-h-screen bg-surface flex text-on-surface">

//       {/* SIDEBAR */}
//       <aside className="w-72 bg-surface-container-low border-r border-outline-variant/10 flex flex-col">

//         <div className="p-6 border-b border-outline-variant/10">
//           <h1 className="text-xl font-extrabold text-on-surface">
//             Mera Poster
//           </h1>
//           <p className="text-xs text-on-surface-variant mt-1">
//             Admin Panel
//           </p>
//         </div>

//         <nav className="flex-1 p-4 space-y-2">
//           {menu.map((item) => {
//             const active = pathname === item.path;

//             return (
//               <button
//                 key={item.path}
//                 onClick={() => router.push(item.path)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-DEFAULT transition-all text-sm font-medium
//                   ${
//                     active
//                       ? "bg-primary text-white"
//                       : "text-on-surface-variant hover:bg-surface-container-high"
//                   }`}
//               >
//                 <Icon name={item.icon} size={20} />
//                 {item.name}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-outline-variant/10">
//           <button
//             onClick={logout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-DEFAULT text-sm font-semibold bg-error-container text-on-error-container hover:opacity-90"
//           >
//             <Icon name="logout" size={20} />
//             Logout
//           </button>
//         </div>

//       </aside>

//       {/* MAIN */}
//       <div className="flex-1 flex flex-col">

//         <header className="h-16 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-6">
//           <h2 className="font-bold text-on-surface">
//             Admin Dashboard
//           </h2>
//         </header>

//         <main className="flex-1 p-6 bg-surface">
//           {children}
//         </main>

//       </div>

//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Icon from "@/components/Icon";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");

//     if (!token) {
//       router.replace("/login");
//     } else {
//       setAuthorized(true);
//     }

//     setLoading(false);
//   }, [router]);

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("admin");
//     router.replace("/login");
//   };

//   const menu = [
//     { name: "Dashboard", icon: "dashboard", path: "/" },
//     { name: "Users", icon: "group", path: "/users" },
//     { name: "Categories", icon: "category", path: "/categories" },
//     { name: "Content", icon: "dashboard_customize", path: "/content" },
//     { name: "Templates", icon: "style", path: "/templates" },
//     { name: "Subscriptions", icon: "payments", path: "/subscriptions" },
//     { name: "Settings", icon: "settings", path: "/settings" },
//   ];

//   // 🔒 BLOCK UI UNTIL AUTH CHECK COMPLETE
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-surface">
//         <p className="text-on-surface-variant text-sm">
//           Checking authentication...
//         </p>
//       </div>
//     );
//   }

//   // 🔒 NOT AUTHORIZED
//   if (!authorized) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-surface flex text-on-surface">

//       {/* SIDEBAR */}
//       <aside className="w-72 bg-surface-container-low border-r border-outline-variant/10 flex flex-col">

//         {/* Logo */}
//         <div className="p-6 border-b border-outline-variant/10">
//           <h1 className="text-xl font-extrabold text-on-surface">
//             Mera Poster
//           </h1>
//           <p className="text-xs text-on-surface-variant mt-1">
//             Admin Panel
//           </p>
//         </div>

//         {/* Menu */}
//         <nav className="flex-1 p-4 space-y-2">
//           {menu.map((item) => {
//             const active = pathname === item.path;

//             return (
//               <button
//                 key={item.path}
//                 onClick={() => router.push(item.path)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-DEFAULT transition-all text-sm font-medium
//                   ${
//                     active
//                       ? "bg-primary text-white"
//                       : "text-on-surface-variant hover:bg-surface-container-high"
//                   }`}
//               >
//                 <Icon name={item.icon} size={20} />
//                 {item.name}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-outline-variant/10">
//           <button
//             onClick={logout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-DEFAULT text-sm font-semibold bg-error-container text-on-error-container hover:opacity-90"
//           >
//             <Icon name="logout" size={20} />
//             Logout
//           </button>
//         </div>

//       </aside>

//       {/* MAIN */}
//       <div className="flex-1 flex flex-col">

//         {/* TOPBAR */}
//         <header className="h-16 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-6">

//           <h2 className="font-bold text-on-surface">
//             Admin Dashboard
//           </h2>

//           <div className="flex items-center gap-3">

//             <div className="text-xs text-on-surface-variant">
//               Welcome Admin
//             </div>

//             <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
//               <Icon name="person" size={18} />
//             </div>

//           </div>

//         </header>

//         {/* CONTENT */}
//         <main className="flex-1 p-6 bg-surface">
//           {children}
//         </main>

//       </div>

//     </div>
//   );
// }






/*=================================*/

// "use client";

// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Icon from "@/components/Icon";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");

//     if (!token) {
//       router.replace("/login");
//     }
//   }, [router]);

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("admin");
//     router.replace("/login");
//   };

//   const menu = [
//     { name: "Dashboard", icon: "dashboard", path: "/" },
//     { name: "Users", icon: "group", path: "/users" },
//     { name: "Categories", icon: "category", path: "/categories" },
//     { name: "Content", icon: "dashboard_customize", path: "/content" },
//     { name: "Templates", icon: "style", path: "/templates" },
//     { name: "Subscriptions", icon: "payments", path: "/subscriptions" },
//     { name: "Settings", icon: "settings", path: "/settings" },
//   ];

//   return (
//     <div className="min-h-screen bg-surface flex text-on-surface">

//       {/* SIDEBAR */}
//       <aside className="w-72 bg-surface-container-low border-r border-outline-variant/10 flex flex-col">

//         {/* Logo */}
//         <div className="p-6 border-b border-outline-variant/10">
//           <h1 className="text-xl font-extrabold text-on-surface">
//             Mera Poster
//           </h1>
//           <p className="text-xs text-on-surface-variant mt-1">
//             Admin Panel
//           </p>
//         </div>

//         {/* Menu */}
//         <nav className="flex-1 p-4 space-y-2">
//           {menu.map((item) => {
//             const active = pathname === item.path;

//             return (
//               <button
//                 key={item.path}
//                 onClick={() => router.push(item.path)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-DEFAULT transition-all text-sm font-medium
//                   ${
//                     active
//                       ? "bg-primary text-white"
//                       : "text-on-surface-variant hover:bg-surface-container-high"
//                   }`}
//               >
//                 <Icon name={item.icon} size={20} />
//                 {item.name}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-outline-variant/10">
//           <button
//             onClick={logout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-DEFAULT text-sm font-semibold bg-error-container text-on-error-container hover:opacity-90"
//           >
//             <Icon name="logout" size={20} />
//             Logout
//           </button>
//         </div>

//       </aside>

//       {/* MAIN AREA */}
//       <div className="flex-1 flex flex-col">

//         {/* TOPBAR */}
//         <header className="h-16 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-6">

//           <h2 className="font-bold text-on-surface">
//             Admin Dashboard
//           </h2>

//           <div className="flex items-center gap-3">

//             <div className="text-xs text-on-surface-variant">
//               Welcome Admin
//             </div>

//             <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
//               <Icon
//                 name="person"
//                 size={18}
//                 className="text-on-primary-container"
//               />
//             </div>

//           </div>

//         </header>

//         {/* CONTENT */}
//         <main className="flex-1 p-6 bg-surface">
//           {children}
//         </main>

//       </div>

//     </div>
//   );
// }