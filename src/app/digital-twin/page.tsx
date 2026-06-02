"use client";

import MainLayout from "@/components/layout/MainLayout";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

const nodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { label: "Engineering Team" },
  },
  {
    id: "2",
    position: { x: 400, y: 100 },
    data: { label: "Project Alpha" },
  },
  {
    id: "3",
    position: { x: 700, y: 100 },
    data: { label: "Security Review" },
  },
];

const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
  },
];

export default function DigitalTwinPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-white">
          Organizational Digital Twin
        </h1>

        <p className="text-slate-400">
          Connected view of teams, projects, decisions and dependencies.
        </p>

        <div className="h-[75vh] bg-white rounded-2xl overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
          />
        </div>
      </div>
    </MainLayout>
  );
}