const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outputDir = path.join(__dirname, '../public/assets/deep-node-4');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Common SVG style definitions
const sharedDefs = `
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05070B"/>
      <stop offset="50%" stop-color="#0B1120"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
    <linearGradient id="cyanIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
    <linearGradient id="purplePink" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <linearGradient id="emeraldTeal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="amberOrange" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
    <radialGradient id="glowCyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowPurple" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#818CF8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#818CF8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowEmerald" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <marker id="arrowCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38BDF8"/>
    </marker>
    <marker id="arrowEmerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34D399"/>
    </marker>
    <marker id="arrowAmber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F59E0B"/>
    </marker>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" stroke-width="0.75" stroke-opacity="0.6"/>
    </pattern>
  </defs>
`;

const svgs = [
  // 1. COVER: Knowledge Universe & Idea Space
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>

    <circle cx="800" cy="450" r="480" fill="url(#glowCyan)"/>
    <circle cx="350" cy="300" r="320" fill="url(#glowPurple)"/>
    <circle cx="1250" cy="550" r="360" fill="url(#glowEmerald)"/>

    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-190" y="-22" width="380" height="44" rx="22" fill="#0F172A" stroke="#6366F1" stroke-width="2"/>
      <text x="0" y="6" fill="#38BDF8" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="800" text-anchor="middle" letter-spacing="2">THE DEEP NODES #004</text>
    </g>

    <text x="800" y="170" fill="#F8FAFC" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" text-anchor="middle" letter-spacing="-0.5">HOW VECTOR DATABASES ACTUALLY WORK</text>
    <text x="800" y="215" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" text-anchor="middle">Navigating High-Dimensional Idea Space &amp; Searching Meaning Instead of Keywords</text>

    <!-- Constellation Connections -->
    <g stroke="#38BDF8" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="6 4">
      <line x1="430" y1="420" x2="620" y2="350"/>
      <line x1="620" y1="350" x2="800" y2="480"/>
      <line x1="800" y1="480" x2="1000" y2="370"/>
      <line x1="1000" y1="370" x2="1220" y2="460"/>
      <line x1="620" y1="350" x2="500" y2="620"/>
      <line x1="800" y1="480" x2="800" y2="680"/>
      <line x1="1000" y1="370" x2="1140" y2="640"/>
    </g>

    <!-- Center Core: Semantic Gravitational Center -->
    <g transform="translate(800, 480)" filter="url(#shadow)">
      <circle cx="0" cy="0" r="85" fill="#0F172A" stroke="url(#cyanIndigo)" stroke-width="4"/>
      <circle cx="0" cy="0" r="70" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="0" y="-20" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle" letter-spacing="1">SEMANTIC</text>
      <text x="0" y="8" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="22" font-weight="900" text-anchor="middle">VECTOR</text>
      <text x="0" y="32" fill="#818CF8" font-family="system-ui, sans-serif" font-size="16" font-weight="800" text-anchor="middle">SPACE</text>
    </g>

    <!-- Node 1: AI & ML -->
    <g transform="translate(430, 420)" filter="url(#shadow)">
      <rect x="-100" y="-45" width="200" height="90" rx="16" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
      <text x="0" y="-14" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">CONCEPT NODE</text>
      <text x="0" y="10" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="16" font-weight="800" text-anchor="middle">Artificial Intelligence</text>
      <text x="0" y="28" fill="#64748B" font-family="monospace" font-size="11" text-anchor="middle">[0.89, -0.42, 0.77]</text>
    </g>

    <!-- Node 2: Neural Nets -->
    <g transform="translate(620, 350)" filter="url(#shadow)">
      <rect x="-85" y="-38" width="170" height="76" rx="14" fill="#0F172A" stroke="#818CF8" stroke-width="2"/>
      <text x="0" y="-8" fill="#818CF8" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">MACHINE LEARNING</text>
      <text x="0" y="15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="middle">Deep Neural Nets</text>
    </g>

    <!-- Node 3: Biological Entities -->
    <g transform="translate(1000, 370)" filter="url(#shadow)">
      <rect x="-85" y="-38" width="170" height="76" rx="14" fill="#0F172A" stroke="#34D399" stroke-width="2"/>
      <text x="0" y="-8" fill="#34D399" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">BIOLOGY / HEALTH</text>
      <text x="0" y="15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="middle">Medicine &amp; Genomics</text>
    </g>

    <!-- Node 4: Economics -->
    <g transform="translate(1220, 460)" filter="url(#shadow)">
      <rect x="-90" y="-38" width="180" height="76" rx="14" fill="#0F172A" stroke="#F59E0B" stroke-width="2"/>
      <text x="0" y="-8" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">FINANCE DOMAIN</text>
      <text x="0" y="15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="middle">Markets &amp; Economy</text>
    </g>

    <!-- Node 5: Personal Memory -->
    <g transform="translate(500, 620)" filter="url(#shadow)">
      <rect x="-90" y="-38" width="180" height="76" rx="14" fill="#0F172A" stroke="#EC4899" stroke-width="2"/>
      <text x="0" y="-8" fill="#EC4899" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">PERSONAL ARCHIVE</text>
      <text x="0" y="15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="middle">Infinity Brain Vault</text>
    </g>

    <!-- Node 6: Search & Retrieval -->
    <g transform="translate(800, 680)" filter="url(#shadow)">
      <rect x="-95" y="-38" width="190" height="76" rx="14" fill="#0F172A" stroke="#06B6D4" stroke-width="2"/>
      <text x="0" y="-8" fill="#06B6D4" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">GROUNDED RETRIEVAL</text>
      <text x="0" y="15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="middle">RAG Context Engine</text>
    </g>

    <!-- Node 7: Nearest Neighbors -->
    <g transform="translate(1140, 640)" filter="url(#shadow)">
      <rect x="-90" y="-38" width="180" height="76" rx="14" fill="#0F172A" stroke="#A855F7" stroke-width="2"/>
      <text x="0" y="-8" fill="#A855F7" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">GEOMETRIC PROXIMITY</text>
      <text x="0" y="15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="middle">Nearest Neighbors</text>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">Traditional DBs search exact characters. Vector DBs search geometric proximity in high-dimensional idea space.</text>
    </g>
  </svg>`,

  // 2. TEXT → VECTOR TRANSFORMATION
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-180" y="-20" width="360" height="40" rx="20" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
      <text x="0" y="5" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">02 · TRANSFORMATION PIPELINE</text>
    </g>

    <text x="800" y="165" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">HOW RAW TEXT BECOMES A HIGH-DIMENSIONAL VECTOR</text>

    <!-- Step 1: Input Text -->
    <g transform="translate(250, 430)" filter="url(#shadow)">
      <rect x="-140" y="-130" width="280" height="260" rx="18" fill="#0F172A" stroke="#475569" stroke-width="2.5"/>
      <rect x="-120" y="-105" width="110" height="28" rx="14" fill="#1E293B"/>
      <text x="-65" y="-87" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">STEP 1: INPUT</text>
      <text x="0" y="-40" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">Raw Natural Text</text>
      
      <rect x="-115" y="-10" width="230" height="80" rx="12" fill="#030712" stroke="#334155" stroke-width="1.5"/>
      <text x="0" y="20" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="16" font-weight="800" text-anchor="middle">"Artificial Intelligence"</text>
      <text x="0" y="50" fill="#64748B" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Human-readable concept</text>
    </g>

    <path d="M 390 430 L 480 430" stroke="#38BDF8" stroke-width="3" marker-end="url(#arrowCyan)"/>

    <!-- Step 2: Embedding Model Core -->
    <g transform="translate(640, 430)" filter="url(#shadow)">
      <rect x="-140" y="-140" width="280" height="280" rx="20" fill="#0F172A" stroke="#6366F1" stroke-width="2.5"/>
      <circle cx="0" cy="-25" r="50" fill="url(#glowPurple)"/>
      <circle cx="0" cy="-25" r="40" fill="#1E1B4B" stroke="#818CF8" stroke-width="2"/>
      <text x="0" y="-30" fill="#818CF8" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">NEURAL</text>
      <text x="0" y="-10" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="15" font-weight="900" text-anchor="middle">MODEL</text>
      
      <text x="0" y="45" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="17" font-weight="800" text-anchor="middle">Deep Embedding Core</text>
      <text x="0" y="75" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Extracts contextual semantics</text>
      <text x="0" y="100" fill="#64748B" font-family="monospace" font-size="12" text-anchor="middle">text-embedding-3</text>
    </g>

    <path d="M 780 430 L 860 430" stroke="#818CF8" stroke-width="3" marker-end="url(#arrowCyan)"/>

    <!-- Step 3: Floating Coordinates / Vector Array -->
    <g transform="translate(1040, 430)" filter="url(#shadow)">
      <rect x="-160" y="-140" width="320" height="280" rx="20" fill="#0F172A" stroke="#10B981" stroke-width="2.5"/>
      <rect x="-140" y="-115" width="130" height="28" rx="14" fill="#064E3B"/>
      <text x="-75" y="-97" fill="#34D399" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">STEP 3: OUTPUT</text>
      <text x="0" y="-55" fill="#34D399" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">Dense Vector Array</text>

      <g transform="translate(-135, -25)">
        <rect width="270" height="120" rx="10" fill="#030712" stroke="#1E293B" stroke-width="1.5"/>
        <text x="15" y="28" fill="#38BDF8" font-family="monospace" font-size="14" font-weight="700">[  0.2418,  -0.8123,</text>
        <text x="15" y="54" fill="#818CF8" font-family="monospace" font-size="14" font-weight="700">   0.5312,   0.0945,</text>
        <text x="15" y="80" fill="#34D399" font-family="monospace" font-size="14" font-weight="700">  -0.3129,   0.9421,</text>
        <text x="15" y="104" fill="#F59E0B" font-family="monospace" font-size="14" font-weight="700">  ... (1,536 dims) ]</text>
      </g>
      <text x="0" y="120" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">GPS Coordinates in Idea Space</text>
    </g>

    <path d="M 1200 430 L 1280 430" stroke="#34D399" stroke-width="3" marker-end="url(#arrowEmerald)"/>

    <!-- Step 4: Storage in Vector DB -->
    <g transform="translate(1390, 430)" filter="url(#shadow)">
      <circle cx="0" cy="0" r="65" fill="#0F172A" stroke="#F59E0B" stroke-width="3"/>
      <circle cx="0" cy="0" r="8" fill="#F59E0B"/>
      <text x="0" y="-12" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">STORED IN</text>
      <text x="0" y="12" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">VECTOR DB</text>
      <text x="0" y="32" fill="#64748B" font-family="monospace" font-size="11" text-anchor="middle">INDEXED</text>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">A vector is a mathematical address encoding the conceptual essence of the text.</text>
    </g>
  </svg>`,

  // 3. SEMANTIC SPACE & CLUSTERING
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-180" y="-20" width="360" height="40" rx="20" fill="#0F172A" stroke="#818CF8" stroke-width="1.5"/>
      <text x="0" y="5" fill="#818CF8" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">03 · HIGH-DIMENSIONAL TOPOLOGY</text>
    </g>

    <text x="800" y="160" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">THE GEOMETRY OF MEANING: SEMANTIC CLUSTERS</text>

    <!-- 3D Coordinate Axis Overlay -->
    <g stroke="#334155" stroke-width="2" stroke-dasharray="6 4">
      <line x1="800" y1="210" x2="800" y2="760"/>
      <line x1="150" y1="490" x2="1450" y2="490"/>
      <line x1="280" y1="740" x2="1320" y2="240"/>
    </g>
    <g transform="translate(800, 195)">
      <rect x="-140" y="-12" width="280" height="24" rx="12" fill="#0B1120" stroke="#334155" stroke-width="1"/>
      <text x="0" y="4" fill="#94A3B8" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">DIMENSION Z (Abstraction)</text>
    </g>
    <g transform="translate(1360, 480)">
      <rect x="-120" y="-12" width="240" height="24" rx="12" fill="#0B1120" stroke="#334155" stroke-width="1"/>
      <text x="0" y="4" fill="#94A3B8" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">DIMENSION X (Domain)</text>
    </g>

    <!-- Cluster A: AI & Computer Science -->
    <g transform="translate(400, 360)">
      <ellipse cx="0" cy="0" rx="220" ry="140" fill="#1E1B4B" fill-opacity="0.5" stroke="#6366F1" stroke-width="2" stroke-dasharray="8 6"/>
      
      <!-- Cluster Badge -->
      <g transform="translate(0, -115)">
        <rect x="-115" y="-14" width="230" height="28" rx="14" fill="#0F172A" stroke="#6366F1" stroke-width="1.5"/>
        <text x="0" y="5" fill="#818CF8" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="0.5" text-anchor="middle">CLUSTER A: AI &amp; ALGORITHMS</text>
      </g>
      
      <!-- Node 1 -->
      <g transform="translate(-80, -35)">
        <rect x="-85" y="-18" width="170" height="36" rx="10" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="0" y="5" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Artificial Intelligence</text>
      </g>
      
      <!-- Node 2 -->
      <g transform="translate(85, -15)">
        <rect x="-75" y="-18" width="150" height="36" rx="10" fill="#0F172A" stroke="#818CF8" stroke-width="1.5"/>
        <text x="0" y="5" fill="#818CF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Machine Learning</text>
      </g>

      <!-- Node 3 -->
      <g transform="translate(0, 55)">
        <rect x="-90" y="-18" width="180" height="36" rx="10" fill="#0F172A" stroke="#A855F7" stroke-width="1.5"/>
        <text x="0" y="5" fill="#C084FC" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Deep Neural Networks</text>
      </g>
    </g>

    <!-- Cluster B: Animals & Pets -->
    <g transform="translate(1200, 360)">
      <ellipse cx="0" cy="0" rx="220" ry="140" fill="#064E3B" fill-opacity="0.5" stroke="#10B981" stroke-width="2" stroke-dasharray="8 6"/>
      
      <!-- Cluster Badge -->
      <g transform="translate(0, -115)">
        <rect x="-110" y="-14" width="220" height="28" rx="14" fill="#0F172A" stroke="#10B981" stroke-width="1.5"/>
        <text x="0" y="5" fill="#34D399" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="0.5" text-anchor="middle">CLUSTER B: BIOLOGY / PETS</text>
      </g>

      <!-- Node 1 -->
      <g transform="translate(-80, -35)">
        <rect x="-80" y="-18" width="160" height="36" rx="10" fill="#0F172A" stroke="#34D399" stroke-width="1.5"/>
        <text x="0" y="5" fill="#34D399" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Golden Retriever</text>
      </g>

      <!-- Node 2 -->
      <g transform="translate(85, -15)">
        <rect x="-70" y="-18" width="140" height="36" rx="10" fill="#0F172A" stroke="#10B981" stroke-width="1.5"/>
        <text x="0" y="5" fill="#10B981" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Puppy &amp; Canine</text>
      </g>

      <!-- Node 3 -->
      <g transform="translate(0, 55)">
        <rect x="-85" y="-18" width="170" height="36" rx="10" fill="#0F172A" stroke="#059669" stroke-width="1.5"/>
        <text x="0" y="5" fill="#6EE7B7" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Domestic Feline (Cat)</text>
      </g>
    </g>

    <!-- Cluster C: Vehicles & Transportation -->
    <g transform="translate(480, 650)">
      <ellipse cx="0" cy="0" rx="200" ry="110" fill="#451A03" fill-opacity="0.5" stroke="#F59E0B" stroke-width="2" stroke-dasharray="8 6"/>
      
      <!-- Cluster Badge -->
      <g transform="translate(0, -88)">
        <rect x="-95" y="-14" width="190" height="28" rx="14" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="0" y="5" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="0.5" text-anchor="middle">CLUSTER C: VEHICLES</text>
      </g>

      <g transform="translate(-70, 5)">
        <rect x="-75" y="-18" width="150" height="36" rx="10" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="0" y="5" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Automobile (Car)</text>
      </g>

      <g transform="translate(75, 25)">
        <rect x="-85" y="-18" width="170" height="36" rx="10" fill="#0F172A" stroke="#D97706" stroke-width="1.5"/>
        <text x="0" y="5" fill="#FCD34D" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Commercial Airplane</text>
      </g>
    </g>

    <!-- Distance Comparison Callout -->
    <g transform="translate(1140, 650)" filter="url(#shadow)">
      <rect x="-200" y="-90" width="400" height="180" rx="18" fill="#0F172A" stroke="#334155" stroke-width="2.5"/>
      <text x="0" y="-55" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">GEOMETRIC DISTANCE COMPARISON</text>
      <line x1="-170" y1="-38" x2="170" y2="-38" stroke="#1E293B" stroke-width="1.5"/>

      <text x="-160" y="-10" fill="#34D399" font-family="system-ui, sans-serif" font-size="14" font-weight="800">"Dog" ↔ "Cat"</text>
      <text x="160" y="-10" fill="#34D399" font-family="monospace" font-size="13" font-weight="800" text-anchor="end">Distance: 0.12 (Close)</text>

      <text x="-160" y="20" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="800">"AI" ↔ "ML"</text>
      <text x="160" y="20" fill="#38BDF8" font-family="monospace" font-size="13" font-weight="800" text-anchor="end">Distance: 0.08 (Very Close)</text>

      <text x="-160" y="50" fill="#F43F5E" font-family="system-ui, sans-serif" font-size="14" font-weight="800">"Dog" ↔ "Airplane"</text>
      <text x="160" y="50" fill="#F43F5E" font-family="monospace" font-size="13" font-weight="800" text-anchor="end">Distance: 0.91 (Far)</text>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">Concepts with similar semantic meaning occupy nearby coordinates in multi-dimensional space.</text>
    </g>
  </svg>`,

  // 4. SIMILARITY SEARCH & METRICS
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-180" y="-20" width="360" height="40" rx="20" fill="#0F172A" stroke="#34D399" stroke-width="1.5"/>
      <text x="0" y="5" fill="#34D399" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">04 · SIMILARITY SEARCH</text>
    </g>

    <text x="800" y="160" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">HOW VECTOR SIMILARITY SEARCH ACTUALLY WORKS</text>

    <!-- Query Vector Launch Point -->
    <g transform="translate(250, 430)" filter="url(#shadow)">
      <rect x="-140" y="-120" width="280" height="240" rx="18" fill="#0F172A" stroke="#F59E0B" stroke-width="2.5"/>
      <rect x="-115" y="-95" width="120" height="28" rx="14" fill="#78350F"/>
      <text x="-55" y="-77" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">USER QUERY</text>
      <text x="0" y="-35" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="800" text-anchor="middle">"smart learning systems"</text>
      <path d="M 0 5 L 0 45" stroke="#F59E0B" stroke-width="2.5" marker-end="url(#arrowAmber)"/>
      <text x="0" y="70" fill="#F59E0B" font-family="monospace" font-size="13" font-weight="800" text-anchor="middle">Query Vector [q]</text>
      <text x="0" y="92" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">[0.82, -0.39, 0.74, ...]</text>
    </g>

    <!-- Radar Sweep Target Field -->
    <g transform="translate(800, 440)">
      <circle cx="0" cy="0" r="240" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="6 6"/>
      <circle cx="0" cy="0" r="160" fill="none" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 4" stroke-opacity="0.6"/>
      <circle cx="0" cy="0" r="85" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>

      <circle cx="0" cy="0" r="14" fill="#F59E0B"/>
      <text x="0" y="-24" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">Query Point (q)</text>

      <!-- Match 1: Top 1 (Closest) -->
      <g transform="translate(60, -45)">
        <line x1="-60" y1="45" x2="0" y2="0" stroke="#34D399" stroke-width="3"/>
        <circle cx="0" cy="0" r="11" fill="#34D399"/>
        <rect x="20" y="-22" width="200" height="44" rx="10" fill="#0F172A" stroke="#34D399" stroke-width="2"/>
        <text x="32" y="-2" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="900">1. "Machine Learning"</text>
        <text x="32" y="14" fill="#34D399" font-family="monospace" font-size="11" font-weight="800">Cosine Sim: 0.96 (Top Match)</text>
      </g>

      <!-- Match 2: Top 2 -->
      <g transform="translate(-110, -50)">
        <line x1="110" y1="50" x2="0" y2="0" stroke="#38BDF8" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="10" fill="#38BDF8"/>
        <rect x="-215" y="-22" width="200" height="44" rx="10" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
        <text x="-203" y="-2" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="900">2. "Neural Algorithms"</text>
        <text x="-203" y="14" fill="#38BDF8" font-family="monospace" font-size="11" font-weight="800">Cosine Sim: 0.91</text>
      </g>

      <!-- Match 3: Top 3 -->
      <g transform="translate(130, 90)">
        <line x1="-130" y1="-90" x2="0" y2="0" stroke="#818CF8" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="10" fill="#818CF8"/>
        <rect x="20" y="-22" width="200" height="44" rx="10" fill="#0F172A" stroke="#818CF8" stroke-width="2"/>
        <text x="32" y="-2" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="900">3. "Pattern Recognition"</text>
        <text x="32" y="14" fill="#818CF8" font-family="monospace" font-size="11" font-weight="800">Cosine Sim: 0.84</text>
      </g>

      <g transform="translate(-190, 160)">
        <circle cx="0" cy="0" r="7" fill="#475569"/>
        <text x="14" y="5" fill="#64748B" font-family="system-ui, sans-serif" font-size="13" font-weight="600">"Italian Recipes" (0.11 - Discarded)</text>
      </g>
    </g>

    <!-- Formula Box -->
    <g transform="translate(1360, 430)" filter="url(#shadow)">
      <rect x="-140" y="-120" width="280" height="240" rx="18" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
      <text x="0" y="-80" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">DISTANCE METRIC</text>
      <text x="0" y="-50" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="900" text-anchor="middle">Cosine Similarity</text>
      <rect x="-120" y="-30" width="240" height="70" rx="10" fill="#030712" stroke="#1E293B" stroke-width="1.5"/>
      <text x="0" y="6" fill="#38BDF8" font-family="Georgia, serif" font-size="16" font-weight="bold" font-style="italic" text-anchor="middle">cos(θ) = (A · B) / (||A|| ||B||)</text>
      <text x="0" y="28" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">Measures angular alignment</text>
      <text x="0" y="65" fill="#34D399" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">1.0 = Exact Match in Meaning</text>
      <text x="0" y="90" fill="#F43F5E" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">0.0 = Completely Unrelated</text>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">Vector databases use geometric indexing to retrieve nearest neighbors in sub-10 millisecond latency.</text>
    </g>
  </svg>`,

  // 5. VECTOR DATABASE STRUCTURE & INDEXING
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-190" y="-20" width="380" height="40" rx="20" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="0" y="5" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">05 · INTERNAL ARCHITECTURE</text>
    </g>

    <text x="800" y="160" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">THE 3 CORE RESPONSIBILITIES OF A VECTOR DATABASE</text>

    <!-- Card 1: Vector Storage -->
    <g transform="translate(320, 440)" filter="url(#shadow)">
      <rect x="-170" y="-190" width="340" height="380" rx="20" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
      <circle cx="0" cy="-120" r="38" fill="#0369A1"/>
      <text x="0" y="-110" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="22" font-weight="900" text-anchor="middle">1</text>
      <text x="0" y="-60" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">Dense Embedding</text>
      <text x="0" y="-35" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="800" text-anchor="middle">Storage &amp; Payloads</text>
      
      <rect x="-145" y="-15" width="290" height="155" rx="12" fill="#030712" stroke="#1E293B" stroke-width="1.5"/>
      <text x="-125" y="15" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800">• High-Dim Arrays (768–3072 dims)</text>
      <text x="-125" y="44" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Associated Document Chunks</text>
      <text x="-125" y="73" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Metadata Tags (author, date, URL)</text>
      <text x="-125" y="102" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Quantized Memory Layouts (PQ/SQ)</text>
      <text x="-125" y="131" fill="#34D399" font-family="system-ui, sans-serif" font-size="13" font-weight="800">• Persistent Disk &amp; RAM Caches</text>

      <text x="0" y="165" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Stores millions of floating-point vectors</text>
    </g>

    <!-- Card 2: Approximate Nearest Neighbor (ANN) Indexing -->
    <g transform="translate(800, 440)" filter="url(#shadow)">
      <rect x="-170" y="-190" width="340" height="380" rx="20" fill="#0F172A" stroke="#818CF8" stroke-width="2.5"/>
      <circle cx="0" cy="-120" r="38" fill="#4338CA"/>
      <text x="0" y="-110" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="22" font-weight="900" text-anchor="middle">2</text>
      <text x="0" y="-60" fill="#818CF8" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">Hierarchical Graph</text>
      <text x="0" y="-35" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="800" text-anchor="middle">Indexing (HNSW / IVF)</text>

      <rect x="-145" y="-15" width="290" height="155" rx="12" fill="#030712" stroke="#1E293B" stroke-width="1.5"/>
      <text x="-125" y="15" fill="#818CF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800">• HNSW Multi-Layer Small World Graphs</text>
      <text x="-125" y="44" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Inverted File Indexing (IVF Clusters)</text>
      <text x="-125" y="73" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Logarithmic O(log N) Search Time</text>
      <text x="-125" y="102" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Bypasses Exhaustive Linear Scans</text>
      <text x="-125" y="131" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="13" font-weight="800">• Sub-10ms Retrieval Speed</text>

      <text x="0" y="165" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Organizes vectors for lightning-fast search</text>
    </g>

    <!-- Card 3: Filtered Semantic Query Engine -->
    <g transform="translate(1280, 440)" filter="url(#shadow)">
      <rect x="-170" y="-190" width="340" height="380" rx="20" fill="#0F172A" stroke="#10B981" stroke-width="2.5"/>
      <circle cx="0" cy="-120" r="38" fill="#047857"/>
      <text x="0" y="-110" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="22" font-weight="900" text-anchor="middle">3</text>
      <text x="0" y="-60" fill="#10B981" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">Hybrid Filtering &amp;</text>
      <text x="0" y="-35" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="18" font-weight="800" text-anchor="middle">Nearest Retrieval</text>

      <rect x="-145" y="-15" width="290" height="155" rx="12" fill="#030712" stroke="#1E293B" stroke-width="1.5"/>
      <text x="-125" y="15" fill="#10B981" font-family="system-ui, sans-serif" font-size="13" font-weight="800">• Top-K Cosine / Euclidean Ranking</text>
      <text x="-125" y="44" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Single-Stage Metadata Filtering</text>
      <text x="-125" y="73" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Sparse + Dense Hybrid Search</text>
      <text x="-125" y="102" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13">• Dynamic Cross-Encoder Re-ranking</text>
      <text x="-125" y="131" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800">• Feeds Verified Context to LLMs</text>

      <text x="0" y="165" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Delivers exact context to AI inference</text>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">A vector database is not just a storage table — it is a specialized geometric retrieval accelerator.</text>
    </g>
  </svg>`,

  // 6. RAG RETRIEVAL PIPELINE
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-190" y="-20" width="380" height="40" rx="20" fill="#0F172A" stroke="#EC4899" stroke-width="1.5"/>
      <text x="0" y="5" fill="#EC4899" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">06 · THE RAG ARCHITECTURE</text>
    </g>

    <text x="800" y="160" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">HOW VECTOR DATABASES POWER RAG SYSTEMS</text>

    <!-- Upper Ingestion Lane -->
    <g transform="translate(120, 240)">
      <rect x="0" y="0" width="1360" height="150" rx="16" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
      <text x="25" y="35" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="800" letter-spacing="1">LANE 1: OFFLINE DOCUMENT INGESTION</text>

      <g transform="translate(180, 85)">
        <rect x="-80" y="-30" width="160" height="60" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
        <text x="0" y="-5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">SOURCE FILES</text>
        <text x="0" y="15" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">PDFs, Notes, Code</text>
      </g>
      <path d="M 270 85 L 340 85" stroke="#38BDF8" stroke-width="2" marker-end="url(#arrowCyan)"/>

      <g transform="translate(430, 85)">
        <rect x="-80" y="-30" width="160" height="60" rx="10" fill="#1E293B" stroke="#6366F1" stroke-width="1.5"/>
        <text x="0" y="-5" fill="#818CF8" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">CHUNKING</text>
        <text x="0" y="15" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Semantic Slices</text>
      </g>
      <path d="M 520 85 L 590 85" stroke="#6366F1" stroke-width="2" marker-end="url(#arrowCyan)"/>

      <g transform="translate(680, 85)">
        <rect x="-80" y="-30" width="160" height="60" rx="10" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
        <text x="0" y="-5" fill="#C084FC" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">EMBEDDING</text>
        <text x="0" y="15" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Dense Vectors</text>
      </g>
      <path d="M 770 85 L 850 85" stroke="#A855F7" stroke-width="2" marker-end="url(#arrowCyan)"/>

      <g transform="translate(970, 85)">
        <rect x="-100" y="-35" width="200" height="70" rx="12" fill="#1E1B4B" stroke="#38BDF8" stroke-width="2"/>
        <text x="0" y="-8" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">VECTOR DATABASE</text>
        <text x="0" y="15" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="15" font-weight="900" text-anchor="middle">Indexed Idea Graph</text>
      </g>
    </g>

    <!-- Lower Online Query Lane -->
    <g transform="translate(120, 440)">
      <rect x="0" y="0" width="1360" height="260" rx="16" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
      <text x="25" y="35" fill="#34D399" font-family="system-ui, sans-serif" font-size="14" font-weight="800" letter-spacing="1">LANE 2: REAL-TIME INFERENCE &amp; ANSWER GENERATION</text>

      <g transform="translate(140, 140)">
        <rect x="-80" y="-50" width="160" height="100" rx="12" fill="#1E293B" stroke="#F59E0B" stroke-width="2"/>
        <text x="0" y="-20" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="11" font-weight="800" text-anchor="middle">1. USER QUERY</text>
        <text x="0" y="5" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">"What did I learn</text>
        <text x="0" y="25" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">about RAG?"</text>
      </g>
      <path d="M 230 140 L 300 140" stroke="#F59E0B" stroke-width="2" marker-end="url(#arrowAmber)"/>

      <g transform="translate(380, 140)">
        <rect x="-70" y="-45" width="140" height="90" rx="12" fill="#1E293B" stroke="#6366F1" stroke-width="2"/>
        <text x="0" y="-18" fill="#818CF8" font-family="system-ui, sans-serif" font-size="11" font-weight="800" text-anchor="middle">2. EMBED</text>
        <text x="0" y="6" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Query Vector</text>
        <text x="0" y="25" fill="#94A3B8" font-family="monospace" font-size="11" text-anchor="middle">[0.82, -0.39, ...]</text>
      </g>
      <path d="M 460 140 L 530 140" stroke="#6366F1" stroke-width="2" marker-end="url(#arrowCyan)"/>

      <g transform="translate(620, 140)">
        <rect x="-80" y="-45" width="160" height="90" rx="12" fill="#1E1B4B" stroke="#38BDF8" stroke-width="2"/>
        <text x="0" y="-18" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="11" font-weight="800" text-anchor="middle">3. SEARCH</text>
        <text x="0" y="6" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Vector DB Lookup</text>
        <text x="0" y="25" fill="#34D399" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Top 3 Relevant Chunks</text>
      </g>
      <path d="M 710 140 L 780 140" stroke="#38BDF8" stroke-width="2" marker-end="url(#arrowCyan)"/>

      <g transform="translate(880, 140)">
        <rect x="-90" y="-55" width="180" height="110" rx="12" fill="#1E293B" stroke="#34D399" stroke-width="2"/>
        <text x="0" y="-28" fill="#34D399" font-family="system-ui, sans-serif" font-size="11" font-weight="800" text-anchor="middle">4. CONTEXT INJECTION</text>
        <text x="0" y="-5" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="700" text-anchor="middle">[Prompt + Chunks]</text>
        <text x="0" y="16" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">"Answer using this</text>
        <text x="0" y="34" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">verified evidence:"</text>
      </g>
      <path d="M 980 140 L 1050 140" stroke="#34D399" stroke-width="2" marker-end="url(#arrowEmerald)"/>

      <g transform="translate(1180, 140)">
        <rect x="-100" y="-55" width="200" height="110" rx="14" fill="#064E3B" stroke="#10B981" stroke-width="2.5"/>
        <text x="0" y="-28" fill="#A7F3D0" font-family="system-ui, sans-serif" font-size="11" font-weight="800" text-anchor="middle">5. GROUNDED ANSWER</text>
        <text x="0" y="-2" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="15" font-weight="900" text-anchor="middle">Accurate Synthesis</text>
        <text x="0" y="20" fill="#34D399" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">✔ Zero Hallucinations</text>
        <text x="0" y="38" fill="#ECFDF5" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">Includes Source Citations</text>
      </g>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">Without Vector DB: LLMs guess from stale memory. With Vector DB: LLMs retrieve verified evidence first.</text>
    </g>
  </svg>`,

  // 7. WORKED EXAMPLE
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-180" y="-20" width="360" height="40" rx="20" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
      <text x="0" y="5" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">07 · STEP-BY-STEP WALKTHROUGH</text>
    </g>

    <text x="800" y="160" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">WORKED EXAMPLE: FROM HUMAN QUERY TO GROUNDED TRUTH</text>

    <!-- Query Node -->
    <g transform="translate(300, 320)" filter="url(#shadow)">
      <rect x="-140" y="-80" width="280" height="160" rx="16" fill="#0F172A" stroke="#F59E0B" stroke-width="2.5"/>
      <rect x="-120" y="-65" width="100" height="24" rx="12" fill="#78350F"/>
      <text x="-70" y="-48" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">INPUT QUERY</text>
      <text x="0" y="-12" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="17" font-weight="800" text-anchor="middle">"What is machine learning?"</text>
      <text x="0" y="22" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Converted to Embedding (1536d)</text>
      <text x="0" y="48" fill="#F59E0B" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">[ 0.73, -0.41, 0.88, ... ]</text>
    </g>

    <!-- Center Search Dispatcher -->
    <g transform="translate(680, 480)">
      <circle cx="0" cy="0" r="75" fill="#0F172A" stroke="#6366F1" stroke-width="3"/>
      <text x="0" y="-14" fill="#818CF8" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">VECTOR DB</text>
      <text x="0" y="12" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">ANN SEARCH</text>
      <text x="0" y="32" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">&lt; 3.2 ms</text>
    </g>

    <path d="M 440 340 L 605 460" stroke="#F59E0B" stroke-width="2.5" marker-end="url(#arrowAmber)"/>

    <!-- Retrieved Document Nodes (Right Stack) -->
    <g transform="translate(1120, 260)" filter="url(#shadow)">
      <line x1="-365" y1="200" x2="-150" y2="0" stroke="#34D399" stroke-width="2.5"/>
      <rect x="-150" y="-45" width="300" height="90" rx="14" fill="#064E3B" stroke="#34D399" stroke-width="2"/>
      <text x="-130" y="-20" fill="#34D399" font-family="monospace" font-size="12" font-weight="800">MATCH 1 (SIMILARITY: 0.94)</text>
      <text x="-130" y="6" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700">"ML is a subset of AI that learns</text>
      <text x="-130" y="26" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700">patterns directly from data."</text>
    </g>

    <g transform="translate(1120, 420)" filter="url(#shadow)">
      <line x1="-365" y1="60" x2="-150" y2="0" stroke="#38BDF8" stroke-width="2.5"/>
      <rect x="-150" y="-45" width="300" height="90" rx="14" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2"/>
      <text x="-130" y="-20" fill="#38BDF8" font-family="monospace" font-size="12" font-weight="800">MATCH 2 (SIMILARITY: 0.89)</text>
      <text x="-130" y="6" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700">"Algorithms adjust internal weights</text>
      <text x="-130" y="26" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700">via gradient descent optimization."</text>
    </g>

    <g transform="translate(1120, 580)" filter="url(#shadow)">
      <line x1="-365" y1="-80" x2="-150" y2="0" stroke="#818CF8" stroke-width="2.5"/>
      <rect x="-150" y="-45" width="300" height="90" rx="14" fill="#1E1B4B" stroke="#818CF8" stroke-width="2"/>
      <text x="-130" y="-20" fill="#818CF8" font-family="monospace" font-size="12" font-weight="800">MATCH 3 (SIMILARITY: 0.82)</text>
      <text x="-130" y="6" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700">"Statistical modeling replaces</text>
      <text x="-130" y="26" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="700">hardcoded heuristic rules."</text>
    </g>

    <!-- Synthesis Output -->
    <g transform="translate(300, 620)" filter="url(#shadow)">
      <rect x="-140" y="-60" width="280" height="120" rx="14" fill="#0F172A" stroke="#10B981" stroke-width="2"/>
      <text x="0" y="-30" fill="#10B981" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">FINAL SYNTHESIS</text>
      <text x="0" y="-5" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="middle">LLM Synthesizes Verified</text>
      <text x="0" y="16" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="15" font-weight="800" text-anchor="middle">Truth in Plain English</text>
      <text x="0" y="40" fill="#34D399" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Citations linked to source vault</text>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">The retrieval step supplies high-confidence evidence so the language model never has to guess.</text>
    </g>
  </svg>`,

  // 8. SQL VS VECTOR DB COMPARISON
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-180" y="-20" width="360" height="40" rx="20" fill="#0F172A" stroke="#6366F1" stroke-width="1.5"/>
      <text x="0" y="5" fill="#818CF8" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">08 · PARADIGM COMPARISON</text>
    </g>

    <text x="800" y="160" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">TRADITIONAL RELATIONAL DB VS. VECTOR DATABASE</text>

    <!-- Left Side: Traditional SQL DB -->
    <g transform="translate(420, 450)" filter="url(#shadow)">
      <rect x="-300" y="-210" width="600" height="420" rx="20" fill="#0F172A" stroke="#475569" stroke-width="2.5"/>
      <rect x="-270" y="-180" width="150" height="32" rx="16" fill="#1E293B"/>
      <text x="-195" y="-159" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" font-weight="800">TRADITIONAL DB</text>

      <text x="0" y="-120" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="900" text-anchor="middle">PostgreSQL / MySQL (Relational)</text>
      <text x="0" y="-95" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">Rigid structured tabular records &amp; B-Tree indexes</text>

      <g transform="translate(-260, -65)">
        <rect width="520" height="230" rx="12" fill="#030712" stroke="#334155" stroke-width="1.5"/>
        
        <rect width="520" height="42" rx="12" fill="#1E293B"/>
        <text x="20" y="27" fill="#94A3B8" font-family="monospace" font-size="13" font-weight="700">ID</text>
        <text x="80" y="27" fill="#94A3B8" font-family="monospace" font-size="13" font-weight="700">QUERY CONDITION</text>
        <text x="340" y="27" fill="#94A3B8" font-family="monospace" font-size="13" font-weight="700">RESULT</text>

        <text x="20" y="75" fill="#64748B" font-family="monospace" font-size="13">1</text>
        <text x="80" y="75" fill="#38BDF8" font-family="monospace" font-size="13">WHERE title = 'AI'</text>
        <text x="340" y="75" fill="#34D399" font-family="monospace" font-size="13">✔ Match ("AI")</text>

        <line x1="0" y1="95" x2="520" y2="95" stroke="#1E293B" stroke-width="1"/>

        <text x="20" y="125" fill="#64748B" font-family="monospace" font-size="13">2</text>
        <text x="80" y="125" fill="#F43F5E" font-family="monospace" font-size="13">WHERE title = 'ML'</text>
        <text x="340" y="125" fill="#F43F5E" font-family="monospace" font-size="13">❌ No Match for 'AI'</text>

        <line x1="0" y1="145" x2="520" y2="145" stroke="#1E293B" stroke-width="1"/>

        <text x="20" y="175" fill="#64748B" font-family="monospace" font-size="13">3</text>
        <text x="80" y="175" fill="#F43F5E" font-family="monospace" font-size="13">WHERE title = 'smart'</text>
        <text x="340" y="175" fill="#F43F5E" font-family="monospace" font-size="13">❌ Zero semantic insight</text>
      </g>
    </g>

    <!-- Right Side: Vector Database -->
    <g transform="translate(1180, 450)" filter="url(#shadow)">
      <rect x="-300" y="-210" width="600" height="420" rx="20" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
      <rect x="-270" y="-180" width="140" height="32" rx="16" fill="#0C4A6E"/>
      <text x="-200" y="-159" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800">VECTOR DB</text>

      <text x="0" y="-120" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="24" font-weight="900" text-anchor="middle">Pinecone / Qdrant / Chroma</text>
      <text x="0" y="-95" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">Continuous high-dimensional semantic manifolds &amp; HNSW</text>

      <g transform="translate(-260, -65)">
        <rect width="520" height="230" rx="12" fill="#030712" stroke="#1E293B" stroke-width="1.5"/>

        <rect width="520" height="42" rx="12" fill="#1E1B4B"/>
        <text x="20" y="27" fill="#818CF8" font-family="monospace" font-size="13" font-weight="700">SEMANTIC PROXIMITY</text>
        <text x="320" y="27" fill="#818CF8" font-family="monospace" font-size="13" font-weight="700">COSINE DISTANCE</text>

        <text x="20" y="75" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="14" font-weight="800">"Artificial Intelligence"</text>
        <text x="320" y="75" fill="#34D399" font-family="monospace" font-size="13" font-weight="800">0.00 (Self Reference)</text>

        <line x1="0" y1="95" x2="520" y2="95" stroke="#1E293B" stroke-width="1"/>

        <text x="20" y="125" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="14" font-weight="800">"Machine Learning"</text>
        <text x="320" y="125" fill="#34D399" font-family="monospace" font-size="13" font-weight="800">0.08 (High Similarity)</text>

        <line x1="0" y1="145" x2="520" y2="145" stroke="#1E293B" stroke-width="1"/>

        <text x="20" y="175" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="14" font-weight="800">"Smart autonomous agents"</text>
        <text x="320" y="175" fill="#38BDF8" font-family="monospace" font-size="13" font-weight="800">0.14 (Conceptual Match)</text>
      </g>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">Relational DBs excel at structured, deterministic lookups; Vector DBs excel at fuzzy, meaning-driven comprehension.</text>
    </g>
  </svg>`,

  // 9. PERSONAL KNOWLEDGE SYSTEM
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-190" y="-20" width="380" height="40" rx="20" fill="#0F172A" stroke="#EC4899" stroke-width="1.5"/>
      <text x="0" y="5" fill="#EC4899" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">09 · PRACTICAL APPLICATION</text>
    </g>

    <text x="800" y="160" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">BUILDING YOUR PERSONAL SECOND BRAIN WITH VECTORS</text>

    <!-- Left: Personal Notes Vault -->
    <g transform="translate(280, 440)" filter="url(#shadow)">
      <rect x="-140" y="-180" width="280" height="360" rx="18" fill="#0F172A" stroke="#EC4899" stroke-width="2.5"/>
      <rect x="-120" y="-155" width="130" height="28" rx="14" fill="#831843"/>
      <text x="-55" y="-137" fill="#F472B6" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">VAULT STORAGE</text>
      <text x="0" y="-95" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">Infinity Brain Vault</text>
      <text x="0" y="-70" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Obsidian / Markdown / PDFs</text>

      <g transform="translate(-115, -45)">
        <rect width="230" height="45" rx="8" fill="#1E293B" stroke="#334155" stroke-width="1"/>
        <text x="15" y="28" fill="#F8FAFC" font-family="monospace" font-size="12">📄 004-rag-notes.md</text>
      </g>
      <g transform="translate(-115, 10)">
        <rect width="230" height="45" rx="8" fill="#1E293B" stroke="#334155" stroke-width="1"/>
        <text x="15" y="28" fill="#F8FAFC" font-family="monospace" font-size="12">📄 013-agent-loops.md</text>
      </g>
      <g transform="translate(-115, 65)">
        <rect width="230" height="45" rx="8" fill="#1E293B" stroke="#334155" stroke-width="1"/>
        <text x="15" y="28" fill="#F8FAFC" font-family="monospace" font-size="12">📄 system-architecture.pdf</text>
      </g>
      <text x="0" y="150" fill="#EC4899" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Every idea preserved forever</text>
    </g>

    <path d="M 420 440 L 520 440" stroke="#EC4899" stroke-width="3" marker-end="url(#arrowCyan)"/>

    <!-- Center: Embedding & Vector Index -->
    <g transform="translate(800, 440)" filter="url(#shadow)">
      <rect x="-240" y="-190" width="480" height="380" rx="22" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
      <circle cx="0" cy="-60" r="70" fill="url(#glowCyan)"/>
      <circle cx="0" cy="-60" r="50" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2.5"/>
      <text x="0" y="-68" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">LOCAL EMBEDDING</text>
      <text x="0" y="-46" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="17" font-weight="900" text-anchor="middle">VECTOR BRAIN</text>

      <text x="0" y="30" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">Instant Semantic Cross-Referencing</text>
      <text x="0" y="55" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">Searches concepts across years of personal writing</text>

      <rect x="-210" y="80" width="420" height="65" rx="12" fill="#030712" stroke="#1E293B" stroke-width="1.5"/>
      <text x="0" y="106" fill="#34D399" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">"What did I learn about neural backprop 3 months ago?"</text>
      <text x="0" y="128" fill="#38BDF8" font-family="monospace" font-size="12" text-anchor="middle">➔ Retrieves exact paragraph without exact phrasing</text>
    </g>

    <path d="M 1040 440 L 1140 440" stroke="#34D399" stroke-width="3" marker-end="url(#arrowEmerald)"/>

    <!-- Right: Synthesized AI Assistant -->
    <g transform="translate(1320, 440)" filter="url(#shadow)">
      <rect x="-140" y="-180" width="280" height="360" rx="18" fill="#0F172A" stroke="#34D399" stroke-width="2.5"/>
      <rect x="-120" y="-155" width="130" height="28" rx="14" fill="#064E3B"/>
      <text x="-55" y="-137" fill="#34D399" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">ACTIVE AI</text>
      <text x="0" y="-95" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="20" font-weight="900" text-anchor="middle">Personal Copilot</text>
      <text x="0" y="-70" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">Context-Aware Responses</text>

      <rect x="-115" y="-45" width="230" height="150" rx="10" fill="#030712" stroke="#1E293B" stroke-width="1.5"/>
      <text x="-100" y="-18" fill="#34D399" font-family="system-ui, sans-serif" font-size="12" font-weight="800">AI RESPONSE:</text>
      <text x="-100" y="6" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="12">"In your June 12 notes,</text>
      <text x="-100" y="26" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="12">you noted that gradient</text>
      <text x="-100" y="46" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="12">descent adjusts weights</text>
      <text x="-100" y="66" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="12">proportional to error."</text>
      <text x="-100" y="92" fill="#38BDF8" font-family="monospace" font-size="11">[Source: 004-rag-notes.md]</text>

      <text x="0" y="150" fill="#34D399" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Your ideas, perfectly recalled</text>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">When you index your personal vault with embeddings, you convert static notes into an interactive thought partner.</text>
    </g>
  </svg>`,

  // 10. FINAL SUMMARY & NEURAL GALAXY
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
    ${sharedDefs}
    <rect width="1600" height="900" fill="url(#bgGrad)"/>
    <rect width="1600" height="900" fill="url(#grid)"/>
    <rect x="40" y="40" width="1520" height="820" fill="none" stroke="#334155" stroke-width="1.5" rx="24" stroke-dasharray="8 6"/>

    <g transform="translate(800, 85)">
      <rect x="-190" y="-20" width="380" height="40" rx="20" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
      <text x="0" y="5" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">10 · ARCHITECTURAL SUMMARY</text>
    </g>

    <text x="800" y="160" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="38" font-weight="900" text-anchor="middle">THE CORE ESSENCE OF VECTOR SEARCH IN 5 RULES</text>

    <!-- 5 Takeaway Pillar Cards -->
    <!-- Pillar 1 -->
    <g transform="translate(190, 440)" filter="url(#shadow)">
      <rect x="-120" y="-180" width="240" height="360" rx="16" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="0" cy="-120" r="28" fill="#0C4A6E"/>
      <text x="0" y="-112" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">1</text>
      <text x="0" y="-70" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">Meaning &gt; Words</text>
      <rect x="-100" y="-40" width="200" height="180" rx="8" fill="#030712" stroke="#1E293B" stroke-width="1"/>
      <text x="0" y="-15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Semantic Storage</text>
      <text x="0" y="15" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Vector DBs store</text>
      <text x="0" y="38" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">conceptual meaning,</text>
      <text x="0" y="61" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">not literal character</text>
      <text x="0" y="84" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">strings.</text>
      <text x="0" y="120" fill="#38BDF8" font-family="monospace" font-size="12" font-weight="800" text-anchor="middle">"car" ≈ "vehicle"</text>
    </g>

    <!-- Pillar 2 -->
    <g transform="translate(495, 440)" filter="url(#shadow)">
      <rect x="-120" y="-180" width="240" height="360" rx="16" fill="#0F172A" stroke="#6366F1" stroke-width="2"/>
      <circle cx="0" cy="-120" r="28" fill="#1E1B4B"/>
      <text x="0" y="-112" fill="#818CF8" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">2</text>
      <text x="0" y="-70" fill="#818CF8" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">Embeddings</text>
      <rect x="-100" y="-40" width="200" height="180" rx="8" fill="#030712" stroke="#1E293B" stroke-width="1"/>
      <text x="0" y="-15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">GPS Coordinates</text>
      <text x="0" y="15" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Text is projected</text>
      <text x="0" y="38" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">into continuous</text>
      <text x="0" y="61" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">high-dimensional</text>
      <text x="0" y="84" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">idea space.</text>
      <text x="0" y="120" fill="#818CF8" font-family="monospace" font-size="11" font-weight="800" text-anchor="middle">[0.12, -0.44, ...]</text>
    </g>

    <!-- Pillar 3 -->
    <g transform="translate(800, 440)" filter="url(#shadow)">
      <rect x="-120" y="-180" width="240" height="360" rx="16" fill="#0F172A" stroke="#34D399" stroke-width="2.5"/>
      <circle cx="0" cy="-120" r="28" fill="#064E3B"/>
      <text x="0" y="-112" fill="#34D399" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">3</text>
      <text x="0" y="-70" fill="#34D399" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">Nearest Neighbors</text>
      <rect x="-100" y="-40" width="200" height="180" rx="8" fill="#030712" stroke="#1E293B" stroke-width="1"/>
      <text x="0" y="-15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Geometric Proximity</text>
      <text x="0" y="15" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Similarity is</text>
      <text x="0" y="38" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">measured via cosine</text>
      <text x="0" y="61" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">angle or Euclidean</text>
      <text x="0" y="84" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">distance.</text>
      <text x="0" y="120" fill="#34D399" font-family="monospace" font-size="11" font-weight="800" text-anchor="middle">cos(θ) → 1.0 (Close)</text>
    </g>

    <!-- Pillar 4 -->
    <g transform="translate(1105, 440)" filter="url(#shadow)">
      <rect x="-120" y="-180" width="240" height="360" rx="16" fill="#0F172A" stroke="#F59E0B" stroke-width="2"/>
      <circle cx="0" cy="-120" r="28" fill="#78350F"/>
      <text x="0" y="-112" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">4</text>
      <text x="0" y="-70" fill="#FBBF24" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">Powers RAG</text>
      <rect x="-100" y="-40" width="200" height="180" rx="8" fill="#030712" stroke="#1E293B" stroke-width="1"/>
      <text x="0" y="-15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">AI Memory Backbone</text>
      <text x="0" y="15" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Supplies real-world</text>
      <text x="0" y="38" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">verified facts to</text>
      <text x="0" y="61" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">prevent language</text>
      <text x="0" y="84" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">hallucinations.</text>
      <text x="0" y="120" fill="#FBBF24" font-family="monospace" font-size="11" font-weight="800" text-anchor="middle">Grounded AI Truth</text>
    </g>

    <!-- Pillar 5 -->
    <g transform="translate(1410, 440)" filter="url(#shadow)">
      <rect x="-120" y="-180" width="240" height="360" rx="16" fill="#0F172A" stroke="#EC4899" stroke-width="2"/>
      <circle cx="0" cy="-120" r="28" fill="#831843"/>
      <text x="0" y="-112" fill="#F472B6" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">5</text>
      <text x="0" y="-70" fill="#F472B6" font-family="system-ui, sans-serif" font-size="16" font-weight="900" text-anchor="middle">Personal Vault</text>
      <rect x="-100" y="-40" width="200" height="180" rx="8" fill="#030712" stroke="#1E293B" stroke-width="1"/>
      <text x="0" y="-15" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle">Second Brain</text>
      <text x="0" y="15" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Connects your notes,</text>
      <text x="0" y="38" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">documents, and</text>
      <text x="0" y="61" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">thoughts into an</text>
      <text x="0" y="84" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">active memory core.</text>
      <text x="0" y="120" fill="#F472B6" font-family="monospace" font-size="11" font-weight="800" text-anchor="middle">Infinity Brain Vault</text>
    </g>

    <g transform="translate(800, 815)">
      <rect x="-440" y="-20" width="880" height="40" rx="20" fill="#0B1120" stroke="#334155" stroke-width="1.2"/>
      <text x="0" y="5" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="500" text-anchor="middle">Vector databases transform passive language models into grounded, high-precision intelligence engines.</text>
    </g>
  </svg>`
];

async function generateAllAssets() {
  console.log(`Starting generation of ${svgs.length} editorial JPG assets for Deep Node #004...`);

  for (let i = 0; i < svgs.length; i++) {
    const assetNum = i + 1;
    const svgStr = svgs[i];
    const targetPath = path.join(outputDir, `${assetNum}.jpg`);
    const svgBuffer = Buffer.from(svgStr);

    await sharp(svgBuffer)
      .flatten({ background: { r: 5, g: 7, b: 11 } })
      .jpeg({ quality: 92 })
      .toFile(targetPath);

    console.log(`✓ Generated: ${targetPath}`);
  }

  console.log('All Deep Node #004 image assets successfully rendered!');
}

generateAllAssets().catch(err => {
  console.error('Fatal error generating assets:', err);
  process.exit(1);
});
