"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const tabs = [
  { label: "Daily Reports", value: "daily" },
  { label: "Sprint Reports", value: "sprint" },
  { label: "Custom", value: "custom" },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);

  // 🔹 Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data.reports);
    };
    fetchReports();
  }, []);

  // 🔹 Auto select first report
  useEffect(() => {
    if (reports.length > 0) {
      setSelectedReport(reports[0]);
      setSelectedId(reports[0].id);
    }
  }, [reports]);

  // 🔥 FILTER LOGIC (MAIN CHANGE)
  const filteredReports = reports.filter((report) => {
    if (activeTab === "daily") return report.type === "Daily";
    if (activeTab === "sprint") return report.type === "Sprint";
    return true;
  });

  const selectedTeamId = 1; // later dynamic

  const teamFilteredReports = filteredReports.filter((r) => {
    if (!selectedTeamId) return true;
    return r.team === "All Teams" || r.team === "Backend Team";
  });

  // 🔹 Schedule report (already working)
  const handleScheduleReport = async () => {
    await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "daily",
        teamId: 1,
      }),
    });

    // refresh
    const res = await fetch("/api/reports");
    const data = await res.json();
    setReports(data.reports);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports</h2>
          <p className="text-sm text-gray-400">
            AI-generated engineering summaries and metrics
          </p>
        </div>

        <button className="btn-primary" onClick={handleScheduleReport}>
          <Sparkles className="w-4 h-4" />
          Schedule Report
        </button>
      </div>

      <div className="flex gap-6">

        {/* LEFT SIDE */}
        <div className="flex-1">

          {/* Tabs (UI SAME) */}
          <div className="flex gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  activeTab === tab.value
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20"
                    : "text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text-secondary)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* REPORT LIST (UI SAME) */}
          <div className="space-y-3">
            {teamFilteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => {
                  setSelectedId(report.id);
                  setSelectedReport(report);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedId === report.id
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">
                    {report.team}
                  </p>
                  <span className="text-xs text-gray-400">
                    {report.date}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  {report.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (DETAIL PANEL) */}
        <div className="w-[360px]">
          <div className="glass-card p-5 space-y-4 sticky top-5">

            <h3 className="text-white font-semibold">
              {selectedReport?.date || "Select a report"}
            </h3>

            <p className="text-xs text-purple-400">
              {selectedReport?.type} · {selectedReport?.team}
            </p>

            <p className="text-sm text-gray-300">
              {selectedReport?.summary}
            </p>

            {/* Sections */}
            {selectedReport?.sections?.map((section: any, index: number) => (
              <div key={index}>
                <h4 className="text-xs text-purple-400 uppercase">
                  {section.category}
                </h4>
                <p className="text-sm text-gray-300">
                  {section.content}
                </p>
              </div>
            ))}

            <button className="btn-primary w-full">
              Open Full Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}