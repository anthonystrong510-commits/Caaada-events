import React from 'react';
import {
  Sun,
  MapPin,
  Music,
  UtensilsCrossed,
  ShoppingBag,
  Ticket,
  Smile,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ATTENDEE_EXPERIENCES, EVENT_CONFIG } from '../data/festivalData';

interface AttendeeExperienceProps {
  onOpenAttendeeModal: () => void;
}

export const AttendeeExperience: React.FC<AttendeeExperienceProps> = ({ onOpenAttendeeModal }) => {
  const leadExperience = ATTENDEE_EXPERIENCES[0];
  const secondaryExperiences = ATTENDEE_EXPERIENCES.slice(1);

  return (
    <section id="experience" className="py-20 bg-white border-b border-[#E8E2D6] text-[#3D3A30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 pb-8 border-b border-[#E8E2D6]">
          <div className="max-w-2xl space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#5A5A40]">
              Event Experience &middot; Open-Air Grounds
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30] [text-wrap:balance]">
              Designed for Unhurried Discovery
            </h2>
          </div>
          <p className="text-[#6B6658] text-sm sm:text-base leading-relaxed max-w-md">
            Wander shaded promenades, meet passionate craftspeople face to face, share a picnic on the lawn, and enjoy live performances across three inviting days.
          </p>
        </div>

        {/* Asymmetric Editorial Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Lead 2-column feature card */}
          {leadExperience && (
            <div className="md:col-span-2 bg-[#FDFBF7] rounded-[28px] overflow-hidden border border-[#E8E2D6] flex flex-col sm:flex-row group">
              <div className="relative sm:w-1/2 min-h-[240px] overflow-hidden bg-[#E6E4D9]">
                <img
                  src={leadExperience.image}
                  alt={leadExperience.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:hidden" />
              </div>
              <div className="sm:w-1/2 p-7 sm:p-8 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5A5A40]">
                    01. {leadExperience.tagline}
                  </div>
                  <h3 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#3D3A30] leading-snug">
                    {leadExperience.title}
                  </h3>
                  <p className="text-sm text-[#6B6658] leading-relaxed">
                    {leadExperience.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8E2D6] flex items-center gap-2 text-xs font-semibold text-[#5A5A40]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{leadExperience.perk}</span>
                </div>
              </div>
            </div>
          )}

          {/* Remaining 5 experience cards */}
          {secondaryExperiences.map((exp, idx) => (
            <div
              key={exp.id}
              className="bg-[#FDFBF7] rounded-[28px] overflow-hidden border border-[#E8E2D6] hover:border-[#5A5A40]/45 transition-colors flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden bg-[#E6E4D9]">
                <img
                  src={exp.image}
                  alt={exp.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E8E2D6] block mb-0.5">
                    0{idx + 2}. {exp.tagline}
                  </span>
                  <h3 className="font-serif italic font-bold text-lg text-white leading-snug">
                    {exp.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-[#6B6658] leading-relaxed">
                  {exp.description}
                </p>
                <div className="pt-3 border-t border-[#E8E2D6] flex items-center gap-2 text-xs font-semibold text-[#5A5A40]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{exp.perk}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Gathering Callout */}
        <div className="bg-[#F0EBE0] rounded-[32px] p-8 sm:p-12 border border-[#E8E2D6] mb-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-xl">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#5A5A40]">
                Free Community Admission &middot; Open Grounds
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-[#3D3A30]">
                A Gathering for Neighbors, Families, Foodies &amp; Art Lovers
              </h3>
              <p className="text-[#6B6658] text-sm sm:text-base leading-relaxed">
                Whether you&apos;re browsing handcrafted jewelry, sharing a picnic basket on the lawn with friends, sampling slow-smoked BBQ, or watching live craft demonstrations, {EVENT_CONFIG.name} welcomes everyone.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAttendeeModal}
                  className="px-7 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs text-white bg-[#5A5A40] hover:bg-[#464632] shadow-sm transition-all inline-flex items-center gap-2.5 cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-[#F0EBE0]" />
                  <span>Claim Your Free Visitor Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0 lg:max-w-md">
              <div className="bg-white/90 p-5 rounded-[22px] border border-[#E8E2D6] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                  <Smile className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-[#3D3A30]">Family &amp; Pet Friendly</h4>
                  <p className="text-xs text-[#6B6658] mt-0.5">Open lawns with space for strollers, blankets, and leashed pets.</p>
                </div>
              </div>

              <div className="bg-white/90 p-5 rounded-[22px] border border-[#E8E2D6] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-[#3D3A30]">Live Amphitheater</h4>
                  <p className="text-xs text-[#6B6658] mt-0.5">Continuous acoustic sets, jazz ensembles, and live performers.</p>
                </div>
              </div>

              <div className="bg-white/90 p-5 rounded-[22px] border border-[#E8E2D6] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-[#3D3A30]">100+ Artisans</h4>
                  <p className="text-xs text-[#6B6658] mt-0.5">Meet independent craftspeople and local small businesses.</p>
                </div>
              </div>

              <div className="bg-white/90 p-5 rounded-[22px] border border-[#E8E2D6] flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#F0EBE0] text-[#5A5A40] flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-[#3D3A30]">Gourmet Food Trucks</h4>
                  <p className="text-xs text-[#6B6658] mt-0.5">Fresh street cuisine, artisan baked goods, and craft drinks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Essentials Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FDFBF7] p-6 rounded-[24px] border border-[#E8E2D6]">
            <Ticket className="w-5 h-5 text-[#5A5A40] mb-3" />
            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] mb-1">100% Free Entry</h4>
            <p className="text-xs text-[#6B6658] leading-relaxed">
              No gate fees required. Arrive with friends and family to explore the open grounds.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-[24px] border border-[#E8E2D6]">
            <MapPin className="w-5 h-5 text-[#5A5A40] mb-3" />
            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] mb-1">Ample Parking</h4>
            <p className="text-xs text-[#6B6658] leading-relaxed">
              Convenient visitor surface lots and accessible drop-off areas adjacent to entrance gates.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-[24px] border border-[#E8E2D6]">
            <Smile className="w-5 h-5 text-[#5A5A40] mb-3" />
            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] mb-1">Accessible Walkways</h4>
            <p className="text-xs text-[#6B6658] leading-relaxed">
              Wide, paved pathways welcoming strollers, wheelchairs, and leashed dogs throughout.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-[24px] border border-[#E8E2D6]">
            <Sun className="w-5 h-5 text-[#5A5A40] mb-3" />
            <h4 className="font-serif italic font-bold text-lg text-[#3D3A30] mb-1">Scenic Picnic Lawn</h4>
            <p className="text-xs text-[#6B6658] leading-relaxed">
              Bring a lawn blanket or folding chairs to relax on the grass and enjoy live sets.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
