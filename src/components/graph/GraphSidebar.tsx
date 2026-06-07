"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  AlertTriangle, 
  ShieldAlert, 
  Award, 
  Clock, 
  Play, 
  RefreshCw, 
  Edit2, 
  Save, 
  Trash2, 
  X,
  User, 
  Briefcase, 
  CheckCircle2, 
  Calendar, 
  Percent, 
  BarChart4,
  Activity,
  ChevronRight,
  Bot,
  Network
} from "lucide-react";

interface Props {
  selectedNode: any;
  onSimulate: (id: string) => void;
  simulatedNodeId: string | null;
  onClearSimulation: () => void;
  simulatedDelayDays: number;
  setSimulatedDelayDays: (days: number) => void;
}

export default function GraphSidebar({
  selectedNode,
  onSimulate,
  simulatedNodeId,
  onClearSimulation,
  simulatedDelayDays,
  setSimulatedDelayDays,
}: Props) {
  const { employees, projects, tasks, updateTask, updateEmployee, updateProject, deleteTask } = useData();

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form fields
  const [editLabel, setEditLabel] = useState("");
  const [editOwner, setEditOwner] = useState(""); // Employee ID for tasks, owner name for projects
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editProgress, setEditProgress] = useState(0);
  const [editDueDate, setEditDueDate] = useState("");

  // Reset edit state when selected node changes
  useEffect(() => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
    if (selectedNode) {
      const data = selectedNode.data;
      setEditLabel(data.label || "");
      
      // If task, match owner by name to employee id
      if (selectedNode.type === "taskNode") {
        const emp = employees.find(e => e.name === data.owner);
        setEditOwner(emp?.id || employees[0]?.id || "");
        setEditStatus(data.status || "Pending");
        setEditProgress(data.progress || 0);
        setEditDueDate(data.dueDate || "2026-06-15");
      } else if (selectedNode.type === "employeeNode") {
        setEditRole(data.role || "");
      } else if (selectedNode.type === "projectNode") {
        setEditOwner(data.owner || "");
      }
    }
  }, [selectedNode, employees]);



  if (!selectedNode) {
    return (
      <div style={{
        width: 360,
        background: "#ffffff",
        borderLeft: "1px solid #e2e8f0",
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "-8px 0 24px rgba(0,0,0,0.01)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyCenter: "center", flexShrink: 0, border: "1px solid #e2e8f0" }}>
              <Bot className="text-slate-500 mx-auto" size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                AI Graph Inspector
              </h2>
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginTop: "2px" }}>Live Intelligence</span>
            </div>
          </div>

          {/* Empty Illustration */}
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", border: "1px solid #c7d2fe" }}>
              <Network size={20} className="text-indigo-600 animate-pulse" />
            </div>
            <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>No Node Selected</h3>
            <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5", margin: 0, padding: "0 10px" }}>
              Click any employee, project, or task in the graph to view live logs, blockages, workloads, and AI recommendations.
            </p>
          </div>

          {/* Capabilities */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.06em", display: "block" }}>Available Inspections</span>
            {[
              { title: "Timeline Simulation", desc: "Simulate custom project delays and trace blockers.", icon: Clock, color: "#d97706", bg: "#fef3c7" },
              { title: "Capacity Tracking", desc: "Monitor team workload metrics and balance.", icon: AlertTriangle, color: "#e11d48", bg: "#fff1f2" },
              { title: "AI Recovery Suggestions", desc: "Get specific mitigation ideas to resolve bottlenecks.", icon: Bot, color: "#2563eb", bg: "#eff6ff" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "start", padding: "10px", borderRadius: "8px", background: "#f8fafc" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={12} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#0f172a", margin: 0 }}>{item.title}</h4>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0", lineHeight: "1.4" }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>Live Sync</span>
          </div>
          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#94a3b8" }}>v1.2.0</span>
        </div>
      </div>
    );
  }

  const data = selectedNode.data;
  const nodeType = selectedNode.type;
  const isThisNodeSimulating = simulatedNodeId === selectedNode.id;

  const handleSave = () => {
    if (nodeType === "taskNode") {
      updateTask(selectedNode.id, {
        title: editLabel,
        owner: editOwner,
        status: editStatus as any,
        progress: Number(editProgress),
        dueDate: editDueDate,
      });
    } else if (nodeType === "employeeNode") {
      updateEmployee(selectedNode.id, {
        name: editLabel,
        role: editRole,
      });
    } else if (nodeType === "projectNode") {
      updateProject(selectedNode.id, {
        name: editLabel,
      });
    }

    setIsEditing(false);
  };

  // Badge dynamic style mapping
  const badgeConfig = {
    employeeNode: { label: "Employee", bg: "#e0e7ff", text: "#4338ca", border: "#c7d2fe" },
    projectNode: { label: "Project", bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
    taskNode: { label: "Task", bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
  }[nodeType as "employeeNode" | "projectNode" | "taskNode"] || { label: "Node", bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" };

  return (
    <div style={{
      width: 360,
      background: "#ffffff",
      borderLeft: "1px solid #e2e8f0",
      padding: "24px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxShadow: "-8px 0 24px rgba(0,0,0,0.01)"
    }} className="fade-in">
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
        
        {/* Header Block */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              width: "fit-content",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              border: `1px solid ${badgeConfig.border}`,
              background: badgeConfig.bg,
              color: badgeConfig.text
            }}>
              {badgeConfig.label}
            </span>
            
            {!isEditing ? (
              <h2 style={{ fontSize: "16px", fontWeight: 750, color: "#0f172a", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.25 }}>
                {data.label}
              </h2>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.04em" }}>Edit Title / Name</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#0f172a",
                    outline: "none"
                  }}
                />
              </div>
            )}

            <div style={{ fontSize: "10.5px", fontFamily: "var(--font-mono)", color: "#94a3b8" }}>
              ID: <span style={{ fontWeight: 600, color: "#64748b" }}>{selectedNode.id}</span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              background: isEditing ? "#fff5f5" : "#ffffff",
              color: isEditing ? "#e11d48" : "#475569",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title={isEditing ? "Cancel Edit" : "Edit Node"}
          >
            {isEditing ? <X size={14} /> : <Edit2 size={14} />}
          </button>
        </div>

        {/* Node Specifications */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", margin: "0 0 4px" }}>
            Specifications
          </h3>
          
          {!isEditing ? (
            // VIEW MODE (Flat Key Value Layout)
            <div style={{ display: "flex", flexDirection: "column" }}>
              <DetailRow
                title="Owner / Assignee"
                value={data.owner || "Not Assigned"}
                icon={<User size={12} />}
              />

              {data.role && (
                <DetailRow
                  title="Job Role"
                  value={data.role}
                  icon={<Briefcase size={12} />}
                />
              )}

              {/* Risk Level Row */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #f1f5f9"
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: 500, color: "#64748b" }}>
                  <AlertTriangle size={12} style={{ color: data.risk === "High" ? "#e11d48" : data.risk === "Medium" ? "#d97706" : "#10b981" }} />
                  Risk Rating
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "100px",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    background: data.risk === "High" ? "#fff1f2" : data.risk === "Medium" ? "#fef3c7" : "#ecfdf5",
                    color: data.risk === "High" ? "#e11d48" : data.risk === "Medium" ? "#b45309" : "#047857",
                    border: `1px solid ${data.risk === "High" ? "#fecdd3" : data.risk === "Medium" ? "#fde68a" : "#a7f3d0"}`
                  }}
                >
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: data.risk === "High" ? "#e11d48" : data.risk === "Medium" ? "#d97706" : "#10b981" }} />
                  {data.risk || "Low"}
                </span>
              </div>

              <DetailRow
                title="Status"
                value={data.status || "Healthy"}
                icon={<CheckCircle2 size={12} />}
              />

              {data.dueDate && (
                <DetailRow
                  title="Due Date"
                  value={data.dueDate}
                  icon={<Calendar size={12} />}
                />
              )}

              {/* Progress Slider Display */}
              {data.progress !== undefined && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "10px 0",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500, color: "#64748b" }}>
                      <Percent size={12} className="text-indigo-500" />
                      Progress
                    </span>
                    <span style={{ fontWeight: 700, color: "#0f172a", fontFamily: "var(--font-mono)" }}>{data.progress}%</span>
                  </div>
                  <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
                    <div 
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
                        width: `${data.progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Workload Indicator */}
              {data.workload !== undefined && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "10px 0",
                  borderBottom: "1px solid #f1f5f9"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500, color: "#64748b" }}>
                      <BarChart4 size={12} className="text-violet-500" />
                      Workload
                    </span>
                    <span style={{ fontWeight: 700, color: "#0f172a", fontFamily: "var(--font-mono)" }}>{data.workload}%</span>
                  </div>
                  <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
                    <div 
                      style={{
                        height: "100%",
                        background: data.workload > 85 ? "linear-gradient(90deg, #ef4444, #dc2626)" : "linear-gradient(90deg, #6366f1, #4f46e5)",
                        width: `${data.workload}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            // EDIT MODE FORM
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
              {nodeType === "taskNode" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.04em" }}>Assignee</label>
                    <select
                      value={editOwner}
                      onChange={(e) => setEditOwner(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        fontSize: "12px",
                        outline: "none"
                      }}
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.04em" }}>Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        fontSize: "12px",
                        outline: "none"
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 705, color: "#64748b" }}>
                      <span>Progress completion</span>
                      <span style={{ color: "#4f46e5" }}>{editProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editProgress}
                      onChange={(e) => setEditProgress(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#4f46e5", height: "4px", cursor: "pointer" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.04em" }}>Due Date</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        fontSize: "12px",
                        outline: "none"
                      }}
                    />
                  </div>
                </>
              )}

              {nodeType === "employeeNode" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.04em" }}>Job Role / Title</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "12px",
                      outline: "none"
                    }}
                  />
                </div>
              )}

              {nodeType === "projectNode" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.04em" }}>Lead Owner</label>
                  <input
                    type="text"
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "12px",
                      outline: "none"
                    }}
                  />
                </div>
              )}

              {/* Edit Form Actions */}
              <div style={{ display: "flex", gap: "6px", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                {showDeleteConfirm ? (
                  <div style={{ width: "100%", background: "#fff5f5", border: "1px solid #fecdd3", borderRadius: "8px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px" }}>
                    <span style={{ color: "#e11d48", fontWeight: 600 }}>Confirm Delete?</span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (nodeType === "taskNode") {
                            deleteTask(selectedNode.id);
                          }
                          setIsEditing(false);
                          setShowDeleteConfirm(false);
                        }}
                        style={{
                          background: "#e11d48",
                          color: "#ffffff",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "10.5px",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        style={{
                          background: "#e2e8f0",
                          color: "#475569",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "10.5px",
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      style={{
                        flex: 1,
                        background: "#4f46e5",
                        color: "#ffffff",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <Save size={12} /> Save
                    </button>
                    
                    {nodeType === "taskNode" && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        style={{
                          padding: "6px 10px",
                          background: "#fff5f5",
                          color: "#e11d48",
                          border: "1px solid #fecdd3",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        title="Delete Task"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Timeline Impact Delay Simulation (only active simulator) */}
        {nodeType !== "employeeNode" && isThisNodeSimulating && !isEditing && (
          <div style={{
            position: "relative",
            overflow: "hidden",
            background: "#fffbeb",
            borderLeft: "3px solid #f59e0b",
            borderRadius: "0 8px 8px 0",
            padding: "16px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
          }}>
            <h3 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#78350f", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "flex", height: "8px", width: "8px", position: "relative" }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", height: "4px", width: "4px", background: "#d97706", margin: "2px" }}></span>
              </span>
              Simulate Delay
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: 700, color: "#451a03" }}>
                <span>Timeline Slippage:</span>
                <span style={{ fontFamily: "var(--font-mono)", background: "#f59e0b", color: "#ffffff", padding: "1px 6px", borderRadius: "4px", fontSize: "10.5px", border: "1px solid #d97706", fontWeight: 700 }}>
                  +{simulatedDelayDays} {simulatedDelayDays === 1 ? "Day" : "Days"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={simulatedDelayDays}
                onChange={(e) => setSimulatedDelayDays(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#d97706", cursor: "pointer", height: "4px", background: "#fef3c7", borderRadius: "4px", outline: "none" }}
              />
              <p style={{ fontSize: "11px", color: "#78350f", opacity: 0.8, lineHeight: "1.45", fontWeight: 500, margin: 0 }}>
                Adjust slider to preview downstream timeline slippage across the map.
              </p>
            </div>
          </div>
        )}

        {/* Impact Analysis (Only for projects and tasks) */}
        {nodeType !== "employeeNode" && !isEditing && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", margin: 0 }}>
              Impact Analysis
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { label: "Projects Affected", value: data.impact?.projectsAffected || 1, color: "#0f172a" },
                { label: "Teams Affected", value: data.impact?.teamsAffected || 2, color: "#0f172a" },
                { label: "Est. Delay Risk", value: `+${isThisNodeSimulating ? simulatedDelayDays : (data.impact?.delay || 5)} Days`, color: "#b45309" },
                { label: "Risk Increase", value: `+${isThisNodeSimulating ? Math.min(60, simulatedDelayDays * 4) : (data.impact?.riskIncrease || 18)}%`, color: "#be123c" }
              ].map((c, i) => (
                <div key={i} style={{
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  padding: "10px 12px",
                  borderRadius: "8px",
                }}>
                  <span style={{ display: "block", marginBottom: "2px", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.04em" }}>
                    {c.label}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: "13px", color: c.color, letterSpacing: "-0.01em" }}>
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insight & Recommendations */}
        {!isEditing && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* AI Insight */}
            <div style={{
              background: "#f8fafc",
              borderLeft: "3px solid #6366f1",
              borderRadius: "0 8px 8px 0",
              padding: "16px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.01)"
            }}>
              <h3 style={{ color: "#1e293b", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", margin: "0 0 8px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <Award size={12} style={{ color: "#6366f1" }} />
                AI Insight
              </h3>
              <p style={{ color: "#475569", lineHeight: "1.5", fontSize: "12px", fontWeight: 500, margin: 0 }}>
                {data.aiInsight}
              </p>
            </div>

            {/* Recommendation */}
            <div style={{
              background: "#f0fdf4",
              borderLeft: "3px solid #10b981",
              borderRadius: "0 8px 8px 0",
              padding: "16px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.01)"
            }}>
              <h3 style={{ color: "#1e293b", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", margin: "0 0 8px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <Clock size={12} style={{ color: "#10b981" }} />
                Recommendation
              </h3>
              <p style={{ color: "#047857", lineHeight: "1.5", fontSize: "12px", fontWeight: 500, margin: 0 }}>
                {data.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button at bottom */}
      {nodeType !== "employeeNode" && !isEditing && (
        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
          {isThisNodeSimulating ? (
            <button
              onClick={onClearSimulation}
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #f97316, #d97706)",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "12px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 2px 4px rgba(249,115,22,0.1)",
                transition: "all 0.15s ease"
              }}
            >
              <RefreshCw size={14} />
              Reset Simulation
            </button>
          ) : (
            <button
              onClick={() => onSimulate(selectedNode.id)}
              style={{
                width: "100%",
                background: "#4f46e5",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "12px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 2px 4px rgba(79,70,229,0.1)",
                transition: "all 0.15s ease"
              }}
            >
              <Play size={12} style={{ color: "#ffffff", fill: "#ffffff" }} />
              Simulate Delay Impact
            </button>
          )}
          <p style={{ color: "#94a3b8", fontSize: "10px", textAlign: "center", marginTop: "8px", lineHeight: "1.4", fontWeight: 500 }}>
            Trace blocked paths and preview launch timeline cascades.
          </p>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #f1f5f9"
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: 500, color: "#64748b" }}>
        {icon}
        {title}
      </span>
      <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>{value}</span>
    </div>
  );
}