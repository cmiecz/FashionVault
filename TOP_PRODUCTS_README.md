# Top Products - Setup & Usage Guide

## Overview

The Top Products page displays curated product collections with automatic extraction of product names and images from URLs.

## Files Created

- **`top-products.html`** - Main products page with collection cards and modal display
- **`top-products-data.js`** - Generated JavaScript file containing product data
- **`scripts/fetch-og-images.js`** - Node.js script to fetch product data from URLs
- **`scripts/package.json`** - Dependencies for the fetcher script

## How It Works

1. You maintain a simple Excel file with just 2 columns:
   - Collection Name
   - Product URL

2. The script reads your Excel file and automatically extracts:
   - Product Name (from og:title meta tag or page title)
   - Product Image (from og:image meta tag)

3. The generated data file is used by the website to display products

## Initial Setup

### Prerequisites

- Node.js installed on your computer (download from nodejs.org)

### First Time Setup

1. Navigate to the scripts directory:
   ```bash
   cd scripts
   npm install
   ```

This installs the required dependencies (axios, cheerio, xlsx).

## Updating Products

### Step 1: Edit Your Excel File

Your Excel file (`FV TOP PRODUCTS.xlsx`) should have this structure:

| Collection Name | Product URL |
|----------------|-------------|
| FASHION VAULT LOGGING ESSENTIALS | https://amzn.to/4jS8NBT |
| FASHION VAULT LOGGING ESSENTIALS | https://amzn.to/3NBh68K |
| CLOSET ESSENTIALS | https://amzn.to/49w0Ugq |

**Important Notes:**
- Products with the same Collection Name will be grouped together
- Product names and images are automatically extracted from the URLs
- Make sure URLs are complete and valid

### Step 2: Run the Fetcher Script

```bash
cd scripts
npm run fetch
```

Or:

```bash
cd scripts
node fetch-og-images.js
```

The script will:
- Read your Excel file
- Visit each product URL
- Extract the product name and image
- Generate `top-products-data.js`
- Show progress and any errors

### Step 3: Review the Output

After the script completes:
1. Check the console output for any errors or warnings
2. Review the generated `top-products-data.js` file
3. The file is ready to use immediately on your website

## Troubleshooting

### Amazon Affiliate Links

Amazon short URLs (amzn.to) may not provide proper Open Graph images. Solutions:

1. **Use full Amazon product URLs** instead of short links
   - Example: `https://www.amazon.com/dp/B08XYZ1234`

2. **Manually add image URLs** - You can edit `top-products-data.js` and replace placeholder images with actual Amazon product image URLs

3. **Create a manual override file** - Create `scripts/image-overrides.json`:
   ```json
   {
     "https://amzn.to/4jS8NBT": {
       "imageUrl": "https://m.media-amazon.com/images/I/actual-image.jpg"
     }
   }
   ```

### Common Issues

**"Cannot find module 'xlsx'"**
- Run `npm install` in the scripts directory

**"Failed to fetch URL"**
- Check that the URL is accessible
- Some sites block automated access
- Try using the full URL instead of shortened links

**"No image found"**
- The website may not have Open Graph tags
- A placeholder will be used automatically
- You can manually add the image URL in `top-products-data.js`

## Customization

### Placeholder Image

To change the placeholder image for products without images, edit `scripts/fetch-og-images.js`:

```javascript
const PLACEHOLDER_IMAGE = 'https://your-custom-placeholder.jpg';
```

### Request Delay

To be more respectful to servers (or speed up fetching), adjust the delay:

```javascript
const DELAY_MS = 500; // milliseconds between requests
```

### Collection Descriptions

The script auto-generates descriptions like "Curated closet essentials". To customize:

1. Edit the generated `top-products-data.js` file after running the script
2. Or modify the script's collection creation logic

## File Structure

```
FashionVault_Website/
├── top-products.html          # Main page
├── top-products-data.js       # Generated product data
├── FV TOP PRODUCTS.xlsx       # Your product list
└── scripts/
    ├── package.json           # Dependencies
    ├── fetch-og-images.js     # Fetcher script
    └── node_modules/          # Installed packages
```

## Best Practices

1. **Keep URLs Updated** - Use direct product page URLs when possible
2. **Run Script Regularly** - Whenever you update your Excel file
3. **Test After Updates** - View the page in a browser after regenerating
4. **Backup Data** - Keep a copy of your Excel file
5. **Check Console** - Look for errors when running the script

## Adding New Collections

Simply add new rows to your Excel file with a new collection name:

| Collection Name | Product URL |
|----------------|-------------|
| SPRING ESSENTIALS | https://... |
| SPRING ESSENTIALS | https://... |

Run the script again, and the new collection will appear on the page.

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your Excel file format
3. Test URLs manually in a browser
4. Check that Node.js and npm are properly installed

---

**Last Updated:** January 2025
