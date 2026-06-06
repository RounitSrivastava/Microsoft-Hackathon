"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/context/DataContext";
import { Calendar, Users, FileText, Sparkles, Plus, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

export default function MeetingsPage() {
  const { meetings, employees, projects, addMeeting, addDecision } = useData();

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("2026-06-04");
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  // AI Extractor states
  const [transcript, setTranscript] = useState("");
  const [extractorTargetProject, setExtractorTargetProject] = useState(projects[0]?.id || "p1");
  const [extractedCount, setExtractedCount] = useState<number | null>(null);
  const [extractedItems, setExtractedItems] = useState<string[]>([]);
  const [extractorError, setExtractorError] = useState("");

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      setFormError("Please enter a meeting title.");
      return;
    }
    if (selectedAttendees.length === 0) {
      setFormError("Please select at least one attendee.");
      return;
    }

    addMeeting(meetingTitle, meetingDate, selectedAttendees);
    setMeetingTitle("");
    setSelectedAttendees([]);
    setFormError("");
    setShowAddForm(false);
  };

  const handleToggleAttendee = (empId: string) => {
    setSelectedAttendees((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const handleExtractDecisions = () => {
    if (!transcript.trim()) {
      setExtractorError("Please paste some meeting transcript or notes first.");
      return;
    }

    // Dynamic extraction logic
    // Split transcript by sentences (period, question mark, exclamation, or newline)
    const sentences = transcript
      .split(/[.!?\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 8);

    const decisionsExtracted: string[] = [];

    // Decision indicators
    const decisionKeywords = [
      "decide", "decided", "decision", 
      "agree", "agreed", "agreement", 
      "approve", "approved", "approval",
      "conclude", "concluded", "must do",
      "will lead", "will take over", "assign to"
    ];

    sentences.forEach((sentence) => {
      const lower = sentence.toLowerCase();
      const isDecision = decisionKeywords.some((keyword) => lower.includes(keyword));

      if (isDecision) {
        // Clean quotation marks or prefixes
        let cleanText = sentence.replace(/^["'-*\s]+/, "");
        cleanText = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
        decisionsExtracted.push(cleanText);

        // Save decision to state context
        addDecision(cleanText, extractorTargetProject, "2026-06-04");
      }
    });

    if (decisionsExtracted.length > 0) {
      setExtractedCount(decisionsExtracted.length);
      setExtractedItems(decisionsExtracted);
      setTranscript("");
      setExtractorError("");
    } else {
      setExtractorError("No explicit decisions found. Try including keywords like 'decided', 'agreed', or 'approved'.");
      setExtractedCount(null);
    }

    setTimeout(() => {
      setExtractedCount(null);
    }, 10000);
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
              Meetings Log
            </h1>
            <p style={{ marginTop: 6, fontSize: 14, color: "#6b7280", margin: "6px 0 0" }}>
              Track team alignments and run AI analytics to extract decisions directly into pipelines.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
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
            <Plus size={15} /> Log Meeting
          </button>
        </div>

        {/* Main Grid: Left side meetings list, Right side AI Decision Extractor */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "flex-start" }}>
          
          {/* LEFT: Meetings List & Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {showAddForm && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                  Record New Alignment Meeting
                </h3>
                <form onSubmit={handleAddMeeting} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Phoenix Retrospective Sync"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="input-field"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="input-field"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 }}>
                      Select Attendees
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 120, overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: 8, padding: 10, background: "#fff" }}>
                      {employees.map((emp) => (
                        <label key={emp.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={selectedAttendees.includes(emp.id)}
                            onChange={() => handleToggleAttendee(emp.id)}
                            className="rounded accent-indigo-600"
                          />
                          {emp.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  {formError && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#dc2626", fontWeight: 500 }}>
                      <AlertCircle size={14} /> {formError}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
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
                      Save Meeting
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Meetings list cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {meetings.map((m) => (
                <div key={m.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: "#111827" }}>{m.title}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af", marginTop: 4, fontFamily: "monospace" }}>
                        <Calendar size={13} />
                        <span>{m.date}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: "#f3f4f6", color: "#4b5563", padding: "3px 9px", borderRadius: 100 }}>
                      ID: {m.id}
                    </span>
                  </div>

                  {/* Attendees */}
                  <div style={{ borderTop: "1px solid #f9fafb", paddingTop: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      Attendees ({m.attendees.length})
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {m.attendees.map((aid) => {
                        const emp = employees.find((e) => e.id === aid);
                        if (!emp) return null;
                        return (
                          <div
                            key={aid}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "4px 10px",
                              background: "#f0f2f5",
                              borderRadius: 6,
                              fontSize: 12,
                              color: "#374151",
                              fontWeight: 600,
                            }}
                          >
                            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#4f46e5", color: "#fff", fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                              {emp.name.slice(0, 1).toUpperCase()}
                            </span>
                            {emp.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {meetings.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
                  <FileText size={24} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
                  No meetings logged yet. Click "Log Meeting" to register one.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: AI Decision Extractor */}
          <div className="card" style={{ padding: 24, background: "#ffffff", borderTop: "4px solid #7c3aed" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Sparkles size={18} style={{ color: "#7c3aed" }} />
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>
                AI Decision Extractor
              </h3>
            </div>

            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, margin: "0 0 16px" }}>
              Paste transcripts, chat exports, or meeting summaries below. The AI parses the context to extract actionable project decisions and logs them directly.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>
                  Target Project mapping
                </label>
                <select
                  value={extractorTargetProject}
                  onChange={(e) => setExtractorTargetProject(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      Project {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>
                  Transcript / Meeting Notes Input
                </label>
                <textarea
                  placeholder='e.g., "Sarah agreed that she will complete database migration by Friday. The team decided that we will launch Phoenix on June 25 after code review."'
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", height: 140, padding: "10px 12px", borderRadius: 8, fontSize: 13, fontFamily: "inherit", resize: "none" }}
                />
              </div>

              {extractorError && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#dc2626", fontWeight: 500 }}>
                  <AlertCircle size={14} /> {extractorError}
                </div>
              )}

              {extractedCount !== null && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#16a34a", fontWeight: 700 }}>
                    <CheckCircle2 size={16} /> Successfully extracted {extractedCount} decisions!
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 22 }}>
                    {extractedItems.map((item, idx) => (
                      <span key={idx} style={{ fontSize: 12, color: "#15803d" }} className="flex items-center gap-1">
                        <ChevronRight size={10} /> "{item}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleExtractDecisions}
                className="btn-primary"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", fontSize: 13.5, background: "#7c3aed" }}
              >
                <Sparkles size={15} /> Extract Decisions
              </button>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
