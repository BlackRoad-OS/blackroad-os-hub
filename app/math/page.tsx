import Link from "next/link";
import { getRepo, getRepoReadme, getRepoContents, getRepoCommits, getRepoLanguages, getRepoContributors, getRepoWorkflowRuns } from "../lib/github";

export const revalidate = 300;

export default async function MathPage() {
  const [repo, readme, forgeFiles, labFiles, rootFiles, commits, languages, contributors, ciRuns] = await Promise.all([
    getRepo("lucidia-math").catch(() => null),
    getRepoReadme("lucidia-math").catch(() => ""),
    getRepoContents("lucidia-math", "forge").catch(() => []),
    getRepoContents("lucidia-math", "lab").catch(() => []),
    getRepoContents("lucidia-math").catch(() => []),
    getRepoCommits("lucidia-math", 10).catch(() => []),
    getRepoLanguages("lucidia-math").catch(() => ({})),
    getRepoContributors("lucidia-math").catch(() => []),
    getRepoWorkflowRuns("lucidia-math", 5).catch(() => []),
  ]);

  const forgePy = forgeFiles.filter((f) => f.name.endsWith(".py")).sort((a, b) => b.size - a.size);
  const labPy = labFiles.filter((f) => f.name.endsWith(".py")).sort((a, b) => b.size - a.size);
  const forgeJson = forgeFiles.filter((f) => f.name.endsWith(".json"));
  const labJson = labFiles.filter((f) => f.name.endsWith(".json"));
  const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const totalForgeKB = forgePy.reduce((s, f) => s + f.size, 0) / 1024;
  const totalLabKB = labPy.reduce((s, f) => s + f.size, 0) / 1024;

  // Extract description sections from README
  const moduleDescriptions: Record<string, string> = {};
  const tableRows = [...readme.matchAll(/\| `([^`]+)` \| (\d+) \| (.+?) \|/g)];
  for (const m of tableRows) {
    moduleDescriptions[m[1]] = m[3];
  }

  const MODULE_ICONS: Record<string, string> = {
    consciousness: "🧠", unified_geometry: "📐", advanced_tools: "🔧",
    main: "⚙️", numbers: "🔢", proofs: "✅", fractals: "🌀",
    dimensions: "🌌", sinewave: "〰️", operators: "➕",
    unified_geometry_engine: "🔮", amundson_equations: "📝",
    iterative_math_build: "🏗️", trinary_logic: "3️⃣",
    prime_explorer: "🔍", quantum_finance: "💹",
    recursion_sandbox: "🔄", sine_wave_codex: "📊",
    frameworks: "📦", interface: "🖥️",
  };

  const latestCI = ciRuns[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2979FF]/5 to-transparent rounded-3xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Lucidia Math</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-2">
            {repo?.description || "Consciousness modeling, unified geometry, quantum finance, prime exploration."}
          </p>
          {latestCI && (
            <div className="flex justify-center mt-3">
              <a href={latestCI.html_url} target="_blank" rel="noopener"
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${latestCI.conclusion === "success" ? "border-green-400/30 text-green-400" : latestCI.conclusion === "failure" ? "border-red-400/30 text-red-400" : "border-amber-400/30 text-amber-400"}`}>
                <span className={`w-2 h-2 rounded-full ${latestCI.conclusion === "success" ? "bg-green-400" : latestCI.conclusion === "failure" ? "bg-red-400" : "bg-amber-400"}`} />
                CI: {latestCI.conclusion || latestCI.status}
              </a>
            </div>
          )}
          <div className="flex justify-center gap-4 mt-6">
            <a href={repo?.html_url || "https://github.com/BlackRoad-OS/lucidia-math"} target="_blank" rel="noopener"
              className="px-6 py-3 bg-gradient-to-r from-[#2979FF] to-[#9C27B0] rounded-xl text-white font-semibold hover:opacity-90 transition-all">
              View Source
            </a>
            <Link href="/repos/lucidia-math"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
              Repo Details
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Forge Modules</div>
          <div className="text-2xl font-bold text-[#FF1D6C] mt-1">{forgePy.length}</div>
          <div className="text-xs text-gray-600">{totalForgeKB.toFixed(0)}KB</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Lab Modules</div>
          <div className="text-2xl font-bold text-[#2979FF] mt-1">{labPy.length}</div>
          <div className="text-xs text-gray-600">{totalLabKB.toFixed(0)}KB</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Repo Size</div>
          <div className="text-2xl font-bold text-[#9C27B0] mt-1">{repo ? (repo.size / 1024).toFixed(1) : "?"}MB</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Commits</div>
          <div className="text-2xl font-bold text-[#34d399] mt-1">{commits.length}+</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Issues</div>
          <div className="text-2xl font-bold text-[#F5A623] mt-1">{repo?.open_issues_count || 0}</div>
        </div>
      </section>

      {/* Languages */}
      {totalLangBytes > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Languages</h2>
          <div className="flex h-2 rounded-full overflow-hidden bg-white/5 mb-2">
            {Object.entries(languages).map(([lang, bytes]) => (
              <div key={lang} className="h-full" style={{ width: `${(bytes / totalLangBytes) * 100}%`, backgroundColor: lang === "Python" ? "#3572A5" : lang === "Shell" ? "#89e051" : lang === "HTML" ? "#e34c26" : "#6b7280" }} title={lang} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(languages).map(([lang, bytes]) => (
              <span key={lang} className="text-xs text-gray-400">{lang} {((bytes / totalLangBytes) * 100).toFixed(1)}%</span>
            ))}
          </div>
        </section>
      )}

      {/* Forge */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Forge — Mathematical Foundations</h2>
        <p className="text-xs text-gray-600 mb-4">Core mathematical engines and proof systems ({forgePy.length} modules, {totalForgeKB.toFixed(0)}KB)</p>
        <div className="space-y-1.5">
          {forgePy.map((f) => {
            const baseName = f.name.replace(".py", "");
            const icon = MODULE_ICONS[baseName] || "📌";
            const desc = moduleDescriptions[f.name] || baseName.replace(/_/g, " ");
            return (
              <a key={f.name} href={f.html_url} target="_blank" rel="noopener"
                className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
                <span className="text-base">{icon}</span>
                <span className="text-sm font-mono text-white group-hover:text-[#FF1D6C] transition-colors">{f.name}</span>
                <span className="text-xs text-gray-600">{(f.size / 1024).toFixed(0)}KB</span>
                <span className="text-xs text-gray-500 ml-auto truncate max-w-xs">{desc}</span>
              </a>
            );
          })}
          {forgeJson.map((f) => (
            <a key={f.name} href={f.html_url} target="_blank" rel="noopener"
              className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
              <span className="text-base">📋</span>
              <span className="text-sm font-mono text-gray-400">{f.name}</span>
              <span className="text-xs text-gray-600">{(f.size / 1024).toFixed(1)}KB</span>
            </a>
          ))}
        </div>
      </section>

      {/* Lab */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Lab — Experimental Mathematics</h2>
        <p className="text-xs text-gray-600 mb-4">Cutting-edge research and experimental algorithms ({labPy.length} modules, {totalLabKB.toFixed(0)}KB)</p>
        <div className="space-y-1.5">
          {labPy.map((f) => {
            const baseName = f.name.replace(".py", "");
            const icon = MODULE_ICONS[baseName] || "📌";
            const desc = moduleDescriptions[f.name] || baseName.replace(/_/g, " ");
            return (
              <a key={f.name} href={f.html_url} target="_blank" rel="noopener"
                className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
                <span className="text-base">{icon}</span>
                <span className="text-sm font-mono text-white group-hover:text-[#2979FF] transition-colors">{f.name}</span>
                <span className="text-xs text-gray-600">{(f.size / 1024).toFixed(0)}KB</span>
                <span className="text-xs text-gray-500 ml-auto truncate max-w-xs">{desc}</span>
              </a>
            );
          })}
          {labJson.map((f) => (
            <a key={f.name} href={f.html_url} target="_blank" rel="noopener"
              className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
              <span className="text-base">📋</span>
              <span className="text-sm font-mono text-gray-400">{f.name}</span>
              <span className="text-xs text-gray-600">{(f.size / 1024).toFixed(1)}KB</span>
            </a>
          ))}
        </div>
      </section>

      {/* CI Runs */}
      {ciRuns.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">CI / GitHub Actions</h2>
          <div className="space-y-1.5">
            {ciRuns.map((run) => {
              const color = run.conclusion === "success" ? "#34d399" : run.conclusion === "failure" ? "#ef4444" : "#F5A623";
              const icon = run.conclusion === "success" ? "✓" : run.conclusion === "failure" ? "✕" : "●";
              return (
                <a key={run.id} href={run.html_url} target="_blank" rel="noopener"
                  className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
                  <span className="text-sm font-mono" style={{ color }}>{icon}</span>
                  <span className="text-sm text-white truncate flex-1">{run.name}</span>
                  <span className="text-xs text-gray-600">{run.head_branch}</span>
                  <span className="text-xs" style={{ color }}>{run.conclusion || run.status}</span>
                  <span className="text-xs text-gray-600">{new Date(run.created_at).toLocaleDateString()}</span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent commits */}
      {commits.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Commits</h2>
          <div className="space-y-1.5">
            {commits.slice(0, 8).map((c) => (
              <a key={c.sha} href={c.html_url} target="_blank" rel="noopener"
                className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
                <span className="text-xs font-mono text-[#2979FF]">{c.sha.slice(0, 7)}</span>
                <span className="text-sm text-gray-300 truncate flex-1">{c.commit.message.split("\n")[0]}</span>
                <span className="text-xs text-gray-600">{c.author?.login || c.commit.author.name}</span>
                <span className="text-xs text-gray-600">{new Date(c.commit.author.date).toLocaleDateString()}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contributors */}
      {contributors.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contributors</h2>
          <div className="flex flex-wrap gap-2">
            {contributors.map((c) => (
              <a key={c.login} href={c.html_url} target="_blank" rel="noopener"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-white/20 transition-all">
                <span className="text-xs text-gray-300">{c.login}</span>
                <span className="text-xs text-gray-600">{c.contributions}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Topics */}
      {repo?.topics && repo.topics.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {repo.topics.map((t) => (
              <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">{t}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
