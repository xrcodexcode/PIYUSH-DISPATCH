const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/assets/deep-node-4');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mappings = [
  { src: 'public/assets/issue-8/1.jpg', dest: '1.jpg' }, // 3D Neural Vector Brain & Idea Space
  { src: 'public/assets/deep-node-3/6.jpg', dest: '2.jpg' }, // Crystalline Laser Transformation Core
  { src: 'public/assets/deep-node-3/8.jpg', dest: '3.jpg' }, // 3D High-Dimensional Multi-Layer Coordinate Manifold
  { src: 'public/assets/issue-8/4.jpg', dest: '4.jpg' }, // Holographic Similarity Search Radar
  { src: 'public/assets/issue-10/hero_infra.jpg', dest: '5.jpg' }, // Massive Vector Storage Server Infrastructure
  { src: 'public/assets/deep-node-3/9.jpg', dest: '6.jpg' }, // Dual-Ring RAG Retrieval & Inference Orbital Core
  { src: 'public/assets/deep-node-3/1.jpg', dest: '7.jpg' }, // Grounded Knowledge Hub & Power Conduits Traversal
  { src: 'public/assets/deep-node-3/7.jpg', dest: '8.jpg' }, // Split-Screen: Unstructured Chaos vs. High-Dimensional Crystal Geometry
  { src: 'public/assets/issue-8/5.jpg', dest: '9.jpg' }, // Personal AI Workstation with VectorDB Hologram
  { src: 'public/assets/issue-8/6.jpg', dest: '10.jpg' }, // Final Cybernetic Architectural HUD Summary
];

mappings.forEach(({ src, dest }) => {
  const fullSrc = path.join(__dirname, '..', src);
  const fullDest = path.join(targetDir, dest);
  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, fullDest);
    console.log(`✓ Deployed 3D Cinematic Asset: ${src} -> public/assets/deep-node-4/${dest}`);
  } else {
    console.error(`❌ Source not found: ${fullSrc}`);
  }
});

console.log('All 10 3D Cinematic High-Definition Assets successfully deployed for Deep Node #004!');
