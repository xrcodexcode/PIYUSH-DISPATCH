const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const issuesDir = path.join(__dirname, '../content/issues');
const files = fs.readdirSync(issuesDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

let totalIssues = 0;
let errors = 0;

files.forEach(file => {
  totalIssues++;
  const fullPath = path.join(issuesDir, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  
  try {
    const { data, content } = matter(raw);
    
    // Check required frontmatter
    if (!data.title) console.error(`[${file}] Missing title`);
    if (!data.slug) console.error(`[${file}] Missing slug`);
    if (!data.date) console.error(`[${file}] Missing date`);
    if (!data.heroImage) console.error(`[${file}] Missing heroImage`);
    
    // Check unclosed code fences
    const fenceCount = (content.match(/```/g) || []).length;
    if (fenceCount % 2 !== 0) {
      console.error(`[${file}] Uneven code fences (count: ${fenceCount})`);
      errors++;
    }

    // Check marked rendering
    const html = marked.parse(content);
    if (!html || html.length === 0) {
      console.error(`[${file}] Empty rendered HTML output`);
      errors++;
    }
  } catch (err) {
    console.error(`[${file}] Parser error:`, err);
    errors++;
  }
});

console.log(`✓ Verified ${totalIssues} MDX dispatches. Errors found: ${errors}`);
if (errors > 0) process.exit(1);
