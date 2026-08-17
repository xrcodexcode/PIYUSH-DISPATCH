const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content', 'issues');

const renameMap = {
  '026-prompt-engineering-isnt-dead-its-evolving.mdx': '003-prompt-engineering-isnt-dead-its-evolving.mdx',
  '027-rag-isnt-dead-most-people-just-dont-understand-it.mdx': '004-rag-isnt-dead-most-people-just-dont-understand-it.mdx',
  '028-better-input-better-output-thats-context-engineering.mdx': '005-better-input-better-output-thats-context-engineering.mdx',
  '029-the-prompt-is-just-one-ingredient-the-harness-is-the-kitchen.mdx': '006-the-prompt-is-just-one-ingredient-the-harness-is-the-kitchen.mdx',
  '030-loop-engineering-what-makes-ai-agents-improve-themselves.mdx': '007-loop-engineering-what-makes-ai-agents-improve-themselves.mdx',
  '031-graph-engineering-beyond-single-ai-loops.mdx': '008-graph-engineering-beyond-single-ai-loops.mdx',
  '032-ai-agents-101.mdx': '009-ai-agents-101.mdx',
  '033-agent-memory.mdx': '010-agent-memory.mdx',
  '034-cron-jobs-how-to-make-ai-agents-work-while-you-sleep.mdx': '011-cron-jobs-how-to-make-ai-agents-work-while-you-sleep.mdx'
};

// 1. Rename files
for (const [oldName, newName] of Object.entries(renameMap)) {
  const oldPath = path.join(dir, oldName);
  const newPath = path.join(dir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldName} to ${newName}`);
  }
}

// 2. Replace slugs in all MDX files
const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
for (const file of allFiles) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const [oldName, newName] of Object.entries(renameMap)) {
    const oldSlug = oldName.replace('.mdx', '');
    const newSlug = newName.replace('.mdx', '');
    
    // Replace markdown links, e.g. (/issues/026-...) -> (/issues/003-...)
    if (content.includes(oldSlug)) {
      content = content.split(oldSlug).join(newSlug);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated links in ${file}`);
  }
}
