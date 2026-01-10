const XLSX = require('xlsx');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

// Configuration
const EXCEL_FILE = '../FV TOP PRODUCTS.xlsx';
const OUTPUT_FILE = '../top-products-data.js';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400/D4A574/2A2320?text=No+Image';
const DELAY_MS = 1000; // Delay between requests to be respectful (increased for Amazon)

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function isPlaceholderImage(imageUrl) {
  if (!imageUrl) return true;
  const u = String(imageUrl).trim();
  if (!u) return true;
  if (u === PLACEHOLDER_IMAGE) return true;
  return u.startsWith('https://via.placeholder.com/');
}

function amazonAsinFromUrl(url) {
  // Regex-first (more tolerant of odd characters in query strings)
  try {
    const s = String(url || '');
    const m =
      s.match(/\/dp\/([A-Z0-9]{10})/i) ||
      s.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (m && m[1]) return String(m[1]).toUpperCase();
  } catch (e) {
    // ignore
  }

  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const dpIndex = parts.findIndex(p => p.toLowerCase() === 'dp');
    if (dpIndex >= 0 && parts[dpIndex + 1]) return parts[dpIndex + 1];
  } catch (e) {
    // ignore
  }
  return '';
}

// A lookup key used ONLY to reuse existing images across tracking-param changes.
function canonicalLookupKey(url) {
  const asin = amazonAsinFromUrl(url);
  if (asin) return `amazon:${asin}`;
  return '';
}

function loadCollectionsFromJsText(jsText) {
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(jsText, sandbox, { timeout: 1000 });
  return sandbox.module.exports.collections || [];
}

function buildExistingByKey() {
  const byKey = new Map();

  const ingestCollections = (collections) => {
    for (const c of collections || []) {
      for (const p of c.products || []) {
        const url = normalizeUrl(p.url);
        if (!url) continue;
        const imageUrl = (p.imageUrl || '').trim();
        const name = (p.name || '').trim();

        const exactKey = url;
        const canonKey = canonicalLookupKey(url);

        // Prefer non-placeholder images if there is a conflict.
        const existingExact = byKey.get(exactKey);
        if (!existingExact || (isPlaceholderImage(existingExact.imageUrl) && !isPlaceholderImage(imageUrl))) {
          byKey.set(exactKey, { name, imageUrl });
        }

        if (canonKey) {
          const existingCanon = byKey.get(canonKey);
          if (!existingCanon || (isPlaceholderImage(existingCanon.imageUrl) && !isPlaceholderImage(imageUrl))) {
            byKey.set(canonKey, { name, imageUrl });
          }
        }
      }
    }
  };

  // 1) Load from working tree file (if present)
  try {
    const localPath = path.join(__dirname, OUTPUT_FILE);
    if (fs.existsSync(localPath)) {
      const jsText = fs.readFileSync(localPath, 'utf8');
      ingestCollections(loadCollectionsFromJsText(jsText));
    }
  } catch (e) {
    // ignore
  }

  // 2) Also load from last committed version (helps if working tree has placeholders)
  try {
    const repoRoot = path.join(__dirname, '..');
    const jsText = execSync('git show HEAD:top-products-data.js', { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    ingestCollections(loadCollectionsFromJsText(jsText));
  } catch (e) {
    // ignore (not a git repo or file missing in commit)
  }

  return byKey;
}

// Normalize URLs so dedupe is reliable and inputs are consistent
function normalizeUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = String(rawUrl).trim();
  if (!url) return '';

  // Fix common missing-protocol cases
  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('www.')) url = `https://${url}`;
  if (url.startsWith('amazon.com/')) url = `https://www.${url}`;
  if (url.startsWith('amzn.to/')) url = `https://${url}`;

  // If it still isn't absolute, try to make it absolute (best effort)
  if (!/^https?:\/\//i.test(url)) {
    // Some spreadsheets omit protocol but include domain
    if (url.includes('.')) {
      url = `https://${url}`;
    } else {
      return '';
    }
  }

  return url;
}

// Parse the XLSX into [{ collection, url }] supporting both:
// - legacy 2-column sheets (collection, url)
// - current multi-column sheet with long/short affiliate links
function parseSpreadsheetRows(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  if (!rows.length) return [];

  const headerRow = rows[0].map((h) => String(h || '').trim());
  const headerLower = headerRow.map((h) => h.toLowerCase());
  const hasHeader = headerLower.some((h) => h.includes('collection'));

  const idxCollection = hasHeader
    ? headerLower.findIndex((h) => h.includes('collection'))
    : 0;

  const idxItem = hasHeader
    ? headerLower.findIndex((h) => h === 'item' || h.includes('item'))
    : -1;

  // Prefer non-affiliate long link (if present), then long affiliate, then short affiliate.
  const idxLongNon = hasHeader
    ? headerLower.findIndex((h) => h.includes('long') && h.includes('non'))
    : -1;
  const idxLongAff = hasHeader
    ? headerLower.findIndex((h) => h.includes('long') && h.includes('affiliate') && !h.includes('non'))
    : -1;
  const idxShortAff = hasHeader
    ? headerLower.findIndex((h) => h.includes('short') && h.includes('affiliate'))
    : -1;

  // Legacy format: take 2nd column as URL
  const idxLegacyUrl = 1;

  const start = hasHeader ? 1 : 0;
  const parsed = [];

  for (let i = start; i < rows.length; i++) {
    const row = rows[i] || [];
    const collection = String(row[idxCollection] || '').trim();
    if (!collection) continue;

    const item = idxItem >= 0 ? String(row[idxItem] || '').trim() : '';

    const rawUrlCandidate =
      (idxLongNon >= 0 && row[idxLongNon]) ||
      (idxLongAff >= 0 && row[idxLongAff]) ||
      (idxShortAff >= 0 && row[idxShortAff]) ||
      row[idxLegacyUrl];

    const url = normalizeUrl(rawUrlCandidate);
    if (!url) continue;

    parsed.push({ collection, url, item });
  }

  return parsed;
}

// Helper function to clean and format product names
function cleanProductName(name) {
  if (!name) return '';
  
  // Remove common suffixes from titles
  name = name.replace(/\s*[-–|]\s*.*$/, ''); // Remove everything after dash or pipe
  name = name.trim();
  
  return name;
}

// Helper function to convert URL slug to readable name
function slugToName(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p);
    const lastPart = pathParts[pathParts.length - 1];
    
    // Remove file extensions and clean up
    let name = lastPart.replace(/\.[^/.]+$/, '');
    
    // Replace hyphens and underscores with spaces
    name = name.replace(/[-_]/g, ' ');
    
    // Capitalize each word
    name = name.replace(/\b\w/g, char => char.toUpperCase());
    
    return name;
  } catch (e) {
    return 'Product';
  }
}

// Try to derive a decent product name from Amazon URL path
function amazonUrlToName(url) {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(Boolean);

    const dpIndex = parts.findIndex(p => p.toLowerCase() === 'dp');
    if (dpIndex > 0) {
      const candidate = parts[dpIndex - 1];
      if (candidate && candidate.includes('-')) {
        return candidate
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
      }
    }

    // If the URL is /dp/<ASIN> without a name segment, return a stable fallback
    if (dpIndex === 0 && parts[1]) {
      const asin = String(parts[1]).trim();
      if (asin) return `Product ${asin}`;
    }

    // Fallback: pick the first long hyphenated segment
    const fallback = parts.find(p => p.includes('-') && p.length >= 8);
    if (fallback) {
      return fallback
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    }
  } catch (e) {
    // ignore
  }

  return '';
}

// Function to extract Amazon product image
function extractAmazonImage($, finalUrl) {
  // Try multiple Amazon-specific selectors
  const selectors = [
    '#landingImage',
    '#imgBlkFront',
    '#main-image',
    'img.a-dynamic-image',
    '[data-a-dynamic-image]',
    '.imgTagWrapper img',
    '#imageBlock img'
  ];
  
  for (const selector of selectors) {
    const img = $(selector).first();
    if (img.length) {
      // Try data-a-dynamic-image attribute first (contains image URLs)
      const dynamicImage = img.attr('data-a-dynamic-image');
      if (dynamicImage) {
        try {
          const imageData = JSON.parse(dynamicImage);
          const imageUrls = Object.keys(imageData);
          if (imageUrls.length > 0) {
            // Get the largest image (first one is usually largest)
            return imageUrls[0];
          }
        } catch (e) {
          // If JSON parse fails, continue to next method
        }
      }
      
      // Try src attribute
      const src = img.attr('src');
      if (src && src.includes('images-amazon.com') && !src.includes('spinner')) {
        return src.replace(/_[A-Z0-9]+_\./, '._AC_SL1500_.');  // Try to get larger version
      }
    }
  }
  
  return null;
}

// Function to fetch Open Graph data from a URL
async function fetchOGData(url) {
  try {
    console.log(`  Fetching: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 15000,
      maxRedirects: 10,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });
    
    const finalUrl = response.request.res.responseUrl || url;
    const $ = cheerio.load(response.data);
    
    // Detect if this is an Amazon URL
    const isAmazon = finalUrl.includes('amazon.com') || finalUrl.includes('amzn.to');
    
    // Try to get product name from various meta tags
    let productName = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('#productTitle').text().trim() ||  // Amazon specific
      $('title').text() ||
      slugToName(url);
    
    productName = cleanProductName(productName);

    // If Amazon returns a generic title (often due to bot pages), derive from URL instead
    if (!productName || /^amazon\.com\b/i.test(productName)) {
      const derived = amazonUrlToName(finalUrl) || amazonUrlToName(url);
      if (derived) {
        productName = derived;
      }
    }
    
    // Try to get image
    let imageUrl = null;
    
    // For Amazon, use specific extraction
    if (isAmazon) {
      imageUrl = extractAmazonImage($, finalUrl);
      console.log(`  → Amazon detected, extracted image: ${imageUrl ? 'YES' : 'NO'}`);
    }
    
    // Fallback to Open Graph tags
    if (!imageUrl) {
      imageUrl = 
        $('meta[property="og:image"]').attr('content') ||
        $('meta[property="og:image:secure_url"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        $('meta[name="twitter:image:src"]').attr('content');
    }
    
    // Use placeholder if no image found
    if (!imageUrl) {
      imageUrl = PLACEHOLDER_IMAGE;
      console.log(`  ⚠ No image found, using placeholder`);
    } else {
      // Make sure image URL is absolute
      if (!imageUrl.startsWith('http')) {
        const urlObj = new URL(finalUrl);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }
      console.log(`  ✓ Found image`);
    }
    
    console.log(`  ✓ Found: ${productName}`);
    
    return {
      name: productName,
      imageUrl: imageUrl,
      url: url
    };
  } catch (error) {
    console.error(`  ✗ Error fetching ${url}:`, error.message);
    return {
      name: slugToName(url),
      imageUrl: PLACEHOLDER_IMAGE,
      url: url
    };
  }
}

// Function to generate a URL-friendly ID from collection name
function generateId(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Main function
async function main() {
  console.log('Fashion Vault - Product Data Fetcher');
  console.log('=====================================\n');
  
  // Read Excel file
  console.log('Reading Excel file...');
  const workbook = XLSX.readFile(path.join(__dirname, EXCEL_FILE));
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawRows = parseSpreadsheetRows(sheet);
  if (!rawRows.length) {
    console.log('No valid rows found in spreadsheet. Please check the sheet format.');
    return;
  }

  // Dedupe by URL within each collection (keep first occurrence)
  const seenByCollection = new Map(); // collectionName -> Set(url)
  const rows = [];
  let duplicatesRemoved = 0;

  for (const row of rawRows) {
    const collectionName = row.collection.trim();
    const url = row.url.trim();
    const item = (row.item || '').trim();

    if (!seenByCollection.has(collectionName)) {
      seenByCollection.set(collectionName, new Set());
    }
    const seen = seenByCollection.get(collectionName);
    if (seen.has(url)) {
      duplicatesRemoved++;
      continue;
    }
    seen.add(url);
    rows.push({ collection: collectionName, url, item });
  }

  console.log(
    `Found ${rows.length} products to process` +
      (duplicatesRemoved ? ` (${duplicatesRemoved} duplicates removed)` : '') +
      '\n'
  );
  
  // Build a lookup of existing products so we don't wipe images when Amazon blocks scraping
  const existingByKey = buildExistingByKey();
  if (existingByKey.size) {
    console.log(`Loaded ${existingByKey.size} existing product lookups (for image preservation)\n`);
  }

  // Group by collection
  const collectionMap = new Map();
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const collectionName = row.collection.trim();
    
    console.log(`[${i + 1}/${rows.length}] Processing ${collectionName}...`);
    
    if (!collectionMap.has(collectionName)) {
      collectionMap.set(collectionName, {
        id: generateId(collectionName),
        name: collectionName,
        description: `Curated ${collectionName.toLowerCase()}`,
        products: []
      });
    }
    
    // If we already have a non-placeholder image for this URL (or same Amazon ASIN),
    // reuse it to avoid losing images when Amazon blocks scraping.
    const normalizedUrl = normalizeUrl(row.url) || row.url;
    const exactExisting = existingByKey.get(normalizedUrl) || null;
    const canonKey = canonicalLookupKey(normalizedUrl);
    const canonExisting = canonKey ? (existingByKey.get(canonKey) || null) : null;
    const existing =
      (exactExisting && !isPlaceholderImage(exactExisting.imageUrl))
        ? exactExisting
        : (canonExisting && !isPlaceholderImage(canonExisting.imageUrl))
          ? canonExisting
          : exactExisting;

    if (existing && existing.imageUrl && !isPlaceholderImage(existing.imageUrl)) {
      const nameFromSheet = cleanProductName(row.item || '');
      const nameFromExisting = cleanProductName(existing.name || '');
      const stableName = nameFromSheet || nameFromExisting || slugToName(normalizedUrl);

      collectionMap.get(collectionName).products.push({
        name: stableName,
        imageUrl: existing.imageUrl,
        url: normalizedUrl
      });
    } else {
      // Fetch product data
      const productData = await fetchOGData(normalizedUrl);
      if (row.item) {
        // Spreadsheet-provided item names should win (more reliable than Amazon-bot titles)
        const cleaned = cleanProductName(row.item);
        if (cleaned) productData.name = cleaned;
      }
      collectionMap.get(collectionName).products.push(productData);
    }
    
    // Be respectful with delays
    if (i < rows.length - 1) {
      await delay(DELAY_MS);
    }
  }
  
  // Convert to array
  const collections = Array.from(collectionMap.values());
  
  // Generate JavaScript file
  console.log('\nGenerating JavaScript file...');
  
  const jsContent = `// Auto-generated by fetch-og-images.js
// Do not edit manually - regenerate by running: cd scripts && npm run fetch

const collections = ${JSON.stringify(collections, null, 2)};

// Export for use in the page
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { collections };
}
`;
  
  fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), jsContent, 'utf8');
  
  console.log(`\n✓ Success! Generated ${OUTPUT_FILE}`);
  console.log(`  - ${collections.length} collections`);
  console.log(`  - ${rows.length} total products`);
  console.log('\nNext steps:');
  console.log('  1. Review the generated top-products-data.js file');
  console.log('  2. The file is ready to use in your website');
  console.log('  3. Run this script again whenever you update your Excel file\n');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
