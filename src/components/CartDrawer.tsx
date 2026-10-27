import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Wallet,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { CAFE_INFO, COMBO_DEALS, MENU_ITEMS, MenuItem } from '../data/cafeData';
import { PureVegMark } from './BrandMarks';

export interface CartEntry {
  item: MenuItem;
  qty: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartEntry[];
  onAdd: (item: MenuItem) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onProceedToOrderPage?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  cart,
  onAdd,
  onDecrement,
  onRemove,
  onClear,
  onProceedToOrderPage,
}) => {
  const [serviceType, setServiceType] = useState<'dine-in' | 'takeout' | 'delivery'>('takeout');
  const [paymentMethod, setPaymentMethod] = useState<'nfc-upi' | 'card' | 'counter'>('nfc-upi');
  const [customerName, setCustomerName] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [orderPlacedTicket, setOrderPlacedTicket] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.qty, 0);
  const discount =
    appliedPromo === 'UNCLETOM20' && subtotal >= 250
      ? Math.round(subtotal * 0.2)
      : appliedPromo === 'HANSI10' && subtotal >= 150
      ? Math.round(subtotal * 0.1)
      : 0;
  const packagingFee = serviceType === 'dine-in' || subtotal === 0 ? 0 : 10;
  const grandTotal = Math.max(0, subtotal - discount + packagingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (cleaned === 'UNCLETOM20' || cleaned === 'HANSI10') {
      setAppliedPromo(cleaned);
    } else {
      setAppliedPromo('INVALID');
    }
  };

  const buildWhatsAppLink = () => {
    const lines = [
      `*New Order — Uncle Tom's Cafe (Hansi)*`,
      `Service: *${serviceType.toUpperCase()}*`,
      customerName ? `Guest: *${customerName}*` : '',
      `Payment: *${
        paymentMethod === 'nfc-upi'
          ? 'NFC Mobile Tap / UPI'
          : paymentMethod === 'card'
          ? 'Credit / Debit Card'
          : 'Pay at Counter'
      }*`,
      `--------------------------`,
      ...cart.map((c) => `• ${c.qty}x ${c.item.name} — ₹${c.item.price * c.qty}`),
      `--------------------------`,
      discount > 0 ? `Promo (${appliedPromo}): -₹${discount}` : '',
      packagingFee > 0 ? `Eco Packaging: ₹${packagingFee}` : '',
      `*Total Payable: ₹${grandTotal}*`,
      customerNote ? `Note: ${customerNote}` : '',
    ].filter(Boolean);

    return `https://wa.me/${CAFE_INFO.phoneRaw}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleQuickConfirm = () => {
    const code = `UTC-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderPlacedTicket(code);
  };

  const suggestedCombo = MENU_ITEMS.find((m) => m.id === COMBO_DEALS[0].id);
  const hasComboInCart = cart.some((c) => c.item.category === 'combos');

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-350'
      }`}
    >
      {/* Backdrop with smooth opacity fade */}
      <div
        className={`fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel with smooth slide-in from right */}
      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <div
          className={`w-screen max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
        {/* Drawer Header */}
        <div className="bg-[#110f0d] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#f5b014] text-[#111111] flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-wide uppercase leading-none">
                Your Order Bag
              </h2>
              <div className="mt-0.5">
                <PureVegMark size="sm" showLabel dark />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Cart"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Service Mode Selector */}
        <div className="bg-[#faf6ef] px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-neutral-200 shrink-0">
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-neutral-200 text-xs font-bold">
            {(
              [
                { id: 'dine-in', label: 'Dine-In' },
                { id: 'takeout', label: 'Takeout' },
                { id: 'delivery', label: 'Delivery' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setServiceType(mode.id)}
                className={`py-1.5 sm:py-2 rounded-md transition-all duration-200 cursor-pointer text-[11px] sm:text-xs font-bold ${
                  serviceType === mode.id
                    ? 'bg-[#ef6217] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-1 sm:mt-1.5 text-center">
            {serviceType === 'dine-in' && 'Cozy seating & live open kitchen at Gandhi Nagar, Hansi'}
            {serviceType === 'takeout' && 'Pickup ready in ~15 mins at Shop No 2, Hansi'}
            {serviceType === 'delivery' && 'Quick direct delivery to your home in Hansi'}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {orderPlacedTicket ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#ef6217]">
                  Order Ticket Generated
                </span>
                <h3 className="font-display text-3xl font-black text-neutral-900 mt-1">
                  #{orderPlacedTicket}
                </h3>
                <p className="text-sm text-neutral-600 mt-2 max-w-xs mx-auto">
                  Show this ticket at <strong>Uncle Tom&apos;s Cafe</strong> ({CAFE_INFO.shortAddress}) or tap
                  below to send directly to our kitchen WhatsApp!
                </p>
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-neutral-800">
                  <span>Service Option:</span>
                  <span className="uppercase text-[#ef6217]">{serviceType}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-800">
                  <span>Total Amount:</span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Kitchen Phone:</span>
                  <span>{CAFE_INFO.phoneDisplay}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Order to Kitchen on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setOrderPlacedTicket(null);
                    onClear();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Start Fresh Order
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#ef6217] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-extrabold uppercase text-neutral-900">
                  Your Bag is Empty!
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Add pure-veg burgers, white sauce pasta, waffles, or one of our famous Hansi BOGO combos.
                </p>
              </div>

              {suggestedCombo && (
                <div className="mt-4 p-3.5 rounded-xl bg-[#14110f] text-white text-left flex items-center gap-3">
                  <img
                    src={suggestedCombo.image}
                    alt={suggestedCombo.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#f5b014]">
                      #1 Popular Combo
                    </span>
                    <p className="text-xs font-bold leading-snug line-clamp-2 mt-0.5">
                      Paneer Makhani Reg + Magic Onion Pizza FREE
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-[#f5b014]">₹210</span>
                      <button
                        type="button"
                        onClick={() => onAdd(suggestedCombo)}
                        className="px-2.5 py-1 rounded-md bg-[#ef6217] hover:bg-[#ff7426] text-[11px] font-extrabold uppercase cursor-pointer"
                      >
                        + Add Deal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Or Order Online for Delivery on
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={CAFE_INFO.zomatoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#e23744] text-white text-xs font-extrabold uppercase"
                  >
                    Zomato <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={CAFE_INFO.swiggyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#fc8019] text-white text-xs font-extrabold uppercase"
                  >
                    Swiggy <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {cart.map(({ item, qty }) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-white shadow-2xs"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-15 h-15 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-extrabold text-neutral-900 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-0.5 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-extrabold text-[#ef6217]">
                          ₹{item.price * qty}
                        </span>
                        <div className="inline-flex items-center gap-2 bg-neutral-100 rounded-lg px-2 py-1">
                          <button
                            type="button"
                            onClick={() => onDecrement(item.id)}
                            className="w-5 h-5 rounded bg-white shadow-2xs flex items-center justify-center text-neutral-700 hover:text-[#ef6217] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold min-w-[16px] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAdd(item)}
                            className="w-5 h-5 rounded bg-white shadow-2xs flex items-center justify-center text-neutral-700 hover:text-[#ef6217] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upsell Combo if no combo added yet */}
              {!hasComboInCart && suggestedCombo && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-[#ef6217] shrink-0" />
                    <div className="text-xs">
                      <span className="font-extrabold text-neutral-900 block">
                        Add 2 Cold Coffees + 1 Free @ ₹239?
                      </span>
                      <span className="text-[11px] text-neutral-600">Save ₹118 instantly!</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const coffeeCombo = MENU_ITEMS.find((m) => m.id === 'combo-cold-coffee-b2g1');
                      if (coffeeCombo) onAdd(coffeeCombo);
                    }}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#ef6217] text-white text-[11px] font-extrabold uppercase cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              )}

              {/* Promo Code */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (try UNCLETOM20)"
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#ef6217]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-neutral-900 text-white text-xs font-extrabold uppercase hover:bg-neutral-800 cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {appliedPromo === 'INVALID' && (
                <p className="text-[11px] text-red-600 font-semibold -mt-2">
                  Try code <span className="font-bold">UNCLETOM20</span> (20% off ₹250+) or{' '}
                  <span className="font-bold">HANSI10</span>!
                </p>
              )}
              {appliedPromo && appliedPromo !== 'INVALID' && (
                <p className="text-[11px] text-emerald-700 font-semibold -mt-2">
                  Code {appliedPromo} applied! {discount > 0 ? `You saved ₹${discount}.` : 'Add ₹250+ to unlock 20% off.'}
                </p>
              )}

              {/* Payment Preference (NFC, Credit/Debit Cards, Cash) */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">
                  Payment Method (Accepted at Cafe)
                </label>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nfc-upi')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'nfc-upi'
                        ? 'border-[#ef6217] bg-orange-50 text-[#ef6217]'
                        : 'border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>NFC / UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#ef6217] bg-orange-50 text-[#ef6217]'
                        : 'border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit/Debit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('counter')}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 cursor-pointer ${
                      paymentMethod === 'counter'
                        ? 'border-[#ef6217] bg-orange-50 text-[#ef6217]'
                        : 'border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>At Counter</span>
                  </button>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Name (optional)"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-[#ef6217]"
                />
                <input
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Cooking instructions (e.g., extra oregano, less spicy, Jain)"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-[#ef6217]"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Totals & Checkout */}
        {cart.length > 0 && !orderPlacedTicket && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 sm:px-5 sm:py-4 space-y-2.5 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Item Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Offer Discount ({appliedPromo})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              {packagingFee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Hygienic Takeaway Pack</span>
                  <span>₹{packagingFee}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-black text-neutral-900 pt-1.5 border-t border-neutral-200">
                <span>Grand Total</span>
                <span className="text-[#ef6217]">₹{grandTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {onProceedToOrderPage && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProceedToOrderPage();
                  }}
                  className="w-full py-2.5 sm:py-3 rounded-lg bg-[#f5b014] hover:bg-[#ffbe2e] text-[#111111] font-black text-xs uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>Proceed to Checkout &amp; Get Order ID →</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleQuickConfirm}
                className="w-full py-2 sm:py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                Instant Dine-In / Takeout • ₹{grandTotal}
              </button>
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs transition-all duration-200 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Quick Order
              </a>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
