import { Heart, Plus, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatINR } from '../data/catalog';
import { Product } from '../types/store';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product, selectedVariantId?: string) => void;
  onQuickAdd: (product: Product, variantId: string, variantLabel: string) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [imgIdx, setImgIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setSelectedVariantId(product.variants[0].id);
    setImgIdx(0);
  }, [product.id, product.variants]);

  const imageCandidates =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
  const currentImgSrc = imgIdx < imageCandidates.length ? imageCandidates[imgIdx] : '';

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product, selectedVariant.id, selectedVariant.label);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const savingsPct =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const isPackshot = product.imageFit === 'contain';

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-[#E8E1E2] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(24,20,22,0.12)]">
      {/* Product Image Area (uniform 4:3) */}
      <div
        onClick={() => onSelectProduct(product, selectedVariant.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectProduct(product, selectedVariant.id);
          }
        }}
        aria-label={`View details for ${product.name}`}
        className={`relative aspect-[4/3] w-full overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D91464] ${
          isPackshot ? 'bg-white border-b border-[#F3EFEF]' : 'bg-[#F3EFEF]'
        }`}
      >
        {currentImgSrc ? (
          <img
            src={currentImgSrc}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgIdx((prev) => prev + 1)}
            className={`w-full h-full transition-transform duration-300 group-hover:scale-[1.03] ${
              isPackshot ? 'object-contain p-4' : 'object-cover'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F7F3F3] to-[#ECE5E6]">
            <Sparkles className="w-6 h-6 text-[#D91464] mb-2" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5E5458]">
              {product.brand}
            </span>
            <span className="text-sm font-medium text-[#181416] mt-1 line-clamp-2 max-w-[220px]">
              {product.name}
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={
            isWishlisted ? `Remove ${product.name} from saved` : `Save ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/92 backdrop-blur-sm border border-[#E8E1E2] flex items-center justify-center text-[#181416] hover:border-[#D91464] transition-colors focus-visible:outline-2 focus-visible:outline-[#D91464]"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#D91464] text-[#D91464]' : 'text-[#5E5458]'
            }`}
          />
        </button>

        {/* Subtle editorial text tag if present (max 1) */}
        {product.stockNote && (
          <span className="absolute bottom-3 left-3 text-[11px] font-semibold tracking-wider uppercase text-white bg-[#181416]/80 backdrop-blur-sm px-2.5 py-1 rounded">
            {product.stockNote}
          </span>
        )}
      </div>

      {/* Product Body (identical field order across all cards) */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Quiet 1-line unboxed metadata kicker */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5E5458] truncate">
          {product.brand} · {product.subCategory}
        </p>

        {/* Product Title */}
        <h3 className="mt-1.5 text-[15px] font-semibold text-[#181416] leading-snug line-clamp-2 min-h-[2.6rem]">
          <button
            type="button"
            onClick={() => onSelectProduct(product, selectedVariant.id)}
            className="text-left hover:text-[#D91464] transition-colors focus-visible:outline-2 focus-visible:outline-[#D91464] rounded"
          >
            {product.name}
          </button>
        </h3>

        <p className="mt-1 text-xs text-[#5E5458] line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Interactive Shade Swatches or Variant Label */}
        <div className="mt-3 min-h-[24px] flex items-center justify-between gap-2">
          {product.variants.some((v) => v.colorHex) ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                {product.variants.map((variant) => {
                  const active = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariantId(variant.id);
                      }}
                      title={variant.label}
                      aria-label={`Select shade ${variant.label}`}
                      aria-pressed={active}
                      className={`w-4 h-4 rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D91464] ${
                        active ? 'ring-2 ring-[#181416] ring-offset-2 scale-105' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  );
                })}
              </div>
              <span className="text-xs text-[#5E5458] truncate">{selectedVariant.label}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#5E5458] truncate">
              <span>{selectedVariant.label}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
            </div>
          )}
        </div>

        {/* Unboxed Rating row */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#5E5458] tabular-nums">
          {product.rating > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 fill-[#181416] text-[#181416]" aria-hidden="true" />
              <span className="font-semibold text-[#181416]">{product.rating.toFixed(1)}</span>
              <span aria-hidden="true">·</span>
              <span>
                {product.reviewCount > 0
                  ? `${product.reviewCount.toLocaleString('en-IN')} reviews`
                  : 'Verified rating'}
              </span>
            </>
          ) : (
            <span>New in Catalog · Authentic Batch</span>
          )}
        </div>

        {/* Price + Action Row pinned to card baseline */}
        <div className="mt-auto pt-4 border-t border-[#F3EFEF] flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums min-w-0">
            <span className="text-base font-bold text-[#181416]">
              {formatINR(product.price)}
            </span>
            {savingsPct > 0 && (
              <>
                <span className="text-xs text-[#5E5458] line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="text-xs font-semibold text-[#D91464]">{savingsPct}% off</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D91464] ${
              justAdded
                ? 'bg-[#181416] text-white'
                : 'bg-[#F3EFEF] text-[#181416] hover:bg-[#D91464] hover:text-white'
            }`}
          >
            {justAdded ? (
              <span>Added</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
