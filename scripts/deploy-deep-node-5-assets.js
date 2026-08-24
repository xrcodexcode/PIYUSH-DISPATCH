const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/assets/deep-node-5');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Brain artifact directory for newly generated images
const brainDir = 'C:\\Users\\offic\\.gemini\\antigravity-cli\\brain\\e388abd9-d58f-483d-ad8f-4d61ccc97c81';

const image1Path = path.join(brainDir, 'meaning_map_3d_1787581554270.jpg');
const image2Path = path.join(brainDir, 'words_to_vectors_3d_1787581579668.jpg');

const mappings = [
  { src: image1Path, dest: '1.jpg', isAbsolute: true }, // Visual #1: Meaning Map
  { src: image2Path, dest: '2.jpg', isAbsolute: true }, // Visual #2: Words to Vectors
  { src: 'public/assets/issue-6/graph_subway_hero.jpg', dest: '3.jpg', isAbsolute: false }, // Visual #3: Learning from Context
  { src: 'public/assets/issue-8/4.jpg', dest: '4.jpg', isAbsolute: false }, // Visual #4: Vector Similarity (Cosine Angle)
  { src: 'public/assets/deep-node-3/7.jpg', dest: '5.jpg', isAbsolute: false }, // Visual #5: Context Changes Meaning (Split Scene)
  { src: 'public/assets/issue-8/ai_stack_layers.jpg', dest: '6.jpg', isAbsolute: false }, // Visual #6: Multimodal Embedding Space
  { src: 'public/assets/issue-8/1.jpg', dest: '7.jpg', isAbsolute: false }, // Visual #7: Semantic Search Retrieval
  { src: 'public/assets/issue-10/hero_infra.jpg', dest: '8.jpg', isAbsolute: false }, // Visual #8: Inside a Vector Database
  { src: 'public/assets/deep-node-3/9.jpg', dest: '9.jpg', isAbsolute: false }, // Visual #9: RAG Pipeline Architecture
  { src: 'public/assets/issue-8/6.jpg', dest: '10.jpg', isAbsolute: false }, // Visual #10: Limits of Embeddings
];

mappings.forEach(({ src, dest, isAbsolute }) => {
  const fullSrc = isAbsolute ? src : path.join(__dirname, '..', src);
  const fullDest = path.join(targetDir, dest);
  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, fullDest);
    const size = fs.statSync(fullDest).size;
    console.log(`✓ Deployed: ${dest} (${(size / 1024).toFixed(1)} KB) from ${src}`);
  } else {
    console.error(`❌ Source not found: ${fullSrc}`);
  }
});

console.log('All 10 assets deployed to public/assets/deep-node-5/');
