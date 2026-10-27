import { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Utensils,
  CreditCard,
  Plus,
  Minus,
  Bike,
} from 'lucide-react';
import { Header } from './components/Header';
import { SearchOverlay } from './components/SearchOverlay';
import { MenuPage } from './components/MenuPage';
import { OrderPage } from './components/OrderPage';
import { TrackOrderPage } from './components/TrackOrderPage';
import { CartDrawer, CartEntry } from './components/CartDrawer';
import {
  UncleTomsLogo,
  PureVegMark,
  HeroQualityStamp,
} from './components/BrandMarks';
import {
  CAFE_INFO,
  COMBO_DEALS,
  MENU_ITEMS,
  MenuItem,
} from './data/cafeData';

type PopularTab = 'popular' | 'burgers' | 'pizzas' | 'pasta' | 'wraps' | 'shakes';

export function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'track' | 'order'>('home');
  const [trackOrderId, setTrackOrderId] = useState<string>('');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PopularTab>('popular');

  // Sync state with URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'menu') {
        setCurrentPage('menu');
      } else if (hash === 'track') {
        setCurrentPage('track');
      } else if (hash === 'order') {
        setCurrentPage('order');
      } else {
        setCurrentPage('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: 'home' | 'menu' | 'track' | 'order', orderId?: string) => {
    if (orderId) {
      setTrackOrderId(orderId);
    }
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart with instant confirmation and open drawer
  const handleAddToCart = (item: MenuItem, openCartImmediately = false) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.item.id === item.id);
      if (existing) {
        return prev.map((e) => (e.item.id === item.id ? { ...e, qty: e.qty + 1 } : e));
      }
      return [...prev, { item, qty: 1 }];
    });

    if (openCartImmediately) {
      setCartOpen(true);
    }
  };

  const handleDecrement = (id: string) => {
    setCart((prev) =>
      prev
        .map((e) => (e.item.id === id ? { ...e, qty: e.qty - 1 } : e))
        .filter((e) => e.qty > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCart((prev) => prev.filter((e) => e.item.id !== id));
  };

  const handleClearCart = () => setCart([]);

  const totalCartItems = cart.reduce((sum, e) => sum + e.qty, 0);
  const grandCartPrice = cart.reduce((sum, e) => sum + e.item.price * e.qty, 0);

  const cartQtyMap = useMemo(() => {
    return cart.reduce<Record<string, number>>((acc, e) => {
      acc[e.item.id] = e.qty;
      return acc;
    }, {});
  }, [cart]);

  // Displayed items in the 6-item Popular Picks on Home page
  const displayedPopularItems = useMemo(() => {
    switch (activeTab) {
      case 'popular':
        return MENU_ITEMS.filter((i) => i.isPopularPick).slice(0, 6);
      case 'burgers':
        return MENU_ITEMS.filter((i) => i.category === 'burgers').slice(0, 6);
      case 'pizzas':
        return MENU_ITEMS.filter((i) => i.category === 'pizzas' || i.id.includes('pizza')).slice(0, 6);
      case 'pasta':
        return MENU_ITEMS.filter((i) => i.category === 'pasta' || i.category === 'sandwiches').slice(0, 6);
      case 'wraps':
        return MENU_ITEMS.filter((i) => i.category === 'wraps' || i.category === 'waffles').slice(0, 6);
      case 'shakes':
        return MENU_ITEMS.filter((i) => i.category === 'shakes' || i.id === 'combo-cold-coffee-b2g1').slice(0, 6);
      default:
        return MENU_ITEMS.filter((i) => i.isPopularPick).slice(0, 6);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#111111]">
      {/* Dark Navigation Header */}
      <Header
        cartCount={totalCartItems}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigate={handleNavigate}
        currentPage={currentPage === 'track' ? 'track' : currentPage === 'menu' ? 'menu' : 'home'}
      />

      {/* ROUTED VIEWS WITH SMOOTH PAGE GLIDE */}
      <div key={currentPage} className="page-transition flex-1 flex flex-col">
        {currentPage === 'menu' ? (
          <MenuPage
            onBackToHome={() => handleNavigate('home')}
            onAddToCart={(item) => handleAddToCart(item, false)}
            onDecrement={handleDecrement}
            cartQtyMap={cartQtyMap}
            onOpenCart={() => setCartOpen(true)}
            totalCartItems={totalCartItems}
            totalPrice={grandCartPrice}
          />
        ) : currentPage === 'track' ? (
          <TrackOrderPage
            onBackToHome={() => handleNavigate('home')}
            initialOrderId={trackOrderId}
          />
        ) : currentPage === 'order' ? (
          <OrderPage
            onBackToHome={() => handleNavigate('home')}
            onGoToMenu={() => handleNavigate('menu')}
            onGoToTrack={(orderId) => handleNavigate('track', orderId)}
            cart={cart}
            onAddToCart={(item) => handleAddToCart(item, false)}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
            onClearCart={handleClearCart}
          />
        ) : (
          /* ================= HOME LANDING PAGE ================= */
          <main className="flex-1">
            {/* =========================================================
                1. HERO SECTION (ONLY Header & Hero are DARK THEME)
               ========================================================= */}
            <section
              id="home"
              className="relative bg-[#0d0a08] text-white overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-28 lg:pt-16 lg:pb-32"
            >
              {/* Ambient warm glow behind food */}
              <div
                className="pointer-events-none absolute top-1/2 right-[10%] -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] rounded-full opacity-35 blur-[80px] sm:blur-[100px]"
                style={{
                  background: 'radial-gradient(circle, #f59e0b 0%, #ea580c 45%, transparent 72%)',
                }}
              />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-8">
                  {/* Hero Left Column */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
                    {/* Script Tagline */}
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[#f5b014] font-bold text-base sm:text-lg leading-none select-none">✨</span>
                      <span className="font-script text-lg sm:text-2xl text-amber-100 tracking-wide">
                        Big Flavor. 100% Pure Veg.
                      </span>
                      <span className="text-[#f5b014] font-bold text-base sm:text-lg leading-none select-none">✨</span>
                    </div>

                    {/* Giant Condensed Stacked Headline (Mobile Responsive) */}
                    <h1 className="font-display italic font-black uppercase tracking-tight leading-[0.94] text-3xl sm:text-5xl lg:text-[68px]">
                      <span className="block text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                        FAST FOOD
                      </span>
                      <span className="block text-[#f5b014]">MADE FRESH,</span>
                      <span className="block text-[#f5b014]">MADE FOR YOU!</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-neutral-300 text-xs sm:text-base max-w-xl leading-relaxed font-normal">
                      Hansi&apos;s favorite pure vegetarian cafe! Hand-tossed pizzas, juicy paneer burgers, creamy white sauce pasta, wraps, crispy Belgian waffles &amp; thick shakes — prepared live in our hygienic open kitchen at pocket-friendly prices!
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleNavigate('order')}
                        className="inline-flex items-center gap-2 bg-[#f5b014] hover:bg-[#ffbe2e] active:scale-[0.97] text-[#111111] font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-3 sm:px-6 sm:py-3.5 rounded-lg shadow-[0_8px_25px_rgba(245,176,20,0.35)] transition cursor-pointer"
                      >
                        <span>ORDER ONLINE</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.6]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavigate('menu')}
                        className="inline-flex items-center justify-center border border-white/35 hover:border-[#f5b014] hover:text-[#f5b014] bg-white/[0.03] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-3 sm:px-6 sm:py-3.5 rounded-lg transition cursor-pointer active:scale-[0.97]"
                      >
                        VIEW MENU
                      </button>
                    </div>

                    {/* Social Proof & Rating (Well-spaced, clean breathing room) */}
                    <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {['/images/avatar-1.jpg', '/images/avatar-2.jpg', '/images/avatar-3.jpg', '/images/avatar-4.jpg'].map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Happy Guest"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border border-white/25 object-cover shadow-sm transition hover:scale-105"
                          />
                        ))}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span className="flex text-amber-400 text-xs">
                            {'★★★★★'.split('').map((s, idx) => (
                              <span key={idx}>{s}</span>
                            ))}
                          </span>
                          <span className="font-extrabold text-[#f5b014]">4.1 ★</span>
                          <span className="text-neutral-300 font-normal text-[11px] sm:text-xs">
                            ({CAFE_INFO.reviewCount} Happy Foodies)
                          </span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 mt-0.5">
                          Pocket-Friendly • 100% Pure Veg • Hansi
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Right Column: Food Imagery with Crest */}
                  <div className="lg:col-span-5 relative flex items-center justify-center pt-2 lg:pt-0">
                    <div className="relative w-full max-w-[280px] sm:max-w-md">
                      <img
                        src="/images/hero-combo.png"
                        alt="Uncle Tom's Cafe Delicious Fast Food"
                        className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition duration-500 hover:scale-105"
                      />

                      {/* Rotating Stamp */}
                      <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 scale-75 sm:scale-100 origin-bottom-left">
                        <HeroQualityStamp />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================
                2. FLOATING OVERLAPPING HIGHLIGHTS BOX (Overlaps Dark Hero & Light Theme)
               ========================================================= */}
            <section className="relative z-30 -mt-6 sm:-mt-12 px-2.5 sm:px-6 lg:px-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-neutral-200/80 p-2.5 sm:p-5 text-neutral-900">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 divide-y-0 sm:divide-y-0 lg:divide-x divide-neutral-100 text-center">
                  {/* 1. 100% Pure Veg */}
                  <div className="flex flex-col items-center p-1 sm:p-1.5">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-1 sm:mb-1.5 shadow-2xs">
                      <PureVegMark size="sm" dark={false} />
                    </div>
                    <div className="font-extrabold text-[11px] sm:text-sm text-neutral-900">100% Pure Veg</div>
                    <div className="text-[9px] sm:text-xs text-neutral-500 mt-0.5">Pure Vegetarian</div>
                  </div>

                  {/* 2. Live Open Kitchen */}
                  <div className="flex flex-col items-center p-1 sm:p-1.5">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-1 sm:mb-1.5 shadow-2xs">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#f58220]" />
                    </div>
                    <div className="font-extrabold text-[11px] sm:text-sm text-neutral-900">Live Kitchen</div>
                    <div className="text-[9px] sm:text-xs text-neutral-500 mt-0.5">Fresh &amp; Hygienic</div>
                  </div>

                  {/* 3. Pocket-Friendly */}
                  <div className="flex flex-col items-center p-1 sm:p-1.5">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-1 sm:mb-1.5 shadow-2xs">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-[#f58220]" />
                    </div>
                    <div className="font-extrabold text-[11px] sm:text-sm text-neutral-900">Pocket-Friendly</div>
                    <div className="text-[9px] sm:text-xs text-neutral-500 mt-0.5">Everyday Prices</div>
                  </div>

                  {/* 4. Free Delivery */}
                  <div className="flex flex-col items-center p-1 sm:p-1.5">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-1 sm:mb-1.5 shadow-2xs">
                      <Bike className="w-4 h-4 sm:w-5 sm:h-5 text-[#f58220]" />
                    </div>
                    <div className="font-extrabold text-[11px] sm:text-sm text-neutral-900">Free Delivery</div>
                    <div className="text-[9px] sm:text-xs text-neutral-500 mt-0.5">To Your Door</div>
                  </div>

                  {/* 5. Instant Pay */}
                  <div className="col-span-2 sm:col-span-1 flex flex-col items-center p-1 sm:p-1.5">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-1 sm:mb-1.5 shadow-2xs">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#f58220]" />
                    </div>
                    <div className="font-extrabold text-[11px] sm:text-sm text-neutral-900">Instant Pay</div>
                    <div className="text-[9px] sm:text-xs text-neutral-500 mt-0.5">Quick Checkout</div>
                  </div>
                </div>
              </div>
            </section>

          {/* =========================================================
              3. MEGA COMBOS & SPECIAL DEALS SECTION (CLEAN LIGHT THEME)
             ========================================================= */}
          <section id="specials" className="pt-10 pb-10 sm:pt-16 sm:pb-14 px-3.5 sm:px-6 lg:px-8 bg-[#faf9f6]">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-neutral-900">
                    Today&apos;s Best Value Offers
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                    Special handcrafted combos with free sides and complimentary refreshing drinks!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {COMBO_DEALS.map((combo) => {
                  const inCartQty = cartQtyMap[combo.id] || 0;
                  return (
                    <div
                      key={combo.id}
                      className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs p-3.5 sm:p-5 flex flex-col justify-between transition hover:border-[#f5b014] hover:shadow-md"
                    >
                      <div>
                        <span className="inline-block bg-amber-50 text-[#f58220] text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md mb-2 sm:mb-3 border border-amber-200">
                          {combo.tag}
                        </span>
                        <div className="h-36 sm:h-44 overflow-hidden rounded-lg mb-3 sm:mb-4 bg-neutral-100">
                          <img
                            src={combo.image}
                            alt={combo.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-neutral-900 leading-snug">
                          {combo.title}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                          {combo.subtitle}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase">
                            {combo.savingsLabel}
                          </div>
                          <div className="flex items-baseline gap-1.5 sm:gap-2">
                            <span className="font-black text-base sm:text-lg text-neutral-900">₹{combo.price}</span>
                            <span className="text-xs text-neutral-400 line-through">₹{combo.originalPrice}</span>
                          </div>
                        </div>

                        {/* Interactive Quantity Selector [−] {inCartQty} [+] */}
                        {inCartQty > 0 ? (
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 border-2 border-[#f5b014] rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-xs">
                            <button
                              type="button"
                              onClick={() => handleDecrement(combo.id)}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white text-neutral-900 hover:bg-neutral-200 flex items-center justify-center transition cursor-pointer text-xs font-black"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                            </button>
                            <span className="text-xs sm:text-sm font-black text-neutral-900 px-1.5 min-w-[18px] text-center">
                              {inCartQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                handleAddToCart(
                                  {
                                    id: combo.id,
                                    name: combo.title,
                                    category: 'combos',
                                    price: combo.price,
                                    originalPrice: combo.originalPrice,
                                    image: combo.image,
                                    description: combo.subtitle,
                                    badge: combo.tag,
                                  },
                                  false
                                );
                              }}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#f5b014] text-[#111111] hover:bg-[#ffbe2e] flex items-center justify-center transition cursor-pointer text-xs font-black"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              handleAddToCart(
                                {
                                  id: combo.id,
                                  name: combo.title,
                                  category: 'combos',
                                  price: combo.price,
                                  originalPrice: combo.originalPrice,
                                  image: combo.image,
                                  description: combo.subtitle,
                                  badge: combo.tag,
                                },
                                false
                              );
                            }}
                            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 bg-[#f5b014] hover:bg-[#ffbe2e] text-[#111111] shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                            <span>Add Deal</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =========================================================
              4. POPULAR PICKS SECTION (CLEAN LIGHT THEME)
             ========================================================= */}
          <section className="py-10 sm:py-14 px-3.5 sm:px-6 lg:px-8 bg-white border-t border-neutral-200">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-neutral-900">
                    Popular Picks
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                    Hansi&apos;s most loved pure vegetarian fast food cravings.
                  </p>
                </div>

                {/* Filter Tabs - Swipeable on mobile */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap">
                  {[
                    { id: 'popular' as const, label: 'All Popular' },
                    { id: 'burgers' as const, label: 'Burgers' },
                    { id: 'pizzas' as const, label: 'Pizzas' },
                    { id: 'pasta' as const, label: 'Pasta' },
                    { id: 'wraps' as const, label: 'Wraps' },
                    { id: 'shakes' as const, label: 'Shakes' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
                        activeTab === tab.id
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                {displayedPopularItems.map((item) => {
                  const qty = cartQtyMap[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition p-3 sm:p-4 flex flex-col justify-between"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0 group-hover:scale-105 transition duration-300"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <PureVegMark size="sm" />
                            {item.badge && (
                              <span className="text-[10px] sm:text-xs font-bold text-[#f58220]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-bold text-xs sm:text-sm text-neutral-900 mt-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="font-black text-sm sm:text-base text-neutral-900">₹{item.price}</span>

                        {qty > 0 ? (
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 border-2 border-[#f5b014] rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-xs">
                            <button
                              type="button"
                              onClick={() => handleDecrement(item.id)}
                              className="w-6 h-6 rounded-md bg-white text-neutral-900 hover:bg-neutral-200 flex items-center justify-center transition cursor-pointer text-xs font-black"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                            <span className="text-xs font-black text-neutral-900 px-1 min-w-[16px] text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item, false)}
                              className="w-6 h-6 rounded-md bg-[#f5b014] text-[#111111] hover:bg-[#ffbe2e] flex items-center justify-center transition cursor-pointer text-xs font-black"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item, false)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#f5b014] hover:bg-[#ffbe2e] text-[#111111] rounded-lg text-xs font-black uppercase transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View Full Menu CTA Button */}
              <div className="mt-8 sm:mt-10 text-center">
                <button
                  type="button"
                  onClick={() => handleNavigate('menu')}
                  className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-neutral-900 hover:bg-[#f5b014] hover:text-[#111111] text-white rounded-lg font-black text-xs uppercase tracking-wider shadow-sm transition duration-200 cursor-pointer active:scale-95"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      )}
      </div>

      {/* =========================================================
          FOOTER (100% Pure White - Simple Single Line, No WhatsApp)
         ========================================================= */}
      <footer className="bg-white border-t border-neutral-200 py-3.5 px-3 sm:px-6 lg:px-8 text-neutral-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <UncleTomsLogo compact dark={false} />
            <span className="text-neutral-300">•</span>
            <PureVegMark size="sm" showLabel dark={false} />
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-500">Gandhi Nagar, Hansi</span>
          </div>

          <div className="flex items-center gap-2 text-neutral-500">
            <span>© {new Date().getFullYear()} Uncle Tom&apos;s Cafe, Hansi. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

      {/* Interactive Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onAdd={(item) => handleAddToCart(item, false)}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onClear={handleClearCart}
        onProceedToOrderPage={() => handleNavigate('order')}
      />

      {/* Interactive Search Overlay */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onAddToCart={(item) => handleAddToCart(item, false)}
        cartQtyMap={cartQtyMap}
      />
    </div>
  );
}

export default App;
