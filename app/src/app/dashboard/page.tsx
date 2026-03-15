"use client";

import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Clock,
  GitMerge,
  CheckCheck,
  Rocket,
  MessageSquare,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const progressData = {
  prsMerged: 12,
  issuesCompleted: 8,
  feature: { name: "Payments API", progress: 70 },
};

const blockers = [
  {
    title: "Checkout feature waiting for DB migration",
    assignee: "Sarah M.",
    initials: "SM",
  },
  {
    title: "Mobile team waiting for API update",
    assignee: "Alex K.",
    initials: "AK",
  },
];

const risks = [
  {
    title: "Billing integration risk",
    severity: "CRITICAL",
    probability: 85,
    description: "Likely to miss Friday deadline (85% probability)",
  },
];

const teamActivity = [
  { name: "Backend Team", level: "HIGH", percent: 90, color: "bg-blue-500" },
  { name: "Frontend Team", level: "LOW", percent: 25, color: "bg-blue-500/40" },
  { name: "Mobile Team", level: "MEDIUM", percent: 60, color: "bg-blue-500/70" },
];

const timeline = [
  {
    icon: GitMerge,
    color: "bg-emerald-500",
    title: (
      <>
        PR #892 Merged into <span className="text-[var(--color-primary)] font-mono">main</span>
      </>
    ),
    desc: "Core payments engine refactor complete",
    time: "10:42 AM",
    action: "DETAILS",
  },
  {
    icon: CheckCheck,
    color: "bg-blue-500",
    title: (
      <>
        Issue <span className="text-blue-400">#EL-204</span> Completed
      </>
    ),
    desc: "Fix CSS layout bug on dashboard responsiveness",
    time: "09:15 AM",
    action: "DETAILS",
  },
  {
    icon: Rocket,
    color: "bg-purple-500",
    title: "Deployment Succeeded",
    desc: "Staging-2 environment updated to v2.4.0-rc1",
    time: "YESTERDAY",
    action: "LOG",
  },
  {
    icon: MessageSquare,
    color: "bg-amber-500",
    title: "Review Requested on PR #901",
    desc: "Mobile auth provider implementation",
    time: "YESTERDAY",
    action: "REVIEW",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Good morning, Navjot
          </h2>
          <p className="text-slate-400 mt-1 font-medium">
            Saturday, March 15, 2026 • Engineering Dashboard Overview
          </p>
        </div>
        <button className="btn-primary">
          <Sparkles className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* 2x2 Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Card */}
        <div className="glass-card p-6 relative overflow-hidden animate-fade-in-up">
          <div className="glow-blob w-32 h-32 bg-emerald-500 -top-8 -right-8 animate-pulse-glow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Progress
              </h3>
              <span className="status-badge bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Active Sprint
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="text-sm font-medium">
                  {progressData.prsMerged} PRs merged this week
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="text-sm font-medium">
                  {progressData.issuesCompleted} issues completed
                </p>
              </div>
              <div className="pt-2 border-t border-[var(--color-border)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400">
                    {progressData.feature.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-500">
                    {progressData.feature.progress}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill bg-emerald-500"
                    style={{ width: `${progressData.feature.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blockers Card */}
        <div className="glass-card p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="glow-blob w-32 h-32 bg-rose-500 -top-8 -right-8 animate-pulse-glow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                Blockers
              </h3>
              <span className="status-badge bg-rose-500/10 text-rose-500 border border-rose-500/20">
                HIGH PRIORITY
              </span>
            </div>
            <div className="space-y-3">
              {blockers.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10"
                >
                  <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">{b.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-[8px] text-white font-bold">
                        {b.initials}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Assigned to {b.assignee}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risks Card */}
        <div className="glass-card p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="glow-blob w-32 h-32 bg-amber-500 -top-8 -right-8 animate-pulse-glow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Risks
              </h3>
            </div>
            <div className="space-y-4">
              {risks.map((r, i) => (
                <div key={i}>
                  <p className="text-sm font-medium mb-3">{r.title}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                        style={{ width: `${r.probability}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-rose-500">
                      {r.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {r.description}
                  </p>
                </div>
              ))}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <Clock className="w-5 h-5 text-amber-500" />
                <p className="text-xs text-slate-200">
                  PR #342 waiting for review for 3 days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Activity Card */}
        <div className="glass-card p-6 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="glow-blob w-32 h-32 bg-blue-500 -top-8 -right-8 animate-pulse-glow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Team Activity
              </h3>
            </div>
            <div className="space-y-5 py-2">
              {teamActivity.map((team) => (
                <div key={team.name} className="space-y-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{team.name}</span>
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        team.level === "HIGH"
                          ? "text-blue-400"
                          : team.level === "LOW"
                          ? "text-slate-500"
                          : "text-blue-300"
                      }`}
                    >
                      {team.level}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-bar-fill ${team.color}`}
                      style={{ width: `${team.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
            Activity Timeline
          </h3>
          <button className="text-xs font-bold text-[var(--color-primary)] hover:underline">
            View All
          </button>
        </div>
        <div className="p-6">
          <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-primary)]/20">
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <div
                  className={`absolute -left-[29px] top-1 w-6 h-6 rounded-full ${item.color} flex items-center justify-center text-white ring-4 ring-[var(--color-bg-dark)]`}
                >
                  <item.icon className="w-3 h-3" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                      {item.time}
                    </span>
                    <button className="text-[10px] text-[var(--color-primary)] hover:underline font-bold uppercase tracking-widest">
                      {item.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
