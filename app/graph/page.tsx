import Link from "next/link";
import { getRepos, categorizeRepo, CATEGORIES, type Repo } from "../lib/github";

export const revalidate = 600;

// Build a dependency/relationship graph based on shared topics, naming patterns, and categories
function buildGraph(repos: Repo[]) {
  const nodes: { id: string; category: string; language: string | null; size: number; issues: number }[] = [];
  const edges: { source: string; target: string; reason: string }[] = [];

  for (const r of repos) {
    nodes.push({
      id: r.name,
      category: categorizeRepo(r),
      language: r.language,
      size: r.size,
      issues: r.open_issues_count,
    });
  }

  // Find edges: shared naming prefixes
  const prefixGroups: Record<string, string[]> = {};
  for (const r of repos) {
    const prefix = r.name.split("-").slice(0, 2).join("-");
    if (!prefixGroups[prefix]) prefixGroups[prefix] = [];
    prefixGroups[prefix].push(r.name);
  }

  for (const [prefix, group] of Object.entries(prefixGroups)) {
    if (group.length < 2 || group.length > 15) continue;
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        edges.push({ source: group[i], target: group[j], reason: `shared prefix: ${prefix}` });
      }
    }
  }

  // Find edges: shared topics
  for (let i = 0; i < repos.length; i++) {
    for (let j = i + 1; j < repos.length; j++) {
      const shared = repos[i].topics.filter((t) => repos[j].topics.includes(t));
      if (shared.length > 0) {
        edges.push({ source: repos[i].name, target: repos[j].name, reason: `topics: ${shared.join(", ")}` });
      }
    }
  }

  return { nodes, edges };
}

export default async function GraphPage() {
  const repos = await getRepos().catch(() => []);
  const { nodes, edges } = buildGraph(repos);

  // Group by category for the visual layout
  const byCategory: Record<string, typeof nodes> = {};
  for (const n of nodes) {
    if (!byCategory[n.category]) byCategory[n.category] = [];
    byCategory[n.category].push(n);
  }

  // Find clusters (connected components via edges)
  const adjacency: Record<string, Set<string>> = {};
  for (const e of edges) {
    if (!adjacency[e.source]) adjacency[e.source] = new Set();
    if (!adjacency[e.target]) adjacency[e.target] = new Set();
    adjacency[e.source].add(e.target);
    adjacency[e.target].add(e.source);
  }

  // Find the most connected repos
  const connectionCounts: Record<string, number> = {};
  for (const [node, neighbors] of Object.entries(adjacency)) {
    connectionCounts[node] = neighbors.size;
  }
  const topConnected = Object.entries(connectionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  // Isolated repos (no edges)
  const connectedRepos = new Set([...edges.map((e) => e.source), ...edges.map((e) => e.target)]);
  const isolated = nodes.filter((n) => !connectedRepos.has(n.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dependency Graph</h1>
        <p className="text-gray-400 text-sm">
          {nodes.length} repos, {edges.length} connections. Relationships based on naming patterns, shared topics, and categories.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Repos</div>
          <div className="text-2xl font-bold text-[#FF1D6C] mt-1">{nodes.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Connections</div>
          <div className="text-2xl font-bold text-[#2979FF] mt-1">{edges.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Categories</div>
          <div className="text-2xl font-bold text-[#F5A623] mt-1">{Object.keys(byCategory).length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Isolated</div>
          <div className="text-2xl font-bold text-gray-400 mt-1">{isolated.length}</div>
        </div>
      </div>

      {/* Most Connected */}
      {topConnected.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Most Connected Repos</h2>
          <div className="space-y-1.5">
            {topConnected.map(([name, count]) => {
              const node = nodes.find((n) => n.id === name);
              const cat = CATEGORIES[node?.category || "core"];
              const neighbors = adjacency[name] ? [...adjacency[name]].slice(0, 8) : [];
              return (
                <div key={name} className="px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-base">{cat?.icon}</span>
                    <Link href={`/repos/${name}`} className="text-sm text-white hover:text-[#FF1D6C] transition-colors font-semibold">{name}</Link>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{count} connections</span>
                    {node?.language && <span className="text-xs text-gray-600 ml-auto">{node.language}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                    {neighbors.map((n) => (
                      <Link key={n} href={`/repos/${n}`} className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-0.5 bg-white/5 rounded">
                        {n}
                      </Link>
                    ))}
                    {(adjacency[name]?.size || 0) > 8 && (
                      <span className="text-xs text-gray-600">+{(adjacency[name]?.size || 0) - 8} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category clusters */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Category Clusters</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(byCategory)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([catKey, catNodes]) => {
              const cat = CATEGORIES[catKey];
              // Internal edges within this category
              const internalEdges = edges.filter(
                (e) => catNodes.some((n) => n.id === e.source) && catNodes.some((n) => n.id === e.target)
              );
              // Cross-category edges
              const crossEdges = edges.filter(
                (e) =>
                  (catNodes.some((n) => n.id === e.source) || catNodes.some((n) => n.id === e.target)) &&
                  !internalEdges.includes(e)
              );
              return (
                <div key={catKey} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{cat?.icon}</span>
                    <span className="text-sm font-semibold text-white">{cat?.label}</span>
                    <span className="text-xs text-gray-500">({catNodes.length} repos)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {catNodes.slice(0, 20).map((n) => (
                      <Link key={n.id} href={`/repos/${n.id}`}
                        className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-all"
                        style={{ color: cat?.color, borderLeft: `2px solid ${cat?.color}30` }}>
                        {n.id}
                      </Link>
                    ))}
                    {catNodes.length > 20 && <span className="text-xs text-gray-600 px-2 py-1">+{catNodes.length - 20} more</span>}
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-gray-600">
                    <span>{internalEdges.length} internal links</span>
                    <span>{crossEdges.length} cross-category links</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Isolated repos */}
      {isolated.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Isolated Repos (no connections)</h2>
          <div className="flex flex-wrap gap-2">
            {isolated.map((n) => (
              <Link key={n.id} href={`/repos/${n.id}`}
                className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/20 transition-all">
                {n.id}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
