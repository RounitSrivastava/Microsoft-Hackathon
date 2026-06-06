export interface Task {
  id: string;
  title: string;
  owner: string; // Employee ID
  project: string; // Project ID
  status: "Completed" | "Pending" | "Blocked" | "In Progress";
  dueDate: string; // YYYY-MM-DD
  progress: number; // 0 to 100
}
