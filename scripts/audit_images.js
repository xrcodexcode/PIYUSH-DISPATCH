const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const issuesDir = path.join(rootDir, 'content', 'issues');
const publicDir = path.join(rootDir, 'public');
const assetsDir = path.join(publicDir, 'assets');

// 1. Scan issues
const issueFiles = fs.existsSync(issuesDir) ? fs.readdirSync(issuesDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md')) : [];

const referencedImages = new Map();

issueFiles.forEach(file => {
  const fullPath = path.join(issuesDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Frontmatter regex
  const frontmatterMatches = content.match(/^[-\s\w]+:\s*['"]?(\/assets\/[^'"\n\r]+)['"]?/gm);
  if (frontmatterMatches) {
    frontmatterMatches.forEach(m => {
      const match = m.match(/(\/assets\/[^\s'"]+)/);
      if (match) {
        const imgPath = match[1];
        if (!referencedImages.has(imgPath)) referencedImages.set(imgPath, []);
        referencedImages.get(imgPath).push({ file, type: 'frontmatter' });
      }
    });
  }

  // Markdown image regex ![alt](url)
  const mdImgRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = mdImgRegex.exec(content)) !== null) {
    const alt = match[1];
    const imgPath = match[2].trim();
    if (!referencedImages.has(imgPath)) referencedImages.set(imgPath, []);
    referencedImages.get(imgPath).push({ file, alt, type: 'inline' });
  }

  // HTML <img> tags
  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  while ((match = htmlImgRegex.exec(content)) !== null) {
    const imgPath = match[1].trim();
    if (!referencedImages.has(imgPath)) referencedImages.set(imgPath, []);
    referencedImages.get(imgPath).push({ file, type: 'html' });
  }
});

// Also scan src/ for any hardcoded image references
function scanDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      scanDir(p, fileList);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.json')) {
      fileList.push(p);
    }
  });
  return fileList;
}

const srcFiles = scanDir(path.join(rootDir, 'src'));
srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const assetRegex = /\/assets\/[a-zA-Z0-9_\-\.\/]+/g;
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    const imgPath = match[0];
    if (imgPath.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
      if (!referencedImages.has(imgPath)) referencedImages.set(imgPath, []);
      referencedImages.get(imgPath).push({ file: path.relative(rootDir, file), type: 'code' });
    }
  }
});

// 2. Scan all files in public/assets
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      getAllFiles(p, fileList);
    } else {
      fileList.push(p);
    }
  });
  return fileList;
}

const allAssetFiles = getAllFiles(assetsDir);

console.log('==================================================');
console.log(`TOTAL REFERENCED IMAGE PATHS IN MDX/SRC: ${referencedImages.size}`);
console.log(`TOTAL ASSET FILES ON DISK IN public/assets: ${allAssetFiles.length}`);
console.log('==================================================');

// Check missing references
const missing = [];
referencedImages.forEach((uses, imgPath) => {
  const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
  const diskPath = path.join(publicDir, cleanPath);
  if (!fs.existsSync(diskPath)) {
    missing.push({ imgPath, diskPath, uses });
  }
});

console.log(`MISSING REFERENCED ASSETS (${missing.length}):`);
missing.forEach(m => {
  console.log(`  MISSING: ${m.imgPath}`);
  m.uses.forEach(u => console.log(`     used in ${u.file} (${u.type}: ${u.alt || ''})`));
});

// Group referenced assets by issue
console.log('\n==================================================');
console.log('REFERENCED ASSETS BY ISSUE:');
const byIssue = {};
referencedImages.forEach((uses, imgPath) => {
  uses.forEach(u => {
    if (!byIssue[u.file]) byIssue[u.file] = [];
    byIssue[u.file].push({ imgPath, alt: u.alt, type: u.type });
  });
});

Object.keys(byIssue).sort().forEach(issue => {
  console.log(`\n📄 ${issue} (${byIssue[issue].length} images):`);
  byIssue[issue].forEach(img => {
    const cleanPath = img.imgPath.startsWith('/') ? img.imgPath.slice(1) : img.imgPath;
    const diskPath = path.join(publicDir, cleanPath);
    const exists = fs.existsSync(diskPath);
    let size = 0;
    if (exists) {
      size = (fs.statSync(diskPath).size / 1024).toFixed(1) + ' KB';
    }
    console.log(`  - [${exists ? 'EXISTS ' + size : 'MISSING'}] ${img.imgPath} | Alt: "${img.alt || ''}"`);
  });
});

console.log('\n==================================================');
console.log('ASSET FOLDERS BREAKDOWN:');
const folderCounts = {};
allAssetFiles.forEach(f => {
  const rel = path.relative(assetsDir, f);
  const topDir = rel.split(path.sep)[0];
  folderCounts[topDir] = (folderCounts[topDir] || 0) + 1;
});
console.log(folderCounts);
