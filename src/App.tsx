import { ArrowRight, Heart, Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BagDrawer } from './components/BagDrawer';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CURATED_COLLECTIONS, DEPARTMENTS, PRODUCTS } from './data/catalog';
import {
  CartItem,
  CategoryFilter,
  CollectionFilter,
  Product,
  ProductReview,
  SortOption,
} from './types/store';
import { loadNykaaCsvProducts } from './utils/nykaaCsvParser';

const STORAGE_CART_KEY = 'nykaa_store_bag_v1';
const STORAGE_WISHLIST_KEY = 'nykaa_store_wishlist_v1';
const PAGE_SIZE = 24;

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [activeCollection, setActiveCollection] = useState<CollectionFilter>('All');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All');
  const [activeBrand, setActiveBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [savedOnly, setSavedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_WISHLIST_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CART_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [bagOpen, setBagOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    product: Product;
    variantId?: string;
  } | null>(null);

  // Load the full Nykaa CSV dataset and merge with the Signature Edit flagship products
  useEffect(() => {
    let active = true;
    loadNykaaCsvProducts()
      .then((csvProducts) => {
        if (!active) return;
        setProducts([...PRODUCTS, ...csvProducts]);
        setCatalogLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setCatalogError('Unable to load the extended catalog dataset. Showing Signature Edit items.');
        setCatalogLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore storage quota errors
    }
  }, [wishlist]);

  // Reset pagination whenever active filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, activeCollection, activeSubCategory, activeBrand, searchQuery, sortBy, savedOnly]);

  const bagCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Live catalog totals for Hero & filter counts
  const totalBrands = useMemo(() => {
    const brands = new Set(products.map((p) => p.brand.toLowerCase()));
    return brands.size;
  }, [products]);

  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    for (const p of products) {
      for (const col of p.collections) {
        counts[col] = (counts[col] || 0) + 1;
      }
    }
    return counts;
  }, [products]);

  // Scoped base products (after Department + Collection) to populate Sub-Category & Brand pickers
  const scopedBaseProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (activeCollection !== 'All' && !p.collections.includes(activeCollection)) return false;
      return true;
    });
  }, [products, activeCategory, activeCollection]);

  const availableSubCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of scopedBaseProducts) {
      counts.set(p.subCategory, (counts.get(p.subCategory) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [scopedBaseProducts]);

  const availableBrands = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of scopedBaseProducts) {
      if (activeSubCategory !== 'All' && p.subCategory !== activeSubCategory) continue;
      counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [scopedBaseProducts, activeSubCategory]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((p) => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (activeCollection !== 'All' && !p.collections.includes(activeCollection)) return false;
      if (activeSubCategory !== 'All' && p.subCategory !== activeSubCategory) return false;
      if (activeBrand !== 'All' && p.brand !== activeBrand) return false;
      if (savedOnly && !wishlist.includes(p.id)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.collections.some((c) => c.toLowerCase().includes(q)) ||
        p.keyActives.some((a) => a.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }
    if (sortBy === 'popular') {
      return [...list].sort((a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating);
    }
    if (sortBy === 'discount') {
      const pct = (item: Product) =>
        item.mrp > item.price ? (item.mrp - item.price) / item.mrp : 0;
      return [...list].sort((a, b) => pct(b) - pct(a) || b.reviewCount - a.reviewCount);
    }
    return list;
  }, [
    products,
    activeCategory,
    activeCollection,
    activeSubCategory,
    activeBrand,
    searchQuery,
    sortBy,
    savedOnly,
    wishlist,
  ]);

  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasActiveFilters =
    activeCategory !== 'All' ||
    activeCollection !== 'All' ||
    activeSubCategory !== 'All' ||
    activeBrand !== 'All' ||
    searchQuery.trim().length > 0 ||
    savedOnly;

  const resetAllFilters = () => {
    setActiveCategory('All');
    setActiveCollection('All');
    setActiveSubCategory('All');
    setActiveBrand('All');
    setSearchQuery('');
    setSavedOnly(false);
    setSortBy('featured');
  };

  const handleSelectCategory = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setActiveSubCategory('All');
    setActiveBrand('All');
    setSavedOnly(false);
  };

  const handleSelectCollection = (col: CollectionFilter) => {
    setActiveCollection(col);
    setActiveSubCategory('All');
    setActiveBrand('All');
    setSavedOnly(false);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToBag = (
    product: Product,
    variantId: string,
    variantLabel: string,
    quantity = 1
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.variantId === variantId
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.variantId === variantId
            ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId,
          variantLabel,
          quantity,
        },
      ];
    });
  };

  const handleUpdateQuantity = (
    productId: string,
    variantId: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    );
  };

  const handleAddReview = (productId: string, review: ProductReview) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedReviews = [review, ...p.reviews];
        const newCount = p.reviewCount + 1;
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: newCount,
        };
      })
    );
    setSelectedProduct((prev) => {
      if (!prev || prev.product.id !== productId) return prev;
      return {
        ...prev,
        product: {
          ...prev.product,
          reviews: [review, ...prev.product.reviews],
          reviewCount: prev.product.reviewCount + 1,
        },
      };
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F7] text-[#181416]">
      <Navbar
        activeCategory={activeCategory}
        activeCollection={activeCollection}
        onSelectCategory={handleSelectCategory}
        onSelectCollection={handleSelectCollection}
        bagCount={bagCount}
        onOpenBag={() => setBagOpen(true)}
      />

      <main className="flex-1">
        <HeroSection
          totalProducts={products.length}
          totalBrands={totalBrands}
          totalDepartments={DEPARTMENTS.length - 1}
          onExploreCollection={() => scrollToSection('collection')}
          onExploreLuxe={() => {
            setActiveCategory('All');
            handleSelectCollection('Nykaa Luxe');
            scrollToSection('collection');
          }}
        />

        {/* Curated Collections & Complete Multi-Department Catalog */}
        <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          {/* Curated Collections Showcase */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D91464] mb-1.5">
                  Curated Collections
                </p>
                <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#181416]">
                  Shop by Edit
                </h2>
              </div>
              {activeCollection !== 'All' && (
                <button
                  type="button"
                  onClick={() => handleSelectCollection('All')}
                  className="text-xs font-semibold text-[#D91464] hover:text-[#181416] transition-colors self-start sm:self-auto"
                >
                  View All Collections →
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CURATED_COLLECTIONS.map((col) => {
                const isSelected = activeCollection === col.id;
                const count = collectionCounts[col.id] || 0;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() =>
                      handleSelectCollection(isSelected ? 'All' : col.id)
                    }
                    aria-pressed={isSelected}
                    className={`group text-left p-5 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-3 focus-visible:outline-2 focus-visible:outline-[#D91464] ${
                      isSelected
                        ? 'bg-[#181416] text-white border-[#181416] shadow-md'
                        : 'bg-white text-[#181416] border-[#E8E1E2] hover:border-[#D91464]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 w-full">
                      <span className="font-editorial text-xl font-semibold leading-snug">
                        {col.title}
                      </span>
                      <span
                        className={`text-xs font-semibold tabular-nums shrink-0 mt-1 ${
                          isSelected ? 'text-white/80' : 'text-[#D91464]'
                        }`}
                      >
                        {count.toLocaleString('en-IN')} items
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-3 w-full">
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? 'text-white/75' : 'text-[#5E5458]'
                        }`}
                      >
                        {col.subtitle}
                      </p>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                          isSelected ? 'text-white' : 'text-[#5E5458] group-hover:text-[#D91464]'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catalog Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pt-8 border-t border-[#E8E1E2]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E5458] mb-1.5">
                {activeCollection === 'All' ? 'Complete Nykaa Catalog' : activeCollection}
                {activeCategory !== 'All' ? ` · ${activeCategory}` : ''}
                {activeSubCategory !== 'All' ? ` · ${activeSubCategory}` : ''}
              </p>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#181416]">
                {activeCategory === 'All' ? 'All Beauty Departments' : activeCategory}
              </h2>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#5E5458] tabular-nums">
              {catalogLoading && (
                <span className="inline-flex items-center gap-1.5 text-xs text-[#D91464]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  Loading full Nykaa catalog…
                </span>
              )}
              <span>
                Showing {displayedProducts.length} of {filteredProducts.length.toLocaleString('en-IN')} matching
                {filteredProducts.length !== products.length
                  ? ` (${products.length.toLocaleString('en-IN')} total)`
                  : ' products'}
              </span>
            </div>
          </div>

          {catalogError && (
            <div className="mb-6 p-3.5 rounded-lg bg-white border border-[#E8E1E2] text-xs text-[#5E5458]">
              {catalogError}
            </div>
          )}

          {/* Department Filter Strip (All 9 Nykaa Departments) */}
          <div
            role="tablist"
            aria-label="Filter catalog by department"
            className="flex items-center gap-1.5 p-1.5 bg-[#F3EFEF] rounded-xl overflow-x-auto"
          >
            {DEPARTMENTS.map((cat) => {
              const active = activeCategory === cat && !savedOnly;
              const count = departmentCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                    active
                      ? 'bg-white text-[#181416] shadow-xs'
                      : 'text-[#5E5458] hover:text-[#181416]'
                  }`}
                >
                  {cat} <span className="opacity-65 ml-0.5">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search, Sub-Category, Brand, Saved & Sort Controls */}
          <div className="mt-4 pb-6 border-b border-[#E8E1E2] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 lg:max-w-sm">
              <Search
                className="w-4 h-4 text-[#5E5458] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, shades, brands, actives..."
                aria-label="Search beauty catalog"
                className="w-full h-10 pl-9 pr-8 text-sm bg-white border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5E5458] hover:text-[#181416]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sub-Category, Brand, Saved, Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={activeSubCategory}
                onChange={(e) => {
                  setActiveSubCategory(e.target.value);
                  setActiveBrand('All');
                }}
                aria-label="Filter by sub-category"
                className="h-10 px-3 text-xs font-semibold bg-white border border-[#E8E1E2] rounded-lg text-[#181416] focus:outline-none focus:border-[#D91464] cursor-pointer max-w-[190px]"
              >
                <option value="All">
                  All Categories ({availableSubCategories.length})
                </option>
                {availableSubCategories.map((sub) => (
                  <option key={sub.name} value={sub.name}>
                    {sub.name} ({sub.count})
                  </option>
                ))}
              </select>

              <select
                value={activeBrand}
                onChange={(e) => setActiveBrand(e.target.value)}
                aria-label="Filter by brand"
                className="h-10 px-3 text-xs font-semibold bg-white border border-[#E8E1E2] rounded-lg text-[#181416] focus:outline-none focus:border-[#D91464] cursor-pointer max-w-[190px]"
              >
                <option value="All">All Brands ({availableBrands.length})</option>
                {availableBrands.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.count})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setSavedOnly((prev) => !prev)}
                aria-pressed={savedOnly}
                className={`inline-flex items-center gap-1.5 h-10 px-3.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                  savedOnly
                    ? 'bg-[#181416] text-white border-[#181416]'
                    : 'bg-white text-[#181416] border-[#E8E1E2] hover:border-[#D91464]'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    savedOnly ? 'fill-[#D91464] text-[#D91464]' : 'text-[#D91464]'
                  }`}
                  aria-hidden="true"
                />
                <span>Saved ({wishlist.length})</span>
              </button>

              <div className="relative inline-flex items-center shrink-0">
                <SlidersHorizontal
                  className="w-3.5 h-3.5 text-[#5E5458] absolute left-3 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort products"
                  className="h-10 pl-8 pr-7 text-xs font-semibold bg-white border border-[#E8E1E2] rounded-lg text-[#181416] focus:outline-none focus:border-[#D91464] cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="popular">Most Reviewed</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="discount">Highest Savings</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="h-10 px-3 text-xs font-semibold text-[#D91464] hover:text-[#181416] transition-colors whitespace-nowrap"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {displayedProducts.length > 0 ? (
            <>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={(prod, variantId) =>
                      setSelectedProduct({ product: prod, variantId })
                    }
                    onQuickAdd={(prod, variantId, variantLabel) =>
                      handleAddToBag(prod, variantId, variantLabel, 1)
                    }
                  />
                ))}
              </div>

              {/* Pagination / Load More */}
              {visibleCount < filteredProducts.length && (
                <div className="mt-12 flex flex-col items-center gap-3">
                  <p className="text-xs text-[#5E5458] tabular-nums">
                    Showing {displayedProducts.length} of{' '}
                    {filteredProducts.length.toLocaleString('en-IN')} products
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="px-7 py-3 min-h-[44px] text-sm font-semibold bg-[#181416] text-white hover:bg-[#D91464] rounded-lg transition-colors duration-150"
                  >
                    Load More Products (
                    {Math.min(PAGE_SIZE, filteredProducts.length - visibleCount)} more)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-10 py-16 px-6 bg-white rounded-xl border border-[#E8E1E2] text-center">
              <p className="font-editorial text-2xl font-semibold text-[#181416]">
                No matching formulations found
              </p>
              <p className="mt-2 text-sm text-[#5E5458]">
                {savedOnly
                  ? 'You have not saved any items yet. Tap the heart icon on any product to save it here.'
                  : 'Try clearing your search query or resetting your department and brand filters.'}
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 px-5 py-2.5 text-sm font-semibold bg-[#D91464] text-white rounded-lg hover:bg-[#B50F52] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        <CraftsmanshipSection />
      </main>

      <Footer
        onSelectCategory={handleSelectCategory}
        onSelectCollection={handleSelectCollection}
        onOpenBag={() => setBagOpen(true)}
      />

      <ProductDetailModal
        product={selectedProduct?.product ?? null}
        initialVariantId={selectedProduct?.variantId}
        isWishlisted={
          selectedProduct ? wishlist.includes(selectedProduct.product.id) : false
        }
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToBag={handleAddToBag}
        onAddReview={handleAddReview}
      />

      <BagDrawer
        open={bagOpen}
        items={cart}
        products={products}
        onClose={() => setBagOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setCart([])}
      />
    </div>
  );
}
