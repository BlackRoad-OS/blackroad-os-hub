import Link from "next/link";
import { getRepos, categorizeRepo, CATEGORIES } from "../lib/github";

export const revalidate = 300;

export default async function ReposPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  const params = await searchParams;
  const repos = await getRepos().catch(() => []);
  const filterCat = params.cat || "";
  const filterQ = (params.q || "").toLowerCase();

  const filtered = repos.filter((r) => {
    if (filterCat && categorizeRepo(r) !== filterCat) return false;
    if (filterQ && !r.name.toLowerCase().includes(filterQ) && !(r.description || "").toLowerCase().includes(filterQ)) return false;
    return true;
  });

  const catCounts: Record<string, number> = {};
  for (const r of repos) {
    const cat = categorizeRepo(r);
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Repositories</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} of {repos.length} repos</p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Link href="/repos" className={`px-3 py-1.5 rounded-full text-xs border transition-all ${!filterCat ? "border-[#FF1D6C] text-[#FF1D6C] bg-[#FF1D6C]/10" : "border-white/10 text-gray-400 hover:border-white/20"}`}>
          All ({repos.length})
        </Link>
        {Object.entries(CATEGORIES).filter(([key]) => catCounts[key]).map(([key, cat]) => (
          <Link key={key} href={`/repos?cat=${key}`}
            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${filterCat === key ? "text-white bg-white/10 border-white/30" : "border-white/10 text-gray-400 hover:border-white/20"}`}>
            {cat.icon} {cat.label} ({catCounts[key]})
          </Link>
        ))}
      </div>

      {/* Repo grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((r) => {
          const cat = CATEGORIES[categorizeRepo(r)];
          return (
            <Link key={r.name} href={`/repos/${r.name}`}
              className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-semibold text-white truncate flex-1 group-hover:text-white/90">{r.name}</div>
                <span className="text-xs ml-2 flex-shrink-0" style={{ color: cat?.color }}>{cat?.icon}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{r.description || "No description"}</p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                {r.language && <span className="px-1.5 py-0.5 bg-white/5 rounded text-gray-400">{r.language}</span>}
                {r.open_issues_count > 0 && <span>{r.open_issues_count} issues</span>}
                <span className="ml-auto">{new Date(r.pushed_at).toLocaleDateString()}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No repos match this filter. <Link href="/repos" className="text-[#FF1D6C] hover:underline">Clear filters</Link>
        </div>
      )}
    </div>
  );
}
