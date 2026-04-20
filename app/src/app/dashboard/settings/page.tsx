"use client";

import { useState } from "react";
import {
  Github,
  RefreshCw,
  Copy,
  CheckCircle,
  Circle,
  ExternalLink,
  Zap,
  Shield,
  Bell,
  Globe,
} from "lucide-react";

const integrations = [
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5 text-white" />,
    iconBg: "bg-[#24292e]",
    desc: "Pull requests, commits, and code review metrics from your repositories.",
    status: "Connected",
    connected: true,
    lastSync: "5 min ago",
    actionLabel: "Configure",
    repos: 12,
  },
  {
    name: "Jira",
    icon: (
      <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">
        J
      </div>
    ),
    iconBg: "bg-blue-900/50",
    desc: "Issues, sprints, and project tracking to monitor delivery speed.",
    status: "Connected",
    connected: true,
    lastSync: "12 min ago",
    actionLabel: "Configure",
    repos: 4,
  },
  {
    name: "Slack",
    icon: (
      <div className="w-5 h-5 rounded bg-[#4A154B] flex items-center justify-center text-white text-[8px] font-bold">
        S
      </div>
    ),
    iconBg: "bg-[#4A154B]/30",
    desc: "Team messages and threads for communication velocity analysis.",
    status: "Not Connected",
    connected: false,
    lastSync: null,
    actionLabel: "Connect",
  },
  {
    name: "CI/CD Pipelines",
    icon: <Zap className="w-5 h-5 text-slate-400" />,
    iconBg: "bg-white/[0.03]",
    desc: "Build status, deployment frequency, and failure rate tracking.",
    status: "Coming Soon",
    connected: false,
    lastSync: null,
    actionLabel: "Notify Me",
    disabled: true,
  },
];

const webhooks = [
  {
    endpoint: "/api/webhooks/github/74f2",
    tool: "GitHub Enterprise",
    lastEvent: "Mar 15, 2026 • 14:42:05",
    status: "Healthy",
  },
  {
    endpoint: "/api/webhooks/jira/82c1",
    tool: "Jira Cloud",
    lastEvent: "Mar 15, 2026 • 14:35:12",
    status: "Healthy",
  },
];

const preferences = [
  { label: "Email notifications", desc: "Receive daily summary emails", enabled: true, icon: Bell },
  { label: "Real-time alerts", desc: "Push notifications for blockers", enabled: true, icon: Zap },
  { label: "Public profile", desc: "Allow team members to view your profile", enabled: false, icon: Globe },
  { label: "Two-factor auth", desc: "Enhanced security for your account", enabled: true, icon: Shield },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition-all duration-200 ${
        enabled ? "bg-[var(--color-primary)]" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(preferences.map((p) => p.enabled));

  const togglePref = (index: number) => {
    setPrefs((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-[var(--color-text-muted)]">
        <span className="hover:text-white cursor-pointer transition-colors">
          Settings
        </span>
        <span className="mx-1.5 opacity-40">›</span>
        <span className="text-white font-medium">Integrations</span>
      </div>

      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          Integrations
        </h2>
        <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">
          Connect your engineering tools to centralize your workflow
        </p>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration, i) => (
          <div
            key={integration.name}
            className={`glass-card p-5 animate-fade-in-up ${
              integration.disabled ? "opacity-50" : ""
            }`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${integration.iconBg} border border-[var(--color-border)] flex items-center justify-center`}
                >
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{integration.name}</h3>
                  {integration.repos && (
                    <p className="text-[10px] text-[var(--color-text-muted)]">
                      {integration.repos} {integration.name === "Jira" ? "projects" : "repos"} connected
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`status-badge border ${
                  integration.connected
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : integration.disabled
                    ? "bg-white/[0.03] text-[var(--color-text-muted)] border-[var(--color-border)]"
                    : "bg-white/[0.03] text-[var(--color-text-secondary)] border-[var(--color-border)]"
                }`}
              >
                {integration.connected && (
                  <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                )}
                {integration.status}
              </span>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] mb-4 leading-relaxed">
              {integration.desc}
            </p>

            <div className="flex items-center justify-between">
              {integration.lastSync ? (
                <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                  <Circle className="w-1.5 h-1.5 fill-emerald-400 text-emerald-400" />
                  Synced {integration.lastSync}
                </span>
              ) : (
                <span />
              )}
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  integration.connected
                    ? "btn-outline text-xs py-1.5"
                    : integration.disabled
                    ? "border border-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed"
                    : "btn-primary text-xs py-1.5"
                }`}
                disabled={integration.disabled}
              >
                {integration.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--color-border)]">
          <h3 className="text-sm font-semibold text-white">Preferences</h3>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
            Manage your notification and security settings
          </p>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {preferences.map((pref, i) => (
            <div key={pref.label} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.01] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-[var(--color-border)] flex items-center justify-center">
                  <pref.icon className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{pref.label}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{pref.desc}</p>
                </div>
              </div>
              <Toggle enabled={prefs[i]} onToggle={() => togglePref(i)} />
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Status */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Webhook Status</h3>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
              Real-time data ingestion health
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors">
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-5 py-2.5 section-label text-[var(--color-text-muted)]">
                  Endpoint
                </th>
                <th className="text-left px-5 py-2.5 section-label text-[var(--color-text-muted)]">
                  Tool
                </th>
                <th className="text-left px-5 py-2.5 section-label text-[var(--color-text-muted)]">
                  Last Event
                </th>
                <th className="text-left px-5 py-2.5 section-label text-[var(--color-text-muted)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((wh) => (
                <tr
                  key={wh.endpoint}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/8 px-1.5 py-0.5 rounded font-mono">
                        {wh.endpoint}
                      </code>
                      <button className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-[var(--color-text-secondary)]">{wh.tool}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--color-text-muted)]">
                    {wh.lastEvent}
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {wh.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
