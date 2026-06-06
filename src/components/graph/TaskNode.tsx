"use client";

import { Handle, Position } from "reactflow";
import { GitPullRequest, Calendar, CheckCircle2, AlertTriangle, PlayCircle } from "lucide-react";

export default function TaskNode({ data }: any) {
  const isBlocked = data.status === "Blocked";
  const isCompleted = data.status === "Completed";
  const isInProgress = data.status === "In Progress";
  const isSimulated = data.isSimulated;

  let statusBorder = "border-slate-200";
  let statusBadge = "bg-slate-100 text-slate-600 border border-slate-200";
  let StatusIcon = GitPullRequest;

  if (isSimulated) {
    statusBorder = "border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.15)] animate-pulse";
    statusBadge = "bg-orange-50 text-orange-700 border border-orange-200";
    StatusIcon = AlertTriangle;
  } else if (isBlocked) {
    statusBorder = "border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]";
    statusBadge = "bg-rose-50 text-rose-700 border border-rose-200";
    StatusIcon = AlertTriangle;
  } else if (isCompleted) {
    statusBorder = "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.05)]";
    statusBadge = "bg-emerald-50 text-emerald-700 border border-emerald-200";
    StatusIcon = CheckCircle2;
  } else if (isInProgress) {
    statusBorder = "border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.05)]";
    statusBadge = "bg-amber-50 text-amber-700 border border-amber-200";
    StatusIcon = PlayCircle;
  }

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

      <div className={`p-4 rounded-xl bg-white border-2 ${statusBorder} min-w-[220px] text-slate-900 shadow-md`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono flex items-center gap-1 ${statusBadge}`}>
            <StatusIcon size={10} />
            {isSimulated ? "Delayed" : data.status}
          </span>
          <span className="text-[9px] text-slate-400 font-bold font-mono uppercase tracking-wider">Node</span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-sm tracking-tight leading-snug text-slate-900">{data.label}</h3>
        <p className="text-slate-500 text-xs mt-1">Owner: {data.owner}</p>

        {/* Progress & Due Date */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            {isSimulated ? (
              <span className="text-orange-600 font-semibold animate-pulse">+{data.simulatedDelayDays || 5}d Cascade</span>
            ) : (
              <>
                <Calendar size={12} className="text-slate-400" />
                <span>{data.dueDate}</span>
              </>
            )}
          </div>
          <span className="font-semibold text-slate-900">{data.progress}%</span>
        </div>
      </div>
    </div>
  );
}