#!/usr/bin/env node
const fs = require('fs');

function usage() {
  console.log('Usage: node scripts/extract_product_urls.js <input.json> <output.json> [pattern]');
  console.log('Default pattern matches many product/catalog paths on pcspecialist.');
}

const input = process.argv[2] || 'data/sitemap-urls.json';
const out = process.argv[3] || 'data/product-urls.json';
const pattern = process.argv[4] || '/(desktop-pcs|custom-laptops|custom-pc|gaming-laptops|pre-built|computers-for-next-day-delivery|custom-laptops|laptops|products|product|desktop-pc|computer)/i';

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input);
  usage();
  process.exit(2);
}

let data = JSON.parse(fs.readFileSync(input, 'utf8'));
let urls = Array.isArray(data) ? data : (data.urls || []);

let regex;
try {
  if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) {
    const last = pattern.lastIndexOf('/');
    const body = pattern.slice(1, last);
    const flags = pattern.slice(last+1);
    regex = new RegExp(body, flags);
  } else {
    regex = new RegExp(pattern, 'i');
  }
} catch (err) {
  console.error('Invalid pattern, using default. Error:', err.message || err);
  regex = /desktop-pcs|custom-laptops|custom-pc|gaming-laptops|pre-built|computers-for-next-day-delivery|laptops|product/i;
}

const filtered = urls.filter(u => regex.test(u));
if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });
fs.writeFileSync(out, JSON.stringify({ extractedAt: new Date().toISOString(), pattern: pattern, urls: filtered }, null, 2));
console.log('Wrote', out, 'with', filtered.length, 'product-like URLs');
