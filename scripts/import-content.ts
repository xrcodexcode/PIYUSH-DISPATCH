import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface IngestOptions {
  sourceDir: string;
  outputDir: string;
}

/**
 * Convert string into clean URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Generate 1-2 sentence excerpt from body
 */
function generateExcerpt(content: string, maxLength: number = 160): string {
  const text = content
    .replace(/#+\s+.+/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/>\s+/g, '')
    .replace(/---/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  const cut = text.substring(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.substring(0, lastSpace) : cut) + '...';
}

/**
 * Ingests external markdown/note files into the newsletter content model (.mdx)
 */
export async function importNewsletterIssues(options: IngestOptions) {
  const { sourceDir, outputDir } = options;

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory does not exist: ${sourceDir}`);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  console.log(`Found ${files.length} candidate files in ${sourceDir}...`);

  let count = 0;
  // Get current highest issue number in output dir
  const existingFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.mdx'));
  let maxIssueNum = 0;

  for (const file of existingFiles) {
    try {
      const raw = fs.readFileSync(path.join(outputDir, file), 'utf8');
      const { data } = matter(raw);
      if (data.issueNumber && typeof data.issueNumber === 'number') {
        maxIssueNum = Math.max(maxIssueNum, data.issueNumber);
      }
    } catch {
      // ignore
    }
  }

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content: body } = matter(rawContent);

    // Extract title from frontmatter or first H1 header
    let title = frontmatter.title;
    if (!title) {
      const h1Match = body.match(/^#\s+(.+)$/m);
      title = h1Match ? h1Match[1].trim() : file.replace(/\.mdx?$/, '');
    }

    const slug = frontmatter.slug || slugify(title);
    const date = frontmatter.date || new Date().toISOString().split('T')[0];
    maxIssueNum++;

    const issueNumber = frontmatter.issueNumber || maxIssueNum;
    const subtitle = frontmatter.subtitle || frontmatter.aliases?.[0] || '';
    const excerpt = frontmatter.excerpt || generateExcerpt(body);
    const topics = frontmatter.topics || (frontmatter.domain ? [frontmatter.domain] : ['Technology']);
    const tags = frontmatter.tags || [];
    const sources = frontmatter.sources || [];
    const heroImage = frontmatter.heroImage || '/images/issues/placeholder.svg';

    const normalizedData = {
      issueNumber,
      date,
      title,
      subtitle,
      excerpt,
      heroImage,
      topics,
      tags,
      sources,
      relatedIssues: frontmatter.relatedIssues || [],
      published: true,
    };

    const newMdxContent = matter.stringify(body, normalizedData);
    const safeSlug = slugify(slug);
    const targetPath = path.join(outputDir, `${safeSlug}.mdx`);

    fs.writeFileSync(targetPath, newMdxContent, 'utf8');
    console.log(`Successfully imported: Issue #${issueNumber} -> ${safeSlug}.mdx`);
    count++;

  }

  console.log(`\nImport complete! Processed ${count} issues into ${outputDir}`);
}

// CLI direct execution entrypoint
if (require.main === module) {
  const args = process.argv.slice(2);
  const sourceDir = args[0] || path.join(process.cwd(), 'import-inbox');
  const outputDir = path.join(process.cwd(), 'content', 'issues');

  console.log(`Starting newsletter content importer...`);
  importNewsletterIssues({ sourceDir, outputDir }).catch(err => {
    console.error('Import failed:', err);
  });
}
