import Link from "next/link";
import { getRepos, getRepoLanguages, getRepoWorkflowRuns, categorizeRepo, CATEGORIES } from "../lib/github";

export const revalidate = 300;

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ repos?: string }> }) {
  const params = await searchParams;
  const allRepos = await getRepos().catch(() => []);
  const selected = (params.repos || "").split(",").filter(Boolean);

  // Fetch details for selected repos
  const compareData = await Promise.all(
    selected.slice(0, 4).map(async (name) => {
      const repo = allRepos.find((r) => r.name === name);
      if (!repo) return null;
      const [languages, runs] = await Promise.all([
        getRepoLanguages(name),
        getRepoWorkflowRuns(name, 5),
      ]);
      return { repo, languages, runs };
    })
  );
  const validData = compareData.filter(Boolean) as NonNullable<(typeof compareData)[number]>[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div>
        <Link href="/repos" className="text-xs text-gray-500 hover:text-white transition-colors mb-4 inline-block">← Back to repos</Link>
        <h1 className="text-3xl font-bold text-white mb-2">Compare Repos</h1>
        <p className="text-gray-400 text-sm">Select up to 4 repos to compare side by side.</p>
      </div>

      {/* Repo selector */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select repos to compare</h2>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {allRepos.map((r) => {
            const isSelected = selected.includes(r.name);
            const newSelection = isSelected
              ? selected.filter((s) => s !== r.name)
              : [...selected, r.name].slice(0, 4);
            return (
              <Link key={r.name} href={`/compare?repos=${newSelection.join(",")}`}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${isSelected ? "border-[#FF1D6C] text-[#FF1D6C] bg-[#FF1D6C]/10" : "border-white/10 text-gray-400 hover:border-white/20"}`}>
                {r.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Comparison table */}
      {validData.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs text-gray-500 font-semibold">Metric</th>
                {validData.map((d) => (
                  <th key={d.repo.name} className="text-left py-3 px-4">
                    <Link href={`/repos/${d.repo.name}`} className="text-white hover:text-[#FF1D6C] transition-colors font-semibold">
                      {d.repo.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-4 text-gray-500">Description</td>
                {validData.map((d) => (
                  <td key={d.repo.name} className="py-3 px-4 text-gray-300 text-xs">{d.repo.description || "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Category</td>
                {validData.map((d) => {
                  const cat = CATEGORIES[categorizeRepo(d.repo)];
                  return <td key={d.repo.name} className="py-3 px-4" style={{ color: cat?.color }}>{cat?.icon} {cat?.label}</td>;
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Primary Language</td>
                {validData.map((d) => (
                  <td key={d.repo.name} className="py-3 px-4 text-gray-300">{d.repo.language || "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Languages</td>
                {validData.map((d) => (
                  <td key={d.repo.name} className="py-3 px-4 text-xs text-gray-400">{Object.keys(d.languages).join(", ") || "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Size</td>
                {validData.map((d) => (
                  <td key={d.repo.name} className="py-3 px-4 text-gray-300">{(d.repo.size / 1024).toFixed(1)} MB</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Open Issues</td>
                {validData.map((d) => (
                  <td key={d.repo.name} className="py-3 px-4">
                    <span className={d.repo.open_issues_count > 10 ? "text-[#ef4444]" : d.repo.open_issues_count > 0 ? "text-[#F5A623]" : "text-[#34d399]"}>
                      {d.repo.open_issues_count}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Stars</td>
                {validData.map((d) => (
                  <td key={d.repo.name} className="py-3 px-4 text-gray-300">{d.repo.stargazers_count}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Last Push</td>
                {validData.map((d) => (
                  <td key={d.repo.name} className="py-3 px-4 text-gray-300">{new Date(d.repo.pushed_at).toLocaleDateString()}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">Topics</td>
                {validData.map((d) => (
                  <td key={d.repo.name} className="py-3 px-4 text-xs text-gray-400">{d.repo.topics.join(", ") || "—"}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-500">CI Status</td>
                {validData.map((d) => {
                  const latest = d.runs[0];
                  if (!latest) return <td key={d.repo.name} className="py-3 px-4 text-gray-600">No CI</td>;
                  const color = latest.conclusion === "success" ? "#34d399" : latest.conclusion === "failure" ? "#ef4444" : "#F5A623";
                  return (
                    <td key={d.repo.name} className="py-3 px-4">
                      <span className="flex items-center gap-1.5" style={{ color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        {latest.conclusion || latest.status}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {validData.length < 2 && selected.length > 0 && (
        <div className="text-center py-10 text-gray-500">Select at least 2 repos to compare.</div>
      )}

      {selected.length === 0 && (
        <div className="text-center py-10 text-gray-500">Click repos above to start comparing.</div>
      )}
    </div>
  );
}
