"use client";

import { useState } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";

import { nodes, edges } from "@/data/graph";

import EmployeeNode from "./EmployeeNode";
import ProjectNode from "./ProjectNode";
import TaskNode from "./TaskNode";
import GraphSidebar from "./GraphSidebar";

const nodeTypes = {
  employeeNode: EmployeeNode,
  projectNode: ProjectNode,
  taskNode: TaskNode,
};

export default function OrgGraph() {
  const [selectedNode, setSelectedNode] =
    useState<any>(null);

  return (
    <ReactFlowProvider>
      <div className="flex h-[85vh]">
        {/* Graph Area */}
        <div className="flex-1 bg-slate-50 rounded-l-2xl overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.3,
            }}
            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 0.55,
            }}
            minZoom={0.2}
            maxZoom={2}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={true}
            nodesDraggable={true}
            onNodeClick={(_, node) =>
              setSelectedNode(node)
            }
          >
            <Background />

            <MiniMap
              pannable
              zoomable
            />

            <Controls
              showInteractive={true}
            />
          </ReactFlow>
        </div>

        {/* Right Sidebar */}
        <GraphSidebar
          selectedNode={selectedNode}
        />
      </div>
    </ReactFlowProvider>
  );
}