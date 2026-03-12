import Link from "next/link";
import { Suspense } from "react";
import { getRepos, categorizeRepo, CATEGORIES } from "../lib/github";
import SearchBar from "../components/SearchBar";

export const revalidate = 300;

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)}MB`;
  return `${kb}KB`;
}

export default async function ReposPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string; sort?: string }> }) {
  const params = await searchParams;
  const repos = await getRepos().catch(() => []);
  const filterCat = params.cat || "";
  const filterQ = (params.q || "").toLowerCase();
  const sortBy = params.sort || "updated";

  const filtered = repos.filter((r) => {
    if (filterCat && categorizeRepo(r) !== filterCat) return false;
    if (filterQ && !r.name.toLowerCase().includes(filterQ) && !(r.description || "").toLowerCase().includes(filterQ) && !(r.language || "").toLowerCase().includes(filterQ) && !r.topics.some(t => t.includes(filterQ))) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "issues") return b.open_issues_count - a.open_issues_count;
    if (sortBy === "size") return b.size - a.size;
    if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
    return b.pushed_at.localeCompare(a.pushed_at); // default: updated
  });

  const catCounts: Record<string, number> = {};
  for (const r of repos) {
    const cat = categorizeRepo(r);
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }

  // Language stats for this filtered view
  const langCounts: Record<string, number> = {};
  for (const r of filtered) {
    const lang = r.language || "Other";
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Repositories</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} of {repos.length} repos</p>
        </div>
        <Link href="/compare" className="px-4 py-2 text-xs border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
          Compare repos
        </Link>
      </div>

      {/* Search */}
      <Suspense>
        <SearchBar placeholder="Search repos by name, description, language, or topic..." />
      </Suspense>

      {/* Sort */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-500">Sort:</span>
        {[
          { key: "updated", label: "Recently updated" },
          { key: "name", label: "Name" },
          { key: "issues", label: "Most issues" },
          { key: "size", label: "Largest" },
          { key: "stars", label: "Stars" },
        ].map((s) => (
          <Link key={s.key} href={`/repos?${new URLSearchParams({ ...(filterCat ? { cat: filterCat } : {}), ...(filterQ ? { q: params.q || "" } : {}), sort: s.key }).toString()}`}
            className={`px-2 py-1 rounded transition-all ${sortBy === s.key ? "text-white bg-white/10" : "text-gray-500 hover:text-white"}`}>
            {s.label}
          </Link>
        ))}
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
        {sorted.map((r) => {
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
                {r.open_issues_count > 0 && <span className="text-amber-400/80">{r.open_issues_count} issues</span>}
                <span>{formatSize(r.size)}</span>
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
