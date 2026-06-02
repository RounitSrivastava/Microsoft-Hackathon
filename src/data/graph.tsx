export const nodes = [
  {
    id: "team",
    type: "employeeNode",
    position: { x: 100, y: 250 },

    data: {
      label: "Engineering Team",
      owner: "Rounit",
      risk: "Low",
      members: 12,
    },
  },

  {
    id: "project",
    type: "projectNode",
    position: { x: 450, y: 250 },

    data: {
      label: "Project Alpha",
      owner: "Rounit",
      risk: "High",
      progress: 72,
      status: "Blocked",
      overdueTasks: 7,
    },
  },

  {
    id: "decision",
    type: "taskNode",
    position: { x: 800, y: 80 },

    data: {
      label: "Security Approval",
      owner: "Security Team",
      risk: "High",
      status: "Pending",
      delayImpact: 5,
    },
  },

  {
    id: "review",
    type: "taskNode",
    position: { x: 800, y: 250 },

    data: {
      label: "Security Review",
      owner: "Security Team",
      risk: "High",
      status: "Blocked",
      delayImpact: 5,
    },
  },

  {
    id: "deployment",
    type: "taskNode",
    position: { x: 1150, y: 250 },

    data: {
      label: "API Deployment",
      owner: "DevOps Team",
      risk: "Medium",
      status: "Pending",
    },
  },

  {
    id: "release",
    type: "taskNode",
    position: { x: 1500, y: 250 },

    data: {
      label: "Frontend Release",
      owner: "Frontend Team",
      risk: "Medium",
      status: "Waiting",
    },
  },

  {
    id: "launch",
    type: "taskNode",
    position: { x: 1850, y: 250 },

    data: {
      label: "Product Launch",
      owner: "Product Team",
      risk: "High",
      status: "At Risk",
    },
  },
];

export const edges = [
  {
    id: "e1",
    source: "team",
    target: "project",
    animated: true,
    label: "OWNS",
  },

  {
    id: "e2",
    source: "project",
    target: "decision",
    animated: true,
    label: "REQUIRES",
  },

  {
    id: "e3",
    source: "decision",
    target: "review",
    animated: true,
    label: "APPROVES",
  },

  {
    id: "e4",
    source: "review",
    target: "deployment",
    animated: true,
    label: "BLOCKS",
  },

  {
    id: "e5",
    source: "deployment",
    target: "release",
    animated: true,
    label: "DEPENDS_ON",
  },

  {
    id: "e6",
    source: "release",
    target: "launch",
    animated: true,
    label: "ENABLES",
  },
];