// QUICK FIX: Manually add Amazon product images
// 
// Instructions:
// 1. Visit each product URL in your browser
// 2. Right-click the main product image → "Copy Image Address"
// 3. Paste the URL below in the corresponding line
// 4. Save this file
// 5. Run: node manual-images.js

const manualImages = {
  // Product 1: Closet Dividers
  "B0BK91G14T": "PASTE_IMAGE_URL_HERE",
  
  // Product 2: Sakugi Clothes Rack
  "B0F9NG9TSB": "PASTE_IMAGE_URL_HERE",
  
  // Product 3: Phone Tripod
  "B0FL2958N3": "PASTE_IMAGE_URL_HERE",
  
  // Product 4: Collapsible Background
  "B091GRK2WH": "PASTE_IMAGE_URL_HERE",
  
  // Product 5: Velvet Hangers
  "B07GYLFFVR": "PASTE_IMAGE_URL_HERE",
  
  // Product 6: Skirt Hangers
  "B0BPQ6W25F": "PASTE_IMAGE_URL_HERE"
};

// Auto-update top-products-data.js
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'top-products-data.js');
let content = fs.readFileSync(dataFile, 'utf8');

// Replace placeholders with manual images
for (const [productId, imageUrl] of Object.entries(manualImages)) {
  if (imageUrl && imageUrl !== "PASTE_IMAGE_URL_HERE") {
    // Find and replace placeholder for this product
    const placeholderRegex = new RegExp(
      `("url":\\s*"[^"]*${productId}[^"]*"[^}]*"imageUrl":\\s*")https://via\\.placeholder\\.com[^"]*(")`
    );
    content = content.replace(placeholderRegex, `$1${imageUrl}$2`);
    console.log(`✓ Updated image for product ${productId}`);
  }
}

fs.writeFileSync(dataFile, content, 'utf8');
console.log('\n✓ top-products-data.js updated!');
console.log('Refresh your page to see the images.\n');
