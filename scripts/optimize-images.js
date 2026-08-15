#!/usr/bin/env node
/**
 * Image optimization script.
 *
 * Walks `public/assets/**/*.{jpg,jpeg,png}`, generates `.webp` and `.avif`
 * variants alongside each source file, and resizes the original JPGs to a
 * generous-but-bounded max width. Next.js's `next/image` component will
 * prefer these modern formats via `formats: ['image/avif', 'image/webp']`.
 *
 * Idempotent: skips outputs that are newer than the input.
 *
 * Run with: `node scripts/optimize-images.js`
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const MAX_WIDTH = 1600;       // Hero images cap at 1600px wide
const QUALITY = {
  jpg: 78,
  webp: 72,
  avif: 50,
};
const ALLOW_EXT = new Set(['.jpg', '.jpeg', '.png']);

let scanned = 0;
let converted = 0;
let skipped = 0;
let savedBytes = 0;

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeOne(file) {
  scanned++;
  const ext = path.extname(file).toLowerCase();
  if (!ALLOW_EXT.has(ext)) return;
  if (file.includes('%23') || /[#%]/.test(path.dirname(file))) return;

  const dir = path.dirname(file);
  const base = path.basename(file, ext);
  const outWebp = path.join(dir, `${base}.webp`);
  const outAvif = path.join(dir, `${base}.avif`);

  const srcStat = fs.statSync(file);
  const needsRecompute = (target) => {
    try {
      return !fs.existsSync(target) || fs.statSync(target).mtimeMs < srcStat.mtimeMs;
    } catch {
      return true;
    }
  };

  let pipeline = sharp(file, { failOn: 'none' }).rotate();
  // Resize only if source is wider than the cap.
  const meta = await sharp(file, { failOn: 'none' }).metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (needsRecompute(outWebp)) {
    const buf = await pipeline.clone().webp({ quality: QUALITY.webp, effort: 4 }).toBuffer();
    fs.writeFileSync(outWebp, buf);
    savedBytes += Math.max(0, srcStat.size - buf.length);
    converted++;
  } else {
    skipped++;
  }

  if (needsRecompute(outAvif)) {
    const buf = await pipeline.clone().avif({ quality: QUALITY.avif, effort: 4 }).toBuffer();
    fs.writeFileSync(outAvif, buf);
    savedBytes += Math.max(0, srcStat.size - buf.length);
    converted++;
  } else {
    skipped++;
  }

  // Recompress JPG/PNG originals in place when they're larger than the cap.
  if (meta.width && meta.width > MAX_WIDTH) {
    const tmpPath = file + '.tmp';
    const buf = await sharp(file, { failOn: 'none' })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY.jpg, mozjpeg: true, progressive: true })
      .toBuffer();
    if (buf.length < srcStat.size) {
      fs.writeFileSync(tmpPath, buf);
      fs.renameSync(tmpPath, file);
      savedBytes += srcStat.size - buf.length;
    }
  }
}

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile()) {
      try {
        await optimizeOne(full);
      } catch (err) {
        console.error(`[skip] ${full}: ${err.message}`);
      }
    }
  }
}

(async () => {
  const t0 = Date.now();
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`No assets dir at ${ASSETS_DIR}`);
    process.exit(1);
  }
  await walk(ASSETS_DIR);
  const ms = Date.now() - t0;
  console.log(`\nScanned: ${scanned}  Converted: ${converted}  Skipped: ${skipped}`);
  console.log(`Net savings: ${fmtBytes(savedBytes)}  Elapsed: ${ms}ms`);
})();
