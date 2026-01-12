# App Styling Guide

Complete design system documentation for building a landing page that matches the app's visual identity.

---

## 🎨 Color Palette

### Theme: Elegant Heather Gray & Gold

The app uses a sophisticated color scheme with warm undertones, combining heather gray and warm gold accents.

### Primary Colors

**Heather Gray (Primary)**
- `#8B8D8F` - Main heather gray (headers, primary elements)
- `#A5A7A9` - Light heather gray (hover states, secondary)
- `#6B6D6F` - Dark heather gray (emphasis, active states)

**Warm Gold (Accent)**
- `#D4A574` - Main warm gold (actions, highlights, CTAs)
- `#E8C599` - Light gold (subtle highlights)
- `#B8895E` - Deep gold (hover states, emphasis)
- `#FFF8F0` - Creamy off-white (accent backgrounds)

### Semantic Colors

- **Success**: `#10B981` (green)
- **Warning**: `#F59E0B` (amber/orange)
- **Error**: `#EF4444` (red)
- **Info**: `#FF9B8C` (coral/salmon)

### Gray Scale (Warm Undertones)

The app uses a refined gray scale with warm undertones for depth and sophistication:

- `gray-50`: `#FFFCFA` - Warm white
- `gray-100`: `#FFF8F5` - Off-white
- `gray-200`: `#F5F0ED` - Light warm gray
- `gray-300`: `#E8E2DD` - Warm gray
- `gray-400`: `#C4BCBA` - Medium gray
- `gray-500`: `#9A918E` - Neutral gray
- `gray-600`: `#6B6360` - Dark gray
- `gray-700`: `#524A47` - Darker gray
- `gray-800`: `#3A3330` - Very dark gray
- `gray-900`: `#2A2320` - Near black

### Background Colors

- **Background**: `#FFFCFA` - Warm white (main app background)
- **Card Background**: `#FFFFFF` - Pure white (cards, containers)

### Text Colors

- **Primary Text**: `#2A2320` - Near black (main content)
- **Secondary Text**: `#6B6360` - Dark gray (supporting text)
- **Tertiary Text**: `#9A918E` - Neutral gray (subtle text)
- **Text on Primary**: `#FFFFFF` - White (text on heather gray)
- **Text on Gold**: `#2A2320` - Dark text (text on gold backgrounds)

---

## 📝 Typography

### Font Families

**Body Text**
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
```

**Display/Titles** (Optional - for special headings)
- `Pacifico_400Regular` - Used for app titles and special headers (if available)

### Font Sizes

The app uses a custom font size scale:

- `xs`: `10px`
- `sm`: `12px`
- `base`: `14px` (default body text)
- `lg`: `18px`
- `xl`: `20px`
- `2xl`: `24px`
- `3xl`: `32px`
- `4xl`: `40px`
- `5xl`: `48px`
- `6xl`: `56px`
- `7xl`: `64px`
- `8xl`: `72px`
- `9xl`: `80px`

### Letter Spacing

- **Titles/Headings**: `-0.3` to `-1` (tighter spacing for modern look)
- **Body Text**: Default (normal spacing)
- **Uppercase Labels**: Slight letter-spacing for professional appearance

### Font Weights

- **Regular**: 400 (body text)
- **Medium**: 500 (secondary text)
- **Semibold**: 600 (section headers, labels)
- **Bold**: 700 (emphasis, buttons)
- **Extra Bold**: 800 (large numbers, hero text)

---

## 📐 Spacing & Layout

### Border Radius

- `xl`: `12px` - Standard cards, buttons
- `2xl`: `16px` - Larger cards, containers
- `3xl`: `24px` - Hero sections, prominent elements
- `20px` - Also commonly used for cards
- `8px` - Small elements, badges

### Custom Spacing Values

- `18`: `72px` - Large section spacing
- `22`: `88px` - Extra large spacing

### Common Spacing Patterns

- **Card Padding**: `16px` to `24px` (typically `20px`)
- **Card Margins**: `20px` top margin between cards
- **Section Padding**: `20px` horizontal, `16-24px` vertical
- **Button Height**: `72px` (optimal touch target)
- **Button Padding**: `16px` horizontal
- **Container Padding**: `2rem` (32px) typical

---

## 🎭 Shadows & Elevation

### Shadow Styles

The app uses iOS 16-style enhanced shadows for depth and elegance.

**Standard Card Shadow**
```css
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.1
shadowRadius: 8
```

**Enhanced Card Shadow** (iOS 16 style)
```css
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1
shadowRadius: 16
```

**Subtle Shadow** (for borders, dividers)
```css
shadowOffset: { width: 0, height: 1 }
shadowOpacity: 0.05
shadowRadius: 2-4
```

**Prominent Shadow** (hero elements, modals)
```css
shadowOffset: { width: 0, height: 10 }
shadowOpacity: 0.3
shadowRadius: 20
```

**CSS Equivalent** (for web)
```css
/* Standard Card */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* Enhanced Card */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

/* Subtle */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

/* Prominent */
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
```

---

## 🎯 Design Principles

### iOS 16 / Tahoe OS Style

1. **Enhanced Shadows**: More pronounced, refined shadows with higher radius
2. **Larger Border Radius**: 20-24px for modern, soft appearance
3. **Subtle Borders**: `1px` borders with `gray-100` color for definition
4. **Proper Letter Spacing**: Negative letter-spacing for titles (-0.3 to -1)
5. **Consistent Card Spacing**: 20px margins between cards
6. **Warm Undertones**: All grays have warm undertones, not pure neutral

### Visual Hierarchy

1. **Primary**: Quick actions, CTAs (largest, most prominent)
2. **Secondary**: Important information (medium emphasis)
3. **Tertiary**: Supporting details (subtle, smaller)

### Color Usage Guidelines

- **Heather Gray** (`#8B8D8F`): Headers, navigation, primary UI elements
- **Warm Gold** (`#D4A574`): Call-to-action buttons, highlights, important actions
- **Warm White** (`#FFFCFA`): Main background
- **Pure White** (`#FFFFFF`): Cards, containers, elevated surfaces
- **Semantic Colors**: Use for status indicators, alerts, feedback

---

## 🎨 Component Patterns

### Cards

```css
background: #FFFFFF;
border-radius: 20px; /* or 12px, 16px, 24px */
padding: 20px; /* or 16px, 24px */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
/* Optional subtle border */
border: 1px solid #F5F0ED; /* gray-200 */
```

### Buttons

**Primary Button (Gold)**
```css
background: #D4A574;
color: #2A2320;
border-radius: 12px;
padding: 16px 24px;
font-weight: 700;
font-size: 16px;
box-shadow: 0 2px 8px rgba(212, 165, 116, 0.3);
```

**Secondary Button (Heather Gray)**
```css
background: #8B8D8F;
color: #FFFFFF;
border-radius: 12px;
padding: 16px 24px;
font-weight: 600;
font-size: 16px;
```

**Hover States**
- Primary: Darken by ~10% (`#B8895E`)
- Secondary: Lighten by ~10% (`#A5A7A9`)

### Headers

```css
background: #8B8D8F; /* heather gray */
color: #FFFFFF;
padding: 2rem 0;
font-size: 2.5rem; /* or 2xl, 3xl */
font-weight: 600;
letter-spacing: -0.5;
```

### Text Hierarchy

**H1 (Hero/Page Title)**
```css
font-size: 2.5rem; /* 40px */
font-weight: 600;
color: #2A2320;
letter-spacing: -0.5;
```

**H2 (Section Title)**
```css
font-size: 1.8rem; /* 28px */
font-weight: 600;
color: #8B8D8F; /* or #2A2320 */
margin-bottom: 1rem;
```

**H3 (Subsection)**
```css
font-size: 1.5rem; /* 24px */
font-weight: 600;
color: #2A2320;
```

**Body Text**
```css
font-size: 14px; /* base */
font-weight: 400;
color: #2A2320;
line-height: 1.6;
```

**Secondary Text**
```css
font-size: 14px;
font-weight: 400;
color: #6B6360;
line-height: 1.6;
```

---

## 🎬 Animations & Interactions

### Hover Effects

**Cards**
```css
transition: transform 0.2s, box-shadow 0.2s;
```

**Cards on Hover**
```css
transform: translateY(-2px);
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
```

**Buttons**
```css
transition: background-color 0.2s, transform 0.2s;
```

**Buttons on Hover**
```css
transform: translateY(-1px);
/* Background color darkens/lightens by ~10% */
```

### Active States

- **Opacity**: `0.7` or `0.8` on active/pressed state
- **Scale**: `scale(0.95)` for buttons (if desired)

---

## 📱 Responsive Considerations

### Container Widths

- **Max Content Width**: `800px` to `1200px` (typical)
- **Padding**: `2rem` (32px) on desktop, `1rem` (16px) on mobile

### Breakpoints (if using media queries)

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

---

## 🎨 Example CSS Variables

For easy implementation, here are CSS custom properties:

```css
:root {
  /* Primary Colors */
  --color-primary: #8B8D8F;
  --color-primary-light: #A5A7A9;
  --color-primary-dark: #6B6D6F;
  
  /* Accent Colors */
  --color-accent: #D4A574;
  --color-accent-light: #E8C599;
  --color-accent-dark: #B8895E;
  --color-accent-bg: #FFF8F0;
  
  /* Semantic Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #FF9B8C;
  
  /* Grays */
  --color-gray-50: #FFFCFA;
  --color-gray-100: #FFF8F5;
  --color-gray-200: #F5F0ED;
  --color-gray-300: #E8E2DD;
  --color-gray-400: #C4BCBA;
  --color-gray-500: #9A918E;
  --color-gray-600: #6B6360;
  --color-gray-700: #524A47;
  --color-gray-800: #3A3330;
  --color-gray-900: #2A2320;
  
  /* Backgrounds */
  --color-bg: #FFFCFA;
  --color-card: #FFFFFF;
  
  /* Text */
  --color-text-primary: #2A2320;
  --color-text-secondary: #6B6360;
  --color-text-tertiary: #9A918E;
  --color-text-on-primary: #FFFFFF;
  --color-text-on-gold: #2A2320;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-size-xs: 10px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 40px;
  --font-size-5xl: 48px;
  
  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 10px 20px rgba(0, 0, 0, 0.3);
}
```

---

## 🎯 Quick Reference

### Most Common Colors
- **Primary Background**: `#FFFCFA`
- **Card Background**: `#FFFFFF`
- **Primary Text**: `#2A2320`
- **Primary UI**: `#8B8D8F` (Heather Gray)
- **CTA/Accent**: `#D4A574` (Warm Gold)

### Most Common Sizes
- **Border Radius**: `12px`, `16px`, `20px`, `24px`
- **Card Padding**: `20px`
- **Button Height**: `72px` (mobile), `auto` (web)
- **Standard Shadow**: `0 2px 8px rgba(0, 0, 0, 0.1)`

### Design Philosophy
- **Elegant & Refined**: Warm undertones, sophisticated grays
- **Modern iOS Style**: Enhanced shadows, larger radius, proper spacing
- **Accessible**: High contrast, clear hierarchy
- **Consistent**: Unified color system throughout

---

## 📚 Additional Notes

- The app follows iOS 16 / Tahoe OS design principles
- All grays have warm undertones (not pure neutral)
- Shadows are more pronounced than typical flat designs
- Border radius is generous (12px+) for modern appearance
- Letter spacing is tightened on titles for contemporary look
- The color palette creates a premium, elegant feel

---

*This guide is based on the app's Tailwind configuration (`tailwind.config.js`) and color system (`src/utils/colors.ts`).*

