import { Task } from "@/types/task";

export const tasks: Task[] = [
  { id: "t1", title: "Authentication", owner: "e1", project: "p1", status: "Blocked", dueDate: "2026-06-01", progress: 60 },
  { id: "t2", title: "API Deployment", owner: "e2", project: "p1", status: "Pending", dueDate: "2026-06-15", progress: 0 },
  { id: "t3", title: "Frontend Release", owner: "e2", project: "p1", status: "Pending", dueDate: "2026-06-20", progress: 0 },
  { id: "t4", title: "Product Launch", owner: "e3", project: "p1", status: "Pending", dueDate: "2026-06-25", progress: 0 },
  { id: "t5", title: "Database Migration", owner: "e1", project: "p1", status: "Completed", dueDate: "2026-05-20", progress: 100 },
  
  // Rounit's other tasks to make him overloaded (12 total)
  { id: "t6", title: "Setup CI/CD Pipeline", owner: "e2", project: "p1", status: "In Progress", dueDate: "2026-06-10", progress: 40 },
  { id: "t7", title: "Kubernetes Clustering", owner: "e2", project: "p1", status: "Pending", dueDate: "2026-06-18", progress: 0 },
  { id: "t8", title: "Infrastructure Monitoring", owner: "e2", project: "p1", status: "Pending", dueDate: "2026-06-22", progress: 0 },
  { id: "t9", title: "System Architecture Design", owner: "e2", project: "p1", status: "Completed", dueDate: "2026-05-15", progress: 100 },
  { id: "t10", title: "Load Testing", owner: "e2", project: "p1", status: "Pending", dueDate: "2026-06-14", progress: 0 },
  { id: "t11", title: "Security Audit Checklist", owner: "e2", project: "p1", status: "Blocked", dueDate: "2026-06-05", progress: 10 },
  { id: "t12", title: "Code Review Coordination", owner: "e2", project: "p1", status: "In Progress", dueDate: "2026-06-08", progress: 50 },
  { id: "t13", title: "API Integration Docs", owner: "e2", project: "p1", status: "In Progress", dueDate: "2026-06-12", progress: 70 },
  { id: "t14", title: "Database Backup Config", owner: "e2", project: "p1", status: "Pending", dueDate: "2026-06-16", progress: 0 },
  { id: "t15", title: "SSL Certificate Renewal", owner: "e2", project: "p1", status: "Pending", dueDate: "2026-06-03", progress: 0 },

  // Abhishek's tasks
  { id: "t16", title: "Product Requirements Document", owner: "e3", project: "p1", status: "Completed", dueDate: "2026-05-10", progress: 100 },
  { id: "t17", title: "UI Mockups Design", owner: "e3", project: "p2", status: "In Progress", dueDate: "2026-06-10", progress: 50 },
  { id: "t18", title: "User Feedback Compilation", owner: "e3", project: "p2", status: "In Progress", dueDate: "2026-06-12", progress: 30 },
  { id: "t19", title: "Beta Release Testing", owner: "e3", project: "p2", status: "Pending", dueDate: "2026-06-30", progress: 0 },

  // Sanchari's tasks
  { id: "t20", title: "Market Research", owner: "e4", project: "p2", status: "Completed", dueDate: "2026-05-30", progress: 100 },
  { id: "t21", title: "Marketing Campaign Setup", owner: "e4", project: "p2", status: "In Progress", dueDate: "2026-06-15", progress: 20 },
  { id: "t22", title: "Press Release Drafting", owner: "e4", project: "p2", status: "Pending", dueDate: "2026-06-20", progress: 0 }
];
