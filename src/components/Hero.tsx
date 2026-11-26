import React from 'react';
import {
  MapPin,
  Ticket,
  ArrowRight,
  Compass,
  Users,
  Clock,
  Store
} from 'lucide-react';
import { EVENT_CONFIG, FESTIVAL_CONTACT_EMAIL, FESTIVAL_LOCATION } from '../data/festivalData';
import heroPromenadeImg from '../assets/images/hero_festival_promenade_1795729714560.jpg';
import liveStageImg from '../assets/images/festival_live_stage_1795729714383.jpg';
import vendorFoodTruckImg from '../assets/images/vendor_food_truck_1787757253971.jpg';

interface HeroProps {
  onOpenAttendeeModal: () => void;
  onScrollToVendorBooking: () => void;
  onOpenVendorModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAttendeeModal,
  onScrollToVendorBooking,
  onOpenVendorModal
}) => {
  const scrollToExperience = () => {
    const el = document.getElementById('experience');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden bg-[#FDFBF7] text-[#3D3A30] border-b border-[#E8E2D6]">
      <div className="absolute inset-0 opacity-35 bg-grid-natural pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Split Editorial Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">

          {/* Left Column: Editorial Headline, Event Info & Primary CTA */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 py-2">
            <div className="space-y-6">
              {/* Unboxed Editorial Metadata Kicker */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold tracking-wider uppercase text-[#5A5A40]">
                <span>{EVENT_CONFIG.locationBadge}</span>
                <span aria-hidden="true" className="text-[#8A8576]">&middot;</span>
                <span>{EVENT_CONFIG.durationBadge}</span>
                <span aria-hidden="true" className="text-[#8A8576]">&middot;</span>
                <span className="text-[#3D3A30]">{EVENT_CONFIG.admissionBadge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif italic font-bold tracking-tight text-[#3D3A30] leading-[1.1] max-w-2xl [text-wrap:balance]">
                An Open-Air Gathering for{' '}
                <span className="text-[#5A5A40]">
                  Makers, Culinary Craft &amp; Live Music.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B6658] font-normal leading-relaxed max-w-2xl">
                {EVENT_CONFIG.description} Stroll shaded promenades lined with independent artisans, sample gourmet street cuisine, and relax on the festival lawn to continuous live acoustic sets.
              </p>

              {/* Primary CTA + Secondary Guide Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  id="hero-attendee-pass-cta"
                  type="button"
                  onClick={onOpenAttendeeModal}
                  className="px-7 py-3.5 rounded-full font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] shadow-sm transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-[#F0EBE0]" />
                  <span>Get Free Visitor Pass</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                <button
                  id="hero-explore-experience-cta"
                  type="button"
                  onClick={scrollToExperience}
                  className="px-6 py-3.5 rounded-full font-bold uppercase tracking-wider text-[#3D3A30] bg-white hover:bg-[#F0EBE0] border border-[#E8E2D6] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#5A5A40]" />
                  <span>Explore Festival Guide</span>
                </button>
              </div>

              {/* Quiet Exhibitor Bridge */}
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-[#6B6658]">
                <span>Hosting a craft booth or food truck?</span>
                <button
                  id="hero-apply-vendor-btn"
                  type="button"
                  onClick={onOpenVendorModal || onScrollToVendorBooking}
                  className="font-bold text-[#5A5A40] hover:text-[#3D3A30] underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Apply for Vendor Space</span>
                </button>
              </div>
            </div>

            {/* Clean Hairline Venue & Operating Summary */}
            <div className="pt-6 border-t border-[#E8E2D6] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6B6658]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-[#3D3A30]">{FESTIVAL_LOCATION}</span>
                  <span>Paved promenade, lawn stage &amp; free adjacent parking</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-[#3D3A30]">Three-Day Festival Program</span>
                  <span>Inquiries: <span className="font-mono text-[#5A5A40]">{FESTIVAL_CONTACT_EMAIL}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Photo Composition */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            <div className="relative rounded-[28px] overflow-hidden border border-[#5A5A40] shadow-[6px_6px_0px_#5A5A40] bg-[#E6E4D9] flex-1 min-h-[280px] group">
              <img
                src={heroPromenadeImg}
                alt="Sunlit outdoor artisan marketplace promenade with white vendor canopies"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-6 text-white flex items-end justify-between gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#E8E2D6] block mb-1">
                    Open-Air Marketplace
                  </span>
                  <h2 className="font-serif italic font-bold text-white text-xl leading-snug">
                    Curated Crafts, Music &amp; Dining
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-[#E8E2D6] block">Entry</span>
                  <span className="text-2xl font-bold font-serif italic text-white">Free</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="relative rounded-[20px] overflow-hidden border border-[#E8E2D6] bg-[#E6E4D9] h-32 group">
                <img
                  src={vendorFoodTruckImg}
                  alt="Gourmet food trucks serving along the dining lawn"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                  <span className="text-xs font-bold tracking-wide text-white">Food Truck Alley</span>
                </div>
              </div>

              <div className="relative rounded-[20px] overflow-hidden border border-[#E8E2D6] bg-[#E6E4D9] h-32 group">
                <img
                  src={liveStageImg}
                  alt="Live acoustic music stage on the festival lawn at golden hour"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                  <span className="text-xs font-bold tracking-wide text-white">Amphitheater Stage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Event Overview Strip */}
        <div className="mt-12 pt-8 border-t border-[#E8E2D6] grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30] tabular-nums">100+</div>
            <div className="text-xs font-semibold text-[#5A5A40] mt-0.5">Independent Artisans</div>
            <div className="text-xs text-[#6B6658] mt-1">Handmade goods, ceramics, textiles &amp; fine art</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30] tabular-nums">18+</div>
            <div className="text-xs font-semibold text-[#5A5A40] mt-0.5">Culinary &amp; Food Trucks</div>
            <div className="text-xs text-[#6B6658] mt-1">Street food, craft coffee, bakery &amp; desserts</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30] tabular-nums">3 Days</div>
            <div className="text-xs font-semibold text-[#5A5A40] mt-0.5">Continuous Live Stage</div>
            <div className="text-xs text-[#6B6658] mt-1">Acoustic sessions, jazz sets &amp; cultural dance</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-[#3D3A30] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#5A5A40]" />
              <span>All Ages</span>
            </div>
            <div className="text-xs font-semibold text-[#5A5A40] mt-0.5">Family &amp; Pet Friendly</div>
            <div className="text-xs text-[#6B6658] mt-1">Accessible walkways, shaded seating &amp; free entry</div>
          </div>
        </div>

      </div>
    </section>
  );
};
