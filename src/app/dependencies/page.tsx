"use client";

import MainLayout from "@/components/layout/MainLayout";
import OrgGraph from "@/components/graph/OrgGraph";
import { Info, GitBranch } from "lucide-react";

export default function DependenciesPage() {
  return (
    <MainLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} className="fade-in">

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
                            fontWeight: 800,
              fontSize: 26,
              color: "#111827",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Dependency Analysis
          </h1>
          <p style={{ marginTop: 6, fontSize: 14, color: "#6b7280" }}>
            Map project dependencies, identify blocker nodes, and simulate delay cascades.
          </p>
        </div>

        {/* Info Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 18px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GitBranch size={15} style={{ color: "#2563eb" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1e40af", margin: 0 }}>
              Graph Filter: Dependency Edges Only
            </p>
            <p style={{ fontSize: 12, color: "#3b82f6", margin: "3px 0 0" }}>
              Click any node to open the intelligence sidebar and run delay cascade path tracing.
            </p>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 100,
              background: "#dbeafe",
              color: "#2563eb",
              border: "1px solid #bfdbfe",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            Dep Mode
          </span>
        </div>

        <OrgGraph defaultOnlyDependencies={true} />
      </div>
    </MainLayout>
  );
}