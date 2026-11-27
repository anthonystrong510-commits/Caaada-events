import { BoothTier, FestivalDay, MarketCategory, ScheduleEvent, VendorSpotlight } from '../types';
import vendorBotanicalImg from '../assets/images/vendor_botanical_booth_1787757236889.jpg';
import vendorFoodTruckImg from '../assets/images/vendor_food_truck_1787757253971.jpg';
import vendorJewelryImg from '../assets/images/vendor_jewelry_tent_1787757268227.jpg';
import vendorWoodcraftImg from '../assets/images/vendor_woodcraft_booth_1787757283784.jpg';
import heroPromenadeImg from '../assets/images/hero_festival_promenade_1795729714560.jpg';
import liveStageImg from '../assets/images/festival_live_stage_1795729714383.jpg';
import artisanCraftsImg from '../assets/images/festival_artisan_crafts_1795729714183.jpg';
import expoBannerImg from '../assets/images/vendor_expo_banner_1787739027600.jpg';

/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH EVENT CONFIGURATION
 * ============================================================================
 * Edit this central configuration object to update the festival name, venue,
 * location, dates, and contact details for any future event in one single place.
 */
export interface EventConfig {
  // General Event Identity
  name: string;
  shortName: string;
  heroHeadline: string;
  edition: string;
  tagline: string;
  description: string;

  // Venue & Location (General, reusable across events)
  venueName: string;
  venueArea: string;
  address: string;
  cityState: string;
  fullLocation: string;
  mapQuery: string;

  // Badges & Quick Info
  datesSummary: string;
  durationBadge: string;
  admissionBadge: string;
  locationBadge: string;

  // Contact & Registration
  contactEmail: string;
  freeAdmission: boolean;
}

export const EVENT_CONFIG: EventConfig = {
  name: 'Community Artisan Marketplace & Festival',
  shortName: 'Community Festival & Expo',
  heroHeadline: 'Community Artisan & Food Festival',
  edition: 'Annual Outdoor Gathering & Marketplace',
  tagline: 'Celebrating Local Makers, Culinary Artisans, Music & Community',
  description: 'A vibrant outdoor community celebration bringing together small businesses, artisans, farmers, gourmet food trucks, and live entertainment for the whole family.',
  
  venueName: 'Festival Grounds & Marketplace Park',
  venueArea: 'Marketplace Grounds',
  address: 'Festival Grounds & Event Promenade',
  cityState: 'Outdoor Event Plaza',
  fullLocation: 'Outdoor Festival Park & Marketplace Grounds',
  mapQuery: 'Festival Park',

  datesSummary: 'Friday – Sunday · 9:00 AM – 7:00 PM Daily',
  durationBadge: 'Fri – Sun · 9 AM – 7 PM',
  admissionBadge: 'Free Public Admission',
  locationBadge: 'Marketplace Grounds',

  contactEmail: 'organizers@festivalmarket.org',
  freeAdmission: true,
};

// Backwards-compatible aliases pointing directly to EVENT_CONFIG
export const FESTIVAL_NAME = EVENT_CONFIG.name;
export const FESTIVAL_LOCATION = EVENT_CONFIG.fullLocation;
export const FESTIVAL_CONTACT_EMAIL = EVENT_CONFIG.contactEmail;

export const FESTIVAL_DAYS: FestivalDay[] = [
  {
    id: 'fri',
    dayName: 'Friday',
    shortDay: 'Fri',
    dateStr: 'Friday Session',
    hours: '9:00 AM – 7:00 PM',
    setupTime: 'Morning Load-In & Check-In (7:30 AM – 8:45 AM)',
    title: 'Friday Opening & Twilight Showcase',
    highlights: ['Morning Load-In Window', '9:00 AM Opening Bell', 'Acoustic Music Sessions', 'Gourmet Food Truck Gathering'],
    breakdownNotice: 'Booths remain open until 7:00 PM closing. Load-out or overnight secure staging follows.',
  },
  {
    id: 'sat',
    dayName: 'Saturday',
    shortDay: 'Sat',
    dateStr: 'Saturday Session',
    hours: '9:00 AM – 7:00 PM',
    setupTime: 'Morning Restock & Check-In (7:30 AM – 8:45 AM)',
    title: 'Saturday Festival & Arts Expo',
    highlights: ['Full-Day Foot Traffic', 'Live Mainstage Music', 'Family & Kids Creative Zone', 'Artisan Demonstrations'],
    breakdownNotice: 'Booths remain open until 7:00 PM closing. Breakdown begins after patron egress.',
  },
  {
    id: 'sun',
    dayName: 'Sunday',
    shortDay: 'Sun',
    dateStr: 'Sunday Session',
    hours: '9:00 AM – 7:00 PM',
    setupTime: 'Morning Restock & Check-In (7:30 AM – 8:45 AM)',
    title: 'Sunday Makers Market & Finale',
    highlights: ['Farmers & Makers Showcase', 'Gourmet Food Carts', 'Community Honors', 'Grand Finale Performances'],
    breakdownNotice: 'Final festival breakdown begins after the 7:00 PM closing celebration.',
  },
];

export const BOOTH_TIERS: BoothTier[] = [
  {
    id: 'tent-10x10',
    name: 'Standard 10×10 Space',
    category: 'BOOTH',
    pricePerDay: 70,
    dimensions: '10ft × 10ft (100 sq ft)',
    tagline: 'Ideal for handmade artisans, jewelers & boutique craft makers',
    description: 'Our most popular vendor option located in the lively Artisan Village section with steady lakefront foot traffic.',
    popular: true,
    bestFor: 'Handmade crafts, jewelry, apparel, candles, art prints, specialty gifts',
    included: [
      '1 Sturdy 6ft Folding Table',
      '2 Comfortable Event Chairs',
      'Designated morning load-in window with drive-up access',
      'Free overnight security on multi-day reservations',
      'Listing in official festival directory & visitor guide',
      'Access to park recycling & waste management stations',
    ],
    capacityNote: 'Accommodates up to 3 staff comfortably with 10x10 canopy tent.',
    badge: 'Artisan Choice',
    zone: 'Artisan Village & Makers Promenade',
  },
  {
    id: 'tent-10x20',
    name: 'Double 10×20 Space',
    category: 'BOOTH',
    pricePerDay: 100,
    dimensions: '10ft × 20ft (200 sq ft)',
    tagline: 'Double the frontage and merchandising capacity for growing brands',
    description: 'Expanded dual-width booth ideal for extensive inventories, fashion racks, interactive demos, or larger displays.',
    bestFor: 'Boutiques, furniture, large artwork, multi-product brands, wellness hubs',
    included: [
      '1 Sturdy Table + 2 Chairs (Option to request 2nd table)',
      '20ft of high-visibility frontage',
      'Designated morning load-in window',
      'Free overnight security for multi-day reservations',
      'Social media spotlight consideration',
      'Dedicated waste & recycling access',
    ],
    capacityNote: 'Wide 20ft customer walk-up perimeter for high transaction volume.',
    zone: 'Central Marketplace Boulevard',
  },
  {
    id: 'corner-10x10',
    name: 'Corner / Main Street Booth',
    category: 'BOOTH',
    pricePerDay: 180,
    dimensions: '10ft × 10ft (Corner Placement)',
    tagline: 'Dual open sides at high-traffic intersections & Main Street',
    description: 'Premium corner positioning with 2 open walkway sides ensuring maximum exposure, visibility, and visitor foot-traffic.',
    featured: true,
    bestFor: 'High-volume retailers, marquee artisans, impulse merchandise, live demos',
    included: [
      'Dual walkway frontage (2 open sides)',
      '1 Table & 2 Chairs included with registration',
      'Prime Main Street / intersection placement',
      'Designated morning load-in window',
      'Free multi-day overnight security',
      'Guaranteed Festival Directory Feature',
    ],
    capacityNote: '360° visibility corner lot located at core pedestrian crossings.',
    badge: 'High Foot-Traffic',
    zone: 'Main Street & Central Plaza Corner',
  },
  {
    id: 'extra-large-20x20',
    name: 'Extra Large Pavilion Space',
    category: 'BOOTH',
    pricePerDay: 180,
    dimensions: '20ft × 20ft (400 sq ft)',
    tagline: 'Expansive flagship pavilion for immersive retail and experiential exhibits',
    description: 'Massive 400 square-foot designated footprint designed for major sponsors, interactive experiences, large setups, and brand showcases.',
    bestFor: 'Home services, experiential lounges, large merchandise setups, fitness activations',
    included: [
      'Huge 400 sq ft perimeter',
      'Table & 2 Chairs included (extras available upon request)',
      'Priority load-in and positioning assistance',
      'Overnight security provided on consecutive days',
      'Dedicated space for interactive demos & queuing',
      'Prominent festival signage & directory feature',
    ],
    capacityNote: 'Grand 20x20 footprint accommodating walk-in tent setups.',
    badge: 'Maximum Space',
    zone: 'Expo Pavilion & Event Lawn',
  },
  {
    id: 'food-truck',
    name: 'Gourmet Food Truck Space',
    category: 'FOOD',
    pricePerDay: 190,
    dimensions: 'Dedicated Food Truck / Trailer Bay',
    tagline: 'Prime spot in the bustling Food Truck Row along the festival promenade',
    description: 'Designated vehicular bay with waste management and excellent patron queuing space along the festival dining lawn.',
    featured: true,
    bestFor: 'Food trucks, mobile kitchens, BBQ smokers, wood-fired pizza trailers, dessert trucks',
    included: [
      'Dedicated Food Truck parking bay with patron queuing zone',
      'Designated staging, prep & positioning load-in slot',
      'Trash receptacle & grease/greywater guidance stations',
      'Free overnight security on multi-day reservations',
      'Heavy promotion in festival dining guides',
      'Health department inspection assistance',
    ],
    capacityNote: 'Must hold valid local food handlers permits and temperature compliance.',
    badge: 'Food & Dining',
    zone: 'Dining Promenade & Food Truck Row',
  },
];

export const MARKET_CATEGORIES: MarketCategory[] = [
  {
    id: 'crafts-art',
    name: 'Handmade Crafts & Fine Art',
    description: 'Original canvas paintings, wheel-thrown ceramic pottery, custom woodworking, stained glass, sculpture, and handmade heritage pieces.',
    items: ['Ceramics & Stoneware Pottery', 'Fine Art Canvas & Woodblock Prints', 'Live-Edge Woodcraft', 'Glassblowing & Fiber Sculptures'],
    image: artisanCraftsImg,
    iconName: 'Palette',
    vendorCountEstimate: '35+ Artisans',
  },
  {
    id: 'jewelry-gemstones',
    name: 'Jewelry & Metalsmithing',
    description: 'Hand-forged sterling silver, wire-wrapped raw gemstones, artisan sea glass pendants, beadwork, and custom bridal accessories.',
    items: ['Sterling Silver & 14k Gold', 'Raw Crystals & Gemstone Rings', 'Sea Glass Pendants & Cuffs', 'Minimalist Everyday Jewelry'],
    image: vendorJewelryImg,
    iconName: 'Tag',
    vendorCountEstimate: '25+ Jewelers',
  },
  {
    id: 'food-trucks',
    name: 'Gourmet Food Trucks & Street Food',
    description: 'Regional favorites including artisan seafood cakes, hickory smoked BBQ, authentic street tacos, gourmet smash burgers, and wood-fired pizza.',
    items: ['Hickory Wood-Smoked BBQ', 'Artisan Wood-Fired Pizza', 'Baja Fish & Birria Tacos', 'Handcrafted Sliders & Fries'],
    image: vendorFoodTruckImg,
    iconName: 'UtensilsCrossed',
    vendorCountEstimate: '18+ Food Trucks',
  },
  {
    id: 'bakery-sweets',
    name: 'Artisan Bakery & Sweet Confections',
    description: 'Fresh sourdough loaves, French macarons, small-batch cookies, hand-dipped chocolates, gourmet churros, and fruit pies.',
    items: ['Sourdough & Artisan Breads', 'French Macarons & Eclairs', 'Small-Batch Gourmet Fudge', 'Hand-Crafted Ice Cream Carts'],
    image: artisanCraftsImg,
    iconName: 'Coffee',
    vendorCountEstimate: '15+ Bakers',
  },
  {
    id: 'farm-produce',
    name: 'Fresh Farm Produce & Organics',
    description: 'Locally grown organic vegetables, crisp orchard fruits, wildflower honey, artisanal hot sauces, fruit jams, and cold-pressed olive oils.',
    items: ['Raw Wildflower Honey & Pollen', 'Local Orchard Apples & Berries', 'Small-Batch Hot Sauces & Pickles', 'Farm Fresh Herb Bundles'],
    image: heroPromenadeImg,
    iconName: 'Leaf',
    vendorCountEstimate: '16+ Farms & Growers',
  },
  {
    id: 'plants-botanicals',
    name: 'Botanicals, Succulents & Plants',
    description: 'Vibrant indoor houseplants, rare tropicals, air plants, handcrafted macramé hangers, ceramic bonsai pots, and fresh cut florals.',
    items: ['Rare Monstera & Tropicals', 'Lakeside Succulent Terrariums', 'Hand-tied Fresh Flower Bouquets', 'Macramé Plant Hangers'],
    image: vendorBotanicalImg,
    iconName: 'TreePine',
    vendorCountEstimate: '12+ Plant Shops',
  },
  {
    id: 'home-living',
    name: 'Home Décor & Soy Candles',
    description: 'Hand-poured clean burning soy candles, natural linen sprays, reclaimed wooden serving platters, kitchen pottery, and woven textiles.',
    items: ['Botanical Soy & Beeswax Candles', 'Reclaimed Wood Cutting Boards', 'Hand-Woven Throw Blankets', 'Aromatherapy Room Diffusers'],
    image: vendorWoodcraftImg,
    iconName: 'Home',
    vendorCountEstimate: '20+ Studios',
  },
  {
    id: 'wellness-beauty',
    name: 'Clean Beauty & Herbal Wellness',
    description: 'Small-batch organic goat milk soaps, whipped shea body butters, herbal tea infusions, natural bath soaks, and soothing beard oils.',
    items: ['Cold-Pressed Herbal Soaps', 'Organic Body Oils & Balms', 'Loose-Leaf Artisan Teas', 'Mineral Clay Face Masks'],
    image: vendorBotanicalImg,
    iconName: 'Heart',
    vendorCountEstimate: '14+ Apothecaries',
  },
  {
    id: 'vintage-fashion',
    name: 'Vintage & Boutique Apparel',
    description: 'Curated 70s–90s vintage clothing, upcycled denim jackets, handmade leather totes, silk scarves, and sustainable slow-fashion pieces.',
    items: ['Curated Vintage Denim & Coats', 'Handcrafted Full-Grain Leather Bags', 'Silk Screen Printed Tees', 'Boho Kimonos & Hats'],
    image: expoBannerImg,
    iconName: 'ShoppingBag',
    vendorCountEstimate: '18+ Boutiques',
  },
  {
    id: 'live-arts',
    name: 'Live Artists & Craft Demos',
    description: 'Live watercolor portrait painting, on-site pottery turning demonstrations, calligraphy engraving, and interactive caricature drawings.',
    items: ['Custom Live Pet & Family Portraits', 'Live Wheel-Throwing Demos', 'Custom Calligraphy Engraving', 'Speed Charcoal Sketching'],
    image: liveStageImg,
    iconName: 'Camera',
    vendorCountEstimate: '10+ Live Creators',
  },
  {
    id: 'pet-boutique',
    name: 'Pet Treats & Accessories',
    description: 'Human-grade baked dog treats, hand-sewn pet bandanas, waterproof rope leashes, catnip toys, and organic grooming paw balms.',
    items: ['Grain-Free Baked Dog Biscuits', 'Custom Name Embroidered Bandanas', 'Climbing Rope Leashes', 'Organic Paw & Snout Balms'],
    image: heroPromenadeImg,
    iconName: 'Smile',
    vendorCountEstimate: '10+ Pet Brands',
  },
  {
    id: 'community-services',
    name: 'Community & Cultural Nonprofits',
    description: 'Local environmental conservation groups, civic youth programs, regional cultural associations, and neighborhood organizations.',
    items: ['Waterfront Conservation Projects', 'Youth Arts & STEM Programs', 'Community Garden Cooperatives', 'Cultural Heritage Displays'],
    image: expoBannerImg,
    iconName: 'Users',
    vendorCountEstimate: '12+ Organizations',
  },
];

export const ATTENDEE_EXPERIENCES = [
  {
    id: 'exp-1',
    title: 'Scenic Promenade Stroll & Shopping',
    tagline: 'Marketplace Promenade & Artisan Village',
    description: 'Take a relaxed stroll along the paved open-air promenade. Meet over 100 passionate makers, touch handmade crafts, and discover unique one-of-a-kind treasures under the open sky.',
    image: heroPromenadeImg,
    perk: 'Over 100 artisan booths along the paved promenade',
  },
  {
    id: 'exp-2',
    title: 'Food Truck Alley & Outdoor Dining',
    tagline: 'Lawn Picnics & Street Flavors',
    description: 'From sizzling street gourmet dishes and smoked hickory BBQ to artisanal ice cream and wood-fired pizza, savor delicious foods with ample picnic seating and open green lawns.',
    image: vendorFoodTruckImg,
    perk: '18+ Gourmet trucks & dessert carts with open lawn seating',
  },
  {
    id: 'exp-3',
    title: 'Live Acoustic & Jazz Performances',
    tagline: 'Open-Air Amphitheater Stage',
    description: 'Settle in on the lawn and enjoy free acoustic sets, soulful jazz ensembles, and vibrant cultural performances throughout Friday, Saturday, and Sunday (9:00 AM – 7:00 PM daily).',
    image: liveStageImg,
    perk: 'Continuous free live music in the outdoor amphitheater',
  },
  {
    id: 'exp-4',
    title: 'Hands-On Maker Demos & Live Art',
    tagline: 'Watch Master Craftsmen at Work',
    description: 'Witness potters shaping stoneware on the wheel, jewelers wire-wrapping gemstones, and painters capturing outdoor landscapes in real time. Great for all ages.',
    image: artisanCraftsImg,
    perk: 'Interactive pottery wheel and portrait painting stations',
  },
  {
    id: 'exp-5',
    title: 'Handcrafted Jewelry & Metalsmithing',
    tagline: 'Independent Designers & Makers',
    description: 'Browse curated studio booths featuring hand-forged sterling silver, raw gemstone settings, botanical apothecaries, and heirloom woodcraft made directly by attending artists.',
    image: vendorJewelryImg,
    perk: 'Direct-from-maker studio pieces and custom fittings',
  },
  {
    id: 'exp-6',
    title: 'Botanical & Dog-Friendly Grounds',
    tagline: 'Bring Your Leashed Four-Legged Friends',
    description: 'The outdoor festival grounds are fully pet-friendly. Enjoy designated hydration stations, artisan plant booths, dog treat samplers, and spacious grassy paths.',
    image: vendorBotanicalImg,
    perk: 'Free dog water stations & botanical courtyard booths',
  },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  // Friday Program (9:00 AM – 7:00 PM)
  {
    id: 'sch-1',
    day: 'fri',
    time: '7:30 AM – 8:45 AM',
    title: 'Vendor Check-in & Morning Setup Window',
    location: 'Assigned Zones & Promenade',
    description: 'Registered vendors have dedicated morning access prior to 9:00 AM opening to check in, receive table & chairs, load in, and stage displays without rush.',
    type: 'market',
  },
  {
    id: 'sch-2',
    day: 'fri',
    time: '9:00 AM',
    title: 'Festival Opening Bell & Public Gates Open',
    location: 'Main Stage & Promenade Gate',
    description: 'The outdoor marketplace opens to the public at 9:00 AM with welcoming music, fresh aromas, and early-bird artisan shopping.',
    type: 'entertainment',
  },
  {
    id: 'sch-3',
    day: 'fri',
    time: '12:00 PM – 2:30 PM',
    title: 'Acoustic Guitar & Folk Duo',
    location: 'Amphitheater Stage',
    description: 'Enjoy calming acoustic melodies as you stroll the artisan promenade.',
    type: 'entertainment',
  },
  {
    id: 'sch-4',
    day: 'fri',
    time: '3:30 PM – 5:15 PM',
    title: 'Afternoon Food Truck Social & Makers Showcase',
    location: 'Food Truck Row & Lawn',
    description: 'Sample gourmet street plates and sweet treats alongside live craft booth demonstrations.',
    type: 'food',
  },
  {
    id: 'sch-4b',
    day: 'fri',
    time: '5:30 PM – 7:00 PM',
    title: 'Evening Concert & Twilight Social Hour',
    location: 'Central Pavilion & Promenade',
    description: 'Live evening acoustic sets with twilight food truck dining and shopping through the 7:00 PM close.',
    type: 'entertainment',
  },

  // Saturday Program (9:00 AM – 7:00 PM)
  {
    id: 'sch-5',
    day: 'sat',
    time: '7:30 AM – 8:45 AM',
    title: 'Morning Restock & Vendor Coffee Refresh',
    location: 'Vendor Marketplace Grounds',
    description: 'Morning preparation for vendors before 9:00 AM gates open. Overnight secure staging remains active.',
    type: 'market',
  },
  {
    id: 'sch-6',
    day: 'sat',
    time: '9:00 AM',
    title: 'Saturday Festival & Marketplace Gates Open',
    location: 'All Grounds & Pavilions',
    description: 'All booths, gourmet food trucks, and interactive family activities open at 9:00 AM.',
    type: 'market',
  },
  {
    id: 'sch-7',
    day: 'sat',
    time: '11:30 AM – 1:30 PM',
    title: 'Live Potter Wheel & Glass Crafts Demos',
    location: 'Makers Pavilion',
    description: 'Watch master craftsmen demonstrate handmade ceramic turning and intricate wire jewelry.',
    type: 'workshop',
  },
  {
    id: 'sch-8',
    day: 'sat',
    time: '2:00 PM – 4:00 PM',
    title: 'Live R&B, Jazz & Community Ensemble Band',
    location: 'Main Stage',
    description: 'Dynamic upbeat live musical performances for the whole family.',
    type: 'entertainment',
  },
  {
    id: 'sch-9',
    day: 'sat',
    time: '2:00 PM – 4:30 PM',
    title: 'Kids Fun Zone: Face Painting & Lawn Games',
    location: 'Family Meadow',
    description: 'Free creative crafts, interactive games, and face painting for children.',
    type: 'kids',
  },
  {
    id: 'sch-9b',
    day: 'sat',
    time: '5:00 PM – 7:00 PM',
    title: 'Early Evening Artisan Showcase & Live String Ensemble',
    location: 'Central Pavilion Lawn & Food Row',
    description: 'Ambient strings, illuminated artisan exhibits, and outdoor dining through the 7:00 PM closing bell.',
    type: 'entertainment',
  },

  // Sunday Program (9:00 AM – 7:00 PM)
  {
    id: 'sch-10',
    day: 'sun',
    time: '7:30 AM – 8:45 AM',
    title: 'Morning Vendor Arrival & Restock',
    location: 'Marketplace Zones',
    description: 'Restocking merchandise and setting up prior to 9:00 AM Sunday opening.',
    type: 'market',
  },
  {
    id: 'sch-11',
    day: 'sun',
    time: '9:00 AM – 12:00 PM',
    title: 'Makers Market & Gourmet Brunch Gathering',
    location: 'Food Truck Row & Promenade',
    description: 'Artisan pastries, breakfast street food, espresso carts, and fresh local goods starting at 9:00 AM.',
    type: 'food',
  },
  {
    id: 'sch-12',
    day: 'sun',
    time: '1:00 PM – 3:30 PM',
    title: 'Community Cultural Dance & Music Celebration',
    location: 'Amphitheater Stage',
    description: 'Showcasing diverse local cultural dance troupes, percussionists, and vocalists.',
    type: 'entertainment',
  },
  {
    id: 'sch-13',
    day: 'sun',
    time: '4:30 PM – 7:00 PM',
    title: 'Festival Awards, Community Raffles & Finale',
    location: 'Central Plaza Stage',
    description: 'Best in Show booth awards, customer raffle giveaways, and closing celebration wrapping up at 7:00 PM.',
    type: 'entertainment',
  },
];

export const VENDOR_SPOTLIGHTS: VendorSpotlight[] = [
  {
    id: 'v-1',
    businessName: 'Botanicals & Herbal Apothecary',
    owner: 'Elena Vance',
    category: 'Beauty & Wellness',
    bio: 'Crafting small-batch cold-pressed botanical soaps, soothing lavender balms, and clean soy candles using organic flora.',
    products: 'Lavender Honey Soaps, Cedarwood Soy Candles, Herbal Bath Soaks',
    image: vendorBotanicalImg,
    boothType: 'Standard 10×10 Space',
    quote: 'The festival crowd has the best community warmth and appreciation for handmade goods!',
  },
  {
    id: 'v-2',
    businessName: 'Smoke & Spice Artisanal BBQ',
    owner: 'Marcus & Tara Reed',
    category: 'Gourmet Food Truck',
    bio: 'Slow-smoked hickory brisket, applewood pulled pork, and signature burnt-end sliders served with homemade tangy slaw.',
    products: 'Smoked Brisket Platters, Peach BBQ Wings, Gourmet Mac & Cheese',
    image: vendorFoodTruckImg,
    boothType: 'Gourmet Food Truck Space',
    quote: 'Food Truck Row along the promenade is buzzing with energy all day long!',
  },
  {
    id: 'v-3',
    businessName: 'Artisan Silver & Gem Studio',
    owner: 'Nadia Solis',
    category: 'Jewelry & Metalsmithing',
    bio: 'Hand-forged recycled sterling silver jewelry set with responsibly sourced raw turquoise, crystals, and moonstones.',
    products: 'Stacker Gem Rings, Artisan Stone Pendants, Hammered Silver Cuffs',
    image: vendorJewelryImg,
    boothType: 'Corner / Main Street Booth',
    quote: 'Being on the corner gives double the visibility — visitors can browse from two walkways.',
  },
  {
    id: 'v-4',
    businessName: 'Heritage Wood & Resin Creations',
    owner: 'David Miller',
    category: 'Art & Home Decor',
    bio: 'Reclaimed walnut, oak, and epoxy charcuterie boards, live-edge serving platters, and custom handmade kitchen heirloom pieces.',
    products: 'Charcuterie Boards, Hand-carved Spoons, Coaster Sets',
    image: vendorWoodcraftImg,
    boothType: 'Double 10×20 Space',
    quote: 'The spacious setup gives visitors ample room to touch and admire the natural wood craftsmanship.',
  },
];

export interface FaqItem {
  q: string;
  a: string;
  category: 'Registration & Pricing' | 'Booth Setup & Logistics' | 'Electrical & Utilities' | 'Food Trucks & Health Permits' | 'Taxes, Permits & 50-State Rules' | 'Payments & Invoicing' | 'Attendee & General Info';
  keywords: string[];
}

export const VENDOR_POLICIES_FAQ: FaqItem[] = [
  // 1. Registration & Pricing
  {
    category: 'Registration & Pricing',
    q: 'How do I apply for a vendor booth space and what is the approval process?',
    a: 'Vendors can submit an application online via our Vendor Booking Portal. Applications are juried on a rolling basis to ensure category balance and prevent product oversaturation. Once reviewed (typically within 24–48 hours), approved vendors receive an official booking confirmation email with an itemized invoice and booth placement assignment.',
    keywords: ['vendor application', 'booth registration', 'jury process', 'artisan festival booking', 'small business pop-up']
  },
  {
    category: 'Registration & Pricing',
    q: 'Can out-of-town and traveling vendors apply?',
    a: 'Yes! We actively welcome traveling artisans, craftspeople, independent brands, and food trucks from across the region and beyond. Our operations team provides assistance with transient seller licenses, local tax guidelines, and dedicated load-in logistics.',
    keywords: ['out of town vendors', 'traveling artisans', 'craft fair circuit', 'vendor registration']
  },
  {
    category: 'Registration & Pricing',
    q: 'What booth sizes and spaces are available, and where do I view pricing?',
    a: 'We offer Standard 10×10 Canopy Spaces, Double 10×20 Artisan Pavilions, Corner / High-Footfall Main Street Booths, Extra Large 20×20 Pavilions, and Gourmet Food Truck Bays. Current daily rates and total multi-day calculations for Friday, Saturday, and Sunday are displayed live inside the Vendor Application dialog when selecting your space.',
    keywords: ['booth sizes', '10x10 booth', '10x20 double booth', 'food truck space', 'vendor application pricing']
  },
  {
    category: 'Registration & Pricing',
    q: 'What is the refund, transfer, and inclement weather cancellation policy?',
    a: 'This is an outdoor rain-or-shine festival event. Cancellations requested in writing at least 14 days prior to opening day receive a 100% credit transfer toward any upcoming event edition or an 80% refund. In the rare event of extreme severe weather or municipal force majeure orders, full credit vouchers are issued to all vendors.',
    keywords: ['refund policy', 'cancellation terms', 'rain or shine', 'weather policy', 'vendor credit transfer']
  },

  // 2. Booth Setup & Logistics
  {
    category: 'Booth Setup & Logistics',
    q: 'What are the mandatory canopy, wind safety, and tent weight requirements?',
    a: 'All 10×10 and 10×20 commercial pop-up canopy structures MUST be anchored with a certified minimum of 25–40 lbs of secure weight per tent leg (sandbags, cast-iron canopy plates, or water weight barrels). Ground staking into asphalt or brick plaza walkways is prohibited to protect municipal grounds. All tent fabrics should meet CPAI-84 or NFPA 701 fire retardant ratings.',
    keywords: ['tent weights', 'canopy safety', 'wind standards', 'fire retardant tent', '40 lbs per leg', 'sandbags']
  },
  {
    category: 'Booth Setup & Logistics',
    q: 'What equipment and furniture items are included with my booth reservation?',
    a: 'Each reserved space includes 1 sturdy commercial 6-foot folding table and 2 heavy-duty event chairs. Double 10×20 spaces include 2 tables and 4 chairs. Vendors are responsible for bringing their own white/commercial canopy tent, weather sidewalls, tablecloths/linens, visual displays, and signage.',
    keywords: ['included equipment', 'tables and chairs', 'folding table', 'display furniture', 'canopy provided']
  },
  {
    category: 'Booth Setup & Logistics',
    q: 'What is the daily load-in, staging, vehicle access, and restock schedule?',
    a: 'Drive-up load-in is open daily between 7:30 AM and 8:45 AM Friday through Sunday ahead of the 9:00 AM public opening. Festival marketplace hours run 9:00 AM – 7:00 PM each day. Vehicles must unload at the designated loading dock bays and be moved to the complimentary vendor parking lot before opening.',
    keywords: ['load-in schedule', 'vendor parking', 'staging access', 'morning restock', 'drive-up unloading']
  },
  {
    category: 'Booth Setup & Logistics',
    q: 'Is there overnight security provided for multi-day reservations?',
    a: 'Yes. Dedicated, licensed overnight security guards patrol the gated perimeter and grounds from 7:00 PM closing until morning reopening. Multi-day vendors may safely leave securely weighted tent frames, sturdy tables, and heavy fixtures overnight. We recommend taking valuable cash boxes, credit card terminals, and fine jewelry with you overnight.',
    keywords: ['overnight security', 'multi-day vendor', 'guarded grounds', 'perimeter patrol', 'merchandise safety']
  },

  // 3. Electrical & Utilities
  {
    category: 'Electrical & Utilities',
    q: 'Is electrical power available at artisan booths and food truck spaces?',
    a: 'Standard artisan booths are non-powered outdoor spaces, with optional 20-Amp 110V dedicated electrical drops available upon request during application. Food trucks and culinary trailers are provided with dedicated 30-Amp or 50-Amp NEMA connections upon request. Ultra-quiet inverter generators (<60 dB) are permitted with prior notification.',
    keywords: ['festival electricity', '20 amp power', 'generator rules', 'quiet inverter', '50 amp hookup']
  },
  {
    category: 'Electrical & Utilities',
    q: 'Is high-speed Wi-Fi available for point-of-sale (POS) card processing?',
    a: 'Yes, complimentary high-bandwidth vendor Wi-Fi networks (with WPA3 encryption) are provided throughout the festival grounds to ensure seamless Square, Clover, Shopify POS, Stripe, and Apple Pay transactions. We also recommend maintaining standard cellular data as a backup during peak festival attendance.',
    keywords: ['festival wifi', 'POS internet', 'Square card reader', 'Shopify POS', 'cellular backup']
  },

  // 4. Food Trucks & Health Permits
  {
    category: 'Food Trucks & Health Permits',
    q: 'What health department permits and food safety certifications are required for food vendors?',
    a: 'All food trucks, mobile concessions, and prepared culinary vendors must hold a valid State/County Temporary Food Service Establishment (TFSE) permit and at least one Certified Food Protection Manager (ServSafe or equivalent). Vendors must maintain calibrated digital food thermometers, proper hot/cold holding equipment, and an accessible warm water handwashing station.',
    keywords: ['food truck permit', 'health department inspection', 'ServSafe certification', 'handwashing station', 'TFSE permit']
  },
  {
    category: 'Food Trucks & Health Permits',
    q: 'What are the fire safety and grease/greywater disposal rules for cooking trucks?',
    a: 'All food trucks with commercial frying or griddle equipment must carry a certified, inspected Class K wet-chemical fire extinguisher and a 2A-10BC dry chemical extinguisher. Dumping oil, grease, or greywater into municipal storm drains or onto park soil is strictly illegal. Dedicated grease bins and greywater recovery tanks are located behind Food Truck Row.',
    keywords: ['fire extinguisher Class K', 'greywater disposal', 'grease container', 'food truck fire inspection']
  },
  {
    category: 'Food Trucks & Health Permits',
    q: 'Can homemade cottage food producers sell under state cottage food laws?',
    a: 'Yes! Artisans selling non-potentially hazardous baked goods, dried herbs, fruit jams, granola, and honey under State Cottage Food Laws are welcome. All packages must be properly labeled with all ingredients, net weight, producer name, contact info, and the mandatory cottage food disclosure statement.',
    keywords: ['cottage food law', 'homemade baking', 'jam labeling', 'cottage bakery', 'artisan honey']
  },

  // 5. Taxes, Permits & 50-State Rules
  {
    category: 'Taxes, Permits & 50-State Rules',
    q: 'How does sales tax work for local and out-of-state vendors selling at the festival?',
    a: 'Vendors selling tangible merchandise must collect and remit state and local sales tax according to state department of revenue requirements. The festival provides each vendor with the official State Special Event Sales Tax Return (or Transient Vendor Form) at check-in. Out-of-state vendors can easily file single-event returns or utilize their existing resale certificates.',
    keywords: ['sales tax compliance', 'transient vendor tax', 'special event tax return', 'out of state sales tax', 'resale certificate']
  },
  {
    category: 'Taxes, Permits & 50-State Rules',
    q: 'Do I need a general liability insurance certificate (COI)?',
    a: 'We strongly recommend all participating businesses maintain a commercial general liability insurance policy ($1,000,000 occurrence / $2,000,000 aggregate) listing the festival operations as an additional insured. Affordable single-weekend event liability insurance is available through providers like ACT Insurance or FLIP.',
    keywords: ['event insurance', 'certificate of insurance', 'COI requirements', 'ACT insurance', 'FLIP vendor insurance']
  },

  // 6. Payments & Invoicing
  {
    category: 'Payments & Invoicing',
    q: 'What payment methods can vendors use to pay for booth reservations?',
    a: 'Payments for booth reservations are processed through E-Transfer. After submitting your vendor application, your total calculated fee and E-Transfer recipient instructions are shown directly in your confirmation dialog and Application Tracker, where you can submit your security question answer or confirmation details for verification.',
    keywords: ['booth fee payment', 'e-transfer payment', 'vendor invoice', 'security question answer', 'booth reservation']
  },
  {
    category: 'Payments & Invoicing',
    q: 'How do I check my application status and access my reservation details?',
    a: 'Use the Track Application dialog with your Reference ID and registered email to view your assigned booth tier, calculated total fee, review approval status, and E-Transfer payment verification status anytime.',
    keywords: ['track application', 'vendor portal', 'receipt download', 'booth reservation status']
  },

  // 7. Attendee & General Info
  {
    category: 'Attendee & General Info',
    q: 'Is festival admission free for the public and attendees?',
    a: 'Yes! General admission to the festival grounds, artisan village, mainstage music concerts, and cultural performances is 100% free for all attendees and families. Complimentary Attendee RSVP passes are available online to receive event map updates, schedule alerts, and festival prize raffle tickets.',
    keywords: ['free admission festival', 'free family event', 'free concert admission', 'attendee RSVP pass', 'festival tickets']
  },
  {
    category: 'Attendee & General Info',
    q: 'Are pets and service animals permitted on the festival grounds?',
    a: 'Well-behaved, leashed pets (6-foot non-retractable leash) and certified service animals are warmly welcomed in outdoor marketplace walkways, artisan lawns, and park zones. Pet water hydration stations are stationed throughout the grounds. Owners are responsible for cleaning up after their pets.',
    keywords: ['pet friendly festival', 'dogs allowed', 'leashed pets', 'service animals', 'dog friendly craft market']
  },
  {
    category: 'Attendee & General Info',
    q: 'What parking and public transit options are available for attendees?',
    a: 'Free community parking is available in surrounding fairgrounds lots and designated event parking garages, with complimentary accessible ADA shuttles running continuously to the main entrance gates. Bike racks and designated rideshare (Uber/Lyft) pickup drop-off points are located at the North Gate.',
    keywords: ['festival parking', 'free parking lot', 'ADA accessible parking', 'rideshare dropoff', 'shuttle service']
  },
  {
    category: 'Attendee & General Info',
    q: 'What accessibility accommodations (ADA compliance) are in place?',
    a: 'The entire festival grounds, artisan aisles, restrooms, and food truck concourses feature paved, wide, level pathways designed for full ADA wheelchair, scooter, and stroller accessibility. Reserved ADA parking spaces are situated adjacent to the primary entrance pavilion.',
    keywords: ['ADA accessible festival', 'wheelchair friendly', 'accessible restrooms', 'stroller friendly', 'paved walkways']
  }
];

