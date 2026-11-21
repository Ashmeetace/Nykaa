import { Check, Heart, Minus, Plus, ShieldCheck, Sparkles, Star, Truck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatINR } from '../data/catalog';
import { Product, ProductReview } from '../types/store';

interface ProductDetailModalProps {
  product: Product | null;
  initialVariantId?: string;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  onAddToBag: (product: Product, variantId: string, variantLabel: string, quantity: number) => void;
  onAddReview: (productId: string, review: ProductReview) => void;
}

export function ProductDetailModal({
  product,
  initialVariantId,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToBag,
  onAddReview,
}: ProductDetailModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Review submission state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedVariantId(initialVariantId || product.variants[0].id);
      setActiveImageIdx(0);
      setFailedImages({});
      setQuantity(1);
      setActiveTab('details');
      setAddedFeedback(false);
      setReviewSubmitted(false);
    }
  }, [product, initialVariantId]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const activeImageUrl =
    !failedImages[activeImageIdx] && galleryImages[activeImageIdx]
      ? galleryImages[activeImageIdx]
      : '';

  const isPackshot = product.imageFit === 'contain';

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];

  const savingsPct =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleAdd = () => {
    onAddToBag(product, selectedVariant.id, selectedVariant.label, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim(),
      city: reviewerCity.trim() || 'India',
      rating: reviewerRating,
      date: 'November 2026',
      shadeOrVariant: selectedVariant.label,
      comment: reviewerComment.trim(),
    };
    onAddReview(product.id, newReview);
    setReviewerName('');
    setReviewerCity('');
    setReviewerComment('');
    setReviewerRating(5);
    setReviewSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 lg:p-8 bg-[#181416]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-product-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-full sm:max-h-[90vh] bg-[#FAF8F7] sm:rounded-2xl border border-[#E8E1E2] shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product detail view"
          className="sticky top-4 float-right mr-4 mt-4 z-20 w-10 h-10 rounded-full bg-white border border-[#E8E1E2] flex items-center justify-center text-[#181416] hover:border-[#D91464] transition-colors focus-visible:outline-2 focus-visible:outline-[#D91464]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sticky Gallery Column */}
          <div className="lg:col-span-6 p-5 sm:p-8 lg:sticky lg:top-0 lg:self-start">
            <div
              className={`aspect-[4/3] w-full rounded-xl overflow-hidden border border-[#E8E1E2] ${
                isPackshot ? 'bg-white' : 'bg-[#F3EFEF]'
              }`}
            >
              {activeImageUrl ? (
                <img
                  src={activeImageUrl}
                  alt={`${product.brand} ${product.name}`}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({ ...prev, [activeImageIdx]: true }))
                  }
                  className={`w-full h-full ${
                    isPackshot ? 'object-contain p-6' : 'object-cover'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#F7F3F3] to-[#ECE5E6]">
                  <Sparkles className="w-8 h-8 text-[#D91464] mb-2" aria-hidden="true" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5E5458]">
                    {product.brand}
                  </p>
                  <p className="text-base font-medium text-[#181416] mt-1">{product.name}</p>
                </div>
              )}
            </div>

            {/* Thumbnail strip when CSV provides multiple product angles */}
            {galleryImages.length > 1 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, idx) => {
                  if (failedImages[idx]) return null;
                  const active = idx === activeImageIdx;
                  return (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      aria-label={`View image ${idx + 1}`}
                      aria-pressed={active}
                      className={`w-16 h-16 rounded-lg overflow-hidden bg-white border shrink-0 transition-colors p-1 ${
                        active
                          ? 'border-[#181416] ring-1 ring-[#181416]'
                          : 'border-[#E8E1E2] hover:border-[#D91464]'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [idx]: true }))
                        }
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#5E5458]">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white border border-[#E8E1E2]">
                <ShieldCheck className="w-4 h-4 text-[#D91464] shrink-0" aria-hidden="true" />
                <span>100% Authentic · Batch Verified</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white border border-[#E8E1E2]">
                <Truck className="w-4 h-4 text-[#D91464] shrink-0" aria-hidden="true" />
                <span>Free Shipping above ₹999</span>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-5 sm:p-8 lg:pl-2 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5E5458]">
              {product.category} · {product.subCategory} · {product.brand}
            </p>

            <h2
              id="pdp-product-title"
              className="mt-2 font-editorial text-2xl sm:text-3xl font-semibold text-[#181416] leading-tight"
            >
              {product.name}
            </h2>

            {product.collections.length > 0 && (
              <p className="mt-2 text-xs text-[#D91464] font-medium">
                Collections: {product.collections.join(' · ')}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2 text-sm text-[#5E5458] tabular-nums">
              {product.rating > 0 ? (
                <>
                  <div className="flex items-center gap-1 text-[#181416] font-semibold">
                    <Star className="w-4 h-4 fill-[#181416] text-[#181416]" aria-hidden="true" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="underline underline-offset-4 hover:text-[#D91464] transition-colors"
              >
                {product.reviewCount > 0
                  ? `${product.reviewCount.toLocaleString('en-IN')} verified ratings & reviews`
                  : 'Be the first to write a review'}
              </button>
            </div>

            <div className="mt-5 pb-5 border-b border-[#E8E1E2] flex flex-wrap items-baseline gap-3 tabular-nums">
              <span className="text-2xl font-bold text-[#181416]">
                {formatINR(product.price)}
              </span>
              {savingsPct > 0 && (
                <>
                  <span className="text-sm text-[#5E5458] line-through">
                    MRP {formatINR(product.mrp)}
                  </span>
                  <span className="text-xs font-semibold text-[#D91464]">
                    Save {savingsPct}%
                  </span>
                </>
              )}
              <span className="text-xs text-[#5E5458] ml-auto">Incl. of all taxes</span>
            </div>

            {/* Shade / Size Variant Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-semibold uppercase tracking-wider text-[#5E5458]">
                  Selected Option
                </span>
                <span className="font-medium text-[#181416]">{selectedVariant.label}</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant) => {
                  const isActive = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                        isActive
                          ? 'border-[#181416] bg-white text-[#181416] shadow-xs'
                          : 'border-[#E8E1E2] bg-[#F3EFEF]/60 text-[#5E5458] hover:border-[#181416]/40 hover:text-[#181416]'
                      }`}
                    >
                      {variant.colorHex && (
                        <span
                          aria-hidden="true"
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                      )}
                      <span>{variant.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Primary Purchase CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center border border-[#DED5D7] bg-white rounded-lg h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-[#5E5458] hover:text-[#181416] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-[#5E5458] hover:text-[#181416] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 min-w-[180px] h-11 px-6 rounded-lg text-sm font-semibold text-white inline-flex items-center justify-center gap-2 transition-colors duration-150 whitespace-nowrap ${
                  addedFeedback
                    ? 'bg-[#181416]'
                    : 'bg-[#D91464] hover:bg-[#B50F52]'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span className="tabular-nums">
                    Add to Bag · {formatINR(product.price * quantity)}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
                aria-pressed={isWishlisted}
                className="w-11 h-11 rounded-lg border border-[#DED5D7] bg-white flex items-center justify-center text-[#181416] hover:border-[#D91464] transition-colors shrink-0"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#D91464] text-[#D91464]' : 'text-[#5E5458]'
                  }`}
                />
              </button>
            </div>

            {/* Segmented Details / Reviews Tabs */}
            <div className="mt-8 border-t border-[#E8E1E2] pt-5">
              <div className="inline-flex p-1 bg-[#F3EFEF] rounded-lg mb-5">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'details'
                      ? 'bg-white text-[#181416] shadow-xs'
                      : 'text-[#5E5458] hover:text-[#181416]'
                  }`}
                >
                  Formulation & Ritual
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap tabular-nums ${
                    activeTab === 'reviews'
                      ? 'bg-white text-[#181416] shadow-xs'
                      : 'text-[#5E5458] hover:text-[#181416]'
                  }`}
                >
                  Customer Reviews ({product.reviews.length})
                </button>
              </div>

              {activeTab === 'details' ? (
                <div className="space-y-4 text-sm text-[#5E5458] leading-relaxed">
                  <p className="text-[#181416]">{product.description}</p>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#181416] mb-1.5">
                      Key Actives & Highlights
                    </h4>
                    <p className="text-sm text-[#5E5458]">
                      {product.keyActives.join(' · ')}
                    </p>
                  </div>

                  {product.ingredients && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#181416] mb-1.5">
                        Full Ingredients
                      </h4>
                      <p className="text-xs text-[#5E5458] leading-relaxed">
                        {product.ingredients.slice(0, 480)}
                        {product.ingredients.length > 480 ? '…' : ''}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#181416] mb-1.5">
                      Application Ritual
                    </h4>
                    <p className="text-sm text-[#5E5458]">{product.howToUse}</p>
                  </div>

                  {(product.volumeOrWeight !== 'Standard Pack' || product.countryOfOrigin) && (
                    <p className="text-xs text-[#5E5458] pt-2 border-t border-[#E8E1E2]">
                      {[
                        product.volumeOrWeight !== 'Standard Pack'
                          ? `Net Pack: ${product.volumeOrWeight}`
                          : null,
                        product.countryOfOrigin
                          ? `Origin: ${product.countryOfOrigin}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  {product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-xl bg-white border border-[#E8E1E2] space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-[#181416]">
                              {rev.author} · {rev.city}
                            </span>
                            <span className="text-[#5E5458] tabular-nums">
                              {rev.rating}.0 ★ · {rev.date}
                            </span>
                          </div>
                          {rev.shadeOrVariant && (
                            <p className="text-[11px] text-[#5E5458]">
                              Variant: {rev.shadeOrVariant}
                            </p>
                          )}
                          <p className="text-sm text-[#181416] leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white border border-[#E8E1E2] text-sm text-[#5E5458]">
                      {product.reviewCount > 0
                        ? `Rated ${product.rating.toFixed(1)}★ across ${product.reviewCount.toLocaleString('en-IN')} verified Nykaa shoppers. Add your own note below.`
                        : 'No written notes yet. Share your experience with this formulation below.'}
                    </div>
                  )}

                  {/* Interactive Write a Review Form */}
                  <form
                    onSubmit={handleReviewSubmit}
                    className="p-4 rounded-xl bg-white border border-[#E8E1E2] space-y-3"
                  >
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#181416]">
                      Add a Verified Review
                    </h4>

                    {reviewSubmitted && (
                      <p className="text-xs font-medium text-[#181416] bg-[#F3EFEF] px-3 py-2 rounded-lg">
                        Thank you — your review has been published above.
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F7] border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464]"
                      />
                      <input
                        type="text"
                        value={reviewerCity}
                        onChange={(e) => setReviewerCity(e.target.value)}
                        placeholder="City (e.g. Mumbai)"
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F7] border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464]"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#5E5458]">
                      <span>Rating:</span>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReviewerRating(r)}
                          className={`px-2.5 py-1 rounded border tabular-nums ${
                            reviewerRating === r
                              ? 'border-[#181416] bg-[#181416] text-white font-semibold'
                              : 'border-[#E8E1E2] bg-[#FAF8F7] text-[#5E5458]'
                          }`}
                        >
                          {r} ★
                        </button>
                      ))}
                    </div>

                    <textarea
                      required
                      rows={2}
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      placeholder="Share how this formulation wore or performed on your skin..."
                      className="w-full px-3 py-2 text-sm bg-[#FAF8F7] border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464]"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-[#181416] text-white rounded-lg hover:bg-[#D91464] transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
