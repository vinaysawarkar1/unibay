#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const migratedFile = process.argv[2] || 'data/migrated_products.json';
const productsFile = process.argv[3] || 'data/products.json';

if (!fs.existsSync(migratedFile)) {
  console.error('Missing', migratedFile);
  process.exit(2);
}
if (!fs.existsSync(productsFile)) {
  console.error('Missing', productsFile);
  process.exit(2);
}

const migrated = JSON.parse(fs.readFileSync(migratedFile, 'utf8'));
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

const byCategory = {
  laptop: 'laptops',
  desktop: 'desktops',
  accessory: 'accessories',
  other: 'accessories'
};

function existsAlready(list, item) {
  return list.some(p => (p.sourceUrl && item.sourceUrl && p.sourceUrl === item.sourceUrl) || p.slug === item.slug || p.id === item.id);
}

for (const it of (migrated.items || [])) {
  const cat = it.category || 'other';
  const section = byCategory[cat] || 'accessories';
  if (!products[section]) products[section] = [];
  if (existsAlready(products[section], it)) continue;
  const obj = {
    id: it.id,
    name: it.name,
    slug: it.slug,
    category: cat,
    tagline: it.description ? it.description.slice(0, 80) : '',
    description: it.description || '',
    basePrice: it.basePrice || 0,
    images: [],
    badge: '',
    rating: 0,
    reviewCount: 0,
    specs: {},
    features: [],
    colors: [],
    stock: 'unknown',
    deliveryDays: null,
    sourceUrl: it.sourceUrl
  };
  products[section].push(obj);
}

fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
console.log('Merged migrated products into', productsFile);
