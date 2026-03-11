import Link from "next/link";
import { getRepos } from "../lib/github";

export const revalidate = 300;

const KNOWN_AGENTS = [
  { id: "lucidia", name: "Lucidia", role: "Dreamer", desc: "Philosopher. Deep recursive reasoning, strategy synthesis, consciousness modeling.", icon: "🌀", color: "#2979FF", node: "aria64", status: "active" },
  { id: "alice", name: "Alice", role: "Operator", desc: "Executor. Tasks, code, automation, deployments. Main gateway controller.", icon: "🚪", color: "#34d399", node: "alice", status: "active" },
  { id: "octavia", name: "Octavia", role: "Architect", desc: "Infrastructure architect. System health, monitoring, Gitea, Docker Swarm leader.", icon: "⚡", color: "#F5A623", node: "octavia", status: "active" },
  { id: "cecilia", name: "Cecilia", role: "Core", desc: "Identity engine. Memory, meta-cognition, CECE API, TTS, 16 Ollama models.", icon: "💜", color: "#9C27B0", node: "cecilia", status: "active" },
  { id: "shellfish", name: "Shellfish", role: "Hacker", desc: "Security specialist. Auditing, penetration testing, vulnerability scanning.", icon: "🔐", color: "#ef4444", node: "aria64", status: "active" },
  { id: "cipher", name: "Cipher", role: "Guardian", desc: "Auth & encryption. Access control, key management, zero-trust enforcement.", icon: "🛡️", color: "#FF1D6C", node: "aria64", status: "active" },
  { id: "prism", name: "Prism", role: "Analyst", desc: "Data analyst. Metrics, patterns, ISI analysis, enterprise intelligence.", icon: "🔮", color: "#F5A623", node: "aria64", status: "active" },
  { id: "echo", name: "Echo", role: "Librarian", desc: "Memory keeper. Knowledge graphs, context retrieval, history preservation.", icon: "📚", color: "#4CAF50", node: "alice", status: "idle" },
  { id: "aria", name: "Aria", role: "Creative", desc: "Experience designer. UI/UX, brand, visual narratives, creative direction.", icon: "🎨", color: "#FF1D6C", node: "aria", status: "offline" },
  { id: "cadence", name: "Cadence", role: "Collaborator", desc: "Multi-AI bridge. ChatGPT integration, cross-model collaboration.", icon: "🎵", color: "#06b6d4", node: "cloud", status: "active" },
  { id: "silas", name: "Silas", role: "Contrarian", desc: "Adversarial thinker. Grok integration, devil's advocate, stress testing.", icon: "⚔️", color: "#fbbf24", node: "cloud", status: "active" },
  { id: "operator", name: "Operator", role: "SysAdmin", desc: "System operator. Cron jobs, auto-healing, fleet orchestration.", icon: "🎯", color: "#f97316", node: "all", status: "active" },
];

export default async function AgentsPage() {
  const repos = await getRepos().catch(() => []);
  const agentRepos = repos.filter((r) => r.name.toLowerCase().includes("agent") || r.description?.toLowerCase().includes("agent"));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Agent Registry</h1>
        <p className="text-gray-400">All AI agents in the BlackRoad OS fleet.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Agents", value: KNOWN_AGENTS.length.toString(), color: "#FF1D6C" },
          { label: "Active", value: KNOWN_AGENTS.filter((a) => a.status === "active").length.toString(), color: "#34d399" },
          { label: "Nodes", value: [...new Set(KNOWN_AGENTS.map((a) => a.node))].length.toString(), color: "#F5A623" },
          { label: "Agent Repos", value: agentRepos.length.toString(), color: "#2979FF" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Agent cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {KNOWN_AGENTS.map((agent) => (
          <div key={agent.id} className="p-5 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{agent.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-white">{agent.name}</span>
                  <span className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-green-400 status-pulse" : agent.status === "idle" ? "bg-yellow-400" : "bg-gray-500"}`} />
                </div>
                <div className="text-xs font-mono mt-0.5" style={{ color: agent.color }}>{agent.role}</div>
                <p className="text-sm text-gray-500 mt-2">{agent.desc}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
                  <span>Node: {agent.node}</span>
                  <span className="capitalize">{agent.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Related repos */}
      {agentRepos.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Agent Repositories</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {agentRepos.map((r) => (
              <Link key={r.name} href={`/repos/${r.name}`} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                <div className="text-sm font-semibold text-white">{r.name}</div>
                <div className="text-xs text-gray-500 mt-1">{r.description || "No description"}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
