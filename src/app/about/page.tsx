import type { Metadata } from 'next';
import SubscribeForm from '@/components/SubscribeForm';

export const metadata: Metadata = {
  title: "About — PIYUSH'S DISPATCH",
  description: "A public learning journal about AI, software, and the ideas behind the technology by Piyush Pal.",
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 md:py-20 min-h-screen">
      {/* Header Section */}
      <header className="mb-16 border-b border-[var(--border-color)] pb-12 text-center max-w-4xl mx-auto">
        <div className="inline-block mb-4 px-3.5 py-1 border border-[var(--border-color)] bg-[var(--surface)] rounded-full text-xs font-mono text-[var(--accent)] uppercase font-semibold">
          About The Publication &amp; Author
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight mb-6">
          PIYUSH&apos;S DISPATCH
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed font-semibold mb-4">
          A public learning journal about AI, software, and the ideas behind the technology.
        </p>
        <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl mx-auto">
          Written by <strong>Piyush Pal</strong>. Documenting the process of studying technical concepts, building systems, and turning information into understanding.
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

      {/* Main Content Sections */}
      <div className="max-w-[760px] mx-auto space-y-16 text-lg leading-relaxed text-[var(--text-primary)]">
        
        {/* WHO I AM */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            <span>01</span>
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>The Author</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Who I Am
          </h2>
          <p>
            I&apos;m <strong>Piyush Pal</strong>, a BCA (Hons.) student specializing in AI/ML, with a strong interest in software engineering and full-stack development.
          </p>
          <p>
            I&apos;m still learning. I don&apos;t write as a senior engineer, researcher, founder, or industry expert. I&apos;m simply someone who enjoys going deep into difficult technical subjects, building things, asking questions, and figuring out how they actually work.
          </p>
          <p className="text-[var(--text-secondary)] font-medium">
            That process is what this publication is about.
          </p>
        </section>

        {/* WHY I WRITE */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            <span>02</span>
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>Process &amp; Purpose</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Why I Write
          </h2>
          <p>
            Technology moves incredibly fast. New models, frameworks, agents, products, and buzzwords appear almost every day.
          </p>
          <p>
            It&apos;s easy to consume information without really understanding it.
          </p>
          <p>
            So when I explore something, I try to go beyond the headline:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent)] font-bold">01</span>
              <span className="font-semibold text-sm text-[var(--text-primary)]">What happened?</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent)] font-bold">02</span>
              <span className="font-semibold text-sm text-[var(--text-primary)]">How does it actually work?</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent)] font-bold">03</span>
              <span className="font-semibold text-sm text-[var(--text-primary)]">Why does it matter?</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent)] font-bold">04</span>
              <span className="font-semibold text-sm text-[var(--text-primary)]">What&apos;s underneath the hype?</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent)] font-bold">05</span>
              <span className="font-semibold text-sm text-[var(--text-primary)]">What can we learn from it?</span>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent)] font-bold">06</span>
              <span className="font-semibold text-sm text-[var(--text-primary)]">What might happen next?</span>
            </div>
          </div>
          <p>
            Writing helps me answer those questions. If I can&apos;t explain an idea clearly, I probably haven&apos;t understood it deeply enough.
          </p>
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] text-center">
            <p className="font-serif text-xl font-bold text-[var(--accent)]">
              The Dispatch is where information becomes understanding.
            </p>
          </div>
        </section>

        {/* LEARNING IN PUBLIC */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            <span>03</span>
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>Perspective</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Learning in Public
          </h2>
          <p>
            Piyush&apos;s Dispatch is my way of <strong>learning in public</strong>.
          </p>
          <p>
            It documents the process of studying technical concepts, reading research, experimenting with software, building systems, connecting ideas, and turning what I learn into explanations.
          </p>
          <blockquote className="my-4 pl-6 border-l-4 border-[var(--accent)] font-serif text-lg md:text-xl text-[var(--text-primary)] bg-[var(--surface)] p-6 rounded-r-2xl shadow-xs space-y-2">
            <p className="italic text-[var(--text-secondary)]">
              I&apos;m not trying to appear like someone who already knows everything.
            </p>
            <p className="font-bold text-[var(--text-primary)] not-italic">
              I&apos;m trying to become someone who understands a little more every day.
            </p>
          </blockquote>
        </section>

        {/* WHAT I'M EXPLORING */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            <span>04</span>
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>Focus Areas</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            What I&apos;m Exploring
          </h2>
          <p>
            My curiosity currently takes me across:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              "Artificial Intelligence & Machine Learning",
              "LLMs & Generative AI",
              "Agentic AI, agents & tool use",
              "Context engineering",
              "RAG & knowledge systems",
              "AI memory & graph-based systems",
              "Software architecture",
              "Developer tools & automation",
              "Cloud & modern infrastructure",
              "Startups & technology businesses",
              "First-principles thinking"
            ].map((topic) => (
              <div 
                key={topic}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-sm font-medium text-[var(--text-primary)]"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
          <p className="text-sm font-mono text-[var(--text-secondary)] italic">
            The list will change. That&apos;s part of the point.
          </p>
        </section>

        {/* HOW I APPROACH TECHNOLOGY */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            <span>05</span>
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>Methodology</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            How I Approach Technology
          </h2>
          <p className="text-xl font-semibold text-[var(--text-primary)]">
            I care more about <strong className="text-[var(--accent)]">mechanisms than hype</strong>.
          </p>
          <p>
            I prefer first principles over buzzwords, primary sources over recycled summaries, mental models over memorization, and technical context over headlines.
          </p>
          <p>
            When a new framework or model appears, I&apos;m interested in more than <em>what it can do</em>. I want to understand the ideas underneath it—and whether those ideas will still matter when the next framework arrives.
          </p>
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg)] font-mono text-sm space-y-2">
            <p className="text-[var(--text-secondary)]">Because technologies change quickly.</p>
            <p className="text-[var(--accent)] font-bold text-base pt-2 border-t border-[var(--border-color)]">
              Fundamentals compound.
            </p>
          </div>
        </section>

        {/* WHO THIS IS FOR */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            <span>06</span>
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>Audience</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            Who This Is For
          </h2>
          <p>
            Piyush&apos;s Dispatch is for students, developers, builders, AI/ML learners, engineers, founders, researchers, and anyone who is simply curious about how technology works.
          </p>
          <p>
            You don&apos;t need to be an expert.
          </p>
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] space-y-2">
            <p className="font-serif italic text-lg text-[var(--text-primary)]">
              &quot;I understand what this does, but how does it actually work?&quot;
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              If you&apos;ve ever looked at a technical idea and thought that—you&apos;re probably in the right place.
            </p>
          </div>
        </section>

        {/* THE PHILOSOPHY */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            <span>07</span>
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>Core Belief</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
            The Philosophy
          </h2>
          <p>
            I maintain a personal knowledge system called <strong>xr-nodes</strong>, built around a simple idea: knowledge becomes more useful when ideas are connected rather than stored in isolation.
          </p>
          <p>
            The Dispatch is the public expression of that philosophy:
          </p>
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] text-sm font-mono text-[var(--accent)] font-semibold text-center overflow-x-auto">
            Learn &rarr; Research &rarr; Connect &rarr; Build mental models &rarr; Explain &rarr; Publish
          </div>
          <p>
            The goal isn&apos;t to collect everything.
          </p>
          <p className="font-semibold text-[var(--text-primary)]">
            It&apos;s to understand what matters—and keep building on it.
          </p>
        </section>

        {/* SUBSCRIBE */}
        <section className="pt-12 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider mb-6 justify-center">
            <span>08</span>
            <span className="w-8 h-px bg-[var(--accent)]" />
            <span>Join The Journey</span>
          </div>
          <div className="p-8 md:p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--surface)] text-center shadow-md">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
              Subscribe
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 text-base max-w-lg mx-auto leading-relaxed">
              If you&apos;re interested in learning how technology works beneath the surface, follow along.
            </p>
            <p className="text-sm font-mono text-[var(--text-secondary)] mb-2">
              I&apos;m still figuring things out.
            </p>
            <p className="font-serif text-xl font-bold text-[var(--accent)] mb-8">
              That&apos;s exactly why I&apos;m writing.
            </p>
            <SubscribeForm variant="inline" />
          </div>
        </section>

      </div>
    </main>
  );
}
