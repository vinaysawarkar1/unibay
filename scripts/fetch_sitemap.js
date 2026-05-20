#!/usr/bin/env node
const fs = require('fs');
const https = require('https');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchText(res.headers.location));
      }
      if (res.statusCode !== 200) return reject(new Error('Request failed: ' + res.statusCode));
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const url = process.argv[2] || 'https://www.pcspecialist.co.uk/sitemap.xml';
  const out = process.argv[3] || 'data/sitemap-urls.json';
  try {
    console.log('Fetching sitemap:', url);
    const txt = await fetchText(url);
    const locs = [];
    const re = /<loc>([^<]+)<\/loc>/gi;
    let m;
    while ((m = re.exec(txt)) !== null) locs.push(m[1].trim());
    const unique = Array.from(new Set(locs));
    if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync(out, JSON.stringify({ fetchedAt: new Date().toISOString(), source: url, urls: unique }, null, 2));
    console.log('Wrote', out, 'with', unique.length, 'urls');
  } catch (err) {
    console.error('Error fetching sitemap:', err.message || err);
    process.exitCode = 2;
  }
}

main();
