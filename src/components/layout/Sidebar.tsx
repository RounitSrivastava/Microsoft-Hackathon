"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
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
  const router = useRouter();
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
        overflow: "hidden",
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
            width: 30,
            height: 30,
            borderRadius: 8,
            overflow: "hidden",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
          }}
        >
          <Image
            src="/orgmind-logo.png"
            alt="OrgMind Logo"
            width={30}
            height={30}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 14,
              color: "var(--text-primary)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
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
                fontWeight: 650,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--sidebar-text)",
                padding: "0 8px",
                marginBottom: 6,
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
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 13,
                    color: isActive ? "var(--accent-text)" : "var(--sidebar-text)",
                    background: isActive ? "var(--sidebar-active-bg)" : "transparent",
                    transition: "background 0.1s ease, color 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover)";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
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
                    style={{ color: isActive ? "var(--accent-text)" : "var(--sidebar-text)", flexShrink: 0 }}
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
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Live sync indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 10px",
            background: "var(--bg-base)",
            borderRadius: 6,
            border: "1px solid var(--sidebar-border)",
          }}
        >
          <span className="pulse-dot" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--sidebar-text)", lineHeight: 1.3, margin: 0 }}>
            Live sync active
          </p>
        </div>

        {/* Logout button */}
        <button
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "8px 10px",
            background: "transparent",
            border: "1px solid transparent",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-muted)",
            transition: "all 0.15s ease",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fff1f2";
            (e.currentTarget as HTMLElement).style.borderColor = "#fecdd3";
            (e.currentTarget as HTMLElement).style.color = "#e11d48";
            const icon = (e.currentTarget as HTMLElement).querySelector(".logout-icon") as HTMLElement;
            if (icon) icon.style.color = "#e11d48";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            const icon = (e.currentTarget as HTMLElement).querySelector(".logout-icon") as HTMLElement;
            if (icon) icon.style.color = "var(--text-muted)";
          }}
        >
          <LogOut
            size={14}
            className="logout-icon"
            style={{ color: "var(--text-muted)", flexShrink: 0, transition: "color 0.15s ease" }}
          />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}