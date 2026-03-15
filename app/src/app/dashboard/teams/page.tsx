"use client";

import {
  Plus,
  ArrowRight,
  Users,
  GitPullRequest,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingDown,
} from "lucide-react";

const teams = [
  {
    name: "Backend Team",
    status: "ACTIVE",
    statusColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    borderColor: "border-l-blue-500",
    members: 5,
    initials: ["SC", "JU", "MK", "RF", "+1"],
    prsWeekly: 23,
    issuesClosed: 15,
    blockers: 2,
    blockersColor: "text-amber-400",
    trend: "up" as const,
  },
  {
    name: "Frontend Team",
    status: "ON TRACK",
    statusColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    borderColor: "border-l-emerald-500",
    members: 4,
    initials: ["AL", "BP", "CW", "DR"],
    prsWeekly: 18,
    issuesClosed: 12,
    blockers: 1,
    blockersColor: "text-amber-400",
    trend: "up" as const,
  },
  {
    name: "Mobile Team",
    status: "AT RISK",
    statusColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    borderColor: "border-l-orange-500",
    members: 3,
    initials: ["EF", "GH", "IJ"],
    prsWeekly: 8,
    issuesClosed: 6,
    blockers: 3,
    blockersColor: "text-rose-400",
    trend: "down" as const,
  },
];

const healthMetrics = [
  { team: "Backend Team", level: "Elite", color: "text-blue-400", dot: "bg-blue-500" },
  { team: "Frontend Team", level: "Strong", color: "text-emerald-400", dot: "bg-emerald-500" },
  { team: "Mobile Team", level: "Degrading", color: "text-rose-400", dot: "bg-orange-500" },
];

export default function TeamsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Teams
          </h2>
          <p className="text-slate-400 mt-1">
            Manage engineering performance and team health.
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Team
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left: Team cards */}
        <div className="flex-1 space-y-4">
          {teams.map((team, i) => (
            <div
              key={team.name}
              className={`glass-card p-6 border-l-4 ${team.borderColor} animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{team.name}</h3>
                  <span
                    className={`status-badge border ${team.statusColor}`}
                  >
                    {team.status}
                  </span>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-1 h-8">
                  {[40, 60, 45, 70, 55].map((h, j) => (
                    <div
                      key={j}
                      className={`w-2 rounded-sm ${
                        team.trend === "down" && j >= 3
                          ? "bg-orange-500/60"
                          : team.borderColor.replace("border-l-", "bg-") || "bg-blue-500/60"
                      }`}
                      style={{
                        height: `${
                          team.trend === "down" ? h * (1 - j * 0.08) : h
                        }%`,
                      }}
                    />
                  ))}
                  <span className="text-[9px] text-slate-500 ml-1 uppercase tracking-wider">
                    {team.trend === "down" ? "Declining" : "Activity"} Trend
                  </span>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {team.initials.map((init, j) => (
                    <div
                      key={j}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-[var(--color-bg-card)] flex items-center justify-center text-[8px] font-bold text-white"
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-slate-500 ml-2">
                  {team.members} members
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)]">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
                    PRs Weekly
                  </p>
                  <p className="text-xl font-black text-white">{team.prsWeekly}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)]">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
                    Issues Closed
                  </p>
                  <p className="text-xl font-black text-white">{team.issuesClosed}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)]">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
                    Blockers
                  </p>
                  <p className={`text-xl font-black ${team.blockersColor}`}>
                    {team.blockers}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                  View Details
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Health overview */}
        <div className="w-80 flex-shrink-0 space-y-4">
          {/* Team Health Overview */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-4">
              Team Health Overview
            </h3>
            {/* Radar chart placeholder */}
            <div className="w-full aspect-square rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)] flex items-center justify-center mb-4 relative overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-full h-full p-4">
                {/* Pentagon grid */}
                {[80, 60, 40, 20].map((r, i) => (
                  <polygon
                    key={i}
                    points={[0, 1, 2, 3, 4]
                      .map((j) => {
                        const angle = (Math.PI * 2 * j) / 5 - Math.PI / 2;
                        return `${100 + r * Math.cos(angle)},${
                          100 + r * Math.sin(angle)
                        }`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="rgba(164,19,236,0.1)"
                    strokeWidth="1"
                  />
                ))}
                {/* Axis labels */}
                {["Velocity", "PR Throughput", "Review Speed", "Issue Completion", "Deploy Freq"].map(
                  (label, j) => {
                    const angle = (Math.PI * 2 * j) / 5 - Math.PI / 2;
                    const x = 100 + 95 * Math.cos(angle);
                    const y = 100 + 95 * Math.sin(angle);
                    return (
                      <text
                        key={j}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#64748b"
                        fontSize="7"
                        fontWeight="600"
                      >
                        {label}
                      </text>
                    );
                  }
                )}
                {/* Backend team */}
                <polygon
                  points={[70, 65, 55, 60, 50]
                    .map((v, j) => {
                      const angle = (Math.PI * 2 * j) / 5 - Math.PI / 2;
                      return `${100 + v * Math.cos(angle)},${
                        100 + v * Math.sin(angle)
                      }`;
                    })
                    .join(" ")}
                  fill="rgba(96,165,250,0.15)"
                  stroke="rgba(96,165,250,0.6)"
                  strokeWidth="1.5"
                />
                {/* Mobile team */}
                <polygon
                  points={[30, 25, 35, 20, 25]
                    .map((v, j) => {
                      const angle = (Math.PI * 2 * j) / 5 - Math.PI / 2;
                      return `${100 + v * Math.cos(angle)},${
                        100 + v * Math.sin(angle)
                      }`;
                    })
                    .join(" ")}
                  fill="rgba(251,146,60,0.15)"
                  stroke="rgba(251,146,60,0.6)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {healthMetrics.map((m) => (
                <div key={m.team} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
                    <span className="text-xs text-slate-400">{m.team}</span>
                  </div>
                  <span className={`text-xs font-bold ${m.color}`}>
                    {m.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Insight */}
          <div className="glass-card p-5 border-l-4 border-l-[var(--color-primary)]">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">
                Smart Insight
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              The Mobile team shows a{" "}
              <span className="text-rose-400 font-bold">35% drop</span> in
              throughput. Technical debt in the Swift repository might be
              causing the slowdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
