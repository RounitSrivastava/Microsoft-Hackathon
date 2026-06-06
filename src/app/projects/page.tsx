"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/context/DataContext";
import { calculateRiskReport } from "@/lib/riskEngine";
import {
  FolderKanban, AlertCircle, CheckCircle2, ShieldAlert,
  TrendingUp, Users, Plus, X, Trash2
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

export default function ProjectsPage() {
  const { employees, projects, tasks, decisions, dependencies, settings, addTask, updateTask, deleteTask } = useData();
  
  // Calculate risk engine report dynamically
  const report = calculateRiskReport(employees, projects, tasks, dependencies, decisions, settings);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskOwner, setTaskOwner] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskStatus, setTaskStatus] = useState<"Pending" | "In Progress" | "Blocked" | "Completed">("Pending");
  const [taskDueDate, setTaskDueDate] = useState("2026-06-15");
  const [taskProgress, setTaskProgress] = useState(0);
  const [parentDep, setParentDep] = useState(""); // Task that blocks this task
  const [error, setError] = useState("");

  // All Tasks interactive list modal
  const [showAllTasksModal, setShowAllTasksModal] = useState(false);
  const [allTasksSearch, setAllTasksSearch] = useState("");

  // Sync state values with loaded async records from database context
  useEffect(() => {
    if (employees.length > 0 && !taskOwner) {
      setTaskOwner(employees[0].id);
    }
  }, [employees, taskOwner]);

  useEffect(() => {
    if (projects.length > 0 && !taskProject) {
      setTaskProject(projects[0].id);
    }
  }, [projects, taskProject]);

  // Trigger All Tasks Modal if redirected from dashboard with showTasks=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("showTasks") === "true") {
        setShowAllTasksModal(true);
        // Clean up URL parameter to avoid reopening modal on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [tasks]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setError("Task title is required.");
      return;
    }

    addTask(
      {
        title: taskTitle,
        owner: taskOwner || employees[0]?.id || "",
        project: taskProject || projects[0]?.id || "",
        status: taskStatus,
        dueDate: taskDueDate,
        progress: Number(taskProgress),
      },
      parentDep ? [parentDep] : []
    );

    // Reset Form
    setTaskTitle("");
    setParentDep("");
    setTaskProgress(0);
    setTaskStatus("Pending");
    if (employees.length > 0) setTaskOwner(employees[0].id);
    if (projects.length > 0) setTaskProject(projects[0].id);
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
              Projects
            </h1>
            <p style={{ marginTop: 3, fontSize: 13, color: "var(--text-muted)", margin: "3px 0 0" }}>
              {projects.length} active · delivery health &amp; risk tracking
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={13} /> New task
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          <StatsCard title="Active Projects" value={String(projects.length)}   icon={FolderKanban} variant="violet" subtitle="in progress" />
          <div onClick={() => setShowAllTasksModal(true)} style={{ cursor: "pointer" }} title="Click to view all tasks">
            <StatsCard title="Total Tasks"     value={String(tasks.length)}      icon={TrendingUp}   variant="cyan"   subtitle="across all projects" />
          </div>
          <StatsCard title="Team Members"    value={String(employees.length)}  icon={Users}        variant="emerald" subtitle="contributors" />
        </div>

        {/* Project Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {projects.map((proj) => {
            const riskReport   = report.projectRisks[proj.id];
            const projectTasks = tasks.filter((t) => t.project === proj.id);
            const completedTasks = projectTasks.filter((t) => t.status === "Completed").length;

            const isHigh   = riskReport?.riskLevel === "High";
            const isMedium = riskReport?.riskLevel === "Medium";

            const accentColor  = isHigh ? "#dc2626" : isMedium ? "#ca8a04" : "#16a34a";
            const accentBg     = isHigh ? "#fef2f2" : isMedium ? "#fefce8" : "#f0fdf4";
            const accentBorder = isHigh ? "#fecaca" : isMedium ? "#fde68a" : "#bbf7d0";
            const barColor     = isHigh ? "#dc2626" : isMedium ? "#f59e0b" : "#16a34a";
            const progressVal  = riskReport?.progress || 0;

            const ownerName = proj.id === "p1" ? "Rounit Srivastava" : "Abhishek Kumar";

            return (
              <div
                key={proj.id}
                className="card"
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  borderLeft: `3px solid ${accentColor}`,
                }}
              >
                {/* Top */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: accentBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${accentBorder}`,
                        flexShrink: 0,
                      }}
                    >
                      <FolderKanban size={18} style={{ color: accentColor }} />
                    </div>
                    <div>
                      <h2
                        style={{
                                                    fontWeight: 700,
                          fontSize: 17,
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        Project {proj.name}
                      </h2>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
                        #{proj.id}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: accentBg,
                      color: accentColor,
                      border: `1px solid ${accentBorder}`,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {riskReport?.riskLevel || "Low"} Risk
                  </span>
                </div>

                {/* Owner row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: "#f9fafb",
                    border: "1px solid #f3f4f6",
                    borderRadius: 8,
                  }}
                >
                  <Users size={12} style={{ color: "#6b7280" }} />
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Owner:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
                    {ownerName}
                  </span>
                </div>

                {/* Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Risk Score",   value: `${riskReport?.riskScore || 0}`, sub: "/100", color: accentColor },
                    { label: "Completed",    value: `${completedTasks}/${projectTasks.length}`, sub: "",     color: "#4f46e5" },
                    { label: "Blocked",      value: String(riskReport?.blockedCount || 0),  sub: "", color: (riskReport?.blockedCount || 0) > 0 ? "#dc2626" : "#16a34a" },
                    { label: "Overdue",      value: String(riskReport?.overdueCount || 0),  sub: "", color: (riskReport?.overdueCount || 0) > 0 ? "#ca8a04" : "#16a34a" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        padding: "10px 12px",
                        background: "#f9fafb",
                        border: "1px solid #f3f4f6",
                        borderRadius: 8,
                        textAlign: "center",
                      }}
                    >
                      <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 5px" }}>{s.label}</p>
                      <p style={{ fontSize: 17, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace", margin: 0, lineHeight: 1 }}>
                        {s.value}<span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 400 }}>{s.sub}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 12 }}>
                    <span style={{ color: "#6b7280" }}>Overall Completion</span>
                    <span style={{ fontWeight: 700, color: accentColor, fontFamily: "'JetBrains Mono', monospace" }}>
                      {progressVal}%
                    </span>
                  </div>
                  <div style={{ height: 7, background: "#f3f4f6", borderRadius: 100, overflow: "hidden" }}>
                    <div
                      className="progress-fill"
                      style={{ height: "100%", width: `${progressVal}%`, background: barColor, borderRadius: 100 }}
                    />
                  </div>
                </div>

                {/* Actionable Task List Manager */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto", borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af", margin: "0 0 6px" }}>Task Pipeline Manager</p>
                  
                  {projectTasks.map((t) => {
                    const taskOwnerName = employees.find(e => e.id === t.owner)?.name || "Unassigned";

                    return (
                      <div 
                        key={t.id} 
                        style={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          gap: 6, 
                          padding: "10px 12px", 
                          background: "#f9fafb", 
                          border: "1px solid #f3f4f6", 
                          borderRadius: 8,
                          marginBottom: 2 
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, color: "#374151", fontSize: 12.5 }}>{t.title}</span>
                          <button
                            onClick={() => deleteTask(t.id)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}
                            title="Delete Task"
                          >
                            <Trash2 size={12} className="hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                          {/* Owner Initials */}
                          <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Owner: {taskOwnerName}</span>
                          
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {/* Status Selector */}
                            <select
                              value={t.status}
                              onChange={(e) => updateTask(t.id, { status: e.target.value as any })}
                              style={{ 
                                padding: "2px 4px", 
                                fontSize: 10, 
                                borderRadius: 5, 
                                border: "1px solid #e5e7eb", 
                                background: "#fff", 
                                cursor: "pointer",
                                color: "#374151",
                                fontWeight: 600
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Blocked">Blocked</option>
                              <option value="Completed">Completed</option>
                            </select>

                            {/* Progress Slider */}
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={t.progress}
                                onChange={(e) => updateTask(t.id, { progress: Number(e.target.value) })}
                                style={{ width: 44, accentColor: "#4f46e5", height: 3, cursor: "pointer" }}
                              />
                              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", minWidth: 26, textAlign: "right", color: "#4b5563" }}>
                                {t.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {projectTasks.length === 0 && (
                    <span style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", padding: "10px 0" }}>
                      No tasks found in this project.
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div style={{ paddingTop: 12, borderTop: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 5 }}>
                  {(riskReport?.overdueCount || 0) > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#dc2626" }}>
                      <AlertCircle size={13} />
                      {riskReport.overdueCount} task(s) are overdue.
                    </div>
                  )}
                  {(riskReport?.blockedCount || 0) > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#ca8a04" }}>
                      <ShieldAlert size={13} />
                      {riskReport.blockedCount} bottleneck(s) in task pipeline.
                    </div>
                  )}
                  {(!riskReport?.overdueCount) && (!riskReport?.blockedCount) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#16a34a" }}>
                      <CheckCircle2 size={13} />
                      All tasks on schedule — no blockers detected.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
                width: 480,
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
                Create New Task
              </h2>

              <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                    Task Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Integrate Payment Gateway"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14 }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Project
                    </label>
                    <select
                      value={taskProject}
                      onChange={(e) => setTaskProject(e.target.value)}
                      className="input-field"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          Project {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Assignee
                    </label>
                    <select
                      value={taskOwner}
                      onChange={(e) => setTaskOwner(e.target.value)}
                      className="input-field"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Status
                    </label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value as any)}
                      className="input-field"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="input-field"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14 }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Progress (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taskProgress}
                      onChange={(e) => setTaskProgress(Number(e.target.value))}
                      className="input-field"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Blocked By (Dependency)
                    </label>
                    <select
                      value={parentDep}
                      onChange={(e) => setParentDep(e.target.value)}
                      className="input-field"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}
                    >
                      <option value="">None</option>
                      {tasks
                        .filter((t) => t.project === taskProject)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title} ({t.id})
                          </option>
                        ))}
                    </select>
                  </div>
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
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* All Tasks Modal */}
        {showAllTasksModal && (
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
              className="card animate-fade-in"
              style={{
                width: 680,
                background: "#ffffff",
                padding: 24,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                maxHeight: "85vh",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: 12,
              }}
            >
              <button
                onClick={() => {
                  setShowAllTasksModal(false);
                  setAllTasksSearch("");
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

              <h2
                style={{
                  margin: "0 0 4px",
                                    fontWeight: 700,
                  fontSize: 18,
                  color: "#111827",
                }}
              >
                All Workspace Tasks
              </h2>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
                Browse, search, and manage all task items in flight across all portfolio projects.
              </p>

              {/* Search input */}
              <div style={{ position: "relative", marginBottom: 16 }}>
                <input
                  type="text"
                  placeholder="Search tasks by title, owner, or project..."
                  value={allTasksSearch}
                  onChange={(e) => setAllTasksSearch(e.target.value)}
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
              </div>

              {/* Tasks List Container */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  paddingRight: 4,
                  minHeight: 200,
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f3f4f6", textAlign: "left" }}>
                      {["Task", "Project", "Assignee", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "8px 12px",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#9ca3af",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tasks
                      .filter((t) => {
                        const title = t?.title || "";
                        const status = t?.status || "";
                        const ownerName = employees.find(e => e.id === t?.owner)?.name || "";
                        const projName = projects.find(p => p.id === t?.project)?.name || "";
                        const query = allTasksSearch.toLowerCase();
                        return (
                          title.toLowerCase().includes(query) ||
                          ownerName.toLowerCase().includes(query) ||
                          projName.toLowerCase().includes(query) ||
                          status.toLowerCase().includes(query)
                        );
                      })
                      .map((t) => {
                        const owner = employees.find(e => e.id === t.owner);
                        const proj = projects.find(p => p.id === t.project);

                        const isCompleted = t.status === "Completed";
                        const isBlocked = t.status === "Blocked";
                        const isProgress = t.status === "In Progress";
                        
                        const statusColor = isCompleted ? "#16a34a" : isBlocked ? "#dc2626" : isProgress ? "#2563eb" : "#4b5563";
                        const statusBg = isCompleted ? "#f0fdf4" : isBlocked ? "#fef2f2" : isProgress ? "#eff6ff" : "#f3f4f6";

                        return (
                          <tr key={t.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                            <td style={{ padding: "10px 12px" }}>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{t.title}</p>
                              <p style={{ margin: "2px 0 0", fontSize: 10, color: "#9ca3af", fontFamily: "'JetBrains Mono', monospace" }}>{t.id}</p>
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 12.5, fontWeight: 500, color: "#4b5563" }}>
                              {proj ? `Project ${proj.name}` : "Unassigned"}
                            </td>
                            <td style={{ padding: "10px 12px", fontSize: 12.5, color: "#4b5563" }}>
                              {owner ? owner.name : "Unassigned"}
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span style={{
                                fontSize: 10.5,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 100,
                                background: statusBg,
                                color: statusColor,
                                textTransform: "uppercase",
                                letterSpacing: "0.03em",
                              }}>
                                {t.status}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <button
                                onClick={() => deleteTask(t.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#9ca3af",
                                  padding: 4,
                                  borderRadius: 4,
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
                                title="Delete Task"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    {tasks.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: "24px 12px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                          No tasks recorded in workspace.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}