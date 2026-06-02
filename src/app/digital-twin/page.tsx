import MainLayout from "@/components/layout/MainLayout";
import OrgGraph from "@/components/graph/OrgGraph";

export default function DigitalTwinPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Organizational Digital Twin
          </h1>

          <p className="text-slate-400 mt-2">
            Visualize relationships between
            teams, projects, tasks and decisions.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-2xl p-5">
            <p className="text-slate-400">
              Teams
            </p>

            <h2 className="text-white text-3xl font-bold mt-2">
              8
            </h2>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5">
            <p className="text-slate-400">
              Projects
            </p>

            <h2 className="text-white text-3xl font-bold mt-2">
              24
            </h2>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5">
            <p className="text-slate-400">
              Dependencies
            </p>

            <h2 className="text-white text-3xl font-bold mt-2">
              67
            </h2>
          </div>

          <div className="bg-slate-800 rounded-2xl p-5">
            <p className="text-slate-400">
              Risks
            </p>

            <h2 className="text-red-400 text-3xl font-bold mt-2">
              5
            </h2>
          </div>
        </div>
<div className="bg-slate-800 rounded-xl p-4">
  <input
    type="text"
    placeholder="Search project, task, employee..."
    className="w-full bg-slate-900 text-white p-3 rounded-lg outline-none"
  />
</div>
        <OrgGraph />
      </div>
    </MainLayout>
  );
}