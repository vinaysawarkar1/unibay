#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const input = process.argv[2] || 'data/products-extracted.json';
const outDir = process.argv[3] || 'public/images/pcs_specialist';
const concurrency = parseInt(process.env.CONCURRENCY || '6', 10);

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input);
  process.exit(2);
}

const raw = JSON.parse(fs.readFileSync(input, 'utf8'));
const items = raw.items || [];
const images = [];
items.forEach(it => {
  const p = it.product || {};
  const imgs = p.images || p.image || [];
  (Array.isArray(imgs) ? imgs : [imgs]).forEach(u => { if (u) images.push({ url: u, from: it.url }); });
});

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function downloadOne(obj, idx) {
  const url = obj.url;
  try {
    const parsed = new URL(url);
    const basename = path.basename(parsed.pathname).split('?')[0] || `img-${idx}.jpg`;
    const dest = path.join(outDir, basename);
    const w = fs.createWriteStream(dest);
    const res = await axios.get(url, { responseType: 'stream', timeout: 20000 });
    res.data.pipe(w);
    await new Promise((resolve, reject) => w.on('finish', resolve).on('error', reject));
    return { url, path: dest };
  } catch (err) {
    return { url, error: err.message || err };
  }
}

async function run() {
  const results = [];
  let idx = 0;
  while (idx < images.length) {
    const batch = images.slice(idx, idx + concurrency);
    const promises = batch.map((b, i) => downloadOne(b, idx + i));
    const res = await Promise.all(promises);
    results.push(...res);
    idx += concurrency;
    process.stdout.write(`\rDownloaded ${Math.min(idx, images.length)}/${images.length}`);
  }
  const out = path.join(path.dirname(input), 'images-downloaded.json');
  fs.writeFileSync(out, JSON.stringify({ downloadedAt: new Date().toISOString(), results }, null, 2));
  console.log('\nWrote', out);
}

run();
