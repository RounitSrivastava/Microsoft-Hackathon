"use client";

import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { askCopilot } from "@/lib/copilotEngine";
import { useData } from "@/context/DataContext";
import { Bot, Send, Sparkles, AlertTriangle, User, Activity, Network, GitBranch } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; ts?: string };

const SUGGESTIONS = [
  { icon: AlertTriangle, label: "Which project is risky?",                   color: "#dc2626" },
  { icon: User,          label: "Who is overloaded?",                         color: "#ca8a04" },
  { icon: GitBranch,     label: "What is blocking Project Phoenix?",          color: "#2563eb" },
  { icon: Activity,      label: "What happens if Authentication is delayed?", color: "#7c3aed" },
  { icon: Network,       label: "Show dependency risk overview",              color: "#16a34a" },
];

function ts() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const welcomeMessages = {
  analyst: "📊 **[Strict Analyst Interface Activated]**\n\nHello. I am the OrgMind Analyst. I analyze the organizational twin to identify capacity risks, critical path slips, and blocker clusters. Please state your query.",
  leader: "🤝 **[Empathetic Leader Interface Activated]**\n\nHello! I'm here to help monitor team capacity, track project health, and make sure we balance our workloads. How is everyone doing today? What can I help you check?",
  creative: "💡 **[Creative Facilitator Interface Activated]**\n\nHey there! Let's brainstorm some workarounds and trace dependencies to get these projects delivered. What's on your mind?",
  coach: "🧠 **[Strategic Coach Interface Activated]**\n\nHello! I'm OrgMind Copilot. I analyze your organizational twin to help you monitor risks, trace critical paths, and rebalance resources. Ask me anything or pick a suggestion below.",
};

export default function CopilotPage() {
  const { employees, projects, tasks, decisions, dependencies, meetings, settings } = useData();
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: welcomeMessages.coach,
      ts: ts(),
    },
  ]);

  useEffect(() => {
    if (settings) {
      const persona = settings.copilotPersona || "coach";
      const initialWelcome = welcomeMessages[persona as keyof typeof welcomeMessages] || welcomeMessages.coach;
      setMessages([
        {
          role: "assistant",
          content: initialWelcome,
          ts: ts(),
        }
      ]);
    }
  }, [settings]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (text?: string) => {
    const query = (text || input).trim();
    if (!query || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: query, ts: ts() }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const { answer } = askCopilot(query, { employees, projects, tasks, decisions, dependencies, meetings, settings });
      setMessages((prev) => [...prev, { role: "assistant", content: answer, ts: ts() }]);
      setLoading(false);
    }, 400);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <MainLayout>
      <div
        style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, height: "calc(100vh - 120px)" }}
        className="fade-in"
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#f5f3ff",
              border: "1px solid #ddd6fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Bot size={22} style={{ color: "#7c3aed" }} />
          </div>
          <div>
            <h1
              style={{
                                fontWeight: 800,
                fontSize: 22,
                color: "#111827",
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              AI Copilot
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "3px 0 0" }}>
              Ask questions about risks, blockers &amp; team capacity
            </p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              background: "#f5f3ff",
              border: "1px solid #ddd6fe",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              color: "#7c3aed",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            <Sparkles size={11} />
            OrgMind Engine
          </div>
        </div>

        {/* Suggestions */}
        <div
          style={{
            padding: "14px 16px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            flexShrink: 0,
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
            Suggested Queries
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSend(s.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 13px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#374151",
                  cursor: "pointer",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#c7d2fe";
                  (e.currentTarget as HTMLElement).style.background = "#eef2ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLElement).style.background = "#f9fafb";
                }}
              >
                <s.icon size={12} style={{ color: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "16px 20px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
              className="fade-in"
            >
              {msg.role === "assistant" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#f5f3ff",
                    border: "1px solid #ddd6fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Bot size={14} style={{ color: "#7c3aed" }} />
                </div>
              )}

              <div style={{ maxWidth: "76%", display: "flex", flexDirection: "column", gap: 3, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                    fontSize: 13,
                    lineHeight: 1.6,
                    ...(msg.role === "user"
                      ? { background: "#4f46e5", color: "#fff", border: "none" }
                      : { background: "#f9fafb", color: "#374151", border: "1px solid #f3f4f6", whiteSpace: "pre-wrap" }),
                  }}
                >
                  {msg.content}
                </div>
                {msg.ts && (
                  <span style={{ fontSize: 10, color: "#d1d5db" }}>{msg.ts}</span>
                )}
              </div>

              {msg.role === "user" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  RS
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="fade-in">
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#f5f3ff",
                  border: "1px solid #ddd6fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bot size={14} style={{ color: "#7c3aed" }} />
              </div>
              <div
                style={{
                  padding: "10px 16px",
                  background: "#f9fafb",
                  border: "1px solid #f3f4f6",
                  borderRadius: "12px 12px 12px 3px",
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#c7d2fe",
                      display: "inline-block",
                      animation: `pulse-green 1.2s ease-in-out infinite`,
                      animationDelay: `${d * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            padding: "10px 14px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            flexShrink: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about risks, blockers, team capacity…"
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              color: "#111827",
              lineHeight: 1.5,
              minHeight: 36,
              maxHeight: 120,
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="btn-primary"
            style={{ padding: "9px 14px", borderRadius: 9, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
          >
            <Send size={14} />
            Send
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#d1d5db", flexShrink: 0, marginTop: -8 }}>
          Powered by OrgMind local inference — no external API calls.
        </p>
      </div>
    </MainLayout>
  );
}