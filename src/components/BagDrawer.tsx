import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatINR } from '../data/catalog';
import { CartItem, OrderReceipt, Product } from '../types/store';

interface BagDrawerProps {
  open: boolean;
  items: CartItem[];
  products: Product[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onClearBag: () => void;
}

type DrawerStep = 'bag' | 'checkout' | 'receipt';

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

export function BagDrawer({
  open,
  items,
  products,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}: BagDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('bag');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  // Checkout fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI / Card' | 'Cash on Delivery (COD)'>(
    'UPI / Card'
  );
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const resolvedItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = resolvedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = appliedPromo === 'NYKAA10' ? Math.round(subtotal * 0.1) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping =
    resolvedItems.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;
  const total = discountedSubtotal + shipping;

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const shippingProgress = Math.min(
    100,
    Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'NYKAA10') {
      setAppliedPromo('NYKAA10');
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try NYKAA10 for 10% off.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = phone.replace(/\D/g, '');
    const cleanedPin = pinCode.replace(/\D/g, '');

    if (!customerName.trim() || cleanedPhone.length < 10 || !address.trim() || cleanedPin.length !== 6) {
      setFormError('Please enter your full name, a 10-digit mobile number, delivery address, and 6-digit PIN code.');
      return;
    }

    setFormError('');
    const orderNumber = `NYK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: OrderReceipt = {
      orderId: orderNumber,
      placedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      phone: cleanedPhone,
      address: address.trim(),
      pinCode: cleanedPin,
      paymentMethod,
      items: resolvedItems.map((i) => ({
        name: i.product.name,
        brand: i.product.brand,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
        unitPrice: i.product.price,
      })),
      subtotal,
      discount,
      shipping,
      total,
    };

    setReceipt(newReceipt);
    onClearBag();
    setAppliedPromo(null);
    setPromoInput('');
    setStep('receipt');
  };

  const handleContinueAfterOrder = () => {
    setStep('bag');
    setReceipt(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#181416]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#FAF8F7] border-l border-[#E8E1E2] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E8E1E2] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to bag"
                className="p-1.5 -ml-1.5 text-[#5E5458] hover:text-[#181416] rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-editorial text-xl font-semibold text-[#181416]">
              {step === 'bag' && 'Your Shopping Bag'}
              {step === 'checkout' && 'Delivery & Payment'}
              {step === 'receipt' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#5E5458] hover:text-[#181416] hover:bg-[#F3EFEF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: BAG */}
        {step === 'bag' && (
          <>
            {resolvedItems.length > 0 && (
              <div className="px-6 py-3 bg-[#F3EFEF] border-b border-[#E8E1E2]">
                <p className="text-xs font-medium text-[#181416] mb-1.5 tabular-nums">
                  {amountToFreeShipping === 0
                    ? 'You have unlocked complimentary express delivery.'
                    : `Add ${formatINR(amountToFreeShipping)} more for complimentary express delivery.`}
                </p>
                <div className="w-full h-1.5 bg-[#E2D9DB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D91464] transition-all duration-300"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {resolvedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-14 h-14 rounded-full bg-[#F3EFEF] flex items-center justify-center text-[#5E5458] mb-4">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="font-editorial text-xl font-semibold text-[#181416]">
                    Your bag is currently empty
                  </p>
                  <p className="mt-1.5 text-sm text-[#5E5458] max-w-xs">
                    Explore our curated serums, velvet lip pigments, and small-batch fragrances.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 px-5 py-2.5 text-sm font-semibold bg-[#D91464] text-white rounded-lg hover:bg-[#B50F52] transition-colors"
                  >
                    Browse Collection
                  </button>
                </div>
              ) : (
                resolvedItems.map(({ product, variantId, variantLabel, quantity }) => (
                  <div
                    key={`${product.id}-${variantId}`}
                    className="flex gap-3.5 p-3.5 bg-white rounded-xl border border-[#E8E1E2]"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className={`w-20 h-20 rounded-lg shrink-0 ${
                          product.imageFit === 'contain'
                            ? 'object-contain bg-white border border-[#F3EFEF] p-1'
                            : 'object-cover bg-[#F3EFEF]'
                        }`}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-[#F3EFEF] flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-[#5E5458] text-center px-1 shrink-0">
                        {product.brand}
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5E5458] truncate">
                            {product.brand}
                          </p>
                          <h3 className="text-sm font-semibold text-[#181416] truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#5E5458] mt-0.5 truncate">
                            {variantLabel}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id, variantId)}
                          aria-label={`Remove ${product.name}`}
                          className="p-1 text-[#5E5458] hover:text-[#D91464] transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-auto pt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#E8E1E2] rounded-md h-8">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, variantId, -1)}
                            aria-label="Decrease item quantity"
                            className="w-7 h-full flex items-center justify-center text-[#5E5458] hover:text-[#181416]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, variantId, 1)}
                            aria-label="Increase item quantity"
                            className="w-7 h-full flex items-center justify-center text-[#5E5458] hover:text-[#181416]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[#181416] tabular-nums">
                          {formatINR(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {resolvedItems.length > 0 && (
              <div className="p-6 bg-white border-t border-[#E8E1E2] space-y-4">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. NYKAA10)"
                    aria-label="Promo code"
                    className="flex-1 px-3 py-2 text-xs bg-[#FAF8F7] border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-[#F3EFEF] text-[#181416] hover:bg-[#181416] hover:text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>

                {promoError && (
                  <p className="text-xs text-[#D91464]">{promoError}</p>
                )}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-[#181416] bg-[#F3EFEF] px-3 py-2 rounded-lg">
                    <span>Code {appliedPromo} applied (10% off)</span>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="underline text-[#5E5458] hover:text-[#181416]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="space-y-1.5 text-sm tabular-nums">
                  <div className="flex justify-between text-[#5E5458]">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#D91464]">
                      <span>Promo Discount</span>
                      <span>−{formatINR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#5E5458]">
                    <span>Express Delivery</span>
                    <span>{shipping === 0 ? 'Complimentary' : formatINR(shipping)}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E8E1E2] flex justify-between font-bold text-base text-[#181416]">
                    <span>Total Payable</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 min-h-[44px] text-sm font-semibold text-white bg-[#D91464] hover:bg-[#B50F52] rounded-lg transition-colors"
                >
                  Proceed to Checkout · {formatINR(total)}
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 px-6 py-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-[#D91464]/10 border border-[#D91464]/30 text-xs font-medium text-[#B50F52]">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#181416] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Aarohi Sharma"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181416] mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#181416] mb-1.5">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="400001"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181416] mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Sea Breeze Apartments, Bandra West, Mumbai"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E8E1E2] rounded-lg focus:outline-none focus:border-[#D91464]"
                />
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-[#181416] mb-2">
                  Payment Method
                </p>
                <div className="space-y-2">
                  {(['UPI / Card', 'Cash on Delivery (COD)'] as const).map((method) => (
                    <label
                      key={method}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'bg-white border-[#181416]'
                          : 'bg-white/60 border-[#E8E1E2] hover:border-[#181416]/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="mt-0.5 accent-[#D91464]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#181416]">{method}</p>
                        <p className="text-xs text-[#5E5458] mt-0.5">
                          {method === 'UPI / Card'
                            ? 'Instant confirmation via UPI, RuPay, Visa, or Mastercard.'
                            : `Pay ${formatINR(total)} via cash or UPI QR at your doorstep.`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-[#E8E1E2] space-y-3">
              <div className="flex justify-between text-sm font-bold text-[#181416] tabular-nums">
                <span>Order Total</span>
                <span>{formatINR(total)}</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 min-h-[44px] text-sm font-semibold text-white bg-[#D91464] hover:bg-[#B50F52] rounded-lg transition-colors"
              >
                Confirm & Place Order
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER RECEIPT */}
        {step === 'receipt' && receipt && (
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
            <div className="p-5 bg-white rounded-xl border border-[#E8E1E2] space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#D91464] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#D91464]">
                    Order #{receipt.orderId} Confirmed
                  </p>
                  <h3 className="font-editorial text-xl font-semibold text-[#181416] mt-0.5">
                    Preparing Shipment
                  </h3>
                  <p className="text-xs text-[#5E5458] mt-1">
                    Placed on {receipt.placedAt} · {receipt.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E1E2] text-xs text-[#5E5458] space-y-1">
                <p className="font-semibold text-[#181416]">{receipt.customerName}</p>
                <p>{receipt.address}</p>
                <p className="tabular-nums">
                  PIN {receipt.pinCode} · +91 {receipt.phone}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E1E2] space-y-2.5">
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#181416] truncate">
                        {item.name} × {item.quantity}
                      </p>
                      <p className="text-[#5E5458] truncate">
                        {item.brand} · {item.variantLabel}
                      </p>
                    </div>
                    <span className="font-semibold text-[#181416] tabular-nums shrink-0">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E8E1E2] space-y-1 text-xs tabular-nums">
                <div className="flex justify-between text-[#5E5458]">
                  <span>Subtotal</span>
                  <span>{formatINR(receipt.subtotal)}</span>
                </div>
                {receipt.discount > 0 && (
                  <div className="flex justify-between text-[#D91464]">
                    <span>Discount</span>
                    <span>−{formatINR(receipt.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5E5458]">
                  <span>Delivery</span>
                  <span>
                    {receipt.shipping === 0 ? 'Complimentary' : formatINR(receipt.shipping)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E8E1E2] flex justify-between text-sm font-bold text-[#181416]">
                  <span>Total Paid / Payable</span>
                  <span>{formatINR(receipt.total)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinueAfterOrder}
              className="mt-6 w-full py-3 min-h-[44px] text-sm font-semibold text-white bg-[#181416] hover:bg-[#D91464] rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
