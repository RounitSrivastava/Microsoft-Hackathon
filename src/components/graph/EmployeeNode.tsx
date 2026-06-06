"use client";

import { Handle, Position } from "reactflow";
import { Users, AlertTriangle } from "lucide-react";

export default function EmployeeNode({ data }: any) {
  const isOverloaded = data.risk === "High";
  const isSimulated = data.isSimulated;

  return (
    <div className="relative">
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-600 !w-3 !h-3 !border-white shadow-[0_0_4px_rgba(79,70,229,0.3)]"
      />

      <div className={`p-4 rounded-2xl bg-white border-2 ${
        isSimulated
          ? "border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.15)] animate-pulse"
          : isOverloaded
          ? "border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
          : "border-indigo-200 shadow-sm"
      } min-w-[200px] text-slate-900 shadow-md`}>
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-indigo-600">
            <Users size={14} />
            <span className="text-[10px] uppercase tracking-wider font-extrabold font-mono">Telemetry</span>
          </div>
          {isSimulated ? (
            <span className="text-[9px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono border border-orange-200">
              Delay Path
            </span>
          ) : isOverloaded && (
            <span className="flex items-center gap-1 text-[9px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono border border-rose-200 animate-pulse">
              <AlertTriangle size={10} />
              Overloaded
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="font-bold text-sm tracking-tight text-slate-900 leading-tight">{data.label}</h3>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">{data.role}</p>

        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-500">
            <span>Active Tasks</span>
            <span className="font-bold text-slate-900">{data.tasks}</span>
          </div>

          {/* Workload Progress Bar */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
              <span>Workload Scan</span>
              <span className={isOverloaded ? "text-rose-600 font-bold" : "text-indigo-600 font-bold"}>{data.workload}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverloaded ? "bg-rose-500" : data.workload > 50 ? "bg-amber-500" : "bg-indigo-600"
                }`}
                style={{ width: `${data.workload}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}