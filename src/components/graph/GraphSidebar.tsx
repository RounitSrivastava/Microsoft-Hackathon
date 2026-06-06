"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { AlertTriangle, ShieldAlert, Award, Clock, Play, RefreshCw, Edit2, Save, Trash2, X } from "lucide-react";

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
      <div className="w-96 bg-white border-l border-slate-200 p-6 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-slate-900 text-lg font-bold flex items-center gap-2">
            <ShieldAlert className="text-indigo-600" size={20} />
            OrgMind Intelligence
          </h2>

          <p className="text-slate-500 text-sm mt-4 leading-relaxed">
            Select any node in the Digital Twin graph to analyze project health, trace dependency impact pipelines, see workforce bottlenecks, and view AI recommendations.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1 font-bold">Status Panel</span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
            <span className="w-2 height-2 rounded-full bg-emerald-500 inline-block" /> ✓ System fully synchronized
          </span>
        </div>
      </div>
    );
  }

  const data = selectedNode.data;
  const nodeType = selectedNode.type;
  const isThisNodeSimulating = simulatedNodeId === selectedNode.id;

  const handleSave = () => {
    if (nodeType === "taskNode") {
      // Find employee name from selected ID
      const emp = employees.find(e => e.id === editOwner);
      
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

  return (
    <div className="w-96 bg-white border-l border-slate-200 p-6 overflow-y-auto flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
              {nodeType === "employeeNode" ? "Employee Node" : nodeType === "projectNode" ? "Project Node" : "Task Node"}
            </span>
            
            {!isEditing ? (
              <h2 className="text-xl text-slate-900 font-bold mt-3 leading-tight">
                {data.label}
              </h2>
            ) : (
              <div className="mt-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Edit Name / Title</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <p className="text-slate-400 text-xs mt-1">
              ID: <span className="font-mono">{selectedNode.id}</span>
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              color: isEditing ? "#ef4444" : "#4b5563",
            }}
            title={isEditing ? "Cancel Edit" : "Edit Node"}
          >
            {isEditing ? <X size={14} /> : <Edit2 size={14} />}
          </button>
        </div>

        {/* Basic Details Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Details</h3>
          
          {/* Edit / View fields */}
          {!isEditing ? (
            // VIEW MODE
            <>
              <DetailRow
                title="Owner / Assignee"
                value={data.owner || "Not Assigned"}
              />

              {data.role && (
                <DetailRow
                  title="Job Role"
                  value={data.role}
                />
              )}

              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Risk Level</p>
                <span
                  className={`inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    data.risk === "High"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : data.risk === "Medium"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {data.risk || "Low"}
                </span>
              </div>

              <DetailRow
                title="Status"
                value={data.status || "Healthy"}
              />

              {data.dueDate && (
                <DetailRow
                  title="Due Date"
                  value={data.dueDate}
                />
              )}

              {data.progress !== undefined && (
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${data.progress}%` }} />
                    </div>
                    <span className="text-slate-900 text-xs font-bold font-mono">{data.progress}%</span>
                  </div>
                </div>
              )}

              {data.workload !== undefined && (
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Workload Allocation</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full ${data.risk === "High" ? "bg-rose-500" : "bg-indigo-600"}`} style={{ width: `${data.workload}%` }} />
                    </div>
                    <span className="text-slate-900 text-xs font-bold font-mono">{data.workload}%</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            // EDIT MODE FORM
            <div className="space-y-3 text-slate-800">
              {nodeType === "taskNode" && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Assignee</label>
                    <select
                      value={editOwner}
                      onChange={(e) => setEditOwner(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    >
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                      <span>Progress</span>
                      <span>{editProgress}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editProgress}
                      onChange={(e) => setEditProgress(Number(e.target.value))}
                      className="w-full mt-1 accent-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Due Date</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                </>
              )}

              {nodeType === "employeeNode" && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Job Role / Title</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                  />
                </div>
              )}

              {nodeType === "projectNode" && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Lead Owner</label>
                  <input
                    type="text"
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {showDeleteConfirm ? (
                  <div className="w-full bg-rose-50 border border-rose-100 rounded-lg p-2 flex items-center justify-between text-xs animate-fade-in" style={{ border: "1px solid #fecaca" }}>
                    <span className="text-rose-700 font-medium">Delete this task?</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (nodeType === "taskNode") {
                            deleteTask(selectedNode.id);
                          }
                          setIsEditing(false);
                          setShowDeleteConfirm(false);
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded font-semibold text-[10px]"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded font-semibold text-[10px]"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Save size={13} /> Save Changes
                    </button>
                    
                    {nodeType === "taskNode" && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-center transition"
                        title="Delete Task"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delay Simulation Slider (if node is currently active simulator source) */}
        {nodeType !== "employeeNode" && isThisNodeSimulating && !isEditing && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-orange-800 mb-2">
              Adjust Simulated Delay
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-orange-900 font-semibold">
                <span>Timeline Impact:</span>
                <span className="font-mono bg-orange-100 px-2 py-0.5 rounded border border-orange-200">+{simulatedDelayDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={simulatedDelayDays}
                onChange={(e) => setSimulatedDelayDays(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer h-2 bg-orange-200 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-orange-700 block leading-snug">
                Drag the slider to adjust task slippage and recalculate launch target dates dynamically.
              </span>
            </div>
          </div>
        )}

        {/* Impact Analysis (Only for projects and tasks) */}
        {nodeType !== "employeeNode" && !isEditing && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Impact Analysis</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-0.5 text-[9px] uppercase font-bold">Projects Affected</span>
                <span className="text-slate-800 font-bold text-sm">
                  {data.impact?.projectsAffected || 1}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-0.5 text-[9px] uppercase font-bold">Teams Affected</span>
                <span className="text-slate-800 font-bold text-sm">
                  {data.impact?.teamsAffected || 2}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-0.5 text-[9px] uppercase font-bold">Est. Delay Risk</span>
                <span className="text-orange-600 font-bold text-sm">
                  +{isThisNodeSimulating ? simulatedDelayDays : (data.impact?.delay || 5)} Days
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-0.5 text-[9px] uppercase font-bold">Risk Increase</span>
                <span className="text-rose-600 font-bold text-sm">
                  +{isThisNodeSimulating ? Math.min(60, simulatedDelayDays * 4) : (data.impact?.riskIncrease || 18)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* AI Insight & Recommendations */}
        {!isEditing && (
          <div className="space-y-3">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs">
              <h3 className="text-indigo-700 font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                <Award size={14} />
                AI Insight
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {data.aiInsight}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs">
              <h3 className="text-emerald-700 font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                <Clock size={14} />
                Recommendation
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {data.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button at bottom */}
      {nodeType !== "employeeNode" && !isEditing && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          {isThisNodeSimulating ? (
            <button
              onClick={onClearSimulation}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm font-semibold text-sm"
            >
              <RefreshCw size={16} />
              Reset Delay Simulation
            </button>
          ) : (
            <button
              onClick={() => onSimulate(selectedNode.id)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm font-semibold text-sm"
            >
              <Play size={16} style={{ fill: "#fff" }} />
              Simulate Delay Impact
            </button>
          )}
          <p className="text-slate-400 text-[10px] text-center mt-2.5 leading-snug font-medium">
            Highlight downstream paths and preview launch timeline slips across the entire digital twin map.
          </p>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">
        {title}
      </p>
      <p className="text-slate-800 font-semibold text-sm mt-0.5">
        {value}
      </p>
    </div>
  );
}