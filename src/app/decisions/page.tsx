"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/context/DataContext";
import { Calendar, FileText, Sparkles, Plus, AlertCircle } from "lucide-react";

export default function DecisionsPage() {
  const { decisions, projects, meetings, addDecision } = useData();

  // Form State
  const [decisionText, setDecisionText] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "p1");
  const [decisionDate, setDecisionDate] = useState("2026-06-04");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionText.trim()) {
      setError("Please write down the decision statement.");
      return;
    }
    addDecision(decisionText, projectId, decisionDate);
    setDecisionText("");
    setError("");
    setShowForm(false);
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
              Decision Mapping
            </h1>
            <p style={{ marginTop: 6, fontSize: 14, color: "#6b7280", margin: "6px 0 0" }}>
              Audit trailing decisions extracted directly from organizational meetings and team alignments.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
              transition: "all 0.12s",
            }}
          >
            <Plus size={15} /> Log New Decision
          </button>
        </div>

        {/* Create Decision Form Inline Panel */}
        {showForm && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
              Log Decision Alignment
            </h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                  Decision Statement
                </label>
                <input
                  type="text"
                  placeholder='e.g., "Deploy v4 core libraries on production on June 20"'
                  value={decisionText}
                  onChange={(e) => setDecisionText(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                    Related Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
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
                    Date of Decision
                  </label>
                  <input
                    type="date"
                    value={decisionDate}
                    onChange={(e) => setDecisionDate(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14 }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#dc2626", fontWeight: 500 }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 6, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
                  Record Decision
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Decisions Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {decisions.map((dec) => {
            const project = projects.find((p) => p.id === dec.projectId);
            const meetingName = meetings.find((m) => m.id === dec.meetingId)?.title || "General Alignment";

            return (
              <div
                key={dec.id}
                className="card"
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: 6,
                        background: "#eef2ff",
                        color: "#4f46e5",
                        border: "1px solid #c7d2fe",
                      }}
                    >
                      Project: {project?.name || "Global"}
                    </span>
                    <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "'JetBrains Mono', monospace" }}>
                      ID: {dec.id}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111827",
                      margin: 0,
                      lineHeight: 1.5,
                                          }}
                  >
                    "{dec.decision}"
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                    borderTop: "1px solid #f3f4f6",
                    fontSize: 12,
                    color: "#6b7280",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <FileText size={13} style={{ color: "#9ca3af" }} />
                    <span>Source: <strong style={{ color: "#374151" }}>{meetingName}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                    <Calendar size={13} style={{ color: "#9ca3af" }} />
                    <span>{dec.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Insight Box */}
        <div
          className="card"
          style={{
            padding: 24,
            background: "#fbfbfe",
            borderLeft: "4px solid #7c3aed",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} style={{ color: "#7c3aed" }} />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>
              AI Decision Intelligence
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: "#4b5563", lineHeight: 1.6 }}>
            Decisions are mapped directly to project delivery pipelines. OrgMind monitors new alignments and warns if a logged date target (e.g., target launch windows) contradicts actual resource availability and critical path dependencies calculated in the digital twin.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}