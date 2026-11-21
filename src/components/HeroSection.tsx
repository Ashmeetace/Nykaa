import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/catalog';

interface HeroSectionProps {
  totalProducts: number;
  totalBrands: number;
  totalDepartments: number;
  onExploreCollection: () => void;
  onExploreLuxe: () => void;
}

export function HeroSection({
  totalProducts,
  totalBrands,
  totalDepartments,
  onExploreCollection,
  onExploreLuxe,
}: HeroSectionProps) {
  const trustMetrics = [
    { figure: `${totalProducts.toLocaleString('en-IN')}+`, label: 'Authentic Beauty Products' },
    { figure: `${totalBrands.toLocaleString('en-IN')}+`, label: 'Global & Indian Brands' },
    { figure: `${totalDepartments} Depts`, label: 'Makeup, Skin, Luxe & Wellness' },
    { figure: '100%', label: 'Direct Brand Provenance' },
  ];

  return (
    <section id="top" className="border-b border-[#E8E1E2] bg-[#FAF8F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-5 flex flex-col justify-center py-2 lg:py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D91464] mb-4">
              Complete Storefront · {totalDepartments} Departments · 6 Curated Edits
            </p>
            <h1
              className="font-editorial text-[#181416] font-semibold tracking-tight leading-[1.08] mb-5"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                textWrap: 'balance',
              }}
            >
              Curated beauty, crafted for Indian skin and light.
            </h1>
            <p className="text-base sm:text-[17px] leading-relaxed text-[#5E5458] max-w-xl mb-8">
              Explore {totalProducts.toLocaleString('en-IN')} authentic formulations across Nykaa
              Luxe icons, Ayurvedic botanicals, clinical skincare, fragrance, haircare, and everyday
              makeup—sourced directly from authorized houses.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreCollection}
                className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#D91464] hover:bg-[#B50F52] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D91464]"
              >
                <span>Explore Full Catalog</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreLuxe}
                className="inline-flex items-center px-5 py-3 min-h-[44px] text-sm font-semibold text-[#181416] hover:text-[#D91464] border border-[#DED5D7] hover:border-[#D91464]/40 bg-white rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D91464]"
              >
                Browse Nykaa Luxe
              </button>
            </div>
          </div>

          {/* Editorial Photography Column */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] rounded-xl overflow-hidden bg-[#EFE9E9] border border-[#E8E1E2]">
              <img
                src={HERO_IMAGE}
                alt="Curated Nykaa luxury serum, velvet matte lipstick, and crystal eau de parfum on travertine stone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none"
              />
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-xs text-white/95">
                <span className="font-medium tracking-wide">
                  Nykaa Signature Edit · Luxe · Natural · Clinical
                </span>
                <span className="tabular-nums text-white/85">
                  {totalProducts.toLocaleString('en-IN')} Formulations Live
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Trust Strip below hero split */}
        <div className="mt-10 pt-8 border-t border-[#E8E1E2] grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustMetrics.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="font-editorial text-xl sm:text-2xl font-semibold text-[#181416] tabular-nums">
                {item.figure}
              </p>
              <p className="text-xs sm:text-sm text-[#5E5458]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
