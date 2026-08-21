const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\offic\\.gemini\\antigravity-cli\\brain\\a2428a02-2171-418f-bbbc-b66af2806007';
const newsletterDir = 'C:\\Users\\offic\\OneDrive\\Desktop\\newsletter';

const mappings = [
  {
    artifact: 'macbook_briefing_1786960921277.jpg',
    targetFolder: 'public/assets/deep-node-1',
    targetFile: 'macbook_briefing.jpg',
    mdx: 'content/issues/001-the-personal-ai.mdx',
    mdxPath: '/assets/deep-node-1/macbook_briefing.jpg'
  },
  {
    artifact: 'prompt_stack_hero_1786962302380.jpg',
    targetFolder: 'public/assets/issue-1',
    targetFile: 'prompt_stack_hero.jpg',
    mdx: 'content/issues/003-prompt-engineering-isnt-dead-its-evolving.mdx',
    mdxPath: '/assets/issue-1/prompt_stack_hero.jpg'
  },
  {
    artifact: 'loop_hero_torus_1786963575017.jpg',
    targetFolder: 'public/assets/issue-5',
    targetFile: 'loop_hero_torus.jpg',
    mdx: 'content/issues/007-loop-engineering-what-makes-ai-agents-improve-themselves.mdx',
    mdxPath: '/assets/issue-5/loop_hero_torus.jpg'
  },
  {
    artifact: 'graph_subway_hero_1786964299976.jpg',
    targetFolder: 'public/assets/issue-6',
    targetFile: 'graph_subway_hero.jpg',
    mdx: 'content/issues/008-graph-engineering-beyond-single-ai-loops.mdx',
    mdxPath: '/assets/issue-6/graph_subway_hero.jpg'
  },
  {
    artifact: 'hype_cycle_render_1786962818623.jpg',
    targetFolder: 'public/assets/daily-node-7',
    targetFile: 'hype_cycle_render.jpg',
    mdx: 'content/issues/009-ai-agents-101.mdx',
    mdxPath: '/assets/daily-node-7/hype_cycle_render.jpg'
  },
  {
    artifact: 'ai_stack_layers_1786963547985.jpg',
    targetFolder: 'public/assets/daily-node-8',
    targetFile: 'ai_stack_layers.jpg',
    mdx: 'content/issues/010-agent-memory.mdx',
    mdxPath: '/assets/daily-node-8/ai_stack_layers.jpg'
  },
  {
    artifact: 'cron_hero_workstation_1786964644887.jpg',
    targetFolder: 'public/assets/daily-node-9',
    targetFile: 'cron_hero_workstation.jpg',
    mdx: 'content/issues/011-cron-jobs-how-to-make-ai-agents-work-while-you-sleep.mdx',
    mdxPath: '/assets/daily-node-9/cron_hero_workstation.jpg'
  }
];

mappings.forEach(m => {
  const src = path.join(artifactDir, m.artifact);
  const destDir = path.join(newsletterDir, m.targetFolder);
  const destFile = path.join(destDir, m.targetFile);
  
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, destFile);
    console.log('Copied ' + m.artifact + ' to ' + destFile);
  } else {
    console.error('Artifact not found: ' + src);
  }
  
  const mdxPath = path.join(newsletterDir, m.mdx);
  if (fs.existsSync(mdxPath)) {
    let content = fs.readFileSync(mdxPath, 'utf8');
    content = content.replace(/heroImage:.*/g, `heroImage: "${m.mdxPath}"`);
    fs.writeFileSync(mdxPath, content);
    console.log('Updated ' + m.mdx);
  } else {
    console.error('MDX not found: ' + mdxPath);
  }
});
