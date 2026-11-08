import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  LogIn,
  GraduationCap,
  Download,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PublicHeaderProps {
  onOpenAdmissionModal: () => void;
  onOpenStatusModal: () => void;
  onOpenProspectusModal: () => void;
  onOpenPortal: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  onOpenAdmissionModal,
  onOpenStatusModal,
  onOpenProspectusModal,
  onOpenPortal,
  activeNav,
  setActiveNav,
}) => {
  const { settings, currentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'মূলপাতা' },
    { id: 'programs', label: 'শিক্ষাধারা' },
    { id: 'methodology', label: 'একাডেমিক পদ্ধতি' },
    { id: 'admission', label: 'ভর্তি তথ্য' },
    { id: 'notices', label: 'নোটিশ ও ফলাফল' },
    { id: 'gallery', label: 'গ্যালারি' },
    { id: 'about', label: 'আমাদের সম্পর্কে' },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* 1. Slim Chocolate Utility Strip (#2E2017) */}
      <div className="bg-[#2E2017] text-[#E9D4B3] text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#984710]" />
              <span className="tabular-nums">{settings.phone1}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#984710]" />
              <span>{settings.email}</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-[#E9D4B3]" />
              <span>{settings.officeHoursBn}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenStatusModal}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px] underline underline-offset-2"
            >
              <Search className="w-3 h-3" />
              <span>আবেদন ট্র্যাকিং</span>
            </button>
            <span className="text-[#534231]">|</span>
            <span className="text-[11px] bg-[#984710]/30 px-2 py-0.5 rounded text-[#FFFBF3]">
              ভর্তি সেশন {settings.activeSessionYear}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Cream Navigation Bar (#FCF8EF) */}
      <div className="bg-[#FCF8EF] border-b border-[#E9D4B3]/60 px-4 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark & Crest */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            <img
              src={settings.logoUrl}
              alt={settings.academyNameBn}
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full border border-[#E9D4B3] bg-white p-0.5 shadow-xs"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#2E2017] group-hover:text-[#984710] transition-colors leading-tight">
                {settings.academyNameBn}
              </h1>
              <p className="text-[11px] sm:text-xs text-[#984710] font-medium tracking-wide">
                {settings.taglineBn}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#2E2017]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap transition-colors py-1 cursor-pointer hover:text-[#984710] relative ${
                  activeNav === item.id
                    ? 'text-[#984710] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#984710]'
                    : 'text-[#2E2017]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAdmissionModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs transition-all hover:shadow cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>ভর্তি আবেদন</span>
            </button>

            <button
              onClick={onOpenPortal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2E2017] hover:bg-[#1a120c] text-[#FFFBF3] text-xs sm:text-sm font-medium rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#E9D4B3]" />
              <span>পোর্টাল লগইন</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAdmissionModal}
              className="px-2.5 py-1 bg-[#984710] text-white text-xs font-semibold rounded-full"
            >
              ভর্তি
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#2E2017] hover:bg-[#E9D4B3]/40"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FCF8EF] border-b border-[#E9D4B3] px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#E9D4B3]/50">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-sm py-1.5 px-2 rounded-md transition-colors ${
                  activeNav === item.id
                    ? 'bg-[#984710] text-white font-medium'
                    : 'text-[#2E2017] hover:bg-[#E9D4B3]/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#2E2017] text-[#FFFBF3] text-sm font-medium rounded-full"
            >
              <LogIn className="w-4 h-4 text-[#E9D4B3]" />
              <span>অফিস / শিক্ষক / অভিভাবক পোর্টাল</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProspectusModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 border border-[#984710] text-[#984710] text-sm font-medium rounded-full bg-white"
            >
              <Download className="w-4 h-4" />
              <span>পরিচিতি ডাউনলোড (Prospectus)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
