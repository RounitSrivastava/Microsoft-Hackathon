"use client";

import { Handle, Position } from "reactflow";
import { FolderKanban, AlertCircle } from "lucide-react";

export default function ProjectNode({ data }: any) {
  const isSimulated = data.isSimulated;

  const riskColor =
    isSimulated
      ? "border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.15)] animate-pulse"
      : data.risk === "High"
      ? "border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
      : data.risk === "Medium"
      ? "border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
      : "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]";

  const riskBadge =
    data.risk === "High"
      ? "bg-rose-50 text-rose-700 border border-rose-200"
      : data.risk === "Medium"
      ? "bg-amber-50 text-amber-700 border border-amber-200"
      : "bg-emerald-50 text-emerald-700 border border-emerald-200";

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-indigo-600 !w-3 !h-3 !border-white shadow-[0_0_4px_rgba(79,70,229,0.3)]"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-600 !w-3 !h-3 !border-white shadow-[0_0_4px_rgba(79,70,229,0.3)]"
      />

      <div className={`p-5 rounded-2xl bg-white border-2 ${riskColor} min-w-[240px] text-slate-900 shadow-md`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-indigo-600">
            <FolderKanban size={14} className="text-indigo-600" />
            <span className="text-[10px] uppercase tracking-wider font-extrabold font-mono">Portfolio</span>
          </div>
          {isSimulated ? (
            <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono bg-orange-50 text-orange-700 border border-orange-200">
              Delayed
            </span>
          ) : (
            <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono ${riskBadge}`}>
              {data.risk} Risk
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="font-extrabold text-base tracking-tight leading-tight text-slate-900">{data.label}</h3>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">Lead: {data.owner}</p>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
              <span>Completion Scan</span>
              <span className="font-bold text-slate-900">{data.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${data.progress}%` }}
              />
            </div>
          </div>

          {/* Overdue/Blocked indicators */}
          {isSimulated ? (
            <div className="flex items-center gap-1.5 text-orange-600 text-xs font-semibold font-mono animate-pulse">
              <AlertCircle size={14} />
              <span>Simulated Delay Impact: +{data.simulatedDelayDays || 5}d</span>
            </div>
          ) : data.overdueTasks > 0 ? (
            <div className="flex items-center gap-1.5 text-rose-600 text-xs font-mono font-semibold">
              <AlertCircle size={14} />
              <span>{data.overdueTasks} Overdue Task(s)</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}