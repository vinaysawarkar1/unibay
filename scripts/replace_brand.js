#!/usr/bin/env node
const fs = require('fs');
const paths = process.argv.slice(2);
if (!paths.length) {
  console.error('Usage: node scripts/replace_brand.js <file> [files..]');
  process.exit(2);
}
for (const p of paths) {
  if (!fs.existsSync(p)) {
    console.warn('Skipping missing', p);
    continue;
  }
  let s = fs.readFileSync(p, 'utf8');
  // Replace NEXUS (case-insensitive) with UNIBAY, and nexus- with unibay-
  s = s.replace(/\bnexus-/gi, 'unibay-');
  s = s.replace(/\bNEXUS\b/g, 'UNIBAY');
  s = s.replace(/\bNexus\b/g, 'Unibay');
  s = s.replace(/\bnexus\b/gi, 'unibay');
  fs.writeFileSync(p, s, 'utf8');
  console.log('Patched', p);
}
