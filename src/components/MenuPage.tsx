import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Flame,
} from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/cafeData';
import { PureVegMark } from './BrandMarks';

interface MenuPageProps {
  onBackToHome: () => void;
  onAddToCart: (item: MenuItem) => void;
  onDecrement: (id: string) => void;
  cartQtyMap: Record<string, number>;
  onOpenCart: () => void;
  totalCartItems: number;
  totalPrice: number;
  initialCategory?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'pizzas', label: 'Pizzas' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'wraps', label: 'Wraps' },
  { id: 'waffles', label: 'Waffles' },
  { id: 'shakes', label: 'Shakes' },
  { id: 'sides', label: 'Loaded Fries' },
  { id: 'combos', label: 'Mega Combos' },
];

export const MenuPage: React.FC<MenuPageProps> = ({
  onBackToHome,
  onAddToCart,
  onDecrement,
  cartQtyMap,
  onOpenCart,
  totalCartItems,
  totalPrice,
  initialCategory = 'all',
}) => {
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCat === 'all' ||
      item.category === selectedCat ||
      (selectedCat === 'combos' && item.id.includes('combo'));

    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#111111] pb-24">
      {/* Top Banner (Clean Light Theme) */}
      <section className="bg-white border-b border-neutral-200 pt-4 pb-6 sm:pt-6 sm:pb-8 px-3.5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#f5b014] transition mb-3 sm:mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#f5b014]">
                100% PURE VEGETARIAN MENU
              </span>
              <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-neutral-900 mt-0.5">
                Delicious Food, Made for You
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                Fresh ingredients, handcrafted dough, melted cheese &amp; authentic spices. Every dish prepared fresh to order in our hygienic live kitchen!
              </p>
            </div>

            {/* Search Box */}
            <div className="w-full md:w-72">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in menu..."
                  className="w-full rounded-lg bg-neutral-50 border border-neutral-300 pl-10 pr-4 py-2 sm:py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#f5b014] shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Category Tabs Bar - Rounded-lg (No capsules!) */}
      <nav aria-label="Menu categories" className="sticky top-[80px] sm:top-[92px] z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2 sm:py-3 overflow-x-auto no-scrollbar flex items-center gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`shrink-0 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  active
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Menu Cards Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {selectedCat !== 'all' && (
          <div className="flex justify-end mb-3 sm:mb-4">
            <button
              type="button"
              onClick={() => setSelectedCat('all')}
              className="text-xs font-semibold text-[#f5b014] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-neutral-200 p-6 sm:p-8">
            <p className="text-base sm:text-lg font-bold text-neutral-800">No dishes match your selection</p>
            <p className="text-xs text-neutral-500 mt-1">
              Try searching for something else or choose another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCat('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-[#f5b014] hover:text-[#111111] transition cursor-pointer"
            >
              View Full Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {filteredItems.map((item) => {
              const qty = cartQtyMap[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-[#f5b014]/60 hover:shadow-md transition duration-300 flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div className="relative h-28 sm:h-40 md:h-48 overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1.5">
                      <PureVegMark size="sm" showLabel={false} dark={false} />
                    </div>

                    {item.badge && (
                      <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 sm:px-2 rounded-md bg-[#f5b014] text-[#111111] shadow-xs">
                        {item.badge}
                      </span>
                    )}

                    {item.spiceLevel && (
                      <span className="hidden sm:inline-flex absolute bottom-2 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-amber-200 items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {item.spiceLevel}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-xs sm:text-base text-neutral-900 group-hover:text-[#f5b014] transition line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="hidden sm:block text-[11px] sm:text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-neutral-100 flex items-center justify-between gap-1">
                      <div>
                        <span className="text-[8.5px] sm:text-[10px] text-neutral-400 uppercase font-bold block">
                          Price
                        </span>
                        <span className="font-black text-xs sm:text-base text-neutral-900">
                          ₹{item.price}
                        </span>
                      </div>

                      {/* Interactive Add or Qty Increment/Decrement */}
                      {qty > 0 ? (
                        <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 border-2 border-[#f5b014] rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-xs">
                          <button
                            type="button"
                            onClick={() => onDecrement(item.id)}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-white text-neutral-900 hover:bg-neutral-200 flex items-center justify-center transition cursor-pointer text-xs font-black active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                          </button>
                          <span className="text-[11px] sm:text-xs font-black text-neutral-900 px-1 min-w-[14px] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(item)}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#f5b014] text-[#111111] hover:bg-[#ffbe2e] flex items-center justify-center transition cursor-pointer text-xs font-black active:scale-90"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddToCart(item)}
                          className="px-2.5 py-1 sm:px-3.5 sm:py-2 bg-[#f5b014] hover:bg-[#ffbe2e] text-[#111111] rounded-lg text-[11px] sm:text-xs font-black uppercase flex items-center gap-1 shadow-xs transition cursor-pointer active:scale-95"
                        >
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Bar if Cart Has Items */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 max-w-xl mx-auto z-40 animate-fade-in">
          <div className="bg-[#110f0d] text-white px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl shadow-2xl flex items-center justify-between border border-white/15">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#f5b014] text-[#111111] flex items-center justify-center font-black text-xs sm:text-sm">
                {totalCartItems}
              </span>
              <div>
                <div className="text-[10px] sm:text-xs text-neutral-400">Total in Order Bag</div>
                <div className="text-xs sm:text-sm font-black text-white">₹{totalPrice}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="bg-[#f5b014] hover:bg-[#ffbe2e] active:scale-95 text-[#111111] px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs font-black tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
            >
              <span>View Order Bag</span>
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
