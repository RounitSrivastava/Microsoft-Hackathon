import { ProjectRiskReport } from "@/lib/riskEngine";
import { BarChart2 } from "lucide-react";

interface Props { projectRisks: ProjectRiskReport[]; }

const riskColor = (level: string) =>
  level === "High" ? "#dc2626" : level === "Medium" ? "#ca8a04" : "#16a34a";
const riskBg = (level: string) =>
  level === "High" ? "#dc2626" : level === "Medium" ? "#f59e0b" : "#16a34a";

export default function ProjectHealthChart({ projectRisks }: Props) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <BarChart2 size={16} style={{ color: "#4f46e5" }} />
        <h3
          style={{
                        fontWeight: 700,
            fontSize: 15,
            color: "#111827",
            margin: 0,
          }}
        >
          Project Completion
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {projectRisks.map((report) => {
          const color = riskColor(report.riskLevel);
          const bar   = riskBg(report.riskLevel);

          return (
            <div key={report.projectId}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {report.projectName}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 100,
                      background:
                        report.riskLevel === "High"
                          ? "#fef2f2"
                          : report.riskLevel === "Medium"
                          ? "#fefce8"
                          : "#f0fdf4",
                      color,
                      border: `1px solid ${
                        report.riskLevel === "High"
                          ? "#fecaca"
                          : report.riskLevel === "Medium"
                          ? "#fde68a"
                          : "#bbf7d0"
                      }`,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {report.riskLevel}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {report.progress}%
                </span>
              </div>

              {/* Track */}
              <div
                style={{
                  width: "100%",
                  height: 7,
                  background: "#f3f4f6",
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    height: "100%",
                    width: `${report.progress}%`,
                    background: bar,
                    borderRadius: 100,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 5,
                  fontSize: 11,
                  color: "#9ca3af",
                }}
              >
                <span>Start</span>
                <span>
                  {report.blockedCount} blocked · {report.overdueCount} overdue
                </span>
                <span>Launch</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}