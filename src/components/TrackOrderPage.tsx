import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChefHat,
  Bike,
  Utensils,
  Share2,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';

export interface SavedOrder {
  id: string;
  time: string;
  date: string;
  service: 'delivery' | 'takeaway' | 'dine-in';
  total: number;
  items: { name: string; qty: number; price: number }[];
  customerName?: string;
  customerPhone?: string;
  addressOrTable?: string;
  status: 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
}

interface TrackOrderPageProps {
  onBackToHome: () => void;
  initialOrderId?: string;
}

const DEMO_ORDER: SavedOrder = {
  id: '#UTC-68234',
  time: '10:15 PM',
  date: 'Today',
  service: 'delivery',
  total: 418,
  items: [
    { name: 'Paneer Makhani Pizza', qty: 1, price: 199 },
    { name: 'Choco Cold Coffee Shake', qty: 1, price: 129 },
    { name: 'Magic Caramelized Onion Pizza', qty: 1, price: 0 },
  ],
  customerName: 'Rohit Kumar',
  customerPhone: '+91 98765 43210',
  addressOrTable: 'Shop No 2, Gandhi Nagar, Hansi',
  status: 'preparing',
};

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  onBackToHome,
  initialOrderId = '',
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [currentOrder, setCurrentOrder] = useState<SavedOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [recentOrders, setRecentOrders] = useState<SavedOrder[]>([]);

  // Load orders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('utc_orders');
      if (stored) {
        const parsed: SavedOrder[] = JSON.parse(stored);
        setRecentOrders(parsed);
        if (initialOrderId) {
          const match = parsed.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase());
          if (match) {
            setCurrentOrder(match);
            setSearched(true);
            return;
          }
        }
      }
    } catch {
      // ignore
    }

    if (initialOrderId) {
      if (initialOrderId.toLowerCase() === DEMO_ORDER.id.toLowerCase()) {
        setCurrentOrder(DEMO_ORDER);
      }
      setSearched(true);
    }
  }, [initialOrderId]);

  const handleTrack = (queryToTrack?: string) => {
    const q = (queryToTrack !== undefined ? queryToTrack : searchInput).trim().toUpperCase();
    if (!q) return;

    setSearched(true);
    setEmailSent(false);

    // Look in recent orders
    const found = recentOrders.find(
      (o) => o.id.toUpperCase() === q || o.id.toUpperCase().replace('#', '') === q.replace('#', '')
    );

    if (found) {
      setCurrentOrder(found);
      return;
    }

    // Check demo order
    if (q === '#UTC-68234' || q === 'UTC-68234' || q === 'UTC68234') {
      setCurrentOrder(DEMO_ORDER);
      return;
    }

    setCurrentOrder(null);
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  const buildWhatsAppMessage = (order: SavedOrder) => {
    const text = `Hi Uncle Tom's Cafe! Tracking my Order ID: *${order.id}*\nStatus Check for ${order.service.toUpperCase()} order of ₹${order.total}.\nItems:\n${order.items.map((i) => `• ${i.qty}x ${i.name}`).join('\n')}`;
    return `https://wa.me/${CAFE_INFO.phoneRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#111111] pb-24">
      {/* Top Banner */}
      <section className="bg-white border-b border-neutral-200 pt-5 pb-6 sm:pt-6 sm:pb-8 px-3.5 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#f58220] transition mb-3 sm:mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#f58220]">
                ⌁ LIVE STATUS &amp; ORDER VERIFICATION
              </span>
              <h1 className="font-display font-black text-2xl sm:text-4xl text-neutral-900 mt-0.5">
                Track Your Order
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-lg">
                Enter your unique Order ID received on placing your order. Live updates directly from our hygienic open kitchen!
              </p>
            </div>

            {/* Track ID Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrack();
              }}
              className="w-full md:w-80 flex items-center bg-neutral-50 border border-neutral-300 rounded-lg p-1 shadow-xs"
            >
              <input
                type="text"
                placeholder="Order ID (e.g. #UTC-68234)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-2.5 py-1.5 sm:py-2 text-xs font-bold text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none uppercase"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-neutral-900 hover:bg-[#f58220] hover:text-[#111111] text-white rounded-md text-xs font-black uppercase transition cursor-pointer shrink-0"
              >
                Track
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* If Order Found */}
        {currentOrder ? (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {/* Status Header Card */}
            <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-[11px] sm:text-xs font-black text-neutral-500 uppercase tracking-wider">
                      Verified Order ID:
                    </span>
                    <span className="font-mono font-black text-sm sm:text-base text-neutral-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
                      {currentOrder.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyOrderId(currentOrder.id)}
                      className="p-1 text-neutral-400 hover:text-neutral-800 transition cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedId ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="text-[11px] sm:text-xs text-neutral-500 mt-1">
                    Placed: {currentOrder.date} at {currentOrder.time} • Service:{' '}
                    <span className="font-extrabold uppercase text-[#f58220]">
                      {currentOrder.service}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-emerald-50 border border-emerald-300 rounded-md text-[11px] sm:text-xs font-black text-emerald-700">
                    <span className="w-2 h-2 rounded-xs bg-emerald-500 animate-pulse" />
                    LIVE IN KITCHEN
                  </span>
                </div>
              </div>

              {/* Progress 4-Step Tracker (Mobile-scaled) */}
              <div className="pt-4 sm:pt-6">
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-xs">
                  <div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-600 text-white font-black mx-auto flex items-center justify-center text-xs sm:text-sm shadow-xs">
                      ✓
                    </div>
                    <div className="font-black text-neutral-900 mt-1.5 sm:mt-2 text-[10px] sm:text-xs leading-tight">Confirmed</div>
                    <div className="text-[8.5px] sm:text-[10px] text-neutral-500 mt-0.5">{currentOrder.time}</div>
                  </div>

                  <div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#f58220] text-white font-black mx-auto flex items-center justify-center text-xs sm:text-sm shadow-md animate-pulse">
                      <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="font-black text-[#f58220] mt-1.5 sm:mt-2 text-[10px] sm:text-xs leading-tight">Baking Live</div>
                    <div className="text-[8.5px] sm:text-[10px] text-neutral-500 mt-0.5">Live Kitchen</div>
                  </div>

                  <div className="opacity-40">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-neutral-200 text-neutral-600 font-black mx-auto flex items-center justify-center text-xs sm:text-sm">
                      <Bike className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="font-black text-neutral-800 mt-1.5 sm:mt-2 text-[10px] sm:text-xs leading-tight">
                      {currentOrder.service === 'dine-in' ? 'Table Ready' : 'Out for Delivery'}
                    </div>
                    <div className="text-[8.5px] sm:text-[10px] text-neutral-500 mt-0.5">Est. 12 mins</div>
                  </div>

                  <div className="opacity-40">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-neutral-200 text-neutral-600 font-black mx-auto flex items-center justify-center text-xs sm:text-sm">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="font-black text-neutral-800 mt-1.5 sm:mt-2 text-[10px] sm:text-xs leading-tight">Delivered</div>
                    <div className="text-[8.5px] sm:text-[10px] text-neutral-500 mt-0.5">Enjoy Food!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details & Notifications Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Items in Order */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#f58220]" />
                  Ordered Items ({currentOrder.items.reduce((s, i) => s + i.qty, 0)})
                </h3>
                <div className="divide-y divide-neutral-100 text-xs">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-neutral-900">{item.name}</div>
                        <div className="text-[11px] text-neutral-500">Qty: {item.qty}</div>
                      </div>
                      <div className="font-black text-neutral-900">
                        {item.price === 0 ? (
                          <span className="text-emerald-600 uppercase font-black">FREE DEAL</span>
                        ) : (
                          `₹${item.price * item.qty}`
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 flex justify-between font-black text-sm text-neutral-900">
                    <span>Total Amount</span>
                    <span className="text-[#f58220]">₹{currentOrder.total}</span>
                  </div>
                </div>

                {currentOrder.addressOrTable && (
                  <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                    <span className="font-bold text-neutral-800 block">
                      {currentOrder.service === 'dine-in' ? 'Table Details:' : 'Delivery Location:'}
                    </span>
                    <span>{currentOrder.addressOrTable}</span>
                  </div>
                )}
              </div>

              {/* Right: Message & Email Order ID Delivery */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-neutral-900 mb-1 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#f58220]" />
                    Send Order ID &amp; Updates
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Receive your verified Order ID and live cooking progress directly on WhatsApp or Email so you can track it anytime.
                  </p>
                </div>

                {/* WhatsApp Quick Message Button */}
                <a
                  href={buildWhatsAppMessage(currentOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Receive Order ID on WhatsApp</span>
                </a>

                {/* Email Delivery Form */}
                <form onSubmit={handleSendEmail} className="pt-2 border-t border-neutral-100">
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Send Order Invoice &amp; ID to Email:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-md outline-none focus:border-[#f58220]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-bold uppercase transition cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                  {emailSent && (
                    <p className="text-[11px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Order ID {currentOrder.id} sent to {emailInput}!
                    </p>
                  )}
                </form>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span>Questions about order?</span>
                  <a
                    href={`tel:+${CAFE_INFO.phoneRaw}`}
                    className="font-bold text-neutral-800 hover:text-[#f58220]"
                  >
                    Call: {CAFE_INFO.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : searched ? (
          /* If Order Not Found */
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-lg text-neutral-900">
              No Order Found for &ldquo;{searchInput}&rdquo;
            </h3>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Please double check the Order ID received in your WhatsApp message or order receipt. Try demo order{' '}
              <button
                type="button"
                onClick={() => {
                  setSearchInput('#UTC-68234');
                  handleTrack('#UTC-68234');
                }}
                className="font-mono font-bold text-[#f58220] hover:underline cursor-pointer"
              >
                #UTC-68234
              </button>
              .
            </p>
          </div>
        ) : (
          /* Initial Empty State */
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center max-w-md mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-[#f58220] flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-base text-neutral-900">
                Track Your Food in Real-Time
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Enter your Order ID above or check your recent orders below.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('#UTC-68234');
                  handleTrack('#UTC-68234');
                }}
                className="mt-3 text-xs font-bold text-[#f58220] hover:underline cursor-pointer"
              >
                Try Demo Order (#UTC-68234) →
              </button>
            </div>

            {/* List of Recent Orders on Device */}
            {recentOrders.length > 0 && (
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
                <h4 className="font-display font-black text-xs uppercase tracking-wider text-neutral-500 mb-3">
                  Recent Orders on this Device
                </h4>
                <div className="divide-y divide-neutral-100 text-xs">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="py-3 flex items-center justify-between hover:bg-neutral-50 px-2 rounded-md transition"
                    >
                      <div>
                        <div className="font-bold text-neutral-900 flex items-center gap-2">
                          <span className="font-mono text-xs">{ord.id}</span>
                          <span className="text-[10px] font-black uppercase text-[#f58220] bg-amber-50 px-2 py-0.5 rounded-sm">
                            {ord.service}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {ord.date} • ₹{ord.total} ({ord.items.length} items)
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput(ord.id);
                          handleTrack(ord.id);
                        }}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-[#f58220] hover:text-[#111111] text-white rounded-md text-xs font-bold uppercase transition cursor-pointer"
                      >
                        Track Status →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
