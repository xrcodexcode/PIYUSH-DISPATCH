const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(process.cwd(), 'content', 'issues');
const publicDir = path.join(process.cwd(), 'public');

const files = fs.readdirSync(contentDir);
let missingAssets = 0;
let checkedImages = 0;
const issueSlugs = new Set();
const allTopics = new Set();

for (const file of files) {
  if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
  const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const { data, content } = matter(raw);
  
  const id = file.replace(/\.mdx?$/, '');
  const slug = data.slug || id;
  issueSlugs.add(slug);
  issueSlugs.add(id);

  if (data.heroImage) {
    checkedImages++;
    const cleanHero = data.heroImage.split('?')[0].split('#')[0];
    const diskPath = path.join(publicDir, cleanHero.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      console.error(`[ERROR] Missing hero image in ${file}: ${cleanHero}`);
      missingAssets++;
    }
  }

  if (Array.isArray(data.topics)) {
    data.topics.forEach(t => allTopics.add(t));
  }

  // Find all /assets/... references in content
  const matches = content.match(/\/assets\/[a-zA-Z0-9_\-\.\/]+/g) || [];
  for (const assetPath of matches) {
    checkedImages++;
    const cleanPath = assetPath.replace(/[\)"'\s]+$/, '');
    const diskPath = path.join(publicDir, cleanPath.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
      console.error(`[ERROR] Missing inline asset in ${file}: ${cleanPath}`);
      missingAssets++;
    }
  }
}

console.log(`\n--- ASSET AUDIT SUMMARY ---`);
console.log(`Checked Images: ${checkedImages}`);
console.log(`Missing Assets: ${missingAssets}`);
console.log(`Total Issues: ${issueSlugs.size}`);

if (missingAssets === 0) {
  console.log('>>> ALL IMAGE ASSETS RESOLVE CLEANLY (100% HEALTHY) <<<\n');
} else {
  console.error(`>>> FAILED: ${missingAssets} MISSING ASSETS FOUND <<<\n`);
  process.exit(1);
}
