"use client";

import { useState } from "react";
import {
  Search,
  GitPullRequest,
  GitCommit,
  Bug,
  Rocket,
  MoreVertical,
  Upload,
} from "lucide-react";

type Source = "all" | "github" | "jira" | "slack" | "cicd";
type Category = "all" | "prs" | "commits" | "issues" | "deployments";

const sourceColors: Record<string, string> = {
  github: "bg-emerald-600",
  jira: "bg-blue-600",
  cicd: "bg-purple-600",
  slack: "bg-pink-600",
};

const statusStyles: Record<string, string> = {
  MERGED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  OPEN: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "IN REVIEW": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  BLOCKED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  SUCCESS: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  COMMITTED: "bg-slate-500/15 text-slate-400 border-slate-500/30",
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
    sourceLabel: "GH",
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
    sourceLabel: "JIRA",
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
    sourceLabel: "CI",
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
    sourceLabel: "GH",
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
    sourceLabel: "JIRA",
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
    sourceLabel: "GH",
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
    sourceLabel: "GH",
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
    sourceLabel: "JIRA",
    type: "issue",
    title: "BUG-104: Memory leak in worker processes",
    author: "Marcus Aurel",
    team: "Backend Team",
    teamColor: "text-[var(--color-primary)]",
    time: "3 days ago",
    status: "OPEN",
  },
];

const categories: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "prs", label: "PRs" },
  { key: "commits", label: "Commits" },
  { key: "issues", label: "Issues" },
  { key: "deployments", label: "Deployments" },
];

export default function ActivityFeedPage() {
  const [selectedSource, setSelectedSource] = useState<Source>("all");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search + Sources */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search activity, PRs, or issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Sources
          </span>
          {(["github", "jira", "slack", "cicd"] as const).map((s) => (
            <button
              key={s}
              onClick={() =>
                setSelectedSource(selectedSource === s ? "all" : s)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                selectedSource === s
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-card)] border-[var(--color-border)] text-slate-400 hover:border-[var(--color-primary)]/30"
              }`}
            >
              {s === "cicd" ? "CI/CD" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedCategory === cat.key
                ? "bg-[var(--color-primary)]/15 border-[var(--color-primary)]/30 text-[var(--color-primary)]"
                : "bg-transparent border-[var(--color-border)] text-slate-400 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
        <div className="flex-1" />
        <button className="btn-ghost text-xs">
          All Teams
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button className="btn-ghost text-xs">
          Last 7 days
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-2">
        {filteredActivities.map((activity, i) => {
          const Icon = iconMap[activity.type] || GitPullRequest;
          return (
            <div
              key={i}
              className="glass-card p-4 flex items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg ${
                  sourceColors[activity.source]
                } flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${sourceColors[activity.source]} text-white`}
                  >
                    {activity.sourceLabel}
                  </span>
                  <p className="text-sm font-semibold text-white truncate">
                    {activity.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex-shrink-0" />
                  <span>{activity.author}</span>
                  <span>•</span>
                  <span className={activity.teamColor}>{activity.team}</span>
                  <span>•</span>
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

              <button className="p-1 text-slate-500 hover:text-white transition-colors flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Export button */}
      <div className="fixed bottom-6 right-6">
        <button className="btn-primary shadow-xl">
          <Upload className="w-4 h-4" />
          Export Report
        </button>
      </div>
    </div>
  );
}
