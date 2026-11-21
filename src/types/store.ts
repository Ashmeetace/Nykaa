export type CategoryFilter =
  | 'All'
  | 'Makeup'
  | 'Skincare'
  | 'Haircare'
  | 'Bath & Body'
  | 'Fragrance'
  | 'Natural'
  | 'Wellness'
  | 'Mom & Baby'
  | "Men's Store";

export type ProductDepartment = Exclude<CategoryFilter, 'All'>;

export type CollectionFilter =
  | 'All'
  | 'Signature Edit'
  | 'Nykaa Luxe'
  | 'Ayurvedic & Botanical'
  | 'Lip & Eye Studio'
  | 'Top Rated 4.5+'
  | 'Under ₹399';

export type SortOption =
  | 'featured'
  | 'popular'
  | 'rating'
  | 'price-asc'
  | 'price-desc'
  | 'discount';

export interface ProductVariant {
  id: string;
  label: string;
  colorHex?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  shadeOrVariant?: string;
  comment: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductDepartment;
  subCategory: string;
  collections: Exclude<CollectionFilter, 'All'>[];
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  imageFit?: 'cover' | 'contain';
  tagline: string;
  description: string;
  keyActives: string[];
  ingredients?: string;
  howToUse: string;
  volumeOrWeight: string;
  countryOfOrigin?: string;
  stockNote?: string;
  productUrl?: string;
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  variantLabel: string;
  quantity: number;
}

export interface OrderReceipt {
  orderId: string;
  placedAt: string;
  customerName: string;
  phone: string;
  address: string;
  pinCode: string;
  paymentMethod: 'UPI / Card' | 'Cash on Delivery (COD)';
  items: Array<{
    name: string;
    brand: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
