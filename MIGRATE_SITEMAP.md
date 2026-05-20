# Sitemap fetch & product URL extraction

Two small helper scripts are included under `scripts/` to help fetch and filter the PCSpecialist sitemap.

1) Fetch sitemap and write JSON:

```bash
node scripts/fetch_sitemap.js https://www.pcspecialist.co.uk/sitemap.xml data/sitemap-urls.json
```

Output: `data/sitemap-urls.json` with a top-level `urls` array.

2) Extract product-like URLs from the sitemap JSON:

```bash
node scripts/extract_product_urls.js data/sitemap-urls.json data/product-urls.json
```

Optional third argument is a regex pattern (JS syntax) to select URLs, e.g.: `/desktop-pcs|custom-laptops/i`.

After you run these, review `data/product-urls.json` and tell me which sections to scrape next (product pages, images, or full content).
