import React from 'react';
import { Store, Mail, MapPin, ArrowUp, ArrowRight, Ticket, Sun, Search } from 'lucide-react';
import { EVENT_CONFIG, FESTIVAL_CONTACT_EMAIL, FESTIVAL_LOCATION } from '../data/festivalData';
import { FestivalConfigData } from '../types';

interface FooterProps {
  onScrollToVendorBooking: () => void;
  onOpenAttendeeModal: () => void;
  onOpenVendorModal?: () => void;
  onOpenTrackerModal?: () => void;
  onNavigateToAdmin?: () => void;
  festivalConfig?: FestivalConfigData;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToVendorBooking,
  onOpenAttendeeModal,
  onOpenVendorModal,
  onOpenTrackerModal,
  festivalConfig
}) => {
  const contactEmail = festivalConfig?.contactEmail?.trim() || FESTIVAL_CONTACT_EMAIL;
  const locationText = festivalConfig?.fullLocation?.trim() || FESTIVAL_LOCATION;
  const festName = festivalConfig?.name?.trim() || EVENT_CONFIG.name;
  const festDesc = festivalConfig?.description?.trim() || EVENT_CONFIG.description;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F0EBE0] text-[#3D3A30] border-t border-[#E8E2D6] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E8E2D6]">

          {/* Col 1: Brand & Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-bold shadow-xs">
                <Sun className="w-5 h-5 text-[#F0EBE0]" />
              </div>
              <div>
                <span className="font-serif italic font-bold text-lg text-[#3D3A30] block leading-tight">
                  {festName}
                </span>
                <span className="text-xs text-[#5A5A40] uppercase tracking-widest font-bold">
                  Community Marketplace &amp; Gathering
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6B6658] leading-relaxed max-w-md">
              {festDesc}
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#5A5A40]">
                <Mail className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span>
                  General Inquiries:{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="underline font-bold text-[#3D3A30] hover:text-[#5A5A40] font-mono"
                  >
                    {contactEmail}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#6B6658]">
                <MapPin className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span>{locationText}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Event Hours */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
              Festival Operating Hours
            </span>
            <ul className="space-y-2 text-xs tabular-nums">
              <li className="flex justify-between pb-1.5 border-b border-[#E8E2D6]">
                <span className="font-bold text-[#3D3A30]">Friday</span>
                <span className="text-[#5A5A40] font-semibold">9:00 AM – 7:00 PM</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-[#E8E2D6]">
                <span className="font-bold text-[#3D3A30]">Saturday</span>
                <span className="text-[#5A5A40] font-semibold">9:00 AM – 7:00 PM</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-[#E8E2D6]">
                <span className="font-bold text-[#3D3A30]">Sunday</span>
                <span className="text-[#5A5A40] font-semibold">9:00 AM – 7:00 PM</span>
              </li>
            </ul>
            <div className="text-[11px] text-[#7A7566] pt-1">
              Morning load-in runs 7:30 AM – 8:45 AM daily. Booths remain open 9:00 AM – 7:00 PM.
            </div>
          </div>

          {/* Col 3: Participation Actions */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] block">
              Passes &amp; Exhibitor Applications
            </span>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onOpenAttendeeModal}
                className="w-full py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] transition-colors text-left flex items-center justify-between shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#F0EBE0]" />
                  <span>Claim Free Visitor Pass</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenVendorModal || onScrollToVendorBooking}
                className="w-full py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-white hover:bg-[#FDFBF7] border border-[#E8E2D6] transition-colors text-left flex items-center justify-between shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#5A5A40]" />
                  <span>Apply for Vendor Space</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenTrackerModal && (
                <button
                  type="button"
                  onClick={onOpenTrackerModal}
                  className="w-full py-2.5 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-[#3D3A30] bg-transparent hover:bg-white/70 border border-[#D6CFBE] transition-colors text-left flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#5A5A40]" />
                    <span>Track Application</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="pt-2 text-[11px] text-[#7A7566] space-y-1">
              <div>&middot; Minimum 20–30 lbs canopy weights required per leg</div>
              <div>&middot; 1 Table &amp; 2 Chairs included with registration</div>
              <div>&middot; Overnight security on multi-day reservations</div>
            </div>
          </div>

        </div>

        {/* Quiet Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7566]">
          <div>
            &copy; {new Date().getFullYear()} {festName}. All rights reserved.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#5A5A40] hover:text-white hover:bg-[#5A5A40] border border-[#E8E2D6] transition-colors text-xs font-semibold cursor-pointer"
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
