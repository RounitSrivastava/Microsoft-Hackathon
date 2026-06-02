import Card from "../ui/Card";

export default function BottleneckOverview() {
  return (
    <Card>
      <h3 className="text-xl text-white font-bold mb-4">
        Bottlenecks
      </h3>

      <p className="text-red-400">
        Rounit overloaded with 12 tasks
      </p>
    </Card>
  );
}