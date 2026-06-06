import { buildGraph } from "@/lib/buildGraph";
import { employees } from "./employees";
import { projects } from "./projects";
import { tasks } from "./tasks";
import { decisions } from "./decisions";
import { dependencies } from "./dependencies";

const { nodes: dynamicNodes, edges: dynamicEdges } = buildGraph({
  employees,
  projects,
  tasks,
  decisions,
  dependencies,
});

export const nodes = dynamicNodes;
export const edges = dynamicEdges;
export { dynamicNodes, dynamicEdges };
