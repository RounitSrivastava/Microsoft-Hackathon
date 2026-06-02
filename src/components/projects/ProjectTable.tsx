import { projects } from "@/data/projects";

export default function ProjectTable() {
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
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="p-4 text-white">
                {project.name}
              </td>

              <td className="p-4 text-red-400">
                {project.risk}
              </td>

              <td className="p-4 text-white">
                {project.progress}%
              </td>

              <td className="p-4 text-white">
                {project.owner}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}