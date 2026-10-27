import React from 'react';

export const PureVegMark: React.FC<{ size?: 'sm' | 'md'; showLabel?: boolean; dark?: boolean }> = ({
  size = 'sm',
  showLabel = false,
  dark = false,
}) => {
  const box = size === 'sm' ? 'w-4 h-4 p-[2px]' : 'w-5 h-5 p-[2.5px]';
  const dot = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <span className="inline-flex items-center gap-1.5 select-none" title="100% Pure Vegetarian">
      <span
        className={`${box} inline-flex items-center justify-center rounded-[3px] border-[1.6px] border-[#16a34a] bg-white shrink-0`}
      >
        <span className={`${dot} rounded-full bg-[#16a34a]`} />
      </span>
      {showLabel && (
        <span
          className={`text-[11px] font-bold tracking-wider uppercase ${
            dark ? 'text-emerald-400' : 'text-[#15803d]'
          }`}
        >
          100% Pure Veg
        </span>
      )}
    </span>
  );
};

export const UncleTomsLogo: React.FC<{ compact?: boolean; dark?: boolean }> = ({
  compact = false,
  dark = true,
}) => {
  return (
    <div className="inline-flex items-center gap-2 group select-none cursor-pointer">
      {/* Crisp Orange Line-Art Burger Crest */}
      <svg
        viewBox="0 0 52 52"
        fill="none"
        className={`${compact ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'} shrink-0 transition-transform duration-300 group-hover:scale-105`}
        aria-hidden="true"
      >
        {/* Top Sesame Bun */}
        <path
          d="M8 23C8 14.2 15.8 8.5 26 8.5C36.2 8.5 44 14.2 44 23H8Z"
          stroke="#f58220"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <ellipse cx="20" cy="15.5" rx="1.5" ry="1" transform="rotate(-15 20 15.5)" fill="#fbbf24" />
        <ellipse cx="26" cy="13.8" rx="1.5" ry="1" fill="#fbbf24" />
        <ellipse cx="32" cy="15.5" rx="1.5" ry="1" transform="rotate(15 32 15.5)" fill="#fbbf24" />
        <ellipse cx="25.5" cy="18.5" rx="1.4" ry="0.9" fill="#fbbf24" />
        {/* Wavy Fresh Lettuce */}
        <path
          d="M6.5 27.5C9.5 25.5 12.5 29.5 15.5 27.5C18.5 25.5 21.5 29.5 24.5 27.5C27.5 25.5 30.5 29.5 33.5 27.5C36.5 25.5 39.5 29.5 42.5 27.5C44 26.5 45 27 45.8 27.5"
          stroke="#22c55e"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        {/* Crispy Paneer Patty & Melted Cheese */}
        <rect x="8.5" y="31.5" width="35" height="5" rx="2.5" stroke="#f58220" strokeWidth="2.3" />
        <path d="M16 31.5L20 35L24 31.5" fill="#fbbf24" />
        {/* Bottom Toasted Bun */}
        <path
          d="M9.5 40H42.5C42.5 43.5 39.5 45.5 35.5 45.5H16.5C12.5 45.5 9.5 43.5 9.5 40Z"
          stroke="#f58220"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>

      <div className="leading-none">
        <div className="flex items-baseline gap-1">
          <span
            className={`${
              compact ? 'text-[17px] sm:text-[19px]' : 'text-[18px] sm:text-[21px]'
            } font-black tracking-tight ${dark ? 'text-white' : 'text-neutral-900'}`}
          >
            Uncle Tom&apos;s
          </span>
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-wider text-[#f5b014]">
            Cafe
          </span>
        </div>
      </div>
    </div>
  );
};

export const HeroQualityStamp: React.FC = () => {
  return (
    <div
      className="animate-badge-float w-[112px] h-[112px] sm:w-[130px] sm:h-[130px] rounded-full border-2 border-white/80 bg-[#0d0b09]/85 backdrop-blur-sm p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.75)] flex items-center justify-center select-none"
      aria-label="100% Pure Veg Quality Guaranteed"
    >
      <div className="w-full h-full rounded-full border border-dashed border-[#f5b014]/80 flex flex-col items-center justify-center text-center px-2">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-white uppercase">
          PURE VEG
        </span>
        <span className="font-display text-[30px] sm:text-[36px] font-black leading-none text-[#f5b014] my-0.5">
          100%
        </span>
        <span className="text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.2em] text-white uppercase">
          QUALITY
        </span>
      </div>
    </div>
  );
};

export const FooterSpeedCrest: React.FC = () => {
  return (
    <div className="inline-flex flex-col items-center justify-center select-none">
      <svg viewBox="0 0 150 110" className="w-36 h-28" fill="none" aria-hidden="true">
        {/* Top curved label */}
        <path id="topArc" d="M 24 62 A 51 51 0 0 1 126 62" fill="none" />
        <text fill="#f5b014" fontSize="10.5" fontWeight="800" letterSpacing="2.2">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            • PURE VEG CAFE •
          </textPath>
        </text>
        {/* Outer Speedometer Arc */}
        <path
          d="M 28 74 A 48 48 0 0 1 122 74"
          stroke="#ef6217"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 35 72 A 40 40 0 0 1 115 72"
          stroke="#f5b014"
          strokeWidth="1.4"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        {/* Gauge Needle */}
        <line x1="75" y1="72" x2="104" y2="47" stroke="#f5b014" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="75" cy="72" r="5" fill="#ef6217" stroke="#f5b014" strokeWidth="2" />
        {/* Rating pill */}
        <text x="75" y="92" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="800" letterSpacing="1.6">
          4.1★ HANSI FAVORITE
        </text>
        <text x="75" y="105" textAnchor="middle" fill="#a3a3a3" fontSize="8.5" fontWeight="600" letterSpacing="1.5">
          OPEN KITCHEN • FRESH
        </text>
      </svg>
    </div>
  );
};

export const NewsletterFriesArt: React.FC = () => {
  return (
    <svg
      viewBox="0 0 150 130"
      className="w-28 sm:w-32 h-auto drop-shadow-[0_10px_14px_rgba(0,0,0,0.22)] select-none"
      fill="none"
      aria-hidden="true"
    >
      {/* Golden Fries Sticks */}
      <rect x="34" y="24" width="12" height="58" rx="3" transform="rotate(-12 34 24)" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="48" y="12" width="12" height="65" rx="3" transform="rotate(-5 48 12)" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="63" y="8" width="13" height="68" rx="3" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="78" y="11" width="12" height="66" rx="3" transform="rotate(4 78 11)" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />
      <rect x="92" y="18" width="12" height="62" rx="3" transform="rotate(10 92 18)" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
      <rect x="56" y="18" width="12" height="58" rx="3" transform="rotate(-2 56 18)" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
      <rect x="71" y="16" width="12" height="58" rx="3" transform="rotate(3 71 16)" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
      <rect x="103" y="28" width="11" height="52" rx="3" transform="rotate(16 103 28)" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
      {/* Iconic Red Fries Cup */}
      <path
        d="M30 56C48 64 102 64 120 56L110 126H40L30 56Z"
        fill="#dc2626"
        stroke="#991b1b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M40 76C58 83 92 83 110 76" stroke="#f5b014" strokeWidth="3" strokeLinecap="round" />
      <text x="75" y="102" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" letterSpacing="1.2">
        UNCLE TOM&apos;S
      </text>
      <text x="75" y="114" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="800" letterSpacing="1.5">
        CRISPY FRIES
      </text>
    </svg>
  );
};
