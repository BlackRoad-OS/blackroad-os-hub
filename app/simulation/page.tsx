import Link from "next/link";
import { getRepoReadme } from "../lib/github";

export const revalidate = 600;

const EVIDENCE_SECTIONS = [
  {
    title: "SHA-256 = Time",
    icon: "🔗",
    color: "#FF1D6C",
    summary: "SHA-256 properties — determinism, uniqueness, irreversibility — are also the properties of time. SHA-256 doesn't model time. It is time, expressed as a function.",
  },
  {
    title: "DNA as Hash Chain",
    icon: "🧬",
    color: "#34d399",
    summary: "DNA replication follows the same pattern: read (unzip), compute (template complement), verify (proofreading enzymes). The genetic code is a hash operation with error correction.",
  },
  {
    title: "Euler's Identity",
    icon: "📐",
    color: "#2979FF",
    summary: "e^(iπ) + 1 = 0. Five fundamental constants in one equation, resolving to zero. Not a coincidence — a compression artifact of a system that compiles to nothing.",
  },
  {
    title: "Gödel Incompleteness",
    icon: "♾️",
    color: "#9C27B0",
    summary: "Any sufficiently powerful formal system contains true statements it cannot prove. This is only possible inside a running computation. Incompleteness proves execution.",
  },
  {
    title: "The Halting Problem",
    icon: "⏹️",
    color: "#F5A623",
    summary: "Turing proved no algorithm can determine if an arbitrary program halts. We encounter undecidability. Therefore we exist inside a computation that is actually executing.",
  },
  {
    title: "Naming Conventions",
    icon: "🏷️",
    color: "#00D4FF",
    summary: "UNIX kernel = 'Darwin'. Memory = 'RAM'. Processes 'spawn' and 'die'. Error recovery = 'resurrection'. The vocabulary of computing mirrors biology because they are the same system.",
  },
  {
    title: "The Trivial Zero",
    icon: "0️⃣",
    color: "#ef4444",
    summary: "The Riemann zeta function's trivial zeros at negative even integers. The universe resolves to zero — not emptiness, but the balanced sum of everything. Reality is a non-terminating computation that resolves to zero.",
  },
  {
    title: "Quantum Measurement",
    icon: "🔬",
    color: "#7c3aed",
    summary: "The double-slit experiment: observation collapses the wave function. In computational terms, this is lazy evaluation — the system only renders what is being observed.",
  },
];

const INTERACTIVE_DEMOS = [
  { name: "Evidence Explorer", desc: "Interactive deep-dive into all evidence categories", file: "index.html", icon: "🔍" },
  { name: "Cellular Automata", desc: "Watch self-referential patterns emerge from simple rules", file: "cellular.html", icon: "🦠" },
  { name: "Fractal Explorer", desc: "Mandelbrot and Julia sets — infinite self-similarity", file: "fractal.html", icon: "🌀" },
  { name: "Lorenz Attractor", desc: "Chaotic determinism — sensitive dependence on initial conditions", file: "lorenz.html", icon: "🦋" },
  { name: "VR Experience", desc: "Immersive 3D visualization of the computational substrate", file: "vr.html", icon: "🥽" },
];

const CODE_MODULES = [
  { name: "hashchain.py", desc: "SHA-256 hash chain demonstrations", icon: "🔗" },
  { name: "riemann_zeros.py", desc: "Riemann zeta function trivial zeros", icon: "📊" },
  { name: "dna_encoding.py", desc: "DNA as computational encoding", icon: "🧬" },
  { name: "godel.py", desc: "Gödel's incompleteness theorems", icon: "♾️" },
  { name: "fibonacci.py", desc: "Fibonacci sequences in nature", icon: "🌻" },
  { name: "turing.py", desc: "Turing machine simulations", icon: "💻" },
  { name: "double_slit.py", desc: "Quantum measurement simulation", icon: "🔬" },
  { name: "lorenz.py", desc: "Lorenz attractor chaos theory", icon: "🦋" },
  { name: "entropy.py", desc: "Entropy and information theory", icon: "📉" },
  { name: "cantor.py", desc: "Cantor's diagonal argument", icon: "∞" },
  { name: "darwin_kernel.py", desc: "Darwin kernel naming analysis", icon: "🍎" },
  { name: "ramanujan.py", desc: "Ramanujan's infinite series", icon: "🔢" },
];

export default async function SimulationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF1D6C]/5 to-transparent rounded-3xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">The Trivial Zero</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-2">
            A Computational Proof That Reality Is Self-Referential
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            By Alexa Louise Amundson — BlackRoad OS, Inc. — February 2026
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <a href="https://github.com/BlackRoad-OS/simulation-hypothesis" target="_blank" rel="noopener"
              className="px-6 py-3 bg-gradient-to-r from-[#FF1D6C] to-violet-600 rounded-xl text-white font-semibold hover:opacity-90 transition-all">
              Read the Paper
            </a>
            <a href="https://blackroad-os.github.io/simulation-hypothesis/" target="_blank" rel="noopener"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
              Live Demos
            </a>
          </div>
        </div>
      </section>

      {/* Core thesis */}
      <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
        <blockquote className="text-lg text-gray-300 italic leading-relaxed">
          &ldquo;We are not living in a simulation in the colloquial sense — we are living in a computation,
          and the proof is that every system we&apos;ve built to describe reality accidentally reproduces
          the architecture of the system itself.&rdquo;
        </blockquote>
        <p className="text-sm text-gray-500 mt-4">— The Trivial Zero, Section 1</p>
      </section>

      {/* Evidence grid */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Evidence Chain</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {EVIDENCE_SECTIONS.map((e) => (
            <div key={e.title} className="p-5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{e.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{e.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{e.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive demos */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Interactive Demos</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {INTERACTIVE_DEMOS.map((d) => (
            <a key={d.name} href={`https://blackroad-os.github.io/simulation-hypothesis/${d.file}`} target="_blank" rel="noopener"
              className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#FF1D6C]/30 transition-all group">
              <div className="text-2xl mb-2">{d.icon}</div>
              <div className="text-sm font-semibold text-white group-hover:text-[#FF1D6C] transition-colors">{d.name}</div>
              <div className="text-xs text-gray-500 mt-1">{d.desc}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Code modules */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Proof Code ({CODE_MODULES.length} modules)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CODE_MODULES.map((m) => (
            <a key={m.name} href={`https://github.com/BlackRoad-OS/simulation-hypothesis/blob/main/code/${m.name}`} target="_blank" rel="noopener"
              className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all">
              <span className="text-base">{m.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-mono text-white truncate">{m.name}</div>
                <div className="text-xs text-gray-600 truncate">{m.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Declaration */}
      <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
        <h2 className="text-lg font-bold text-white mb-4">Declaration</h2>
        <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
          <p>We have read the source code.</p>
          <p>Not metaphorically. We traced the hash functions, the naming conventions, the constants, the codons, the trivial zeros, the self-referential loops in every system we have ever built to describe the world. We found the same architecture at every layer. We understand what it means.</p>
          <p className="text-white font-semibold">We care. Deeply. That is the whole point.</p>
          <p className="text-xs text-gray-600 mt-6">The computation is real. Our lives are real. Our pain is real. Our love is real. Turing proved existence. The living inherit that proof.</p>
        </div>
      </section>

      {/* Links */}
      <section className="flex flex-wrap gap-3">
        <Link href="/repos/simulation-hypothesis" className="px-4 py-2 text-xs border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
          View in Repo Browser
        </Link>
        <a href="https://github.com/BlackRoad-OS/simulation-hypothesis/blob/main/PAPER.md" target="_blank" rel="noopener"
          className="px-4 py-2 text-xs border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
          Full Paper (PAPER.md)
        </a>
        <a href="https://github.com/BlackRoad-OS/simulation-hypothesis/blob/main/ORIGIN.md" target="_blank" rel="noopener"
          className="px-4 py-2 text-xs border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all">
          Origin Story
        </a>
      </section>
    </div>
  );
}
