import Link from "next/link";
import { getRepos, getOrgIssues, categorizeRepo, CATEGORIES } from "./lib/github";

export const revalidate = 300;

export default async function HomePage() {
  const [repos, issues] = await Promise.all([
    getRepos().catch(() => []),
    getOrgIssues("open", 5).catch(() => []),
  ]);

  const catCounts: Record<string, number> = {};
  for (const r of repos) {
    const cat = categorizeRepo(r);
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }

  const langCounts: Record<string, number> = {};
  for (const r of repos) {
    const lang = r.language || "Other";
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  }
  const topLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const recentRepos = repos.slice(0, 8);
  const totalIssues = repos.reduce((sum, r) => sum + r.open_issues_count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">BlackRoad OS</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {repos.length} repositories. {totalIssues} open issues. Your entire GitHub org, clickable.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Link href="/apps" className="px-6 py-3 bg-gradient-to-r from-[#FF1D6C] to-violet-600 rounded-xl text-white font-semibold hover:opacity-90 transition-all">
            Browse Apps
          </Link>
          <Link href="/repos" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
            All Repos
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Repos", value: repos.length.toString(), color: "#FF1D6C" },
          { label: "Open Issues", value: totalIssues.toString(), color: "#F5A623" },
          { label: "Categories", value: Object.keys(catCounts).length.toString(), color: "#2979FF" },
          { label: "Languages", value: Object.keys(langCounts).length.toString(), color: "#9C27B0" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(CATEGORIES).filter(([key]) => catCounts[key]).map(([key, cat]) => (
            <Link key={key} href={`/repos?cat=${key}`} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-sm font-semibold text-white">{cat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{catCounts[key]} repos</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recently Updated</h2>
          <Link href="/repos" className="text-xs text-gray-500 hover:text-white transition-colors">View all</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {recentRepos.map((r) => (
            <Link key={r.name} href={`/repos/${r.name}`} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-white truncate">{r.name}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description || "No description"}</div>
                </div>
                {r.language && (
                  <span className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400 ml-2 flex-shrink-0">{r.language}</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
                {r.open_issues_count > 0 && <span>{r.open_issues_count} issues</span>}
                <span>{new Date(r.pushed_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Top Languages</h2>
        <div className="flex flex-wrap gap-2">
          {topLangs.map(([lang, count]) => (
            <span key={lang} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
              {lang} <span className="text-gray-500 ml-1">{count}</span>
            </span>
          ))}
        </div>
      </section>

      {issues.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Issues</h2>
            <Link href="/issues" className="text-xs text-gray-500 hover:text-white transition-colors">View all</Link>
          </div>
          <div className="space-y-2">
            {issues.map((i) => {
              const repoName = i.repository_url.split("/").pop() || "";
              return (
                <a key={i.html_url} href={i.html_url} target="_blank" rel="noopener"
                  className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${i.state === "open" ? "bg-green-400" : "bg-gray-500"}`} />
                  <span className="text-xs text-gray-500 w-20 truncate">{repoName}</span>
                  <span className="text-sm text-white truncate flex-1">{i.title}</span>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
