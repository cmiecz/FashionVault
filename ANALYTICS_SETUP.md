# Analytics & Search Console Setup Guide

This guide provides step-by-step instructions for setting up analytics and search engine tracking for Fashion Vault.

## 1. Google Search Console Setup

### Step 1: Verify Domain Ownership

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Enter `fashionvault.app`
4. Choose verification method:
   - **Recommended**: DNS verification (add TXT record to domain DNS)
   - **Alternative**: HTML file upload to website root
   - **Alternative**: HTML meta tag (add to `<head>` of index.html)

### Step 2: Submit Sitemap

1. After verification, go to "Sitemaps" in left menu
2. Enter sitemap URL: `https://fashionvault.app/sitemap.xml`
3. Click "Submit"
4. Check back in 24-48 hours to see indexed pages

### Step 3: Monitor Performance

Key areas to monitor in Search Console:
- **Performance**: Track clicks, impressions, CTR, and average position
- **Coverage**: Check for indexing errors
- **Core Web Vitals**: Monitor page experience metrics
- **Mobile Usability**: Ensure no mobile issues

## 2. Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Admin" → "Create Property"
3. Enter property name: "Fashion Vault Website"
4. Select timezone: United States (appropriate zone)
5. Select currency: USD

### Step 2: Set Up Data Stream

1. Choose "Web" platform
2. Enter website URL: `https://fashionvault.app`
3. Enter stream name: "Fashion Vault Main Site"
4. Copy the Measurement ID (format: G-XXXXXXXXXX)

### Step 3: Add Tracking Code

Add this code to the `<head>` section of ALL HTML pages (right after opening `<head>` tag):

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Replace `G-XXXXXXXXXX` with your actual Measurement ID**

### Step 4: Configure Enhanced Measurement

In GA4 property settings, enable:
- ✅ Page views (auto-enabled)
- ✅ Scrolls
- ✅ Outbound clicks
- ✅ Site search
- ✅ Form interactions
- ✅ File downloads

## 3. Event Tracking Setup

### Key Events to Track

Add custom event tracking for critical user actions:

#### Sign-Up Button Clicks

Add to all signup buttons' click handlers:

```javascript
// Add to scripts.js or inline
document.querySelectorAll('.signup-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    gtag('event', 'signup_click', {
      'event_category': 'engagement',
      'event_label': 'Signup Button',
      'value': 1
    });
  });
});
```

#### Email Waitlist Submissions

Add to form submission (in scripts.js):

```javascript
// On successful email submission
gtag('event', 'waitlist_join', {
  'event_category': 'conversion',
  'event_label': 'Email Waitlist',
  'value': 1
});
```

#### Navigation Tracking

Track which features users explore:

```javascript
// Track feature clicks
document.querySelectorAll('a[href*="#features"]').forEach(link => {
  link.addEventListener('click', function() {
    gtag('event', 'view_features', {
      'event_category': 'navigation',
      'event_label': 'Features Section'
    });
  });
});
```

#### Pricing Plan Views

```javascript
// Track pricing engagement
gtag('event', 'view_pricing', {
  'event_category': 'engagement',
  'event_label': 'Pricing Section',
  'value': 1
});
```

## 4. Conversion Goals Setup

### In GA4, Create Key Conversions:

1. Go to Admin → Events → Mark as conversion
2. Mark these events as conversions:
   - `waitlist_join` - Email signups
   - `signup_click` - Primary CTA clicks
   - `view_pricing` - Users viewing pricing

## 5. Facebook Pixel (Optional)

If using Facebook ads:

1. Get Pixel ID from Facebook Business Manager
2. Add Facebook Pixel code to `<head>`:

```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## 6. Hotjar or Microsoft Clarity (User Behavior)

### Hotjar Setup (Heatmaps & Session Recordings)

1. Sign up at [Hotjar](https://www.hotjar.com)
2. Create new site: fashionvault.app
3. Copy tracking code and add to `<head>`

### Microsoft Clarity Setup (Free Alternative)

1. Sign up at [Microsoft Clarity](https://clarity.microsoft.com)
2. Add new project: Fashion Vault
3. Copy tracking code:

```html
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
</script>
```

## 7. Monitoring Dashboard Setup

### Weekly Checklist:
- [ ] Check Google Search Console for errors
- [ ] Review top performing pages
- [ ] Monitor keyword rankings
- [ ] Check Core Web Vitals scores

### Monthly Checklist:
- [ ] Review traffic trends in GA4
- [ ] Analyze conversion rates
- [ ] Identify top traffic sources
- [ ] Review bounce rates by page
- [ ] Check mobile vs desktop traffic split
- [ ] Update underperforming meta descriptions

## 8. Key Metrics to Track

### Search Console Metrics:
- **Total Clicks**: Should trend upward over time
- **Total Impressions**: Shows visibility growth
- **Average CTR**: Target 3-5% for main keywords
- **Average Position**: Target top 10 (position 1-10)

### Analytics Metrics:
- **Users**: Unique visitors
- **Sessions**: Total visits
- **Bounce Rate**: Target under 60%
- **Avg Session Duration**: Target over 2 minutes
- **Pages per Session**: Target over 2.5

### Conversion Metrics:
- **Email Signup Rate**: Target 2-5% of visitors
- **CTA Click Rate**: Track button engagement
- **Top Landing Pages**: Optimize best performers

## 9. Testing & Validation

### Test Analytics Setup:

1. **Real-time Testing**:
   - Visit site in incognito mode
   - Check GA4 "Realtime" report
   - Verify your visit appears

2. **Event Testing**:
   - Click signup buttons
   - Submit test email
   - Verify events fire in GA4 DebugView

3. **Search Console Testing**:
   - Use "URL Inspection" tool
   - Submit URLs for indexing
   - Check coverage report after 48 hours

## 10. Privacy Compliance

### Cookie Consent (If Required):

Add cookie consent banner for GDPR/CCPA compliance:

```html
<!-- Simple Cookie Notice -->
<div id="cookie-notice" style="position: fixed; bottom: 0; width: 100%; background: #2A2320; color: white; padding: 20px; text-align: center; z-index: 9999; display: none;">
  <p style="margin: 0 0 10px 0;">
    We use cookies to improve your experience and analyze site traffic. 
    <a href="/privacy.html" style="color: #D4A574;">Learn more</a>
  </p>
  <button onclick="acceptCookies()" style="background: #D4A574; color: #2A2320; border: none; padding: 10px 30px; border-radius: 25px; cursor: pointer; font-weight: bold;">
    Accept
  </button>
</div>

<script>
function acceptCookies() {
  localStorage.setItem('cookieAccepted', 'true');
  document.getElementById('cookie-notice').style.display = 'none';
}

// Show notice if not accepted
if (!localStorage.getItem('cookieAccepted')) {
  document.getElementById('cookie-notice').style.display = 'block';
}
</script>
```

## Next Steps

1. ✅ Verify domain ownership in Search Console
2. ✅ Add GA4 tracking code to all pages
3. ✅ Submit sitemap.xml
4. ✅ Set up conversion tracking
5. ✅ Monitor for 1 week to ensure tracking works
6. ✅ Set up automated reports (weekly summary emails)

---

**Last Updated**: January 12, 2025
