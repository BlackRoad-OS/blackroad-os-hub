export const revalidate = 120;

const NODES = [
  { name: "Alice", ip: "192.168.4.49", model: "Pi 400", role: "Gateway", storage: "32GB SD", status: "online", cpu: "BCM2711 4-core", ram: "4GB", services: ["Nginx", "Pi-hole", "PostgreSQL", "Qdrant", "Cloudflared", "Ollama (tunneled)"], color: "#34d399", issues: ["SD 77% full (3.2GB free)", "Kernel 6.1.21 (2023) needs update"] },
  { name: "Cecilia", ip: "192.168.4.96", model: "Pi 5", role: "AI Core", storage: "256GB SD", status: "online", cpu: "BCM2712 4-core", ram: "8GB", services: ["CECE API", "TTS API", "MinIO", "Hailo-8", "Ollama (16 models)", "PostgreSQL", "Cloudflared"], color: "#9C27B0", issues: ["Undervoltage (0.876V)", "4 rclone instances syncing same gdrive"] },
  { name: "Octavia", ip: "192.168.4.100", model: "Pi 5", role: "Storage/Swarm", storage: "1TB NVMe", status: "online", cpu: "BCM2712 4-core", ram: "8GB", services: ["Gitea", "NATS", "Docker Swarm leader", "Hailo-8", "OctoPrint", "Cloudflared"], color: "#F5A623", issues: ["DHCP IP (needs static)", "Undervoltage (PSU insufficient for Hailo+NVMe)"] },
  { name: "Aria", ip: "192.168.4.98", model: "Pi 5", role: "Portainer/Headscale", storage: "256GB SD", status: "offline", cpu: "BCM2712 4-core", ram: "8GB", services: ["Portainer", "Headscale", "Pironman5"], color: "#FF1D6C", issues: ["DOWN — needs physical reboot"] },
  { name: "Lucidia", ip: "192.168.4.38", model: "Pi 5", role: "Web/Runners", storage: "238GB SD", status: "online", cpu: "BCM2712 4-core", ram: "8GB", services: ["Lucidia API", "CarPool", "PowerDNS", "GitHub Actions Runner", "Cloudflared", "334 web apps"], color: "#2979FF", issues: ["SD degrading (mmc0 errors)", "21 runner dirs = 19GB", "Swap growing 1.3GB/8.5GB"] },
];

const HAILO = [
  { node: "Cecilia", serial: "HLLWM2B233704667", tops: 26, device: "/dev/hailo0", status: "ok" },
  { node: "Octavia", serial: "HLLWM2B233704606", tops: 26, device: "/dev/hailo0", status: "ok" },
];

const WIREGUARD = [
  { node: "anastasia (hub)", ip: "10.8.0.1", endpoint: "nyc3 droplet" },
  { node: "Alice", ip: "10.8.0.6", endpoint: "192.168.4.49" },
  { node: "Cecilia", ip: "10.8.0.3", endpoint: "192.168.4.96" },
  { node: "Octavia", ip: "10.8.0.4", endpoint: "192.168.4.100" },
  { node: "Aria", ip: "10.8.0.7", endpoint: "192.168.4.98" },
  { node: "gematria", ip: "10.8.0.8", endpoint: "nyc3 droplet" },
];

export default function FleetPage() {
  const onlineCount = NODES.filter((n) => n.status === "online").length;
  const totalTops = HAILO.reduce((s, h) => s + h.tops, 0);
  const allIssues = NODES.flatMap((n) => n.issues.map((i) => ({ node: n.name, issue: i, color: n.color })));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Fleet Dashboard</h1>
        <p className="text-gray-400">Raspberry Pi fleet status and infrastructure health.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Nodes", value: `${onlineCount}/${NODES.length}`, sub: "online", color: "#34d399" },
          { label: "AI Accelerators", value: HAILO.length.toString(), sub: `${totalTops} TOPS total`, color: "#F5A623" },
          { label: "WireGuard Peers", value: WIREGUARD.length.toString(), sub: "mesh network", color: "#2979FF" },
          { label: "Open Issues", value: allIssues.length.toString(), sub: "across fleet", color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-600 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Nodes */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Nodes</h2>
        <div className="space-y-4">
          {NODES.map((node) => (
            <div key={node.name} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${node.status === "online" ? "bg-green-400 status-pulse" : "bg-red-400"}`}
                  style={{ boxShadow: node.status === "online" ? `0 0 8px ${node.color}` : "none" }} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-bold text-white">{node.name}</span>
                    <span className="text-xs font-mono text-gray-500">{node.ip}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-gray-400">{node.model}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border text-gray-400" style={{ borderColor: node.color + "40", color: node.color }}>{node.role}</span>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>{node.cpu}</span>
                    <span>{node.ram}</span>
                    <span>{node.storage}</span>
                  </div>
                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {node.services.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400">{s}</span>
                    ))}
                  </div>
                  {/* Issues */}
                  {node.issues.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {node.issues.map((issue) => (
                        <div key={issue} className="text-xs text-amber-400/80 flex items-center gap-2">
                          <span>⚠</span> {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
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
                <span className="text-green-400">{h.status}</span>
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
    </div>
  );
}
