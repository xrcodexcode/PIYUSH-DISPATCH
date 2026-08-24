export interface SeriesTrack {
  id: string;
  title: string;
  badge: string;
  description: string;
  issueSlugs: string[];
}

export const SERIES_TRACKS: SeriesTrack[] = [
  {
    id: 'agentic-ai-engineering',
    title: 'The Agentic AI Engineering Series',
    badge: '5-Part Masterclass',
    description: 'From self-correcting execution loops and graph workflows to autonomous cron agents and long-term neural memory.',
    issueSlugs: [
      '007-loop-engineering-what-makes-ai-agents-improve-themselves',
      '008-graph-engineering-beyond-single-ai-loops',
      '009-ai-agents-101',
      '010-agent-memory',
      '011-cron-jobs-how-to-make-ai-agents-work-while-you-sleep',
    ],
  },
  {
    id: 'context-engineering-fundamentals',
    title: 'Prompt to Context Engineering',
    badge: '4-Part Track',
    description: 'Why prompt engineering evolved into context architectures, RAG systems, and tool harness design.',
    issueSlugs: [
      '003-prompt-engineering-isnt-dead-its-evolving',
      '004-rag-isnt-dead-most-people-just-dont-understand-it',
      '005-better-input-better-output-thats-context-engineering',
      '006-the-prompt-is-just-one-ingredient-the-harness-is-the-kitchen',
    ],
  },
  {
    id: 'personal-intelligence-systems',
    title: 'Personal Intelligence & Knowledge Systems',
    badge: 'Deep Node Series',
    description: 'Designing an AI that doesn’t just answer questions, but builds a lifelong, editable model of your work.',
    issueSlugs: [
      'the-personal-ai',
      'agent-skills-and-hooks',
      'how-ai-agents-actually-work',
      'how-vector-databases-actually-work',
      'embeddings-turning-meaning-into-mathematics',
    ],
  },
];

export function getSeriesForIssue(slug: string): {
  series: SeriesTrack;
  currentIndex: number;
  total: number;
  prevSlug: string | null;
  nextSlug: string | null;
} | null {
  const clean = slug.toLowerCase().trim();

  for (const series of SERIES_TRACKS) {
    const idx = series.issueSlugs.findIndex(
      (s) => s.toLowerCase() === clean || s.toLowerCase().replace(/^\d+-/, '') === clean.replace(/^\d+-/, '')
    );
    if (idx !== -1) {
      return {
        series,
        currentIndex: idx,
        total: series.issueSlugs.length,
        prevSlug: idx > 0 ? series.issueSlugs[idx - 1] : null,
        nextSlug: idx < series.issueSlugs.length - 1 ? series.issueSlugs[idx + 1] : null,
      };
    }
  }

  return null;
}
