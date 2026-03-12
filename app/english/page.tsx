import Link from "next/link";
import { getRepo, getRepoReadme, getRepoContents, getRepoCommits, getRepoLanguages, getRepoContributors } from "../lib/github";

export const revalidate = 300;

export default async function EnglishPage() {
  const [repo, readme, allFiles, commits, languages, contributors] = await Promise.all([
    getRepo("english-revolution").catch(() => null),
    getRepoReadme("english-revolution").catch(() => ""),
    getRepoContents("english-revolution").catch(() => []),
    getRepoCommits("english-revolution", 10).catch(() => []),
    getRepoLanguages("english-revolution").catch(() => ({})),
    getRepoContributors("english-revolution").catch(() => []),
  ]);

  const courseFiles = allFiles
    .filter((f) => f.name.startsWith("emoji_") && f.name.endsWith(".py"))
    .sort((a, b) => a.name.localeCompare(b.name));
  const htmlFiles = allFiles.filter((f) => f.name.endsWith(".html"));
  const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const totalSizeKB = courseFiles.reduce((s, f) => s + f.size, 0) / 1024;

  const COURSE_ICONS: Record<string, string> = {
    emoji_english: "🎯", emoji_english_advanced: "🧠", emoji_advanced_grammar: "📐",
    emoji_business_english: "💼", emoji_academic_english: "🎓", emoji_conversation_english: "💬",
    emoji_email_mastery: "📧", emoji_interview_mastery: "🎤", emoji_job_interview_english: "👔",
    emoji_idioms_english: "🎭", emoji_pronunciation_guide: "🗣️", emoji_figurative_language: "🎨",
    emoji_vocabulary_mastery: "📚", emoji_speaking_mastery: "🎙️", emoji_listening_mastery: "👂",
    emoji_listening_comprehension: "🔊", emoji_reading_mastery: "📖", emoji_writing_practice: "✍️",
    emoji_memory_mastery: "🧩", emoji_presentation_english: "📊", emoji_leadership_english: "👑",
    emoji_negotiation_english: "🤝", emoji_networking_english: "🌐", emoji_social_media_english: "📱",
    emoji_test_preparation: "📝", emoji_grammar_mistakes: "⚠️", emoji_accent_reduction: "🔊",
    emoji_cultural_english: "🌍", emoji_study_skills_mastery: "📐", emoji_note_taking_mastery: "📓",
    emoji_specialized_english: "🔧",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5A623]/5 via-[#FF1D6C]/5 to-[#2979FF]/5 rounded-3xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Emoji English Revolution</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-2">
            {repo?.description || "English grammar visualized with emojis. Strip away the gatekeeping."}
          </p>
          <p className="text-sm text-gray-500">
            {courseFiles.length} courses. {totalSizeKB.toFixed(0)}KB of content. Zero boring textbooks.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            {htmlFiles.length > 0 && (
              <a href={`https://blackroad-os.github.io/english-revolution/${htmlFiles[0].name}`} target="_blank" rel="noopener"
                className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF1D6C] rounded-xl text-white font-semibold hover:opacity-90 transition-all">
                Interactive Demo
              </a>
            )}
            <a href={repo?.html_url || "https://github.com/BlackRoad-OS/english-revolution"} target="_blank" rel="noopener"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
              Source Code
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Courses</div>
          <div className="text-2xl font-bold text-[#FF1D6C] mt-1">{courseFiles.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Content Size</div>
          <div className="text-2xl font-bold text-[#F5A623] mt-1">{totalSizeKB.toFixed(0)}KB</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Demos</div>
          <div className="text-2xl font-bold text-[#2979FF] mt-1">{htmlFiles.length}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Commits</div>
          <div className="text-2xl font-bold text-[#34d399] mt-1">{commits.length}+</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Stars</div>
          <div className="text-2xl font-bold text-[#9C27B0] mt-1">{repo?.stargazers_count || 0}</div>
        </div>
      </section>

      {/* Languages */}
      {totalLangBytes > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Languages</h2>
          <div className="flex h-2 rounded-full overflow-hidden bg-white/5 mb-2">
            {Object.entries(languages).map(([lang, bytes]) => (
              <div key={lang} className="h-full" style={{ width: `${(bytes / totalLangBytes) * 100}%`, backgroundColor: lang === "Python" ? "#3572A5" : lang === "HTML" ? "#e34c26" : "#6b7280" }} title={lang} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(languages).map(([lang, bytes]) => (
              <span key={lang} className="text-xs text-gray-400">{lang} {((bytes / totalLangBytes) * 100).toFixed(1)}%</span>
            ))}
          </div>
        </section>
      )}

      {/* Core concept */}
      <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-2xl mb-2">📅 TIMELINE CONCEPT</div>
          <div className="text-xl font-mono text-gray-300">
            ⬅️ PAST ━━━━━━━ 🎯 NOW ━━━━━━━ ➡️ FUTURE
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { pattern: "Simple", meaning: "Just do it", emoji: "🏃" },
            { pattern: "Continuous", meaning: "Doing it now", emoji: "🏃‍♂️▶️" },
            { pattern: "Perfect", meaning: "Already done", emoji: "✅" },
            { pattern: "Perfect + ing", meaning: "Was doing before", emoji: "✅▶️" },
          ].map((p) => (
            <div key={p.pattern} className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl mb-1">{p.emoji}</div>
              <div className="text-sm font-semibold text-white">{p.pattern}</div>
              <div className="text-xs text-gray-500">{p.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      {/* All courses — live from GitHub */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">All {courseFiles.length} Courses (live from repo)</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {courseFiles.map((f) => {
            const baseName = f.name.replace(".py", "");
            const icon = COURSE_ICONS[baseName] || "📘";
            const label = baseName
              .replace("emoji_", "")
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <a key={f.name} href={f.html_url} target="_blank" rel="noopener"
                className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{icon}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white group-hover:text-[#FF1D6C] transition-colors">{label}</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">{f.name} — {(f.size / 1024).toFixed(0)}KB</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Interactive demos */}
      {htmlFiles.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Interactive Demos</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {htmlFiles.map((f) => {
              const label = f.name.replace(".html", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <a key={f.name} href={`https://blackroad-os.github.io/english-revolution/${f.name}`} target="_blank" rel="noopener"
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#F5A623]/30 transition-all group">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="text-sm font-semibold text-white group-hover:text-[#F5A623] transition-colors">{label}</div>
                  <div className="text-xs text-gray-600 font-mono mt-1">{(f.size / 1024).toFixed(0)}KB</div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent commits */}
      {commits.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Commits</h2>
          <div className="space-y-1.5">
            {commits.slice(0, 6).map((c) => (
              <a key={c.sha} href={c.html_url} target="_blank" rel="noopener"
                className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all">
                <span className="text-xs font-mono text-[#F5A623]">{c.sha.slice(0, 7)}</span>
                <span className="text-sm text-gray-300 truncate flex-1">{c.commit.message.split("\n")[0]}</span>
                <span className="text-xs text-gray-600">{new Date(c.commit.author.date).toLocaleDateString()}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contributors */}
      {contributors.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contributors</h2>
          <div className="flex flex-wrap gap-2">
            {contributors.map((c) => (
              <a key={c.login} href={c.html_url} target="_blank" rel="noopener"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-white/20 transition-all">
                <span className="text-xs text-gray-300">{c.login}</span>
                <span className="text-xs text-gray-600">{c.contributions}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      <section className="flex flex-wrap gap-3">
        <Link href="/repos/english-revolution" className="px-4 py-2 text-xs border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
          View in Repo Browser
        </Link>
      </section>
    </div>
  );
}
