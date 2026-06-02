"use client";

import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { nodes, edges } from "@/data/graph";

export default function OrgGraph() {
  return (
    <div className="h-[80vh] bg-white rounded-2xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />
    </div>
  );
}