import {
  CollectionFilter,
  Product,
  ProductDepartment,
  ProductVariant,
} from '../types/store';

export const NYKAA_CSV_PATH = '/assets/aistudio/Nykaa_Product_Review_dbd41600.csv';

const LUXE_BRANDS = new Set([
  'dior',
  'charlotte tilbury',
  'm.a.c',
  'bobbi brown',
  'estee lauder',
  'clinique',
  'huda beauty',
  'guerlain',
  'versace',
  'prada',
  'burberry',
  'gucci',
  'hermes',
  'hermès',
  'forest essentials',
  'kama ayurveda',
  "l'occitane",
  'sulwhasoo',
  'too faced',
  'smashbox',
  'shiseido',
  'givenchy',
  'benefit cosmetics',
  'montblanc',
  'bvlgari',
  'calvin klein',
  'carolina herrera',
  'paco rabanne',
  'giorgio armani',
  'yves saint laurent',
  'narciso rodriguez',
  'jo malone london',
  'tom ford',
  'kiehls',
  "kiehl's",
  'laneige',
  'pixi',
  'the balm',
  'lime crime',
  'kay beauty',
  'anastasia beverly hills',
  'fenty beauty',
  'nudestix',
  'pat mcgrath labs',
  'murad',
  'dermalogica',
  'clarins',
  'elizabeth arden',
  'davidoff',
  'hugo boss',
  'dolce&gabbana',
  'kenzo',
  'issey miyake',
  'ferragamo',
  'salvatore ferragamo',
  'balenciaga',
  'marc jacobs',
  'chloe',
  'coach',
  'jimmy choo',
  'cartier',
  'corioliss',
  'dyson',
]);

const AYURVEDIC_BRANDS = new Set([
  'biotique',
  'himalaya',
  'forest essentials',
  'kama ayurveda',
  'allin exporters',
  'nykaa naturals',
  'soulflower',
  'khadi natural',
  'vaadi herbals',
  'just herbs',
  'aroma magic',
  'blossom kochhar aroma magic',
  'lotus herbals',
  'vlcc',
  'mamaearth',
  'wow skin science',
  'stbotanica',
  'juicy chemistry',
  'rustic art',
  'khadi essentials',
  'kapiva ayurveda',
  'organic india',
  'indulekha',
  'ayush',
  'patanjali',
  'jovees',
  'shahnaz husain',
  'nyassa',
  'plum',
  'good vibes',
  'mcaffeine',
  'kottakkal',
  'dr. vaidy\'s',
]);

/**
 * Standards-compliant RFC-4180 CSV parser supporting quoted multiline fields
 * and escaped double-quotes ("").
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Cleans UTF-8 mojibake artifacts, broken HTML snippets, and GTM script noise
 * present in scraped retail descriptions.
 */
function cleanText(raw: string): string {
  if (!raw) return '';
  let text = raw
    .replace(/\)\(window,document,'script','dataLayer'[^;]*;?/gi, '')
    .replace(/<\/?[a-z][^>]*>?/gi, ' ')
    .replace(/&quot;?/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/â€™/g, '’')
    .replace(/â€˜/g, '‘')
    .replace(/â€œ/g, '“')
    .replace(/â€\u009d/g, '”')
    .replace(/â€”/g, '—')
    .replace(/â€“/g, '–')
    .replace(/â€¢/g, '·')
    .replace(/â€¦/g, '…')
    .replace(/â€/g, '"')
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã³/g, 'ó')
    .replace(/Ã¶/g, 'ö')
    .replace(/Ã¼/g, 'ü')
    .replace(/Â®/g, '®')
    .replace(/Â™/g, '™')
    .replace(/Â°/g, '°')
    .replace(/Â\s?/g, ' ')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Trim trailing Nykaa promotional footer boilerplate for cleaner product descriptions
  text = text
    .replace(/Explore the entire range of[\s\S]*$/i, '')
    .replace(/You can explore various offers on Nykaa[\s\S]*$/i, '')
    .replace(/MRP:\s*\d[\d,.]*/gi, '')
    .replace(/Expiry Date:\s*[^|.\n]+/gi, '')
    .replace(/Country of Origin:\s*[^|.\n]+/gi, '')
    .replace(/Name of Mfg\s*\/\s*Importer\s*\/\s*Brand:[\s\S]*$/i, '')
    .replace(/Address of Mfg[\s\S]*$/i, '')
    .replace(/Marketed by:[\s\S]*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

function extractCountryOfOrigin(rawDesc: string): string | undefined {
  const m = rawDesc.match(/Country of Origin:\s*([A-Za-z\s.&()-]{2,40}?)(?:\s*(?:Name of Mfg|Address|MRP|Expiry|Explore|\||$))/i);
  if (!m) return undefined;
  const val = m[1].trim().replace(/[.,;:]+$/, '');
  return val.length >= 2 && val.length <= 36 ? val : undefined;
}

function extractMrpFromDescription(rawDesc: string): number | null {
  const m = rawDesc.match(/MRP:\s*(?:Rs\.?|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
  if (!m) return null;
  const num = Number(m[1].replace(/,/g, ''));
  return Number.isFinite(num) && num > 0 ? Math.round(num) : null;
}

function extractVolumeOrWeight(name: string, rawDesc: string): string {
  const combined = `${name} ${rawDesc.slice(0, 400)}`;
  const match = combined.match(
    /\b(\d+(?:\.\d+)?\s*(?:ml|g|gm|gms|grams|kg|oz|fl\.?\s*oz|capsules|tablets|caps|tabs|wipes|sheets|pcs|pack of \d+))\b/i
  );
  if (match) {
    return match[1].replace(/\s+/g, ' ').replace(/gms?/i, 'g').trim();
  }
  return 'Standard Pack';
}

function extractHowToUse(rawDesc: string, department: ProductDepartment): string {
  const cleaned = rawDesc.replace(/\s+/g, ' ');
  const match = cleaned.match(
    /(?:How to Use|Directions?(?: for Use)?|Usage)[:\-\s]+([^.]{20,260}\.)/i
  );
  if (match) {
    return cleanText(match[1]);
  }
  switch (department) {
    case 'Makeup':
      return 'Apply evenly onto prepped skin, lips, or lids using fingertips or a precision brush. Build coverage to desired intensity.';
    case 'Skincare':
      return 'Apply a small amount onto clean skin morning and evening. Follow with moisturizer and broad-spectrum SPF during the day.';
    case 'Haircare':
      return 'Distribute evenly through damp hair or scalp, massage gently, and rinse or style as directed on pack.';
    case 'Fragrance':
      return 'Spritz lightly onto pulse points—wrists, neck, and behind the ears—allowing notes to develop naturally.';
    case 'Bath & Body':
      return 'Massage gently over damp or freshly cleansed skin until absorbed or lathered thoroughly, then rinse if applicable.';
    case 'Wellness':
      return 'Follow the recommended daily serving on the label alongside a balanced diet, or consult a healthcare specialist.';
    case 'Mom & Baby':
      return 'Use gently as part of your daily care routine. Patch test on sensitive skin prior to first full application.';
    case "Men's Store":
      return 'Apply generously as part of your daily grooming routine on clean skin, beard, or hair.';
    default:
      return 'Use daily as part of your botanical beauty routine for best results. Store in a cool, dry place away from direct sunlight.';
  }
}

function extractTagline(cleanedDesc: string, subCategory: string, brand: string): string {
  if (!cleanedDesc) {
    return `Authentic ${subCategory.toLowerCase()} crafted by ${brand}.`;
  }
  // Pick first clean sentence between 25 and 140 chars
  const sentences = cleanedDesc.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const trimmed = s.trim();
    if (
      trimmed.length >= 28 &&
      trimmed.length <= 150 &&
      !/^(manufacturer|warranty|kindly retain|about the brand)/i.test(trimmed)
    ) {
      return trimmed;
    }
  }
  const clipped = cleanedDesc.slice(0, 128).replace(/\s+\S*$/, '').trim();
  return clipped ? `${clipped}${clipped.endsWith('.') ? '' : '.'}` : `Authentic ${subCategory.toLowerCase()} by ${brand}.`;
}

function parseKeyActives(rawContents: string, rawDesc: string, subCategory: string): string[] {
  const cleaned = cleanText(rawContents);
  if (cleaned) {
    const tokens = cleaned
      .split(/[,;|•]/)
      .map((t) =>
        t
          .replace(/^(key\s+)?ingredients?\s*[:-]?\s*/i, '')
          .replace(/\([^)]*\)/g, '')
          .trim()
      )
      .filter((t) => t.length >= 3 && t.length <= 42 && !/^\d+%?$/.test(t));
    if (tokens.length > 0) {
      return Array.from(new Set(tokens)).slice(0, 5);
    }
  }
  const keyMatch = rawDesc.match(/Key Ingredients?[:\-\s]+([^.]{10,140})/i);
  if (keyMatch) {
    const parts = cleanText(keyMatch[1])
      .split(/[,&]/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 3 && s.length <= 40);
    if (parts.length > 0) return parts.slice(0, 4);
  }
  return [subCategory, 'Authentic Formulation', 'Batch Verified'];
}

function parseImages(rawImages: string): string[] {
  if (!rawImages) return [];
  const urls = rawImages
    .split('|')
    .map((u) => u.trim())
    .filter((u) => {
      if (!u.startsWith('http')) return false;
      const lower = u.toLowerCase();
      if (lower.includes('youtube.com') || lower.includes('youtu.be')) return false;
      return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(lower) || lower.includes('images-static.nykaa.com');
    });

  // Push authenticity certificate / brand banner images to the back so real packshots show first
  const primary: string[] = [];
  const secondary: string[] = [];
  for (const url of urls) {
    const lower = url.toLowerCase();
    if (
      lower.includes('certificate') ||
      lower.includes('authentic') ||
      lower.includes('_auth') ||
      lower.includes('nykaa_auth')
    ) {
      secondary.push(url);
    } else {
      primary.push(url);
    }
  }
  return Array.from(new Set([...primary, ...secondary])).slice(0, 6);
}

function normalizeDepartmentAndSubCategory(
  rawCategory: string,
  rawTags: string,
  name: string,
  brand: string
): { department: ProductDepartment; subCategory: string; isLuxeFromCat: boolean } {
  const cat = rawCategory.trim();
  const segments = cat
    .split('>')
    .map((s) => s.trim())
    .filter(Boolean);
  const top = (segments[0] || '').toLowerCase();
  const second = (segments[1] || '').toLowerCase();
  const last = segments[segments.length - 1] || '';
  const combined = `${cat} ${rawTags} ${name}`.toLowerCase();
  const isLuxeFromCat =
    top === 'nykaa luxe' ||
    rawTags.toLowerCase().includes('nykaa luxe') ||
    LUXE_BRANDS.has(brand.toLowerCase());

  const cleanSub = (fallback: string): string => {
    if (
      last &&
      !last.toLowerCase().startsWith('brand') &&
      last.toLowerCase() !== 'nykaa luxe' &&
      last.toLowerCase() !== 'shop by concern' &&
      last.toLowerCase() !== 'types of skin' &&
      last.toLowerCase() !== 'nfba 2020 nominees online sale'
    ) {
      return last;
    }
    return fallback;
  };

  // Explicit top-level mappings first
  if (top === 'makeup') {
    return { department: 'Makeup', subCategory: cleanSub('Colour Cosmetics'), isLuxeFromCat };
  }
  if (top === 'skin') {
    if (second.includes('body care')) {
      return { department: 'Bath & Body', subCategory: cleanSub('Body Care'), isLuxeFromCat };
    }
    return { department: 'Skincare', subCategory: cleanSub('Skin Care'), isLuxeFromCat };
  }
  if (top === 'hair' || top === 'appliances') {
    return { department: 'Haircare', subCategory: cleanSub('Hair Care'), isLuxeFromCat };
  }
  if (top === 'fragrance') {
    return { department: 'Fragrance', subCategory: cleanSub('Perfumes & Mists'), isLuxeFromCat };
  }
  if (top === 'personal care') {
    if (second.includes('face')) {
      return { department: 'Skincare', subCategory: cleanSub('Face Care'), isLuxeFromCat };
    }
    if (second.includes("men's")) {
      return { department: "Men's Store", subCategory: cleanSub("Men's Grooming"), isLuxeFromCat };
    }
    if (combined.includes('shampoo') || combined.includes('conditioner')) {
      return { department: 'Haircare', subCategory: cleanSub('Shampoo & Conditioner'), isLuxeFromCat };
    }
    return { department: 'Bath & Body', subCategory: cleanSub('Bath & Shower'), isLuxeFromCat };
  }
  if (top === 'natural') {
    return { department: 'Natural', subCategory: cleanSub('Botanical Care'), isLuxeFromCat };
  }
  if (top === 'health & wellness') {
    return { department: 'Wellness', subCategory: cleanSub('Health Supplements'), isLuxeFromCat };
  }
  if (top === 'mom & baby') {
    return { department: 'Mom & Baby', subCategory: cleanSub('Mom & Baby Care'), isLuxeFromCat };
  }
  if (top === "men's store") {
    return { department: "Men's Store", subCategory: cleanSub("Men's Grooming"), isLuxeFromCat };
  }

  // Nykaa Luxe, Brand > ..., NFBA, or empty categories: infer department from tags & product name
  if (
    /\b(maternity|nursing bra|baby|diaper|feeding|pregnancy|kids care)\b/.test(combined)
  ) {
    return {
      department: 'Mom & Baby',
      subCategory: /\b(bra|maternity)\b/.test(combined) ? 'Maternity Care' : 'Baby Care',
      isLuxeFromCat,
    };
  }
  if (
    /\b(eau de parfum|eau de toilette|perfume|cologne|deodorant|body mist|fragrance)\b/.test(
      combined
    )
  ) {
    return {
      department: 'Fragrance',
      subCategory: /mist/.test(combined)
        ? 'Body Mist'
        : /deodorant/.test(combined)
          ? 'Deodorants'
          : 'Perfumes (EDT / EDP)',
      isLuxeFromCat,
    };
  }
  if (
    /\b(men's|mens|beard|shaving|aftershave|grooming)\b/.test(combined) &&
    !/\bwomen/.test(combined)
  ) {
    return {
      department: "Men's Store",
      subCategory: /beard|shav/.test(combined) ? 'Shaving & Beard' : "Men's Care",
      isLuxeFromCat,
    };
  }
  if (
    /\b(lipstick|lip gloss|lip balm|lip stain|lip liner|lip crayon|foundation|concealer|blush|highlighter|illuminator|bronzer|contour|mascara|eyeliner|kajal|eyeshadow|eye shadow|eyebrow|brow|primer|compact|loose powder|nail polish|nail enamel|makeup|cheek tint|curler)\b/.test(
      combined
    )
  ) {
    let sub = 'Makeup';
    if (/lipstick|lip stain|lip crayon|lip gloss|lip balm|lip liner/.test(combined)) sub = 'Lips';
    else if (/mascara|eyeliner|kajal|eyeshadow|eye shadow|brow|lash/.test(combined)) sub = 'Eyes';
    else if (/nail/.test(combined)) sub = 'Nails';
    else if (/foundation|concealer|blush|highlighter|illuminator|primer|compact|contour|bronzer/.test(combined))
      sub = 'Face';
    return { department: 'Makeup', subCategory: sub, isLuxeFromCat };
  }
  if (
    /\b(shampoo|conditioner|hair oil|hair mask|hair serum|hair fall|hair color|hair colour|curling wand|hair styler|dandruff)\b/.test(
      combined
    )
  ) {
    let sub = 'Hair Care';
    if (/shampoo/.test(combined)) sub = 'Shampoo';
    else if (/conditioner/.test(combined)) sub = 'Conditioner';
    else if (/hair oil/.test(combined)) sub = 'Hair Oil';
    else if (/wand|curler|dryer|styler/.test(combined)) sub = 'Styling Tools';
    return { department: 'Haircare', subCategory: sub, isLuxeFromCat };
  }
  if (
    /\b(capsule|tablet|supplement|protein|whey|multivitamin|vitamin d|biotin|green tea|super food|immunity|probiotic|weight|condom|lubricant|wellness)\b/.test(
      combined
    )
  ) {
    return {
      department: 'Wellness',
      subCategory: /protein|whey/.test(combined)
        ? 'Sports Nutrition'
        : /tea|super food/.test(combined)
          ? 'Superfoods & Teas'
          : 'Health Supplements',
      isLuxeFromCat,
    };
  }
  if (
    /\b(body lotion|body wash|shower gel|soap|bath|hand cream|foot cream|body scrub|body butter|sanitiz)\b/.test(
      combined
    )
  ) {
    return {
      department: 'Bath & Body',
      subCategory: /lotion|butter/.test(combined)
        ? 'Body Lotions'
        : /wash|gel|soap/.test(combined)
          ? 'Bath & Shower'
          : 'Body Care',
      isLuxeFromCat,
    };
  }
  if (/\b(face wash|cleanser|face scrub|tan removal scrub|facial scrub|face cream|moisturizer|sunscreen|spf|serum|sheet mask)\b/.test(combined)) {
    return {
      department: 'Skincare',
      subCategory: /sunscreen|spf/.test(combined)
        ? 'Sun Care'
        : /scrub/.test(combined)
          ? 'Scrubs & Exfoliators'
          : /face wash|cleanser/.test(combined)
            ? 'Cleansers'
            : /mask|peel/.test(combined)
              ? 'Masks & Peels'
              : /serum/.test(combined)
                ? 'Serums'
                : 'Moisturizers & Creams',
      isLuxeFromCat,
    };
  }
  if (/\b(essential oil|ayurveda|ayurvedic|herbal|organic)\b/.test(combined)) {
    return {
      department: 'Natural',
      subCategory: /essential oil/.test(combined) ? 'Aromatherapy' : 'Herbal Care',
      isLuxeFromCat,
    };
  }

  return {
    department: 'Skincare',
    subCategory: /sunscreen|spf/.test(combined)
      ? 'Sun Care'
      : /face wash|cleanser/.test(combined)
        ? 'Cleansers'
        : /mask|peel/.test(combined)
          ? 'Masks & Peels'
          : /serum/.test(combined)
            ? 'Serums'
            : 'Moisturizers & Creams',
    isLuxeFromCat,
  };
}

function buildVariantFromName(name: string, volumeOrWeight: string): ProductVariant[] {
  // Check if product name includes a shade or variant after " - "
  const dashIdx = name.lastIndexOf(' - ');
  if (dashIdx > 8 && dashIdx < name.length - 2) {
    const shadeCandidate = name.slice(dashIdx + 3).trim();
    if (shadeCandidate.length >= 2 && shadeCandidate.length <= 42) {
      return [
        {
          id: shadeCandidate.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'default',
          label: shadeCandidate,
        },
      ];
    }
  }
  return [
    {
      id: 'standard',
      label: volumeOrWeight !== 'Standard Pack' ? volumeOrWeight : 'Standard Size',
    },
  ];
}

function computeCollections(params: {
  department: ProductDepartment;
  subCategory: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount: number;
  isLuxe: boolean;
  rawTags: string;
  rawCategory: string;
  name: string;
}): Exclude<CollectionFilter, 'All'>[] {
  const cols = new Set<Exclude<CollectionFilter, 'All'>>();
  const brandLower = params.brand.toLowerCase();
  const combined = `${params.rawCategory} ${params.rawTags} ${params.name} ${params.subCategory}`.toLowerCase();

  if (params.isLuxe || LUXE_BRANDS.has(brandLower) || params.price >= 2200) {
    cols.add('Nykaa Luxe');
  }
  if (
    params.department === 'Natural' ||
    AYURVEDIC_BRANDS.has(brandLower) ||
    /\b(ayurved|herbal|botanical|essential oil|organic)\b/.test(combined)
  ) {
    cols.add('Ayurvedic & Botanical');
  }
  if (
    params.department === 'Makeup' &&
    /\b(lip|eye|kajal|liner|mascara|shadow|brow|lash)\b/.test(
      `${params.subCategory} ${params.name}`.toLowerCase()
    )
  ) {
    cols.add('Lip & Eye Studio');
  }
  if (params.rating >= 4.5 && params.reviewCount >= 3) {
    cols.add('Top Rated 4.5+');
  }
  if (params.price > 0 && params.price <= 399) {
    cols.add('Under ₹399');
  }

  return Array.from(cols);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

/**
 * Parses the full Nykaa CSV text into normalized Product entries.
 * Deduplicates by Product Url (or normalized brand+name+price), cleans mojibake,
 * recovers shifted rows where possible, and assigns Departments, Sub-Categories,
 * and Curated Collections.
 */
export function parseNykaaCsvText(csvText: string): Product[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  const seenKeys = new Set<string>();
  const parsed: Product[] = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length < 10) continue;

    // Detect the 15 shifted rows where col[0] starts with "http"
    const isShifted = (r[0] || '').trim().startsWith('http');

    const rawCategory = isShifted ? r[4] || '' : r[3] || '';
    const rawBrand = isShifted ? r[5] || '' : r[4] || '';
    const rawName = isShifted ? r[6] || '' : r[5] || '';
    const rawPriceStr = isShifted ? r[7] || '' : r[6] || '';
    const rawUrl = isShifted ? r[8] || r[0] || '' : r[7] || '';
    const rawDesc = isShifted ? r[10] || '' : r[9] || '';
    const rawImages = isShifted ? r[12] || '' : r[11] || '';
    const rawTags = isShifted ? r[13] || '' : r[12] || '';
    const rawContents = isShifted ? r[14] || '' : r[13] || '';
    const rawRating = isShifted ? r[15] || '' : r[14] || '';
    const rawReviewsCount = isShifted ? r[16] || '' : r[15] || '';

    const name = cleanText(rawName);
    const brand = cleanText(rawBrand) || 'Nykaa Select';
    if (!name || name.length < 3) continue;

    // Parse price (fallback to MRP extracted from description for shifted rows)
    let price = Number(rawPriceStr.replace(/[^0-9.]/g, ''));
    const extractedMrp = extractMrpFromDescription(rawDesc);
    if (!Number.isFinite(price) || price <= 0) {
      if (extractedMrp && extractedMrp > 0) {
        price = extractedMrp;
      } else {
        continue; // Skip rows with no valid price at all
      }
    }
    price = Math.round(price);
    const mrp = extractedMrp && extractedMrp > price ? extractedMrp : price;

    // Deduplicate carefully: do NOT use Product Id alone (HUL brands share barcode IDs across SKUs)
    const normalizedUrl = rawUrl.trim().toLowerCase().split('&')[0];
    const dedupeKey =
      normalizedUrl && normalizedUrl.startsWith('http')
        ? normalizedUrl
        : `${brand.toLowerCase()}|${name.toLowerCase()}|${price}`;
    if (seenKeys.has(dedupeKey)) continue;
    seenKeys.add(dedupeKey);

    const images = parseImages(rawImages);
    const primaryImage = images[0] || '';

    const ratingVal = Number(rawRating);
    const rating =
      Number.isFinite(ratingVal) && ratingVal > 0 && ratingVal <= 5
        ? Math.round(ratingVal * 10) / 10
        : 0;

    const revCountVal = Number(rawReviewsCount);
    const reviewCount =
      Number.isFinite(revCountVal) && revCountVal > 0 ? Math.round(revCountVal) : 0;

    const { department, subCategory, isLuxeFromCat } = normalizeDepartmentAndSubCategory(
      rawCategory,
      rawTags,
      name,
      brand
    );

    const cleanedDesc = cleanText(rawDesc);
    const volumeOrWeight = extractVolumeOrWeight(name, rawDesc);
    const tagline = extractTagline(cleanedDesc, subCategory, brand);
    const keyActives = parseKeyActives(rawContents, rawDesc, subCategory);
    const ingredients = cleanText(rawContents) || undefined;
    const countryOfOrigin = extractCountryOfOrigin(rawDesc);
    const howToUse = extractHowToUse(rawDesc, department);
    const variants = buildVariantFromName(name, volumeOrWeight);
    const collections = computeCollections({
      department,
      subCategory,
      brand,
      price,
      rating,
      reviewCount,
      isLuxe: isLuxeFromCat,
      rawTags,
      rawCategory,
      name,
    });

    let stockNote: string | undefined;
    if (collections.includes('Nykaa Luxe')) {
      stockNote = 'Nykaa Luxe';
    } else if (reviewCount >= 500 && rating >= 4.4) {
      stockNote = 'Bestseller';
    } else if (mrp > price && Math.round(((mrp - price) / mrp) * 100) >= 20) {
      stockNote = `${Math.round(((mrp - price) / mrp) * 100)}% Off`;
    }

    parsed.push({
      id: `csv-${i}-${slugify(brand).slice(0, 14)}-${slugify(name).slice(0, 24)}`,
      slug: slugify(`${brand}-${name}`),
      name,
      brand,
      category: department,
      subCategory,
      collections,
      price,
      mrp,
      rating,
      reviewCount,
      image: primaryImage,
      images: images.length > 0 ? images : undefined,
      imageFit: 'contain',
      tagline,
      description:
        cleanedDesc.length >= 25
          ? cleanedDesc.slice(0, 700)
          : `${name} by ${brand}. Curated under Nykaa ${department} — ${subCategory}.`,
      keyActives,
      ingredients,
      howToUse,
      volumeOrWeight,
      countryOfOrigin,
      stockNote,
      productUrl: rawUrl.trim().startsWith('http') ? rawUrl.trim() : undefined,
      variants,
      reviews: [],
    });
  }

  // Sort CSV products cleanly by visual completeness + community popularity so the catalog opens strongly
  return parsed.sort((a, b) => {
    const aHasImg = a.image ? 1 : 0;
    const bHasImg = b.image ? 1 : 0;
    if (aHasImg !== bHasImg) return bHasImg - aHasImg;
    return b.reviewCount - a.reviewCount || b.rating - a.rating;
  });
}

let cachedPromise: Promise<Product[]> | null = null;

export function loadNykaaCsvProducts(): Promise<Product[]> {
  if (!cachedPromise) {
    cachedPromise = fetch(NYKAA_CSV_PATH)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load catalog dataset (${res.status})`);
        }
        return res.text();
      })
      .then((text) => parseNykaaCsvText(text));
  }
  return cachedPromise;
}
