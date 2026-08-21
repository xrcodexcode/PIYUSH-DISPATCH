import type { Metadata } from 'next';
import SubscribeForm from '@/components/SubscribeForm';

export const metadata: Metadata = {
  title: "About — PIYUSH'S DISPATCH",
  description: "A daily technical briefing on AI, software systems, and the ideas reshaping technology.",
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20 min-h-screen">
      <header className="mb-16 border-b border-[var(--border-color)] pb-12 text-center max-w-4xl mx-auto">
        <div className="inline-block mb-4 px-3.5 py-1 border border-[var(--border-color)] bg-[var(--surface)] rounded-full text-xs font-mono text-[var(--accent)] uppercase font-semibold">
          Editorial Manifesto
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight mb-6">
          PIYUSH&apos;S DISPATCH
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed font-semibold mb-4">
          A daily technical briefing on AI, software systems, and the ideas reshaping technology.
        </p>
        <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl mx-auto">
          Written from first principles. Built for people who want to understand <strong>what is changing, why it matters, and what comes next.</strong>
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mt-8">
          <a 
            href="https://x.com/PiyushPal143104" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] text-xs font-mono font-medium text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
            <span>@PiyushPal143104</span>
          </a>

          <a 
            href="https://github.com/xrcodexcode" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] text-xs font-mono font-medium text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>@xrcodexcode</span>
          </a>

          <a 
            href="https://www.linkedin.com/in/xrcodex/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] text-xs font-mono font-medium text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span>in/xrcodex</span>
          </a>
        </div>
      </header>

      <div className="max-w-[760px] mx-auto space-y-16 text-lg leading-relaxed text-[var(--text-primary)]">
        {/* THE DISPATCH */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            THE DISPATCH
          </h2>
          <p>
            Technology moves faster than most people can meaningfully understand it.
          </p>
          <p>
            New models appear every week. New frameworks become trends overnight. New buzzwords promise to redefine software, intelligence, and business.
          </p>
          <p className="text-xl font-semibold text-[var(--text-primary)] bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-color)]">
            Piyush&apos;s Dispatch is a place to slow down.
          </p>
          <p>
            Each issue takes one important idea and goes beneath the surface — tracing it back to first principles, connecting it to the larger technical landscape, and turning complexity into useful mental models.
          </p>
          <ul className="space-y-2 font-mono text-sm text-[var(--text-secondary)] pl-4 border-l-2 border-[var(--border-color)]">
            <li>• No hype for the sake of hype.</li>
            <li>• No recycled headlines.</li>
            <li>• No shallow summaries.</li>
          </ul>
          <p className="text-xl font-bold text-[var(--accent)]">
            Just clear thinking about technology.
          </p>
        </section>

        {/* ABOUT THE AUTHOR */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            ABOUT PIYUSH
          </h2>
          <p>
            I am Piyush Pal, a 2nd year BCA Hons. AI/ML with Fullstack student, technical writer, and the mind behind <strong>Piyush&apos;s Dispatch</strong>. 
          </p>
          <p>
            My work is heavily focused on exploring the intersections of <strong>Agentic AI, System Architecture, and Graph Engineering</strong>. I started this publication as a way to untangle the hype surrounding emerging technologies and distill them down to their fundamental engineering principles.
          </p>
          <p>
            When I am not deep in coursework, code, or architecture research, I am writing here to help other engineers, founders, and curious minds build durable mental models that outlast the current tech cycle.
          </p>
        </section>

        {/* WHAT WE COVER */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            WHAT WE COVER
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] space-y-2">
              <h3 className="font-serif font-bold text-xl text-[var(--accent)]">Artificial Intelligence &amp; LLMs</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Agents, context engineering, RAG, memory, tool use, loop engineering, graph systems, model architectures, and the infrastructure emerging around intelligent software.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] space-y-2">
              <h3 className="font-serif font-bold text-xl text-[var(--accent)]">Software Engineering &amp; Systems</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Developer tools, cloud infrastructure, distributed systems, MLOps, system architecture, and the engineering principles behind scalable software.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] space-y-2">
              <h3 className="font-serif font-bold text-xl text-[var(--accent)]">Startups &amp; Business</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Unit economics, product strategy, founder decisions, product-market fit, competitive dynamics, and the economics shaping technology companies.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] space-y-2">
              <h3 className="font-serif font-bold text-xl text-[var(--accent)]">First-Principles Thinking</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Research papers, emerging technologies, industry shifts, hype cycles, and the underlying mechanisms that explain why things work.
              </p>
            </div>
          </div>
        </section>

        {/* THE EDITORIAL PHILOSOPHY */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            THE EDITORIAL PHILOSOPHY
          </h2>
          <blockquote className="my-6 pl-6 border-l-4 border-[var(--accent)] italic font-serif text-xl md:text-2xl text-[var(--text-primary)] bg-[var(--surface)] p-6 rounded-r-2xl shadow-xs">
            &quot;Every new AI buzzword is a new floor — not a demolition crew. Fundamentals compound over time.&quot;
          </blockquote>
          <p>
            The goal isn&apos;t to predict every trend.
          </p>
          <p>
            It&apos;s to develop the <strong>mental models that remain useful after the trend disappears.</strong>
          </p>
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] font-mono text-sm space-y-2">
            <p className="text-[var(--text-secondary)]">Because frameworks change.</p>
            <p className="text-[var(--text-secondary)]">Models change.</p>
            <p className="text-[var(--text-secondary)]">Markets change.</p>
            <p className="text-[var(--accent)] font-bold text-base pt-2 border-t border-[var(--border-color)]">Fundamentals compound.</p>
          </div>
        </section>

        {/* READING, NOT SCROLLING */}
        <section className="space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            READING, NOT SCROLLING
          </h2>
          <p>
            The web is optimized for consumption.
          </p>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            Piyush&apos;s Dispatch is optimized for understanding.
          </p>
          <p>
            Every article is designed around the reading experience:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[var(--text-primary)] font-medium">
            <li className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              <span>Long-form, distraction-free writing</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              <span>Carefully structured technical explanations</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              <span>Strong typography &amp; generous whitespace</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              <span>Dark, light &amp; paper-inspired reading themes</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              <span>Sources preserved alongside analysis</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              <span>No intrusive pop-ups</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              <span>No advertising clutter</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
              <span>Evergreen value long after publication</span>
            </li>
          </ul>
          <div className="pt-4 border-t border-[var(--border-color)] text-center">
            <p className="text-sm font-mono text-[var(--text-secondary)] mb-1">This isn&apos;t a feed.</p>
            <p className="font-serif text-xl font-bold text-[var(--accent)]">
              It&apos;s a technical library that grows one issue at a time.
            </p>
          </div>
        </section>

        {/* SUBSCRIBE TO THE DAILY BRIEFING */}
        <section className="pt-12 border-t border-[var(--border-color)]">
          <div className="p-8 md:p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] text-center shadow-md">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
              SUBSCRIBE TO THE DAILY BRIEFING
            </h2>
            <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-widest uppercase mb-4">
              One idea. One deep dive. Every day.
            </p>
            <p className="text-[var(--text-secondary)] mb-6 text-base max-w-md mx-auto leading-relaxed">
              Get <em>Piyush&apos;s Dispatch</em> delivered to your inbox — with original sources, technical context, and practical mental models preserved in every issue.
            </p>
            <p className="font-serif text-lg font-bold text-[var(--text-primary)] mb-8 italic">
              Read less noise. Understand more.
            </p>
            <SubscribeForm variant="inline" />
          </div>
        </section>
      </div>
    </main>
  );
}
