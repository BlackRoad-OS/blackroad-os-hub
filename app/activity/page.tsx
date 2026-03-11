import Link from "next/link";

export const revalidate = 120;

const ORG = "BlackRoad-OS";

interface Event {
  id: string;
  type: string;
  repo: { name: string };
  actor: { login: string; avatar_url: string };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    commits?: { message: string; sha: string }[];
    pull_request?: { title: string; number: number; merged?: boolean };
    issue?: { title: string; number: number };
    description?: string;
    size?: number;
  };
  created_at: string;
}

async function getOrgEvents(): Promise<Event[]> {
  const token = process.env.GITHUB_TOKEN || "";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const res = await fetch(`https://api.github.com/orgs/${ORG}/events?per_page=100`, {
      headers,
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function eventIcon(type: string): string {
  const map: Record<string, string> = {
    PushEvent: "📤",
    CreateEvent: "✨",
    DeleteEvent: "🗑️",
    PullRequestEvent: "🔀",
    IssuesEvent: "🔔",
    IssueCommentEvent: "💬",
    WatchEvent: "⭐",
    ForkEvent: "🍴",
    ReleaseEvent: "🚀",
    MemberEvent: "👤",
    PublicEvent: "🌐",
  };
  return map[type] || "📌";
}

function eventDescription(e: Event): string {
  switch (e.type) {
    case "PushEvent": {
      const count = e.payload.commits?.length || 0;
      const msg = e.payload.commits?.[0]?.message?.split("\n")[0] || "";
      return `pushed ${count} commit${count !== 1 ? "s" : ""}: ${msg}`;
    }
    case "CreateEvent":
      return `created ${e.payload.ref_type}${e.payload.ref ? ` "${e.payload.ref}"` : ""}`;
    case "DeleteEvent":
      return `deleted ${e.payload.ref_type} "${e.payload.ref}"`;
    case "PullRequestEvent":
      return `${e.payload.action} PR #${e.payload.pull_request?.number}: ${e.payload.pull_request?.title}`;
    case "IssuesEvent":
      return `${e.payload.action} issue #${e.payload.issue?.number}: ${e.payload.issue?.title}`;
    case "IssueCommentEvent":
      return `commented on #${e.payload.issue?.number}: ${e.payload.issue?.title}`;
    case "WatchEvent":
      return "starred the repo";
    case "ForkEvent":
      return "forked the repo";
    case "ReleaseEvent":
      return `${e.payload.action} a release`;
    default:
      return e.type.replace("Event", "").toLowerCase();
  }
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function ActivityPage() {
  const events = await getOrgEvents();

  // Group by day
  const byDay: Record<string, Event[]> = {};
  for (const e of events) {
    const day = new Date(e.created_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(e);
  }

  // Stats
  const pushes = events.filter((e) => e.type === "PushEvent").length;
  const prs = events.filter((e) => e.type === "PullRequestEvent").length;
  const issueEvents = events.filter((e) => e.type === "IssuesEvent" || e.type === "IssueCommentEvent").length;
  const uniqueRepos = [...new Set(events.map((e) => e.repo.name.split("/")[1]))];
  const uniqueActors = [...new Set(events.map((e) => e.actor.login))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Activity Feed</h1>
        <p className="text-gray-400">Recent changes across the BlackRoad-OS organization.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Events", value: events.length.toString(), color: "#FF1D6C" },
          { label: "Pushes", value: pushes.toString(), color: "#34d399" },
          { label: "PRs", value: prs.toString(), color: "#2979FF" },
          { label: "Issues", value: issueEvents.toString(), color: "#F5A623" },
          { label: "Active Repos", value: uniqueRepos.length.toString(), color: "#9C27B0" },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Contributors */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contributors</h2>
        <div className="flex flex-wrap gap-2">
          {uniqueActors.map((actor) => (
            <a key={actor} href={`https://github.com/${actor}`} target="_blank" rel="noopener"
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-white/20 transition-all">
              <span className="text-xs text-gray-300">{actor}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {Object.entries(byDay).map(([day, dayEvents]) => (
        <div key={day}>
          <h2 className="text-sm font-semibold text-gray-400 mb-3 sticky top-14 bg-black/80 backdrop-blur py-2 z-10">{day}</h2>
          <div className="space-y-1.5">
            {dayEvents.map((e) => {
              const repoName = e.repo.name.split("/")[1];
              return (
                <div key={e.id} className="flex items-start gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
                  <span className="text-base flex-shrink-0 mt-0.5">{eventIcon(e.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500">{e.actor.login}</span>
                      <span className="text-xs text-gray-700">/</span>
                      <Link href={`/repos/${repoName}`} className="text-xs text-[#FF1D6C] hover:underline">{repoName}</Link>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5 truncate">{eventDescription(e)}</p>
                  </div>
                  <span className="text-xs text-gray-600 flex-shrink-0 mt-1">{timeAgo(e.created_at)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-20 text-gray-500">No recent activity found.</div>
      )}
    </div>
  );
}
