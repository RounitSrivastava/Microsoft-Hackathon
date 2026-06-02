import MainLayout from "@/components/layout/MainLayout";

export default function CopilotPage() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          AI Copilot
        </h1>

        <div className="bg-slate-800 rounded-2xl p-6 min-h-[500px]">
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-4 rounded-xl max-w-md">
              Which project is at risk?
            </div>

            <div className="bg-blue-600 text-white p-4 rounded-xl max-w-2xl ml-auto">
              Project Alpha is currently at high risk.

              <br />
              <br />

              • 7 overdue tasks

              <br />

              • Security approval pending

              <br />

              • Critical dependency chain blocked

              <br />

              • Estimated delay: 5 days
            </div>
          </div>

          <div className="mt-8">
            <input
              type="text"
              placeholder="Ask OrgMind..."
              className="w-full bg-slate-900 text-white p-4 rounded-xl outline-none"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}