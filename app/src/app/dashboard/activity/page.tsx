"use client";

import { useState } from "react";
import {
  Search,
  GitPullRequest,
  GitCommit,
  Bug,
  Rocket,
  MoreVertical,
  Download,
  Filter,
  Calendar,
  CheckCircle,
} from "lucide-react";

type Source = "all" | "github" | "jira" | "slack" | "cicd";
type Category = "all" | "prs" | "commits" | "issues" | "deployments";

const sourceColors: Record<string, string> = {
  github: "bg-emerald-600",
  jira: "bg-blue-600",
  cicd: "bg-purple-600",
  slack: "bg-pink-600",
};

const sourceIconColors: Record<string, string> = {
  github: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
  jira: "bg-blue-500/10 text-blue-400 border-blue-500/15",
  cicd: "bg-purple-500/10 text-purple-400 border-purple-500/15",
  slack: "bg-pink-500/10 text-pink-400 border-pink-500/15",
};

const statusStyles: Record<string, string> = {
  MERGED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "IN REVIEW": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  BLOCKED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  SUCCESS: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  COMMITTED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const iconMap: Record<string, typeof GitPullRequest> = {
  pr: GitPullRequest,
  commit: GitCommit,
  issue: Bug,
  deploy: Rocket,
};

const activities = [
  {
    source: "github",
    sourceLabel: "GitHub",
    type: "pr",
    title: "PR #245: Add payment validation layer",
    author: "Sarah Chen",
    team: "Backend Team",
    teamColor: "text-[var(--color-primary)]",
    time: "2 hours ago",
    status: "MERGED",
  },
  {
    source: "jira",
    sourceLabel: "Jira",
    type: "issue",
    title: "PROJ-189: Fix login timeout on mobile safari",
    author: "Marcus Aurel",
    team: "Frontend Team",
    teamColor: "text-emerald-400",
    time: "3 hours ago",
    status: "OPEN",
  },
  {
    source: "cicd",
    sourceLabel: "CI/CD",
    type: "deploy",
    title: "Deployment: Production v2.4.1 successful",
    author: "GitHub Actions",
    team: "DevOps",
    teamColor: "text-cyan-400",
    time: "5 hours ago",
    status: "SUCCESS",
  },
  {
    source: "github",
    sourceLabel: "GitHub",
    type: "pr",
    title: "PR #248: Refactor authentication middleware",
    author: "Jamie Smith",
    team: "Backend Team",
    teamColor: "text-[var(--color-primary)]",
    time: "Yesterday",
    status: "IN REVIEW",
  },
  {
    source: "jira",
    sourceLabel: "Jira",
    type: "issue",
    title: "CORE-442: API rate limiting implementation",
    author: "Lena Volkov",
    team: "Platform Team",
    teamColor: "text-orange-400",
    time: "Yesterday",
    status: "BLOCKED",
  },
  {
    source: "github",
    sourceLabel: "GitHub",
    type: "commit",
    title: "Commit: Update readme documentation with new CLI args",
    author: "Alex Rivera",
    team: "Platform Team",
    teamColor: "text-orange-400",
    time: "2 days ago",
    status: "COMMITTED",
  },
  {
    source: "github",
    sourceLabel: "GitHub",
    type: "pr",
    title: "PR #242: Initial infrastructure as code for GCP migration",
    author: "Sarah Chen",
    team: "DevOps",
    teamColor: "text-cyan-400",
    time: "2 days ago",
    status: "MERGED",
  },
  {
    source: "jira",
    sourceLabel: "Jira",
    type: "issue",
    title: "BUG-104: Memory leak in worker processes",
    author: "Marcus Aurel",
    team: "Backend Team",
    teamColor: "text-[var(--color-primary)]",
    time: "3 days ago",
    status: "OPEN",
  },
];

const categories: { key: Category; label: string; icon: typeof GitPullRequest }[] = [
  { key: "all", label: "All", icon: Filter },
  { key: "prs", label: "Pull Requests", icon: GitPullRequest },
  { key: "commits", label: "Commits", icon: GitCommit },
  { key: "issues", label: "Issues", icon: Bug },
  { key: "deployments", label: "Deployments", icon: Rocket },
];

export default function ActivityFeedPage() {
  const [selectedSource, setSelectedSource] = useState<Source>("all");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [exported, setExported] = useState(false);

  const filteredActivities = activities.filter((a) => {
    if (selectedSource !== "all" && a.source !== selectedSource) return false;
    if (selectedCategory !== "all") {
      const catMap: Record<string, string> = {
        prs: "pr",
        commits: "commit",
        issues: "issue",
        deployments: "deploy",
      };
      if (a.type !== catMap[selectedCategory]) return false;
    }
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  const handleExport = () => {
    const lines: string[] = [];
    lines.push("Source,Type,Title,Author,Team,Time,Status");
    filteredActivities.forEach((a) => {
      lines.push(
        `${a.sourceLabel},${a.type},"${a.title}",${a.author},${a.team},${a.time},${a.status}`
      );
    });

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `englens-activity-feed-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          Activity Feed
        </h2>
        <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">
          Track all engineering events across your tools
        </p>
      </div>

      {/* Search + Sources */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search activity, PRs, or issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 pr-4 py-2"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["github", "jira", "slack", "cicd"] as const).map((s) => (
            <button
              key={s}
              onClick={() =>
                setSelectedSource(selectedSource === s ? "all" : s)
              }
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedSource === s
                  ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/30 text-[var(--color-primary)]"
                  : "bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:border-white/10"
              }`}
            >
              {s === "cicd" ? "CI/CD" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === cat.key
                ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/25 text-[var(--color-primary)]"
                : "bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            }`}
          >
            <cat.icon className="w-3 h-3" />
            {cat.label}
          </button>
        ))}
        <div className="flex-1" />
        <button className="btn-ghost text-xs whitespace-nowrap">
          <Calendar className="w-3 h-3" />
          Last 7 days
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-1.5">
        {filteredActivities.length === 0 && (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-[var(--color-border)] flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-sm font-medium text-white mb-1">No activities found</p>
            <p className="text-xs text-[var(--color-text-muted)]">Try adjusting your filters or search query</p>
          </div>
        )}
        {filteredActivities.map((activity, i) => {
          const Icon = iconMap[activity.type] || GitPullRequest;
          return (
            <div
              key={i}
              className="glass-card p-3.5 flex items-center gap-3 animate-fade-in-up group cursor-pointer"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-lg border ${
                  sourceIconColors[activity.source]
                } flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-[var(--color-primary)] transition-colors">
                  {activity.title}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] mt-0.5">
                  <span className="font-medium">{activity.author}</span>
                  <span className="opacity-40">·</span>
                  <span className={activity.teamColor}>{activity.team}</span>
                  <span className="opacity-40">·</span>
                  <span>{activity.time}</span>
                </div>
              </div>

              {/* Status */}
              <span
                className={`status-badge border flex-shrink-0 ${
                  statusStyles[activity.status] || ""
                }`}
              >
                {activity.status}
              </span>

              <button className="p-1 text-[var(--color-text-muted)] hover:text-white transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Export button */}
      <div className="fixed bottom-5 right-5">
        <button
          onClick={handleExport}
          className={`btn-primary shadow-2xl shadow-[var(--color-primary)]/20 transition-all ${
            exported ? "bg-emerald-600 hover:bg-emerald-500" : ""
          }`}
        >
          {exported ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Exported!
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Export
            </>
          )}
        </button>
      </div>
    </div>
  );
}
