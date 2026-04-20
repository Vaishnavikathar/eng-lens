"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  Activity,
  FileBarChart,
  Users,
  Settings,
  Eye,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Calendar,
  Check,
  GitPullRequest,
  AlertTriangle,
  Rocket,
  MessageSquare,
  CheckCircle,
  CircleDot,
} from "lucide-react";
import { UserProvider, type UserInfo } from "@/lib/user-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/activity", label: "Activity Feed", icon: Activity },
  { href: "/dashboard/reports", label: "Reports", icon: FileBarChart },
  { href: "/dashboard/teams", label: "Teams", icon: Users },
];

const systemItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const teamOptions = [
  "Engineering Team",
  "Backend Team",
  "Frontend Team",
  "Mobile Team",
  "All Teams",
];

interface Notification {
  id: string;
  type: "pr" | "blocker" | "deploy" | "mention" | "report";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "pr",
    title: "PR #248 approved",
    description: "Jamie Smith's authentication middleware PR was approved by 2 reviewers",
    time: "5 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "blocker",
    title: "New blocker flagged",
    description: "Mobile team: API update dependency is blocking 3 tasks",
    time: "23 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "deploy",
    title: "Production deploy succeeded",
    description: "v2.4.1 deployed to production via GitHub Actions",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n4",
    type: "mention",
    title: "You were mentioned",
    description: "Sarah Chen mentioned you in PR #245 review comment",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "n5",
    type: "report",
    title: "Daily report ready",
    description: "Your Backend Team daily report has been generated",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "n6",
    type: "pr",
    title: "PR #245 merged",
    description: "Payment validation layer merged into main by Sarah Chen",
    time: "5 hours ago",
    read: true,
  },
];

const notifIconMap = {
  pr: { icon: GitPullRequest, color: "bg-blue-500/10 text-blue-400 border-blue-500/15" },
  blocker: { icon: AlertTriangle, color: "bg-rose-500/10 text-rose-400 border-rose-500/15" },
  deploy: { icon: Rocket, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" },
  mention: { icon: MessageSquare, color: "bg-purple-500/10 text-purple-400 border-purple-500/15" },
  report: { icon: CheckCircle, color: "bg-amber-500/10 text-amber-400 border-amber-500/15" },
};

const dateRangeOptions = [
  { label: "Today", getValue: () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
  { label: "Last 7 days", getValue: () => { const d = new Date(); d.setDate(d.getDate() - 7); return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`; }},
  { label: "Last 30 days", getValue: () => { const d = new Date(); d.setDate(d.getDate() - 30); return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`; }},
  { label: "This Sprint", getValue: () => "Current Sprint" },
  { label: "This Quarter", getValue: () => `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}` },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("Engineering Team");
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
  const [selectedDateLabel, setSelectedDateLabel] = useState("Last 7 days");
  const [dateDisplay, setDateDisplay] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  });
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const teamRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (teamRef.current && !teamRef.current.contains(e.target as Node)) setTeamDropdownOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    const segment = pathname.split("/").pop();
    if (!segment) return "Dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 inset-y-0 left-0 w-[240px] flex-shrink-0 bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] flex flex-col transform transition-transform duration-200 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/15">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none tracking-tight">
                EngLens
              </h1>
              <p className="text-[9px] text-[var(--color-primary)] font-semibold tracking-wide mt-0.5">
                ENGINEERING INTELLIGENCE
              </p>
            </div>
          </div>
          <button
            className="lg:hidden p-1 text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-1 space-y-0.5">
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
                onClick={() => setSidebarOpen(false)}
                className={`nav-link ${isActive || isDashboard ? "active" : ""}`}
              >
                <item.icon className="w-[16px] h-[16px]" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
            <p className="px-3 mb-2 text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.12em]">
              System
            </p>
            {systemItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <item.icon className="w-[16px] h-[16px]" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User profile + Sign out */}
        <div className="px-4 py-3 border-t border-[var(--color-border)] space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-[var(--color-primary)]/20">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user?.name || "Loading..."}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] capitalize leading-tight">
                {user?.role || "User"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-muted)] hover:text-rose-400 hover:bg-rose-500/8 border border-transparent hover:border-rose-500/15 transition-all duration-200 disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Top header */}
        <header className="relative z-30 h-12 flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-dark)]/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              {/* Team Selector Dropdown */}
              <div ref={teamRef} className="relative">
                <button
                  className="btn-ghost text-xs"
                  onClick={() => { setTeamDropdownOpen(!teamDropdownOpen); setDateDropdownOpen(false); }}
                >
                  <Users className="w-3.5 h-3.5" />
                  {selectedTeam}
                  <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${teamDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {teamDropdownOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-48 py-1.5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-2xl shadow-black/50 z-[9999] animate-fade-in-up" style={{ animationDuration: "0.15s" }}>
                    {teamOptions.map((team) => (
                      <button
                        key={team}
                        onClick={() => { setSelectedTeam(team); setTeamDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                          selectedTeam === team
                            ? "text-[var(--color-primary)] bg-[var(--color-primary)]/[0.06]"
                            : "text-[var(--color-text-secondary)] hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {team}
                        {selectedTeam === team && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Range Dropdown */}
              <div ref={dateRef} className="relative">
                <button
                  className="btn-ghost text-xs"
                  onClick={() => { setDateDropdownOpen(!dateDropdownOpen); setTeamDropdownOpen(false); }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {dateDisplay}
                  <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${dateDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {dateDropdownOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 w-52 py-1.5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-2xl shadow-black/50 z-[9999] animate-fade-in-up" style={{ animationDuration: "0.15s" }}>
                    {dateRangeOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => { setSelectedDateLabel(opt.label); setDateDisplay(opt.getValue()); setDateDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                          selectedDateLabel === opt.label
                            ? "text-[var(--color-primary)] bg-[var(--color-primary)]/[0.06]"
                            : "text-[var(--color-text-secondary)] hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {opt.label}
                        {selectedDateLabel === opt.label && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="sm:hidden text-sm font-semibold text-white">
              {getPageTitle()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Notification Bell Dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setTeamDropdownOpen(false); setDateDropdownOpen(false); }}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold ring-2 ring-[var(--color-bg-dark)]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-[360px] rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-2xl shadow-black/50 z-[9999] animate-fade-in-up overflow-hidden" style={{ animationDuration: "0.15s" }}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors uppercase tracking-wider"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[380px] overflow-y-auto">
                    {notifications.map((notif) => {
                      const { icon: NotifIcon, color } = notifIconMap[notif.type];
                      return (
                        <button
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.03] ${
                            !notif.read ? "bg-[var(--color-primary)]/[0.03]" : ""
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg border ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <NotifIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-xs font-semibold truncate ${
                                notif.read ? "text-[var(--color-text-secondary)]" : "text-white"
                              }`}>
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <CircleDot className="w-2 h-2 text-[var(--color-primary)] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 leading-snug line-clamp-2">
                              {notif.description}
                            </p>
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-1 opacity-60">
                              {notif.time}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t border-[var(--color-border)] bg-white/[0.01]">
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="w-full text-center text-[11px] font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="relative z-10 flex-1 overflow-y-auto p-4 lg:p-6">
          <UserProvider user={user}>{children}</UserProvider>
        </main>
      </div>
    </div>
  );
}
