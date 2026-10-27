import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/cafeData';
import { PureVegMark } from './BrandMarks';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
  cartQtyMap: Record<string, number>;
}

const POPULAR_SEARCHES = [
  'Margherita',
  'Peri Peri',
  'Oreo Shake',
  'Paneer',
  'Veg Burger',
  'White Sauce',
  'Cold Coffee',
  'Waffle',
  'Mojito',
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  open,
  onClose,
  onAddToCart,
  cartQtyMap,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const filteredItems = query.trim()
    ? MENU_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 px-3 sm:px-4 transition-all duration-380 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible delay-250'
      }`}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-380"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[82vh] transform transition-all duration-380 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 -translate-y-3 opacity-0'
        }`}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-neutral-200 bg-white">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Maggi Pizza, Peri Peri Burger, Oreo Shake, Waffles..."
            className="flex-1 outline-none text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-neutral-400 hover:text-neutral-700 font-semibold px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white transition flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!query.trim() ? (
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                POPULAR SEARCHES
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-neutral-100 text-neutral-800 hover:bg-[#f5b014] hover:text-[#111111] rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Quick suggestions */}
              <div className="mt-6">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  TOP PICKS RIGHT NOW
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MENU_ITEMS.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:border-[#f5b014] hover:bg-neutral-50 transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs truncate text-neutral-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          ₹{item.price} • {item.badge || 'Chef Pick'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition cursor-pointer ${
                          cartQtyMap[item.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#f5b014] hover:bg-[#ffbe2e] text-[#111111]'
                        }`}
                        title="Add to cart"
                      >
                        {cartQtyMap[item.id] ? (
                          <span className="text-xs font-bold">{cartQtyMap[item.id]}</span>
                        ) : (
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-base font-bold text-neutral-800">
                No items found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for Pizza, Burger, Pasta, Shake, or Paneer!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-500 mb-2">
                Found {filteredItems.length} delicious item{filteredItems.length > 1 ? 's' : ''}
              </div>
              {filteredItems.map((item) => {
                const qty = cartQtyMap[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl border border-neutral-200 hover:border-[#f5b014] bg-white transition"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PureVegMark size="sm" />
                        <h4 className="font-bold text-sm text-neutral-900 truncate">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <div className="font-black text-sm text-neutral-900 mt-1">
                        ₹{item.price}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        qty > 0
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#f5b014] hover:bg-[#ffbe2e] text-[#111111]'
                      }`}
                    >
                      {qty > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Added ({qty})
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center text-xs text-neutral-500">
          <span>
            Press <kbd className="bg-white border border-neutral-300 px-1.5 py-0.5 rounded text-[11px] font-mono">ESC</kbd> to close
          </span>
          <span>100% Pure Vegetarian Cafe</span>
        </div>
      </div>
    </div>
  );
};
