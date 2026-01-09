const XLSX = require('xlsx');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Configuration
const EXCEL_FILE = '../FV TOP PRODUCTS.xlsx';
const OUTPUT_FILE = '../top-products-data.js';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400/D4A574/2A2320?text=No+Image';
const DELAY_MS = 1000; // Delay between requests to be respectful (increased for Amazon)

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
  const data = XLSX.utils.sheet_to_json(sheet, { header: ['collection', 'url'] });
  
  // Skip header row if present
  const startRow = data[0].collection && data[0].collection.toLowerCase().includes('collection') ? 1 : 0;
  const rows = data.slice(startRow).filter(row => row.collection && row.url);
  
  console.log(`Found ${rows.length} products to process\n`);
  
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
    
    // Fetch product data
    const productData = await fetchOGData(row.url);
    collectionMap.get(collectionName).products.push(productData);
    
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
