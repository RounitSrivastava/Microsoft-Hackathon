import MainLayout from "@/components/layout/MainLayout";

const bottlenecks = [
  {
    name: "Rounit Srivastava",
    role: "Engineering Lead",
    tasks: 12,
    approvals: 5,
    risk: 92,
  },
  {
    name: "Abhishek Kumar",
    role: "Product Manager",
    tasks: 8,
    approvals: 3,
    risk: 76,
  },
  {
    name: "Sanchari Das",
    role: "Marketing Lead",
    tasks: 4,
    approvals: 1,
    risk: 42,
  },
];

export default function BottlenecksPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Bottleneck Detection
          </h1>

          <p className="text-slate-400 mt-2">
            Identify overloaded employees and decision-makers that may delay projects.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">High Risk</p>
            <h2 className="text-4xl font-bold text-red-400 mt-2">1</h2>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Medium Risk</p>
            <h2 className="text-4xl font-bold text-yellow-400 mt-2">1</h2>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">Healthy Resources</p>
            <h2 className="text-4xl font-bold text-green-400 mt-2">1</h2>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-4 text-left text-white">Employee</th>
                <th className="p-4 text-left text-white">Role</th>
                <th className="p-4 text-left text-white">Active Tasks</th>
                <th className="p-4 text-left text-white">Pending Approvals</th>
                <th className="p-4 text-left text-white">Risk Score</th>
              </tr>
            </thead>

            <tbody>
              {bottlenecks.map((employee) => (
                <tr
                  key={employee.name}
                  className="border-t border-slate-700"
                >
                  <td className="p-4 text-white">
                    {employee.name}
                  </td>

                  <td className="p-4 text-slate-300">
                    {employee.role}
                  </td>

                  <td className="p-4 text-white">
                    {employee.tasks}
                  </td>

                  <td className="p-4 text-white">
                    {employee.approvals}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        employee.risk >= 80
                          ? "bg-red-500/20 text-red-400"
                          : employee.risk >= 60
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {employee.risk}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            AI Recommendations
          </h2>

          <div className="space-y-3 text-slate-300">
            <p>
              ⚠ Rounit is handling 12 active tasks and 5 pending approvals.
            </p>

            <p>
              ⚠ Project Alpha depends on approvals from Rounit.
            </p>

            <p>
              ⚠ Reassign 3 tasks to reduce delivery risk by 18%.
            </p>

            <p>
              ✅ Sanchari has available capacity and can assist with reviews.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}