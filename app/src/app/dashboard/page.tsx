"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user-context";
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
  GitPullRequest,
  Bug,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Download,
  Loader2,
} from "lucide-react";

const metrics = [
  {
    label: "PRs Merged",
    value: "12",
    change: "+3",
    trend: "up" as const,
    icon: GitPullRequest,
    color: "text-emerald-400",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/15",
  },
  {
    label: "Issues Closed",
    value: "8",
    change: "+2",
    trend: "up" as const,
    icon: Bug,
    color: "text-blue-400",
    bg: "bg-blue-500/8",
    border: "border-blue-500/15",
  },
  {
    label: "Active Blockers",
    value: "2",
    change: "-1",
    trend: "down" as const,
    icon: AlertCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/8",
    border: "border-rose-500/15",
  },
  {
    label: "Deploy Freq",
    value: "4.2",
    change: "+0.8",
    trend: "up" as const,
    icon: Rocket,
    color: "text-purple-400",
    bg: "bg-purple-500/8",
    border: "border-purple-500/15",
  },
];

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
    priority: "High",
  },
  {
    title: "Mobile team waiting for API update",
    assignee: "Alex K.",
    initials: "AK",
    priority: "Medium",
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
        PR #892 Merged into <code className="text-[var(--color-primary)] font-mono text-xs bg-[var(--color-primary)]/8 px-1 py-0.5 rounded">main</code>
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
        Issue <span className="text-blue-400 font-mono">#EL-204</span> Completed
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function generateReportCSV(): string {
  const lines: string[] = [];
  lines.push("EngLens Engineering Summary Report");
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push("");

  lines.push("QUICK METRICS");
  lines.push("Metric,Value,Change");
  metrics.forEach((m) => lines.push(`${m.label},${m.value},${m.change}`));
  lines.push("");

  lines.push("SPRINT PROGRESS");
  lines.push(`PRs Merged,${progressData.prsMerged}`);
  lines.push(`Issues Completed,${progressData.issuesCompleted}`);
  lines.push(`Feature: ${progressData.feature.name},${progressData.feature.progress}%`);
  lines.push("");

  lines.push("BLOCKERS");
  lines.push("Title,Assignee,Priority");
  blockers.forEach((b) => lines.push(`"${b.title}",${b.assignee},${b.priority}`));
  lines.push("");

  lines.push("RISKS");
  lines.push("Title,Severity,Probability");
  risks.forEach((r) => lines.push(`"${r.title}",${r.severity},${r.probability}%`));
  lines.push("");

  lines.push("TEAM ACTIVITY");
  lines.push("Team,Level,Activity %");
  teamActivity.forEach((t) => lines.push(`${t.name},${t.level},${t.percent}%`));

  return lines.join("\n");
}

export default function DashboardPage() {
  const user = useUser();
  const [showReportModal, setShowReportModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const reportRef = useRef<HTMLDivElement | null>(null);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const greeting = getGreeting();

useEffect(() => {
  if (reportReady && reportRef.current) {
    reportRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}, [reportReady]);

const handleGenerateReport = async () => {
  setShowReportModal(true);
  setGenerating(true);
  setReportReady(false);

  try {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "daily",
        summary: "AI generated summary: Team is performing well with minor blockers.",
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate report");
    }

    const data = await res.json();

    console.log("Report created:", data);

    setGenerating(false);
    setReportReady(true);
  } catch (error) {
    console.error(error);
    setGenerating(false);
  }
};

  const handleDownloadReport = () => {
    const csv = generateReportCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `englens-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {greeting}, {user?.name ?? firstName}
          </h2>
          <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">
            Engineering Dashboard Overview
          </p>
        </div>
        <button className="btn-primary" onClick={handleGenerateReport}>
          <Sparkles className="w-3.5 h-3.5" />
          Generate Report
        </button>
      </div>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric, i) => (
          <div
            key={metric.label}
            className={`metric-card flex items-center gap-3 animate-fade-in-up`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`w-9 h-9 rounded-lg ${metric.bg} border ${metric.border} flex items-center justify-center flex-shrink-0`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-white leading-none">{metric.value}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 truncate">{metric.label}</p>
            </div>
            <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${metric.trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
              {metric.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {metric.change}
            </span>
          </div>
        ))}
      </div>

      {/* 2x2 Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Progress Card */}
        <div className="glass-card p-5 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="glow-blob w-32 h-32 bg-emerald-500 -top-10 -right-10 animate-pulse-glow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Sprint Progress
              </h3>
              <span className="status-badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  <span className="text-white font-semibold">{progressData.prsMerged}</span> PRs merged this week
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  <span className="text-white font-semibold">{progressData.issuesCompleted}</span> issues completed
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--color-border)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {progressData.feature.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {progressData.feature.progress}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill bg-gradient-to-r from-emerald-600 to-emerald-400"
                    style={{ width: `${progressData.feature.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blockers Card */}
        <div className="glass-card p-5 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="glow-blob w-32 h-32 bg-rose-500 -top-10 -right-10 animate-pulse-glow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Blockers
              </h3>
              <span className="status-badge bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {blockers.length} Active
              </span>
            </div>
            <div className="space-y-2.5">
              {blockers.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/4 border border-rose-500/8 hover:border-rose-500/15 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white leading-snug">{b.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-[7px] text-white font-bold">
                        {b.initials}
                      </div>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {b.assignee}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risks Card */}
        <div className="glass-card p-5 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="glow-blob w-32 h-32 bg-amber-500 -top-10 -right-10 animate-pulse-glow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Risks
              </h3>
            </div>
            <div className="space-y-4">
              {risks.map((r, i) => (
                <div key={i}>
                  <p className="text-sm font-medium mb-3">{r.title}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                        style={{ width: `${r.probability}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-rose-400 tracking-wider">
                      {r.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
                    {r.description}
                  </p>
                </div>
              ))}
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-slate-300">
                  PR #342 waiting for review for 3 days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Activity Card */}
        <div className="glass-card p-5 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <div className="glow-blob w-32 h-32 bg-blue-500 -top-10 -right-10 animate-pulse-glow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Team Activity
              </h3>
            </div>
            <div className="space-y-4 py-1">
              {teamActivity.map((team) => (
                <div key={team.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-text-secondary)]">{team.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        team.level === "HIGH"
                          ? "text-blue-400"
                          : team.level === "LOW"
                          ? "text-[var(--color-text-muted)]"
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
      <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />
            Recent Activity
          </h3>
          <Link href="/dashboard/activity" className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors">
            View All →
          </Link>
        </div>
        <div className="p-5">
          <div className="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-[var(--color-primary)]/30 before:to-transparent">
            {timeline.map((item, i) => (
              <div key={i} className="relative group">
                <div
                  className={`absolute -left-[21px] top-0.5 w-5 h-5 rounded-full ${item.color} flex items-center justify-center text-white ring-[3px] ring-[var(--color-bg-card)] group-hover:ring-[var(--color-bg-card-hover)] transition-all`}
                >
                  <item.icon className="w-2.5 h-2.5" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold tracking-wider">
                      {item.time}
                    </span>
                    <button className="text-[10px] text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-semibold uppercase tracking-wider transition-colors opacity-0 group-hover:opacity-100">
                      {item.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                Generate Report
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--color-text-muted)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {generating ? (
              <div className="flex flex-col items-center py-10 gap-4">
                <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-medium text-white">Generating report…</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Analyzing team metrics and activity
                  </p>
                </div>
              </div>
            ) : reportReady ? (
              <div className="space-y-4">
                <div ref={reportRef} className="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <p className="text-sm font-semibold text-emerald-400">Report Ready</p>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Engineering summary report has been generated with metrics from PRs merged, issues closed,
                    active blockers, team activity, risks, and deployment frequency.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white/[0.02]">
                    <span className="text-[var(--color-text-muted)]">PRs Merged</span>
                    <span className="text-white font-semibold">{progressData.prsMerged}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white/[0.02]">
                    <span className="text-[var(--color-text-muted)]">Issues Completed</span>
                    <span className="text-white font-semibold">{progressData.issuesCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white/[0.02]">
                    <span className="text-[var(--color-text-muted)]">Active Blockers</span>
                    <span className="text-rose-400 font-semibold">{blockers.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadReport}
                  className="btn-primary w-full justify-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV Report
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
