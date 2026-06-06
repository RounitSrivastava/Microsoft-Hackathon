"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/context/DataContext";
import { calculateRiskReport } from "@/lib/riskEngine";
import {
  Users, AlertTriangle, ShieldCheck, Sparkles, Activity, CheckSquare, Plus, X, AlertCircle, Trash2
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

export default function EmployeesPage() {
  const { 
    employees, 
    projects, 
    tasks, 
    decisions, 
    dependencies, 
    settings, 
    addEmployee, 
    deleteEmployee,
    updateTask,
    runAutoBalancer 
  } = useData();

  // Dynamic risk calculation
  const report = calculateRiskReport(employees, projects, tasks, dependencies, decisions, settings);
  const employeeLoads = Object.values(report.employeeLoads);

  const totalEmployees  = employeeLoads.length;
  const overloadedCount = employeeLoads.filter((e) => e.riskLevel === "High").length;
  
  const avgWorkload = totalEmployees > 0
    ? Math.round(employeeLoads.reduce((s, e) => s + e.workloadScore, 0) / totalEmployees)
    : 0;

  const activeTasks = tasks.filter((t) => t.status !== "Completed").length;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empRole, setEmpRole] = useState("Software Engineer");
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");

  // Balancer Modal State
  const [showBalancer, setShowBalancer] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [balancerMessage, setBalancerMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  const handleReassignTask = (taskId: string, targetEmpId: string) => {
    updateTask(taskId, { owner: targetEmpId });
    const taskTitle = tasks.find((t) => t.id === taskId)?.title || "Task";
    const targetName = employees.find((e) => e.id === targetEmpId)?.name || "another member";
    setBalancerMessage({
      text: `Reassigned "${taskTitle}" to ${targetName}.`,
      type: "success",
    });
    setTimeout(() => {
      setBalancerMessage((prev) => 
        prev && prev.text === `Reassigned "${taskTitle}" to ${targetName}.` ? null : prev
      );
    }, 4000);
  };

  const handleAutoBalance = () => {
    const result = runAutoBalancer();
    if (result.success) {
      setBalancerMessage({
        text: result.message,
        type: "success",
      });
    } else {
      setBalancerMessage({
        text: result.message,
        type: "info",
      });
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim()) {
      setError("Name is required.");
      return;
    }

    addEmployee(empName, empRole);
    setEmpName("");
    setEmpRole("Software Engineer");
    setError("");
    setShowModal(false);
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} className="fade-in">

        {/* Header */}
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: "-0.03em" }}>
              Employees
            </h1>
            <p style={{ marginTop: 3, fontSize: 13, color: "var(--text-muted)", margin: "3px 0 0" }}>
              {totalEmployees} members &middot; workload &amp; capacity tracking
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                const firstOverloaded = employeeLoads.find((e) => e.riskLevel === "High");
                setSelectedEmpId(firstOverloaded ? firstOverloaded.employeeId : (employees[0]?.id || null));
                setShowBalancer(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                color: "#374151",
                padding: "7px 14px",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#f9fafb";
                (e.currentTarget as HTMLElement).style.borderColor = "#ced4da";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#ffffff";
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
              }}
            >
              <Sparkles size={13} style={{ color: "#7c3aed" }} /> Rebalance Workspace
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Plus size={13} /> Add member
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          <StatsCard title="Total Employees"      value={String(totalEmployees)}  icon={Users}         variant="violet"                                                               subtitle="team members" />
          <StatsCard title="Overloaded Members"   value={String(overloadedCount)} icon={AlertTriangle} variant={overloadedCount > 0 ? "rose" : "emerald"}                             subtitle="high risk" />
          <StatsCard title="Avg Workload"         value={`${avgWorkload}%`}       icon={Activity}      variant={avgWorkload > 70 ? "amber" : avgWorkload > 50 ? "cyan" : "emerald"}   subtitle="capacity usage" />
          <StatsCard title="Active Tasks"         value={String(activeTasks)}     icon={CheckSquare}   variant="cyan"                                                                  subtitle="in flight" />
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
            <Users size={15} style={{ color: "#4f46e5" }} />
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", margin: 0, flex: 1 }}>
              Team Directory
            </h3>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe" }}>
              {totalEmployees} members
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Employee", "Role", "Active Tasks", "Completed", "Workload", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: h === "Actions" ? "center" : "left",
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
                      <td style={{ padding: "13px 20px" }}>
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
                      <td style={{ padding: "13px 20px", fontSize: 13, color: "#6b7280" }}>{load.role}</td>
                      <td style={{ padding: "13px 20px", textAlign: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#4f46e5" }}>{load.activeCount}</span>
                      </td>
                      <td style={{ padding: "13px 20px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>{load.completedCount}</td>
                      <td style={{ padding: "13px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 100, overflow: "hidden", maxWidth: 100 }}>
                            <div
                              className="progress-fill"
                              style={{ height: "100%", width: `${load.workloadScore}%`, background: barColor, borderRadius: 100 }}
                            />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", fontFamily: "'JetBrains Mono', monospace", minWidth: 34 }}>
                            {load.workloadScore}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
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
                      <td style={{ padding: "13px 20px", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%" }}>
                          {load.activeCount > 0 && (
                            <button
                              onClick={() => {
                                setSelectedEmpId(load.employeeId);
                                setShowBalancer(true);
                              }}
                              style={{
                                background: isHigh ? "#fee2e2" : "#f3f4f6",
                                border: isHigh ? "1px solid #fecaca" : "1px solid #e5e7eb",
                                color: isHigh ? "#dc2626" : "#4b5563",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = isHigh ? "#fecaca" : "#e5e7eb";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = isHigh ? "#fee2e2" : "#f3f4f6";
                              }}
                              title="Distribute / lower task load"
                            >
                              <Sparkles size={11} />
                              Lower Load
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setConfirmDeleteId(load.employeeId);
                              setConfirmDeleteName(load.employeeName);
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: "#9ca3af",
                              padding: 6,
                              borderRadius: 6,
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#ef4444";
                              (e.currentTarget as HTMLElement).style.background = "#fef2f2";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = "#9ca3af";
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                            title="Delete Employee"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {employeeLoads.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "24px 20px", textAlign: "center", color: "#9ca3af", fontSize: 13.5 }}>
                      No employees registered yet. Click "Add Employee" to register team members.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Sparkles size={16} style={{ color: "#7c3aed" }} />
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", margin: 0 }}>
              AI Workforce Insights
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {employeeLoads.map((load) => {
              if (load.riskLevel !== "High") return null;
              return (
                <div
                  key={load.employeeId}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}
                >
                  <AlertTriangle size={15} style={{ color: "#dc2626", marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                    <strong>{load.employeeName}</strong> is overloaded with{" "}
                    <strong style={{ color: "#dc2626" }}>{load.activeCount} active tasks</strong>. They represent a
                    high organizational risk and may become a bottleneck for critical projects.
                  </p>
                </div>
              );
            })}

            {employeeLoads.some(e => e.employeeId === "e4" && e.activeCount <= 2) && (
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}
              >
                <ShieldCheck size={15} style={{ color: "#16a34a", marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                  <strong>Sanchari Das</strong> (Marketing Lead) is running at low capacity with only{" "}
                  <strong style={{ color: "#16a34a" }}>{report.employeeLoads["e4"]?.activeCount ?? 2} active tasks</strong>{" "}
                  — available to assist with planning or coordination reviews.
                </p>
              </div>
            )}

            {overloadedCount === 0 && (
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}
              >
                <ShieldCheck size={15} style={{ color: "#16a34a", marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                  All registered employee workloads are within safe thresholds. No high risk workload alerts.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Overlay */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(17, 24, 39, 0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
            }}
          >
            <div
              className="card"
              style={{
                width: 400,
                background: "#ffffff",
                padding: 24,
                position: "relative",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                }}
              >
                <X size={18} />
              </button>

              <h2
                style={{
                  margin: "0 0 18px",
                                    fontWeight: 700,
                  fontSize: 18,
                  color: "#111827",
                }}
              >
                Add Team Member
              </h2>

              <form onSubmit={handleAddEmployee} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Connor"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                    Job Role / Title
                  </label>
                  <select
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}
                  >
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Engineering Lead">Engineering Lead</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="QA Specialist">QA Specialist</option>
                    <option value="Marketing Lead">Marketing Lead</option>
                  </select>
                </div>

                {error && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#dc2626", fontWeight: 500 }}>
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "#f3f4f6",
                      color: "#4b5563",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: "9px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {confirmDeleteId && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(17, 24, 39, 0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 110,
            }}
          >
            <div
              className="card"
              style={{
                width: 400,
                background: "#ffffff",
                padding: 24,
                position: "relative",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: 12,
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  background: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#dc2626",
                  flexShrink: 0,
                }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 style={{
                    margin: "0 0 6px",
                                        fontWeight: 700,
                    fontSize: 16,
                    color: "#111827",
                  }}>
                    Remove Workspace Member?
                  </h3>
                  <p style={{ fontSize: 13.5, color: "#4b5563", margin: 0, lineHeight: 1.5 }}>
                    Are you sure you want to remove <strong>{confirmDeleteName}</strong> from the workspace? All tasks owned by them will be unassigned.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDeleteId(null);
                    setConfirmDeleteName("");
                  }}
                  style={{
                    background: "#f3f4f6",
                    color: "#4b5563",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteEmployee(confirmDeleteId);
                    setConfirmDeleteId(null);
                    setConfirmDeleteName("");
                  }}
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(239, 68, 68, 0.1)",
                  }}
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workload Balancer Modal */}
        {showBalancer && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(17, 24, 39, 0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 120,
            }}
          >
            <div
              className="card"
              style={{
                width: 850,
                maxWidth: "95vw",
                maxHeight: "90vh",
                background: "#ffffff",
                padding: 24,
                position: "relative",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              {/* Close button */}
              <button
                onClick={() => {
                  setShowBalancer(false);
                  setBalancerMessage(null);
                }}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                }}
              >
                <X size={18} />
              </button>

              {/* Modal Title */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <Sparkles size={20} style={{ color: "#7c3aed" }} />
                <h2 style={{ margin: 0, fontWeight: 700, fontSize: 18, color: "#111827" }}>
                  Workload Balancing Assistant
                </h2>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 18px" }}>
                Lower workload for overloaded employees by reassigning tasks to team members with higher capacity.
              </p>

              {/* Toast / Message Banner */}
              {balancerMessage && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: balancerMessage.type === "success" ? "#f0fdf4" : "#eff6ff",
                    border: `1px solid ${balancerMessage.type === "success" ? "#bbf7d0" : "#bfdbfe"}`,
                    color: balancerMessage.type === "success" ? "#16a34a" : "#1d4ed8",
                    fontSize: 13,
                    fontWeight: 500,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>{balancerMessage.text}</span>
                </div>
              )}

              {/* Main Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, background: "#f9fafb", padding: 12, borderRadius: 8, border: "1px solid #f3f4f6" }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#4b5563" }}>
                  Select employee to balance:
                </label>
                <select
                  value={selectedEmpId || ""}
                  onChange={(e) => {
                    setSelectedEmpId(e.target.value);
                    setBalancerMessage(null);
                  }}
                  className="input-field"
                  style={{ padding: "6px 12px", width: 300, fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}
                >
                  <option value="" disabled>-- Select Employee --</option>
                  {employeeLoads.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.employeeName} ({emp.activeCount} active tasks &middot; {emp.riskLevel} load)
                    </option>
                  ))}
                </select>
              </div>

              {/* Two Column Section */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, flex: 1, overflowY: "auto", minHeight: 0, paddingRight: 4 }}>
                
                {/* Left Column: Tasks */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
                    Active Tasks for {employees.find((e) => e.id === selectedEmpId)?.name || "Employee"}
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1, paddingRight: 4 }}>
                    {tasks.filter((t) => t.owner === selectedEmpId && t.status !== "Completed").map((task) => {
                      const projName = projects.find((p) => p.id === task.project)?.name || "Unknown Project";
                      const helpers = employees.filter((e) => e.id !== selectedEmpId);
                      
                      // Sort helpers by active task counts so low-load helpers are shown first
                      const sortedHelpers = [...helpers].sort((a, b) => {
                        const countA = tasks.filter((t) => t.owner === a.id && t.status !== "Completed").length;
                        const countB = tasks.filter((t) => t.owner === b.id && t.status !== "Completed").length;
                        return countA - countB;
                      });

                      return (
                        <div
                          key={task.id}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            padding: 12,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                            <h4 style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", margin: 0 }}>
                              {task.title}
                            </h4>
                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", background: "#f3f4f6", borderRadius: 4, color: "#4b5563", border: "1px solid #e5e7eb", textTransform: "capitalize", flexShrink: 0 }}>
                              {task.status}
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11.5, color: "#9ca3af", marginBottom: 10 }}>
                            <span style={{ color: "#4f46e5", fontWeight: 500 }}>{projName}</span>
                            <span>&middot;</span>
                            <span>Due {task.dueDate}</span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px dashed #f3f4f6", paddingTop: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#4b5563" }}>Reassign:</span>
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleReassignTask(task.id, e.target.value);
                                  e.target.value = ""; // Reset value so it doesn't show selected state
                                }
                              }}
                              style={{
                                flex: 1,
                                padding: "4px 8px",
                                fontSize: 12,
                                borderRadius: 6,
                                border: "1px solid #d1d5db",
                                background: "#ffffff",
                                cursor: "pointer"
                              }}
                            >
                              <option value="" disabled>Choose helper...</option>
                              {sortedHelpers.map((helper) => {
                                const helperActiveCount = tasks.filter((t) => t.owner === helper.id && t.status !== "Completed").length;
                                const maxLimit = settings.maxTasksPerEmployee || 5;
                                const isOver = helperActiveCount >= maxLimit;
                                return (
                                  <option key={helper.id} value={helper.id}>
                                    {helper.name} ({helperActiveCount}/{maxLimit} active{isOver ? " - OVERLOADED" : ""})
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      );
                    })}

                    {tasks.filter((t) => t.owner === selectedEmpId && t.status !== "Completed").length === 0 && (
                      <div style={{ padding: "40px 20px", textAlign: "center", color: "#9ca3af", fontSize: 13, background: "#f9fafb", borderRadius: 8, border: "1px dashed #e5e7eb" }}>
                        <ShieldCheck size={24} style={{ color: "#16a34a", margin: "0 auto 8px" }} />
                        No active tasks remaining. Workload is completely balanced!
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Workload Impact Map */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 10, borderLeft: "1px solid #f3f4f6" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb", paddingBottom: 6 }}>
                    Workload Impact Preview
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1, paddingRight: 4 }}>
                    {employees.map((emp) => {
                      const empActiveTasks = tasks.filter((t) => t.owner === emp.id && t.status !== "Completed").length;
                      const maxLimit = settings.maxTasksPerEmployee || 5;
                      const percent = Math.min(100, Math.round((empActiveTasks / maxLimit) * 100));
                      const isSelected = emp.id === selectedEmpId;
                      
                      let barCol = "#16a34a"; // Low
                      if (empActiveTasks >= maxLimit) barCol = "#dc2626"; // High
                      else if (empActiveTasks >= Math.max(1, Math.round(maxLimit * 0.6))) barCol = "#f59e0b"; // Medium

                      return (
                        <div
                          key={emp.id}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: isSelected ? "#f5f3ff" : "#f9fafb",
                            border: isSelected ? "1px solid #c7d2fe" : "1px solid #f3f4f6",
                            transition: "all 0.15s"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <div>
                              <span style={{ fontSize: 12.5, fontWeight: isSelected ? 700 : 600, color: isSelected ? "#4f46e5" : "#111827" }}>
                                {emp.name}
                              </span>
                              {isSelected && (
                                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", background: "#eef2ff", color: "#4f46e5", borderRadius: 100, marginLeft: 6, border: "1px solid #c7d2fe" }}>
                                  Balancing
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>
                              {empActiveTasks} / {maxLimit} Active
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ flex: 1, height: 6, background: "#e5e7eb", borderRadius: 100, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${percent}%`, background: barCol, borderRadius: 100, transition: "width 0.3s ease" }} />
                            </div>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6b7280", width: 28, textAlign: "right" }}>
                              {percent}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* AI Suggestion footer banner */}
              {(() => {
                const helperLoads = employees.map(emp => ({
                  id: emp.id,
                  name: emp.name,
                  role: emp.role,
                  activeCount: tasks.filter(t => t.owner === emp.id && t.status !== "Completed").length
                }));
                const potentialHelpers = helperLoads.filter(h => h.id !== selectedEmpId && h.activeCount < (settings.maxTasksPerEmployee || 5));
                const bestHelpers = [...potentialHelpers].sort((a, b) => a.activeCount - b.activeCount);
                
                if (bestHelpers.length > 0 && tasks.filter((t) => t.owner === selectedEmpId && t.status !== "Completed").length > 0) {
                  return (
                    <div style={{ marginTop: 16, display: "flex", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <Sparkles size={16} style={{ color: "#7c3aed", flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.4 }}>
                        <strong>AI Recommendation:</strong> Lower pressure on this employee by reassigning tasks to <strong>{bestHelpers[0].name}</strong> ({bestHelpers[0].role}) who is currently underloaded with only {bestHelpers[0].activeCount} active task(s).
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Action Buttons footer */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, paddingTop: 14, borderTop: "1px solid #f3f4f6" }}>
                <button
                  type="button"
                  onClick={handleAutoBalance}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(124, 58, 237, 0.25)";
                  }}
                >
                  <Sparkles size={14} />
                  Run AI Auto-Balancer
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowBalancer(false);
                    setBalancerMessage(null);
                  }}
                  style={{
                    background: "#f3f4f6",
                    color: "#4b5563",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}