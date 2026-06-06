"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/context/DataContext";
import {
  User,
  Mail,
  Briefcase,
  FileText,
  Save,
  CheckCircle2,
  Calendar,
  Zap,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";

const AVATAR_BGS = [
  { key: "indigo", color: "#4f46e5", name: "Indigo" },
  { key: "violet", color: "#7c3aed", name: "Violet" },
  { key: "emerald", color: "#059669", name: "Emerald" },
  { key: "crimson", color: "#e11d48", name: "Crimson" },
  { key: "amber", color: "#d97706", name: "Amber" },
  { key: "slate", color: "#475569", name: "Slate" },
];

export default function ProfilePage() {
  const { profile, updateProfile, tasks, projects } = useData();

  // Local state inputs synced with profile context
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarBg, setAvatarBg] = useState("#4f46e5");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setRole(profile.role);
      setEmail(profile.email);
      setBio(profile.bio);
      setAvatarBg(profile.avatarBg);
    }
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      role,
      email,
      bio,
      avatarBg,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "RS";

  return (
    <MainLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }} className="fade-in">
        {/* Header */}
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
            User Profile
          </h1>
          <p style={{ marginTop: 6, fontSize: 14, color: "#6b7280" }}>
            Configure your personal details and view your dynamic workspace contributions.
          </p>
        </div>

        {/* Profile Content */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "flex-start" }}>
          
          {/* Left Column: Card Display & Edit Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Visual Avatar Card */}
            <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 24,
                  background: avatarBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 800,
                  boxShadow: `0 10px 25px ${avatarBg}30`,
                  marginBottom: 16,
                                  }}
              >
                {initials}
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, color: "#111827", margin: "0 0 4px" }}>
                {name}
              </h2>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)", margin: "0 0 6px" }}>
                {role}
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>
                {email}
              </p>
              <p style={{ fontSize: 12.5, color: "#4b5563", lineHeight: 1.5, margin: 0, background: "#f9fafb", padding: "10px 14px", borderRadius: 8, border: "1px solid #f3f4f6", width: "100%" }}>
                {bio || "No biography added yet."}
              </p>
            </div>

            {/* Custom Avatar Color Picker */}
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
                Avatar Color
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {AVATAR_BGS.map((bg) => (
                  <button
                    key={bg.key}
                    onClick={() => setAvatarBg(bg.color)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: bg.color,
                      border: avatarBg === bg.color ? "2px solid #111827" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "transform 0.15s",
                      outlineOffset: 2,
                    }}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Edit form and stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Edit details */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: "1px solid #f3f4f6", marginBottom: 20 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={14} style={{ color: "var(--accent)" }} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", margin: 0 }}>
                  Personal Information
                </h3>
              </div>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: "#4b5563" }}>Full Name</label>
                    <div style={{ position: "relative" }}>
                      <User size={14} style={{ position: "absolute", left: 12, top: 12, color: "#9ca3af" }} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: "#4b5563" }}>Job Role / Title</label>
                    <div style={{ position: "relative" }}>
                      <Briefcase size={14} style={{ position: "absolute", left: 12, top: 12, color: "#9ca3af" }} />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="input-field"
                        style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 8, fontSize: 13 }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: "#4b5563" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={14} style={{ position: "absolute", left: 12, top: 12, color: "#9ca3af" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 8, fontSize: 13 }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: "#4b5563" }}>Short Biography</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input-field"
                    rows={3}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 13, resize: "none", fontFamily: "inherit" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}
                  >
                    {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
                    {saved ? "Saved Details!" : "Save Changes"}
                  </button>
                  {saved && (
                    <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }} className="fade-in">
                      ✓ Profile details updated dynamically.
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Statistics Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tasks Guided</span>
                  <Zap size={14} style={{ color: "#f59e0b" }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#111827" }}>
                  {tasks.filter(t => t.status === "Completed").length + 2}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9ca3af" }}>completed in workspace</p>
              </div>

              <div className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Projects Led</span>
                  <Layers size={14} style={{ color: "var(--accent)" }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#111827" }}>
                  {projects.length}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9ca3af" }}>active portfolios</p>
              </div>

              <div className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Decision Audits</span>
                  <TrendingUp size={14} style={{ color: "#16a34a" }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#111827" }}>
                  18
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9ca3af" }}>transcripts extracted</p>
              </div>
            </div>

            {/* Timeline Activity */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: "1px solid #f3f4f6", marginBottom: 20 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Activity size={14} style={{ color: "var(--accent)" }} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", margin: 0 }}>
                  Recent System Activities
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    title: "Decisions Extracted from transcript",
                    desc: "Identified 3 action items from meeting transcript 'Project Phoenix Timeline Calibration'.",
                    time: "2 hours ago",
                    icon: FileText,
                    color: "#7c3aed",
                    bg: "#f5f3ff",
                  },
                  {
                    title: "Workspace Load balancer run",
                    desc: "Initiated auto-balancer shift. Successfully transferred 2 tasks from overloaded Rounit Srivastava to colleague.",
                    time: "1 day ago",
                    icon: Zap,
                    color: "#ca8a04",
                    bg: "#fefce8",
                  },
                  {
                    title: "Timeline slippage simulated",
                    desc: "Conducted cascade analysis for delay of task 'Authentication Review' on project launch path.",
                    time: "3 days ago",
                    icon: Activity,
                    color: "#dc2626",
                    bg: "#fef2f2",
                  },
                ].map((act, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: act.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <act.icon size={13} style={{ color: act.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827" }}>{act.title}</p>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{act.time}</span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}>{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}
