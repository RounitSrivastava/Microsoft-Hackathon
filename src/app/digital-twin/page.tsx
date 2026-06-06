"use client";

import MainLayout from "@/components/layout/MainLayout";
import OrgGraph from "@/components/graph/OrgGraph";
import { Network } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function DigitalTwinPage() {
  const { employees, projects, tasks, dependencies } = useData();
  const activeTasksCount = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12 fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 leading-none">
              <Network className="text-indigo-600" size={26} />
              Organizational <span className="text-gradient">Digital Twin</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Visualize relationships between employees, projects, tasks, and blocked dependency chains.
            </p>
          </div>
        </div>

        {/* Dynamic Metric Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-5">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Teams</p>
            <h2 className="text-slate-900 text-2xl font-bold mt-1 font-mono">1</h2>
          </div>

          <div className="card p-5">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Projects</p>
            <h2 className="text-slate-900 text-2xl font-bold mt-1 font-mono">{projects.length}</h2>
          </div>

          <div className="card p-5">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Dependencies</p>
            <h2 className="text-slate-900 text-2xl font-bold mt-1 font-mono">{dependencies.length}</h2>
          </div>

          <div className="card p-5">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Tasks</p>
            <h2 className="text-slate-900 text-2xl font-bold mt-1 font-mono">{activeTasksCount}</h2>
          </div>
        </div>

        {/* Interactive Org Graph */}
        <OrgGraph />
      </div>
    </MainLayout>
  );
}