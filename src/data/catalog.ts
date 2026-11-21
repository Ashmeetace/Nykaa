import { CategoryFilter, CollectionFilter, Product } from '../types/store';

export const HERO_IMAGE = '/src/assets/images/hero_beauty_editorial_1794801507719.jpg';
export const EDITORIAL_CRAFT_IMAGE = '/src/assets/images/editorial_atelier_ingredients_1794801511963.jpg';

export const DEPARTMENTS: CategoryFilter[] = [
  'All',
  'Makeup',
  'Skincare',
  'Haircare',
  'Bath & Body',
  'Fragrance',
  'Natural',
  'Wellness',
  'Mom & Baby',
  "Men's Store",
];

export interface CollectionMeta {
  id: Exclude<CollectionFilter, 'All'>;
  title: string;
  subtitle: string;
}

export const CURATED_COLLECTIONS: CollectionMeta[] = [
  {
    id: 'Nykaa Luxe',
    title: 'Nykaa Luxe',
    subtitle: 'DIOR, M.A.C, Charlotte Tilbury, Estee Lauder & prestige icons',
  },
  {
    id: 'Signature Edit',
    title: 'Signature Edit',
    subtitle: 'Flagship editorial formulations crafted for Indian skin & light',
  },
  {
    id: 'Ayurvedic & Botanical',
    title: 'Ayurvedic & Botanical',
    subtitle: 'Forest Essentials, Kama Ayurveda, Biotique & cold-pressed oils',
  },
  {
    id: 'Lip & Eye Studio',
    title: 'Lip & Eye Studio',
    subtitle: 'Velvet mattes, liquid lipsticks, kajals, liners & shadow palettes',
  },
  {
    id: 'Top Rated 4.5+',
    title: 'Top Rated 4.5+',
    subtitle: 'Community-vetted staples rated 4.5 stars and above',
  },
  {
    id: 'Under ₹399',
    title: 'Under ₹399',
    subtitle: 'Everyday cleansers, sheet masks, lip care & beauty essentials',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'nykaa-matte-velvet-lipstick',
    slug: 'matte-luxe-velvet-lipstick',
    name: 'Matte Luxe Velvet Lip Colour',
    brand: 'Nykaa Cosmetics',
    category: 'Makeup',
    subCategory: 'Lipstick',
    collections: ['Signature Edit', 'Lip & Eye Studio', 'Top Rated 4.5+'],
    price: 899,
    mrp: 1099,
    rating: 4.9,
    reviewCount: 2480,
    image: '/src/assets/images/product_matte_lipstick_1794801509147.jpg',
    imageFit: 'cover',
    tagline: 'One-stroke soft-matte pigment enriched with cold-pressed rosehip oil.',
    description:
      'Formulated in Milan and shade-calibrated for warm, olive, and deep South Asian undertones. Glides smoothly without settling into fine lines and wears comfortably for up to 10 hours.',
    keyActives: ['Cold-Pressed Rosehip Oil', 'Vitamin E Acetate', 'Micro-Velvet Silica Spheres'],
    howToUse:
      'Apply directly from the bullet starting at the Cupid’s bow. Blot gently with tissue and layer once for evening intensity.',
    volumeOrWeight: '4.2 g',
    countryOfOrigin: 'Italy',
    stockNote: 'Signature Edit',
    variants: [
      { id: 'rosewood-04', label: 'Rosewood 04', colorHex: '#8E354A' },
      { id: 'spiced-berry-09', label: 'Spiced Berry 09', colorHex: '#6E2235' },
      { id: 'terracotta-12', label: 'Terracotta Nude 12', colorHex: '#A65446' },
      { id: 'chai-mauve-16', label: 'Chai Mauve 16', colorHex: '#9C6B6E' },
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Meera Krishnan',
        city: 'Bengaluru',
        rating: 5,
        date: 'October 2026',
        shadeOrVariant: 'Rosewood 04',
        comment:
          'Rarely find a matte lipstick that does not dry out by afternoon. Rosewood 04 flatters medium-tan skin without looking chalky.',
      },
      {
        id: 'rev-2',
        author: 'Ananya Deshmukh',
        city: 'Pune',
        rating: 5,
        date: 'September 2026',
        shadeOrVariant: 'Terracotta Nude 12',
        comment:
          'Rich pigment in a single swipe and the magnetic rose-gold casing feels genuinely weighted.',
      },
    ],
  },
  {
    id: 'nykaa-skinrx-vitamin-c',
    slug: 'lumiglow-15-vitamin-c-serum',
    name: 'LumiGlow 15% Vitamin C + Ferulic Serum',
    brand: 'Nykaa SkinRx',
    category: 'Skincare',
    subCategory: 'Serums & Essence',
    collections: ['Signature Edit', 'Top Rated 4.5+'],
    price: 1299,
    mrp: 1550,
    rating: 4.8,
    reviewCount: 1840,
    image: '/src/assets/images/product_vitamin_c_serum_1794801508453.jpg',
    imageFit: 'cover',
    tagline: 'Stabilized L-ascorbic acid concentrate for post-blemish radiance.',
    description:
      'A clinical-grade brightening serum pairing 15% L-Ascorbic Acid with 0.5% Ferulic Acid and Kakadu Plum extract in UV-shielded amber glass to preserve potency in humid climates.',
    keyActives: ['15% L-Ascorbic Acid', '0.5% Ferulic Acid', '1% Vitamin E', 'Kakadu Plum'],
    howToUse:
      'Press 3 to 4 drops onto clean, dry skin every morning prior to moisturizer and broad-spectrum SPF.',
    volumeOrWeight: '30 ml',
    countryOfOrigin: 'India',
    stockNote: 'Dermatologist Tested',
    variants: [
      { id: '30ml', label: '30 ml · Standard Dropper' },
      { id: '50ml', label: '50 ml · Studio Refill' },
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Rhea Kapoor',
        city: 'Mumbai',
        rating: 5,
        date: 'October 2026',
        shadeOrVariant: '30 ml · Standard Dropper',
        comment:
          'Absorbs cleanly under sunscreen with zero pilling. My post-acne marks faded noticeably by week four.',
      },
    ],
  },
  {
    id: 'aeterna-ceramide-cream',
    slug: 'whipped-ceramide-barrier-cream',
    name: 'Whipped Ceramide Barrier Cream',
    brand: 'Aeterna Skin',
    category: 'Skincare',
    subCategory: 'Moisturizers & Creams',
    collections: ['Signature Edit', 'Top Rated 4.5+'],
    price: 1450,
    mrp: 1650,
    rating: 4.8,
    reviewCount: 960,
    image: '/src/assets/images/product_hydra_moisturizer_1794801509147.jpg',
    imageFit: 'cover',
    tagline: 'Five-ceramide recovery emulsion for compromised moisture barriers.',
    description:
      'An airy yet deeply restorative daily moisturizer fortified with bio-identical ceramides NP, AP, and EOP, squalane, and colloidal oat to calm redness without heavy occlusion.',
    keyActives: ['5-Ceramide Complex', 'Plant Squalane', '2% Niacinamide', 'Colloidal Oat'],
    howToUse:
      'Warm a pea-sized amount between fingertips and press evenly across face and neck morning and evening.',
    volumeOrWeight: '50 ml',
    countryOfOrigin: 'South Korea',
    variants: [
      { id: '50ml', label: '50 ml · Frosted Jar' },
      { id: '15ml', label: '15 ml · Travel Size' },
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Kavya Nair',
        city: 'Kochi',
        rating: 5,
        date: 'October 2026',
        shadeOrVariant: '50 ml · Frosted Jar',
        comment:
          'Saved my skin after over-exfoliating with retinoids. Whipped texture feels cool and never greasy in coastal humidity.',
      },
    ],
  },
  {
    id: 'moi-ambre-rose-oud',
    slug: 'ambre-rose-oud-eau-de-parfum',
    name: 'Ambre Rose-Oud Eau de Parfum',
    brand: 'Moi by Nykaa',
    category: 'Fragrance',
    subCategory: 'Perfumes (EDT / EDP)',
    collections: ['Signature Edit', 'Nykaa Luxe', 'Top Rated 4.5+'],
    price: 2499,
    mrp: 2999,
    rating: 4.9,
    reviewCount: 742,
    image: '/src/assets/images/product_oud_perfume_1794801509099.jpg',
    imageFit: 'cover',
    tagline: 'Kannauj Damask rose layered over smoked Assam agarwood and warm amber.',
    description:
      'An evening extrait-strength Eau de Parfum macerated for six weeks. Opens with crisp pink peppercorn and bergamot before settling into velvety Damask rose, resinous labdanum, and dry Assam oud.',
    keyActives: ['Kannauj Damask Rose', 'Assam Oud Wood', 'Golden Amber Resin', 'Pink Pepper'],
    howToUse:
      'Mist onto pulse points—wrists, collarbones, and behind the ears—without rubbing so the top notes remain intact.',
    volumeOrWeight: '50 ml',
    countryOfOrigin: 'India',
    stockNote: 'Small Batch',
    variants: [
      { id: '50ml', label: '50 ml · Eau de Parfum' },
      { id: '100ml', label: '100 ml · Collector Flacon' },
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Zoya Merchant',
        city: 'New Delhi',
        rating: 5,
        date: 'November 2026',
        shadeOrVariant: '50 ml · Eau de Parfum',
        comment:
          'Complex and modern without being cloying. Still lingers softly on cashmere scarves the next morning.',
      },
    ],
  },
  {
    id: 'botanist-hair-elixir',
    slug: 'argan-hibiscus-hair-repair-elixir',
    name: 'Argan & Hibiscus Botanical Hair Elixir',
    brand: 'The Botanist India',
    category: 'Haircare',
    subCategory: 'Hair Oil',
    collections: ['Signature Edit', 'Ayurvedic & Botanical', 'Top Rated 4.5+'],
    price: 950,
    mrp: 1150,
    rating: 4.7,
    reviewCount: 1120,
    image: '/src/assets/images/product_hair_elixir_1794801510376.jpg',
    imageFit: 'cover',
    tagline: 'Weightless pre-wash and finishing oil for frizz control and thermal shine.',
    description:
      'Cold-infusion of Moroccan argan oil, hibiscus flower extract, and rosemary leaf designed to seal split cuticles and shield strands from hard water minerals and humidity.',
    keyActives: ['Virgin Argan Oil', 'Red Hibiscus Extract', 'Rosemary Leaf', 'Abyssinian Seed'],
    howToUse:
      'Work 2 pumps through damp mid-lengths and ends before air-drying or heat styling, or massage into scalp 30 minutes pre-wash.',
    volumeOrWeight: '100 ml',
    countryOfOrigin: 'India',
    variants: [
      { id: '100ml', label: '100 ml · Apothecary Pump' },
      { id: '200ml', label: '200 ml · Salon Bottle' },
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Divya Menon',
        city: 'Chennai',
        rating: 5,
        date: 'September 2026',
        shadeOrVariant: '100 ml · Apothecary Pump',
        comment:
          'Two drops tame monsoon frizz on wavy hair without weighing curls down.',
      },
    ],
  },
  {
    id: 'lumiere-rosewood-palette',
    slug: 'rosewood-9-pan-eyeshadow-palette',
    name: 'Rosewood & Amber 9-Pan Eye Palette',
    brand: 'Lumière Studio',
    category: 'Makeup',
    subCategory: 'Eye Shadow',
    collections: ['Signature Edit', 'Lip & Eye Studio', 'Top Rated 4.5+'],
    price: 1899,
    mrp: 2200,
    rating: 4.8,
    reviewCount: 615,
    image: '/src/assets/images/product_eyeshadow_palette_1794801509613.jpg',
    imageFit: 'cover',
    tagline: 'Six velvety mattes and three wet-foil metallics in warm Indian neutrals.',
    description:
      'Finely milled talc-free pressed pigments spanning champagne shimmer, toasted terracotta, deep espresso, and crushed berrywood. Zero fallout with finger or brush application.',
    keyActives: ['Jojoba Esters', 'Squalane Binder', 'Mica Mineral Pearls'],
    howToUse:
      'Blend matte transitions into the crease with a fluffy brush and tap metallic shades onto the center lid using a fingertip.',
    volumeOrWeight: '11.7 g',
    countryOfOrigin: 'France',
    variants: [
      { id: 'warm-rosewood', label: '01 Warm Rosewood', colorHex: '#B66E68' },
      { id: 'gilded-bronze', label: '02 Gilded Bronze', colorHex: '#8C5B3C' },
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Sana Qureshi',
        city: 'Hyderabad',
        rating: 5,
        date: 'October 2026',
        shadeOrVariant: '01 Warm Rosewood',
        comment:
          'Every single pan is wearable for work or festive evenings. The espresso shade doubles cleanly as a soft liner.',
      },
    ],
  },
  {
    id: 'aurora-tinted-spf',
    slug: 'sheer-mineral-tinted-spf-50',
    name: 'Sheer Mineral Tinted Fluid SPF 50',
    brand: 'Aurora Botanica',
    category: 'Skincare',
    subCategory: 'Sun Care',
    collections: ['Signature Edit', 'Ayurvedic & Botanical', 'Top Rated 4.5+'],
    price: 1099,
    mrp: 1299,
    rating: 4.7,
    reviewCount: 1410,
    image: '/src/assets/images/product_tinted_sunscreen_1794801510469.jpg',
    imageFit: 'cover',
    tagline: 'Zero-white-cast PA++++ mineral protection with natural skin-tint.',
    description:
      'Micro-encapsulated zinc oxide suspended in a breathable centella and niacinamide emulsion. Evens tone naturally while protecting against UVA, UVB, and visible blue light.',
    keyActives: ['20% Non-Nano Zinc Oxide', 'Centella Asiatica', 'Ectoin', 'Iron Oxides'],
    howToUse:
      'Shake well before use. Apply two finger-lengths evenly across face and neck 15 minutes prior to sun exposure.',
    volumeOrWeight: '40 ml',
    countryOfOrigin: 'India',
    variants: [
      { id: 'light-sand', label: '01 Light Sand', colorHex: '#DFBE9F' },
      { id: 'warm-honey', label: '02 Warm Honey', colorHex: '#C5956B' },
      { id: 'rich-espresso', label: '03 Rich Espresso', colorHex: '#8C5C3E' },
    ],
    reviews: [
      {
        id: 'rev-8',
        author: 'Nandini Rao',
        city: 'Bengaluru',
        rating: 5,
        date: 'October 2026',
        shadeOrVariant: '02 Warm Honey',
        comment:
          'Finally a mineral sunscreen with zero grey cast on medium-deep skin. Replaces my everyday skin tint.',
      },
    ],
  },
  {
    id: 'nykaa-kohl-liner-duo',
    slug: 'kohl-kajal-precision-liner-duo',
    name: 'Kohl Kajal & Precision Liner Duo',
    brand: 'Nykaa Eyes',
    category: 'Makeup',
    subCategory: 'Kajal & Eyeliner',
    collections: ['Signature Edit', 'Lip & Eye Studio', 'Top Rated 4.5+'],
    price: 799,
    mrp: 950,
    rating: 4.9,
    reviewCount: 3190,
    image: '/src/assets/images/product_kajal_eyeliner_1794801511061.jpg',
    imageFit: 'cover',
    tagline: 'Smudge-proof 24-hour matte kohl pencil paired with a waterproof brush pen.',
    description:
      'Ophthalmologist-approved carbon-black pigment infused with soothing chamomile and castor oil for sensitive waterlines, alongside a razor-fine Japanese brush tip liquid liner.',
    keyActives: ['Castor Seed Oil', 'Chamomile Extract', 'Japanese Micro-Bristle Tip'],
    howToUse:
      'Trace the upper and lower waterline with the kohl pencil, then flick the liquid pen from the outer corner for crisp definition.',
    volumeOrWeight: '1.2 g + 1 ml',
    countryOfOrigin: 'Germany',
    stockNote: 'Iconic Duo',
    variants: [
      { id: 'ultra-black', label: 'Ultra Matte Black', colorHex: '#181416' },
      { id: 'espresso-brown', label: 'Dark Espresso', colorHex: '#432C24' },
    ],
    reviews: [
      {
        id: 'rev-9',
        author: 'Priyanka Chatterjee',
        city: 'Kolkata',
        rating: 5,
        date: 'November 2026',
        shadeOrVariant: 'Ultra Matte Black',
        comment:
          'Does not budge in peak monsoon rain or watery eyes, yet washes off cleanly with micellar water.',
      },
    ],
  },
];

export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
