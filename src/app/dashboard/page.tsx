"use client";

import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import RiskOverview from "@/components/dashboard/RiskOverview";
import ProjectHealthChart from "@/components/dashboard/ProjectHealthChart";
import BottleneckOverview from "@/components/dashboard/BottleneckOverview";

import { useData } from "@/context/DataContext";
import { calculateRiskReport } from "@/lib/riskEngine";
import {
  FolderKanban, CheckSquare, AlertTriangle, BarChart2,
  ArrowRight, ShieldCheck, AlertCircle,
  Network, Bot, GitBranch,
} from "lucide-react";

export default function DashboardPage() {
  const { employees, projects, tasks, decisions, dependencies, settings } = useData();
  const report = calculateRiskReport(employees, projects, tasks, dependencies, decisions, settings);
  const projectRisks  = Object.values(report.projectRisks);
  const employeeLoads = Object.values(report.employeeLoads);

  return (
    <MainLayout>
      <div style={{ maxWidth: 1140, margin: "0 auto" }} className="fade-in">

        {/* ── Header ── */}
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: "-0.03em" }}>
              Overview
            </h1>
            <p style={{ marginTop: 3, fontSize: 13, color: "var(--text-muted)", margin: "3px 0 0" }}>
              Organization health · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 11px",
                background: "var(--green-light)", border: "1px solid var(--green-mid)",
                borderRadius: 6, fontSize: 12, fontWeight: 500, color: "var(--green)",
              }}
            >
              <span className="pulse-dot" />
              Sync active
            </div>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          <StatsCard title="Projects" value={String(report.stats.totalProjects)} icon={FolderKanban} variant="violet" subtitle="active" />
          <Link href="/projects?showTasks=true" style={{ textDecoration: "none" }}>
            <div style={{ cursor: "pointer" }} title="Click to view all tasks">
              <StatsCard title="Tasks" value={String(report.stats.totalTasks)} icon={CheckSquare} variant="cyan" subtitle="across all projects" />
            </div>
          </Link>
          <StatsCard
            title="Overloaded"
            value={String(report.stats.overloadedEmployeesCount)}
            icon={AlertTriangle}
            variant={report.stats.overloadedEmployeesCount > 0 ? "rose" : "emerald"}
            subtitle="members at risk"
          />
          <StatsCard
            title="Avg Risk"
            value={String(report.stats.averageRiskScore)}
            icon={BarChart2}
            variant={report.stats.averageRiskScore > 60 ? "rose" : report.stats.averageRiskScore > 35 ? "amber" : "emerald"}
            subtitle="out of 100"
          />
        </div>

        {/* ── Chart Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <ProjectHealthChart projectRisks={projectRisks} />
          <RiskOverview projectRisks={projectRisks} />
        </div>

        {/* ── Bottom Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <BottleneckOverview employeeLoads={employeeLoads} />

          {/* Critical Pipeline */}
          <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  Critical Pipeline
                </p>
                <span
                  style={{
                    fontSize: 10.5, fontWeight: 500, padding: "2px 7px",
                    borderRadius: 4,
                    background: "var(--red-light)", color: "var(--red)",
                    border: "1px solid var(--red-mid)",
                  }}
                >
                  Blocked
                </span>
              </div>

              <div
                style={{
                  display: "flex", alignItems: "center", flexWrap: "wrap",
                  gap: 6, padding: "12px 14px",
                  background: "var(--bg-muted)", border: "1px solid var(--border)",
                  borderRadius: 6,
                }}
              >
                {[
                  { label: "Auth", color: "var(--red)", bg: "var(--red-light)", border: "var(--red-mid)" },
                  { label: "API Deploy", color: "var(--yellow)", bg: "var(--yellow-light)", border: "var(--yellow-mid)" },
                  { label: "Frontend", color: "var(--blue)", bg: "var(--blue-light)", border: "var(--blue-mid)" },
                  { label: "Launch", color: "var(--green)", bg: "var(--green-light)", border: "var(--green-mid)" },
                ].map((step, i, arr) => (
                  <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 11.5, fontWeight: 500,
                        padding: "3px 9px", borderRadius: 5,
                        background: step.bg, color: step.color,
                        border: `1px solid ${step.border}`,
                      }}
                    >
                      {step.label}
                    </span>
                    {i < arr.length - 1 && (
                      <ArrowRight size={11} style={{ color: "var(--text-xmuted)" }} />
                    )}
                  </div>
                ))}
              </div>

              <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>Authentication</span>{" "}
                is blocking downstream deployment in Project Phoenix, pushing the launch timeline by an estimated 3–5 days.
              </p>
            </div>

            <Link
              href="/dependencies"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                marginTop: 14, fontSize: 12.5, fontWeight: 500,
                color: "var(--accent)", textDecoration: "none",
              }}
            >
              View dependency graph <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* ── Quick Nav ── */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11.5, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
            Quick Access
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { href: "/digital-twin", label: "Digital Twin", desc: "Visualize org graph", icon: Network },
              { href: "/copilot",      label: "AI Copilot",   desc: "Ask your org anything", icon: Bot },
              { href: "/bottlenecks",  label: "Bottlenecks",  desc: "Capacity analysis", icon: GitBranch },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  borderRadius: 8, textDecoration: "none",
                  transition: "border-color 0.12s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-mid)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: "var(--accent-light)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <a.icon size={14} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{a.label}</p>
                    <p style={{ margin: 0, fontSize: 11.5, color: "var(--text-muted)" }}>{a.desc}</p>
                  </div>
                </div>
                <ArrowRight size={13} style={{ color: "var(--text-xmuted)" }} />
              </Link>
            ))}
          </div>
        </div>

        {/* ── AI Insights ── */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
              Recommendations
            </p>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {report.recommendations.length} alerts
            </span>
          </div>

          {report.recommendations.length === 0 ? (
            <div
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px",
                background: "var(--green-light)", border: "1px solid var(--green-mid)",
                borderRadius: 6, fontSize: 12.5, color: "var(--green)",
              }}
            >
              <ShieldCheck size={14} />
              All systems are healthy — no active recommendations.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {report.recommendations.map((rec, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "9px 12px",
                    background: "var(--bg-muted)", border: "1px solid var(--border)",
                    borderRadius: 6, fontSize: 12.5, color: "var(--text-secondary)",
                  }}
                >
                  <AlertCircle size={13} style={{ color: "var(--accent)", marginTop: 1, flexShrink: 0 }} />
                  <span style={{ lineHeight: 1.55 }}>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}