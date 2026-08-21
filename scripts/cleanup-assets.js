const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');
const issuesDir = path.join(__dirname, 'content', 'issues');

// 1. Organize folders
const dirs = fs.readdirSync(assetsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const dirName of dirs) {
  let normalized = dirName;
  // Replace %23 with -
  if (normalized.includes('%23')) normalized = normalized.replace('%23', '-');
  // Replace # with -
  if (normalized.includes('#')) normalized = normalized.replace('#', '-');
  
  if (normalized !== dirName) {
    const oldPath = path.join(assetsDir, dirName);
    const newPath = path.join(assetsDir, normalized);
    
    // Create normalized dir if it doesn't exist
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true });
    }
    
    // Move files
    const files = fs.readdirSync(oldPath);
    for (const file of files) {
      fs.copyFileSync(path.join(oldPath, file), path.join(newPath, file));
    }
    
    // Delete old dir
    fs.rmSync(oldPath, { recursive: true, force: true });
    console.log(`Merged ${dirName} into ${normalized}`);
  }
}

// 2. Fix references in MDX files
const mdxFiles = fs.readdirSync(issuesDir).filter(f => f.endsWith('.mdx'));
for (const file of mdxFiles) {
  const filePath = path.join(issuesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  if (content.includes('%23')) {
    content = content.replace(/\/assets\/([^/]+)%23(\d+)\//g, '/assets/$1-$2/');
    changed = true;
  }
  if (content.includes('#')) {
    // only inside asset paths
    content = content.replace(/\/assets\/([^/]+)#(\d+)\//g, '/assets/$1-$2/');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed asset paths in ${file}`);
  }
}
