"use client";

import { Handle, Position } from "reactflow";

export default function ProjectNode({
  data,
}: any) {
  const color =
    data.risk === "High"
      ? "bg-red-600"
      : data.risk === "Medium"
      ? "bg-yellow-500"
      : "bg-green-600";

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
      />

      <Handle
        type="source"
        position={Position.Right}
      />

      <div
        className={`${color} text-white p-4 rounded-xl min-w-[220px]`}
      >
        <h3 className="font-bold">
          {data.label}
        </h3>

        <p className="text-sm mt-1">
          {data.risk}
        </p>
      </div>
    </>
  );
}