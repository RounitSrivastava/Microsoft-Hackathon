"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban,
  Users,
  MessageSquare,
  X,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useData } from "@/context/DataContext";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const pageBreadcrumbs: Record<string, { section?: string; title: string }> = {
  "/dashboard":    { title: "Dashboard" },
  "/projects":     { section: "Resources", title: "Projects" },
  "/employees":    { section: "Resources", title: "Employees" },
  "/bottlenecks":  { section: "Intelligence", title: "Bottlenecks" },
  "/dependencies": { section: "Intelligence", title: "Dependencies" },
  "/digital-twin": { section: "Intelligence", title: "Digital Twin" },
  "/decisions":    { title: "Decisions" },
  "/meetings":     { title: "Meetings" },
  "/copilot":      { section: "Tools", title: "AI Copilot" },
  "/settings":     { section: "Tools", title: "Settings" },
  "/profile":      { title: "Profile" },
};

export default function Navbar() {
  const pathname = usePathname();
  const crumb = pageBreadcrumbs[pathname] ?? { title: "OrgMind" };
  const { employees, projects, settings, profile, addEmployee, deleteEmployee } = useData();

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Software Engineer");
  const [addError, setAddError] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { setAddError("Name is required."); return; }
    addEmployee(newName.trim(), newRole);
    setNewName("");
    setNewRole("Software Engineer");
    setAddError("");
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header
      style={{
        height: 48,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#ffffff",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {crumb.section && (
          <>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}>
              {crumb.section}
            </span>
            <ChevronRight size={12} style={{ color: "var(--text-xmuted)" }} />
          </>
        )}
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
          {crumb.title}
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Integration badges */}
        {settings?.teamsEnabled && (
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 8px",
              background: "var(--bg-muted)", border: "1px solid var(--border)",
              borderRadius: 5, fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 500,
            }}
            title="Microsoft Teams Connected"
          >
            <MessageSquare size={10} />Teams
          </span>
        )}
        {settings?.githubEnabled && (
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 8px",
              background: "var(--bg-muted)", border: "1px solid var(--border)",
              borderRadius: 5, fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 500,
            }}
            title="GitHub Connected"
          >
            <GithubIcon style={{ width: 10, height: 10 }} />GitHub
          </span>
        )}

        {/* Context pills */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 10px",
            background: "var(--bg-muted)", border: "1px solid var(--border)",
            borderRadius: 5, fontSize: 12, color: "var(--text-secondary)",
          }}
        >
          <FolderKanban size={11} style={{ color: "var(--accent)" }} />
          <span>{projects.length} projects</span>
        </div>

        <button
          onClick={() => setShowMembersModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 10px",
            background: "var(--bg-muted)", border: "1px solid var(--border)",
            borderRadius: 5, fontSize: 12, color: "var(--text-secondary)",
            cursor: "pointer", transition: "border-color 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-mid)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <Users size={11} style={{ color: "var(--accent)" }} />
          <span>{employees.length} members</span>
        </button>

        {/* Live indicator */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 9px",
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 5, fontSize: 11.5, color: "#16a34a", fontWeight: 500,
          }}
        >
          <span className="pulse-dot" />
          <span>Live</span>
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 2px" }} />

        {/* Avatar */}
        <Link
          href="/profile"
          style={{
            width: 28, height: 28,
            borderRadius: 6,
            background: profile?.avatarBg || "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 10.5, fontWeight: 600,
            textDecoration: "none", letterSpacing: "0.02em",
            transition: "opacity 0.12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          title={`Profile: ${profile?.name}`}
        >
          {profile?.name
            ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
            : "RS"}
        </Link>
      </div>

      {/* Members Modal */}
      {showMembersModal && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100,
          }}
          className="fade-in"
        >
          <div
            className="card"
            style={{
              width: 460, background: "#fff",
              padding: "20px 22px",
              position: "relative", display: "flex", flexDirection: "column",
              maxHeight: "82vh",
            }}
          >
            <button
              onClick={() => { setShowMembersModal(false); setSearchQuery(""); }}
              style={{
                position: "absolute", top: 14, right: 14,
                background: "transparent", border: "none",
                cursor: "pointer", color: "var(--text-muted)", padding: 4,
                borderRadius: 4, display: "flex",
              }}
            >
              <X size={15} />
            </button>

            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 3px" }}>
                Team Members
              </h2>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0 }}>
                Manage workspace members and access.
              </p>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: 9, color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ width: "100%", padding: "7px 10px 7px 30px", fontSize: 13 }}
              />
            </div>

            {/* Members List */}
            <div
              style={{
                flex: 1, overflowY: "auto",
                display: "flex", flexDirection: "column", gap: 2,
                marginBottom: 16, minHeight: 140, maxHeight: 280,
              }}
            >
              {filteredEmployees.map((emp) => {
                const initials = emp.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <div
                    key={emp.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: 6, border: "1px solid transparent",
                      transition: "background 0.1s, border-color 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--bg-muted)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: "var(--accent-light)", color: "var(--accent)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 600, flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                          {emp.name}
                        </p>
                        <p style={{ margin: 0, fontSize: 11.5, color: "var(--text-muted)" }}>{emp.role}</p>
                      </div>
                    </div>

                    {pendingDeleteId === emp.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontSize: 11.5, color: "var(--red)", fontWeight: 500 }}>Remove?</span>
                        <button
                          type="button"
                          onClick={() => { deleteEmployee(emp.id); setPendingDeleteId(null); }}
                          style={{
                            background: "var(--red-light)", color: "var(--red)",
                            border: "1px solid var(--red-mid)",
                            padding: "3px 8px", borderRadius: 5, fontSize: 11.5, fontWeight: 500, cursor: "pointer",
                          }}
                        >Yes</button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(null)}
                          style={{
                            background: "var(--bg-muted)", color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                            padding: "3px 8px", borderRadius: 5, fontSize: 11.5, fontWeight: 500, cursor: "pointer",
                          }}
                        >No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPendingDeleteId(emp.id)}
                        style={{
                          background: "transparent", border: "none",
                          cursor: "pointer", color: "var(--text-xmuted)",
                          padding: 5, borderRadius: 4, display: "flex",
                          transition: "color 0.1s, background 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--red)";
                          (e.currentTarget as HTMLElement).style.background = "var(--red-light)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--text-xmuted)";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
              {filteredEmployees.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", padding: "20px 0" }}>
                  No members found.
                </p>
              )}
            </div>

            {/* Add Member Form */}
            <form
              onSubmit={handleQuickAdd}
              style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}
            >
              <p style={{ margin: 0, fontSize: 11.5, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Add Member
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text" placeholder="Full name"
                  value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="input-field"
                  style={{ flex: 1, padding: "7px 10px", fontSize: 13 }}
                />
                <select
                  value={newRole} onChange={(e) => setNewRole(e.target.value)}
                  className="input-field"
                  style={{ width: 150, padding: "7px 10px", fontSize: 13, cursor: "pointer" }}
                >
                  <option>Software Engineer</option>
                  <option>Backend Engineer</option>
                  <option>Frontend Engineer</option>
                  <option>Engineering Lead</option>
                  <option>Product Manager</option>
                  <option>QA Specialist</option>
                  <option>Marketing Lead</option>
                </select>
                <button type="submit" className="btn-primary" style={{ padding: "7px 12px", display: "flex", alignItems: "center" }}>
                  <Plus size={14} />
                </button>
              </div>
              {addError && (
                <p style={{ margin: 0, fontSize: 12, color: "var(--red)", display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={12} /> {addError}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </header>
  );
}