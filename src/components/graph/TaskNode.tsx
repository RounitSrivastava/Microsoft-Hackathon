"use client";

import { Handle, Position } from "reactflow";

export default function TaskNode({ data }: any) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
      />

      <div className="bg-slate-800 text-white border border-slate-600 p-4 rounded-xl min-w-[180px]">
        <h3>{data.label}</h3>

        <p className="text-yellow-400 mt-1">
          {data.status}
        </p>
      </div>
    </>
  );
}