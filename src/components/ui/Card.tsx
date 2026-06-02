export default function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      {children}
    </div>
  );
}