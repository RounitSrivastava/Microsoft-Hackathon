"use client";

import MainLayout from "@/components/layout/MainLayout";
import OrgGraph from "@/components/graph/OrgGraph";
import { Network } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function DigitalTwinPage() {
  const { projects, tasks, dependencies } = useData();
  const activeTasksCount = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <MainLayout fullHeight>
      {/* Full-height flex column — graph fills all remaining vertical space */}
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 20 }} className="fade-in">

        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.04em", display: "flex", alignItems: "center", gap: 10, margin: 0 }}>
            <Network style={{ color: "#6366f1" }} size={24} />
            Organizational <span style={{ color: "#6366f1" }}>Digital Twin</span>
          </h1>
          <p style={{ marginTop: 6, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
            Visualize relationships between employees, projects, tasks, and blocked dependency chains.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, flexShrink: 0 }}>
          {[
            { label: "Total Teams", value: "1" },
            { label: "Active Projects", value: projects.length },
            { label: "Total Dependencies", value: dependencies.length },
            { label: "Active Tasks", value: activeTasksCount },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: "14px 18px" }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", margin: 0 }}>{s.label}</p>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.04em", margin: "6px 0 0", fontFamily: "var(--font-mono)" }}>{s.value}</h2>
            </div>
          ))}
        </div>

        {/* Graph — grows to fill remaining height */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <OrgGraph />
        </div>

      </div>
    </MainLayout>
  );
}