import Link from "next/link";
import { getRepos, categorizeRepo, CATEGORIES } from "../lib/github";

export const revalidate = 300;

const DOC_LINKS = [
  { name: "Getting Started", desc: "First-time setup, onboarding, and gateway configuration", href: "https://app.blackroad.io", icon: "🚀" },
  { name: "CLI Reference", desc: "All br commands — git save, cf-workers, domains, radar, nodes", href: "/repos/blackroad-cli-npm", icon: "⌨️" },
  { name: "API Documentation", desc: "REST API, authentication, rate limits, and endpoints", href: "/repos/blackroad-os-api", icon: "🔌" },
  { name: "Agent Guide", desc: "Agent capabilities, roles, and how to interact with each one", href: "/agents", icon: "🤖" },
  { name: "Infrastructure", desc: "Pi fleet, WireGuard mesh, Cloudflare tunnels, Hailo-8", href: "/fleet", icon: "🏗️" },
  { name: "Brand Guidelines", desc: "Colors, fonts, gradients, and design system rules", href: "/repos/blackroad-os-brand", icon: "🎨" },
  { name: "Security", desc: "Auth, encryption, key management, audit logs", href: "/repos?cat=security", icon: "🔐" },
  { name: "Extension Packs", desc: "Finance, Legal, Education, Marketing, Research, DevOps packs", href: "/repos?cat=packs", icon: "📦" },
];

export default async function DocsPage() {
  const repos = await getRepos().catch(() => []);
  const docRepos = repos.filter((r) => {
    const n = r.name.toLowerCase();
    return n.includes("doc") || n.includes("brand") || n.includes("hello") || n.includes("home") || n.includes("training");
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Documentation</h1>
        <p className="text-gray-400">Guides, references, and deep-dives into BlackRoad OS.</p>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-3">
        {DOC_LINKS.map((doc) => {
          const isExternal = doc.href.startsWith("http");
          const Tag = isExternal ? "a" : Link;
          const extra = isExternal ? { target: "_blank", rel: "noopener" } : {};
          return (
            <Tag key={doc.name} href={doc.href} {...extra}
              className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{doc.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-white/90">{doc.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{doc.desc}</div>
                </div>
              </div>
            </Tag>
          );
        })}
      </div>

      {/* Categories breakdown */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const count = repos.filter((r) => categorizeRepo(r) === key).length;
            if (!count) return null;
            return (
              <Link key={key} href={`/repos?cat=${key}`} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all text-center">
                <div className="text-xl mb-1">{cat.icon}</div>
                <div className="text-xs font-semibold text-white">{cat.label}</div>
                <div className="text-xs text-gray-500">{count} repos</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Doc repos */}
      {docRepos.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Documentation Repositories</h2>
          <div className="space-y-2">
            {docRepos.map((r) => (
              <Link key={r.name} href={`/repos/${r.name}`}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                <span className="text-sm text-white flex-1">{r.name}</span>
                <span className="text-xs text-gray-500 truncate max-w-sm">{r.description}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
