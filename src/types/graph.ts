export interface GraphNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    owner?: string;
    risk?: string;
    status?: string;
    progress?: number;
    members?: number;
    overdueTasks?: number;
    impact?: {
      projectsAffected: number;
      teamsAffected: number;
      delay: number;
      riskIncrease: number;
    };
    aiInsight?: string;
    recommendation?: string;
    [key: string]: any;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: any;
}
