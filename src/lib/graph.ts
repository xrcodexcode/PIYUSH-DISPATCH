import { Issue, IssueSummary } from '@/types';
import { sanitizeSlug } from './security';

export interface GraphNode {
  slug: string;
  title: string;
  issueNumber: number;
  nodeType: string;
  topics: string[];
}

export interface GraphLink {
  source: string;
  target: string;
  relationship: 'series' | 'topic-cluster' | 'related';
  label: string;
}

export interface IssueGraphData {
  currentNode: GraphNode;
  connectedNodes: GraphNode[];
  links: GraphLink[];
  sharedTopicCount: number;
}

export function buildIssueGraph(currentIssue: Issue | IssueSummary, allIssues: (Issue | IssueSummary)[]): IssueGraphData {
  const currentSlug = sanitizeSlug(currentIssue.slug);
  const currentTopics = new Set((currentIssue.topics || []).map(t => t.toLowerCase()));

  const currentNode: GraphNode = {
    slug: currentSlug,
    title: currentIssue.title,
    issueNumber: currentIssue.issueNumber,
    nodeType: currentIssue.nodeType || 'daily-node',
    topics: currentIssue.topics || [],
  };

  const connectedNodesMap = new Map<string, { node: GraphNode; score: number; relationship: 'series' | 'topic-cluster' | 'related'; label: string }>();

  for (const other of allIssues) {
    const otherSlug = sanitizeSlug(other.slug);
    if (otherSlug === currentSlug) continue;

    const otherTopics = (other.topics || []).map(t => t.toLowerCase());
    const commonTopics = otherTopics.filter(t => currentTopics.has(t));

    // Calculate connection strength
    let score = 0;
    let relationship: 'series' | 'topic-cluster' | 'related' = 'related';
    let label = 'Related Briefing';

    if (commonTopics.length > 0) {
      score += commonTopics.length * 2;
      relationship = 'topic-cluster';
      label = `Shared #${commonTopics[0]}`;
    }

    // Number proximity (adjacent issues in chronological flow)
    const diff = Math.abs(currentIssue.issueNumber - other.issueNumber);
    if (diff === 1) {
      score += 3;
      relationship = 'series';
      label = diff === 1 ? 'Adjacent Dispatch' : label;
    }

    if (score > 0) {
      connectedNodesMap.set(otherSlug, {
        node: {
          slug: otherSlug,
          title: other.title,
          issueNumber: other.issueNumber,
          nodeType: other.nodeType || 'daily-node',
          topics: other.topics || [],
        },
        score,
        relationship,
        label,
      });
    }
  }

  // Sort by connection strength and take top 5 most relevant connected nodes
  const sortedConnections = Array.from(connectedNodesMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const connectedNodes = sortedConnections.map(c => c.node);
  const links: GraphLink[] = sortedConnections.map(c => ({
    source: currentSlug,
    target: c.node.slug,
    relationship: c.relationship,
    label: c.label,
  }));

  return {
    currentNode,
    connectedNodes,
    links,
    sharedTopicCount: currentTopics.size,
  };
}
