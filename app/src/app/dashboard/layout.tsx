"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  FileBarChart,
  Users,
  Settings,
  Eye,
  Bell,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/activity", label: "Activity Feed", icon: Activity },
  { href: "/dashboard/reports", label: "Reports", icon: FileBarChart },
  { href: "/dashboard/teams", label: "Teams", icon: Users },
];

const systemItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">EngLens</h1>
            <p className="text-[10px] text-[var(--color-primary)] font-medium tracking-wider">
              Engineering Intelligence
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const isDashboard =
              item.href === "/dashboard" && pathname === "/dashboard";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive || isDashboard ? "active" : ""}`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
            <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              System
            </p>
            {systemItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User profile */}
        <div className="px-4 py-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              NS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Navjot Singh</p>
              <p className="text-[10px] text-slate-500">Engineering Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="h-14 flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-dark)]/80 backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button className="btn-ghost text-xs">
              <Users className="w-4 h-4" />
              Engineering Team
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="btn-ghost text-xs">
              <FileBarChart className="w-4 h-4" />
              Mar 15, 2026
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-[rgba(164,19,236,0.08)] text-slate-400 hover:text-[var(--color-primary)] transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
