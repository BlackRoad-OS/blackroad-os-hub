import Link from "next/link";

export const revalidate = 600;

const FORGE_MODULES = [
  { name: "consciousness.py", lines: 650, desc: "Consciousness modeling and emergence patterns", icon: "🧠", color: "#9C27B0" },
  { name: "unified_geometry.py", lines: 402, desc: "Unified geometric transformations across manifolds", icon: "📐", color: "#2979FF" },
  { name: "advanced_tools.py", lines: 356, desc: "Advanced mathematical utilities and transforms", icon: "🔧", color: "#F5A623" },
  { name: "main.py", lines: 209, desc: "CLI orchestration and entry point", icon: "⚙️", color: "#6b7280" },
  { name: "numbers.py", lines: 120, desc: "Number theory foundations", icon: "🔢", color: "#34d399" },
  { name: "proofs.py", lines: 86, desc: "Automated proof assistance", icon: "✅", color: "#00D4FF" },
  { name: "fractals.py", lines: 51, desc: "Julia and Mandelbrot fractal generation", icon: "🌀", color: "#FF1D6C" },
  { name: "dimensions.py", lines: 41, desc: "Multi-dimensional analysis", icon: "🌌", color: "#7c3aed" },
  { name: "sinewave.py", lines: 0, desc: "Sine wave mathematics and signal analysis", icon: "〰️", color: "#ef4444" },
  { name: "operators.py", lines: 0, desc: "Mathematical operators and compositions", icon: "➕", color: "#f97316" },
];

const LAB_MODULES = [
  { name: "unified_geometry_engine.py", lines: 492, desc: "Full geometry computation engine", icon: "🔮", color: "#2979FF" },
  { name: "amundson_equations.py", lines: 284, desc: "Custom equation systems by Alexa Amundson", icon: "📝", color: "#FF1D6C" },
  { name: "iterative_math_build.py", lines: 198, desc: "Iterative mathematical construction", icon: "🏗️", color: "#F5A623" },
  { name: "trinary_logic.py", lines: 111, desc: "Three-valued logic system (TRUE, FALSE, UNKNOWN)", icon: "3️⃣", color: "#9C27B0" },
  { name: "prime_explorer.py", lines: 108, desc: "Ulam spiral, prime patterns, visualizations", icon: "🔍", color: "#34d399" },
  { name: "quantum_finance.py", lines: 83, desc: "Quantum-inspired financial portfolio optimization", icon: "💹", color: "#00D4FF" },
  { name: "recursion_sandbox.py", lines: 0, desc: "Recursive function experiments", icon: "🔄", color: "#ef4444" },
  { name: "sine_wave_codex.py", lines: 0, desc: "Advanced sine wave analysis", icon: "📊", color: "#7c3aed" },
  { name: "frameworks.py", lines: 80, desc: "Mathematical framework abstractions (NumPy/SymPy)", icon: "📦", color: "#6b7280" },
];

const CONCEPTS = [
  {
    title: "Consciousness Modeling",
    icon: "🧠",
    color: "#9C27B0",
    desc: "Mathematical model of consciousness as an emergent property. Computes emergence patterns from neural network-like state transitions.",
    module: "forge/consciousness.py",
  },
  {
    title: "Unified Geometry",
    icon: "📐",
    color: "#2979FF",
    desc: "Geometric transformations unified across Euclidean, hyperbolic, and spherical spaces. Apply transformations to arbitrary manifolds.",
    module: "forge/unified_geometry.py + lab/unified_geometry_engine.py",
  },
  {
    title: "Trinary Logic",
    icon: "3️⃣",
    color: "#9C27B0",
    desc: "Beyond true/false — a three-valued logic system with TRUE, FALSE, and UNKNOWN. Handles uncertainty mathematically.",
    code: `from lab.trinary_logic import TRUE, FALSE, UNKNOWN

a = TRUE
b = UNKNOWN
c = a.and_(b)  # → UNKNOWN
d = a.or_(b)   # → TRUE`,
  },
  {
    title: "Prime Exploration",
    icon: "🔍",
    color: "#34d399",
    desc: "Ulam spiral generation, prime pattern detection, and visualization. Uses SymPy for primality testing and NumPy for grid computation.",
    code: `primes = prime_explorer.explore_range(1, 10000)
grid, mask = ulam_spiral(100)
# mask reveals the mysterious diagonal
# patterns in prime distribution`,
  },
  {
    title: "Quantum Finance",
    icon: "💹",
    color: "#00D4FF",
    desc: "Quantum-inspired portfolio optimization. Uses superposition principles to explore asset allocation spaces exponentially faster.",
    code: `model = quantum_finance.QuantumPortfolio(assets)
optimal = model.optimize()`,
  },
  {
    title: "Fractal Generation",
    icon: "🌀",
    color: "#FF1D6C",
    desc: "Julia and Mandelbrot set generation. Iterate z² + c in the complex plane, coloring pixels by escape velocity.",
    code: `from forge.fractals import generate_fractal, julia_rule
generate_fractal(julia_rule, "julia.png",
  iterations=50, resolution=300)`,
  },
];

export default function MathPage() {
  const totalForgeLines = FORGE_MODULES.reduce((s, m) => s + m.lines, 0);
  const totalLabLines = LAB_MODULES.reduce((s, m) => s + m.lines, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2979FF]/5 to-transparent rounded-3xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Lucidia Math</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-2">
            Consciousness modeling, unified geometry, quantum finance, prime exploration.
          </p>
          <p className="text-sm text-gray-500">
            {FORGE_MODULES.length + LAB_MODULES.length} modules. {totalForgeLines + totalLabLines}+ lines. Two engines.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <a href="https://github.com/BlackRoad-OS/lucidia-math" target="_blank" rel="noopener"
              className="px-6 py-3 bg-gradient-to-r from-[#2979FF] to-[#9C27B0] rounded-xl text-white font-semibold hover:opacity-90 transition-all">
              View Source
            </a>
            <Link href="/repos/lucidia-math"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
              Repo Details
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Forge Modules</div>
          <div className="text-2xl font-bold text-[#FF1D6C] mt-1">{FORGE_MODULES.length}</div>
          <div className="text-xs text-gray-600">{totalForgeLines} lines</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Lab Modules</div>
          <div className="text-2xl font-bold text-[#2979FF] mt-1">{LAB_MODULES.length}</div>
          <div className="text-xs text-gray-600">{totalLabLines} lines</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Math Domains</div>
          <div className="text-2xl font-bold text-[#9C27B0] mt-1">6</div>
          <div className="text-xs text-gray-600">research areas</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-xs text-gray-500">Dependencies</div>
          <div className="text-2xl font-bold text-[#34d399] mt-1">3</div>
          <div className="text-xs text-gray-600">numpy, sympy, matplotlib</div>
        </div>
      </section>

      {/* Key concepts */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Key Concepts</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {CONCEPTS.map((c) => (
            <div key={c.title} className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{c.icon}</span>
                <h3 className="text-sm font-semibold text-white">{c.title}</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{c.desc}</p>
              {c.code && (
                <pre className="text-xs font-mono text-gray-300 bg-black/30 rounded-lg p-3 overflow-x-auto">{c.code}</pre>
              )}
              {c.module && (
                <div className="text-xs font-mono text-gray-600 mt-2">{c.module}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Forge */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Forge — Mathematical Foundations</h2>
        <p className="text-xs text-gray-600 mb-4">Core mathematical engines and proof systems</p>
        <div className="space-y-1.5">
          {FORGE_MODULES.map((m) => (
            <a key={m.name} href={`https://github.com/BlackRoad-OS/lucidia-math/blob/main/forge/${m.name}`} target="_blank" rel="noopener"
              className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
              <span className="text-base">{m.icon}</span>
              <span className="text-sm font-mono text-white group-hover:text-[#FF1D6C] transition-colors">{m.name}</span>
              {m.lines > 0 && <span className="text-xs text-gray-600">{m.lines} lines</span>}
              <span className="text-xs text-gray-500 ml-auto truncate max-w-xs">{m.desc}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Lab */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Lab — Experimental Mathematics</h2>
        <p className="text-xs text-gray-600 mb-4">Cutting-edge research and experimental algorithms</p>
        <div className="space-y-1.5">
          {LAB_MODULES.map((m) => (
            <a key={m.name} href={`https://github.com/BlackRoad-OS/lucidia-math/blob/main/lab/${m.name}`} target="_blank" rel="noopener"
              className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group">
              <span className="text-base">{m.icon}</span>
              <span className="text-sm font-mono text-white group-hover:text-[#2979FF] transition-colors">{m.name}</span>
              {m.lines > 0 && <span className="text-xs text-gray-600">{m.lines} lines</span>}
              <span className="text-xs text-gray-500 ml-auto truncate max-w-xs">{m.desc}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Quick start */}
      <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
        <h2 className="text-sm font-semibold text-white mb-4">Quick Start</h2>
        <pre className="text-sm font-mono text-gray-300 leading-relaxed overflow-x-auto">{`pip install lucidia-math

from forge import consciousness, unified_geometry
from lab import prime_explorer, quantum_finance

# Consciousness modeling
state = consciousness.ConsciousnessState()
emergence = state.compute_emergence_pattern()

# Prime exploration with Ulam spiral
grid, mask = prime_explorer.ulam_spiral(100)

# Quantum portfolio optimization
model = quantum_finance.QuantumPortfolio(assets)
optimal = model.optimize()`}</pre>
      </section>
    </div>
  );
}
