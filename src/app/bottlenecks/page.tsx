"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/context/DataContext";
import { calculateRiskReport } from "@/lib/riskEngine";
import { AlertTriangle, ShieldCheck, Sparkles, Activity, RefreshCw, ChevronRight, Check } from "lucide-react";

interface Proposal {
  taskId: string;
  taskTitle: string;
  fromName: string;
  toName: string;
  toId: string;
}

export default function BottlenecksPage() {
  const { employees, projects, tasks, decisions, dependencies, settings, updateTask } = useData();
  
  // Rebalancer states
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposalIds, setSelectedProposalIds] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [balanceResult, setBalanceResult] = useState<{ success: boolean; message: string } | null>(null);

  // Run dynamic risk analysis
  const report = calculateRiskReport(employees, projects, tasks, dependencies, decisions, settings);
  const employeeLoads = Object.values(report.employeeLoads);

  const highRisk   = employeeLoads.filter((e) => e.riskLevel === "High");
  const mediumRisk = employeeLoads.filter((e) => e.riskLevel === "Medium");
  const lowRisk    = employeeLoads.filter((e) => e.riskLevel === "Low");

  const metricCards = [
    { label: "Critical Load Risks",  count: highRisk.length,   bg: "#fef2f2", border: "#fecaca", color: "#dc2626", icon: AlertTriangle },
    { label: "Medium Load Risks",    count: mediumRisk.length, bg: "#fefce8", border: "#fde68a", color: "#ca8a04", icon: Activity },
    { label: "Healthy Capacities",   count: lowRisk.length,    bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a", icon: ShieldCheck },
  ];

  // Algorithmic proposal generator
  const handleCalculateProposals = () => {
    let tempTasks = [...tasks];
    const computedProposals: Proposal[] = [];

    const getActiveCounts = (taskList: typeof tasks) => {
      const counts: Record<string, number> = {};
      employees.forEach((emp) => {
        counts[emp.id] = taskList.filter((t) => t.owner === emp.id && t.status !== "Completed").length;
      });
      return counts;
    };

    let activeCounts = getActiveCounts(tempTasks);
    let iterations = 0;
    const maxIterations = 20;

    while (iterations < maxIterations) {
      let overloadedId: string | null = null;
      let maxActive = 4; // Threshold to start balancing is >= 5 active tasks

      Object.entries(activeCounts).forEach(([empId, count]) => {
        if (count > maxActive) {
          maxActive = count;
          overloadedId = empId;
        }
      });

      if (!overloadedId) break;

      let helperId: string | null = null;
      let minActive = 3; // Helper must have < 3 tasks

      Object.entries(activeCounts).forEach(([empId, count]) => {
        if (empId !== overloadedId && count < minActive) {
          minActive = count;
          helperId = empId;
        }
      });

      if (!helperId) break;

      const taskToMoveIndex = tempTasks.findIndex(
        (t) => t.owner === overloadedId && t.status !== "Completed" && !computedProposals.some(p => p.taskId === t.id)
      );

      if (taskToMoveIndex === -1) break;

      const taskObj = tempTasks[taskToMoveIndex];
      const fromEmp = employees.find(e => e.id === overloadedId);
      const toEmp = employees.find(e => e.id === helperId);

      if (fromEmp && toEmp) {
        computedProposals.push({
          taskId: taskObj.id,
          taskTitle: taskObj.title,
          fromName: fromEmp.name,
          toName: toEmp.name,
          toId: toEmp.id
        });
      }

      tempTasks[taskToMoveIndex] = {
        ...tempTasks[taskToMoveIndex],
        owner: helperId,
      };

      activeCounts = getActiveCounts(tempTasks);
      iterations++;
    }

    if (computedProposals.length > 0) {
      setProposals(computedProposals);
      setSelectedProposalIds(computedProposals.map(p => p.taskId));
      setShowPreview(true);
      setBalanceResult(null);
    } else {
      setBalanceResult({
        success: false,
        message: "No tasks could be rebalanced. Workloads are already optimal or helper resources are at capacity."
      });
      setShowPreview(false);
      setTimeout(() => setBalanceResult(null), 5000);
    }
  };

  const handleConfirmRebalance = () => {
    let appliedCount = 0;
    selectedProposalIds.forEach((taskId) => {
      const prop = proposals.find((p) => p.taskId === taskId);
      if (prop) {
        updateTask(taskId, { owner: prop.toId });
        appliedCount++;
      }
    });

    if (appliedCount > 0) {
      setBalanceResult({
        success: true,
        message: `Successfully applied AI rebalancing. Reallocated ${appliedCount} task(s) to underloaded engineers.`
      });
    }

    setProposals([]);
    setShowPreview(false);
    setTimeout(() => setBalanceResult(null), 6000);
  };

  const handleToggleProposal = (taskId: string) => {
    setSelectedProposalIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} className="fade-in">

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1
              style={{
                                fontWeight: 800,
                fontSize: 26,
                color: "#111827",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Bottleneck Detection
            </h1>
            <p style={{ marginTop: 6, fontSize: 14, color: "#6b7280", margin: "6px 0 0" }}>
              Identify overloaded team members, capacity constraints, and decision blockers.
            </p>
          </div>

          <button
            onClick={handleCalculateProposals}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)",
              transition: "all 0.12s",
            }}
          >
            <RefreshCw size={15} /> Run AI Auto-Balancer
          </button>
        </div>

        {/* Result Alerts */}
        {balanceResult && (
          <div
            style={{
              padding: "14px 18px",
              background: balanceResult.success ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${balanceResult.success ? "#bbf7d0" : "#fecaca"}`,
              color: balanceResult.success ? "#16a34a" : "#dc2626",
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: "fadeUp 0.2s ease-out",
            }}
          >
            {balanceResult.success ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
            {balanceResult.message}
          </div>
        )}

        {/* Managed Balancer Proposals Preview Panel */}
        {showPreview && proposals.length > 0 && (
          <div className="card fade-in" style={{ padding: 24, marginBottom: 24, borderTop: "4px solid #7c3aed" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Sparkles size={16} style={{ color: "#7c3aed" }} />
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>
                AI Rebalancing Proposals Review
              </h3>
            </div>
            
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
              Select which workload reallocation recommendations to approve before committing updates to the team directory.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {proposals.map((p) => (
                <div 
                  key={p.taskId} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    padding: "12px 16px", 
                    background: selectedProposalIds.includes(p.taskId) ? "#fcfbfe" : "#f9fafb",
                    border: `1px solid ${selectedProposalIds.includes(p.taskId) ? "#ddd6fe" : "#e5e7eb"}`,
                    borderRadius: 10,
                    cursor: "pointer"
                  }}
                  onClick={() => handleToggleProposal(p.taskId)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input 
                      type="checkbox"
                      checked={selectedProposalIds.includes(p.taskId)}
                      onChange={() => {}} // toggled by row click
                      className="rounded accent-purple-600"
                    />
                    <span style={{ fontSize: 13.5, color: "#111827", fontWeight: 600 }}>
                      Shift "{p.taskTitle}"
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                    <span style={{ color: "#dc2626", fontWeight: 600 }}>{p.fromName}</span>
                    <ChevronRight size={12} style={{ color: "#9ca3af" }} />
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>{p.toName}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => { setShowPreview(false); setProposals([]); }}
                style={{
                  background: "#f3f4f6",
                  color: "#4b5563",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "9px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reject Proposals
              </button>
              <button
                onClick={handleConfirmRebalance}
                className="btn-primary"
                style={{ background: "#7c3aed" }}
              >
                Approve &amp; Reallocate ({selectedProposalIds.length})
              </button>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {metricCards.map((m) => (
            <div
              key={m.label}
              className="stat-card"
              style={{ padding: 20, borderColor: m.border, background: m.bg }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                  {m.label}
                </p>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${m.border}`,
                  }}
                >
                  <m.icon size={15} style={{ color: m.color }} />
                </div>
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
                {m.count}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: "hidden", marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 24px",
              borderBottom: "1px solid #f3f4f6",
              background: "#f9fafb",
            }}
          >
            <Activity size={15} style={{ color: "#4f46e5" }} />
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", margin: 0, flex: 1 }}>
              Workload Analysis
            </h3>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe" }}>
              {employeeLoads.length} members
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Employee", "Role", "Active Tasks", "Completed", "Workload", "Risk Level"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employeeLoads.map((load, i) => {
                  const isHigh   = load.riskLevel === "High";
                  const isMedium = load.riskLevel === "Medium";

                  const barColor = isHigh ? "#dc2626" : isMedium ? "#f59e0b" : "#16a34a";
                  const badgeBg  = isHigh ? "#fef2f2" : isMedium ? "#fefce8" : "#f0fdf4";
                  const badgeTxt = isHigh ? "#dc2626" : isMedium ? "#ca8a04" : "#16a34a";
                  const badgeBdr = isHigh ? "#fecaca" : isMedium ? "#fde68a" : "#bbf7d0";
                  const avatarBg = isHigh ? "#fee2e2" : isMedium ? "#fef9c3" : "#dbeafe";
                  const avatarTx = isHigh ? "#dc2626" : isMedium ? "#ca8a04" : "#2563eb";

                  return (
                    <tr
                      key={load.employeeId}
                      className="table-row-hover"
                      style={{ borderBottom: i < employeeLoads.length - 1 ? "1px solid #f9fafb" : "none" }}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 8,
                              background: avatarBg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: 700,
                              color: avatarTx,
                              flexShrink: 0,
                            }}
                          >
                            {load.employeeName.slice(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{load.employeeName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#6b7280" }}>{load.role}</td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#4f46e5", background: "#eef2ff", padding: "3px 10px", borderRadius: 7 }}>
                          {load.activeCount}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>{load.completedCount}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 100, overflow: "hidden", maxWidth: 100 }}>
                            <div
                              className="progress-fill"
                              style={{ height: "100%", width: `${load.workloadScore}%`, background: barColor, borderRadius: 100 }}
                            />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", fontFamily: "'JetBrains Mono', monospace", minWidth: 32 }}>
                            {load.workloadScore}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 100,
                            background: badgeBg,
                            color: badgeTxt,
                            border: `1px solid ${badgeBdr}`,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {load.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Sparkles size={16} style={{ color: "#7c3aed" }} />
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", margin: 0 }}>
              AI Workforce Balancing
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {highRisk.map((load) => {
              const helper = lowRisk.find(r => r.role === load.role) || lowRisk[0];
              return (
                <div
                  key={load.employeeId}
                  style={{ padding: "14px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <AlertTriangle size={14} style={{ color: "#dc2626" }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>
                      Critical Load: {load.employeeName}
                    </p>
                  </div>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                    {load.employeeName} has{" "}
                    <span style={{ fontWeight: 600, color: "#dc2626" }}>{load.activeCount} active tasks</span>,
                    causing delivery bottlenecks.{" "}
                    {helper && (
                      <span style={{ color: "#16a34a", fontWeight: 600 }}>
                        Recommendation: click the Auto-Balancer to shift tasks to {helper.employeeName} (currently has only {helper.activeCount} active tasks).
                      </span>
                    )}
                  </p>
                </div>
              );
            })}

            {highRisk.length === 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#16a34a" }}>
                <ShieldCheck size={16} />
                All resource workloads are balanced. No high-load bottleneck rebalancing needed.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}