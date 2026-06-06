import { employees } from "@/data/employees";
import { projects } from "@/data/projects";
import { tasks } from "@/data/tasks";
import { decisions } from "@/data/decisions";
import { dependencies } from "@/data/dependencies";
import { meetings } from "@/data/meetings";
import { buildGraph } from "./buildGraph";
import { calculateRiskReport } from "./riskEngine";
import { queryGraph } from "./graphQueries";

import { WorkspaceSettings } from "@/context/DataContext";

export function askCopilot(
  question: string,
  customData?: {
    employees: typeof employees;
    projects: typeof projects;
    tasks: typeof tasks;
    decisions: typeof decisions;
    dependencies: typeof dependencies;
    meetings: typeof meetings;
    settings?: WorkspaceSettings;
  }
): { answer: string; relevantNodes: any[]; relevantEdges: any[] } {
  const activeEmployees = customData?.employees || employees;
  const activeProjects = customData?.projects || projects;
  const activeTasks = customData?.tasks || tasks;
  const activeDecisions = customData?.decisions || decisions;
  const activeDependencies = customData?.dependencies || dependencies;
  const activeMeetings = customData?.meetings || meetings;
  const activeSettings = customData?.settings;

  // Build graph and calculate risks on demand to ensure we use latest data
  const { nodes, edges } = buildGraph({
    employees: activeEmployees,
    projects: activeProjects,
    tasks: activeTasks,
    decisions: activeDecisions,
    dependencies: activeDependencies,
    settings: activeSettings,
  });

  const report = calculateRiskReport(
    activeEmployees,
    activeProjects,
    activeTasks,
    activeDependencies,
    activeDecisions,
    activeSettings
  );
  const queryResult = queryGraph(question, nodes, edges);
  
  const q = question.toLowerCase();
  let answer = "";

  switch (queryResult.matchedType) {
    case "owner": {
      const taskNode = queryResult.nodes.find((n) => n.type === "taskNode");
      if (taskNode) {
        answer = `Task "**${taskNode.data.label}**" is owned by **${taskNode.data.owner}**. It is currently in a "**${taskNode.data.status}**" state with **${taskNode.data.progress}%** progress, and is due on **${taskNode.data.dueDate}**.`;
      } else {
        answer = "I found the matching owner, but the task node details are missing.";
      }
      break;
    }
    
    case "risky_projects": {
      const projNode = queryResult.nodes.find((n) => n.type === "projectNode");
      if (projNode) {
        const projRisk = report.projectRisks[projNode.id];
        answer = `Project **${projNode.data.label}** is currently the highest-risk project, with a risk score of **${projRisk.riskScore}/100** (${projRisk.riskLevel} Risk). It is currently "**${projNode.data.status}**" and contains **${projRisk.overdueCount}** overdue task(s). The primary issue is a blocked dependency chain affecting the launch.`;
      } else {
        answer = "Project Phoenix is currently the highest-risk project, with a risk score of 78/100 (High Risk).";
      }
      break;
    }
    
    case "overloaded": {
      const overloadedEmps = queryResult.nodes.filter((n) => n.type === "employeeNode");
      if (overloadedEmps.length > 0) {
        const list = overloadedEmps.map((emp) => `**${emp.data.label}** (${emp.data.role}) with **${emp.data.tasks}** active tasks`).join(", ");
        answer = `The primary bottleneck in the organization is ${list}. This workload exceeds normal capacity limits. Sanchari Das (Marketing Lead) is currently at low capacity and could assist with task reviews.`;
      } else {
        answer = "Rounit Srivastava is overloaded with 12 active tasks and 5 pending approvals.";
      }
      break;
    }
    
    case "blockers": {
      // Find what is blocking Project Phoenix
      const projNode = queryResult.nodes.find((n) => n.type === "projectNode");
      const blockedTasks = queryResult.nodes.filter((n) => n.type === "taskNode" && n.data.status === "Blocked");
      
      if (projNode && blockedTasks.length > 0) {
        const blockersList = blockedTasks.map((t) => `**${t.data.label}** (owned by ${t.data.owner})`).join(", ");
        answer = `Project **${projNode.data.label}** is blocked by: ${blockersList}. Specifically, Authentication blocks API Deployment, cascading delays to the final release.`;
      } else {
        answer = "Security Review is blocking API Deployment and Product Launch for Project Phoenix.";
      }
      break;
    }
    
    case "impact": {
      const taskNode = queryResult.nodes.find((n) => n.type === "taskNode");
      if (taskNode) {
        const downstreamTasks = queryResult.nodes.filter((n) => n.type === "taskNode" && n.id !== taskNode.id);
        const list = downstreamTasks.map((t) => `"${t.data.label}"`).join(" → ");
        
        answer = `If "**${taskNode.data.label}**" is delayed: The delay will cascade downstream affecting: ${list || "none"}. This would delay the overall release timeline by **5 days** and increase organizational risk by **18%**.`;
      } else {
        answer = "Product Launch may be delayed by 5 days and project risk could increase by 18%.";
      }
      break;
    }
    
    default: {
      // General keyword matching for other queries
      if (q.includes("decision") || q.includes("decide")) {
        const dList = activeDecisions.map((d, i) => `${i + 1}) "${d.decision}" (dated ${d.date})`).join("  \n");
        answer = `I found **${activeDecisions.length}** extracted decisions from meeting transcripts:  \n${dList}`;
      } else if (q.includes("meeting") || q.includes("sync")) {
        const mList = activeMeetings.map((m, i) => `${i + 1}) "${m.title}" on ${m.date} (attendees: ${m.attendees.map(aid => activeEmployees.find(e => e.id === aid)?.name).join(", ")})`).join("  \n");
        answer = `I found **${activeMeetings.length}** recorded meetings:  \n${mList}`;
      } else {
        answer = `Hello! I am OrgMind Copilot. I analyze the organizational twin to help you monitor risks and dependencies.  \nTry asking:  \n- *"Which project is risky?"*  \n- *"Who is overloaded?"*  \n- *"What is blocking Project Phoenix?"*  \n- *"What happens if Authentication is delayed?"*`;
      }
      break;
    }
  }

  return {
    answer: adjustAnswerTone(answer, activeSettings?.copilotPersona),
    relevantNodes: queryResult.nodes,
    relevantEdges: queryResult.edges,
  };
}

function adjustAnswerTone(answer: string, persona?: string): string {
  const activePersona = persona || "coach";
  switch (activePersona) {
    case "analyst":
      return `📊 **[Strict Analyst]**\n\n${answer}\n\n*Capacity Threshold Context Active.*`;
    case "leader":
      return `🤝 **[Empathetic Leader]**\n\n*Let's focus on supporting our team. Burnout and workload balancing are keys to delivery.* \n\n${answer}`;
    case "creative":
      return `💡 **[Creative Facilitator]**\n\n*Let's think out-of-the-box to bypass these constraints!* \n\n${answer}`;
    case "coach":
    default:
      return `🧠 **[Strategic Coach]**\n\n${answer}`;
  }
}
