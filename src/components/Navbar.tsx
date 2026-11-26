import React, { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';
import { EVENT_CONFIG } from '../data/festivalData';

interface NavbarProps {
  onOpenAttendeeModal?: () => void;
  onScrollToVendorBooking?: () => void;
  onOpenVendorModal?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-xs border-b border-[#E8E2D6] text-[#3D3A30] py-3'
          : 'bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-[#E8E2D6]/70 text-[#3D3A30] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center sm:justify-start">
        <a
          href="#"
          className="inline-flex items-center gap-2.5 group whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5A5A40] rounded-md"
        >
          <span className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Sun className="w-4 h-4 text-[#F0EBE0]" />
          </span>
          <span className="font-serif italic font-bold text-lg sm:text-xl text-[#3D3A30] tracking-tight whitespace-nowrap shrink-0">
            {EVENT_CONFIG.shortName}
          </span>
        </a>
      </div>
    </header>
  );
};
