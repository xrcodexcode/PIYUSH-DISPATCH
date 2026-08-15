export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'agentic-ai' | 'context-engineering' | 'rag-search' | 'neural-memory';
  shortDefinition: string;
  extendedExplanation: string;
  relatedTopic: string;
}

export const GLOSSARY_TERMS: Record<string, GlossaryTerm> = {
  rag: {
    id: 'rag',
    term: 'RAG (Retrieval-Augmented Generation)',
    category: 'rag-search',
    shortDefinition: 'Augmenting LLM prompts with relevant external documents fetched at query time.',
    extendedExplanation: 'Rather than retraining models on new data, RAG retrieves precise text chunks from vector indices or databases and injects them into the prompt window before generation.',
    relatedTopic: 'rag',
  },
  'context-engineering': {
    id: 'context-engineering',
    term: 'Context Engineering',
    category: 'context-engineering',
    shortDefinition: 'The discipline of designing the complete information environment and tool harness for AI models.',
    extendedExplanation: 'Beyond raw prompt wording, context engineering structures token budgets, system directives, dynamic retrieval, tool schemas, and memory states for deterministic model output.',
    relatedTopic: 'context-engineering',
  },
  'agentic-loop': {
    id: 'agentic-loop',
    term: 'Agentic Loop',
    category: 'agentic-ai',
    shortDefinition: 'An iterative loop where an AI observes output, reasons, calls tools, and self-corrects until a goal is met.',
    extendedExplanation: 'Unlike single-turn prompt-response systems, agentic loops allow autonomous problem decomposition, error catching, and continuous execution across multiple tool cycles.',
    relatedTopic: 'agentic-ai',
  },
  graphrag: {
    id: 'graphrag',
    term: 'GraphRAG',
    category: 'rag-search',
    shortDefinition: 'Knowledge graph-enhanced retrieval combining structured entity relations with vector search.',
    extendedExplanation: 'GraphRAG extracts entities, claims, and relationships into a connected graph, enabling multi-hop reasoning and high-level conceptual summarization that vector search alone misses.',
    relatedTopic: 'graphrag',
  },
  mcp: {
    id: 'mcp',
    term: 'MCP (Model Context Protocol)',
    category: 'agentic-ai',
    shortDefinition: 'An open protocol standardizing how AI applications securely connect to data sources and developer tools.',
    extendedExplanation: 'Created by Anthropic, MCP acts as a universal adapter between AI models and local or remote systems (filesystems, databases, APIs, code repositories).',
    relatedTopic: 'ai-tools',
  },
  'agent-memory': {
    id: 'agent-memory',
    term: 'Agent Memory',
    category: 'neural-memory',
    shortDefinition: 'The layered storage architecture (working, episodic, and semantic) enabling continuous learning for agents.',
    extendedExplanation: 'Memory architectures allow AI agents to maintain state across sessions, record feedback, build procedural knowledge, and personalize interactions over time.',
    relatedTopic: 'agent-memory',
  },
  'harness-engineering': {
    id: 'harness-engineering',
    term: 'Harness Engineering',
    category: 'context-engineering',
    shortDefinition: 'The infrastructure, validation sandbox, and execution environment wrapping an AI model.',
    extendedExplanation: 'The prompt is merely an ingredient; the harness provides tool execution, state isolation, output validation, and fallback handlers.',
    relatedTopic: 'context-engineering',
  },
  'vector-embedding': {
    id: 'vector-embedding',
    term: 'Vector Embedding',
    category: 'rag-search',
    shortDefinition: 'High-dimensional numerical representations of text capturing semantic meaning and proximity.',
    extendedExplanation: 'Embeddings map words, paragraphs, and concepts into vector space where cosine distance reflects conceptual similarity.',
    relatedTopic: 'rag',
  },
};

export function getGlossaryTerm(key: string): GlossaryTerm | null {
  const clean = key.toLowerCase().trim();
  return GLOSSARY_TERMS[clean] || null;
}
