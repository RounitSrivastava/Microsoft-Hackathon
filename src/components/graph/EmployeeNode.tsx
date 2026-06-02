"use client";

import { Handle, Position } from "reactflow";

export default function EmployeeNode({ data }: any) {
  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
      />

      <div className="bg-blue-600 text-white p-4 rounded-xl min-w-[180px]">
        <h3 className="font-bold">
          {data.label}
        </h3>

        <p className="text-sm mt-1">
          {data.count}
        </p>
      </div>
    </>
  );
}