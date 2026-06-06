"use client";

import { useState, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import { useData } from "@/context/DataContext";
import { buildGraph } from "@/lib/buildGraph";
import EmployeeNode from "./EmployeeNode";
import ProjectNode from "./ProjectNode";
import TaskNode from "./TaskNode";
import GraphSidebar from "./GraphSidebar";
import { Search, Filter, PlayCircle, XCircle } from "lucide-react";

const nodeTypes = {
  employeeNode: EmployeeNode,
  projectNode: ProjectNode,
  taskNode: TaskNode,
};

interface OrgGraphProps {
  defaultOnlyDependencies?: boolean;
}

export default function OrgGraph({ defaultOnlyDependencies = false }: OrgGraphProps) {
  const { employees, projects, tasks, decisions, dependencies, settings } = useData();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "EMPLOYEE" | "PROJECT" | "TASK">("ALL");
  const [onlyDependencies, setOnlyDependencies] = useState(defaultOnlyDependencies);
  
  // Custom delay simulator days state (passed to GraphSidebar and nodes)
  const [simulatedNodeId, setSimulatedNodeId] = useState<string | null>(null);
  const [simulatedDelayDays, setSimulatedDelayDays] = useState<number>(5);

  // 1. Build nodes and edges dynamically from the live context state
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return buildGraph({
      employees,
      projects,
      tasks,
      decisions,
      dependencies,
      settings,
    });
  }, [employees, projects, tasks, decisions, dependencies, settings]);

  // 2. Trace downstream nodes for simulation
  const downstreamIds = useMemo(() => {
    if (!simulatedNodeId) return new Set<string>();
    
    const visited = new Set<string>();
    const queue = [simulatedNodeId];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      initialEdges.forEach((edge) => {
        // Trace forward edges that represent dependencies/blocking relationships
        if (edge.source === current && edge.label !== "OWNS" && edge.label !== "REQUIRES") {
          if (!visited.has(edge.target)) {
            visited.add(edge.target);
            queue.push(edge.target);
          }
        }
      });
    }
    return visited;
  }, [simulatedNodeId, initialEdges]);

  // 3. Filter nodes based on search and type filters
  const filteredNodes = useMemo(() => {
    return initialNodes.filter((node) => {
      // Type matching
      if (typeFilter === "EMPLOYEE" && node.type !== "employeeNode") return false;
      if (typeFilter === "PROJECT" && node.type !== "projectNode") return false;
      if (typeFilter === "TASK" && node.type !== "taskNode") return false;

      // Search matching
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const labelMatch = node.data.label.toLowerCase().includes(query);
        const ownerMatch = node.data.owner?.toLowerCase().includes(query) ?? false;
        const roleMatch = node.data.role?.toLowerCase().includes(query) ?? false;
        const statusMatch = node.data.status?.toLowerCase().includes(query) ?? false;
        return labelMatch || ownerMatch || roleMatch || statusMatch;
      }

      return true;
    });
  }, [searchQuery, typeFilter, initialNodes]);

  const visibleNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // 4. Filter edges: exclude edges whose endpoints are filtered out, or non-dependency edges if toggled
  const filteredEdges = useMemo(() => {
    return initialEdges.filter((edge) => {
      // Endpoints must be visible
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) return false;

      // Only dependency edges filter
      if (onlyDependencies) {
        return edge.label === "BLOCKS" || edge.label === "DEPENDS_ON";
      }

      return true;
    });
  }, [onlyDependencies, visibleNodeIds, initialEdges]);

  // 5. Map simulation attributes to rendered nodes and edges
  const nodesToRender = useMemo(() => {
    return filteredNodes.map((node) => {
      const isSimulatedSource = simulatedNodeId === node.id;
      const isSimulatedTarget = downstreamIds.has(node.id);
      
      return {
        ...node,
        data: {
          ...node.data,
          isSimulated: isSimulatedSource || isSimulatedTarget,
          isSimulatedSource,
          isSimulatedTarget,
          simulatedDelayDays, // Pass the delay value to nodes for rendering
        },
      };
    });
  }, [filteredNodes, simulatedNodeId, downstreamIds, simulatedDelayDays]);

  const edgesToRender = useMemo(() => {
    return filteredEdges.map((edge) => {
      const isSimulatedPath =
        simulatedNodeId === edge.source || 
        (downstreamIds.has(edge.source) && downstreamIds.has(edge.target));

      if (isSimulatedPath) {
        return {
          ...edge,
          animated: true,
          style: {
            ...edge.style,
            stroke: "#ea580c", // Bright orange
            strokeWidth: 3,
          },
        };
      }
      return edge;
    });
  }, [filteredEdges, simulatedNodeId, downstreamIds]);

  const selectedNode = useMemo(() => {
    const node = nodesToRender.find((n) => n.id === selectedNodeId);
    if (!node) return null;
    return node;
  }, [selectedNodeId, nodesToRender]);

  const handleSimulate = (nodeId: string) => {
    setSimulatedNodeId(nodeId);
  };

  const handleClearSimulation = () => {
    setSimulatedNodeId(null);
  };

  return (
    <div className="flex h-[80vh] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Controls Toolbar */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search nodes by name, owner, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl outline-none text-sm placeholder-slate-400 focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Filter className="text-slate-400" size={14} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-transparent text-slate-700 text-xs outline-none cursor-pointer py-0.5"
              >
                <option value="ALL">All Nodes</option>
                <option value="EMPLOYEE">Employees</option>
                <option value="PROJECT">Projects</option>
                <option value="TASK">Tasks</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={onlyDependencies}
                onChange={(e) => setOnlyDependencies(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600 bg-white border-slate-300"
              />
              <span>Only Dependency Edges</span>
            </label>

            {simulatedNodeId && (
              <button
                onClick={handleClearSimulation}
                className="flex items-center gap-1 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg transition shadow-sm font-semibold"
              >
                <XCircle size={14} />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>

        {/* React Flow Area */}
        <div className="flex-1 relative bg-slate-50">
          {simulatedNodeId && (
            <div className="absolute top-4 left-4 z-10 bg-orange-50 border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm font-semibold">
              <PlayCircle size={14} className="text-orange-600" />
              <span>Simulating delay of +{simulatedDelayDays}d from: {nodesToRender.find(n => n.id === simulatedNodeId)?.data.label}</span>
            </div>
          )}
          
          <ReactFlow
            nodes={nodesToRender}
            edges={edgesToRender}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.1}
            maxZoom={2}
            panOnDrag={true}
            zoomOnScroll={true}
            nodesDraggable={true}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          >
            <Background color="#cbd5e1" gap={20} size={1} />
            <MiniMap 
              pannable 
              zoomable 
              className="!bg-white border !border-slate-200 rounded-xl"
              maskColor="rgba(241, 245, 249, 0.4)"
              nodeColor={(n) => {
                if (n.type === "employeeNode") return "#4f46e5";
                if (n.type === "projectNode") return "#818cf8";
                return "#94a3b8";
              }}
            />
            <Controls className="!bg-white border !border-slate-200 rounded-xl text-slate-700 fill-slate-700 [&_button]:!bg-white [&_button]:!border-slate-200 [&_button]:text-slate-700 [&_svg]:!fill-slate-600" />
          </ReactFlow>
        </div>
      </div>

      {/* Sidebar Area */}
      <GraphSidebar
        selectedNode={selectedNode}
        onSimulate={handleSimulate}
        simulatedNodeId={simulatedNodeId}
        onClearSimulation={handleClearSimulation}
        simulatedDelayDays={simulatedDelayDays}
        setSimulatedDelayDays={setSimulatedDelayDays}
      />
    </div>
  );
}