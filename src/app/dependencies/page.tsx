import MainLayout from "@/components/layout/MainLayout";

export default function DependenciesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-white">
          Dependency Analysis
        </h1>

        <p className="text-slate-400">
          Visualize project dependencies and identify critical blockers.
        </p>

        <div className="bg-slate-800 rounded-2xl p-8">
          <h2 className="text-xl text-white font-semibold mb-6">
            Critical Dependency Chain
          </h2>

          <div className="space-y-4 text-center">
            <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl">
              Security Review
            </div>

            <div className="text-slate-500 text-2xl">↓</div>

            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 p-4 rounded-xl">
              API Deployment
            </div>

            <div className="text-slate-500 text-2xl">↓</div>

            <div className="bg-blue-500/20 border border-blue-500 text-blue-400 p-4 rounded-xl">
              Frontend Release
            </div>

            <div className="text-slate-500 text-2xl">↓</div>

            <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-xl">
              Product Launch
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            Impact Analysis
          </h2>

          <ul className="space-y-2 text-slate-300">
            <li>• Delay Impact: 5 Days</li>
            <li>• Projects Affected: 3</li>
            <li>• Teams Affected: 2</li>
            <li>• Risk Increase: +18%</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}