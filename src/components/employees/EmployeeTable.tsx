import { employees } from "@/data/employees";
import { projects } from "@/data/projects";
import { tasks } from "@/data/tasks";
import { decisions } from "@/data/decisions";
import { dependencies } from "@/data/dependencies";
import { calculateRiskReport } from "@/lib/riskEngine";

export default function EmployeeTable() {
  const report = calculateRiskReport(employees, projects, tasks, dependencies, decisions);

  return (
    <div className="grid grid-cols-3 gap-5">
      {employees.map((employee) => {
        const load = report.employeeLoads[employee.id];
        return (
          <div
            key={employee.id}
            className="bg-slate-800 p-6 rounded-2xl"
          >
            <h3 className="text-white text-xl font-bold">
              {employee.name}
            </h3>

            <p className="text-slate-400 mt-2">
              Tasks: {load?.activeCount || 0}
            </p>

            <p className="text-red-400 mt-2">
              Workload: {load?.workloadScore || 0}%
            </p>
          </div>
        );
      })}
    </div>
  );
}