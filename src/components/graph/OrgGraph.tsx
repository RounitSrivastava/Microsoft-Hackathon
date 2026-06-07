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
import { Search, Filter, PlayCircle, XCircle, ChevronDown } from "lucide-react";

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
    <div style={{ display: "flex", height: "100%", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Controls Toolbar */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
              <input
                type="text"
                placeholder="Search nodes by name, owner, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  height: "38px",
                  paddingLeft: "40px",
                  paddingRight: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "13.5px",
                  color: "#0f172a",
                  outline: "none",
                  transition: "all 0.15s ease",
                }}
                className="hover:border-slate-300 hover:bg-slate-100/30 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400"
              />
            </div>
            
            {/* Type Filter Dropdown */}
            <div className="relative flex items-center">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                style={{
                  height: "38px",
                  paddingLeft: "40px",
                  paddingRight: "36px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#475569",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  transition: "all 0.15s ease",
                }}
                className="hover:border-slate-300 hover:bg-slate-100/30 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="ALL">All Nodes</option>
                <option value="EMPLOYEE">Employees</option>
                <option value="PROJECT">Projects</option>
                <option value="TASK">Tasks</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-semibold select-none transition-colors">
              <input
                type="checkbox"
                checked={onlyDependencies}
                onChange={(e) => setOnlyDependencies(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
              />
              <span>Only Dependency Edges</span>
            </label>

            {simulatedNodeId && (
              <button
                onClick={handleClearSimulation}
                className="flex items-center gap-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 px-3.5 py-2 rounded-xl transition-all duration-150 font-semibold shadow-sm"
              >
                <XCircle size={14} className="text-rose-500" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>

        {/* React Flow Area */}
        <div className="flex-1 relative bg-slate-50">
          {simulatedNodeId && (
            <div className="absolute top-4 left-4 z-10 bg-amber-50/90 backdrop-blur-sm border border-amber-200/60 text-amber-900 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>
                Simulating delay: <span className="text-amber-700 font-bold">+{simulatedDelayDays}d</span> from <span className="text-amber-950 font-bold">{nodesToRender.find(n => n.id === simulatedNodeId)?.data.label}</span>
              </span>
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