import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { DEPARTMENTS } from '../data/catalog';
import { CategoryFilter, CollectionFilter } from '../types/store';

interface NavbarProps {
  activeCategory: CategoryFilter;
  activeCollection: CollectionFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  onSelectCollection: (col: CollectionFilter) => void;
  bagCount: number;
  onOpenBag: () => void;
}

interface NavItem {
  label: string;
  type: 'category' | 'collection';
  value: CategoryFilter | CollectionFilter;
}

// Strict 5-item single-line Top Bar navigation
const TOP_NAV_ITEMS: NavItem[] = [
  { label: 'All', type: 'category', value: 'All' },
  { label: 'Makeup', type: 'category', value: 'Makeup' },
  { label: 'Skincare', type: 'category', value: 'Skincare' },
  { label: 'Haircare', type: 'category', value: 'Haircare' },
  { label: 'Nykaa Luxe', type: 'collection', value: 'Nykaa Luxe' },
];

export function Navbar({
  activeCategory,
  activeCollection,
  onSelectCategory,
  onSelectCollection,
  bagCount,
  onOpenBag,
}: NavbarProps) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('collection');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (item: NavItem) => {
    if (item.type === 'collection') {
      onSelectCategory('All');
      onSelectCollection(item.value as CollectionFilter);
    } else {
      onSelectCollection('All');
      onSelectCategory(item.value as CategoryFilter);
    }
    setMobileMenuOpen(false);
    scrollToCatalog();
  };

  return (
    <>
      {bannerVisible && (
        <div className="bg-[#181416] text-white/90 text-xs py-2 px-4 flex items-center justify-center relative">
          <p className="text-center pr-6 truncate">
            Complimentary express shipping on orders above ₹999 · Code NYKAA10 for 10% off your first bag
          </p>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 p-1 text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#FAF8F7]/95 backdrop-blur-md border-b border-[#E8E1E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onSelectCategory('All');
              onSelectCollection('All');
            }}
            className="font-editorial text-2xl font-bold tracking-tight text-[#181416] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D91464] rounded"
          >
            NYKAA
          </a>

          {/* Zone 2: 5 concise single-line primary navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5E5458]"
          >
            {TOP_NAV_ITEMS.map((item) => {
              const isActive =
                item.type === 'collection'
                  ? activeCollection === item.value
                  : activeCollection === 'All' && activeCategory === item.value;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#D91464] rounded ${
                    isActive
                      ? 'text-[#181416] font-semibold'
                      : 'hover:text-[#181416]'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#D91464] transition-opacity duration-150 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close category menu' : 'Open category menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2.5 text-[#181416] hover:bg-[#F3EFEF] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={onOpenBag}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-sm font-semibold text-white bg-[#D91464] hover:bg-[#B50F52] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D91464]"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums">Bag ({bagCount})</span>
            </button>
          </div>
        </div>

        {/* Mobile department drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile departments"
            className="md:hidden border-t border-[#E8E1E2] bg-[#FAF8F7] px-4 py-3 flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() =>
                handleNavClick({ label: 'Nykaa Luxe', type: 'collection', value: 'Nykaa Luxe' })
              }
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg min-h-[38px] whitespace-nowrap transition-colors ${
                activeCollection === 'Nykaa Luxe'
                  ? 'bg-[#D91464] text-white'
                  : 'bg-[#F3EFEF] text-[#D91464]'
              }`}
            >
              Nykaa Luxe
            </button>
            {DEPARTMENTS.map((category) => {
              const isActive = activeCollection === 'All' && activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    onSelectCollection('All');
                    onSelectCategory(category);
                    setMobileMenuOpen(false);
                    scrollToCatalog();
                  }}
                  className={`px-3.5 py-2 text-xs rounded-lg min-h-[38px] whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#181416] text-white font-semibold'
                      : 'bg-[#F3EFEF] text-[#5E5458] hover:text-[#181416]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </nav>
        )}
      </header>
    </>
  );
}
