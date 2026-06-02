export default function Navbar() {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Organizational Intelligence
        </h2>

        <p className="text-slate-400 text-sm">
          Monitor risks, bottlenecks and dependencies
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-slate-800 px-4 py-2 rounded-lg text-white">
          24 Projects
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          R
        </div>
      </div>
    </header>
  );
}