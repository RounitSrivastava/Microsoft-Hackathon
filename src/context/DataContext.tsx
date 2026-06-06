"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Employee } from "@/types/employee";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { Dependency } from "@/types/dependency";
import { Decision } from "@/types/decision";
import { Meeting } from "@/types/meeting";

import { employees as initialEmployees } from "@/data/employees";
import { projects as initialProjects } from "@/data/projects";
import { tasks as initialTasks } from "@/data/tasks";
import { dependencies as initialDependencies } from "@/data/dependencies";
import { decisions as initialDecisions } from "@/data/decisions";
import { meetings as initialMeetings } from "@/data/meetings";

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  bio: string;
  avatarBg: string;
}

export interface WorkspaceSettings {
  orgName: string;
  syncMode: string;
  teamsEnabled: boolean;
  teamsKey: string;
  githubEnabled: boolean;
  githubKey: string;
  notifications: {
    highRisk: boolean;
    bottleneck: boolean;
    deadline: boolean;
  };
  copilotPersona: "analyst" | "coach" | "leader" | "creative";
  maxTasksPerEmployee: number;
  projectRiskThreshold: number;
  accentColor: "indigo" | "violet" | "emerald" | "crimson" | "amber";
}

const defaultProfile: UserProfile = {
  name: "Rounit Srivastava",
  role: "Engineering Lead",
  email: "rounit.srivastava@microsoft.com",
  bio: "Org Intelligence Admin. Managing Project Phoenix and dependency cascades.",
  avatarBg: "#4f46e5",
};

const defaultSettings: WorkspaceSettings = {
  orgName: "Microsoft Hackathon Org",
  syncMode: "Live",
  teamsEnabled: false,
  teamsKey: "",
  githubEnabled: false,
  githubKey: "",
  notifications: {
    highRisk: true,
    bottleneck: true,
    deadline: false,
  },
  copilotPersona: "coach",
  maxTasksPerEmployee: 5,
  projectRiskThreshold: 70,
  accentColor: "indigo",
};

interface DataContextType {
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
  dependencies: Dependency[];
  decisions: Decision[];
  meetings: Meeting[];
  settings: WorkspaceSettings;
  addTask: (task: Omit<Task, "id">, selectedDeps?: string[]) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addEmployee: (name: string, role: string) => void;
  updateEmployee: (empId: string, updates: Partial<Employee>) => void;
  deleteEmployee: (empId: string) => void;
  updateProject: (projId: string, updates: Partial<Project>) => void;
  addDecision: (decisionText: string, projectId: string, date: string, meetingId?: string) => void;
  addMeeting: (title: string, date: string, attendees: string[]) => void;
  updateSettings: (newSettings: Partial<WorkspaceSettings>) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  runAutoBalancer: () => { success: boolean; movedCount: number; message: string };
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [settings, setSettings] = useState<WorkspaceSettings>(defaultSettings);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage or seed with mock data
  useEffect(() => {
    try {
      const storedEmployees = localStorage.getItem("orgmind_employees");
      const storedProjects = localStorage.getItem("orgmind_projects");
      const storedTasks = localStorage.getItem("orgmind_tasks");
      const storedDependencies = localStorage.getItem("orgmind_dependencies");
      const storedDecisions = localStorage.getItem("orgmind_decisions");
      const storedMeetings = localStorage.getItem("orgmind_meetings");
      const storedSettings = localStorage.getItem("orgmind_settings");
      const storedProfile = localStorage.getItem("orgmind_profile");

      if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
      else setEmployees(initialEmployees);

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      else setProjects(initialProjects);

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      else setTasks(initialTasks);

      if (storedDependencies) setDependencies(JSON.parse(storedDependencies));
      else setDependencies(initialDependencies);

      if (storedDecisions) setDecisions(JSON.parse(storedDecisions));
      else setDecisions(initialDecisions);

      if (storedMeetings) setMeetings(JSON.parse(storedMeetings));
      else setMeetings(initialMeetings);

      if (storedSettings) setSettings(JSON.parse(storedSettings));
      else setSettings(defaultSettings);

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      else setProfile(defaultProfile);
    } catch (e) {
      console.error("Failed to load local storage data, fallback to static", e);
      setEmployees(initialEmployees);
      setProjects(initialProjects);
      setTasks(initialTasks);
      setDependencies(initialDependencies);
      setDecisions(initialDecisions);
      setMeetings(initialMeetings);
      setSettings(defaultSettings);
      setProfile(defaultProfile);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("orgmind_profile", JSON.stringify(profile));
  }, [profile, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("orgmind_employees", JSON.stringify(employees));
  }, [employees, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("orgmind_projects", JSON.stringify(projects));
  }, [projects, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("orgmind_tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("orgmind_dependencies", JSON.stringify(dependencies));
  }, [dependencies, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("orgmind_decisions", JSON.stringify(decisions));
  }, [decisions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("orgmind_meetings", JSON.stringify(meetings));
  }, [meetings, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("orgmind_settings", JSON.stringify(settings));
  }, [settings, isLoaded]);

  const addTask = (newTaskData: Omit<Task, "id">, selectedDeps?: string[]) => {
    const newId = `t${Date.now()}`;
    const newTask: Task = {
      ...newTaskData,
      id: newId,
    };

    setTasks((prev) => [...prev, newTask]);

    if (selectedDeps && selectedDeps.length > 0) {
      const newDeps = selectedDeps.map((depId) => ({
        source: depId,
        target: newId,
      }));
      setDependencies((prev) => [...prev, ...newDeps]);
    }
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setDependencies((prev) =>
      prev.filter((d) => d.source !== taskId && d.target !== taskId)
    );
  };

  const addEmployee = (name: string, role: string) => {
    const newId = `e${Date.now()}`;
    const newEmp: Employee = { id: newId, name, role };
    setEmployees((prev) => [...prev, newEmp]);
  };

  const updateEmployee = (empId: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, ...updates } : e))
    );
  };

  const deleteEmployee = (empId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== empId));
    
    // Clear ownership of tasks owned by this employee
    setTasks((prev) =>
      prev.map((t) => (t.owner === empId ? { ...t, owner: "" } : t))
    );

    // Remove from meetings attendees
    setMeetings((prev) =>
      prev.map((m) => ({
        ...m,
        attendees: m.attendees.filter((id) => id !== empId),
      }))
    );
  };

  const updateProject = (projId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projId ? { ...p, ...updates } : p))
    );
  };

  const addDecision = (decisionText: string, projectId: string, date: string, meetingId: string = "m1") => {
    const newId = `d${Date.now()}`;
    const newDec: Decision = {
      id: newId,
      decision: decisionText,
      meetingId,
      projectId,
      date,
    };
    setDecisions((prev) => [...prev, newDec]);
  };

  const addMeeting = (title: string, date: string, attendees: string[]) => {
    const newId = `m${Date.now()}`;
    const newMeeting: Meeting = {
      id: newId,
      title,
      date,
      attendees,
    };
    setMeetings((prev) => [...prev, newMeeting]);
  };

  const updateSettings = (newSettings: Partial<WorkspaceSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      notifications: newSettings.notifications
        ? { ...prev.notifications, ...newSettings.notifications }
        : prev.notifications,
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const runAutoBalancer = () => {
    let tempTasks = [...tasks];
    let movedCount = 0;

    const getActiveCounts = (taskList: Task[]) => {
      const counts: Record<string, number> = {};
      employees.forEach((emp) => {
        counts[emp.id] = taskList.filter((t) => t.owner === emp.id && t.status !== "Completed").length;
      });
      return counts;
    };

    let activeCounts = getActiveCounts(tempTasks);
    let iterations = 0;
    const maxIterations = 20;

    while (iterations < maxIterations) {
      let overloadedId: string | null = null;
      let maxActive = settings.maxTasksPerEmployee - 1;

      Object.entries(activeCounts).forEach(([empId, count]) => {
        if (count > maxActive) {
          maxActive = count;
          overloadedId = empId;
        }
      });

      if (!overloadedId) break;

      let helperId: string | null = null;
      let minActive = Math.max(1, settings.maxTasksPerEmployee - 2);

      Object.entries(activeCounts).forEach(([empId, count]) => {
        if (empId !== overloadedId && count < minActive) {
          minActive = count;
          helperId = empId;
        }
      });

      if (!helperId) break;

      const taskToMoveIndex = tempTasks.findIndex(
        (t) => t.owner === overloadedId && t.status !== "Completed"
      );

      if (taskToMoveIndex === -1) break;

      tempTasks[taskToMoveIndex] = {
        ...tempTasks[taskToMoveIndex],
        owner: helperId,
      };

      movedCount++;
      activeCounts = getActiveCounts(tempTasks);
      iterations++;
    }

    if (movedCount > 0) {
      setTasks(tempTasks);
      return {
        success: true,
        movedCount,
        message: `Successfully rebalanced workload. Shifted ${movedCount} task(s) to team members with higher capacity.`,
      };
    }

    return {
      success: false,
      movedCount: 0,
      message: "No tasks could be rebalanced. Workloads are already optimal or helper resources are at capacity.",
    };
  };

  const resetData = () => {
    localStorage.removeItem("orgmind_employees");
    localStorage.removeItem("orgmind_projects");
    localStorage.removeItem("orgmind_tasks");
    localStorage.removeItem("orgmind_dependencies");
    localStorage.removeItem("orgmind_decisions");
    localStorage.removeItem("orgmind_meetings");
    localStorage.removeItem("orgmind_settings");
    localStorage.removeItem("orgmind_profile");

    setEmployees(initialEmployees);
    setProjects(initialProjects);
    setTasks(initialTasks);
    setDependencies(initialDependencies);
    setDecisions(initialDecisions);
    setMeetings(initialMeetings);
    setSettings(defaultSettings);
    setProfile(defaultProfile);
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        projects,
        tasks,
        dependencies,
        decisions,
        meetings,
        settings,
        addTask,
        updateTask,
        deleteTask,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        updateProject,
        addDecision,
        addMeeting,
        updateSettings,
        profile,
        updateProfile,
        runAutoBalancer,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
