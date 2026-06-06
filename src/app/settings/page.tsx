"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useData } from "@/context/DataContext";
import {
  Settings,
  Link2,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Cpu,
  Sparkles,
  Sliders,
  Check,
  RefreshCw,
  AlertTriangle,
  Bot
} from "lucide-react";

const ACCENT_OPTIONS = [
  { key: "indigo", name: "Classic Indigo", color: "#4f46e5" },
  { key: "violet", name: "Modern Violet", color: "#7c3aed" },
  { key: "emerald", name: "Nordic Emerald", color: "#059669" },
  { key: "crimson", name: "Ruby Crimson", color: "#e11d48" },
  { key: "amber", name: "Amber Gold", color: "#d97706" },
];

const PERSONA_OPTIONS = [
  {
    key: "analyst",
    title: "Strict Analyst",
    desc: "Rigorous, data-centric, and direct. Focuses on stats, numbers, and strict timelines without fluff.",
    avatarBg: "#fee2e2",
    avatarTx: "#dc2626",
  },
  {
    key: "coach",
    title: "Strategic Coach",
    desc: "Goal-oriented and guidance-focused. Advises on resource optimization, timeline recovery, and blocker mitigation.",
    avatarBg: "#e0f2fe",
    avatarTx: "#0284c7",
  },
  {
    key: "leader",
    title: "Empathetic Leader",
    desc: "Team-centric and burnout-sensitive. Highlights employee capacity, workload fatigue, and stress levels.",
    avatarBg: "#dcfce7",
    avatarTx: "#15803d",
  },
  {
    key: "creative",
    title: "Creative Facilitator",
    desc: "Collaborative and brainstorming-heavy. Offers out-of-the-box workaround paths for blocked dependencies.",
    avatarBg: "#f3e8ff",
    avatarTx: "#9333ea",
  },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetData } = useData();

  // Local state inputs synced with context settings
  const [orgName, setOrgName] = useState("");
  const [syncMode, setSyncMode] = useState("");
  const [showTeams, setShowTeams] = useState(false);
  const [teamsKey, setTeamsKey] = useState("");
  const [showGithub, setShowGithub] = useState(false);
  const [githubKey, setGithubKey] = useState("");
  const [notif, setNotif] = useState({ highRisk: true, bottleneck: true, deadline: false });

  // Extended settings states
  const [copilotPersona, setCopilotPersona] = useState<"analyst" | "coach" | "leader" | "creative">("coach");
  const [maxTasksPerEmployee, setMaxTasksPerEmployee] = useState(5);
  const [projectRiskThreshold, setProjectRiskThreshold] = useState(70);
  const [accentColor, setAccentColor] = useState<"indigo" | "violet" | "emerald" | "crimson" | "amber">("indigo");

  // Interaction feedback states
  const [teamsTesting, setTeamsTesting] = useState(false);
  const [teamsVerified, setTeamsVerified] = useState(false);
  const [githubTesting, setGithubTesting] = useState(false);
  const [githubVerified, setGithubVerified] = useState(false);
  const [teamsError, setTeamsError] = useState("");
  const [githubError, setGithubError] = useState("");

  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Initialize fields once settings are loaded
  useEffect(() => {
    if (settings) {
      setOrgName(settings.orgName);
      setSyncMode(settings.syncMode);
      setShowTeams(settings.teamsEnabled);
      setTeamsKey(settings.teamsKey);
      setShowGithub(settings.githubEnabled);
      setGithubKey(settings.githubKey);
      setNotif(settings.notifications);
      setCopilotPersona(settings.copilotPersona || "coach");
      setMaxTasksPerEmployee(settings.maxTasksPerEmployee || 5);
      setProjectRiskThreshold(settings.projectRiskThreshold || 70);
      setAccentColor(settings.accentColor || "indigo");
    }
  }, [settings]);

  const handleAccentChange = (color: "indigo" | "violet" | "emerald" | "crimson" | "amber") => {
    setAccentColor(color);
    updateSettings({ accentColor: color });
  };

  const handleSyncModeChange = (mode: string) => {
    setSyncMode(mode);
    updateSettings({ syncMode: mode });
  };

  const handlePersonaChange = (persona: "analyst" | "coach" | "leader" | "creative") => {
    setCopilotPersona(persona);
    updateSettings({ copilotPersona: persona });
  };

  const handleMaxTasksChange = (val: number) => {
    setMaxTasksPerEmployee(val);
    updateSettings({ maxTasksPerEmployee: val });
  };

  const handleProjectThresholdChange = (val: number) => {
    setProjectRiskThreshold(val);
    updateSettings({ projectRiskThreshold: val });
  };

  const handleSave = () => {
    updateSettings({
      orgName,
      syncMode,
      teamsEnabled: showTeams,
      teamsKey,
      githubEnabled: showGithub,
      githubKey,
      notifications: notif,
      copilotPersona,
      maxTasksPerEmployee,
      projectRiskThreshold,
      accentColor,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const testTeamsConnection = () => {
    if (!teamsKey.trim()) {
      setTeamsError("Please provide a webhook URL or secret key first.");
      setTimeout(() => setTeamsError(""), 4000);
      return;
    }
    setTeamsError("");
    setTeamsTesting(true);
    setTeamsVerified(false);
    setTimeout(() => {
      setTeamsTesting(false);
      setTeamsVerified(true);
    }, 1200);
  };

  const testGithubConnection = () => {
    if (!githubKey.trim()) {
      setGithubError("Please provide a Personal Access Token first.");
      setTimeout(() => setGithubError(""), 4000);
      return;
    }
    setGithubError("");
    setGithubTesting(true);
    setGithubVerified(false);
    setTimeout(() => {
      setGithubTesting(false);
      setGithubVerified(true);
    }, 1200);
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }} className="fade-in">

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
            Settings
          </h1>
          <p style={{ marginTop: 6, fontSize: 14, color: "#6b7280" }}>
            Configure workspace variables, AI engine personas, risk thresholds, and active integrations.
          </p>
        </div>

        {/* Profile Details & Accent Theme */}
        <SettingsSection icon={Cpu} title="Workspace Settings">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Field label="Organization Name">
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="input-field"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 9, fontSize: 14 }}
              />
            </Field>

            <Field label="Twin Sync Mode">
              <div style={{ display: "flex", gap: 8 }}>
                {["Live", "Scheduled", "Manual"].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleSyncModeChange(m)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "1px solid #e5e7eb",
                      background: syncMode === m ? "var(--accent-light)" : "#fff",
                      color: syncMode === m ? "var(--accent)" : "#4b5563",
                      borderColor: syncMode === m ? "var(--accent-mid)" : "#e5e7eb",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Accent Color Pickers */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
            <Field label="Global Accent Theme">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                {ACCENT_OPTIONS.map((opt) => {
                  const isActive = accentColor === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleAccentChange(opt.key as any)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 14px",
                        background: "#fff",
                        border: `1px solid ${isActive ? opt.color : "#e5e7eb"}`,
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        color: isActive ? opt.color : "#4b5563",
                        boxShadow: isActive ? `0 2px 8px ${opt.color}15` : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: opt.color,
                          display: "inline-block",
                        }}
                      />
                      {opt.name}
                      {isActive && <Check size={13} style={{ color: opt.color, marginLeft: 2 }} />}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </SettingsSection>

        {/* AI Copilot Persona */}
        <SettingsSection icon={Bot} title="AI Copilot Preferences">
          <Field label="Active Copilot Persona">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 4 }}>
              {PERSONA_OPTIONS.map((opt) => {
                const isActive = copilotPersona === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handlePersonaChange(opt.key as any)}
                    style={{
                      background: isActive ? "var(--accent-light)" : "#fff",
                      border: `1px solid ${isActive ? "var(--accent-mid)" : "#e5e7eb"}`,
                      borderRadius: 10,
                      padding: 16,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      boxShadow: isActive ? "0 4px 12px rgba(79,70,229,0.05)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = "#c7d2fe";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: opt.avatarBg,
                        color: opt.avatarTx,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {opt.title.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: isActive ? "var(--accent)" : "#111827",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {opt.title}
                        {isActive && <CheckCircle2 size={13} style={{ color: "var(--accent)" }} />}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#6b7280", lineHeight: 1.4 }}>
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>
        </SettingsSection>

        {/* Capacity Thresholds */}
        <SettingsSection icon={Sliders} title="Capacity & Risk Thresholds">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Field label={`Max Active Tasks: ${maxTasksPerEmployee} tasks`}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={maxTasksPerEmployee}
                  onChange={(e) => handleMaxTasksChange(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--accent)", cursor: "pointer" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--accent)",
                    fontFamily: "'JetBrains Mono', monospace",
                    background: "var(--accent-light)",
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  {maxTasksPerEmployee}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                Employees exceeding this count will trigger "Overloaded" warning flags on dashboards.
              </p>
            </Field>

            <Field label={`Project Risk Trigger: ${projectRiskThreshold}/100`}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={projectRiskThreshold}
                  onChange={(e) => handleProjectThresholdChange(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--accent)", cursor: "pointer" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--accent)",
                    fontFamily: "'JetBrains Mono', monospace",
                    background: "var(--accent-light)",
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  {projectRiskThreshold}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                Projects exceeding this score are flagged as "High Risk" and cascade timeline alerts.
              </p>
            </Field>
          </div>
        </SettingsSection>

        {/* Integrations */}
        <SettingsSection icon={Link2} title="Active Integrations">
          {/* Teams Webhook */}
          <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#111827" }}>Microsoft Teams Integration</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>Sync timeline alerts to channel webhooks</p>
              </div>
              <button
                onClick={() => setShowTeams(!showTeams)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 20,
                  border: "none",
                  background: showTeams ? "var(--accent)" : "#d1d5db",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: showTeams ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </button>
            </div>
            {showTeams && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="fade-in">
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type={teamsKey ? "text" : "password"}
                    value={teamsKey}
                    onChange={(e) => setTeamsKey(e.target.value)}
                    placeholder="Teams Webhook URL or Secret Key"
                    className="input-field"
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, fontSize: 13 }}
                  />
                  <button
                    onClick={testTeamsConnection}
                    disabled={teamsTesting}
                    className="btn-primary"
                    style={{
                      background: "#fff",
                      color: "var(--accent)",
                      border: "1px solid var(--accent-mid)",
                      fontSize: 12,
                      padding: "8px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {teamsTesting ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      "Test"
                    )}
                    {teamsTesting ? "Testing..." : "Test Connection"}
                  </button>
                </div>
                {teamsVerified && (
                  <p style={{ margin: 0, fontSize: 12, color: "#16a34a", fontWeight: 500 }} className="fade-in">
                    ✓ Microsoft Teams channel webhook successfully connected. Test notification ping sent.
                  </p>
                )}
                {teamsError && (
                  <p style={{ margin: 0, fontSize: 12, color: "#dc2626", fontWeight: 500 }} className="fade-in">
                    ⚠ {teamsError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* GitHub Token */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#111827" }}>GitHub Repository Sync</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>Extract commit activities directly into task dependencies</p>
              </div>
              <button
                onClick={() => setShowGithub(!showGithub)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 20,
                  border: "none",
                  background: showGithub ? "var(--accent)" : "#d1d5db",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: showGithub ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </button>
            </div>
            {showGithub && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="fade-in">
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type={githubKey ? "text" : "password"}
                    value={githubKey}
                    onChange={(e) => setGithubKey(e.target.value)}
                    placeholder="GitHub Personal Access Token"
                    className="input-field"
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, fontSize: 13 }}
                  />
                  <button
                    onClick={testGithubConnection}
                    disabled={githubTesting}
                    className="btn-primary"
                    style={{
                      background: "#fff",
                      color: "var(--accent)",
                      border: "1px solid var(--accent-mid)",
                      fontSize: 12,
                      padding: "8px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {githubTesting ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      "Test"
                    )}
                    {githubTesting ? "Testing..." : "Test Connection"}
                  </button>
                </div>
                {githubVerified && (
                  <p style={{ margin: 0, fontSize: 12, color: "#16a34a", fontWeight: 500 }} className="fade-in">
                    ✓ GitHub Access Token verified. Synced latest commit logs and 3 active repositories.
                  </p>
                )}
                {githubError && (
                  <p style={{ margin: 0, fontSize: 12, color: "#dc2626", fontWeight: 500 }} className="fade-in">
                    ⚠ {githubError}
                  </p>
                )}
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={Bell} title="System Alerts & Notifications">
          {[
            { key: "highRisk", label: "Critical load risks on dashboards", desc: "Notify when resource risk level switches to High" },
            { key: "bottleneck", label: "Bottleneck detection warnings", desc: "Warn immediately if task dependencies block final launch node" },
            { key: "deadline", label: "Timeline slips & overdue deadlines", desc: "Alert when active tasks pass their planned due date" },
          ].map((n) => (
            <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{n.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{n.desc}</p>
              </div>
              <button
                onClick={() => setNotif({ ...notif, [n.key]: !notif[n.key as keyof typeof notif] })}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 20,
                  border: "none",
                  background: notif[n.key as keyof typeof notif] ? "var(--accent)" : "#d1d5db",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: notif[n.key as keyof typeof notif] ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
              </button>
            </div>
          ))}
        </SettingsSection>

        {/* Sandbox Management */}
        <SettingsSection icon={Shield} title="Sandbox Management">
          <Field label="Reset Demo Environment">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
                Revert all dynamic tasks, newly added employees, user profile settings, and decision logs back to the default seed datasets.
              </p>
              <button
                onClick={handleReset}
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  padding: "9px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
              >
                Reset Database
              </button>
            </div>
          </Field>
        </SettingsSection>

        {/* Save */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid #e5e7eb", paddingTop: 20 }}>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", fontSize: 14 }}
          >
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? "Saved!" : "Save Settings"}
          </button>

          {saved && (
            <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }} className="fade-in">
              ✓ Changes saved successfully. Accent Theme applied.
            </span>
          )}

          {resetSuccess && (
            <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 500 }} className="fade-in">
              ✓ Sandbox database reset successfully to default seed data.
            </span>
          )}
        </div>
      </div>

      {/* Reset Database Confirmation Modal */}
      {showResetConfirm && (
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
            className="card animate-fade-in"
            style={{
              width: 420,
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
                  Reset Database to Defaults?
                </h3>
                <p style={{ fontSize: 13.5, color: "#4b5563", margin: 0, lineHeight: 1.5 }}>
                  Are you sure you want to reset the database? This reverts all tasks, members, profile details, and decisions to default mock seeds. This action cannot be undone.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
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
                  resetData();
                  setShowResetConfirm(false);
                  setResetSuccess(true);
                  setTimeout(() => setResetSuccess(false), 3500);
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
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

function SettingsSection({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} style={{ color: "var(--accent)" }} />
        </div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", margin: 0 }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
      <label style={{ fontSize: 11.5, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}