import Link from "next/link";
import { getRepo, getRepoReadme, getRepoIssues, getRepoLanguages, getRepoWorkflowRuns, categorizeRepo, CATEGORIES } from "../../lib/github";

export const revalidate = 120;

export default async function RepoDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const [repo, readme, issues, languages, ciRuns] = await Promise.all([
    getRepo(name).catch(() => null),
    getRepoReadme(name),
    getRepoIssues(name).catch(() => []),
    getRepoLanguages(name),
    getRepoWorkflowRuns(name, 10),
  ]);

  if (!repo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Repo not found</h1>
        <Link href="/repos" className="text-[#FF1D6C] hover:underline">Back to repos</Link>
      </div>
    );
  }

  const cat = CATEGORIES[categorizeRepo(repo)];
  const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link href="/repos" className="text-xs text-gray-500 hover:text-white transition-colors mb-4 inline-block">← Back to repos</Link>
        <div className="flex items-start gap-4">
          <div className="text-3xl">{cat?.icon || "📁"}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{repo.name}</h1>
            <p className="text-gray-400 mt-1">{repo.description || "No description"}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs px-2 py-1 rounded-full border border-white/10 text-gray-400" style={{ borderColor: cat?.color + "40", color: cat?.color }}>
                {cat?.label}
              </span>
              {repo.language && <span className="text-xs text-gray-500">{repo.language}</span>}
              <span className="text-xs text-gray-600">{(repo.size / 1024).toFixed(1)} MB</span>
              <a href={repo.html_url} target="_blank" rel="noopener" className="text-xs text-[#FF1D6C] hover:underline ml-auto">
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Open Issues</div>
          <div className="text-xl font-bold text-white mt-1">{repo.open_issues_count}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Last Push</div>
          <div className="text-sm font-semibold text-white mt-1">{new Date(repo.pushed_at).toLocaleDateString()}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Stars</div>
          <div className="text-xl font-bold text-white mt-1">{repo.stargazers_count}</div>
        </div>
      </div>

      {/* Languages */}
      {totalLangBytes > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Languages</h2>
          <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
            {Object.entries(languages).map(([lang, bytes]) => (
              <div key={lang} className="h-full" style={{ width: `${(bytes / totalLangBytes) * 100}%`, backgroundColor: lang === "TypeScript" ? "#3178c6" : lang === "Python" ? "#3572A5" : lang === "JavaScript" ? "#f1e05a" : lang === "HTML" ? "#e34c26" : lang === "Shell" ? "#89e051" : lang === "CSS" ? "#563d7c" : "#6b7280" }} title={`${lang}: ${((bytes / totalLangBytes) * 100).toFixed(1)}%`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.entries(languages).map(([lang, bytes]) => (
              <span key={lang} className="text-xs text-gray-400">{lang} {((bytes / totalLangBytes) * 100).toFixed(1)}%</span>
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Open Issues ({issues.length})</h2>
          <div className="space-y-2">
            {issues.slice(0, 15).map((i) => (
              <a key={i.number} href={i.html_url} target="_blank" rel="noopener"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 w-10">#{i.number}</span>
                <span className="text-sm text-white truncate flex-1">{i.title}</span>
                {i.labels?.slice(0, 2).map((l) => (
                  <span key={l.name} className="text-xs px-2 py-0.5 rounded-full border text-gray-400" style={{ borderColor: `#${l.color}40`, color: `#${l.color}` }}>{l.name}</span>
                ))}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* CI Status */}
      {ciRuns.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CI / GitHub Actions</h2>
          <div className="space-y-1.5">
            {ciRuns.slice(0, 8).map((run) => {
              const color = run.conclusion === "success" ? "#34d399" : run.conclusion === "failure" ? "#ef4444" : run.conclusion === "cancelled" ? "#6b7280" : "#F5A623";
              const icon = run.conclusion === "success" ? "✓" : run.conclusion === "failure" ? "✕" : run.conclusion === "cancelled" ? "⊘" : "●";
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
        </div>
      )}

      {/* README */}
      {readme && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">README</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">{readme.slice(0, 5000)}</pre>
            {readme.length > 5000 && (
              <p className="text-xs text-gray-500 mt-4">
                Showing first 5000 chars. <a href={`${repo.html_url}#readme`} target="_blank" rel="noopener" className="text-[#FF1D6C] hover:underline">Read full README on GitHub</a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
