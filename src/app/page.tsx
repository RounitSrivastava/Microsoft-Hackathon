"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Network,
  GitBranch,
  ArrowRight,
  Activity,
  Users,
  FileText,
  Bot,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Sparkles,
  Lock,
  MessageSquare,
  Terminal,
  Server,
  Cpu,
  Globe2,
  ChevronRight,
  Brain,
} from "lucide-react";

/* ─── Static Data ──────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Digital Twin", href: "/digital-twin" },
  { label: "AI Copilot", href: "/copilot" },
];

const FEATURES = [
  {
    icon: Network,
    title: "Dynamic Digital Twin",
    desc: "A live-updating organizational graph mapping employees, projects, milestones, and blockers into a single cohesive intelligence map.",
    iconColor: "#6366f1",
    iconBg: "rgba(99,102,241,0.09)",
    iconBorder: "rgba(99,102,241,0.2)",
    hoverBorder: "rgba(99,102,241,0.4)",
    hoverShadow: "0 16px 48px rgba(99,102,241,0.12)",
  },
  {
    icon: GitBranch,
    title: "Blocker Pipeline Tracing",
    desc: "Auto-detect critical path slippages. Know exactly which resource or delay is threatening your release dates in real time.",
    iconColor: "#10b981",
    iconBg: "rgba(16,185,129,0.09)",
    iconBorder: "rgba(16,185,129,0.2)",
    hoverBorder: "rgba(16,185,129,0.4)",
    hoverShadow: "0 16px 48px rgba(16,185,129,0.12)",
  },
  {
    icon: AlertTriangle,
    title: "Continuous Risk Engine",
    desc: "Real-time risk scorecards evaluated across milestone health, team bandwidth limits, and cascading dependency chains.",
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.09)",
    iconBorder: "rgba(245,158,11,0.2)",
    hoverBorder: "rgba(245,158,11,0.4)",
    hoverShadow: "0 16px 48px rgba(245,158,11,0.12)",
  },
  {
    icon: Users,
    title: "Workload Auto-Balancer",
    desc: "Analyze overallocated resources instantly. Receive AI capacity predictions to balance tasks and prevent team burnout.",
    iconColor: "#ec4899",
    iconBg: "rgba(236,72,153,0.09)",
    iconBorder: "rgba(236,72,153,0.2)",
    hoverBorder: "rgba(236,72,153,0.4)",
    hoverShadow: "0 16px 48px rgba(236,72,153,0.12)",
  },
  {
    icon: Brain,
    title: "AI-Powered Copilot",
    desc: "Ask your organization graph complex queries in plain English. Get recommendations, risk logs, and summaries instantly.",
    iconColor: "#06b6d4",
    iconBg: "rgba(6,182,212,0.09)",
    iconBorder: "rgba(6,182,212,0.2)",
    hoverBorder: "rgba(6,182,212,0.4)",
    hoverShadow: "0 16px 48px rgba(6,182,212,0.12)",
  },
  {
    icon: FileText,
    title: "Immutable Decision Logs",
    desc: "Record key project updates, approvals, and logs. Maintain immutable context linked back to specific graph nodes.",
    iconColor: "#84cc16",
    iconBg: "rgba(132,204,22,0.09)",
    iconBorder: "rgba(132,204,22,0.2)",
    hoverBorder: "rgba(132,204,22,0.4)",
    hoverShadow: "0 16px 48px rgba(132,204,22,0.12)",
  },
];

const STATS = [
  { value: "24", label: "Connected Nodes", sub: "Synced live", color: "#6366f1" },
  { value: "4", label: "Active Milestones", sub: "Critical paths mapped", color: "#10b981" },
  { value: "0ms", label: "Latency Delta", sub: "Real-time updates", color: "#06b6d4" },
  { value: "98%", label: "SLA Uptime", sub: "Optimal bandwidth", color: "#f59e0b" },
];

const COPILOT_PROMPTS = [
  {
    q: "Who is overloaded if Sarah L. goes offline?",
    r: "Re-evaluating live twin graph... Sarah holds 3 critical blockers. Re-routing workload to Alex M. mitigates Phoenix release delay risk by 62%.",
  },
  {
    q: "What is the release risk index of Project Phoenix?",
    r: "Risk is currently 78/100 (High). Database Sync task delay blocks API deployment, threatening Web Portal v1.0 by +8 days.",
  },
];

/* ─── Animated Counter ─────────────────────────────────────── */
function AnimatedNumber({ value }: { value: string }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1200, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(e * num) + suffix);
      if (p < 1) requestAnimationFrame(step);
      else setDisplay(value);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span>{display}</span>;
}

/* ─── Particle Canvas (light mode) ────────────────────────── */
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.min(window.innerHeight * 1.4, 900);
    };
    resize();
    window.addEventListener("resize", resize);
    const nodes = Array.from({ length: 48 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.8,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - d / 130)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99,102,241,0.18)";
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── Scroll Reveal Hook ───────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Main Component ───────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"twin" | "risk">("twin");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotResponse, setCopilotResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const featReveal = useReveal();
  const copilotReveal = useReveal();
  const ctaReveal = useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const triggerCopilot = (q: string, r: string) => {
    if (isTyping) return;
    setCopilotQuery(q); setCopilotResponse(""); setIsTyping(true);
    let i = 0;
    const iv = setInterval(() => {
      setCopilotResponse((p) => p + r.charAt(i)); i++;
      if (i >= r.length) { clearInterval(iv); setIsTyping(false); }
    }, 18);
  };

  return (
    <div style={{
      background: "#ffffff",
      minHeight: "100vh",
      fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', -apple-system, sans-serif",
      color: "#0f172a",
      overflowX: "hidden",
    }}>

      {/* ── NAVBAR ── */}
      <header style={{
        height: 66,
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 200,
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
            <Image src="/orgmind-logo.png" alt="OrgMind" width={38} height={38} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", letterSpacing: "-0.04em" }}>OrgMind</span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 34 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href}
              style={{ fontSize: 14, color: "#64748b", fontWeight: 600, textDecoration: "none", transition: "color 0.18s", letterSpacing: "-0.01em" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#0f172a")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#64748b")}
            >{l.label}</Link>
          ))}
        </nav>

        <Link href="/dashboard" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff", borderRadius: 10, padding: "9px 20px",
          fontWeight: 700, fontSize: 13.5, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
          transition: "all 0.22s ease",
        }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(99,102,241,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)";
          }}
        >
          Launch App <ChevronRight size={13} strokeWidth={2.5} />
        </Link>
      </header>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #f8f7ff 0%, #ffffff 100%)" }}>
        <ParticleBackground />

        {/* Soft ambient glows */}
        <div style={{ position: "absolute", top: "-10%", left: "5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "5%", right: "-5%", width: 450, height: 450, background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "90px 24px 110px", position: "relative", zIndex: 2 }}>

          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.22)",
              color: "#6366f1", fontSize: 12, fontWeight: 700,
              padding: "7px 18px", borderRadius: 100, letterSpacing: "0.04em",
              animation: "fadeDown 0.7s cubic-bezier(0.34,1.56,0.64,1) both",
            }}>
              <Sparkles size={12} />
              MICROSOFT HACKATHON 2026 · BUILT FOR ENGINEERING TEAMS
            </div>
          </div>

          {/* Headline */}
          <div style={{ textAlign: "center", animation: "fadeUp 0.75s 0.1s both" }}>
            <h1 style={{
              fontWeight: 800,
              fontSize: "clamp(46px, 5.8vw, 74px)",
              color: "#0f172a",
              letterSpacing: "-0.055em",
              lineHeight: 1.01,
              margin: "0 auto 26px",
              maxWidth: 860,
            }}>
              See your organization{" "}
              <span style={{
                background: "linear-gradient(120deg, #6366f1 0%, #8b5cf6 40%, #06b6d4 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200%",
                animation: "gradientShift 5s ease infinite",
              }}>
                as a living system
              </span>
            </h1>

            <p style={{
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "#64748b", lineHeight: 1.75,
              margin: "0 auto 44px", maxWidth: 580,
              fontWeight: 500, letterSpacing: "-0.01em",
            }}>
              OrgMind maps resource workloads, milestones, and blockers into a
              single live Digital Twin — with AI that forecasts delays before
              they happen.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", borderRadius: 13, padding: "15px 32px",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
                boxShadow: "0 6px 28px rgba(99,102,241,0.38)",
                transition: "all 0.22s ease",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(99,102,241,0.48)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(99,102,241,0.38)";
                }}
              >
                Launch Live App <ArrowRight size={15} />
              </Link>
              <Link href="/digital-twin" style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "#fff", color: "#374151",
                border: "1.5px solid #e2e8f0", borderRadius: 13, padding: "15px 26px",
                fontWeight: 650, fontSize: 15, textDecoration: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.22s ease",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#c7d2fe";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 16px rgba(99,102,241,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                <Network size={15} style={{ color: "#6366f1" }} /> View Digital Twin
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 28, justifyContent: "center", marginTop: 44, flexWrap: "wrap" }}>
              {[
                { icon: ShieldCheck, label: "Zero Configuration", color: "#10b981" },
                { icon: Zap, label: "Demo Graph Included", color: "#f59e0b" },
                { icon: Cpu, label: "Graph AI Engine", color: "#6366f1" },
                { icon: Globe2, label: "Live Sync Ready", color: "#ec4899" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Icon size={14} style={{ color }} />
                  <span style={{ fontSize: 13.5, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Hero Dashboard Panel ── */}
          <div style={{
            maxWidth: 840, margin: "72px auto 0",
            background: "#fff",
            border: "1.5px solid #e8eaf0",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 24px 80px rgba(99,102,241,0.1), 0 8px 32px rgba(0,0,0,0.06)",
            position: "relative",
            overflow: "hidden",
            animation: "fadeUp 0.9s 0.25s both",
          }}>
            {/* Top accent line */}
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)", borderRadius: 2 }} />

            {/* Window chrome */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, borderBottom: "1px solid #f1f5f9", paddingBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", display: "block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e", display: "block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", display: "block" }} />
                <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 12, fontFamily: "var(--font-mono)", fontWeight: 600 }}>orgmind.app / digital-twin</span>
              </div>
              <div style={{ display: "flex", background: "#f8fafc", padding: 3, borderRadius: 9, border: "1px solid #e2e8f0", gap: 2 }}>
                {(["twin", "risk"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    fontSize: 11.5, fontWeight: 700, padding: "6px 14px", borderRadius: 7,
                    cursor: "pointer", border: "none",
                    background: activeTab === tab ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                    color: activeTab === tab ? "#fff" : "#94a3b8",
                    boxShadow: activeTab === tab ? "0 2px 8px rgba(99,102,241,0.22)" : "none",
                    transition: "all 0.18s ease",
                  }}>
                    {tab === "twin" ? "Live Graph" : "Risk Engine"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab: Live Graph */}
            {activeTab === "twin" && (
              <div style={{ height: 210, position: "relative", background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                <svg style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}>
                  <path d="M 80,105 L 220,65" stroke="#e2e8f0" strokeWidth="1.5" />
                  <path d="M 80,105 L 220,148" stroke="#e2e8f0" strokeWidth="1.5" />
                  <path d="M 220,65 L 375,105" stroke="rgba(245,158,11,0.5)" strokeWidth="2" strokeDasharray="6 5" className="dash-flow" />
                  <path d="M 220,148 L 375,105" stroke="rgba(16,185,129,0.45)" strokeWidth="2" />
                  <circle cx="80" cy="105" r="4" fill="rgba(99,102,241,0.4)" />
                  <circle cx="220" cy="65" r="4" fill="rgba(245,158,11,0.5)" />
                  <circle cx="220" cy="148" r="4" fill="rgba(16,185,129,0.5)" />
                  <circle cx="375" cy="105" r="4" fill="rgba(239,68,68,0.5)" />
                </svg>
                {[
                  { id: "root", label: "Phoenix API", sub: "Core Microservice", tc: "#6366f1", bg: "rgba(99,102,241,0.07)", bd: "rgba(99,102,241,0.22)", left: 14, top: 80 },
                  { id: "blocker", label: "DB Sync Task", sub: "⚠ Blocker (+6d)", tc: "#d97706", bg: "rgba(245,158,11,0.08)", bd: "rgba(245,158,11,0.25)", left: 164, top: 35 },
                  { id: "dev", label: "Sarah L. (Dev)", sub: "80% workload", tc: "#059669", bg: "rgba(16,185,129,0.08)", bd: "rgba(16,185,129,0.25)", left: 167, top: 120 },
                  { id: "release", label: "Release Portal", sub: "Risk: High (78%)", tc: "#dc2626", bg: "rgba(239,68,68,0.08)", bd: "rgba(239,68,68,0.25)", right: 14, top: 80 },
                ].map((n) => (
                  <div key={n.id}
                    onMouseEnter={() => setHoveredNode(n.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{
                      position: "absolute",
                      left: (n as { left?: number }).left ?? undefined,
                      right: (n as { right?: number }).right ?? undefined,
                      top: n.top,
                      background: n.bg, border: `1.5px solid ${n.bd}`,
                      borderRadius: 12, padding: "9px 14px",
                      cursor: "pointer", textAlign: "center",
                      transform: hoveredNode === n.id ? "scale(1.05)" : "scale(1)",
                      boxShadow: hoveredNode === n.id ? `0 6px 20px ${n.bg}` : "0 1px 4px rgba(0,0,0,0.06)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: 11.5, fontWeight: 700, display: "block", color: "#0f172a" }}>{n.label}</span>
                    <span style={{ fontSize: 9.5, color: n.tc, fontWeight: 600 }}>{n.sub}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Risk Engine */}
            {activeTab === "risk" && (
              <div style={{ height: 210, background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "#fff", border: "1.5px solid #fee2e2", borderRadius: 12, padding: "12px 14px" }}>
                    <span style={{ display: "block", fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Outage Risk</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#ef4444", display: "block", marginTop: 5, letterSpacing: "-0.04em" }}>HIGH</span>
                  </div>
                  <div style={{ background: "#fff", border: "1.5px solid #fef3c7", borderRadius: 12, padding: "12px 14px" }}>
                    <span style={{ display: "block", fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Timeline Slip</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b", display: "block", marginTop: 5, letterSpacing: "-0.04em" }}>+8.2d</span>
                  </div>
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <span style={{ position: "absolute", top: 0, left: 0, fontSize: 9.5, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Risk Trend — Sprint</span>
                  <svg viewBox="0 0 300 52" style={{ width: "100%", height: "100%", overflow: "visible", paddingTop: 14 }}>
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0,44 Q 50,26 100,38 T 200,10 T 300,24 L 300,52 L 0,52 Z" fill="url(#rg)" />
                    <path d="M 0,44 Q 50,26 100,38 T 200,10 T 300,24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="200" cy="10" r="4" fill="#ef4444" />
                  </svg>
                </div>
              </div>
            )}

            {/* Metric pills */}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {[
                { label: "DRIFT RISK", val: "78", unit: "/100", change: "+12%", cc: "#ef4444" },
                { label: "BANDWIDTH", val: "92%", unit: "", change: "Optimal", cc: "#10b981" },
                { label: "DEPENDENCIES", val: "14", unit: " live", change: "0 broken", cc: "#6366f1" },
              ].map((m) => (
                <div key={m.label} style={{ flex: 1, background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 12, padding: "10px 14px" }}>
                  <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", display: "block" }}>{m.label}</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>{m.val}<span style={{ fontSize: 11, color: "#94a3b8" }}>{m.unit}</span></span>
                    <span style={{ fontSize: 10.5, color: m.cc, fontWeight: 700 }}>{m.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div ref={statsRef} style={{
        borderTop: "1px solid #f1f5f9",
        borderBottom: "1px solid #f1f5f9",
        background: "#fafbff",
        padding: "36px 40px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "14px 20px",
              borderRight: i < STATS.length - 1 ? "1px solid #f1f5f9" : "none",
              opacity: statsVisible ? 1 : 0,
              transform: statsVisible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.55s ${i * 0.1}s ease, transform 0.55s ${i * 0.1}s ease`,
            }}>
              <p style={{ margin: 0, fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, color: s.color, letterSpacing: "-0.05em", lineHeight: 1 }}>
                {statsVisible ? <AnimatedNumber value={s.value} /> : s.value}
              </p>
              <p style={{ margin: "8px 0 3px", fontSize: 13.5, color: "#334155", fontWeight: 700 }}>{s.label}</p>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "110px 24px 80px" }}>
        <div ref={featReveal.ref} style={{
          opacity: featReveal.visible ? 1 : 0,
          transform: featReveal.visible ? "translateY(0)" : "translateY(26px)",
          transition: "opacity 0.65s ease, transform 0.65s ease",
        }}>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(16,185,129,0.09)", border: "1px solid rgba(16,185,129,0.2)",
              color: "#10b981", fontSize: 11.5, fontWeight: 700,
              padding: "6px 16px", borderRadius: 100, marginBottom: 22, letterSpacing: "0.07em",
            }}>
              PLATFORM CAPABILITIES
            </div>
            <h2 style={{
              fontSize: "clamp(34px,4.5vw,52px)",
              fontWeight: 800, color: "#0f172a",
              letterSpacing: "-0.045em", margin: "0 0 18px",
            }}>
              Everything in one live canvas
            </h2>
            <p style={{ fontSize: 17, color: "#64748b", maxWidth: 540, margin: "0 auto", lineHeight: 1.8, fontWeight: 500 }}>
              From risk scorecards to automated delay simulations, OrgMind delivers end-to-end organizational intelligence.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px,1fr))", gap: 22 }}>
            {FEATURES.map((f, idx) => (
              <div key={f.title} style={{
                background: "#fff",
                border: "1.5px solid #f1f5f9",
                borderRadius: 20, padding: "32px 28px",
                cursor: "default",
                position: "relative", overflow: "hidden",
                opacity: featReveal.visible ? 1 : 0,
                transform: featReveal.visible ? "translateY(0)" : "translateY(18px)",
                transition: `all 0.28s ease`,
                transitionDelay: `${0.05 * idx}s`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = f.hoverBorder;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = f.hoverShadow;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#f1f5f9";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                }}
              >
                {/* Top accent strip */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.iconColor}33, ${f.iconColor}88, ${f.iconColor}33)`, opacity: 0.7, borderRadius: "20px 20px 0 0" }} />
                <div style={{
                  width: 48, height: 48, borderRadius: 13,
                  background: f.iconBg, border: `1.5px solid ${f.iconBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 22,
                }}>
                  <f.icon size={21} style={{ color: f.iconColor }} />
                </div>
                <h3 style={{ margin: "0 0 12px", fontSize: 16.5, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em" }}>
                  {f.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.75, fontWeight: 500 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COPILOT DEMO ── */}
      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "20px 24px 110px" }}>
        <div ref={copilotReveal.ref} style={{
          background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 60%, #f0fdf4 100%)",
          border: "1.5px solid #e0e7ff",
          borderRadius: 28, padding: "58px 52px",
          boxShadow: "0 12px 48px rgba(99,102,241,0.08)",
          opacity: copilotReveal.visible ? 1 : 0,
          transform: copilotReveal.visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.65s ease, transform 0.65s ease",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative orb */}
          <div style={{ position: "absolute", top: "-20%", right: "-8%", width: 360, height: 360, background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 52, alignItems: "center", position: "relative" }}>
            {/* Left */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(6,182,212,0.09)", border: "1px solid rgba(6,182,212,0.22)",
                color: "#0891b2", fontSize: 11, fontWeight: 700,
                padding: "6px 15px", borderRadius: 100, marginBottom: 22, letterSpacing: "0.07em",
              }}>
                <Bot size={13} /> LIVE AI COPILOT SIMULATOR
              </div>
              <h2 style={{
                fontSize: "clamp(26px,3.2vw,40px)",
                fontWeight: 800, color: "#0f172a",
                letterSpacing: "-0.045em", margin: "0 0 16px", lineHeight: 1.1,
              }}>
                Query your engineering graph
              </h2>
              <p style={{ fontSize: 15.5, color: "#64748b", lineHeight: 1.8, margin: "0 0 32px", fontWeight: 500 }}>
                Ask complex status questions in plain English — let Graph AI surface blockers, reconstruct critical paths, and predict risks instantly.
              </p>

              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", display: "block", marginBottom: 12 }}>Select Simulated Prompt</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {COPILOT_PROMPTS.map((item, idx) => (
                  <button key={idx} onClick={() => triggerCopilot(item.q, item.r)} style={{
                    textAlign: "left", fontSize: 13, background: "#fff",
                    border: "1.5px solid #e2e8f0", color: "#475569", fontWeight: 600,
                    padding: "12px 18px", borderRadius: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    transition: "all 0.18s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "#c7d2fe";
                      el.style.background = "#fafaff";
                      el.style.color = "#6366f1";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "#e2e8f0";
                      el.style.background = "#fff";
                      el.style.color = "#475569";
                    }}
                  >
                    <span>&quot;{item.q}&quot;</span>
                    <span style={{ fontSize: 11.5, color: "#6366f1", fontWeight: 700, flexShrink: 0 }}>Run →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Terminal */}
            <div style={{
              background: "#fff", border: "1.5px solid #e2e8f0",
              borderRadius: 20, padding: 20, height: 280,
              display: "flex", flexDirection: "column",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 14 }}>
                <Terminal size={14} style={{ color: "#6366f1" }} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>OrgMind AI Agent Terminal</span>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "block", marginLeft: "auto", boxShadow: "0 0 8px rgba(34,197,94,0.5)", animation: "pulse 2s ease infinite" }} />
              </div>

              <div style={{ flex: 1, overflowY: "auto", fontSize: 13 }}>
                {copilotQuery ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ alignSelf: "flex-end", background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))", border: "1px solid #e0e7ff", borderRadius: "12px 12px 3px 12px", padding: "9px 13px", maxWidth: "90%", color: "#4f46e5", fontSize: 13, lineHeight: 1.6 }}>
                      {copilotQuery}
                    </div>
                    {copilotResponse && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Server size={11} color="#fff" />
                        </div>
                        <div style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "3px 12px 12px 12px", padding: "9px 13px", maxWidth: "88%", color: "#374151", lineHeight: 1.65, fontSize: 13 }}>
                          {copilotResponse}
                          {isTyping && <span style={{ animation: "pulse 1s ease infinite", marginLeft: 2, color: "#6366f1", fontWeight: 700 }}>|</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 20 }}>
                    <MessageSquare size={28} style={{ marginBottom: 10, color: "#e2e8f0" }} />
                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", fontWeight: 500, lineHeight: 1.6 }}>Select a query prompt on the left to see Graph AI evaluate your pipeline impacts live.</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 10, padding: "9px 13px", marginTop: 12 }}>
                <input type="text" readOnly placeholder="Console input locked..." style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#94a3b8", flex: 1 }} />
                <Lock size={12} style={{ color: "#cbd5e1" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: "10px 24px 110px" }}>
        <div ref={ctaReveal.ref} style={{
          maxWidth: 840, margin: "0 auto",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
          borderRadius: 28, padding: "72px 52px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(99,102,241,0.35)",
          opacity: ctaReveal.visible ? 1 : 0,
          transform: ctaReveal.visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.65s ease, transform 0.65s ease",
          position: "relative", overflow: "hidden",
        }}>
          {/* Subtle inner pattern */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />

          {/* Logo in CTA */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", background: "#fff" }}>
              <Image src="/orgmind-logo.png" alt="OrgMind" width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff", fontSize: 11.5, fontWeight: 700,
            padding: "5px 15px", borderRadius: 100, marginBottom: 26, letterSpacing: "0.06em",
          }}>
            <Activity size={12} /> LIVE DEMO CONSOLE READY
          </div>

          <h2 style={{
            fontSize: "clamp(28px,3.5vw,44px)",
            fontWeight: 800, color: "#fff",
            letterSpacing: "-0.045em", margin: "0 0 18px",
          }}>
            Unlock engineering alignment today
          </h2>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, margin: "0 auto 40px", maxWidth: 480, fontWeight: 500 }}>
            Pre-seeded with a complete mock workspace. No signup, no config. Just open the workspace and inspect your live graph.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "#fff", color: "#6366f1",
              borderRadius: 13, padding: "14px 34px",
              fontWeight: 700, fontSize: 15, textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              transition: "all 0.22s ease",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
              }}
            >
              Open Dashboard <ArrowRight size={15} />
            </Link>
            <Link href="/copilot" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.3)",
              borderRadius: 13, padding: "14px 28px",
              fontWeight: 650, fontSize: 15, textDecoration: "none",
              transition: "all 0.22s ease",
              backdropFilter: "blur(8px)",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)";
              }}
            >
              <Bot size={15} /> Consult AI Copilot
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #f1f5f9",
        padding: "34px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 24,
        background: "#fafbff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, overflow: "hidden" }}>
            <Image src="/orgmind-logo.png" alt="OrgMind" width={30} height={30} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontSize: 14, color: "#334155", fontWeight: 800 }}>OrgMind</span>
          <span style={{ fontSize: 12.5, color: "#cbd5e1", marginLeft: 8 }}>Microsoft Hackathon 2026</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Projects", href: "/projects" },
            { label: "Employees", href: "/employees" },
            { label: "AI Copilot", href: "/copilot" },
            { label: "Settings", href: "/settings" },
          ].map((l) => (
            <Link key={l.label} href={l.href}
              style={{ fontSize: 13.5, color: "#94a3b8", textDecoration: "none", fontWeight: 600, transition: "color 0.18s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#334155")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94a3b8")}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </footer>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -20; }
        }
        .dash-flow { animation: dash-flow 2.5s linear infinite; }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
}