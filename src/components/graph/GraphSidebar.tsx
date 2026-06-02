interface Props {
  selectedNode: any;
}

export default function GraphSidebar({
  selectedNode,
}: Props) {
  if (!selectedNode) {
    return (
      <div className="w-96 bg-slate-900 p-6">
        <h2 className="text-white text-xl font-bold">
          OrgMind Intelligence
        </h2>

        <p className="text-slate-400 mt-4">
          Select a node to inspect.
        </p>
      </div>
    );
  }

  const data = selectedNode.data;

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto">
      <h2 className="text-2xl text-white font-bold">
        {data.label}
      </h2>

      <div className="space-y-4 mt-6">
        <Info title="Owner" value={data.owner} />

        <Info title="Risk" value={data.risk} />

        <Info title="Status" value={data.status} />

        <Info
          title="Progress"
          value={`${data.progress || 0}%`}
        />
      </div>

      <div className="mt-8 bg-slate-800 rounded-xl p-4">
        <h3 className="text-white font-semibold">
          Impact Analysis
        </h3>

        <ul className="text-slate-300 mt-3 space-y-2">
          <li>Projects Affected: 2</li>
          <li>Teams Affected: 3</li>
          <li>Delay Impact: +5 Days</li>
          <li>Risk Increase: +18%</li>
        </ul>
      </div>

      <div className="mt-6 bg-blue-600/20 border border-blue-500 rounded-xl p-4">
        <h3 className="text-blue-300 font-semibold">
          AI Insight
        </h3>

        <p className="text-slate-200 mt-2">
          This task is part of a critical
          dependency chain and may delay the
          project launch.
        </p>
      </div>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-slate-400">
        {title}
      </p>

      <p className="text-white">
        {value}
      </p>
    </div>
  );
}