import { GraphNode, GraphEdge } from "@/types/graph";

interface QueryResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  matchedType: "owner" | "risky_projects" | "overloaded" | "blockers" | "impact" | "unknown";
  targetName?: string;
}

export function queryGraph(
  question: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): QueryResult {
  const q = question.toLowerCase();

  // 1. Query: Who owns X? (e.g. "Who owns deployment?", "who owns authentication?")
  if (q.includes("who owns") || q.includes("owner of")) {
    // Extract task name
    const taskName = q.replace("who owns", "").replace("owner of", "").replace(/[?.]/g, "").trim();
    
    // Find matching task node
    const taskNode = nodes.find(
      (n) => n.type === "taskNode" && n.data.label.toLowerCase().includes(taskName)
    );

    if (taskNode) {
      const ownerName = taskNode.data.owner;
      const employeeNode = nodes.find(
        (n) => n.type === "employeeNode" && n.data.label.toLowerCase() === ownerName.toLowerCase()
      );

      const matchedNodes = [taskNode];
      if (employeeNode) matchedNodes.push(employeeNode);

      // Find the owns edge
      const ownsEdge = edges.find(
        (e) => e.target === taskNode.id && e.source === employeeNode?.id
      );
      const matchedEdges = ownsEdge ? [ownsEdge] : [];

      return {
        nodes: matchedNodes,
        edges: matchedEdges,
        matchedType: "owner",
        targetName: taskNode.data.label,
      };
    }
  }

  // 2. Query: Which project is risky? / What is the riskiest project?
  if (q.includes("risky") || q.includes("risk") || q.includes("health")) {
    const projectNode = nodes.find(
      (n) => n.type === "projectNode" && n.data.risk === "High"
    );

    if (projectNode) {
      // Find all tasks required by this project
      const requiredEdges = edges.filter(
        (e) => e.source === projectNode.id && e.label === "REQUIRES"
      );
      const taskIds = requiredEdges.map((e) => e.target);
      const projectTasks = nodes.filter((n) => taskIds.includes(n.id));

      // Also get dependency edges between these tasks
      const dependencyEdges = edges.filter(
        (e) => taskIds.includes(e.source) && taskIds.includes(e.target)
      );

      return {
        nodes: [projectNode, ...projectTasks],
        edges: [...requiredEdges, ...dependencyEdges],
        matchedType: "risky_projects",
        targetName: projectNode.data.label,
      };
    }
  }

  // 3. Query: Who is overloaded? / Who are the bottlenecks?
  if (q.includes("overloaded") || q.includes("bottleneck") || q.includes("capacity")) {
    const overloadedEmployees = nodes.filter(
      (n) => n.type === "employeeNode" && n.data.risk === "High"
    );

    const empIds = overloadedEmployees.map((e) => e.id);
    // Find active tasks owned by these employees
    const ownsEdges = edges.filter(
      (e) => empIds.includes(e.source) && e.label === "OWNS"
    );
    const taskIds = ownsEdges.map((e) => e.target);
    const relatedTasks = nodes.filter((n) => taskIds.includes(n.id));

    return {
      nodes: [...overloadedEmployees, ...relatedTasks],
      edges: ownsEdges,
      matchedType: "overloaded",
    };
  }

  // 4. Query: What is blocking X? (e.g. "What is blocking Project Phoenix?")
  if (q.includes("blocking") || q.includes("blocker")) {
    // Find if a project is named
    const projectNode = nodes.find(
      (n) => n.type === "projectNode" && q.includes(n.data.label.toLowerCase())
    );

    if (projectNode) {
      // Find blocked tasks inside the project
      const requiredEdges = edges.filter(
        (e) => e.source === projectNode.id && e.label === "REQUIRES"
      );
      const taskIds = requiredEdges.map((e) => e.target);
      const projectTasks = nodes.filter((n) => taskIds.includes(n.id));
      const blockedTasks = projectTasks.filter((t) => t.data.status === "Blocked");

      // Find dependency chains related to blocked tasks
      const blockedTaskIds = blockedTasks.map((t) => t.id);
      const blockerEdges = edges.filter(
        (e) => blockedTaskIds.includes(e.source) || blockedTaskIds.includes(e.target)
      );
      
      const relatedTaskIds = new Set<string>();
      blockerEdges.forEach((e) => {
        relatedTaskIds.add(e.source);
        relatedTaskIds.add(e.target);
      });
      const relatedTasks = nodes.filter((n) => relatedTaskIds.has(n.id) && n.id !== projectNode.id);

      return {
        nodes: [projectNode, ...relatedTasks],
        edges: [...blockerEdges],
        matchedType: "blockers",
        targetName: projectNode.data.label,
      };
    }

    // Check if a task is named
    const taskNode = nodes.find(
      (n) => n.type === "taskNode" && q.includes(n.data.label.toLowerCase())
    );

    if (taskNode) {
      // Find what blocks this task
      const incomingEdges = edges.filter(
        (e) => e.target === taskNode.id && e.label === "BLOCKS"
      );
      const blockerIds = incomingEdges.map((e) => e.source);
      const blockers = nodes.filter((n) => blockerIds.includes(n.id));

      return {
        nodes: [taskNode, ...blockers],
        edges: incomingEdges,
        matchedType: "blockers",
        targetName: taskNode.data.label,
      };
    }
  }

  // 5. Query: What happens if X is delayed? (e.g. "What happens if Security Review is delayed?")
  if (q.includes("if") && (q.includes("delay") || q.includes("slip") || q.includes("late"))) {
    // Find task node
    const taskNode = nodes.find(
      (n) => n.type === "taskNode" && (q.includes(n.data.label.toLowerCase()) || q.includes("security") || q.includes("authentication"))
    );

    if (taskNode) {
      // Tracing downstream tasks
      const visitedIds = new Set<string>([taskNode.id]);
      const queue = [taskNode.id];
      const matchedEdges: GraphEdge[] = [];

      while (queue.length > 0) {
        const current = queue.shift()!;
        edges
          .filter((e) => e.source === current && (e.label === "BLOCKS" || e.label === "DEPENDS_ON" || e.label === "ENABLES"))
          .forEach((e) => {
            if (!visitedIds.has(e.target)) {
              visitedIds.add(e.target);
              matchedEdges.push(e);
              queue.push(e.target);
            }
          });
      }

      const matchedNodes = nodes.filter((n) => visitedIds.has(n.id));

      return {
        nodes: matchedNodes,
        edges: matchedEdges,
        matchedType: "impact",
        targetName: taskNode.data.label,
      };
    }
  }

  // Default: Return everything if no specific query matched
  return {
    nodes: [],
    edges: [],
    matchedType: "unknown",
  };
}
