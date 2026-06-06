"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Network,
  GitBranch,
  Bot,
  Settings,
  AlertTriangle,
  FileText,
  Calendar,
  Activity,
} from "lucide-react";
import { useData } from "@/context/DataContext";

const groups = [
  {
    label: "Workspace",
    items: [
      { name: "Dashboard",    href: "/dashboard",   icon: LayoutDashboard },
      { name: "Decisions",    href: "/decisions",   icon: FileText },
      { name: "Meetings",     href: "/meetings",    icon: Calendar },
    ],
  },
  {
    label: "Resources",
    items: [
      { name: "Projects",     href: "/projects",    icon: FolderKanban },
      { name: "Employees",    href: "/employees",   icon: Users },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { name: "Bottlenecks",  href: "/bottlenecks",  icon: AlertTriangle },
      { name: "Dependencies", href: "/dependencies", icon: GitBranch },
      { name: "Digital Twin", href: "/digital-twin", icon: Network },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "AI Copilot",   href: "/copilot",     icon: Bot },
      { name: "Settings",     href: "/settings",    icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { settings } = useData();

  return (
    <aside
      style={{
        width: 220,
        height: "100%",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 30,
        overflowY: "auto",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: "16px 16px 14px",
          borderBottom: "1px solid var(--sidebar-border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Activity size={14} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            OrgMind
          </p>
          <p style={{ fontSize: 10.5, color: "var(--sidebar-text)", marginTop: 2, fontWeight: 400 }}>
            {settings?.orgName || "Org Intelligence"}
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom: 24 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#3d4663",
                padding: "0 8px",
                marginBottom: 4,
              }}
            >
              {group.label}
            </p>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 8px",
                    borderRadius: 6,
                    marginBottom: 1,
                    textDecoration: "none",
                    fontWeight: isActive ? 500 : 400,
                    fontSize: 13,
                    color: isActive ? "#ffffff" : "var(--sidebar-text)",
                    background: isActive ? "var(--sidebar-active-bg)" : "transparent",
                    transition: "background 0.1s ease, color 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover)";
                      (e.currentTarget as HTMLElement).style.color = "#d0d8f0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--sidebar-text)";
                    }
                  }}
                >
                  <Icon
                    size={14}
                    style={{ color: isActive ? "#8baeff" : "#3d4663", flexShrink: 0 }}
                    strokeWidth={isActive ? 2 : 1.75}
                  />
                  <span style={{ flex: 1 }}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "10px 8px 14px",
          borderTop: "1px solid var(--sidebar-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 10px",
            background: "#141824",
            borderRadius: 6,
            border: "1px solid var(--sidebar-border)",
          }}
        >
          <span className="pulse-dot" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: "#8b93a7", lineHeight: 1.3 }}>
              Live sync active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}