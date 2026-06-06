import { employees } from "@/data/employees";
import { projects } from "@/data/projects";
import { tasks } from "@/data/tasks";
import { decisions } from "@/data/decisions";
import { dependencies } from "@/data/dependencies";
import { calculateRiskReport } from "@/lib/riskEngine";

export default function ProjectTable() {
  const report = calculateRiskReport(employees, projects, tasks, dependencies, decisions);

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-900">
          <tr>
            <th className="p-4 text-left text-white">
              Project
            </th>

            <th className="p-4 text-left text-white">
              Risk
            </th>

            <th className="p-4 text-left text-white">
              Progress
            </th>

            <th className="p-4 text-left text-white">
              Owner
            </th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => {
            const riskReport = report.projectRisks[project.id];
            const owner = project.id === "p1" ? "Rounit Srivastava" : "Abhishek Kumar";

            return (
              <tr key={project.id}>
                <td className="p-4 text-white">
                  {project.name}
                </td>

                <td className={`p-4 font-semibold ${
                  riskReport?.riskLevel === "High"
                    ? "text-red-400"
                    : riskReport?.riskLevel === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}>
                  {riskReport?.riskLevel || "Low"}
                </td>

                <td className="p-4 text-white">
                  {riskReport?.progress || 0}%
                </td>

                <td className="p-4 text-white">
                  {owner}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}