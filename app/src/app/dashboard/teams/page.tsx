"use client";

import { useState } from "react";
import {
  Plus,
  ArrowRight,
  GitPullRequest,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  X,
  Users,
  Loader2,
  Clock,
  GitCommit,
  Rocket,
  BarChart3,
} from "lucide-react";

interface TeamData {
  name: string;
  status: string;
  statusColor: string;
  accentColor: string;
  barColor: string;
  members: number;
  initials: string[];
  prsWeekly: number;
  issuesClosed: number;
  blockers: number;
  blockersColor: string;
  trend: "up" | "down";
  trendValue: string;
}

const teamDetails: Record<string, { description: string; lead: string; sprint: string; sprintProgress: number; velocity: number; avgReviewTime: string; deployFreq: string; recentActivity: { icon: string; text: string; time: string }[] }> = {
  "Backend Team": {
    description: "Core API services, database infrastructure, and microservices architecture.",
    lead: "Sarah Chen",
    sprint: "Sprint 14 — Payments API",
    sprintProgress: 72,
    velocity: 38,
    avgReviewTime: "2.4h",
    deployFreq: "4.2/week",
    recentActivity: [
      { icon: "pr", text: "PR #421 merged — Payment webhook handler", time: "2h ago" },
      { icon: "commit", text: "feat: add retry logic for failed transactions", time: "3h ago" },
      { icon: "deploy", text: "v2.14.1 deployed to staging", time: "5h ago" },
      { icon: "issue", text: "Issue #89 closed — DB connection pool leak", time: "8h ago" },
      { icon: "pr", text: "PR #419 merged — Rate limiting middleware", time: "1d ago" },
    ],
  },
  "Frontend Team": {
    description: "Web application UI, design system components, and user experience.",
    lead: "Alex Lee",
    sprint: "Sprint 14 — Dashboard Redesign",
    sprintProgress: 85,
    velocity: 32,
    avgReviewTime: "1.8h",
    deployFreq: "3.5/week",
    recentActivity: [
      { icon: "pr", text: "PR #305 merged — New chart components", time: "1h ago" },
      { icon: "commit", text: "fix: responsive layout on settings page", time: "4h ago" },
      { icon: "deploy", text: "v3.8.0 deployed to production", time: "6h ago" },
      { icon: "issue", text: "Issue #201 closed — Dark mode contrast", time: "1d ago" },
      { icon: "pr", text: "PR #303 merged — Activity feed filters", time: "1d ago" },
    ],
  },
  "Mobile Team": {
    description: "iOS and Android native apps, cross-platform shared libraries.",
    lead: "Emily Fox",
    sprint: "Sprint 14 — Push Notifications",
    sprintProgress: 45,
    velocity: 18,
    avgReviewTime: "4.1h",
    deployFreq: "1.2/week",
    recentActivity: [
      { icon: "pr", text: "PR #112 in review — Push notification service", time: "3h ago" },
      { icon: "issue", text: "Issue #67 opened — Crash on iOS 18 deep link", time: "5h ago" },
      { icon: "commit", text: "refactor: migrate to Swift concurrency", time: "1d ago" },
      { icon: "deploy", text: "v1.9.2-beta deployed to TestFlight", time: "2d ago" },
      { icon: "pr", text: "PR #110 merged — Offline cache layer", time: "2d ago" },
    ],
  },
};

const initialTeams: TeamData[] = [
  {
    name: "Backend Team",
    status: "ACTIVE",
    statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accentColor: "border-l-blue-500",
    barColor: "bg-blue-500",
    members: 5,
    initials: ["SC", "JU", "MK", "RF", "+1"],
    prsWeekly: 23,
    issuesClosed: 15,
    blockers: 2,
    blockersColor: "text-amber-400",
    trend: "up" as const,
    trendValue: "+12%",
  },
  {
    name: "Frontend Team",
    status: "ON TRACK",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    accentColor: "border-l-emerald-500",
    barColor: "bg-emerald-500",
    members: 4,
    initials: ["AL", "BP", "CW", "DR"],
    prsWeekly: 18,
    issuesClosed: 12,
    blockers: 1,
    blockersColor: "text-amber-400",
    trend: "up" as const,
    trendValue: "+5%",
  },
  {
    name: "Mobile Team",
    status: "AT RISK",
    statusColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    accentColor: "border-l-orange-500",
    barColor: "bg-orange-500",
    members: 3,
    initials: ["EF", "GH", "IJ"],
    prsWeekly: 8,
    issuesClosed: 6,
    blockers: 3,
    blockersColor: "text-rose-400",
    trend: "down" as const,
    trendValue: "-35%",
  },
];

const accentOptions = [
  { label: "Blue",    value: "border-l-blue-500",    dot: "bg-blue-500" },
  { label: "Emerald", value: "border-l-emerald-500", dot: "bg-emerald-500" },
  { label: "Purple",  value: "border-l-purple-500",  dot: "bg-purple-500" },
  { label: "Orange",  value: "border-l-orange-500",  dot: "bg-orange-500" },
  { label: "Cyan",    value: "border-l-cyan-500",    dot: "bg-cyan-500" },
  { label: "Rose",    value: "border-l-rose-500",    dot: "bg-rose-500" },
];

const healthMetrics = [
  { team: "Backend Team", level: "Elite", color: "text-blue-400", dot: "bg-blue-500" },
  { team: "Frontend Team", level: "Strong", color: "text-emerald-400", dot: "bg-emerald-500" },
  { team: "Mobile Team", level: "Degrading", color: "text-rose-400", dot: "bg-orange-500" },
];

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "pr": return <GitPullRequest className="w-3 h-3 text-blue-400" />;
    case "commit": return <GitCommit className="w-3 h-3 text-emerald-400" />;
    case "deploy": return <Rocket className="w-3 h-3 text-purple-400" />;
    case "issue": return <AlertCircle className="w-3 h-3 text-amber-400" />;
    default: return <Clock className="w-3 h-3 text-[var(--color-text-muted)]" />;
  }
}

export default function TeamsPage() {
  const [teams, setTeams] = useState(initialTeams);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [creating, setCreating] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamSlug, setTeamSlug] = useState("");
  const [selectedAccent, setSelectedAccent] = useState(accentOptions[2].value);

  const handleCreateTeam = () => {
    if (!teamName.trim()) return;
    setCreating(true);

    setTimeout(() => {
      const accent = accentOptions.find((a) => a.value === selectedAccent) || accentOptions[0];
      const newTeam: TeamData = {
        name: teamName.trim(),
        status: "ACTIVE",
        statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        accentColor: selectedAccent,
        barColor: accent.dot,
        members: 0,
        initials: [] as string[],
        prsWeekly: 0,
        issuesClosed: 0,
        blockers: 0,
        blockersColor: "text-[var(--color-text-muted)]",
        trend: "up" as const,
        trendValue: "NEW",
      };
      setTeams((prev) => [...prev, newTeam]);
      setCreating(false);
      setShowModal(false);
      setTeamName("");
      setTeamSlug("");
      setSelectedAccent(accentOptions[2].value);
    }, 1200);
  };

  const handleViewDetails = (team: TeamData) => {
    setSelectedTeam(team);
  };

  const details = selectedTeam ? teamDetails[selectedTeam.name] : null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Teams
          </h2>
          <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">
            Manage engineering performance and team health
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-3.5 h-3.5" />
          Add Team
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Team cards */}
        <div className="flex-1 space-y-3">
          {teams.map((team, i) => (
            <div
              key={team.name}
              className={`glass-card p-5 border-l-[3px] ${team.accentColor} animate-fade-in-up group cursor-pointer ${
                selectedTeam?.name === team.name ? "ring-1 ring-[var(--color-primary)]/40" : ""
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => handleViewDetails(team)}
            >
              <div className="flex items-start justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-semibold text-white">{team.name}</h3>
                  <span className={`status-badge border ${team.statusColor}`}>
                    {team.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {team.trend === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span className={`text-xs font-semibold ${
                    team.trendValue === "NEW"
                      ? "text-blue-400"
                      : team.trend === "up" ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {team.trendValue}
                  </span>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-1.5">
                  {team.initials.length > 0 ? (
                    team.initials.map((init, j) => (
                      <div
                        key={j}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-[1.5px] border-[var(--color-bg-card)] flex items-center justify-center text-[7px] font-bold text-white"
                      >
                        {init}
                      </div>
                    ))
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/[0.04] border-[1.5px] border-dashed border-[var(--color-border)] flex items-center justify-center">
                      <Plus className="w-3 h-3 text-[var(--color-text-muted)]" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-[var(--color-text-muted)] ml-1">
                  {team.members} member{team.members !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="metric-card">
                  <div className="flex items-center gap-1.5 mb-1">
                    <GitPullRequest className="w-3 h-3 text-[var(--color-text-muted)]" />
                    <p className="section-label text-[var(--color-text-muted)]">PRs</p>
                  </div>
                  <p className="text-lg font-bold text-white">{team.prsWeekly}</p>
                </div>
                <div className="metric-card">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-3 h-3 text-[var(--color-text-muted)]" />
                    <p className="section-label text-[var(--color-text-muted)]">Closed</p>
                  </div>
                  <p className="text-lg font-bold text-white">{team.issuesClosed}</p>
                </div>
                <div className="metric-card">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3 h-3 text-[var(--color-text-muted)]" />
                    <p className="section-label text-[var(--color-text-muted)]">Blocked</p>
                  </div>
                  <p className={`text-lg font-bold ${team.blockersColor}`}>
                    {team.blockers}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  id={`view-details-${team.name.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(team);
                  }}
                  className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] flex items-center gap-1 transition-colors relative z-10"
                >
                  View Details
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Health overview / Team Details */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          {/* Team Detail Panel — shown when a team is selected */}
          {selectedTeam && details && (
            <div className={`glass-card p-5 border-l-[3px] ${selectedTeam.accentColor} animate-fade-in-up`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{selectedTeam.name}</h3>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="p-1 rounded-md hover:bg-white/[0.06] text-[var(--color-text-muted)] hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mb-4 leading-relaxed">
                {details.description}
              </p>

              {/* Meta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--color-text-muted)]">Lead</span>
                  <span className="text-[11px] font-semibold text-white">{details.lead}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--color-text-muted)]">Sprint</span>
                  <span className="text-[11px] font-semibold text-white">{details.sprint}</span>
                </div>
              </div>

              {/* Sprint Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="section-label text-[var(--color-text-muted)]">Sprint Progress</span>
                  <span className="text-[11px] font-bold text-white">{details.sprintProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${selectedTeam.barColor} transition-all duration-700`}
                    style={{ width: `${details.sprintProgress}%` }}
                  />
                </div>
              </div>

              {/* Extra Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <BarChart3 className="w-2.5 h-2.5 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-sm font-bold text-white">{details.velocity}</p>
                  <p className="text-[9px] text-[var(--color-text-muted)]">Velocity</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Clock className="w-2.5 h-2.5 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-sm font-bold text-white">{details.avgReviewTime}</p>
                  <p className="text-[9px] text-[var(--color-text-muted)]">Avg Review</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Rocket className="w-2.5 h-2.5 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-sm font-bold text-white">{details.deployFreq}</p>
                  <p className="text-[9px] text-[var(--color-text-muted)]">Deploys</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <p className="section-label text-[var(--color-text-muted)] mb-2">Recent Activity</p>
                <div className="space-y-2">
                  {details.recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-0.5 w-5 h-5 rounded-md bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                        <ActivityIcon type={item.icon} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug truncate">{item.text}</p>
                        <p className="text-[9px] text-[var(--color-text-muted)]">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Health Overview */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">
              Team Health Overview
            </h3>
            {/* Radar chart */}
            <div className="w-full aspect-square rounded-xl bg-[var(--color-bg-dark)] border border-[var(--color-border)] flex items-center justify-center mb-4 relative overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-full h-full p-4">
                {[80, 60, 40, 20].map((r, i) => (
                  <polygon
                    key={i}
                    points={[0, 1, 2, 3, 4]
                      .map((j) => {
                        const angle = (Math.PI * 2 * j) / 5 - Math.PI / 2;
                        return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                ))}
                {["Velocity", "PR Throughput", "Review Speed", "Completion", "Deploy Freq"].map(
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
                        fill="#475569"
                        fontSize="6.5"
                        fontWeight="600"
                        fontFamily="Inter, sans-serif"
                      >
                        {label}
                      </text>
                    );
                  }
                )}
                <polygon
                  points={[70, 65, 55, 60, 50]
                    .map((v, j) => {
                      const angle = (Math.PI * 2 * j) / 5 - Math.PI / 2;
                      return `${100 + v * Math.cos(angle)},${100 + v * Math.sin(angle)}`;
                    })
                    .join(" ")}
                  fill="rgba(96,165,250,0.1)"
                  stroke="rgba(96,165,250,0.5)"
                  strokeWidth="1.5"
                />
                <polygon
                  points={[30, 25, 35, 20, 25]
                    .map((v, j) => {
                      const angle = (Math.PI * 2 * j) / 5 - Math.PI / 2;
                      return `${100 + v * Math.cos(angle)},${100 + v * Math.sin(angle)}`;
                    })
                    .join(" ")}
                  fill="rgba(251,146,60,0.08)"
                  stroke="rgba(251,146,60,0.5)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {healthMetrics.map((m) => (
                <div key={m.team} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${m.dot}`} />
                    <span className="text-xs text-[var(--color-text-secondary)]">{m.team}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${m.color}`}>{m.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Insight */}
          <div className="glass-card p-4 border-l-[3px] border-l-[var(--color-primary)]">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span className="section-label text-[var(--color-primary)]">
                Smart Insight
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              The Mobile team shows a{" "}
              <span className="text-rose-400 font-semibold">35% drop</span> in
              throughput. Technical debt in the Swift repository might be
              causing the slowdown.
            </p>
          </div>
        </div>
      </div>

      {/* Add Team Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !creating && setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--color-primary)]" />
                Create New Team
              </h3>
              <button
                onClick={() => !creating && setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--color-text-muted)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {creating ? (
              <div className="flex flex-col items-center py-10 gap-4">
                <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-medium text-white">Creating team…</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Setting up workspace and permissions
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Team Name */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value);
                      setTeamSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")
                      );
                    }}
                    placeholder="e.g. DevOps Team"
                    className="input-field"
                    autoFocus
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={teamSlug}
                    onChange={(e) => setTeamSlug(e.target.value)}
                    placeholder="devops-team"
                    className="input-field"
                  />
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    {accentOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedAccent(opt.value)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                          selectedAccent === opt.value
                            ? "border-white/30 scale-110"
                            : "border-[var(--color-border)] hover:border-white/15"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full ${opt.dot}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn-ghost flex-1 justify-center text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTeam}
                    disabled={!teamName.trim()}
                    className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Team
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
