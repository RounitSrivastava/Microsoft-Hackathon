import { ProjectRiskReport } from "@/lib/riskEngine";
import { TrendingUp, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props { projectRisks: ProjectRiskReport[]; }

export default function RiskOverview({ projectRisks }: Props) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <TrendingUp size={16} style={{ color: "#4f46e5" }} />
        <h3
          style={{
                        fontWeight: 700,
            fontSize: 15,
            color: "#111827",
            margin: 0,
          }}
        >
          Project Risk Overview
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {projectRisks.map((report) => {
          const isHigh   = report.riskLevel === "High";
          const isMedium = report.riskLevel === "Medium";

          const rowBg     = isHigh ? "#fef2f2" : isMedium ? "#fefce8" : "#f0fdf4";
          const rowBorder = isHigh ? "#fecaca" : isMedium ? "#fde68a" : "#bbf7d0";
          const textColor = isHigh ? "#dc2626" : isMedium ? "#ca8a04" : "#16a34a";
          const Icon      = isHigh ? AlertTriangle : isMedium ? AlertCircle : CheckCircle2;

          return (
            <div
              key={report.projectId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 10,
                background: rowBg,
                border: `1px solid ${rowBorder}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={15} style={{ color: textColor, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>
                    {report.projectName}
                  </p>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0" }}>
                    {report.blockedCount} blocked · {report.overdueCount} overdue
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: textColor,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {report.riskScore}
                  <span style={{ fontSize: 10, fontWeight: 400, color: "#9ca3af" }}>/100</span>
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 100,
                    background: "#fff",
                    color: textColor,
                    border: `1px solid ${rowBorder}`,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {report.riskLevel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}