const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sealPath = path.join(__dirname, '..', 'public', 'hbs-siegel.png');
const base64Seal = fs.readFileSync(sealPath).toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradient: Heimbürgeschule Blue to Teal -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#004D80" />
      <stop offset="50%" stop-color="#0B7BA7" />
      <stop offset="100%" stop-color="#00A896" />
    </linearGradient>

    <!-- Card 1 (Back Card) Gradient -->
    <linearGradient id="backCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1" />
    </linearGradient>

    <!-- Card 2 (Front Card) Gradient -->
    <linearGradient id="frontCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>

    <!-- Heart & Swipe Spark Gradient -->
    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F43F5E" />
      <stop offset="100%" stop-color="#E11D48" />
    </linearGradient>

    <!-- Orange School Accent -->
    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#F39200" />
    </linearGradient>

    <filter id="shadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#002b4d" flood-opacity="0.45" />
    </filter>

    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#081a29" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- App Icon Squircle Background -->
  <rect width="512" height="512" rx="118" fill="url(#bgGrad)" />

  <!-- Subtle Inner Glow Ring -->
  <rect x="8" y="8" width="496" height="496" rx="110" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="3" />

  <!-- Back Card (Tilted Left -13 deg) -->
  <g transform="translate(256, 255) rotate(-13) translate(-256, -255)" opacity="0.65">
    <rect x="156" y="95" width="200" height="285" rx="26" fill="url(#backCardGrad)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.4" />
    <circle cx="256" cy="180" r="38" fill="#ffffff" fill-opacity="0.2" />
    <rect x="196" y="245" width="120" height="14" rx="7" fill="#ffffff" fill-opacity="0.3" />
    <rect x="216" y="275" width="80" height="10" rx="5" fill="#ffffff" fill-opacity="0.2" />
  </g>

  <!-- Front Card (Tilted Right +7 deg - Active Swipe) -->
  <g transform="translate(256, 255) rotate(7) translate(-256, -255)" filter="url(#cardShadow)">
    <rect x="156" y="90" width="200" height="290" rx="26" fill="url(#frontCardGrad)" stroke="#e2e8f0" stroke-width="1.5" />
    
    <!-- Card Photo Area with soft warm gradient & subtle border -->
    <rect x="170" y="104" width="172" height="152" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    
    <!-- Official Heimbürgeschule Seal inside the front card -->
    <image href="data:image/png;base64,${base64Seal}" x="186" y="110" width="140" height="140" />

    <!-- Card Badge & Text Lines -->
    <rect x="176" y="268" width="82" height="16" rx="8" fill="#0B7BA7" />
    <text x="217" y="280" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="9" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">HBS KAHLA</text>

    <!-- Subtitle lines simulating company/matching details -->
    <rect x="176" y="294" width="160" height="10" rx="5" fill="#1e293b" />
    <rect x="176" y="312" width="125" height="7" rx="3.5" fill="#64748b" />
    <rect x="176" y="326" width="95" height="7" rx="3.5" fill="#94a3b8" />

    <!-- Floating Matching Heart Badge -->
    <circle cx="318" cy="342" r="28" fill="#ffffff" filter="url(#shadow)" />
    <path d="M 318 354 C 318 354 303 344 303 334 C 303 328.5 307.5 324 313 324 C 315.8 324 317.3 325.5 318 326.5 C 318.7 325.5 320.2 324 323 324 C 328.5 324 333 328.5 333 334 C 333 344 318 354 318 354 Z" fill="url(#heartGrad)" />
  </g>

  <!-- Super-Like Traumberuf Star Spark (Top Right) -->
  <g transform="translate(390, 95)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="24" fill="url(#starGrad)" />
    <path d="M 0 -13 L 3.8 -4 L 13 -3 L 6 3.5 L 8 13 L 0 8 L -8 13 L -6 3.5 L -13 -3 L -3.8 -4 Z" fill="#ffffff" />
  </g>

  <!-- Dynamic Swipe Arc (Left to Right) -->
  <path d="M 85 245 C 80 295, 100 350, 145 385" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-dasharray="12 12" stroke-opacity="0.6" />
  <polyline points="132,388 148,388 148,372" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.8" />

  <!-- Bottom Brand Pill -->
  <g transform="translate(256, 442)">
    <rect x="-110" y="-19" width="220" height="38" rx="19" fill="#003559" fill-opacity="0.8" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3" />
    <text x="0" y="5.5" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="14" fill="#ffffff" letter-spacing="2">TIPSWITCH • HBS</text>
  </g>
</svg>`;

const pubDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(pubDir, 'icon.svg'), svg);
fs.writeFileSync(path.join(pubDir, 'favicon.svg'), svg);

async function generate() {
  const svgBuf = Buffer.from(svg);
  await sharp(svgBuf).resize(512, 512).png().toFile(path.join(pubDir, 'pwa-512x512.png'));
  await sharp(svgBuf).resize(192, 192).png().toFile(path.join(pubDir, 'pwa-192x192.png'));
  await sharp(svgBuf).resize(180, 180).png().toFile(path.join(pubDir, 'apple-touch-icon.png'));
  await sharp(svgBuf)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 11, g: 123, b: 167, alpha: 1 },
    })
    .png()
    .toFile(path.join(pubDir, 'maskable-icon-512x512.png'));

  console.log('Successfully generated all PWA icons with Heimbürgeschule logo!');
}

generate().catch(console.error);
