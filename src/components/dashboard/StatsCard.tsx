import Card from "../ui/Card";

export default function StatsCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <Card>
      <p className="text-slate-400">{title}</p>

      <h2 className="text-4xl font-bold text-white mt-2">
        {value}
      </h2>
    </Card>
  );
}