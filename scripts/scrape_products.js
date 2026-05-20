#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const input = process.argv[2] || 'data/product-urls.json';
const out = process.argv[3] || 'data/products-extracted.json';
const concurrency = parseInt(process.env.CONCURRENCY || '4', 10);

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input);
  process.exit(2);
}

const raw = JSON.parse(fs.readFileSync(input, 'utf8'));
const urls = raw.urls || raw;

async function fetchHtml(url) {
  try {
    const res = await axios.get(url, { timeout: 20000, headers: { 'User-Agent': 'Unibay-Migrant/1.0 (+https://github.com/VinaySawarkar1/unibay)' } });
    return res.data;
  } catch (err) {
    console.error('Fetch error', url, err.message || err);
    return null;
  }
}

function extractJsonLd($) {
  const scripts = $('script[type="application/ld+json"]');
  const out = [];
  scripts.each((i, el) => {
    try {
      const txt = $(el).contents().text();
      const j = JSON.parse(txt);
      out.push(j);
    } catch (e) {
      // ignore
    }
  });
  return out;
}

function extractSimple($, url) {
  const title = $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || '';
  const desc = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
  const price = $('[itemprop=price]').attr('content') || $('[data-price], .price').first().text().trim() || '';
  const images = [];
  $('img').each((i, img) => {
    const src = $(img).attr('src') || $(img).attr('data-src');
    if (src && src.startsWith('http')) images.push(src);
  });
  return { url, title, description: desc, price: price && price.replace(/\s+/g, ' '), images };
}

async function processUrl(url) {
  const html = await fetchHtml(url);
  if (!html) return { url, error: 'fetch-failed' };
  const $ = cheerio.load(html);
  const jsonld = extractJsonLd($);
  // try to find Product schema
  let product = null;
  for (const j of jsonld) {
    if (Array.isArray(j)) {
      for (const item of j) if (item && item['@type'] && /Product/i.test(item['@type'])) product = item;
    } else if (j && j['@type'] && /Product/i.test(j['@type'])) {
      product = j; break;
    }
  }
  if (product) {
    // normalize images to absolute
    if (product.image) {
      const imgs = Array.isArray(product.image) ? product.image : [product.image];
      product.images = imgs.map(i => (i && i.startsWith('http')) ? i : i);
    }
    product.url = url;
    return { url, product };
  }
  // fallback
  const simple = extractSimple($, url);
  return { url, product: simple };
}

async function run() {
  const results = [];
  let idx = 0;
  const queue = urls.slice();
  const workers = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push((async () => {
      while (queue.length) {
        const u = queue.shift();
        idx++;
        process.stdout.write(`\rProcessing ${idx}/${urls.length}: ${u}\n`);
        try {
          const res = await processUrl(u);
          results.push(res);
        } catch (err) {
          results.push({ url: u, error: err.message || err });
        }
        // polite delay
        await new Promise(r => setTimeout(r, 200));
      }
    })());
  }
  await Promise.all(workers);
  if (!fs.existsSync(path.dirname(out))) fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ extractedAt: new Date().toISOString(), source: input, items: results }, null, 2));
  console.log('\nWrote', out, 'with', results.length, 'items');
}

run();
