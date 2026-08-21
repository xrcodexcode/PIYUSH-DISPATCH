const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const assets = getFiles('public/assets');
console.log(`=== ASSET FILES TOTAL: ${assets.length} ===`);
assets.forEach(f => console.log('ASSET:', f.replace(/\\/g, '/')));

const issues = getFiles('content/issues');
console.log(`\n=== MDX FILES TOTAL: ${issues.length} ===`);
const referencedImages = new Set();

issues.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const heroMatch = content.match(/heroImage:\s*["']?([^"\r\n]+)["']?/);
  const inlineMatches = [];
  const regex = /!\[(.*?)\]\((.*?)\)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    inlineMatches.push({ alt: m[1], url: m[2] });
    referencedImages.add(m[2]);
  }
  if (heroMatch) {
    referencedImages.add(heroMatch[1]);
  }
  console.log(`\nMDX: ${path.basename(f)}`);
  console.log(`  Hero: ${heroMatch ? heroMatch[1] : 'NONE'}`);
  console.log(`  Inline Count: ${inlineMatches.length}`);
  inlineMatches.forEach(img => console.log(`    - [${img.alt}] -> ${img.url}`));
});

console.log(`\n=== TOTAL DISTINCT REFERENCED IMAGES: ${referencedImages.size} ===`);
Array.from(referencedImages).sort().forEach(url => console.log('REF:', url));
