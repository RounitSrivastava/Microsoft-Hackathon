import MainLayout from "@/components/layout/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Executive Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Real-time organizational intelligence and risk monitoring
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <MetricCard
            title="Projects"
            value="24"
          />

          <MetricCard
            title="At Risk"
            value="5"
          />

          <MetricCard
            title="Bottlenecks"
            value="3"
          />

          <MetricCard
            title="Tasks"
            value="187"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Panel title="Project Risk Overview">
            <p className="text-slate-400">
              Project Alpha is likely to miss its deadline.
            </p>
          </Panel>

          <Panel title="Critical Dependencies">
            <p className="text-slate-400">
              Security Review → API Deployment → Product Launch
            </p>
          </Panel>
        </div>

        <Panel title="AI Insights">
          <ul className="space-y-3 text-slate-300">
            <li>
              • Project Alpha has 7 overdue tasks.
            </li>

            <li>
              • Security approval is blocking 3 projects.
            </li>

            <li>
              • Rounit is overloaded with 12 active tasks.
            </li>

            <li>
              • Dependency chain may delay release by 5 days.
            </li>
          </ul>
        </Panel>
      </div>
    </MainLayout>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <p className="text-slate-400">{title}</p>

      <h2 className="text-4xl font-bold text-white mt-2">
        {value}
      </h2>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        {title}
      </h3>

      {children}
    </div>
  );
}