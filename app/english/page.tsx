import Link from "next/link";

export const revalidate = 600;

const TENSES = [
  {
    name: "Simple Present",
    emoji: "🔁",
    visual: "REPEATS / ALWAYS TRUE",
    pattern: "[person] + [verb] + [thing]",
    examples: [
      { person: "👤 I", verb: "eat", thing: "🍕 pizza", note: "every day" },
      { person: "👤 She", verb: "eats", thing: "🍕 pizza", note: "habit" },
      { person: "☀️ Sun", verb: "rises", thing: "🌅 east", note: "fact" },
    ],
  },
  {
    name: "Present Continuous",
    emoji: "▶️",
    visual: "PLAYING NOW",
    pattern: "[person] + am/is/are + [verb]ing + [thing]",
    examples: [
      { person: "👤 I", verb: "am eating", thing: "🍕 pizza", note: "right now!" },
      { person: "👤 She", verb: "is eating", thing: "🍕 pizza", note: "now!" },
      { person: "👥 They", verb: "are eating", thing: "🍕 pizza", note: "now!" },
    ],
  },
  {
    name: "Present Perfect",
    emoji: "✅",
    visual: "COMPLETED, AFFECTS NOW",
    pattern: "[person] + have/has + [past verb] + [thing]",
    examples: [
      { person: "👤 I", verb: "have eaten", thing: "🍕 pizza", note: "and I'm full!" },
      { person: "👤 She", verb: "has eaten", thing: "🍕 pizza", note: "recently" },
    ],
  },
  {
    name: "Simple Past",
    emoji: "⏮️",
    visual: "REWIND, IT'S DONE",
    pattern: "[person] + [past verb] + [thing]",
    examples: [
      { person: "👤 I", verb: "ate", thing: "🍕 pizza", note: "yesterday" },
      { person: "🏛️ Rome", verb: "fell", thing: "💥", note: "long ago" },
    ],
  },
  {
    name: "Past Continuous",
    emoji: "⏸️▶️",
    visual: "WAS PLAYING THEN",
    pattern: "[person] + was/were + [verb]ing + [thing]",
    examples: [
      { person: "👤 I", verb: "was eating", thing: "🍕 pizza", note: "when you called" },
      { person: "👥 They", verb: "were eating", thing: "🍕 pizza", note: "at 8pm" },
    ],
  },
  {
    name: "Simple Future",
    emoji: "⏩",
    visual: "FAST FORWARD, WILL DO",
    pattern: "[person] + will + [verb] + [thing]",
    examples: [
      { person: "👤 I", verb: "will eat", thing: "🍕 pizza", note: "tomorrow" },
      { person: "☀️ Sun", verb: "will rise", thing: "🌅", note: "tomorrow" },
    ],
  },
  {
    name: "Future Perfect",
    emoji: "✅⏩",
    visual: "WILL BE CHECKED OFF",
    pattern: "[person] + will have + [past verb] + [thing]",
    examples: [
      { person: "👤 I", verb: "will have eaten", thing: "🍕 pizza", note: "by 8pm" },
      { person: "👤 She", verb: "will have left", thing: "🏠 home", note: "by then" },
    ],
  },
];

const COURSES = [
  { name: "Core English", file: "emoji_english.py", icon: "🎯", desc: "Verb tenses, sentence patterns, visual grammar" },
  { name: "Advanced Grammar", file: "emoji_advanced_grammar.py", icon: "🧠", desc: "Complex structures, conditionals, modals" },
  { name: "Business English", file: "emoji_business_english.py", icon: "💼", desc: "Meetings, emails, reports, negotiations" },
  { name: "Academic English", file: "emoji_academic_english.py", icon: "🎓", desc: "Research writing, citations, formal tone" },
  { name: "Conversation", file: "emoji_conversation_english.py", icon: "💬", desc: "Small talk, debates, storytelling" },
  { name: "Email Mastery", file: "emoji_email_mastery.py", icon: "📧", desc: "Professional emails, tone, structure" },
  { name: "Interview Prep", file: "emoji_interview_mastery.py", icon: "🎤", desc: "STAR method, tough questions, confidence" },
  { name: "Idioms", file: "emoji_idioms_english.py", icon: "🎭", desc: "Common idioms, metaphors, slang" },
  { name: "Pronunciation", file: "emoji_pronunciation_guide.py", icon: "🗣️", desc: "Sound patterns, stress, intonation" },
  { name: "Figurative Language", file: "emoji_figurative_language.py", icon: "🎨", desc: "Metaphor, simile, irony, hyperbole" },
  { name: "Vocabulary", file: "emoji_vocabulary_mastery.py", icon: "📚", desc: "Word roots, prefixes, context clues" },
  { name: "Speaking", file: "emoji_speaking_mastery.py", icon: "🎙️", desc: "Fluency, confidence, public speaking" },
  { name: "Listening", file: "emoji_listening_mastery.py", icon: "👂", desc: "Comprehension, note-taking, accents" },
  { name: "Reading", file: "emoji_reading_mastery.py", icon: "📖", desc: "Speed reading, analysis, inference" },
  { name: "Writing", file: "emoji_writing_practice.py", icon: "✍️", desc: "Essays, creative writing, structure" },
  { name: "Memory", file: "emoji_memory_mastery.py", icon: "🧩", desc: "Mnemonics, spaced repetition, recall" },
  { name: "Presentation", file: "emoji_presentation_english.py", icon: "📊", desc: "Slides, delivery, audience engagement" },
  { name: "Leadership", file: "emoji_leadership_english.py", icon: "👑", desc: "Delegation, feedback, vision casting" },
  { name: "Negotiation", file: "emoji_negotiation_english.py", icon: "🤝", desc: "Persuasion, concessions, BATNA" },
  { name: "Networking", file: "emoji_networking_english.py", icon: "🌐", desc: "Elevator pitches, follow-ups, LinkedIn" },
  { name: "Social Media", file: "emoji_social_media_english.py", icon: "📱", desc: "Captions, hashtags, viral writing" },
  { name: "Test Prep", file: "emoji_test_preparation.py", icon: "📝", desc: "TOEFL, IELTS, Cambridge exam strategies" },
  { name: "Grammar Mistakes", file: "emoji_grammar_mistakes.py", icon: "⚠️", desc: "Top 50 common errors and fixes" },
  { name: "Accent Reduction", file: "emoji_accent_reduction.py", icon: "🔊", desc: "Minimal pairs, rhythm, connected speech" },
  { name: "Cultural English", file: "emoji_cultural_english.py", icon: "🌍", desc: "Regional dialects, cultural context" },
  { name: "Study Skills", file: "emoji_study_skills_mastery.py", icon: "📐", desc: "Active recall, Pomodoro, deep work" },
  { name: "Note Taking", file: "emoji_note_taking_mastery.py", icon: "📓", desc: "Cornell method, mind maps, synthesis" },
  { name: "Specialized", file: "emoji_specialized_english.py", icon: "🔧", desc: "Medical, legal, technical vocabulary" },
];

const PATTERN_SUMMARY = [
  { pattern: "Simple", meaning: "Just do it", emoji: "🏃" },
  { pattern: "Continuous", meaning: "Doing it now", emoji: "🏃‍♂️▶️" },
  { pattern: "Perfect", meaning: "Already done", emoji: "✅" },
  { pattern: "Perfect + ing", meaning: "Was doing before", emoji: "✅▶️" },
];

export default function EnglishPage() {
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
            English grammar visualized with emojis. Strip away the gatekeeping. Show the patterns.
          </p>
          <p className="text-sm text-gray-500">28 courses. Zero boring textbooks.</p>
          <div className="flex justify-center gap-4 mt-8">
            <a href="https://blackroad-os.github.io/english-revolution/interactive-demo.html" target="_blank" rel="noopener"
              className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF1D6C] rounded-xl text-white font-semibold hover:opacity-90 transition-all">
              Interactive Demo
            </a>
            <a href="https://github.com/BlackRoad-OS/english-revolution" target="_blank" rel="noopener"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
              Source Code
            </a>
          </div>
        </div>
      </section>

      {/* Core concept */}
      <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-2xl mb-2">📅 TIMELINE CONCEPT</div>
          <div className="text-xl font-mono text-gray-300">
            ⬅️ PAST ━━━━━━━ 🎯 NOW ━━━━━━━ ➡️ FUTURE
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PATTERN_SUMMARY.map((p) => (
            <div key={p.pattern} className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl mb-1">{p.emoji}</div>
              <div className="text-sm font-semibold text-white">{p.pattern}</div>
              <div className="text-xs text-gray-500">{p.meaning}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Verb tenses interactive */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Verb Tenses — The Visual Way</h2>
        <div className="space-y-4">
          {TENSES.map((t) => (
            <div key={t.name} className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                  <span className="text-xs text-gray-500">{t.visual}</span>
                </div>
              </div>
              <div className="text-xs font-mono text-gray-400 mb-3 px-3 py-1.5 bg-white/5 rounded-lg inline-block">
                {t.pattern}
              </div>
              <div className="space-y-1.5">
                {t.examples.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-300 w-20 flex-shrink-0">{ex.person}</span>
                    <span className="text-[#FF1D6C] font-semibold">{ex.verb}</span>
                    <span className="text-gray-300">{ex.thing}</span>
                    <span className="text-xs text-gray-600 ml-auto">({ex.note})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All courses */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">All {COURSES.length} Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COURSES.map((c) => (
            <a key={c.name}
              href={`https://github.com/BlackRoad-OS/english-revolution/blob/main/${c.file}`}
              target="_blank" rel="noopener"
              className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all group">
              <div className="flex items-start gap-3">
                <span className="text-xl">{c.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-[#FF1D6C] transition-colors">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.desc}</div>
                  <div className="text-xs font-mono text-gray-600 mt-1">{c.file}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center">
        <blockquote className="text-lg text-gray-300 italic max-w-2xl mx-auto">
          &ldquo;Traditional textbooks: 500 pages of rules. This approach: VISUAL PATTERNS you SEE instantly.
          Same philosophy as quantum computing — strip away the gatekeeping, show the patterns.&rdquo;
        </blockquote>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link href="/repos/english-revolution" className="px-4 py-2 text-xs border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
          View in Repo Browser
        </Link>
      </section>
    </div>
  );
}
