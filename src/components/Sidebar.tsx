"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const navItems = [
  { href: "/",              label: "Dashboard",       icon: "dashboard" },
  { href: "/users",         label: "Users",           icon: "group" },
  { href: "/templates",     label: "Templates",       icon: "style" },
  { href: "/categories",    label: "Categories",      icon: "category" },
  { href: "/content",       label: "Content Library", icon: "library_books" },
  { href: "/subscriptions", label: "Subscriptions",   icon: "card_membership" },
  { href: "/settings",      label: "Settings",        icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-surface-container-low z-50">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <Icon name="auto_awesome" fill={1} className="text-primary" size={20} />
        </div>
        <div>
          <p className="text-[17px] font-extrabold text-primary leading-tight font-headline">
            Mera Poster
          </p>
          <p className="text-[9px] uppercase tracking-[0.18em] text-on-surface-variant font-bold opacity-70">
            Admin Console
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all font-headline ${
                active ? "nav-active" : "text-on-surface-variant"
              }`}
              style={{ fontWeight: active ? 700 : 500 }}
            >
              <Icon
                name={n.icon}
                fill={active ? 1 : 0}
                size={20}
                className={active ? "text-primary" : "text-outline"}
              />
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* CTA + Profile */}
      <div className="px-4 pb-6 pt-4">
        <button
          className="w-full py-3 px-4 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg,#a14200,#8d3900)",
            boxShadow: "0 8px 24px rgba(161,66,0,0.22)",
          }}
        >
          <Icon name="add" size={18} className="text-white" />
          Create New Poster
        </button>
        <div className="mt-4 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container shrink-0">
            AU
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-on-surface truncate">Admin Profile</p>
            <p className="text-[10px] text-on-surface-variant">admin@meraposter.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
