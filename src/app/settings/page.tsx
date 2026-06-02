import MainLayout from "@/components/layout/MainLayout";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            Organization Settings
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Organization Name"
              className="w-full bg-slate-900 p-3 rounded-lg text-white"
            />

            <input
              type="text"
              placeholder="Microsoft Teams API Key"
              className="w-full bg-slate-900 p-3 rounded-lg text-white"
            />

            <input
              type="text"
              placeholder="GitHub API Key"
              className="w-full bg-slate-900 p-3 rounded-lg text-white"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}