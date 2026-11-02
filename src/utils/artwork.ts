import { StrictProductCategory } from '../types';

export interface StudioArtSpec {
  id: string;
  title: string;
  subtitle: string;
  category: StrictProductCategory;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  illustrationType:
    | 'lipstick'
    | 'foundation'
    | 'eyeliner'
    | 'serum'
    | 'moisturizer'
    | 'facewash'
    | 'hairmask'
    | 'hairoil'
    | 'perfume'
    | 'bodymist'
    | 'deodorant'
    | 'clutch'
    | 'slingbag'
    | 'choker'
    | 'jhumka'
    | 'hairclaw'
    | 'tiara';
}

function getIllustrationMotif(
  type: StudioArtSpec['illustrationType'],
  primary: string,
  secondary: string,
  accent: string
): string {
  switch (type) {
    case 'lipstick':
      return `
        <!-- Velvet Matte Liquid Lipstick Tube & Bullet -->
        <g transform="translate(200, 145)">
          <ellipse cx="0" cy="95" rx="75" ry="14" fill="#000000" opacity="0.12" />
          <!-- Lipstick Tube #1 -->
          <g transform="translate(-32, -20) rotate(-8)">
            <rect x="-20" y="10" width="40" height="78" rx="6" fill="url(#itemGrad)" stroke="${accent}" stroke-width="1.5"/>
            <rect x="-20" y="2" width="40" height="12" rx="2" fill="url(#goldGrad)" />
            <path d="M-13,2 L-13,-35 C-13,-52 13,-42 13,-25 L13,2 Z" fill="${primary}" />
            <path d="M-9,-30 C-4,-40 8,-34 9,-22" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.45" stroke-linecap="round"/>
            <text x="0" y="52" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="8" letter-spacing="2" opacity="0.9">GIRLZ</text>
            <text x="0" y="63" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="6" letter-spacing="1.5" opacity="0.75">MATTE</text>
          </g>
          <!-- Lipstick Tube #2 Cap -->
          <g transform="translate(34, 5) rotate(10)">
            <rect x="-18" y="-35" width="36" height="115" rx="8" fill="url(#goldGrad)" stroke="#ffffff" stroke-width="1" stroke-opacity="0.5"/>
            <rect x="-14" y="12" width="28" height="58" rx="4" fill="${primary}" opacity="0.92"/>
            <line x1="-8" y1="-25" x2="-8" y2="65" stroke="#ffffff" stroke-width="2.5" opacity="0.35" stroke-linecap="round"/>
          </g>
        </g>
      `;
    case 'foundation':
      return `
        <g transform="translate(200, 145)">
          <ellipse cx="0" cy="95" rx="72" ry="14" fill="#000000" opacity="0.12" />
          <!-- Frosted Glass Pump Bottle -->
          <rect x="-36" y="-18" width="72" height="106" rx="14" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" />
          <rect x="-26" y="-42" width="52" height="24" rx="5" fill="url(#goldGrad)" />
          <path d="M-12,-42 L-12,-58 L22,-58 L28,-50 L12,-50 L12,-42 Z" fill="url(#goldGrad)" />
          <rect x="-24" y="8" width="48" height="54" rx="6" fill="#FFFBF9" opacity="0.92" />
          <text x="0" y="31" text-anchor="middle" fill="#1F1216" font-family="Georgia, serif" font-size="9" font-weight="bold" letter-spacing="1.5">24H HD</text>
          <text x="0" y="45" text-anchor="middle" fill="${primary}" font-family="sans-serif" font-size="7" letter-spacing="1.5">GLOW BASE</text>
          <line x1="-26" y1="-10" x2="-26" y2="75" stroke="#ffffff" stroke-width="3" opacity="0.45" stroke-linecap="round" />
        </g>
      `;
    case 'eyeliner':
      return `
        <g transform="translate(200, 145)">
          <ellipse cx="0" cy="95" rx="70" ry="12" fill="#000000" opacity="0.12" />
          <g transform="rotate(-18)">
            <rect x="-9" y="-65" width="18" height="145" rx="9" fill="#1F1216" stroke="url(#goldGrad)" stroke-width="1.5" />
            <rect x="-9" y="-5" width="18" height="10" fill="url(#goldGrad)" />
            <polygon points="-4,-65 4,-65 0,-85" fill="url(#goldGrad)" />
            <text x="0" y="42" text-anchor="middle" fill="#F5D0C5" font-family="Georgia, serif" font-size="7" letter-spacing="2" transform="rotate(-90 0 42)">JET WING</text>
          </g>
          <g transform="translate(36, 8) rotate(16)">
            <rect x="-8" y="-55" width="16" height="130" rx="8" fill="url(#goldGrad)" />
            <rect x="-6" y="5" width="12" height="62" rx="4" fill="#2A181E" />
          </g>
        </g>
      `;
    case 'serum':
      return `
        <g transform="translate(200, 148)">
          <ellipse cx="0" cy="92" rx="75" ry="14" fill="#000000" opacity="0.12" />
          <!-- Dropper Bottle -->
          <rect x="-38" y="-8" width="76" height="94" rx="22" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" />
          <rect x="-22" y="-26" width="44" height="18" rx="4" fill="url(#goldGrad)" />
          <path d="M-12,-26 C-12,-58 12,-58 12,-26 Z" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="1.5" />
          <!-- Gold Foil Flakes inside bottle -->
          <circle cx="-16" cy="22" r="3" fill="#FBBF24" opacity="0.8" />
          <circle cx="18" cy="48" r="2.5" fill="#FBBF24" opacity="0.8" />
          <circle cx="14" cy="14" r="3.5" fill="#FBBF24" opacity="0.7" />
          <rect x="-26" y="18" width="52" height="46" rx="8" fill="#FFFDF9" opacity="0.93" />
          <text x="0" y="38" text-anchor="middle" fill="#9A3412" font-family="Georgia, serif" font-size="10" font-weight="bold" letter-spacing="1">24K GOLD</text>
          <text x="0" y="52" text-anchor="middle" fill="#B45309" font-family="sans-serif" font-size="7" letter-spacing="1.5">ELIXIR SERUM</text>
        </g>
      `;
    case 'moisturizer':
      return `
        <g transform="translate(200, 152)">
          <ellipse cx="0" cy="82" rx="86" ry="16" fill="#000000" opacity="0.12" />
          <!-- Luxury Cream Jar -->
          <rect x="-58" y="4" width="116" height="72" rx="20" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" />
          <rect x="-62" y="-18" width="124" height="26" rx="10" fill="url(#goldGrad)" />
          <rect x="-42" y="22" width="84" height="36" rx="8" fill="#FFFDF9" opacity="0.92" />
          <text x="0" y="38" text-anchor="middle" fill="#881337" font-family="Georgia, serif" font-size="9" font-weight="bold" letter-spacing="1.5">DAMASK ROSE</text>
          <text x="0" y="50" text-anchor="middle" fill="#9F1239" font-family="sans-serif" font-size="7" letter-spacing="1.2">HYDRA GEL CREME</text>
        </g>
      `;
    case 'facewash':
      return `
        <g transform="translate(200, 145)">
          <ellipse cx="0" cy="95" rx="68" ry="13" fill="#000000" opacity="0.12" />
          <!-- Squeeze Tube -->
          <path d="M-38,-48 L38,-48 L26,64 L-26,64 Z" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" stroke-linejoin="round" />
          <rect x="-24" y="64" width="48" height="22" rx="6" fill="url(#goldGrad)" />
          <line x1="-36" y1="-40" x2="36" y2="-40" stroke="url(#goldGrad)" stroke-width="3" />
          <rect x="-24" y="-16" width="48" height="52" rx="8" fill="#FFFDF9" opacity="0.92" />
          <text x="0" y="6" text-anchor="middle" fill="#9A3412" font-family="Georgia, serif" font-size="8.5" font-weight="bold" letter-spacing="1">SAFFRON</text>
          <text x="0" y="20" text-anchor="middle" fill="#B45309" font-family="sans-serif" font-size="6.5" letter-spacing="1">UBTAN WASH</text>
        </g>
      `;
    case 'hairmask':
      return `
        <g transform="translate(200, 150)">
          <ellipse cx="0" cy="84" rx="88" ry="15" fill="#000000" opacity="0.12" />
          <rect x="-62" y="-4" width="124" height="82" rx="22" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" />
          <rect x="-66" y="-24" width="132" height="24" rx="8" fill="#1F1216" stroke="url(#goldGrad)" stroke-width="1.5" />
          <rect x="-46" y="14" width="92" height="46" rx="10" fill="#FFFDF9" opacity="0.93" />
          <text x="0" y="34" text-anchor="middle" fill="#78350F" font-family="Georgia, serif" font-size="9" font-weight="bold" letter-spacing="1.5">KERATIN SPA</text>
          <text x="0" y="48" text-anchor="middle" fill="#92400E" font-family="sans-serif" font-size="7" letter-spacing="1.2">ARGAN HAIR MASK</text>
        </g>
      `;
    case 'hairoil':
      return `
        <g transform="translate(200, 145)">
          <ellipse cx="0" cy="95" rx="68" ry="14" fill="#000000" opacity="0.12" />
          <path d="M-34,8 C-34,-18 -18,-26 -16,-36 L16,-36 C18,-26 34,-18 34,8 L34,76 C34,86 24,90 14,90 L-14,90 C-24,90 -34,86 -34,76 Z" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" />
          <rect x="-14" y="-56" width="28" height="20" rx="4" fill="url(#goldGrad)" />
          <rect x="-24" y="14" width="48" height="52" rx="8" fill="#FFFDF9" opacity="0.92" />
          <text x="0" y="36" text-anchor="middle" fill="#064E3B" font-family="Georgia, serif" font-size="8.5" font-weight="bold" letter-spacing="1">ROSEMARY</text>
          <text x="0" y="50" text-anchor="middle" fill="#047857" font-family="sans-serif" font-size="6.5" letter-spacing="1">GROWTH ELIXIR</text>
        </g>
      `;
    case 'perfume':
      return `
        <g transform="translate(200, 148)">
          <ellipse cx="0" cy="92" rx="82" ry="15" fill="#000000" opacity="0.14" />
          <!-- Cut Glass Perfume Flacon -->
          <polygon points="-46,0 -28,-22 28,-22 46,0 42,84 -42,84" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linejoin="round" />
          <line x1="-28" y1="-22" x2="-22" y2="84" stroke="#ffffff" stroke-width="1.5" opacity="0.35" />
          <line x1="28" y1="-22" x2="22" y2="84" stroke="#ffffff" stroke-width="1.5" opacity="0.35" />
          <rect x="-14" y="-36" width="28" height="14" fill="url(#goldGrad)" />
          <polygon points="-24,-58 24,-58 18,-36 -18,-36" fill="url(#goldGrad)" stroke="#ffffff" stroke-width="1" />
          <!-- Ribbon Bow -->
          <path d="M-14,-28 C-34,-38 -34,-16 -14,-24 M14,-28 C34,-38 34,-16 14,-24" fill="${primary}" stroke="url(#goldGrad)" stroke-width="1.2" />
          <rect x="-28" y="12" width="56" height="44" rx="4" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="1.5" />
          <text x="0" y="31" text-anchor="middle" fill="#881337" font-family="Georgia, serif" font-size="9" font-weight="bold" letter-spacing="1.5">ROSE OUD</text>
          <text x="0" y="45" text-anchor="middle" fill="#9F1239" font-family="sans-serif" font-size="6.5" letter-spacing="1.5">EAU DE PARFUM</text>
        </g>
      `;
    case 'bodymist':
      return `
        <g transform="translate(200, 145)">
          <ellipse cx="0" cy="95" rx="64" ry="13" fill="#000000" opacity="0.12" />
          <rect x="-28" y="-32" width="56" height="120" rx="18" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" />
          <rect x="-16" y="-58" width="32" height="26" rx="6" fill="url(#goldGrad)" />
          <rect x="-20" y="6" width="40" height="56" rx="8" fill="#FFFDF9" opacity="0.92" />
          <text x="0" y="29" text-anchor="middle" fill="#7C2D12" font-family="Georgia, serif" font-size="8.5" font-weight="bold" letter-spacing="1">VANILLA</text>
          <text x="0" y="43" text-anchor="middle" fill="#9A3412" font-family="sans-serif" font-size="6.5" letter-spacing="1">BODY MIST</text>
        </g>
      `;
    case 'deodorant':
      return `
        <g transform="translate(200, 148)">
          <ellipse cx="0" cy="90" rx="64" ry="13" fill="#000000" opacity="0.12" />
          <path d="M-28,-12 C-28,-42 28,-42 28,-12 L24,78 C24,84 -24,84 -24,78 Z" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="0" cy="-24" r="22" fill="url(#goldGrad)" opacity="0.85" />
          <rect x="-20" y="10" width="40" height="48" rx="8" fill="#FFFDF9" opacity="0.94" />
          <text x="0" y="31" text-anchor="middle" fill="#9D174D" font-family="Georgia, serif" font-size="8" font-weight="bold" letter-spacing="1">BLUSH</text>
          <text x="0" y="44" text-anchor="middle" fill="#BE185D" font-family="sans-serif" font-size="6.5" letter-spacing="1">48H DEO</text>
        </g>
      `;
    case 'clutch':
      return `
        <g transform="translate(200, 150)">
          <ellipse cx="0" cy="82" rx="95" ry="15" fill="#000000" opacity="0.14" />
          <!-- Arch Chain Strap -->
          <path d="M-56,-14 C-45,-68 45,-68 56,-14" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-dasharray="5 3" />
          <!-- Embellished Bridal Box Clutch -->
          <rect x="-74" y="-16" width="148" height="86" rx="18" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="3" />
          <!-- Pearl Clasp -->
          <circle cx="-10" cy="-22" r="8" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="10" cy="-22" r="8" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="2" />
          <!-- Diamond Quilting & Pearl Studs -->
          <path d="M-50,-16 L0,34 L50,-16 M-50,70 L0,20 L50,70 M-74,27 L-24,-16 M74,27 L24,-16 M-74,27 L-24,70 M74,27 L24,70" stroke="url(#goldGrad)" stroke-width="1.2" fill="none" opacity="0.65" />
          <circle cx="0" cy="27" r="5" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="1.5" />
          <circle cx="-36" cy="27" r="4" fill="#FFFDF9" />
          <circle cx="36" cy="27" r="4" fill="#FFFDF9" />
        </g>
      `;
    case 'slingbag':
      return `
        <g transform="translate(200, 150)">
          <ellipse cx="0" cy="84" rx="90" ry="14" fill="#000000" opacity="0.13" />
          <path d="M-48,-18 C-40,-64 40,-64 48,-18" fill="none" stroke="url(#goldGrad)" stroke-width="4" />
          <rect x="-68" y="-18" width="136" height="90" rx="16" fill="url(#itemGrad)" stroke="url(#goldGrad)" stroke-width="2" />
          <!-- Envelope Flap -->
          <path d="M-68,-10 L0,34 L68,-10" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" />
          <circle cx="0" cy="32" r="11" fill="url(#goldGrad)" />
          <rect x="-4" y="28" width="8" height="8" rx="2" fill="#FFFDF9" />
        </g>
      `;
    case 'choker':
      return `
        <g transform="translate(200, 145)">
          <ellipse cx="0" cy="92" rx="88" ry="14" fill="#000000" opacity="0.12" />
          <!-- Kundan Bridal Necklace Crescent -->
          <path d="M-62,-24 C-62,42 62,42 62,-24" fill="none" stroke="url(#goldGrad)" stroke-width="18" stroke-linecap="round" />
          <path d="M-62,-24 C-62,42 62,42 62,-24" fill="none" stroke="#FFFDF9" stroke-width="6" stroke-dasharray="8 8" stroke-linecap="round" />
          <!-- Hanging Pearl & Ruby Drops -->
          <circle cx="0" cy="48" r="10" fill="${primary}" stroke="url(#goldGrad)" stroke-width="2.5" />
          <circle cx="-28" cy="42" r="8" fill="${primary}" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="28" cy="42" r="8" fill="${primary}" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="-52" cy="26" r="7" fill="${primary}" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="52" cy="26" r="7" fill="${primary}" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="0" cy="64" r="4" fill="#FFFDF9" />
          <circle cx="-28" cy="56" r="3.5" fill="#FFFDF9" />
          <circle cx="28" cy="56" r="3.5" fill="#FFFDF9" />
        </g>
      `;
    case 'jhumka':
      return `
        <g transform="translate(200, 145)">
          <ellipse cx="0" cy="92" rx="78" ry="13" fill="#000000" opacity="0.12" />
          <!-- Left Jhumka -->
          <g transform="translate(-36, 0)">
            <circle cx="0" cy="-32" r="14" fill="url(#goldGrad)" stroke="#FFFDF9" stroke-width="2" />
            <circle cx="0" cy="-32" r="6" fill="${primary}" />
            <path d="M-24,24 C-24,-6 24,-6 24,24 Z" fill="url(#goldGrad)" stroke="#FFFDF9" stroke-width="1.5" />
            <circle cx="-16" cy="32" r="4" fill="#FFFDF9" />
            <circle cx="-6" cy="35" r="4" fill="#FFFDF9" />
            <circle cx="6" cy="35" r="4" fill="#FFFDF9" />
            <circle cx="16" cy="32" r="4" fill="#FFFDF9" />
          </g>
          <!-- Right Jhumka -->
          <g transform="translate(36, 0)">
            <circle cx="0" cy="-32" r="14" fill="url(#goldGrad)" stroke="#FFFDF9" stroke-width="2" />
            <circle cx="0" cy="-32" r="6" fill="${primary}" />
            <path d="M-24,24 C-24,-6 24,-6 24,24 Z" fill="url(#goldGrad)" stroke="#FFFDF9" stroke-width="1.5" />
            <circle cx="-16" cy="32" r="4" fill="#FFFDF9" />
            <circle cx="-6" cy="35" r="4" fill="#FFFDF9" />
            <circle cx="6" cy="35" r="4" fill="#FFFDF9" />
            <circle cx="16" cy="32" r="4" fill="#FFFDF9" />
          </g>
        </g>
      `;
    case 'hairclaw':
      return `
        <g transform="translate(200, 148)">
          <ellipse cx="0" cy="88" rx="82" ry="13" fill="#000000" opacity="0.12" />
          <!-- Butterfly & Pearl Hair Claw Clip -->
          <path d="M-64,10 C-44,-22 44,-22 64,10" fill="none" stroke="url(#goldGrad)" stroke-width="12" stroke-linecap="round" />
          <circle cx="-48" cy="6" r="8" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="1.5" />
          <circle cx="-26" cy="-4" r="9" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="1.5" />
          <circle cx="0" cy="-8" r="10" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="1.5" />
          <circle cx="26" cy="-4" r="9" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="1.5" />
          <circle cx="48" cy="6" r="8" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="1.5" />
          <!-- Gold Butterfly Accent -->
          <path d="M0,22 C-28,-8 -42,26 -8,34 C-32,44 -14,62 0,40 C14,62 32,44 8,34 C42,26 28,-8 0,22 Z" fill="url(#goldGrad)" stroke="#FFFDF9" stroke-width="1.5" />
        </g>
      `;
    case 'tiara':
      return `
        <g transform="translate(200, 148)">
          <ellipse cx="0" cy="88" rx="85" ry="13" fill="#000000" opacity="0.12" />
          <!-- Floral Crystal Hair Vine Tiara -->
          <path d="M-68,26 C-38,-28 38,-28 68,26" fill="none" stroke="url(#goldGrad)" stroke-width="4" />
          <circle cx="0" cy="-14" r="16" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="0" cy="-14" r="6" fill="${primary}" />
          <circle cx="-38" cy="0" r="13" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="-38" cy="0" r="5" fill="${primary}" />
          <circle cx="38" cy="0" r="13" fill="#FFFDF9" stroke="url(#goldGrad)" stroke-width="2" />
          <circle cx="38" cy="0" r="5" fill="${primary}" />
        </g>
      `;
  }
}

export function createProductStudioSvg(spec: StudioArtSpec): string {
  const motif = getIllustrationMotif(
    spec.illustrationType,
    spec.primaryColor,
    spec.secondaryColor,
    spec.accentColor
  );

  const safeCategoryLabel = spec.category
    .toUpperCase()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="400" height="320">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF9F6" />
        <stop offset="55%" stop-color="${spec.secondaryColor}" />
        <stop offset="100%" stop-color="#F6E5DF" />
      </linearGradient>
      <linearGradient id="itemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${spec.primaryColor}" />
        <stop offset="100%" stop-color="${spec.accentColor}" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE68A" />
        <stop offset="50%" stop-color="#D97706" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>
      <radialGradient id="glowGrad" cx="50%" cy="42%" r="48%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Studio Backdrop -->
    <rect width="400" height="320" fill="url(#bgGrad)" />
    <circle cx="200" cy="140" r="135" fill="url(#glowGrad)" />

    <!-- Subtle Architectural Pedestal -->
    <path d="M55,235 L345,235 L370,320 L30,320 Z" fill="#F2DDD5" opacity="0.65" />
    <ellipse cx="200" cy="235" rx="145" ry="18" fill="#FFFDFB" stroke="#E6CFC6" stroke-width="1.5" />

    <!-- Botanical / Sparkle Studio Accents -->
    <circle cx="85" cy="80" r="4" fill="#D97706" opacity="0.28" />
    <circle cx="318" cy="95" r="5" fill="${spec.primaryColor}" opacity="0.22" />
    <circle cx="72" cy="185" r="6" fill="${spec.primaryColor}" opacity="0.18" />

    <!-- Product Studio Subject -->
    ${motif}

    <!-- Subtle Bottom Studio Caption -->
    <text x="200" y="294" text-anchor="middle" fill="#6D4C53" font-family="Georgia, serif" font-size="11" letter-spacing="2.5" opacity="0.75">${safeCategoryLabel} · GIRLZ ZONE</text>
  </svg>`;

  const cleanSvg = svg.replace(/<!--[\s\S]*?-->/g, '').trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleanSvg)}`;
}

export function getFallbackSvgForCategory(category: StrictProductCategory, name: string): string {
  const categoryDefaults: Record<
    StrictProductCategory,
    { primary: string; secondary: string; accent: string; type: StudioArtSpec['illustrationType'] }
  > = {
    Makeup: { primary: '#E11D48', secondary: '#FFE4E6', accent: '#9F1239', type: 'lipstick' },
    'Skin Care': { primary: '#D97706', secondary: '#FEF3C7', accent: '#92400E', type: 'serum' },
    'Hair Care': { primary: '#B45309', secondary: '#FDE68A', accent: '#78350F', type: 'hairmask' },
    'Perfumes & Deo': { primary: '#BE185D', secondary: '#FCE7F3', accent: '#831843', type: 'perfume' },
    Handbags: { primary: '#9D174D', secondary: '#FBCFE8', accent: '#500724', type: 'clutch' },
    'Artificial Jewellery': { primary: '#B45309', secondary: '#FEF3C7', accent: '#78350F', type: 'choker' },
    'Hair Accessories': { primary: '#DB2777', secondary: '#FCE7F3', accent: '#9D174D', type: 'hairclaw' },
  };

  const cfg = categoryDefaults[category] || categoryDefaults.Makeup;
  return createProductStudioSvg({
    id: 'custom',
    title: name,
    subtitle: category,
    category,
    primaryColor: cfg.primary,
    secondaryColor: cfg.secondary,
    accentColor: cfg.accent,
    illustrationType: cfg.type,
  });
}
