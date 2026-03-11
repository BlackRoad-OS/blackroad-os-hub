import { getOrgIssues, type Issue } from "../lib/github";

export const revalidate = 120;

export default async function IssuesPage() {
  const issues = await getOrgIssues("open", 50).catch(() => []);

  // Group by repo
  const byRepo: Record<string, Issue[]> = {};
  for (const i of issues) {
    const repo = i.repository_url.split("/").pop() || "unknown";
    if (!byRepo[repo]) byRepo[repo] = [];
    byRepo[repo].push(i);
  }
  const sortedRepos = Object.entries(byRepo).sort((a, b) => b[1].length - a[1].length);

  // Label counts
  const labelCounts: Record<string, number> = {};
  for (const i of issues) {
    for (const l of i.labels) {
      labelCounts[l.name] = (labelCounts[l.name] || 0) + 1;
    }
  }
  const topLabels = Object.entries(labelCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Issues</h1>
        <p className="text-gray-400">{issues.length} open issues across the BlackRoad-OS organization.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Open Issues</div>
          <div className="text-2xl font-bold text-[#FF1D6C] mt-1">{issues.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Repos Affected</div>
          <div className="text-2xl font-bold text-[#F5A623] mt-1">{sortedRepos.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Unique Labels</div>
          <div className="text-2xl font-bold text-[#2979FF] mt-1">{Object.keys(labelCounts).length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Automation Alerts</div>
          <div className="text-2xl font-bold text-[#ef4444] mt-1">{issues.filter((i) => i.labels.some((l) => l.name.includes("automation") || l.name.includes("auto"))).length}</div>
        </div>
      </div>

      {/* Top labels */}
      {topLabels.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Labels</h2>
          <div className="flex flex-wrap gap-2">
            {topLabels.map(([name, count]) => (
              <span key={name} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                {name} <span className="text-gray-500 ml-1">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Issues by repo */}
      {sortedRepos.map(([repo, repoIssues]) => (
        <div key={repo}>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-[#FF1D6C]">{repo}</span>
            <span className="text-xs text-gray-500">({repoIssues.length})</span>
          </h2>
          <div className="space-y-2">
            {repoIssues.map((i) => (
              <a key={i.html_url} href={i.html_url} target="_blank" rel="noopener"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 w-8">#{i.number}</span>
                <span className="text-sm text-white truncate flex-1">{i.title}</span>
                <span className="text-xs text-gray-600">{new Date(i.updated_at).toLocaleDateString()}</span>
                {i.labels.slice(0, 2).map((l) => (
                  <span key={l.name} className="text-xs px-2 py-0.5 rounded-full border text-gray-400" style={{ borderColor: `#${l.color}40`, color: `#${l.color}` }}>{l.name}</span>
                ))}
              </a>
            ))}
          </div>
        </div>
      ))}

      {issues.length === 0 && (
        <div className="text-center py-20 text-gray-500">No open issues found.</div>
      )}
    </div>
  );
}
