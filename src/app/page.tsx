"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Network, FolderKanban,
  GitBranch, ArrowRight, Activity, CheckSquare,
  Users, FileText, Bot, BarChart2, ShieldCheck,
  AlertTriangle, Zap, TrendingUp,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Copilot", href: "/copilot" },
];

const FEATURES = [
  {
    icon: Network,
    title: "Live Digital Twin",
    desc: "A real-time graph of your entire org — people, projects, tasks, and dependency chains visualized in one interactive view.",
    color: "#748ffc",
    bg: "rgba(116,143,252,0.08)",
    border: "rgba(116,143,252,0.2)",
  },
  {
    icon: GitBranch,
    title: "Dependency Tracking",
    desc: "Map task blockers and critical paths automatically. Know exactly what's blocking your release before it's too late.",
    color: "#69db7c",
    bg: "rgba(105,219,124,0.08)",
    border: "rgba(105,219,124,0.2)",
  },
  {
    icon: AlertTriangle,
    title: "Risk Engine",
    desc: "Real-time risk scoring per project based on blocked tasks, overdue work, and team capacity — scored out of 100.",
    color: "#ffa94d",
    bg: "rgba(255,169,77,0.08)",
    border: "rgba(255,169,77,0.2)",
  },
  {
    icon: Users,
    title: "Workload Balancer",
    desc: "Instantly detect overloaded engineers. Get AI recommendations to redistribute work across the team.",
    color: "#f783ac",
    bg: "rgba(247,131,172,0.08)",
    border: "rgba(247,131,172,0.2)",
  },
  {
    icon: Bot,
    title: "AI Copilot",
    desc: "Ask your org anything in plain English. Get instant analysis, summaries, and recommendations powered by AI.",
    color: "#4dabf7",
    bg: "rgba(77,171,247,0.08)",
    border: "rgba(77,171,247,0.2)",
  },
  {
    icon: FileText,
    title: "Decision Log",
    desc: "Every key decision from every meeting, timestamped and linked to projects. Full audit trail, always.",
    color: "#a9e34b",
    bg: "rgba(169,227,75,0.08)",
    border: "rgba(169,227,75,0.2)",
  },
];

const STATS = [
  { value: "22", label: "Tasks tracked", icon: CheckSquare },
  { value: "2", label: "Active projects", icon: FolderKanban },
  { value: "4", label: "Team members", icon: Users },
  { value: "100", label: "Risk scored", icon: BarChart2 },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Connect your team", desc: "Add employees and assign roles in seconds." },
  { step: "02", title: "Map your projects", desc: "Create projects, tasks, and dependency chains." },
  { step: "03", title: "Get instant insights", desc: "Risk scores, bottlenecks, and AI suggestions — live." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      background: "#080b12",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#e2e8f0",
      overflowX: "hidden",
    }}>

      {/* ── Ambient Glow ── */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 400, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at center top, rgba(59,91,219,0.18) 0%, transparent 70%)",
      }} />

      {/* ─── NAV ─── */}
      <header style={{
        height: 60,
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(8,11,18,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, #3b5bdb, #748ffc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(59,91,219,0.4)",
          }}>
            <Activity size={14} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#fff", letterSpacing: "-0.025em" }}>
            OrgMind
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href}
              style={{ fontSize: 13.5, color: "#8b93a7", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#e2e8f0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#8b93a7")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/dashboard" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#3b5bdb", color: "#fff",
          border: "none", borderRadius: 7, padding: "7px 16px",
          fontWeight: 500, fontSize: 13.5, textDecoration: "none",
          boxShadow: "0 0 24px rgba(59,91,219,0.3)",
          transition: "all 0.15s",
        }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#364fc7";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(59,91,219,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#3b5bdb";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(59,91,219,0.3)";
          }}
        >
          Launch app <ArrowRight size={13} />
        </Link>
      </header>

      {/* ─── HERO ─── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "90px 24px 80px", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(59,91,219,0.12)",
          border: "1px solid rgba(59,91,219,0.3)",
          color: "#748ffc", fontSize: 12, fontWeight: 500,
          padding: "5px 14px", borderRadius: 100, marginBottom: 32,
          letterSpacing: "0.04em",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#748ffc", animation: "pulse 2s ease-in-out infinite" }} />
          Microsoft Hackathon 2026 · Built for engineering orgs
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          {/* Left — Headline */}
          <div>
            <h1 style={{
              fontWeight: 800,
              fontSize: "clamp(38px, 4.5vw, 58px)",
              color: "#f1f5f9",
              letterSpacing: "-0.045em",
              lineHeight: 1.08,
              margin: "0 0 20px",
            }}>
              See your org as a{" "}
              <span style={{
                background: "linear-gradient(135deg, #748ffc, #4dabf7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                living system
              </span>
            </h1>
            <p style={{
              fontSize: 16, color: "#8b93a7",
              lineHeight: 1.75, margin: "0 0 36px",
              maxWidth: 440,
            }}>
              OrgMind gives engineering teams a real-time view of projects, people, blockers, and risks — so nothing falls through the cracks.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/dashboard" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#3b5bdb", color: "#fff",
                borderRadius: 8, padding: "11px 24px",
                fontWeight: 600, fontSize: 14, textDecoration: "none",
                boxShadow: "0 4px 24px rgba(59,91,219,0.4)",
                transition: "all 0.15s",
              }}>
                Get started free <ArrowRight size={14} />
              </Link>
              <Link href="/digital-twin" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.05)",
                color: "#c1c8d9",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "11px 22px",
                fontWeight: 500, fontSize: 14, textDecoration: "none",
                transition: "all 0.15s",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <Network size={14} /> View digital twin
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldCheck size={13} style={{ color: "#69db7c" }} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>No setup required</span>
              </div>
              <div style={{ width: 1, height: 12, background: "#1e2a3a" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={13} style={{ color: "#ffa94d" }} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>Live demo data included</span>
              </div>
              <div style={{ width: 1, height: 12, background: "#1e2a3a" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={13} style={{ color: "#748ffc" }} />
                <span style={{ fontSize: 12, color: "#6b7280" }}>Real-time insights</span>
              </div>
            </div>
          </div>

          {/* Right — Dashboard preview card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            backdropFilter: "blur(8px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          }}>
            {/* Mini header bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
              </div>
              <span style={{ fontSize: 11, color: "#3d4663" }}>OrgMind Dashboard</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#69db7c", display: "inline-block" }} />
                <span style={{ fontSize: 11, color: "#69db7c" }}>Live</span>
              </div>
            </div>

            {/* Mini stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "PROJECTS", value: "2", color: "#748ffc" },
                { label: "TASKS", value: "22", color: "#4dabf7" },
                { label: "OVERLOADED", value: "1", color: "#ff6b6b" },
                { label: "AVG RISK", value: "64", color: "#ffa94d" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 8, padding: "12px 14px",
                }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#4a5568", fontWeight: 500, letterSpacing: "0.07em" }}>{s.label}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: "-0.04em" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Mini risk bars */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8, padding: "14px 16px",
            }}>
              <p style={{ margin: "0 0 12px", fontSize: 11, color: "#4a5568", fontWeight: 500 }}>PROJECT RISK OVERVIEW</p>
              {[
                { name: "Phoenix", pct: 78, color: "#ff6b6b", label: "HIGH" },
                { name: "Atlas", pct: 50, color: "#ffa94d", label: "MED" },
              ].map((p) => (
                <div key={p.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#8b93a7", fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: p.color, fontWeight: 600 }}>{p.pct}/100 · {p.label}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div style={{ width: `${p.pct}%`, height: "100%", background: p.color, borderRadius: 2, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        padding: "24px 40px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "flex", justifyContent: "center",
          gap: 0, flexWrap: "wrap",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "0 40px",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}>
              <s.icon size={18} style={{ color: "#3d4663" }} />
              <div>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.04em" }}>{s.value}</p>
                <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "#4a5568" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(105,219,124,0.1)", border: "1px solid rgba(105,219,124,0.2)",
            color: "#69db7c", fontSize: 11.5, fontWeight: 500,
            padding: "4px 12px", borderRadius: 100, marginBottom: 20, letterSpacing: "0.06em",
          }}>
            PLATFORM FEATURES
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 700, color: "#f1f5f9",
            letterSpacing: "-0.035em", margin: "0 0 16px",
          }}>
            Everything in one workspace
          </h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            From risk scoring to AI-powered recommendations, OrgMind gives you complete visibility over your engineering organization.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12, padding: "24px 22px",
                transition: "all 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.045)";
                (e.currentTarget as HTMLElement).style.borderColor = f.border;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 8,
                background: f.bg, border: `1px solid ${f.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <f.icon size={17} style={{ color: f.color }} />
              </div>
              <h3 style={{ margin: "0 0 9px", fontSize: 14.5, fontWeight: 600, color: "#e2e8f0", letterSpacing: "-0.01em" }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "80px 24px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.035em", margin: "0 0 12px" }}>
              Up and running in minutes
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>No complex onboarding. Just open and explore.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, position: "relative" }}>
            {/* Connector line */}
            <div style={{
              position: "absolute",
              top: 28, left: "16.66%", right: "16.66%",
              height: 1,
              background: "linear-gradient(90deg, rgba(59,91,219,0.4), rgba(77,171,247,0.4))",
              zIndex: 0,
            }} />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{ textAlign: "center", padding: "0 20px", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: i === 0 ? "#3b5bdb" : "rgba(59,91,219,0.15)",
                  border: `1px solid ${i === 0 ? "#3b5bdb" : "rgba(59,91,219,0.3)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: i === 0 ? "0 0 24px rgba(59,91,219,0.5)" : "none",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{step.step}</span>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ padding: "60px 24px 100px", position: "relative", zIndex: 1 }}>
        <div style={{
          maxWidth: 860, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(59,91,219,0.2) 0%, rgba(77,171,247,0.1) 100%)",
          border: "1px solid rgba(59,91,219,0.3)",
          borderRadius: 20, padding: "60px 48px",
          textAlign: "center",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 80px rgba(59,91,219,0.15)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(59,91,219,0.15)", border: "1px solid rgba(59,91,219,0.3)",
            color: "#748ffc", fontSize: 11.5, fontWeight: 500,
            padding: "4px 12px", borderRadius: 100, marginBottom: 22, letterSpacing: "0.05em",
          }}>
            <Activity size={11} /> Live demo ready
          </div>
          <h2 style={{
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 800, color: "#f1f5f9",
            letterSpacing: "-0.04em", margin: "0 0 14px",
          }}>
            Start exploring in seconds
          </h2>
          <p style={{ fontSize: 15, color: "#8b93a7", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
            Pre-seeded with realistic data. No signup, no setup. Just open the dashboard and start discovering.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#3b5bdb", color: "#fff",
              borderRadius: 8, padding: "12px 28px",
              fontWeight: 600, fontSize: 15, textDecoration: "none",
              boxShadow: "0 4px 24px rgba(59,91,219,0.45)",
              transition: "all 0.15s",
            }}>
              Open dashboard <ArrowRight size={15} />
            </Link>
            <Link href="/copilot" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.07)",
              color: "#c1c8d9",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, padding: "12px 26px",
              fontWeight: 500, fontSize: 15, textDecoration: "none",
              transition: "all 0.15s",
            }}>
              <Bot size={14} /> Ask AI copilot
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            background: "#3b5bdb",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity size={11} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 13, color: "#4a5568", fontWeight: 600 }}>OrgMind</span>
          <span style={{ fontSize: 12, color: "#2d3748", marginLeft: 8 }}>Microsoft Hackathon 2026</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Projects", href: "/projects" },
            { label: "Employees", href: "/employees" },
            { label: "AI Copilot", href: "/copilot" },
            { label: "Settings", href: "/settings" },
          ].map((l) => (
            <Link key={l.label} href={l.href}
              style={{ fontSize: 12.5, color: "#374151", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#8b93a7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#374151")}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}