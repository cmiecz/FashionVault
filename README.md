# Fashion Vault Website

A beautiful, modern website for Fashion Vault - Your Digital Wardrobe, Reimagined.

## Overview

This is a static website built with HTML, CSS (Tailwind CSS), and vanilla JavaScript. It features:

- **Landing Page** (`index.html`) - Showcase of Fashion Vault features and user-generated content
- **Support Page** (`support.html`) - How-to guides, tutorials, and video resources
- Responsive design that works on all devices
- Mobile-friendly navigation with hamburger menu
- Smooth scrolling and interactive elements
- Search and filter functionality on the support page

## Project Structure

```
FashionVault_Website/
├── index.html          # Main landing page
├── support.html        # Support page with guides and videos
├── scripts.js          # Shared JavaScript (mobile menu, smooth scroll)
├── support.js          # Support page specific JavaScript (search/filter)
├── FashioVault.png     # Logo file
├── render.yaml         # Render deployment configuration
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Features

### Landing Page
- Hero section with compelling headline
- Feature highlights (Catalog, Lookbook, Planning)
- User-generated content showcase
- Call-to-action sections
- Responsive navigation

### Support Page
- Search functionality for articles and videos
- Category filters (Getting Started, Cataloging, Outfits, Planning)
- How-to guides section
- Video tutorials section
- Mobile-responsive design

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/cmiecz/FashionVault.git
cd FashionVault
```

2. Open `index.html` in your web browser, or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

## Deployment on Render

This website is configured to deploy as a static site on Render.

### Deployment Steps

1. **Connect your GitHub repository** to Render:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub account and select the `FashionVault` repository

2. **Configure the static site**:
   - **Name**: `fashion-vault-website` (or your preferred name)
   - **Build Command**: Leave empty (no build step needed)
   - **Publish Directory**: `.` (root directory)
   - **Environment**: `Static Site`

3. **Deploy**:
   - Click "Create Static Site"
   - Render will automatically deploy your site
   - Your site will be available at `https://fashionvault.onrender.com`

### Custom Domain (Optional)

To use a custom domain:
1. Go to your static site settings in Render
2. Click "Custom Domains"
3. Add your domain and follow the DNS configuration instructions

## Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No framework dependencies
- **Google Fonts** - Playfair Display & Inter fonts
- **Material Symbols** - Icon library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
The color scheme is defined in the Tailwind config within each HTML file:
- Primary (Gold): `#d4af37`
- Secondary (White): `#ffffff`
- Heather (Grey): `#b0b0b0`
- Accent (Dark Grey): `#4a4a4a`
- Neutral (Light Grey): `#f3f4f6`

### Logo
Replace `FashioVault.png` with your own logo file. The logo is used in:
- Header (32x32px)
- Footer (32x32px)
- Favicon

### Content
- Edit `index.html` to update landing page content
- Edit `support.html` to add/remove articles and videos
- Update `support.js` if you change the category structure

## Adding New Support Content

### Adding a How-To Article

In `support.html`, add a new article card in the `#articles-container`:

```html
<article class="article-card bg-neutral rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer" 
         data-category="your-category" 
         data-title="Your Article Title" 
         data-content="Article description">
  <!-- Article content -->
</article>
```

### Adding a Video

In `support.html`, add a new video card in the `#videos-container`:

```html
<div class="video-card bg-neutral rounded-xl overflow-hidden hover:shadow-lg transition-shadow" 
     data-category="your-category" 
     data-title="Your Video Title" 
     data-content="Video description">
  <!-- Video content -->
</div>
```

## License

© 2024 Fashion Vault. All Rights Reserved.

## Support

For questions or issues, visit the [Support Page](support.html) or contact the Fashion Vault team.

