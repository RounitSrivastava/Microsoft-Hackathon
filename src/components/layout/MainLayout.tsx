import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useData } from "@/context/DataContext";

const ACCENT_PALETTES = {
  indigo:  { primary: "#3b5bdb", light: "#e8efff", mid: "#bac8ff" },
  violet:  { primary: "#7048e8", light: "#f3f0ff", mid: "#d0bfff" },
  emerald: { primary: "#0ca678", light: "#e6fcf5", mid: "#96f2d7" },
  crimson: { primary: "#e03131", light: "#fff5f5", mid: "#ffa8a8" },
  amber:   { primary: "#e67700", light: "#fff9db", mid: "#ffec99" },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useData();
  const accentKey = settings?.accentColor || "indigo";
  const palette = ACCENT_PALETTES[accentKey as keyof typeof ACCENT_PALETTES] || ACCENT_PALETTES.indigo;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-base)" }}>
      <style>{`
        :root {
          --accent: ${palette.primary} !important;
          --accent-light: ${palette.light} !important;
          --accent-mid: ${palette.mid} !important;
          --accent-text: ${palette.primary} !important;
        }
      `}</style>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "24px 28px", overflowY: "auto" } as React.CSSProperties}>
          {children}
        </main>
      </div>
    </div>
  );
}