import { Employee } from "@/types/employee";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { Dependency } from "@/types/dependency";
import { Decision } from "@/types/decision";
import { GraphNode, GraphEdge } from "@/types/graph";
import { calculateRiskReport } from "./riskEngine";
import { WorkspaceSettings } from "@/context/DataContext";

interface BuildGraphInput {
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
  decisions: Decision[];
  dependencies: Dependency[];
  settings?: WorkspaceSettings;
}

export function buildGraph({
  employees,
  projects,
  tasks,
  decisions,
  dependencies,
  settings,
}: BuildGraphInput): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const report = calculateRiskReport(employees, projects, tasks, dependencies, decisions, settings);

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // --- 1. Compute Dependency Levels for Tasks (horizontal layout) ---
  const taskLevels: Record<string, number> = {};
  tasks.forEach((t) => (taskLevels[t.id] = 0));

  // Run a relaxation loop to compute longest path lengths (topological levels)
  let changed = true;
  let iterations = 0;
  const maxIterations = tasks.length;

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    dependencies.forEach((dep) => {
      const sourceLevel = taskLevels[dep.source] ?? 0;
      const targetLevel = taskLevels[dep.target] ?? 0;
      if (targetLevel <= sourceLevel) {
        taskLevels[dep.target] = sourceLevel + 1;
        changed = true;
      }
    });
  }

  // --- 2. Add Employee Nodes (Column 1: x = 100) ---
  employees.forEach((emp, index) => {
    const load = report.employeeLoads[emp.id];
    nodes.push({
      id: emp.id,
      type: "employeeNode",
      position: { x: 100, y: 150 + index * 200 },
      data: {
        label: emp.name,
        role: emp.role,
        owner: emp.name,
        status: load.riskLevel === "High" ? "Overloaded" : "Healthy",
        risk: load.riskLevel,
        members: 1, // Individual
        workload: load.workloadScore,
        tasks: load.activeCount,
        aiInsight: load.riskLevel === "High" 
          ? `${emp.name} is overloaded with ${load.activeCount} active tasks and may block downstream items.`
          : `${emp.name} has normal workload capacity.`,
        recommendation: load.riskLevel === "High"
          ? "Reassign tasks or delegate approvals to reduce bottleneck risk."
          : "Available for task assignments.",
      },
    });
  });

  // --- 3. Add Project Nodes (Column 2: x = 450) ---
  projects.forEach((proj, index) => {
    const projRisk = report.projectRisks[proj.id];
    nodes.push({
      id: proj.id,
      type: "projectNode",
      position: { x: 450, y: 180 + index * 320 },
      data: {
        label: proj.name,
        owner: proj.id === "p1" ? "Rounit Srivastava" : "Abhishek Kumar",
        progress: projRisk.progress,
        risk: projRisk.riskLevel,
        status: projRisk.riskLevel === "High" ? "Blocked" : "Healthy",
        overdueTasks: projRisk.overdueCount,
        impact: {
          projectsAffected: proj.id === "p1" ? 2 : 1,
          teamsAffected: proj.id === "p1" ? 3 : 1,
          delay: proj.id === "p1" ? 5 : 0,
          riskIncrease: proj.id === "p1" ? 18 : 0,
        },
        aiInsight: proj.id === "p1"
          ? "Project Phoenix contains 2 overdue tasks and a blocked dependency chain affecting product release."
          : "Project Atlas is on track and running smoothly.",
        recommendation: proj.id === "p1"
          ? "Prioritize security audit and reassign deployment tasks to speed up the launch."
          : "Monitor ongoing tasks regularly.",
      },
    });
  });

  // --- 4. Add Task Nodes (Column 3+ based on levels: x = 800 + level * 350) ---
  // Track vertical offsets per project and level to avoid overlaps
  const levelOffsets: Record<string, number> = {};

  tasks.forEach((task) => {
    const level = taskLevels[task.id] || 0;
    const projectIndex = projects.findIndex((p) => p.id === task.project);
    const key = `${task.project}_${level}`;
    const offsetIndex = levelOffsets[key] || 0;
    levelOffsets[key] = offsetIndex + 1;

    // Define swimlane base y: Project 1 starts at y=100, Project 2 starts at y=600
    const swimlaneBaseY = 100 + projectIndex * 500;
    const y = swimlaneBaseY + offsetIndex * 180;
    const x = 800 + level * 350;

    const ownerName = employees.find((e) => e.id === task.owner)?.name || "Unassigned";

    // Compute task risk level
    let riskLevel: "High" | "Medium" | "Low" = "Low";
    if (task.status === "Blocked") riskLevel = "High";
    else if (task.dueDate < "2026-06-04" && task.status !== "Completed") riskLevel = "High";
    else if (task.status === "In Progress") riskLevel = "Medium";

    nodes.push({
      id: task.id,
      type: "taskNode",
      position: { x, y },
      data: {
        label: task.title,
        owner: ownerName,
        risk: riskLevel,
        status: task.status,
        progress: task.progress,
        dueDate: task.dueDate,
        aiInsight: task.status === "Blocked"
          ? `"${task.title}" is blocked and delays downstream activities.`
          : `"${task.title}" is currently ${task.status.toLowerCase()}.`,
        recommendation: task.status === "Blocked"
          ? "Escalate dependency approval and assign additional backend support."
          : "Continue tracking progress towards deadline.",
      },
    });
  });

  // --- 5. Generate Edges ---
  // A. Employee -> Task (OWNS relationship)
  tasks.forEach((task, index) => {
    if (task.status !== "Completed") {
      edges.push({
        id: `edge_own_${task.id}`,
        source: task.owner,
        target: task.id,
        label: "OWNS",
        animated: task.status === "In Progress" || task.status === "Blocked",
        style: { stroke: "#3b82f6", strokeWidth: 1.5, opacity: 0.6 },
      });
    }
  });

  // B. Project -> Task (REQUIRES relationship)
  // Let's connect project node to any Level 0 tasks in the project to show entry points
  tasks.forEach((task) => {
    const level = taskLevels[task.id] || 0;
    if (level === 0) {
      edges.push({
        id: `edge_req_${task.id}`,
        source: task.project,
        target: task.id,
        label: "REQUIRES",
        animated: false,
        style: { stroke: "#64748b", strokeWidth: 1.5, strokeDasharray: "5,5" },
      });
    }
  });

  // C. Task -> Task (BLOCKS relationship)
  dependencies.forEach((dep, index) => {
    const sourceTask = tasks.find((t) => t.id === dep.source);
    const targetTask = tasks.find((t) => t.id === dep.target);

    if (sourceTask && targetTask) {
      const isCritical = sourceTask.status === "Blocked" || sourceTask.status === "Pending";
      edges.push({
        id: `edge_dep_${index}`,
        source: dep.source,
        target: dep.target,
        label: sourceTask.status === "Blocked" ? "BLOCKS" : "DEPENDS_ON",
        animated: isCritical,
        style: {
          stroke: sourceTask.status === "Blocked" ? "#ef4444" : "#f59e0b",
          strokeWidth: isCritical ? 2.5 : 1.5,
        },
      });
    }
  });

  return { nodes, edges };
}
