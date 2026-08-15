const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SUBSTACK_FEED_URL = 'https://xrcodex.substack.com/feed';
const ISSUES_DIR = path.join(__dirname, '..', 'content', 'issues');

const ISSUE_MAPPING = [
  { match: /ai agents 101/i, filename: '032-ai-agents-101.mdx', num: 7 },
  { match: /graph engineering/i, filename: '031-graph-engineering-beyond-single-ai-loops.mdx', num: 6 },
  { match: /loop engineering/i, filename: '030-loop-engineering-what-makes-ai-agents-improve-themselves.mdx', num: 5 },
  { match: /harness is the kitchen/i, filename: '029-the-prompt-is-just-one-ingredient-the-harness-is-the-kitchen.mdx', num: 4 },
  { match: /context engineering/i, filename: '028-better-input-better-output-thats-context-engineering.mdx', num: 3 },
  { match: /rag isn['’]t dead/i, filename: '027-rag-isnt-dead-most-people-just-dont-understand-it.mdx', num: 2 },
  { match: /buzzword|prompt engineering/i, filename: '026-prompt-engineering-isnt-dead-its-evolving.mdx', num: 1 },
];

function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Too many redirects while fetching Substack feed'));
    }
    if (!url.startsWith('https://')) {
      return reject(new Error('Insecure protocol blocked in Substack sync'));
    }
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, url).toString();
        return fetchUrl(nextUrl, maxRedirects - 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}


function extractCDATA(str) {
  if (!str) return '';
  const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1] : str.replace(/<[^>]+>/g, '').trim();
}

function parseItemsFromRss(xml) {
  const items = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

    const title = extractCDATA(titleMatch ? titleMatch[1] : '');
    const link = extractCDATA(linkMatch ? linkMatch[1] : '');
    const pubDateStr = extractCDATA(pubDateMatch ? pubDateMatch[1] : '');

    items.push({ title, link, pubDateStr });
  }

  return items;
}

async function syncSubstackDates() {
  console.log(`Fetching Substack RSS feed from ${SUBSTACK_FEED_URL}...`);
  const xml = await fetchUrl(SUBSTACK_FEED_URL);
  const items = parseItemsFromRss(xml);
  console.log(`Found ${items.length} items in Substack RSS feed.`);

  for (const item of items) {
    const mapping = ISSUE_MAPPING.find((m) => m.match.test(item.title));
    const targetFilename = mapping ? mapping.filename : null;

    if (targetFilename) {
      const targetPath = path.join(ISSUES_DIR, targetFilename);
      if (fs.existsSync(targetPath)) {
        let content = fs.readFileSync(targetPath, 'utf8');

        // Extract ISO Date String (YYYY-MM-DD) from pubDate
        const pubDateObj = new Date(item.pubDateStr);
        const isoDate = pubDateObj.toISOString().split('T')[0];

        // Replace frontmatter date
        content = content.replace(/date:\s*"[^"]+"/, `date: "${isoDate}"`);

        // Also update date inside sources if present
        content = content.replace(/(publisher:\s*"Substack[^"]*"\s*\n\s*date:\s*)"[^"]+"/, `$1"${isoDate}"`);
        content = content.replace(/(publisher:\s*"Piyush's Dispatch[^"]*"\s*\n\s*date:\s*)"[^"]+"/, `$1"${isoDate}"`);

        fs.writeFileSync(targetPath, content, 'utf8');
        console.log(`  Updated ${targetFilename} -> date: "${isoDate}" (${item.pubDateStr})`);
      }
    }
  }

  console.log('Substack date synchronization completed successfully!');
}

syncSubstackDates().catch((err) => {
  console.error('Sync Error:', err);
  process.exit(1);
});
