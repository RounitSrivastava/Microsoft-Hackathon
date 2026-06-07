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

  // --- 2. Compute Swimlane Base Coordinates dynamically to prevent overlaps ---
  const projectLevelCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    const level = taskLevels[task.id] || 0;
    const key = `${task.project}_${level}`;
    projectLevelCounts[key] = (projectLevelCounts[key] || 0) + 1;
  });

  const projectHeights: Record<string, number> = {};
  projects.forEach((proj) => {
    let maxCount = 1;
    tasks.forEach((task) => {
      if (task.project === proj.id) {
        const level = taskLevels[task.id] || 0;
        const count = projectLevelCounts[`${proj.id}_${level}`] || 0;
        if (count > maxCount) {
          maxCount = count;
        }
      }
    });
    projectHeights[proj.id] = maxCount;
  });

  const projectBaseY: Record<string, number> = {};
  let currentY = 100;
  projects.forEach((proj) => {
    projectBaseY[proj.id] = currentY;
    const height = projectHeights[proj.id] * 170; // 170px height per task node
    currentY += Math.max(260, height + 100); // Spacing between projects
  });

  // --- 3. Add Employee Nodes (Column 1: x = 100) ---
  employees.forEach((emp, index) => {
    const load = report.employeeLoads[emp.id];
    nodes.push({
      id: emp.id,
      type: "employeeNode",
      position: { x: 100, y: 150 + index * 260 },
      data: {
        label: emp.name,
        role: emp.role,
        owner: emp.name,
        status: load.riskLevel === "High" ? "Overloaded" : "Healthy",
        risk: load.riskLevel,
        members: 1,
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

  // --- 4. Add Project Nodes (Column 2: x = 450, centered vertically next to tasks) ---
  projects.forEach((proj) => {
    const projRisk = report.projectRisks[proj.id];
    const swimlaneBaseY = projectBaseY[proj.id];
    const heightTasks = projectHeights[proj.id] * 170;
    const y = swimlaneBaseY + Math.max(0, (heightTasks - 160) / 2);

    nodes.push({
      id: proj.id,
      type: "projectNode",
      position: { x: 450, y },
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

  // --- 5. Add Task Nodes (Column 3+ based on levels: x = 750 + level * 320) ---
  const levelOffsets: Record<string, number> = {};

  tasks.forEach((task) => {
    const level = taskLevels[task.id] || 0;
    const key = `${task.project}_${level}`;
    const offsetIndex = levelOffsets[key] || 0;
    levelOffsets[key] = offsetIndex + 1;

    const swimlaneBaseY = projectBaseY[task.project] || 100;
    const y = swimlaneBaseY + offsetIndex * 170;
    const x = 750 + level * 320;

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

  // --- 6. Generate Edges ---
  // A. Employee -> Task (OWNS relationship - rendered subtly to prevent clutter)
  tasks.forEach((task) => {
    if (task.status !== "Completed") {
      edges.push({
        id: `edge_own_${task.id}`,
        source: task.owner,
        target: task.id,
        label: "OWNS",
        animated: task.status === "In Progress",
        style: { stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4,4", opacity: 0.35 },
      });
    }
  });

  // B. Project -> Task (REQUIRES relationship - rendered subtly)
  tasks.forEach((task) => {
    const level = taskLevels[task.id] || 0;
    if (level === 0) {
      edges.push({
        id: `edge_req_${task.id}`,
        source: task.project,
        target: task.id,
        label: "REQUIRES",
        animated: false,
        style: { stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "3,3", opacity: 0.5 },
      });
    }
  });

  // C. Task -> Task (BLOCKS/DEPENDS_ON relationship - solid colored path flow)
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
          opacity: isCritical ? 0.9 : 0.75,
        },
      });
    }
  });

  return { nodes, edges };
}
