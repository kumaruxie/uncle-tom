// Robust helper to resolve asset paths for GitHub Pages & subpaths
const rawBase = import.meta.env.BASE_URL || './';
const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';
export const getAssetUrl = (relativePath: string): string => {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return base + cleanPath;
};

export interface MenuItem {
  id: string;
  name: string;
  category: 'burgers' | 'pizzas' | 'pasta' | 'wraps' | 'waffles' | 'shakes' | 'sandwiches' | 'sides' | 'combos';
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  badge?: string;
  isPopularPick?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
}

export interface ComboDeal {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  savingsLabel: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
}

export const CAFE_INFO = {
  name: "Uncle Tom's Cafe",
  shortName: "Uncle Tom's",
  tagline: '100% PURE VEG • BIG FLAVOR',
  address: 'Shop No 2, Old Auto Market Road, Gandhi Nagar, Hansi, Haryana 125033',
  shortAddress: 'Shop No 2, Old Auto Market Rd, Gandhi Nagar, Hansi',
  phoneDisplay: '+91 92534 05846',
  phoneRaw: '919253405846',
  hours: 'Mon - Sun: 10:00 AM - 10:00 PM',
  rating: '4.1',
  reviewCount: '1,100+',
  priceForTwo: 'Pocket-Friendly Everyday Fast Food',
  dietary: '100% Pure Vegetarian',
  mapsUrl: 'https://share.google/cOgPLmHCO6sKn5uyi',
  zomatoUrl: 'https://www.zomato.com/hansi/uncle-toms-cafe-hansi-locality/order',
  swiggyUrl: 'https://www.swiggy.com/search?query=Uncle+Tom%27s+Cafe+Hansi',
};

export const COMBO_DEALS: ComboDeal[] = [
  {
    id: 'combo-paneer-makhani-free-pizza',
    tag: "TODAY'S #1 MEGA COMBO",
    title: 'Paneer Makhani Regular + Magic Onion Pizza FREE',
    subtitle: 'Spiced Paneer Makhani Pan Pizza + 1 Full Magic Onion Pizza Free!',
    price: 210,
    originalPrice: 340,
    savingsLabel: 'FREE PIZZA WORTH ₹130',
    image: getAssetUrl('images/special-pizza-combo.png'),
  },
  {
    id: 'combo-cold-coffee-b2g1',
    tag: 'BUY 2 GET 1 FREE',
    title: '2 Cold Coffees + 1 Cold Coffee FREE',
    subtitle: '3 Frosted Cafe-Style Creamy Cold Coffees blended fresh for your gang.',
    price: 239,
    originalPrice: 357,
    savingsLabel: 'BUY 2 GET 1 FREE',
    image: getAssetUrl('images/item-shake.jpg'),
  },
  {
    id: 'combo-paneer-onion-free-pizza',
    tag: 'PIZZA DUO SPECIAL',
    title: 'Paneer Onion Regular + Magic Onion Pizza FREE',
    subtitle: 'Loaded Paneer & Crisp Onion Regular Pizza + 1 Magic Onion Pizza Free!',
    price: 239,
    originalPrice: 369,
    savingsLabel: '2 PIZZAS @ ₹239',
    image: getAssetUrl('images/item-pizza.jpg'),
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // The 6 Iconic Homepage "POPULAR PICKS" matching image-1.png's 6-card grid
  {
    id: 'paneer-makhani-burger',
    name: 'Paneer Makhani Burger',
    category: 'burgers',
    price: 119,
    image: getAssetUrl('images/item-burger.jpg'),
    description: 'Crispy herb-crusted paneer patty, molten cheddar slice, rich makhani mayo, lettuce & tomato in a toasted sesame bun.',
    badge: 'Bestseller',
    isPopularPick: true,
    spiceLevel: 'Medium',
  },
  {
    id: 'paneer-makhani-pizza',
    name: 'Paneer Makhani Pizza',
    category: 'pizzas',
    price: 199,
    image: getAssetUrl('images/item-pizza.jpg'),
    description: 'Hand-tossed golden crust topped with smoky makhani sauce, marinated paneer cubes, crisp capsicum & 100% mozzarella.',
    badge: 'Hansi Favorite',
    isPopularPick: true,
    spiceLevel: 'Medium',
  },
  {
    id: 'white-sauce-pasta',
    name: 'White Sauce Pasta',
    category: 'pasta',
    price: 149,
    image: getAssetUrl('images/item-pasta.jpg'),
    description: 'Velvety cheesy Alfredo penne pasta tossed with sweet corn, black olives, bell peppers & Italian herbs, served with garlic bread.',
    badge: 'Most Reordered',
    isPopularPick: true,
    spiceLevel: 'Mild',
  },
  {
    id: 'bbq-cheese-fries',
    name: 'BBQ Cheese Fries',
    category: 'sides',
    price: 149,
    image: getAssetUrl('images/item-fries.jpg'),
    description: 'Hot & crispy golden French fries dusted with peri-peri seasoning and generously drizzled with smoky BBQ & warm cheese sauce.',
    isPopularPick: true,
    spiceLevel: 'Medium',
  },
  {
    id: 'paneer-thick-wrap',
    name: 'Paneer Thick Wrap',
    category: 'wraps',
    price: 149,
    image: getAssetUrl('images/item-wrap.jpg'),
    description: 'Char-grilled jumbo tortilla stuffed with tandoori paneer cubes, melted cheddar, crunchy veggies & smoky chipotle dressing.',
    badge: 'Chef Special',
    isPopularPick: true,
    spiceLevel: 'Medium',
  },
  {
    id: 'choco-cold-coffee-shake',
    name: 'Choco Cold Coffee Shake',
    category: 'shakes',
    price: 129,
    image: getAssetUrl('images/item-shake.jpg'),
    description: 'Signature thick cafe cold coffee blended with Belgian cocoa, vanilla ice cream, whipped cream swirl & choco wafer rolls.',
    isPopularPick: true,
    spiceLevel: 'Mild',
  },

  // Additional Authentic Uncle Tom's Cafe Pure-Veg Items across all categories
  {
    id: 'belgian-choco-waffle',
    name: 'Nutella Belgian Waffle',
    category: 'waffles',
    price: 139,
    image: getAssetUrl('images/item-waffle.jpg'),
    description: 'Freshly baked crispy golden waffle topped with vanilla bean ice cream, warm Nutella hazelnut fudge, choco chips & almonds.',
    badge: 'Must Try',
    spiceLevel: 'Mild',
  },
  {
    id: 'grilled-paneer-tikka-sandwich',
    name: 'Grilled Paneer Tikka Sandwich',
    category: 'sandwiches',
    price: 129,
    image: getAssetUrl('images/item-sandwich.jpg'),
    description: 'Triple-layer butter-grilled jumbo bread loaded with spiced paneer tikka, sweet corn, capsicum, mint chutney & oozing cheese.',
    badge: 'Popular',
    spiceLevel: 'Medium',
  },
  {
    id: 'aloo-tikki-burger',
    name: 'Classic Aloo Tikki Burger',
    category: 'burgers',
    price: 69,
    image: getAssetUrl('images/item-burger.jpg'),
    description: 'Pocket-friendly crispy spiced potato-pea tikki, tangy cafe sauce, fresh onion rings & tomato in a soft toasted bun.',
    badge: 'Value Pick',
    spiceLevel: 'Medium',
  },
  {
    id: 'paneer-maharaja-burger',
    name: 'Paneer Maharaja Double Burger',
    category: 'burgers',
    price: 149,
    image: getAssetUrl('images/item-burger.jpg'),
    description: 'Towering double-decker burger with crispy paneer + veg patty, double cheddar cheese, jalapenos, lettuce & secret sauce.',
    spiceLevel: 'Spicy',
  },
  {
    id: 'magic-onion-pizza',
    name: 'Magic Caramelized Onion Pizza',
    category: 'pizzas',
    price: 139,
    image: getAssetUrl('images/item-pizza.jpg'),
    description: 'Crispy pan crust with signature tangy tomato herb base, sweet & savory magic onions and gooey mozzarella cheese.',
    spiceLevel: 'Mild',
  },
  {
    id: 'tandoori-paneer-pizza',
    name: 'Tandoori Paneer Onion Pizza',
    category: 'pizzas',
    price: 209,
    image: getAssetUrl('images/item-pizza.jpg'),
    description: 'Smoky tandoori marinated paneer, crunchy red onions, green capsicum, chili flakes & extra mozzarella pull.',
    spiceLevel: 'Spicy',
  },
  {
    id: 'uncle-toms-makhani-pasta',
    name: "Uncle Tom's Makhani Pasta",
    category: 'pasta',
    price: 159,
    image: getAssetUrl('images/item-pasta.jpg'),
    description: 'Fusion penne pasta simmered in creamy buttery makhani & cheese sauce with sweet corn, bell peppers & garlic bread.',
    badge: 'House Signature',
    spiceLevel: 'Medium',
  },
  {
    id: 'grilled-cheese-corn-sandwich',
    name: 'Grilled Cheese Corn Sandwich',
    category: 'sandwiches',
    price: 109,
    image: getAssetUrl('images/item-sandwich.jpg'),
    description: 'Golden crisp grilled bread stuffed with creamy sweet corn, diced bell peppers, oregano seasoning & molten mozzarella.',
    spiceLevel: 'Mild',
  },
  {
    id: 'cheesy-blast-wrap',
    name: 'Cheesy Blast Masala Wrap',
    category: 'wraps',
    price: 139,
    image: getAssetUrl('images/item-wrap.jpg'),
    description: 'Warm grilled tortilla packed with crispy veg strips, liquid cheese burst, crunchy lettuce, onions & peri-peri mayo.',
    spiceLevel: 'Medium',
  },
  {
    id: 'choco-overload-waffle',
    name: 'Triple Chocolate Overload Waffle',
    category: 'waffles',
    price: 149,
    image: getAssetUrl('images/item-waffle.jpg'),
    description: 'Dark, milk & white chocolate drizzle over warm crisp Belgian waffle squares with choco chips.',
    spiceLevel: 'Mild',
  },
  {
    id: 'oreo-nutella-shake',
    name: 'Oreo & Nutella Thick Shake',
    category: 'shakes',
    price: 139,
    image: getAssetUrl('images/item-shake.jpg'),
    description: 'Ultra-thick milkshake blended with crunchy Oreo cookies, rich Nutella, vanilla ice cream & chocolate fudge swirl.',
    badge: 'Fan Favorite',
    spiceLevel: 'Mild',
  },
  {
    id: 'green-apple-mojito',
    name: 'Sparkling Green Apple Mojito',
    category: 'shakes',
    price: 99,
    image: getAssetUrl('images/item-mojito.jpg'),
    description: 'Refreshing chilled mocktail muddled with fresh mint leaves, tangy lime wedges, green apple syrup & sparkling fizz.',
    spiceLevel: 'Mild',
  },
  // Make the 3 Special Combos also directly orderable as MenuItems
  {
    id: 'combo-paneer-makhani-free-pizza',
    name: 'Combo: Paneer Makhani Reg + Magic Onion Pizza FREE',
    category: 'combos',
    price: 210,
    originalPrice: 340,
    image: getAssetUrl('images/special-pizza-combo.png'),
    description: '1 Regular Paneer Makhani Pizza + 1 Regular Magic Onion Pizza absolutely FREE! 100% Pure Vegetarian.',
    badge: 'Save ₹130',
    spiceLevel: 'Medium',
  },
  {
    id: 'combo-cold-coffee-b2g1',
    name: 'Combo: 2 Cold Coffees + 1 Cold Coffee FREE',
    category: 'combos',
    price: 239,
    originalPrice: 357,
    image: getAssetUrl('images/item-shake.jpg'),
    description: 'Buy 2 Signature Creamy Cold Coffees and get 1 Cold Coffee FREE! Chilled, thick & frothy.',
    badge: 'Buy 2 Get 1',
    spiceLevel: 'Mild',
  },
  {
    id: 'combo-paneer-onion-free-pizza',
    name: 'Combo: Paneer Onion Reg + Magic Onion Pizza FREE',
    category: 'combos',
    price: 239,
    originalPrice: 369,
    image: getAssetUrl('images/item-pizza.jpg'),
    description: '1 Regular Paneer Onion Pizza + 1 Regular Magic Onion Pizza FREE! Ideal for sharing.',
    badge: 'Save ₹130',
    spiceLevel: 'Medium',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Prashant Bhalla',
    role: 'Hansi Local Guide',
    rating: 5,
    quote:
      'White Sauce Pasta is something I order again and again! Not too oily, perfect blend of taste and freshness, cozy interior, and super pocket-friendly.',
    avatar: getAssetUrl('images/avatar-1.jpg'),
  },
  {
    id: 'rev-2',
    name: 'Neha Sharma',
    role: 'Regular Dine-In Guest',
    rating: 5,
    quote:
      "Best 100% pure veg cafe in Hansi! Their Paneer Makhani Pizza + Magic Onion Pizza Free deal at ₹210 and thick shakes are unbeatable in town.",
    avatar: getAssetUrl('images/avatar-2.jpg'),
  },
  {
    id: 'rev-3',
    name: 'Rohit Garg',
    role: 'Foodie, Gandhi Nagar',
    rating: 5,
    quote:
      'Love the clean open kitchen and family-friendly seating on Old Auto Market Road. Crispy Belgian waffles, Paneer Thick Wrap & NFC tap payments make every visit effortless!',
    avatar: getAssetUrl('images/avatar-3.jpg'),
  },
  {
    id: 'rev-4',
    name: 'Simran Kaur',
    role: 'Zomato Verified Diner',
    rating: 5,
    quote:
      'Ordered the 2 Cold Coffees + 1 Free combo for ₹239 along with BBQ Cheese Fries — arrived chilled, frothy, and delicious within 20 minutes!',
    avatar: getAssetUrl('images/avatar-4.jpg'),
  },
  {
    id: 'rev-5',
    name: 'Anjali Verma',
    role: 'Weekend Visitor',
    rating: 4,
    quote:
      'Such a warm Good Food Good Mood vibe! Great spot for family outings in Hansi where two people can feast happily at pocket-friendly prices.',
    avatar: getAssetUrl('images/avatar-5.jpg'),
  },
  {
    id: 'rev-6',
    name: 'Aman Bishnoi',
    role: 'College Student, Hansi',
    rating: 5,
    quote:
      'Green Apple Mojito, Grilled Paneer Tikka Sandwich, and Aloo Tikki Burger are my go-to evening snacks. Super friendly staff and fast service!',
    avatar: getAssetUrl('images/avatar-6.jpg'),
  },
];
