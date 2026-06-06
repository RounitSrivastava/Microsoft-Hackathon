import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "default" | "green" | "red" | "yellow" | "blue" | "violet" | "cyan" | "emerald" | "rose" | "amber";
  trend?: { value: string; up: boolean };
}

const variantConfig = {
  default: { iconColor: "var(--accent)", valColor: "var(--text-primary)" },
  green:   { iconColor: "var(--green)",  valColor: "var(--text-primary)" },
  red:     { iconColor: "var(--red)",    valColor: "var(--text-primary)" },
  yellow:  { iconColor: "var(--yellow)", valColor: "var(--text-primary)" },
  blue:    { iconColor: "var(--blue)",   valColor: "var(--text-primary)" },
};

const variantMap: Record<string, keyof typeof variantConfig> = {
  violet:  "default",
  cyan:    "blue",
  emerald: "green",
  rose:    "red",
  amber:   "yellow",
};

const statusColors: Record<string, string> = {
  default: "var(--accent)",
  green:   "var(--green)",
  red:     "var(--red)",
  yellow:  "var(--yellow)",
  blue:    "var(--blue)",
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
}: StatsCardProps) {
  const key = (variantMap[variant as string] ?? variant) as keyof typeof variantConfig;
  const cfg = variantConfig[key] ?? variantConfig.default;
  const statusColor = statusColors[key] ?? statusColors.default;

  return (
    <div
      className="stat-card"
      style={{ padding: "16px 18px" }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            margin: 0,
          }}
        >
          {title}
        </p>
        {Icon && (
          <Icon size={14} style={{ color: cfg.iconColor, opacity: 0.8 }} />
        )}
      </div>

      {/* Value */}
      <p
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: cfg.valColor,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          margin: 0,
        }}
      >
        {value}
      </p>

      {/* Footer */}
      {(subtitle || trend) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          {trend && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: "1px 6px",
                borderRadius: 4,
                background: trend.up ? "var(--green-light)" : "var(--red-light)",
                color: trend.up ? "var(--green)" : "var(--red)",
                border: `1px solid ${trend.up ? "var(--green-mid)" : "var(--red-mid)"}`,
              }}
            >
              {trend.up ? "↑" : "↓"} {trend.value}
            </span>
          )}
          {subtitle && (
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 400 }}>
              {subtitle}
            </span>
          )}
        </div>
      )}

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: statusColor,
          opacity: 0.18,
          borderRadius: "0 0 8px 8px",
        }}
      />
    </div>
  );
}