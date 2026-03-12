import Link from "next/link";
import { getRepos, categorizeRepo } from "../lib/github";

export const revalidate = 120;

const NODES = [
  { name: "Alice", ip: "192.168.4.49", model: "Pi 400", role: "Gateway", storage: "32GB SD", cpu: "BCM2711 4-core", ram: "4GB", services: ["Nginx", "Pi-hole", "PostgreSQL", "Qdrant", "Cloudflared", "Ollama (tunneled)"], color: "#34d399", checkUrl: "https://blackroad.io" },
  { name: "Cecilia", ip: "192.168.4.96", model: "Pi 5", role: "AI Core", storage: "256GB SD", cpu: "BCM2712 4-core", ram: "8GB", services: ["CECE API", "TTS API", "MinIO", "Hailo-8", "Ollama (16 models)", "PostgreSQL", "Cloudflared"], color: "#9C27B0", checkUrl: "https://blackroadai.com" },
  { name: "Octavia", ip: "192.168.4.100", model: "Pi 5", role: "Storage/Swarm", storage: "1TB NVMe", cpu: "BCM2712 4-core", ram: "8GB", services: ["Gitea", "NATS", "Docker Swarm leader", "Hailo-8", "OctoPrint", "Cloudflared"], color: "#F5A623", checkUrl: "https://git.blackroad.io" },
  { name: "Aria", ip: "192.168.4.98", model: "Pi 5", role: "Portainer/Headscale", storage: "256GB SD", cpu: "BCM2712 4-core", ram: "8GB", services: ["Portainer", "Headscale", "Pironman5"], color: "#FF1D6C", checkUrl: null },
  { name: "Lucidia", ip: "192.168.4.38", model: "Pi 5", role: "Web/Runners", storage: "238GB SD", cpu: "BCM2712 4-core", ram: "8GB", services: ["Lucidia API", "CarPool", "PowerDNS", "GitHub Actions Runner", "Cloudflared", "334 web apps"], color: "#2979FF", checkUrl: "https://lucidia.earth" },
];

const HAILO = [
  { node: "Cecilia", serial: "HLLWM2B233704667", tops: 26, device: "/dev/hailo0" },
  { node: "Octavia", serial: "HLLWM2B233704606", tops: 26, device: "/dev/hailo0" },
];

const WIREGUARD = [
  { node: "anastasia (hub)", ip: "10.8.0.1", endpoint: "nyc3 droplet" },
  { node: "Alice", ip: "10.8.0.6", endpoint: "192.168.4.49" },
  { node: "Cecilia", ip: "10.8.0.3", endpoint: "192.168.4.96" },
  { node: "Octavia", ip: "10.8.0.4", endpoint: "192.168.4.100" },
  { node: "Aria", ip: "10.8.0.7", endpoint: "192.168.4.98" },
  { node: "gematria", ip: "10.8.0.8", endpoint: "nyc3 droplet" },
];

async function checkNodeViaUrl(url: string): Promise<{ up: boolean; latency: number }> {
  const start = Date.now();
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(5000) });
    return { up: res.status >= 200 && res.status < 500, latency: Date.now() - start };
  } catch {
    return { up: false, latency: Date.now() - start };
  }
}

export default async function FleetPage() {
  // Check node health via their public-facing services
  const healthChecks = await Promise.all(
    NODES.map(async (node) => {
      if (!node.checkUrl) return { name: node.name, up: false, latency: 0, checked: false };
      const result = await checkNodeViaUrl(node.checkUrl);
      return { name: node.name, ...result, checked: true };
    })
  );
  const healthMap: Record<string, { up: boolean; latency: number; checked: boolean }> = {};
  for (const h of healthChecks) healthMap[h.name] = h;

  // Pull fleet-related repos from GitHub
  const repos = await getRepos().catch(() => []);
  const infraRepos = repos.filter((r) => {
    const cat = categorizeRepo(r);
    return cat === "infra" || r.name.toLowerCase().includes("fleet") || r.name.toLowerCase().includes("node") || r.name.toLowerCase().includes("pi-") || r.name.toLowerCase().includes("roadnet");
  });

  const onlineCount = healthChecks.filter((h) => h.up).length;
  const totalTops = HAILO.reduce((s, h) => s + h.tops, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Fleet Dashboard</h1>
        <p className="text-gray-400">Raspberry Pi fleet — live health checks via public endpoints.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Nodes", value: `${onlineCount}/${NODES.length}`, sub: "reachable", color: "#34d399" },
          { label: "AI Accelerators", value: HAILO.length.toString(), sub: `${totalTops} TOPS total`, color: "#F5A623" },
          { label: "WireGuard Peers", value: WIREGUARD.length.toString(), sub: "mesh network", color: "#2979FF" },
          { label: "Infra Repos", value: infraRepos.length.toString(), sub: "on GitHub", color: "#9C27B0" },
          { label: "Total Services", value: NODES.reduce((s, n) => s + n.services.length, 0).toString(), sub: "across fleet", color: "#FF1D6C" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-600 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Nodes with live status */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Nodes (live health check)</h2>
        <div className="space-y-4">
          {NODES.map((node) => {
            const health = healthMap[node.name];
            const isUp = health?.up;
            const wasChecked = health?.checked;
            return (
              <div key={node.name} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${isUp ? "bg-green-400 status-pulse" : wasChecked ? "bg-red-400" : "bg-gray-500"}`}
                    style={{ boxShadow: isUp ? `0 0 8px ${node.color}` : "none" }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-bold text-white">{node.name}</span>
                      <span className="text-xs font-mono text-gray-500">{node.ip}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-gray-400">{node.model}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full border text-gray-400" style={{ borderColor: node.color + "40", color: node.color }}>{node.role}</span>
                      {wasChecked && (
                        <span className={`text-xs ml-auto ${isUp ? "text-green-400" : "text-red-400"}`}>
                          {isUp ? `UP (${health.latency}ms)` : "DOWN"}
                        </span>
                      )}
                      {!wasChecked && <span className="text-xs text-gray-600 ml-auto">no check endpoint</span>}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>{node.cpu}</span>
                      <span>{node.ram}</span>
                      <span>{node.storage}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {node.services.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400">{s}</span>
                      ))}
                    </div>
                    {node.checkUrl && (
                      <div className="mt-2 text-xs text-gray-600 font-mono">
                        check: {node.checkUrl}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hailo Accelerators */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Hailo-8 AI Accelerators</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {HAILO.map((h) => (
            <div key={h.serial} className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-sm font-semibold text-white">{h.node}</div>
              <div className="text-xs text-gray-500 font-mono mt-1">{h.serial}</div>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span>{h.tops} TOPS</span>
                <span>{h.device}</span>
                <span className={healthMap[h.node]?.up ? "text-green-400" : "text-gray-500"}>
                  {healthMap[h.node]?.up ? "reachable" : "unreachable"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WireGuard */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">WireGuard Mesh</h2>
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold">Node</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold">WG IP</th>
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-semibold">Endpoint</th>
              </tr>
            </thead>
            <tbody>
              {WIREGUARD.map((w) => (
                <tr key={w.node} className="border-b border-white/5">
                  <td className="px-4 py-2 text-white">{w.node}</td>
                  <td className="px-4 py-2 text-gray-400 font-mono">{w.ip}</td>
                  <td className="px-4 py-2 text-gray-500">{w.endpoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infrastructure repos from GitHub */}
      {infraRepos.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Infrastructure Repos (live from GitHub)</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {infraRepos.map((r) => (
              <Link key={r.name} href={`/repos/${r.name}`} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{r.name}</span>
                  {r.language && <span className="text-xs px-1.5 py-0.5 bg-white/5 rounded text-gray-400">{r.language}</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">{r.description || "No description"}</div>
                <div className="text-xs text-gray-600 mt-2">Updated {new Date(r.pushed_at).toLocaleDateString()}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-600 py-4">
        Last checked: {new Date().toISOString().replace("T", " ").slice(0, 19)} UTC — revalidates every 2 minutes
      </div>
    </div>
  );
}
