const ORG = "BlackRoad-OS";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
  archived: boolean;
  topics: string[];
  size: number;
  default_branch: string;
}

export interface Issue {
  number: number;
  title: string;
  state: string;
  html_url: string;
  repository_url: string;
  labels: { name: string; color: string }[];
  created_at: string;
  updated_at: string;
  user: { login: string; avatar_url: string } | null;
}

async function ghFetch<T>(url: string, revalidate = 300): Promise<T> {
  const res = await fetch(url, {
    headers,
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}

export async function getRepos(): Promise<Repo[]> {
  const all: Repo[] = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await ghFetch<Repo[]>(
      `https://api.github.com/orgs/${ORG}/repos?per_page=100&page=${page}&sort=pushed`,
      600
    );
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all.filter((r) => !r.archived).sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));
}

export async function getRepo(name: string): Promise<Repo> {
  return ghFetch<Repo>(`https://api.github.com/repos/${ORG}/${name}`, 120);
}

export async function getRepoReadme(name: string): Promise<string> {
  try {
    const data = await ghFetch<{ content: string }>(
      `https://api.github.com/repos/${ORG}/${name}/readme`,
      600
    );
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

export async function getOrgIssues(state = "open", perPage = 50): Promise<Issue[]> {
  return ghFetch<Issue[]>(
    `https://api.github.com/search/issues?q=org:${ORG}+is:issue+state:${state}&per_page=${perPage}&sort=updated`,
    120
  ).then((d: any) => d.items || []);
}

export async function getRepoIssues(name: string): Promise<Issue[]> {
  return ghFetch<Issue[]>(
    `https://api.github.com/repos/${ORG}/${name}/issues?state=open&per_page=30`,
    120
  );
}

export async function getRepoLanguages(name: string): Promise<Record<string, number>> {
  try {
    return ghFetch<Record<string, number>>(
      `https://api.github.com/repos/${ORG}/${name}/languages`,
      600
    );
  } catch {
    return {};
  }
}

// Categorize repos into app groups
export function categorizeRepo(r: Repo): string {
  const n = r.name.toLowerCase();
  const d = (r.description || "").toLowerCase();
  if (n.includes("agent") || d.includes("agent")) return "agents";
  if (n.includes("infra") || n.includes("fleet") || n.includes("cluster") || n.includes("pi-ops") || d.includes("infrastructure")) return "infra";
  if (n.includes("api") || n.includes("gateway") || n.includes("webhook")) return "api";
  if (n.includes("pack-") || n.includes("plugin")) return "packs";
  if (n.includes("lucidia") || n.includes("earth")) return "lucidia";
  if (n.includes("deploy") || n.includes("cicd") || n.includes("github-action")) return "devops";
  if (n.includes("web") || n.includes("app") || n.includes("site") || n.includes("landing") || n.includes("dashboard") || n.includes("console")) return "web";
  if (n.includes("doc") || n.includes("brand") || n.includes("hello")) return "docs";
  if (n.includes("math") || n.includes("quantum") || n.includes("experiment") || n.includes("simulation")) return "research";
  if (n.includes("prism") || n.includes("sales") || n.includes("compliance") || n.includes("audit")) return "enterprise";
  if (n.includes("auth") || n.includes("key") || n.includes("secret") || n.includes("vpn")) return "security";
  return "core";
}

export const CATEGORIES: Record<string, { label: string; color: string; icon: string }> = {
  agents: { label: "AI Agents", color: "#2979FF", icon: "🤖" },
  infra: { label: "Infrastructure", color: "#F5A623", icon: "🏗️" },
  api: { label: "APIs & Gateways", color: "#34d399", icon: "🔌" },
  packs: { label: "Extension Packs", color: "#9C27B0", icon: "📦" },
  lucidia: { label: "Lucidia", color: "#FF1D6C", icon: "🌀" },
  devops: { label: "DevOps & CI/CD", color: "#ef4444", icon: "🚀" },
  web: { label: "Web & Apps", color: "#fbbf24", icon: "🌐" },
  docs: { label: "Docs & Brand", color: "#6b7280", icon: "📝" },
  research: { label: "Research & Math", color: "#7c3aed", icon: "🔬" },
  enterprise: { label: "Enterprise", color: "#06b6d4", icon: "🏢" },
  security: { label: "Security & Auth", color: "#ef4444", icon: "🔐" },
  core: { label: "Core Systems", color: "#f97316", icon: "⚙️" },
};
