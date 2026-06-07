"use client";

import MainLayout from "@/components/layout/MainLayout";
import OrgGraph from "@/components/graph/OrgGraph";
import { GitBranch } from "lucide-react";

export default function DependenciesPage() {
  return (
    <MainLayout fullHeight>
      {/* Full-height flex column — graph fills all remaining vertical space */}
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }} className="fade-in">

        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.04em", margin: 0 }}>
            Dependency Analysis
          </h1>
          <p style={{ marginTop: 6, fontSize: 14, color: "#64748b", fontWeight: 500 }}>
            Map project dependencies, identify blocker nodes, and simulate delay cascades.
          </p>
        </div>

        {/* Info Banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "12px 16px",
          background: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: 10, flexShrink: 0,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "#dbeafe", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <GitBranch size={14} style={{ color: "#2563eb" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1e40af", margin: 0 }}>
              Graph Filter: Dependency Edges Only
            </p>
            <p style={{ fontSize: 12, color: "#3b82f6", margin: "2px 0 0" }}>
              Click any node to open the intelligence sidebar and run delay cascade path tracing.
            </p>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "4px 10px",
            borderRadius: 100, background: "#dbeafe", color: "#2563eb",
            border: "1px solid #bfdbfe", textTransform: "uppercase",
            letterSpacing: "0.06em", flexShrink: 0,
          }}>
            Dep Mode
          </span>
        </div>

        {/* Graph — grows to fill remaining height */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <OrgGraph defaultOnlyDependencies={true} />
        </div>

      </div>
    </MainLayout>
  );
}