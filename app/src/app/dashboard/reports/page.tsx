"use client";

import { useState } from "react";
import {
  Calendar,
  Share2,
  Download,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  Zap,
  Sparkles,
} from "lucide-react";

const reports = [
  {
    id: 1,
    date: "Mar 15, 2026",
    type: "Daily",
    team: "Platform Eng",
    summary: "Completed API migration for v3 endpoints. 6 PRs merged...",
  },
  {
    id: 2,
    date: "Mar 14, 2026",
    type: "Sprint",
    team: "Mobile Core",
    summary: "Sprint 42 final retrospective completed with 89% velocity...",
  },
  {
    id: 3,
    date: "Mar 14, 2026",
    type: "Daily",
    team: "Data Science",
    summary: "Model training pipeline optimization reduced cost by 30%...",
  },
  {
    id: 4,
    date: "Mar 13, 2026",
    type: "Daily",
    team: "Platform Eng",
    summary: "K8s cluster maintenance scheduled for weekend window...",
  },
  {
    id: 5,
    date: "Mar 12, 2026",
    type: "Daily",
    team: "Frontend Team",
    summary: "UI library updated to v4.0 with breaking changes in...",
  },
  {
    id: 6,
    date: "Mar 11, 2026",
    type: "Sprint",
    team: "Mobile Core",
    summary: "Beta release candidate ready for QA sign-off...",
  },
];

const selectedReport = {
  title: "Mar 14 Summary",
  subtitle: "Sprint Report · Mobile Core",
  progress: [
    "Completed 85% of the planned feature set for v1.2 Release Candidate.",
    "Integrated new authentication flow across iOS and Android.",
    "Optimized image caching logic, reducing latency by 40%.",
  ],
  blockers: [
    {
      title: "Third-party API Downtime",
      desc: "Payment provider's sandbox has been unstable, delaying checkout integration testing for 12 hours.",
    },
  ],
  risks: [
    "Impending release date vs. QA bandwidth. Current bug backlog has 12 high-priority items still open.",
  ],
  teamActivity: {
    prsMerged: 42,
    commits: 156,
    incidents: 4,
    focusScore: "94%",
  },
};

const tabs = ["Daily Reports", "Sprint Reports", "Custom"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Daily Reports");
  const [selectedId, setSelectedId] = useState(2);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Reports
          </h2>
          <p className="text-slate-400 mt-1">
            AI-generated engineering summaries and metrics
          </p>
        </div>
        <button className="btn-primary">
          <Sparkles className="w-4 h-4" />
          Schedule Report
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left: Report list */}
        <div className="flex-1 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Team
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Summary Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => setSelectedId(report.id)}
                    className={`border-b border-[var(--color-border-subtle)] cursor-pointer transition-colors ${
                      selectedId === report.id
                        ? "bg-[var(--color-primary)]/5"
                        : "hover:bg-[var(--color-bg-card-hover)]"
                    }`}
                  >
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {report.date}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`status-badge border ${
                          report.type === "Sprint"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      {report.team}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500 max-w-[200px] truncate">
                      {report.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Detail panel */}
        <div className="w-96 flex-shrink-0">
          <div className="glass-card p-6 sticky top-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedReport.title}
                </h3>
                <p className="text-xs text-[var(--color-primary)]">
                  {selectedReport.subtitle}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-[var(--color-bg-card-hover)] text-slate-400 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[var(--color-bg-card-hover)] text-slate-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                <TrendingUp className="w-4 h-4" />
                Progress
              </h4>
              <div className="space-y-2 pl-1">
                {selectedReport.progress.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">
                <AlertCircle className="w-4 h-4" />
                Blockers
              </h4>
              {selectedReport.blockers.map((b, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-rose-500/8 border border-rose-500/15"
                >
                  <p className="text-sm font-semibold text-white">{b.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{b.desc}</p>
                </div>
              ))}
            </div>

            {/* Risks */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
                <AlertTriangle className="w-4 h-4" />
                Risks
              </h4>
              {selectedReport.risks.map((r, i) => (
                <p key={i} className="text-sm text-slate-300 leading-relaxed border-l-2 border-orange-500/30 pl-3">
                  {r}
                </p>
              ))}
            </div>

            {/* Team Activity */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                <Zap className="w-4 h-4" />
                Team Activity
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "PRs MERGED", value: selectedReport.teamActivity.prsMerged },
                  { label: "COMMITS", value: selectedReport.teamActivity.commits },
                  { label: "INCIDENTS", value: selectedReport.teamActivity.incidents },
                  { label: "FOCUS SCORE", value: selectedReport.teamActivity.focusScore },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)]"
                  >
                    <p className="text-2xl font-black text-white">
                      {stat.value}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-3 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold text-sm hover:bg-[var(--color-primary)]/20 transition-all">
              Open Full Interactive Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
