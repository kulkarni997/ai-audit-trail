import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

function RevealSection({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const features = [
  {
    title: 'Multi-hop accountability',
    desc: 'Trace any data resource back through the action, the agent, and the human who authorized it — a 4-hop chain that stays a single readable query.',
  },
  {
    title: 'Policy violation detection',
    desc: 'Every action is checked against compliance policy. Violations surface immediately, with full context on what happened and why it matters.',
  },
  {
    title: 'Shared-exposure analysis',
    desc: 'Find agents that touched the same data as a known violator — even if they never broke a rule themselves. A relational join would groan; a graph traversal just answers.',
  },
]

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-paper">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(600px circle at 50% 30%, rgba(79,191,139,0.08), transparent 70%)',
          }}
        />

        <p
          className="font-mono text-xs uppercase tracking-[0.3em] text-slate-muted opacity-0"
          style={{ animation: 'fadeUp 0.8s ease-out 0.1s forwards' }}
        >
          AI Agent Governance
        </p>

        <h1
          className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-paper opacity-0 md:text-6xl"
          style={{ animation: 'fadeUp 0.8s ease-out 0.3s forwards' }}
        >
          Accountability is a chain,
          <br /> not a table.
        </h1>

        <p
          className="mt-6 max-w-xl text-lg text-slate-muted opacity-0"
          style={{ animation: 'fadeUp 0.8s ease-out 0.5s forwards' }}
        >
          WEXA Audit traces every action an AI agent takes back to the human who
          authorized it — built on a graph database, because accountability was
          never a row in a table.
        </p>

        <div
          className="mt-10 flex gap-3 opacity-0"
          style={{ animation: 'fadeUp 0.8s ease-out 0.7s forwards' }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:opacity-90"
          >
            Enter Dashboard →
          </button>
          <a
            href="#why-graph"
            className="rounded-full border border-hairline px-6 py-3 text-sm font-medium text-paper transition hover:border-slate-muted"
          >
            Why a graph database?
          </a>
        </div>

        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0"
          style={{ animation: 'fadeUp 0.8s ease-out 1s forwards' }}
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="#888888" strokeWidth="1.4" />
            <circle cx="8" cy="7" r="1.6" fill="#888888" />
          </svg>
        </div>
      </section>

      {/* Why graph section */}
      <section id="why-graph" className="mx-auto max-w-3xl px-6 py-32">
        <RevealSection>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-muted">
            Why a graph database
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-paper md:text-4xl">
            Governance questions are path questions.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-muted">
            "Who is accountable for this action?" isn't a lookup — it's a walk:
            from a piece of data, back through the action that touched it, to the
            agent that executed it, to the human who authorized that agent. In a
            relational database that's a chain of joins that gets slower and uglier
            with every added hop. In a graph, it's the natural shape of the data —
            one readable traversal, regardless of how deep the chain runs.
          </p>
        </RevealSection>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <RevealSection key={f.title} delay={i * 120}>
              <div className="h-full rounded-lg border border-hairline bg-ink-raised p-6">
                <p className="font-mono text-xs text-slate-muted">0{i + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-paper">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-muted">{f.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-hairline px-6 py-24 text-center">
        <RevealSection>
          <h2 className="text-2xl font-semibold text-paper md:text-3xl">
            Every action, traceable. Every agent, accountable.
          </h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-8 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:opacity-90"
          >
            Enter Dashboard →
          </button>
        </RevealSection>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Landing
