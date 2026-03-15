"use client";

import {
  Github,
  RefreshCw,
  Copy,
  CheckCircle,
  Circle,
  Clock,
  ExternalLink,
} from "lucide-react";

const integrations = [
  {
    name: "GitHub",
    icon: (
      <Github className="w-6 h-6 text-white" />
    ),
    iconBg: "bg-[#1a1d27]",
    desc: "Pull requests, commits, and granular code review metrics from your repositories.",
    status: "Connected",
    statusColor: "text-emerald-400",
    connected: true,
    lastSync: "5 min ago",
    actionLabel: "Configure",
    borderAccent: "border-t-emerald-500",
  },
  {
    name: "Jira",
    icon: (
      <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
        jira
      </div>
    ),
    iconBg: "bg-[#1a1d27]",
    desc: "Issues, sprints, and project tracking to monitor delivery speed and bottlenecks.",
    status: "Connected",
    statusColor: "text-emerald-400",
    connected: true,
    lastSync: "12 min ago",
    actionLabel: "Configure",
    borderAccent: "border-t-blue-500",
  },
  {
    name: "Slack",
    icon: (
      <div className="w-6 h-6 rounded bg-[#4A154B] flex items-center justify-center text-white text-[10px] font-bold">
        Slack
      </div>
    ),
    iconBg: "bg-[#1a1d27]",
    desc: "Team messages, channels, and threads for communication velocity analysis.",
    status: "Not Connected",
    statusColor: "text-slate-500",
    connected: false,
    lastSync: null,
    actionLabel: "Connect Slack",
    borderAccent: "border-t-slate-600",
  },
  {
    name: "CI/CD Pipelines",
    icon: (
      <div className="w-6 h-6 flex items-center justify-center text-slate-400">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    ),
    iconBg: "bg-[#1a1d27]",
    desc: "Build status, deployment frequency, and failure rate tracking across environments.",
    status: "Coming Soon",
    statusColor: "text-slate-600",
    connected: false,
    lastSync: null,
    actionLabel: "Notify me when available",
    disabled: true,
    borderAccent: "border-t-slate-700",
  },
];

const webhooks = [
  {
    endpoint: "/api/webhooks/github/74f2",
    tool: "GitHub Enterprise",
    lastEvent: "Mar 15, 2026 • 14:42:05",
    status: "Healthy",
    statusColor: "text-emerald-400",
  },
  {
    endpoint: "/api/webhooks/jira/82c1",
    tool: "Jira Cloud",
    lastEvent: "Mar 15, 2026 • 14:35:12",
    status: "Healthy",
    statusColor: "text-emerald-400",
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500">
        <span className="hover:text-white cursor-pointer transition-colors">
          Settings
        </span>
        <span className="mx-2">›</span>
        <span className="text-white font-semibold">Integrations</span>
      </div>

      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Integrations
        </h2>
        <p className="text-slate-400 mt-1">
          Connect your engineering tools to centralize your workflow and gain
          insights.
        </p>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration, i) => (
          <div
            key={integration.name}
            className={`glass-card p-6 border-t-2 ${integration.borderAccent} animate-fade-in-up ${
              integration.disabled ? "opacity-60" : ""
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${integration.iconBg} border border-[var(--color-border)] flex items-center justify-center`}
              >
                {integration.icon}
              </div>
              <span
                className={`status-badge border ${
                  integration.connected
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : integration.disabled
                    ? "bg-slate-500/10 text-slate-600 border-slate-600/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}
              >
                {integration.connected && (
                  <CheckCircle className="w-3 h-3 mr-1" />
                )}
                {integration.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {integration.name}
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              {integration.desc}
            </p>

            <div className="flex items-center justify-between">
              {integration.lastSync ? (
                <span className="text-xs text-slate-500">
                  Last synced: {integration.lastSync}
                </span>
              ) : integration.disabled ? (
                <span className="text-xs text-slate-600" />
              ) : (
                <span className="text-xs text-slate-500">
                  Enable real-time alerts
                </span>
              )}
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  integration.connected
                    ? "border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                    : integration.disabled
                    ? "border border-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[var(--color-primary)] to-purple-500 text-white shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90"
                }`}
                disabled={integration.disabled}
              >
                {integration.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook Status */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">Webhook Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring real-time data ingestion health
            </p>
          </div>
          <button className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] hover:underline">
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <th className="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Endpoint URL
              </th>
              <th className="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Integrated Tool
              </th>
              <th className="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Last Received Event
              </th>
              <th className="text-left px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((wh) => (
              <tr
                key={wh.endpoint}
                className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-card-hover)] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/8 px-2 py-1 rounded font-mono">
                      {wh.endpoint}
                    </code>
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-current text-emerald-500" />
                    <span className="text-sm text-slate-300">{wh.tool}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {wh.lastEvent}
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${wh.statusColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {wh.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
