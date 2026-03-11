export const revalidate = 60;

const SERVICES = [
  { name: "blackroad.io", url: "https://blackroad.io", category: "Website" },
  { name: "app.blackroad.io", url: "https://app.blackroad.io", category: "App" },
  { name: "api.blackroad.io", url: "https://api.blackroad.io", category: "API" },
  { name: "dashboard.blackroad.io", url: "https://dashboard.blackroad.io", category: "App" },
  { name: "docs.blackroad.io", url: "https://docs.blackroad.io", category: "App" },
  { name: "demo.blackroad.io", url: "https://demo.blackroad.io", category: "App" },
  { name: "console.blackroad.io", url: "https://console.blackroad.io", category: "App" },
  { name: "status.blackroad.io", url: "https://status.blackroad.io", category: "App" },
  { name: "fleet.blackroad.io", url: "https://fleet.blackroad.io", category: "Infra" },
  { name: "lucidia.earth", url: "https://lucidia.earth", category: "Website" },
  { name: "www.lucidia.earth", url: "https://www.lucidia.earth", category: "Website" },
  { name: "blackroadai.com", url: "https://blackroadai.com", category: "Website" },
  { name: "blackroad-os.github.io", url: "https://blackroad-os.github.io", category: "Website" },
  { name: "git.blackroad.io", url: "https://git.blackroad.io", category: "Infra" },
  { name: "agents.blackroad.io", url: "https://agents.blackroad.io", category: "API" },
];

async function checkService(url: string): Promise<{ status: number; latency: number }> {
  const start = Date.now();
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(5000) });
    return { status: res.status, latency: Date.now() - start };
  } catch {
    return { status: 0, latency: Date.now() - start };
  }
}

export default async function StatusPage() {
  const results = await Promise.all(
    SERVICES.map(async (s) => {
      const check = await checkService(s.url);
      return { ...s, ...check };
    })
  );

  const operational = results.filter((r) => r.status >= 200 && r.status < 400).length;
  const degraded = results.filter((r) => r.status >= 400 && r.status < 600).length;
  const down = results.filter((r) => r.status === 0 || r.status >= 600).length;

  const byCategory: Record<string, typeof results> = {};
  for (const r of results) {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  }

  const allGood = degraded === 0 && down === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center py-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${allGood ? "border-green-400/30 bg-green-400/10 text-green-400" : "border-amber-400/30 bg-amber-400/10 text-amber-400"}`}>
          <span className={`w-2 h-2 rounded-full ${allGood ? "bg-green-400 status-pulse" : "bg-amber-400 status-pulse"}`} />
          {allGood ? "All Systems Operational" : `${degraded + down} Service(s) Degraded`}
        </div>
        <h1 className="text-3xl font-bold text-white">Service Status</h1>
        <p className="text-gray-500 mt-2">Real-time health of BlackRoad OS services.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{operational}</div>
          <div className="text-xs text-gray-500 mt-1">Operational</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{degraded}</div>
          <div className="text-xs text-gray-500 mt-1">Degraded</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{down}</div>
          <div className="text-xs text-gray-500 mt-1">Down</div>
        </div>
      </div>

      {/* Services by category */}
      {Object.entries(byCategory).map(([cat, services]) => (
        <div key={cat}>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{cat}</h2>
          <div className="space-y-2">
            {services.map((s) => {
              const isOk = s.status >= 200 && s.status < 400;
              const isDegraded = s.status >= 400 && s.status < 600;
              return (
                <div key={s.name} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isOk ? "bg-green-400" : isDegraded ? "bg-amber-400" : "bg-red-400"}`} />
                  <span className="text-sm text-white flex-1">{s.name}</span>
                  <span className="text-xs text-gray-500">{s.latency}ms</span>
                  <span className={`text-xs font-mono ${isOk ? "text-green-400" : isDegraded ? "text-amber-400" : "text-red-400"}`}>
                    {s.status || "timeout"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-center text-xs text-gray-600 py-4">
        Last checked: {new Date().toISOString().replace("T", " ").slice(0, 19)} UTC
      </div>
    </div>
  );
}
