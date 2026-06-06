import { EmployeeLoadReport } from "@/lib/riskEngine";
import { AlertTriangle, ShieldCheck, Users } from "lucide-react";

interface Props { employeeLoads: EmployeeLoadReport[]; }

export default function BottleneckOverview({ employeeLoads }: Props) {
  const overloaded = employeeLoads.filter((e) => e.riskLevel === "High");

  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <Users size={16} style={{ color: "#dc2626" }} />
        <h3
          style={{
                        fontWeight: 700,
            fontSize: 15,
            color: "#111827",
            margin: 0,
            flex: 1,
          }}
        >
          Resource Bottlenecks
        </h3>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 9px",
            borderRadius: 100,
            background: overloaded.length > 0 ? "#fef2f2" : "#f0fdf4",
            color: overloaded.length > 0 ? "#dc2626" : "#16a34a",
            border: `1px solid ${overloaded.length > 0 ? "#fecaca" : "#bbf7d0"}`,
          }}
        >
          {overloaded.length} critical
        </span>
      </div>

      {overloaded.length === 0 ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            color: "#16a34a",
          }}
        >
          <ShieldCheck size={16} />
          All team members are within healthy capacity limits.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {overloaded.map((emp) => (
            <div
              key={emp.employeeId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#fee2e2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#dc2626",
                    flexShrink: 0,
                  }}
                >
                  {emp.employeeName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>
                    {emp.employeeName}
                  </p>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0" }}>{emp.role}</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#6b7280" }}>{emp.activeCount} tasks</span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 100,
                    background: "#fff",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                  }}
                >
                  <AlertTriangle size={10} />
                  {emp.workloadScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}