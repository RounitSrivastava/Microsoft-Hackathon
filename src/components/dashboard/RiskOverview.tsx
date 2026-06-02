import Card from "../ui/Card";

export default function RiskOverview() {
  return (
    <Card>
      <h3 className="text-xl text-white font-bold mb-4">
        Project Risks
      </h3>

      <ul className="space-y-2 text-slate-300">
        <li>⚠ Project Alpha - High Risk</li>
        <li>⚠ Project Beta - Medium Risk</li>
      </ul>
    </Card>
  );
}