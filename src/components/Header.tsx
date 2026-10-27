import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  ArrowRight,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { CAFE_INFO } from '../data/cafeData';
import { UncleTomsLogo } from './BrandMarks';

// Official brand logo SVGs (icons only, no text)
const ZomatoLogoIcon = () => (
  <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
    <path d="M4 5h16l-9.5 12.5H20V20H4l9.5-12.5H4V5z" />
  </svg>
);

const SwiggyLogoIcon = () => (
  <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
    <path d="M18.8 9.6c-.4-3.5-3.4-6.2-7-6.2-3.9 0-7.1 3.2-7.1 7.1 0 2.2 1 4.1 2.6 5.4l4.5 5.5 4.5-5.5c1.6-1.3 2.6-3.2 2.6-5.4 0-.3 0-.6-.1-.9zm-6.8 5.7c-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3c1.7 0 3.2 1 3.9 2.5l-1.9.8c-.4-.9-1.2-1.4-2-1.4-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4c.8 0 1.6-.5 2-1.4l1.9.8c-.7 1.5-2.2 2.5-3.9 2.5z" />
  </svg>
);

const WhatsAppLogoIcon = () => (
  <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24h.02zm-3.6 3.7c-.2 0-.44.07-.67.33-.23.26-.88.86-.88 2.1 0 1.23.9 2.42 1.02 2.59.13.16 1.74 2.66 4.23 3.73.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.2-.59.2-1.09.14-1.18-.06-.1-.23-.16-.49-.29-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.19-.56.06-.26-.13-1.1-.4-2.09-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.57-1.39-.8-1.9-.21-.5-.43-.44-.59-.44l-.4-.01z" />
  </svg>
);

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onNavigate: (page: 'home' | 'menu' | 'track') => void;
  currentPage: 'home' | 'menu' | 'track';
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onNavigate,
  currentPage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: 'home' | 'menu' | 'track', targetId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Dark Utility Bar - Ultra compact & short */}
      <div className="w-full bg-[#090807] text-[10.5px] sm:text-[11px] tracking-wide text-neutral-300 py-1 px-3 sm:px-6 lg:px-8 flex justify-between items-center gap-2 border-b border-white/10">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate text-neutral-300 font-medium">Open 10:30am – 10:30pm • Hansi</span>
        </div>

        {/* Swiggy, Zomato & WhatsApp Instant Logo Buttons at the very end */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <a
            href={CAFE_INFO.zomatoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#e23744] hover:bg-[#cb202d] flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
            title="Order on Zomato"
            aria-label="Order on Zomato"
          >
            <ZomatoLogoIcon />
          </a>
          <a
            href={CAFE_INFO.swiggyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#fc8019] hover:bg-[#e26e0e] flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
            title="Order on Swiggy"
            aria-label="Order on Swiggy"
          >
            <SwiggyLogoIcon />
          </a>
          <a
            href={`https://wa.me/${CAFE_INFO.phoneRaw}?text=${encodeURIComponent(
              "Hi Uncle Tom's Cafe! I want to place an order."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
            title="Chat with us on WhatsApp"
            aria-label="Chat with us on WhatsApp"
          >
            <WhatsAppLogoIcon />
          </a>
        </div>
      </div>

      {/* Main Dark Navbar */}
      <nav aria-label="Main navigation" className="bg-[#110f0d]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="cursor-pointer text-left focus:outline-none shrink-0"
            title="Uncle Tom's Cafe - Back to Home"
          >
            <UncleTomsLogo compact dark={true} />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-[12.5px] font-bold tracking-wider uppercase text-white">
            <button
              type="button"
              onClick={() => handleNavClick('menu')}
              className={`transition py-1 cursor-pointer relative ${
                currentPage === 'menu'
                  ? 'text-[#f5b014] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#f5b014]'
                  : 'hover:text-[#f5b014]'
              }`}
            >
              MENU
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'specials')}
              className="hover:text-[#f5b014] transition py-1 cursor-pointer"
            >
              SPECIALS
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('track')}
              className={`transition py-1 cursor-pointer relative ${
                currentPage === 'track'
                  ? 'text-[#f5b014] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#f5b014]'
                  : 'hover:text-[#f5b014]'
              }`}
            >
              TRACK YOUR ORDER
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-white/10 hover:bg-[#f5b014] hover:text-[#110f0d] text-white border border-white/15 flex items-center justify-center transition cursor-pointer active:scale-95"
              aria-label="Search food items"
              title="Search menu"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-white/10 hover:bg-[#f5b014] hover:text-[#110f0d] text-white border border-white/15 flex items-center justify-center transition cursor-pointer active:scale-95"
              aria-label="View Order Bag"
              title="Your Order Bag"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f5b014] text-[#111111] text-[9.5px] font-black px-1.5 py-0.2 rounded-md flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Now Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="hidden sm:inline-flex bg-[#f5b014] hover:bg-[#ffbe2e] text-[#111111] font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded-lg items-center gap-1.5 shadow-[0_4px_16px_rgba(245,176,20,0.35)] transition duration-200 cursor-pointer active:scale-95"
            >
              <span>Order Now</span>
              <ArrowRight className="w-3 h-3 stroke-[2.6]" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center cursor-pointer border border-white/15 active:scale-95"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Clean, No duplicate WhatsApp / Free Delivery) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#14120f] px-5 py-3 space-y-1 animate-fade-in text-white text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => handleNavClick('menu')}
              className="block w-full text-left py-2 hover:text-[#f5b014] transition cursor-pointer"
            >
              MENU
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('home', 'specials')}
              className="block w-full text-left py-2 hover:text-[#f5b014] transition cursor-pointer"
            >
              SPECIALS &amp; COMBOS
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('track')}
              className="block w-full text-left py-2 text-[#f5b014] hover:text-[#ffbe2e] transition cursor-pointer"
            >
              TRACK YOUR ORDER
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};
