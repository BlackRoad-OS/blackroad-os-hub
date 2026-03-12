import Link from "next/link";
import { getRepo, getRepoReadme, getRepoContents, getRepoCommits, getRepoLanguages, getRepoContributors } from "../lib/github";

export const revalidate = 300;

export default async function SimulationPage() {
  const [repo, readme, codeFiles, evidenceFiles, rootFiles, commits, languages, contributors] = await Promise.all([
    getRepo("simulation-hypothesis").catch(() => null),
    getRepoReadme("simulation-hypothesis").catch(() => ""),
    getRepoContents("simulation-hypothesis", "code").catch(() => []),
    getRepoContents("simulation-hypothesis", "evidence").catch(() => []),
    getRepoContents("simulation-hypothesis").catch(() => []),
    getRepoCommits("simulation-hypothesis", 10).catch(() => []),
    getRepoLanguages("simulation-hypothesis").catch(() => ({})),
    getRepoContributors("simulation-hypothesis").catch(() => []),
  ]);

  const htmlFiles = rootFiles.filter((f) => f.name.endsWith(".html"));
  const pyFiles = codeFiles.filter((f) => f.name.endsWith(".py"));
  const mdFiles = evidenceFiles.filter((f) => f.name.endsWith(".md"));
  const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  // Extract abstract from README (between ## Abstract and next ##)
  const abstractMatch = readme.match(/## Abstract\n\n([\s\S]*?)(?=\n##|\n---)/);
  const abstract = abstractMatch?.[1]?.trim() || "";

  // Extract key section titles from README
  const sectionTitles = [...readme.matchAll(/^## (.+)$/gm)].map((m) => m[1]).filter((t) => t !== "Abstract");

  const CODE_ICONS: Record<string, string> = {
    hashchain: "🔗", riemann_zeros: "📊", dna_encoding: "🧬", godel: "♾️",
    fibonacci: "🌻", turing: "💻", double_slit: "🔬", lorenz: "🦋",
    entropy: "📉", cantor: "∞", darwin_kernel: "🍎", ramanujan: "🔢",
    easter: "🥚", feynman: "⚛️", hue_man: "👤", magic_square: "🔮",
    operators: "➕", constants: "π", roadchain: "⛓️",
  };

  const DEMO_ICONS: Record<string, string> = {
    "index.html": "🔍", "cellular.html": "🦠", "fractal.html": "🌀",
    "lorenz.html": "🦋", "vr.html": "🥽", "qr.html": "📱",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF1D6C]/5 to-transparent rounded-3xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">The Trivial Zero</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-2">
            {repo?.description || "A Computational Proof That Reality Is Self-Referential"}
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <a href={repo?.html_url || "https://github.com/BlackRoad-OS/simulation-hypothesis"} target="_blank" rel="noopener"
              className="px-6 py-3 bg-gradient-to-r from-[#FF1D6C] to-violet-600 rounded-xl text-white font-semibold hover:opacity-90 transition-all">
              Read the Paper
            </a>
            <a href="https://blackroad-os.github.io/simulation-hypothesis/" target="_blank" rel="noopener"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
              Live Demos
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Code Modules</div>
          <div className="text-2xl font-bold text-[#FF1D6C] mt-1">{pyFiles.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Evidence Files</div>
          <div className="text-2xl font-bold text-[#2979FF] mt-1">{mdFiles.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Interactive Demos</div>
          <div className="text-2xl font-bold text-[#F5A623] mt-1">{htmlFiles.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Commits</div>
          <div className="text-2xl font-bold text-[#34d399] mt-1">{commits.length}+</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Repo Size</div>
          <div className="text-2xl font-bold text-[#9C27B0] mt-1">{repo ? (repo.size / 1024).toFixed(1) : "?"}MB</div>
        </div>
      </section>

      {/* Abstract from README */}
      {abstract && (
        <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Abstract</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{abstract.slice(0, 1500)}</p>
        </section>
      )}

      {/* Languages */}
      {totalLangBytes > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Languages</h2>
          <div className="flex h-2 rounded-full overflow-hidden bg-white/5 mb-2">
            {Object.entries(languages).map(([lang, bytes]) => (
              <div key={lang} className="h-full" style={{ width: `${(bytes / totalLangBytes) * 100}%`, backgroundColor: lang === "Python" ? "#3572A5" : lang === "HTML" ? "#e34c26" : lang === "JavaScript" ? "#f1e05a" : lang === "CSS" ? "#563d7c" : "#6b7280" }} title={lang} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(languages).map(([lang, bytes]) => (
              <span key={lang} className="text-xs text-gray-400">{lang} {((bytes / totalLangBytes) * 100).toFixed(1)}%</span>
            ))}
          </div>
        </section>
      )}

      {/* Paper sections from README */}
      {sectionTitles.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Paper Sections ({sectionTitles.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {sectionTitles.map((title, i) => (
              <a key={i} href={`${repo?.html_url || "#"}#readme`} target="_blank" rel="noopener"
                className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all text-sm text-gray-300">
                <span className="text-gray-600 mr-2">{i + 1}.</span>{title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Interactive HTML demos */}
      {htmlFiles.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Interactive Demos ({htmlFiles.length})</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {htmlFiles.map((f) => {
              const icon = DEMO_ICONS[f.name] || "🌐";
              const label = f.name.replace(".html", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <a key={f.name} href={`https://blackroad-os.github.io/simulation-hypothesis/${f.name}`} target="_blank" rel="noopener"
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#FF1D6C]/30 transition-all group">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-sm font-semibold text-white group-hover:text-[#FF1D6C] transition-colors">{label}</div>
                  <div className="text-xs text-gray-600 font-mono mt-1">{f.name} — {(f.size / 1024).toFixed(0)}KB</div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Code modules */}
      {pyFiles.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Proof Code ({pyFiles.length} modules)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {pyFiles.map((f) => {
              const baseName = f.name.replace(".py", "");
              const icon = CODE_ICONS[baseName] || "📌";
              const label = baseName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <a key={f.name} href={f.html_url} target="_blank" rel="noopener"
                  className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                  <span className="text-base">{icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-white truncate">{f.name}</div>
                    <div className="text-xs text-gray-600 truncate">{label}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Evidence files */}
      {mdFiles.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Evidence ({mdFiles.length} documents)</h2>
          <div className="space-y-1.5">
            {mdFiles.map((f) => {
              const label = f.name.replace(".md", "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <a key={f.name} href={f.html_url} target="_blank" rel="noopener"
                  className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
                  <span className="text-base">📄</span>
                  <span className="text-sm text-white flex-1">{label}</span>
                  <span className="text-xs text-gray-600 font-mono">{(f.size / 1024).toFixed(1)}KB</span>
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
                <span className="text-xs font-mono text-[#FF1D6C]">{c.sha.slice(0, 7)}</span>
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

      {/* Links */}
      <section className="flex flex-wrap gap-3">
        <Link href="/repos/simulation-hypothesis" className="px-4 py-2 text-xs border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
          View in Repo Browser
        </Link>
        {rootFiles.filter((f) => f.name === "PAPER.md" || f.name === "ORIGIN.md" || f.name === "DECLARATION.md").map((f) => (
          <a key={f.name} href={f.html_url} target="_blank" rel="noopener"
            className="px-4 py-2 text-xs border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
            {f.name}
          </a>
        ))}
      </section>
    </div>
  );
}
