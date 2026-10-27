import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Bike,
  UtensilsCrossed,
  PackageCheck,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { CAFE_INFO, MenuItem } from '../data/cafeData';
import { CartEntry } from './CartDrawer';
import { PureVegMark } from './BrandMarks';
import { SavedOrder } from './TrackOrderPage';

interface OrderPageProps {
  onBackToHome: () => void;
  onGoToMenu: () => void;
  onGoToTrack: (orderId?: string) => void;
  cart: CartEntry[];
  onAddToCart: (item: MenuItem) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

type ServiceMode = 'delivery' | 'takeaway' | 'dine-in';
type PaymentOption = 'upi' | 'cash' | 'card';

export const OrderPage: React.FC<OrderPageProps> = ({
  onBackToHome,
  onGoToMenu,
  onGoToTrack,
  cart,
  onAddToCart,
  onDecrement,
  onRemove,
  onClearCart,
}) => {
  const [serviceMode, setServiceMode] = useState<ServiceMode>('delivery');
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('upi');

  // Customer form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 1');
  const [guestCount, setGuestCount] = useState('2');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Placed order ticket state
  const [placedOrder, setPlacedOrder] = useState<SavedOrder | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const subtotal = cart.reduce((sum, e) => sum + e.item.price * e.qty, 0);

  const deliveryFee =
    serviceMode === 'delivery'
      ? subtotal >= 300 || subtotal === 0
        ? 0
        : 30
      : 0;

  const discount =
    appliedPromo === 'UNCLETOM20' && subtotal >= 250
      ? Math.round(subtotal * 0.2)
      : appliedPromo === 'HANSI10' && subtotal >= 150
      ? Math.round(subtotal * 0.1)
      : 0;

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === 'UNCLETOM20' || cleaned === 'HANSI10') {
      setAppliedPromo(cleaned);
    } else {
      setAppliedPromo('INVALID');
    }
  };

  const handlePlaceOrder = () => {
    const orderId = `#UTC-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newOrder: SavedOrder = {
      id: orderId,
      time: nowTime,
      date: nowDate,
      service: serviceMode,
      total: grandTotal,
      items: cart.map((c) => ({ name: c.item.name, qty: c.qty, price: c.item.price })),
      customerName: customerName || 'Valued Guest',
      customerPhone: customerPhone || '9876543210',
      addressOrTable:
        serviceMode === 'dine-in'
          ? `${tableNumber} (${guestCount} Guests)`
          : serviceMode === 'takeaway'
          ? 'Self Pickup at Shop No 2, Hansi'
          : `${deliveryAddress || 'Gandhi Nagar, Hansi'}${landmark ? ` (Landmark: ${landmark})` : ''}`,
      status: 'preparing',
    };

    // Save to localStorage
    try {
      const stored = localStorage.getItem('utc_orders');
      const list: SavedOrder[] = stored ? JSON.parse(stored) : [];
      list.unshift(newOrder);
      localStorage.setItem('utc_orders', JSON.stringify(list.slice(0, 10)));
    } catch {
      // ignore
    }

    setPlacedOrder(newOrder);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim()) return;
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  const buildWhatsAppLink = () => {
    if (!placedOrder) return '#';
    const lines = [
      `*New Order — Uncle Tom's Cafe (Hansi)*`,
      `Order ID: *${placedOrder.id}*`,
      `Type: *${placedOrder.service.toUpperCase()}*`,
      customerName ? `Guest: *${customerName}*` : '',
      customerPhone ? `Phone: *${customerPhone}*` : '',
      `Details: *${placedOrder.addressOrTable}*`,
      `Payment: *${
        paymentOption === 'upi'
          ? 'UPI / QR Code'
          : paymentOption === 'card'
          ? 'Card / NFC Tap'
          : 'Cash / Counter'
      }*`,
      `--------------------------`,
      ...placedOrder.items.map((c) => `• ${c.qty}x ${c.name} — ₹${c.price * c.qty}`),
      `--------------------------`,
      discount > 0 ? `Discount (${appliedPromo}): -₹${discount}` : '',
      deliveryFee > 0 ? `Delivery Fee: ₹${deliveryFee}` : '',
      `*Total Amount: ₹${placedOrder.total}*`,
      orderNotes ? `Notes: ${orderNotes}` : '',
    ].filter(Boolean);

    return `https://wa.me/${CAFE_INFO.phoneRaw}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#111111] pb-20 sm:pb-24">
      {/* Top Banner */}
      <section className="bg-white border-b border-neutral-200 pt-5 pb-6 sm:pt-6 sm:pb-8 px-3.5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#f58220] transition mb-3 sm:mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#f58220]">
                ⌁ 100% PURE VEGETARIAN ORDERING
              </span>
              <h1 className="font-display font-black text-2xl sm:text-4xl text-neutral-900 mt-0.5">
                Place Your Order
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-lg">
                Choose Dine In, Takeaway, or Delivery. You will receive a unique Order ID to track your food live!
              </p>
            </div>

            <button
              type="button"
              onClick={() => onGoToTrack()}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer self-start md:self-auto"
            >
              Have an Order ID? Track Here →
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {placedOrder ? (
          /* ================= ORDER SUCCESS CONFIRMATION ================= */
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 sm:p-8 text-center max-w-2xl mx-auto animate-fade-in">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>

            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md">
              Order Confirmed &amp; Placed!
            </span>

            <h2 className="font-display font-black text-xl sm:text-2xl text-neutral-900 mt-2 sm:mt-3">
              Your Food is Baking Fresh!
            </h2>

            {/* Order ID Banner */}
            <div className="my-4 sm:my-5 p-3.5 sm:p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-left">
              <div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-800 block">
                  Your Unique Order ID (Save for Tracking):
                </span>
                <span className="font-mono font-black text-lg sm:text-xl text-neutral-900">
                  {placedOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyOrderId(placedOrder.id)}
                className="px-3 py-1.5 bg-white border border-amber-400 hover:bg-amber-100 rounded-md text-xs font-bold text-neutral-900 transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Order ID</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
              Only someone with this specific Order ID can view live status. We can also send this Order ID to your WhatsApp or Email:
            </p>

            {/* Messaging & Email Delivery */}
            <div className="my-4 sm:my-5 space-y-2.5 sm:space-y-3 max-w-md mx-auto text-left">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order ID to WhatsApp</span>
              </a>

              <form onSubmit={handleSendEmail} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email for Order ID invoice"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-md outline-none focus:border-[#f58220]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-bold uppercase transition cursor-pointer"
                >
                  Send
                </button>
              </form>
              {emailSent && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Order ID {placedOrder.id} sent to {customerEmail}!
                </p>
              )}
            </div>

            {/* Items Summary */}
            <div className="bg-neutral-50 rounded-lg p-3 sm:p-4 text-left space-y-1.5 my-4 sm:my-5 text-xs">
              <div className="font-bold text-neutral-500 uppercase tracking-wider mb-2">
                Order Summary ({placedOrder.items.reduce((s, e) => s + e.qty, 0)} items)
              </div>
              {placedOrder.items.map((entry, idx) => (
                <div key={idx} className="flex justify-between font-semibold text-neutral-800">
                  <span>
                    {entry.qty}x {entry.name}
                  </span>
                  <span>₹{entry.price * entry.qty}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-black text-sm text-neutral-900">
                <span>Total Amount</span>
                <span className="text-[#f58220]">₹{placedOrder.total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => onGoToTrack(placedOrder.id)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#f5b014] hover:bg-[#ffbe2e] text-[#111111] font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm active:scale-95"
              >
                Track This Order Live Now →
              </button>

              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setPlacedOrder(null);
                  onGoToMenu();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wider transition cursor-pointer active:scale-95"
              >
                Order More Items
              </button>
            </div>
          </div>
        ) : (
          /* ================= ORDER FORM & CART CHECKOUT ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Service Mode & Customer Details */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {/* 1. Service Mode Selector */}
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-6 shadow-xs">
                <label className="text-[11px] sm:text-xs font-black text-neutral-500 uppercase tracking-wider block mb-2.5 sm:mb-3">
                  1. How would you like your order?
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    {
                      id: 'delivery' as const,
                      label: 'Delivery',
                      sub: 'Hansi Area',
                      icon: Bike,
                    },
                    {
                      id: 'takeaway' as const,
                      label: 'Takeaway',
                      sub: 'Self Pickup',
                      icon: PackageCheck,
                    },
                    {
                      id: 'dine-in' as const,
                      label: 'Dine In',
                      sub: 'Table Service',
                      icon: UtensilsCrossed,
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = serviceMode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setServiceMode(tab.id)}
                        className={`p-2.5 sm:p-3.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center justify-center active:scale-95 ${
                          active
                            ? 'bg-amber-50 border-[#f5b014] text-[#111111] shadow-xs'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 ${active ? 'text-[#f58220]' : 'text-neutral-500'}`} />
                        <span className="font-bold text-xs sm:text-sm block">{tab.label}</span>
                        <span className="text-[9px] sm:text-[10px] text-neutral-500">{tab.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Customer & Delivery/Table Details */}
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                <label className="text-[11px] sm:text-xs font-black text-neutral-500 uppercase tracking-wider block">
                  2. {serviceMode === 'dine-in' ? 'Table Information' : serviceMode === 'takeaway' ? 'Pickup Details' : 'Delivery Address'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f5b014]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                      Mobile Number (For Order ID Message)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f5b014]"
                    />
                  </div>
                </div>

                {serviceMode === 'dine-in' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                        Table Number
                      </label>
                      <select
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#f5b014] bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 'Terrace 1', 'Terrace 2'].map((num) => (
                          <option key={num} value={`Table ${num}`}>
                            Table {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#f5b014]"
                      />
                    </div>
                  </div>
                )}

                {serviceMode === 'delivery' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                        Complete Delivery Address
                      </label>
                      <textarea
                        rows={2}
                        placeholder="House / Flat No., Street, Colony, Hansi"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f5b014] resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Old Auto Market / Gandhi Nagar Chowk"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f5b014]"
                      />
                    </div>
                  </div>
                )}

                {serviceMode === 'takeaway' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#f58220] shrink-0" />
                    <span>Your takeaway will be prepared in 15 mins for pickup at Shop No 2, Old Auto Market Road.</span>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                    Special Cooking Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra oregano, less spicy, no onions..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f5b014]"
                  />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-6 shadow-xs">
                <label className="text-[11px] sm:text-xs font-black text-neutral-500 uppercase tracking-wider block mb-2.5 sm:mb-3">
                  3. Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    {
                      id: 'upi' as const,
                      label: 'UPI / QR Code',
                      desc: 'GPay, PhonePe, Paytm',
                      icon: Smartphone,
                    },
                    {
                      id: 'cash' as const,
                      label: serviceMode === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter',
                      desc: 'Pay on arrival',
                      icon: Wallet,
                    },
                    {
                      id: 'card' as const,
                      label: 'Card / NFC Tap',
                      desc: 'Credit, Debit & Tap',
                      icon: CreditCard,
                    },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const active = paymentOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentOption(opt.id)}
                        className={`p-2.5 sm:p-3 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between active:scale-95 ${
                          active
                            ? 'bg-amber-50 border-[#f5b014] text-neutral-900 shadow-xs'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                          <Icon className={`w-4 h-4 ${active ? 'text-[#f58220]' : 'text-neutral-500'}`} />
                          <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${active ? 'border-[#f5b014] bg-[#f5b014]' : 'border-neutral-300'}`}>
                            {active && <span className="w-1.5 h-1.5 bg-black" />}
                          </div>
                        </div>
                        <div className="font-bold text-xs">{opt.label}</div>
                        <div className="text-[9.5px] sm:text-[10px] text-neutral-500">{opt.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Order Bag Summary & Place Order Button */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-100">
                  <h3 className="font-display font-black text-sm sm:text-base text-neutral-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#f58220]" />
                    Order Bag Summary
                  </h3>
                  <button
                    type="button"
                    onClick={onGoToMenu}
                    className="text-xs font-bold text-[#f58220] hover:underline cursor-pointer"
                  >
                    + Add More
                  </button>
                </div>

                {/* Items List */}
                {cart.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm font-bold text-neutral-700">Your bag is empty</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Explore our delicious 100% pure veg pizzas, burgers, pasta &amp; shakes.
                    </p>
                    <button
                      type="button"
                      onClick={onGoToMenu}
                      className="mt-4 px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-[#f5b014] hover:text-[#111111] transition cursor-pointer"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
                    {cart.map((entry) => (
                      <div key={entry.item.id} className="py-3 flex items-center gap-3">
                        <img
                          src={entry.item.image}
                          alt={entry.item.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-neutral-900 truncate">
                            {entry.item.name}
                          </h4>
                          <div className="text-xs font-black text-neutral-900 mt-0.5">
                            ₹{entry.item.price * entry.qty}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 bg-neutral-100 rounded-md px-2 py-0.5 border border-neutral-200">
                          <button
                            type="button"
                            onClick={() => onDecrement(entry.item.id)}
                            className="w-5 h-5 rounded-sm bg-white text-neutral-800 flex items-center justify-center text-xs hover:bg-neutral-200"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-bold px-1">{entry.qty}</span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(entry.item)}
                            className="w-5 h-5 rounded-sm bg-neutral-900 text-white flex items-center justify-center text-xs hover:bg-[#f5b014] hover:text-[#111111]"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(entry.item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Promo Code Input */}
                {cart.length > 0 && (
                  <form onSubmit={handleApplyPromo} className="pt-4 mt-2 border-t border-neutral-100 flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. UNCLETOM20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-xs uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f5b014]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-neutral-800 transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {appliedPromo && appliedPromo !== 'INVALID' && (
                  <p className="text-[11px] font-bold text-emerald-600 mt-1">
                    ✓ Promo {appliedPromo} applied! You saved ₹{discount}.
                  </p>
                )}
                {appliedPromo === 'INVALID' && (
                  <p className="text-[11px] font-bold text-red-500 mt-1">
                    ✕ Invalid coupon. Try UNCLETOM20 for 20% off!
                  </p>
                )}

                {/* Bill Breakdown */}
                {cart.length > 0 && (
                  <div className="pt-4 mt-3 border-t border-neutral-100 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Item Subtotal</span>
                      <span className="font-semibold text-neutral-900">₹{subtotal}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount ({appliedPromo})</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-600">
                      <span>Delivery / Service Fee</span>
                      <span className="font-semibold text-neutral-900">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline font-black text-base text-neutral-900">
                      <span>Grand Total</span>
                      <span className="text-xl text-[#f58220]">₹{grandTotal}</span>
                    </div>

                    <button
                      type="button"
                      disabled={cart.length === 0}
                      onClick={handlePlaceOrder}
                      className="w-full mt-4 py-3.5 rounded-lg bg-[#f5b014] hover:bg-[#ffbe2e] disabled:opacity-50 text-[#111111] font-black text-xs uppercase tracking-wider shadow-md transition duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                    >
                      <span>Confirm &amp; Place Order (₹{grandTotal})</span>
                    </button>

                    <div className="text-center text-[10px] text-neutral-400 pt-1 flex items-center justify-center gap-1">
                      <PureVegMark size="sm" />
                      <span>100% Pure Vegetarian Cafe • Hansi</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
